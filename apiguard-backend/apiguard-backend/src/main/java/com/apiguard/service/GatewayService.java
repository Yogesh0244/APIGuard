package com.apiguard.service;

import com.apiguard.entity.ApiKey;
import com.apiguard.entity.ApiResource;
import com.apiguard.exception.InvalidApiKeyException;
import com.apiguard.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

/**
 * The heart of the "gateway" simulation. A client calls:
 *   ANY /api/gateway/{apiName}/**   with header  X-API-KEY: ak_xxx
 *
 * This service:
 *   1. Validates the API key
 *   2. Enforces the daily rate limit (via RateLimiterService / Redis)
 *   3. Forwards the request to the real backend service's baseUrl
 *   4. Logs the outcome asynchronously for analytics
 */
@Service
@RequiredArgsConstructor
public class GatewayService {

    private final ApiKeyService apiKeyService;
    private final ApiResourceService apiResourceService;
    private final RateLimiterService rateLimiterService;
    private final RequestLogService requestLogService;
    private final RestTemplate restTemplate;

    public ResponseEntity<String> routeRequest(String apiName, String subPath, String rawApiKey,
                                                HttpMethod method, String body) {

        long startTime = System.currentTimeMillis();

        if (rawApiKey == null || rawApiKey.isBlank()) {
            throw new InvalidApiKeyException("Missing X-API-KEY header");
        }

        ApiKey apiKey = apiKeyService.findValidKeyOrThrow(rawApiKey);
        ApiResource resource = apiResourceService.findEntityByName(apiName);

        if (!resource.isActive()) {
            throw new ResourceNotFoundException("API '" + apiName + "' is currently disabled");
        }

        // 1. Rate limiting (throws RateLimitExceededException -> handled globally -> 429)
        rateLimiterService.checkAndIncrement(apiKey);

        // 2. Forward the request to the real backend service
        String targetUrl = resource.getBaseUrl() + (subPath.startsWith("/") ? subPath : "/" + subPath);

        int statusCode;
        String responseBody;
        try {
            HttpHeaders headers = new HttpHeaders();
            HttpEntity<String> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> upstreamResponse =
                    restTemplate.exchange(targetUrl, method, entity, String.class);

            statusCode = upstreamResponse.getStatusCode().value();
            responseBody = upstreamResponse.getBody();
        } catch (HttpStatusCodeException ex) {
            // upstream service responded with a non-2xx code; still log & relay it
            statusCode = ex.getStatusCode().value();
            responseBody = ex.getResponseBodyAsString();
        } catch (Exception ex) {
            statusCode = HttpStatus.BAD_GATEWAY.value();
            responseBody = "Upstream service unreachable: " + ex.getMessage();
        }

        long elapsed = System.currentTimeMillis() - startTime;

        // 3. Fire-and-forget audit log (does not block the response)
        requestLogService.logAsync(apiKey, resource, subPath, method.name(), statusCode, elapsed);

        return ResponseEntity.status(statusCode).body(responseBody);
    }
}
