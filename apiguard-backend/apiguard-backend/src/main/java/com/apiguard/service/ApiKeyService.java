package com.apiguard.service;

import com.apiguard.dto.ApiKeyRequest;
import com.apiguard.dto.ApiKeyResponse;
import com.apiguard.entity.ApiKey;
import com.apiguard.entity.PlanType;
import com.apiguard.entity.User;
import com.apiguard.exception.ResourceNotFoundException;
import com.apiguard.repository.ApiKeyRepository;
import com.apiguard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;

/**
 * Handles generation and lifecycle of API Keys for developers.
 */
@Service
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final UserRepository userRepository;

    @Value("${apiguard.rate-limit.free-plan-daily-limit}")
    private int freePlanLimit;

    @Value("${apiguard.rate-limit.premium-plan-daily-limit}")
    private int premiumPlanLimit;

    private static final SecureRandom RANDOM = new SecureRandom();

    public ApiKeyResponse generateKey(String username, ApiKeyRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        int limit = request.getPlanType() == PlanType.PREMIUM ? premiumPlanLimit : freePlanLimit;

        ApiKey apiKey = ApiKey.builder()
                .keyValue(generateRawKey())
                .owner(user)
                .planType(request.getPlanType())
                .dailyLimit(limit)
                .active(true)
                .build();

        apiKeyRepository.save(apiKey);
        return toResponse(apiKey);
    }

    public List<ApiKeyResponse> getMyKeys(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return apiKeyRepository.findByOwner(user).stream().map(this::toResponse).toList();
    }

    public void revokeKey(String username, Long keyId) {
        ApiKey key = apiKeyRepository.findById(keyId)
                .orElseThrow(() -> new ResourceNotFoundException("API key not found"));

        if (!key.getOwner().getUsername().equals(username)) {
            throw new SecurityException("You cannot revoke a key you do not own");
        }

        key.setActive(false);
        apiKeyRepository.save(key);
    }

    public ApiKey findValidKeyOrThrow(String keyValue) {
        return apiKeyRepository.findByKeyValue(keyValue)
                .filter(ApiKey::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or revoked API key"));
    }

    private String generateRawKey() {
        byte[] bytes = new byte[24];
        RANDOM.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        return "ak_" + token;
    }

    private ApiKeyResponse toResponse(ApiKey key) {
        return ApiKeyResponse.builder()
                .id(key.getId())
                .keyValue(key.getKeyValue())
                .planType(key.getPlanType())
                .dailyLimit(key.getDailyLimit())
                .active(key.isActive())
                .createdAt(key.getCreatedAt())
                .build();
    }
}
