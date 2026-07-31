package com.apiguard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@Builder
public class AnalyticsSummaryResponse {
    private long totalRequests;
    private long failedRequests;
    private double averageResponseTimeMs;
    private Map<String, Long> requestsPerApi;     // API name -> count
    private Map<String, Long> requestsOverTime;   // date -> count
}
