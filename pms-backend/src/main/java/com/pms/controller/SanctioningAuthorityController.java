package com.pms.controller;

import com.pms.dto.SanctioningAuthorityRequest;
import com.pms.dto.SanctioningAuthorityResponse;
import com.pms.service.SanctioningAuthorityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sanctioning-authorities")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class SanctioningAuthorityController {

    private final SanctioningAuthorityService service;

    // Get all sanctioning authorities
    @GetMapping
    public ResponseEntity<List<SanctioningAuthorityResponse>> getAllSanctioningAuthorities() {
        try {
            log.info("Fetching all sanctioning authorities");
            List<SanctioningAuthorityResponse> authorities = service.getAllSanctioningAuthorities();
            log.info("Successfully fetched {} sanctioning authorities", authorities.size());
            return ResponseEntity.ok(authorities);
        } catch (Exception e) {
            log.error("Error fetching sanctioning authorities", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get all active sanctioning authorities
    @GetMapping("/active")
    public ResponseEntity<List<SanctioningAuthorityResponse>> getActiveSanctioningAuthorities() {
        try {
            log.info("Fetching active sanctioning authorities");
            List<SanctioningAuthorityResponse> authorities = service.getAllActiveSanctioningAuthorities();
            log.info("Successfully fetched {} active sanctioning authorities", authorities.size());
            return ResponseEntity.ok(authorities);
        } catch (Exception e) {
            log.error("Error fetching active sanctioning authorities", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get all inactive sanctioning authorities
    @GetMapping("/inactive")
    public ResponseEntity<List<SanctioningAuthorityResponse>> getInactiveSanctioningAuthorities() {
        try {
            log.info("Fetching inactive sanctioning authorities");
            List<SanctioningAuthorityResponse> authorities = service.getAllInactiveSanctioningAuthorities();
            log.info("Successfully fetched {} inactive sanctioning authorities", authorities.size());
            return ResponseEntity.ok(authorities);
        } catch (Exception e) {
            log.error("Error fetching inactive sanctioning authorities", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get sanctioning authority by code
    @GetMapping("/{code}")
    public ResponseEntity<SanctioningAuthorityResponse> getSanctioningAuthorityByCode(@PathVariable String code) {
        try {
            log.info("Fetching sanctioning authority with code: {}", code);
            SanctioningAuthorityResponse authority = service.getSanctioningAuthorityByCode(code);
            if (authority != null) {
                log.info("Successfully fetched sanctioning authority with code: {}", code);
                return ResponseEntity.ok(authority);
            } else {
                log.warn("Sanctioning authority not found with code: {}", code);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("Error fetching sanctioning authority with code: {}", code, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Create sanctioning authority
    @PostMapping
    public ResponseEntity<SanctioningAuthorityResponse> createSanctioningAuthority(
            @RequestBody SanctioningAuthorityRequest request) {
        try {
            log.info("Creating new sanctioning authority with code: {}", request.getSanctioningAuthorityCode());
            SanctioningAuthorityResponse authority = service.createSanctioningAuthority(request);
            log.info("Successfully created sanctioning authority with code: {}", request.getSanctioningAuthorityCode());
            return ResponseEntity.status(HttpStatus.CREATED).body(authority);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for creating sanctioning authority: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error creating sanctioning authority", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update sanctioning authority
    @PutMapping("/{code}")
    public ResponseEntity<SanctioningAuthorityResponse> updateSanctioningAuthority(
            @PathVariable String code,
            @RequestBody SanctioningAuthorityRequest request) {
        try {
            log.info("Updating sanctioning authority with code: {}", code);
            SanctioningAuthorityResponse authority = service.updateSanctioningAuthority(code, request);
            log.info("Successfully updated sanctioning authority with code: {}", code);
            return ResponseEntity.ok(authority);
        } catch (IllegalArgumentException e) {
            log.warn("Sanctioning authority not found for update with code: {}", code);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error updating sanctioning authority with code: {}", code, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Deactivate sanctioning authority
    @PutMapping("/{code}/deactivate")
    public ResponseEntity<Void> deactivateSanctioningAuthority(@PathVariable String code) {
        try {
            log.info("Deactivating sanctioning authority with code: {}", code);
            service.deactivateSanctioningAuthority(code);
            log.info("Successfully deactivated sanctioning authority with code: {}", code);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deactivating sanctioning authority with code: {}", code, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete sanctioning authority
    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteSanctioningAuthority(@PathVariable String code) {
        try {
            log.info("Deleting sanctioning authority with code: {}", code);
            service.deleteSanctioningAuthority(code);
            log.info("Successfully deleted sanctioning authority with code: {}", code);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error deleting sanctioning authority with code: {}", code, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
