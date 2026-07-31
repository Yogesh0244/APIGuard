package com.apiguard.service;

import com.apiguard.dto.AnalyticsSummaryResponse;
import com.apiguard.repository.RequestLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Aggregates data from RequestLog to power the React analytics dashboard
 * (live charts, top APIs, failure rate, average latency, etc).
 */
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final RequestLogRepository requestLogRepository;

    public AnalyticsSummaryResponse getSummary(int daysBack) {
        long total = requestLogRepository.count();
        long failed = requestLogRepository.countByStatusCodeGreaterThanEqual(400);
        Double avgResponse = requestLogRepository.findAverageResponseTime();

        Map<String, Long> requestsPerApi = new LinkedHashMap<>();
        for (Object[] row : requestLogRepository.countRequestsGroupedByApi()) {
            String apiName = row[0] != null ? row[0].toString() : "unknown";
            Long count = (Long) row[1];
            requestsPerApi.put(apiName, count);
        }

        Map<String, Long> requestsOverTime = new LinkedHashMap<>();
        LocalDateTime since = LocalDateTime.now().minusDays(daysBack);
        for (Object[] row : requestLogRepository.countRequestsPerDaySince(since)) {
            requestsOverTime.put(String.valueOf(row[0]), (Long) row[1]);
        }

        return AnalyticsSummaryResponse.builder()
                .totalRequests(total)
                .failedRequests(failed)
                .averageResponseTimeMs(avgResponse != null ? avgResponse : 0.0)
                .requestsPerApi(requestsPerApi)
                .requestsOverTime(requestsOverTime)
                .build();
    }
}
