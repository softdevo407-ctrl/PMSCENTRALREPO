package com.pms.service;

import com.pms.dto.SanctioningAuthorityRequest;
import com.pms.dto.SanctioningAuthorityResponse;
import com.pms.entity.SanctioningAuthority;
import com.pms.repository.SanctioningAuthorityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SanctioningAuthorityService {

    @Autowired
    private SanctioningAuthorityRepository repository;

    // Get all sanctioning authorities
    public List<SanctioningAuthorityResponse> getAllSanctioningAuthorities() {
        return repository.findAllOrdered().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get all active sanctioning authorities
    public List<SanctioningAuthorityResponse> getAllActiveSanctioningAuthorities() {
        return repository.findAllActive().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get all inactive sanctioning authorities
    public List<SanctioningAuthorityResponse> getAllInactiveSanctioningAuthorities() {
        return repository.findAllInactive().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    // Get sanctioning authority by code
    public SanctioningAuthorityResponse getSanctioningAuthorityByCode(String code) {
        return repository.findBySanctioningAuthorityCode(code)
                .map(this::convertToResponse)
                .orElse(null);
    }

    // Create sanctioning authority
    public SanctioningAuthorityResponse createSanctioningAuthority(SanctioningAuthorityRequest request) {
        if (repository.existsBySanctioningAuthorityCode(request.getSanctioningAuthorityCode())) {
            throw new IllegalArgumentException("Sanctioning Authority Code already exists");
        }

        SanctioningAuthority authority = SanctioningAuthority.builder()
                .sanctioningAuthorityCode(request.getSanctioningAuthorityCode())
                .sanctioningAuthorityFullName(request.getSanctioningAuthorityFullName())
                .sanctioningAuthorityShortName(request.getSanctioningAuthorityShortName())
                .hierarchyOrder(request.getHierarchyOrder())
                .fromDate(request.getFromDate())
                .toDate(request.getToDate())
                .userId(request.getUserId())
                .regStatus(request.getRegStatus() != null ? request.getRegStatus() : "A")
                .regTime(LocalDate.now())
                .build();

        SanctioningAuthority saved = repository.save(authority);
        return convertToResponse(saved);
    }

    // Update sanctioning authority
    public SanctioningAuthorityResponse updateSanctioningAuthority(String code, SanctioningAuthorityRequest request) {
        SanctioningAuthority authority = repository.findBySanctioningAuthorityCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Sanctioning Authority not found"));

        authority.setSanctioningAuthorityFullName(request.getSanctioningAuthorityFullName());
        authority.setSanctioningAuthorityShortName(request.getSanctioningAuthorityShortName());
        authority.setHierarchyOrder(request.getHierarchyOrder());
        authority.setFromDate(request.getFromDate());
        authority.setToDate(request.getToDate());
        authority.setUserId(request.getUserId());
        authority.setRegStatus(request.getRegStatus());

        SanctioningAuthority updated = repository.save(authority);
        return convertToResponse(updated);
    }

    // Deactivate sanctioning authority
    public void deactivateSanctioningAuthority(String code) {
        SanctioningAuthority authority = repository.findBySanctioningAuthorityCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Sanctioning Authority not found"));
        
        authority.setRegStatus("I");
        authority.setToDate(LocalDate.now());
        repository.save(authority);
    }

    // Delete sanctioning authority
    public void deleteSanctioningAuthority(String code) {
        if (repository.existsBySanctioningAuthorityCode(code)) {
            repository.deleteById(code);
        } else {
            throw new IllegalArgumentException("Sanctioning Authority not found");
        }
    }

    // Convert entity to response
    private SanctioningAuthorityResponse convertToResponse(SanctioningAuthority entity) {
        return SanctioningAuthorityResponse.builder()
                .sanctioningAuthorityCode(entity.getSanctioningAuthorityCode())
                .sanctioningAuthorityFullName(entity.getSanctioningAuthorityFullName())
                .sanctioningAuthorityShortName(entity.getSanctioningAuthorityShortName())
                .hierarchyOrder(entity.getHierarchyOrder())
                .fromDate(entity.getFromDate())
                .toDate(entity.getToDate())
                .userId(entity.getUserId())
                .regStatus(entity.getRegStatus())
                .regTime(entity.getRegTime())
                .build();
    }
}
