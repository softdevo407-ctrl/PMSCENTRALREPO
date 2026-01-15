package com.pms.controller;

import com.pms.dto.ApiResponse;
import com.pms.dto.ProgrammeOfficeRequest;
import com.pms.dto.ProgrammeOfficeResponse;
import com.pms.service.ProgrammeOfficeService;
import jakarta.annotation.security.PermitAll;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/programme-offices")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class ProgrammeOfficeController {
    
    private final ProgrammeOfficeService programmeOfficeService;
    
    @GetMapping
    @PermitAll
    public ResponseEntity<List<ProgrammeOfficeResponse>> getAllProgrammeOffices() {
        log.info("Fetching all programme offices");
        List<ProgrammeOfficeResponse> offices = programmeOfficeService.getAllProgrammeOffices();
        return ResponseEntity.ok(offices);
    }
    
    @GetMapping("/active")
    @PermitAll
    public ResponseEntity<List<ProgrammeOfficeResponse>> getActiveProgrammeOffices() {
        log.info("Fetching active programme offices");
        List<ProgrammeOfficeResponse> offices = programmeOfficeService.getActiveProgrammeOffices();
        return ResponseEntity.ok(offices);
    }
    
    @GetMapping("/inactive")
    @PermitAll
    public ResponseEntity<List<ProgrammeOfficeResponse>> getInactiveProgrammeOffices() {
        log.info("Fetching inactive programme offices");
        List<ProgrammeOfficeResponse> offices = programmeOfficeService.getInactiveProgrammeOffices();
        return ResponseEntity.ok(offices);
    }
    
    @GetMapping("/{code}")
    @PermitAll
    public ResponseEntity<ProgrammeOfficeResponse> getProgrammeOfficeByCode(@PathVariable String code) {
        log.info("Fetching programme office with code: {}", code);
        ProgrammeOfficeResponse office = programmeOfficeService.getProgrammeOfficeByCode(code);
        return ResponseEntity.ok(office);
    }
    
    @PostMapping
    @PermitAll
    public ResponseEntity<ProgrammeOfficeResponse> createProgrammeOffice(@RequestBody ProgrammeOfficeRequest request) {
        log.info("Creating new programme office: {}", request.getProgrammeOfficeCode());
        try {
            ProgrammeOfficeResponse office = programmeOfficeService.createProgrammeOffice(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(office);
        } catch (RuntimeException e) {
            log.error("Error creating programme office", e);
            throw e;
        }
    }
    
    @PutMapping("/{code}")
    @PermitAll
    public ResponseEntity<ProgrammeOfficeResponse> updateProgrammeOffice(
            @PathVariable String code,
            @RequestBody ProgrammeOfficeRequest request) {
        log.info("Updating programme office: {}", code);
        try {
            ProgrammeOfficeResponse office = programmeOfficeService.updateProgrammeOffice(code, request);
            return ResponseEntity.ok(office);
        } catch (RuntimeException e) {
            log.error("Error updating programme office", e);
            throw e;
        }
    }
    
    @PutMapping("/{code}/deactivate")
    @PermitAll
    public ResponseEntity<ProgrammeOfficeResponse> deactivateProgrammeOffice(@PathVariable String code) {
        log.info("Deactivating programme office: {}", code);
        try {
            ProgrammeOfficeResponse office = programmeOfficeService.deactivateProgrammeOffice(code);
            return ResponseEntity.ok(office);
        } catch (RuntimeException e) {
            log.error("Error deactivating programme office", e);
            throw e;
        }
    }
    
    @DeleteMapping("/{code}")
    @PermitAll
    public ResponseEntity<ApiResponse> deleteProgrammeOffice(@PathVariable String code) {
        log.info("Deleting programme office: {}", code);
        try {
            programmeOfficeService.deleteProgrammeOffice(code);
            return ResponseEntity.ok(new ApiResponse(true, "Programme Office deleted successfully"));
        } catch (RuntimeException e) {
            log.error("Error deleting programme office", e);
            throw e;
        }
    }
}
