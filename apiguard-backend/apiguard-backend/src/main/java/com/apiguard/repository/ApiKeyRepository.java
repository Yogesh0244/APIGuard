package com.apiguard.repository;

import com.apiguard.entity.ApiKey;
import com.apiguard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {
    Optional<ApiKey> findByKeyValue(String keyValue);
    List<ApiKey> findByOwner(User owner);
    List<ApiKey> findByOwnerId(Long ownerId);
}
