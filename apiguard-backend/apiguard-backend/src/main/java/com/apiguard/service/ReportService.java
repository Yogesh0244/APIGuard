package com.apiguard.service;

import com.apiguard.entity.UsageReport;
import com.apiguard.repository.RequestLogRepository;
import com.apiguard.repository.UsageReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Generates a daily usage report at midnight, summarising the previous
 * day's traffic. This demonstrates Spring's @Scheduled cron support and
 * gives the dashboard cheap historical data to render ("Monthly usage reports").
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final RequestLogRepository requestLogRepository;
    private final UsageReportRepository usageReportRepository;

    // Runs every day at 00:05 AM
    @Scheduled(cron = "0 5 0 * * *")
    public void generateDailyReport() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        LocalDateTime start = LocalDateTime.of(yesterday, LocalTime.MIN);
        LocalDateTime end = LocalDateTime.of(yesterday, LocalTime.MAX);

        long total = requestLogRepository.countByTimestampBetween(start, end);
        long failed = requestLogRepository.countByStatusCodeGreaterThanEqual(400);
        Double avgResponse = requestLogRepository.findAverageResponseTime();

        UsageReport report = UsageReport.builder()
                .reportDate(yesterday)
                .totalRequests(total)
                .failedRequests(failed)
                .averageResponseTimeMs(avgResponse != null ? avgResponse : 0.0)
                .generatedAt(LocalDateTime.now())
                .build();

        usageReportRepository.save(report);
        log.info("Generated daily usage report for {}: {} requests", yesterday, total);
    }
}
