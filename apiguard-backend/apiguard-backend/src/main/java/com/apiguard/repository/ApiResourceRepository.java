package com.apiguard.repository;

import com.apiguard.entity.ApiResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApiResourceRepository extends JpaRepository<ApiResource, Long> {
    Optional<ApiResource> findByName(String name);
    boolean existsByName(String name);
}
