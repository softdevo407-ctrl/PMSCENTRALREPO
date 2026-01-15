package com.pms.service;

import com.pms.dto.ProgrammeOfficeRequest;
import com.pms.dto.ProgrammeOfficeResponse;
import com.pms.entity.ProgrammeOffice;
import com.pms.repository.ProgrammeOfficeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProgrammeOfficeService {
    
    private final ProgrammeOfficeRepository programmeOfficeRepository;
    
    // Get all programme offices
    public List<ProgrammeOfficeResponse> getAllProgrammeOffices() {
        return programmeOfficeRepository.findAllByOrderByHierarchyOrderAsc()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get only active programme offices
    public List<ProgrammeOfficeResponse> getActiveProgrammeOffices() {
        return programmeOfficeRepository.findAllActive()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get only inactive programme offices
    public List<ProgrammeOfficeResponse> getInactiveProgrammeOffices() {
        return programmeOfficeRepository.findAllInactive()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    // Get by code
    public ProgrammeOfficeResponse getProgrammeOfficeByCode(String code) {
        ProgrammeOffice office = programmeOfficeRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Programme Office not found with code: " + code));
        return convertToResponse(office);
    }
    
    // Create new programme office
    @Transactional
    public ProgrammeOfficeResponse createProgrammeOffice(ProgrammeOfficeRequest request) {
        // Validation
        validateProgrammeOfficeRequest(request);
        
        // Check if code already exists
        if (programmeOfficeRepository.existsById(request.getProgrammeOfficeCode())) {
            throw new RuntimeException("Programme Office with code " + request.getProgrammeOfficeCode() + " already exists");
        }
        
        // Check if short name is unique
        if (programmeOfficeRepository.findByProgrammeOfficeShortName(request.getProgrammeOfficeShortName()).isPresent()) {
            throw new RuntimeException("Programme Office with short name " + request.getProgrammeOfficeShortName() + " already exists");
        }
        
        ProgrammeOffice office = ProgrammeOffice.builder()
                .programmeOfficeCode(request.getProgrammeOfficeCode())
                .programmeOfficeFullName(request.getProgrammeOfficeFullName())
                .programmeOfficeShortName(request.getProgrammeOfficeShortName())
                .hierarchyOrder(request.getHierarchyOrder())
                .fromDate(request.getFromDate())
                .toDate(request.getToDate())
                .userId(request.getUserId())
                .regStatus(request.getRegStatus())
                .regTime(LocalDate.now())
                .build();
        
        ProgrammeOffice savedOffice = programmeOfficeRepository.save(office);
        log.info("Programme Office created successfully: {}", savedOffice.getProgrammeOfficeCode());
        
        return convertToResponse(savedOffice);
    }
    
    // Update programme office
    @Transactional
    public ProgrammeOfficeResponse updateProgrammeOffice(String code, ProgrammeOfficeRequest request) {
        ProgrammeOffice office = programmeOfficeRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Programme Office not found with code: " + code));
        
        // Validation
        validateProgrammeOfficeRequest(request);
        
        // Check if short name is already used by another office
        programmeOfficeRepository.findByProgrammeOfficeShortName(request.getProgrammeOfficeShortName())
                .ifPresent(existing -> {
                    if (!existing.getProgrammeOfficeCode().equals(code)) {
                        throw new RuntimeException("Programme Office with short name " + request.getProgrammeOfficeShortName() + " already exists");
                    }
                });
        
        office.setProgrammeOfficeFullName(request.getProgrammeOfficeFullName());
        office.setProgrammeOfficeShortName(request.getProgrammeOfficeShortName());
        office.setHierarchyOrder(request.getHierarchyOrder());
        office.setFromDate(request.getFromDate());
        office.setToDate(request.getToDate());
        office.setUserId(request.getUserId());
        office.setRegStatus(request.getRegStatus());
        
        ProgrammeOffice updatedOffice = programmeOfficeRepository.save(office);
        log.info("Programme Office updated successfully: {}", updatedOffice.getProgrammeOfficeCode());
        
        return convertToResponse(updatedOffice);
    }
    
    // Deactivate programme office (set toDate)
    @Transactional
    public ProgrammeOfficeResponse deactivateProgrammeOffice(String code) {
        ProgrammeOffice office = programmeOfficeRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Programme Office not found with code: " + code));
        
        office.setToDate(LocalDate.now());
        ProgrammeOffice deactivated = programmeOfficeRepository.save(office);
        
        log.info("Programme Office deactivated: {}", code);
        return convertToResponse(deactivated);
    }
    
    // Delete programme office
    @Transactional
    public void deleteProgrammeOffice(String code) {
        ProgrammeOffice office = programmeOfficeRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Programme Office not found with code: " + code));
        
        programmeOfficeRepository.delete(office);
        log.info("Programme Office deleted: {}", code);
    }
    
    // Validation method
    private void validateProgrammeOfficeRequest(ProgrammeOfficeRequest request) {
        if (request.getProgrammeOfficeCode() == null || request.getProgrammeOfficeCode().trim().isEmpty()) {
            throw new RuntimeException("Programme Office Code is required");
        }
        
        if (request.getProgrammeOfficeFullName() == null || request.getProgrammeOfficeFullName().trim().isEmpty()) {
            throw new RuntimeException("Programme Office Full Name is required");
        }
        
        if (request.getProgrammeOfficeShortName() == null || request.getProgrammeOfficeShortName().trim().isEmpty()) {
            throw new RuntimeException("Programme Office Short Name is required");
        }
        
        if (request.getHierarchyOrder() == null || request.getHierarchyOrder() <= 0) {
            throw new RuntimeException("Hierarchy Order must be a positive number");
        }
        
        if (request.getFromDate() == null) {
            throw new RuntimeException("From Date is required");
        }
        
        if (request.getToDate() != null && request.getToDate().isBefore(request.getFromDate())) {
            throw new RuntimeException("To Date cannot be before From Date");
        }
        
        if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
            throw new RuntimeException("User ID is required");
        }
        
        if (request.getRegStatus() == null || request.getRegStatus().trim().isEmpty()) {
            throw new RuntimeException("Registration Status is required");
        }
        
        if (!request.getRegStatus().matches("[A-Za-z]")) {
            throw new RuntimeException("Registration Status must be a single character");
        }
        
        if (request.getProgrammeOfficeCode().length() > 5) {
            throw new RuntimeException("Programme Office Code cannot exceed 5 characters");
        }
    }
    
    private ProgrammeOfficeResponse convertToResponse(ProgrammeOffice office) {
        return ProgrammeOfficeResponse.builder()
                .programmeOfficeCode(office.getProgrammeOfficeCode())
                .programmeOfficeFullName(office.getProgrammeOfficeFullName())
                .programmeOfficeShortName(office.getProgrammeOfficeShortName())
                .hierarchyOrder(office.getHierarchyOrder())
                .fromDate(office.getFromDate())
                .toDate(office.getToDate())
                .userId(office.getUserId())
                .regStatus(office.getRegStatus())
                .active(office.isActive())
                .build();
    }
}
