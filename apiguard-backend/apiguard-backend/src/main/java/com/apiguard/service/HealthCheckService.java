package com.apiguard.service;

import com.apiguard.entity.ApiResource;
import com.apiguard.repository.ApiResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Background job that periodically pings every registered API's baseUrl
 * to mark it healthy / down, e.g. for a "✅ User API Healthy" style widget.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class HealthCheckService {

    private final ApiResourceRepository apiResourceRepository;
    private final RestTemplate restTemplate;

    // Runs every 5 minutes. Change to a cron expression if you prefer a fixed clock time.
    @Scheduled(fixedRate = 5 * 60 * 1000)
    public void checkAllApis() {
        List<ApiResource> apis = apiResourceRepository.findAll();
        log.info("Running scheduled health check for {} registered APIs", apis.size());

        for (ApiResource api : apis) {
            boolean healthy = pingApi(api.getBaseUrl());
            api.setHealthy(healthy);
            api.setLastCheckedAt(LocalDateTime.now());
            apiResourceRepository.save(api);

            log.info("{} -> {}", api.getName(), healthy ? "HEALTHY" : "DOWN");
        }
    }

    private boolean pingApi(String baseUrl) {
        try {
            restTemplate.getForEntity(baseUrl, String.class);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }
}
