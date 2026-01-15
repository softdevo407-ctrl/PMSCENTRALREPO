package com.pms.service;

import com.pms.dto.ProgrammeTypeRequest;
import com.pms.dto.ProgrammeTypeResponse;
import com.pms.entity.ProgrammeType;
import com.pms.repository.ProgrammeTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProgrammeTypeService {
    
    @Autowired
    private ProgrammeTypeRepository programmeTypeRepository;
    
    public List<ProgrammeTypeResponse> getAllProgrammeTypes() {
        return programmeTypeRepository.findAllByOrderByHierarchyOrderAsc().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<ProgrammeTypeResponse> getActiveProgrammeTypes() {
        return programmeTypeRepository.findAllActive().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public List<ProgrammeTypeResponse> getInactiveProgrammeTypes() {
        return programmeTypeRepository.findAllInactive().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public ProgrammeTypeResponse getProgrammeTypeByCode(String code) {
        return programmeTypeRepository.findById(code)
                .map(this::convertToResponse)
                .orElse(null);
    }
    
    public ProgrammeTypeResponse createProgrammeType(ProgrammeTypeRequest request) {
        validateRequest(request);
        
        ProgrammeType programmeType = new ProgrammeType();
        programmeType.setProgrammeTypeCode(request.getProgrammeTypeCode());
        programmeType.setProjectCategoryCode(request.getProjectCategoryCode());
        programmeType.setProgrammeTypeFullName(request.getProgrammeTypeFullName());
        programmeType.setProgrammeTypeShortName(request.getProgrammeTypeShortName());
        programmeType.setHierarchyOrder(request.getHierarchyOrder());
        programmeType.setFromDate(request.getFromDate());
        programmeType.setToDate(request.getToDate());
        programmeType.setUserId(request.getUserId());
        programmeType.setRegStatus(request.getRegStatus());
        programmeType.setRegTime(LocalDate.now());
        
        programmeType = programmeTypeRepository.save(programmeType);
        return convertToResponse(programmeType);
    }
    
    public ProgrammeTypeResponse updateProgrammeType(String code, ProgrammeTypeRequest request) {
        ProgrammeType programmeType = programmeTypeRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Programme Type not found with code: " + code));
        
        validateRequest(request);
        
        programmeType.setProjectCategoryCode(request.getProjectCategoryCode());
        programmeType.setProgrammeTypeFullName(request.getProgrammeTypeFullName());
        programmeType.setProgrammeTypeShortName(request.getProgrammeTypeShortName());
        programmeType.setHierarchyOrder(request.getHierarchyOrder());
        programmeType.setFromDate(request.getFromDate());
        programmeType.setToDate(request.getToDate());
        programmeType.setUserId(request.getUserId());
        programmeType.setRegStatus(request.getRegStatus());
        
        programmeType = programmeTypeRepository.save(programmeType);
        return convertToResponse(programmeType);
    }
    
    public void deactivateProgrammeType(String code) {
        ProgrammeType programmeType = programmeTypeRepository.findById(code)
                .orElseThrow(() -> new RuntimeException("Programme Type not found with code: " + code));
        
        programmeType.setToDate(LocalDate.now());
        programmeTypeRepository.save(programmeType);
    }
    
    public void deleteProgrammeType(String code) {
        if (!programmeTypeRepository.existsById(code)) {
            throw new RuntimeException("Programme Type not found with code: " + code);
        }
        programmeTypeRepository.deleteById(code);
    }
    
    private void validateRequest(ProgrammeTypeRequest request) {
        if (request.getProgrammeTypeCode() == null || request.getProgrammeTypeCode().isEmpty()) {
            throw new RuntimeException("Programme Type Code is required");
        }
        
        if (request.getProgrammeTypeCode().length() > 5) {
            throw new RuntimeException("Programme Type Code must not exceed 5 characters");
        }
        
        if (request.getProjectCategoryCode() == null || request.getProjectCategoryCode().isEmpty()) {
            throw new RuntimeException("Project Category Code is required");
        }
        
        if (request.getProgrammeTypeFullName() == null || request.getProgrammeTypeFullName().isEmpty()) {
            throw new RuntimeException("Programme Type Full Name is required");
        }
        
        if (request.getProgrammeTypeFullName().length() > 255) {
            throw new RuntimeException("Programme Type Full Name must not exceed 255 characters");
        }
        
        if (request.getProgrammeTypeShortName() == null || request.getProgrammeTypeShortName().isEmpty()) {
            throw new RuntimeException("Programme Type Short Name is required");
        }
        
        if (request.getProgrammeTypeShortName().length() > 50) {
            throw new RuntimeException("Programme Type Short Name must not exceed 50 characters");
        }
        
        if (request.getHierarchyOrder() == null || request.getHierarchyOrder() < 0) {
            throw new RuntimeException("Hierarchy Order must be a positive number");
        }
        
        if (request.getFromDate() == null) {
            throw new RuntimeException("From Date is required");
        }
        
        if (request.getToDate() != null && request.getToDate().isBefore(request.getFromDate())) {
            throw new RuntimeException("To Date must be after or equal to From Date");
        }
        
        if (request.getUserId() == null || request.getUserId().isEmpty()) {
            throw new RuntimeException("User ID is required");
        }
        
        if (request.getRegStatus() == null || request.getRegStatus().isEmpty()) {
            throw new RuntimeException("Registration Status is required");
        }
        
        if (request.getRegStatus().length() != 1) {
            throw new RuntimeException("Registration Status must be a single character");
        }
    }
    
    private ProgrammeTypeResponse convertToResponse(ProgrammeType programmeType) {
        return new ProgrammeTypeResponse(
                programmeType.getProgrammeTypeCode(),
                programmeType.getProjectCategoryCode(),
                programmeType.getProgrammeTypeFullName(),
                programmeType.getProgrammeTypeShortName(),
                programmeType.getHierarchyOrder(),
                programmeType.getFromDate(),
                programmeType.getToDate(),
                programmeType.getUserId(),
                programmeType.getRegStatus(),
                programmeType.isActive()
        );
    }
}
