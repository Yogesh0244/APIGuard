package com.apiguard.dto;

import com.apiguard.entity.PlanType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApiKeyRequest {

    @NotNull
    private PlanType planType; // FREE or PREMIUM
}
