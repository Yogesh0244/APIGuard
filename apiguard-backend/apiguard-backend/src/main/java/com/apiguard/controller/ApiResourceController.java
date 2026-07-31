package com.apiguard.controller;

import com.apiguard.dto.ApiResourceRequest;
import com.apiguard.dto.ApiResourceResponse;
import com.apiguard.service.ApiResourceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only endpoints for registering and managing backend APIs on the platform.
 * Secured by SecurityConfig: /api/admin/** requires ROLE_ADMIN.
 */
@RestController
@RequestMapping("/api/admin/apis")
@RequiredArgsConstructor
@Tag(name = "API Management (Admin)", description = "Register & manage backend APIs")
public class ApiResourceController {

    private final ApiResourceService apiResourceService;

    @PostMapping
    public ResponseEntity<ApiResourceResponse> register(@Valid @RequestBody ApiResourceRequest request) {
        return ResponseEntity.ok(apiResourceService.register(request));
    }

    @GetMapping
    public ResponseEntity<List<ApiResourceResponse>> getAll() {
        return ResponseEntity.ok(apiResourceService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResourceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(apiResourceService.getById(id));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResourceResponse> toggleActive(@PathVariable Long id) {
        return ResponseEntity.ok(apiResourceService.toggleActive(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        apiResourceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
