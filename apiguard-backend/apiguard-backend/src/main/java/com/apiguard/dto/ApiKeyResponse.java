package com.apiguard.dto;

import com.apiguard.entity.PlanType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class ApiKeyResponse {
    private Long id;
    private String keyValue;
    private PlanType planType;
    private int dailyLimit;
    private boolean active;
    private LocalDateTime createdAt;
}
