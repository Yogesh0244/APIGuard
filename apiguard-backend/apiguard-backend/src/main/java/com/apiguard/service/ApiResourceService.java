package com.apiguard.service;

import com.apiguard.dto.ApiResourceRequest;
import com.apiguard.dto.ApiResourceResponse;
import com.apiguard.entity.ApiResource;
import com.apiguard.exception.DuplicateResourceException;
import com.apiguard.exception.ResourceNotFoundException;
import com.apiguard.repository.ApiResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApiResourceService {

    private final ApiResourceRepository apiResourceRepository;

    public ApiResourceResponse register(ApiResourceRequest request) {
        if (apiResourceRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("An API with this name is already registered");
        }

        ApiResource resource = ApiResource.builder()
                .name(request.getName())
                .baseUrl(request.getBaseUrl())
                .description(request.getDescription())
                .active(true)
                .build();

        apiResourceRepository.save(resource);
        return toResponse(resource);
    }

    public List<ApiResourceResponse> getAll() {
        return apiResourceRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ApiResourceResponse getById(Long id) {
        return toResponse(findEntity(id));
    }

    public ApiResourceResponse toggleActive(Long id) {
        ApiResource resource = findEntity(id);
        resource.setActive(!resource.isActive());
        apiResourceRepository.save(resource);
        return toResponse(resource);
    }

    public void delete(Long id) {
        ApiResource resource = findEntity(id);
        apiResourceRepository.delete(resource);
    }

    public ApiResource findEntity(Long id) {
        return apiResourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("API resource not found with id: " + id));
    }

    public ApiResource findEntityByName(String name) {
        return apiResourceRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("API resource not found with name: " + name));
    }

    private ApiResourceResponse toResponse(ApiResource r) {
        return ApiResourceResponse.builder()
                .id(r.getId())
                .name(r.getName())
                .baseUrl(r.getBaseUrl())
                .description(r.getDescription())
                .active(r.isActive())
                .healthy(r.isHealthy())
                .lastCheckedAt(r.getLastCheckedAt())
                .build();
    }
}
