package com.apiguard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class ApiResourceResponse {
    private Long id;
    private String name;
    private String baseUrl;
    private String description;
    private boolean active;
    private boolean healthy;
    private LocalDateTime lastCheckedAt;
}
