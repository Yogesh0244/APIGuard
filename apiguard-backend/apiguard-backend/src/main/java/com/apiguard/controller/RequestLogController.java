package com.apiguard.controller;

import com.apiguard.entity.RequestLog;
import com.apiguard.repository.RequestLogRepository;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Lets the frontend show the raw request log table with basic filters,
 * e.g. GET /api/logs/by-key/5  or  GET /api/logs/by-api/2
 */
@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
@Tag(name = "Request Logs", description = "Raw request log records")
public class RequestLogController {

    private final RequestLogRepository requestLogRepository;

    @GetMapping
    public ResponseEntity<List<RequestLog>> getAll() {
        return ResponseEntity.ok(requestLogRepository.findAll());
    }

    @GetMapping("/by-key/{apiKeyId}")
    public ResponseEntity<List<RequestLog>> byKey(@PathVariable Long apiKeyId) {
        return ResponseEntity.ok(requestLogRepository.findByApiKeyIdOrderByTimestampDesc(apiKeyId));
    }

    @GetMapping("/by-api/{apiResourceId}")
    public ResponseEntity<List<RequestLog>> byApi(@PathVariable Long apiResourceId) {
        return ResponseEntity.ok(requestLogRepository.findByApiResourceIdOrderByTimestampDesc(apiResourceId));
    }
}
