package com.apiguard.service;

import com.apiguard.entity.ApiKey;
import com.apiguard.entity.ApiResource;
import com.apiguard.entity.RequestLog;
import com.apiguard.repository.RequestLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RequestLogService {

    private final RequestLogRepository requestLogRepository;

    /**
     * Persists a log entry asynchronously so it never adds latency to the
     * response the caller of the gateway is waiting for.
     */
    @Async
    public void logAsync(ApiKey apiKey, ApiResource resource, String endpoint,
                          String method, int statusCode, long responseTimeMs) {
        RequestLog log = RequestLog.builder()
                .apiKey(apiKey)
                .apiResource(resource)
                .endpoint(endpoint)
                .httpMethod(method)
                .statusCode(statusCode)
                .responseTimeMs(responseTimeMs)
                .build();

        requestLogRepository.save(log);
    }
}
