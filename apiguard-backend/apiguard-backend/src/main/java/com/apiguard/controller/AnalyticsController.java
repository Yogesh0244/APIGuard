package com.apiguard.controller;

import com.apiguard.dto.AnalyticsSummaryResponse;
import com.apiguard.service.AnalyticsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Powers the React dashboard: total requests, failure rate, average
 * response time, per-API breakdown and a time series for line charts.
 */
@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Dashboard metrics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryResponse> summary(
            @RequestParam(defaultValue = "7") int daysBack) {
        return ResponseEntity.ok(analyticsService.getSummary(daysBack));
    }
}
