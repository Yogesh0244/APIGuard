package com.apiguard.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApiResourceRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String baseUrl;

    private String description;
}
