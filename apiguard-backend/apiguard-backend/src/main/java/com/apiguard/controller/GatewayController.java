package com.apiguard.controller;

import com.apiguard.service.GatewayService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * The actual "gateway" entry point. Public route (no JWT needed) because
 * external client apps authenticate with an X-API-KEY instead.
 *
 * Example:
 *   GET /api/gateway/user-service/users/42
 *   Header: X-API-KEY: ak_89XK2LQ91...
 *
 * -> gets routed to <registered baseUrl for "user-service">/users/42
 */
@RestController
@RequestMapping("/api/gateway")
@RequiredArgsConstructor
@Tag(name = "Gateway", description = "Public entry point that proxies requests to registered APIs")
public class GatewayController {

    private final GatewayService gatewayService;

    @RequestMapping(value = "/{apiName}/**", method = {
            RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,
            RequestMethod.DELETE, RequestMethod.PATCH
    })
    public ResponseEntity<String> proxy(@PathVariable String apiName,
                                         @RequestHeader(value = "X-API-KEY", required = false) String apiKey,
                                         @RequestBody(required = false) String body,
                                         org.springframework.web.util.UriComponentsBuilder uriBuilder,
                                         jakarta.servlet.http.HttpServletRequest request) {

        String fullPath = request.getRequestURI();
        String prefix = "/api/gateway/" + apiName;
        String subPath = fullPath.substring(fullPath.indexOf(prefix) + prefix.length());
        if (subPath.isBlank()) {
            subPath = "/";
        }

        HttpMethod method = HttpMethod.valueOf(request.getMethod());
        return gatewayService.routeRequest(apiName, subPath, apiKey, method, body);
    }
}
