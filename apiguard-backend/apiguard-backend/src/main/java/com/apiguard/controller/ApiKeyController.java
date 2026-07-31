package com.apiguard.controller;

import com.apiguard.dto.ApiKeyRequest;
import com.apiguard.dto.ApiKeyResponse;
import com.apiguard.service.ApiKeyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Developer-facing endpoints to generate, list and revoke their own API keys.
 * The logged-in username is taken from the JWT via the SecurityContext (Authentication).
 */
@RestController
@RequestMapping("/api/keys")
@RequiredArgsConstructor
@Tag(name = "API Keys", description = "Generate and manage your API keys")
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    @PostMapping
    public ResponseEntity<ApiKeyResponse> generate(Authentication authentication,
                                                     @Valid @RequestBody ApiKeyRequest request) {
        return ResponseEntity.ok(apiKeyService.generateKey(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<ApiKeyResponse>> myKeys(Authentication authentication) {
        return ResponseEntity.ok(apiKeyService.getMyKeys(authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> revoke(Authentication authentication, @PathVariable Long id) {
        apiKeyService.revokeKey(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
