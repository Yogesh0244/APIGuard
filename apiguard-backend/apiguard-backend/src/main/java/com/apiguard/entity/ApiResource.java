package com.apiguard.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Represents a backend API that has been registered on the platform
 * (e.g. User Service, Payment Service). The Gateway uses baseUrl to
 * forward incoming requests to the real service.
 */
@Entity
@Table(name = "api_resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String name;

    @NotBlank
    @Column(nullable = false)
    private String baseUrl;

    private String description;

    @Column(nullable = false)
    private boolean active;

    // Health monitoring fields
    @Column(nullable = false)
    private boolean healthy;

    private LocalDateTime lastCheckedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner; // admin who registered the API

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.healthy = true;
    }
}
