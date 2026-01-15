package com.pms.controller;

import com.pms.dto.ProgrammeTypeRequest;
import com.pms.dto.ProgrammeTypeResponse;
import com.pms.service.ProgrammeTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/programme-types")
public class ProgrammeTypeController {
    
    @Autowired
    private ProgrammeTypeService programmeTypeService;
    
    @GetMapping
    public ResponseEntity<List<ProgrammeTypeResponse>> getAllProgrammeTypes() {
        List<ProgrammeTypeResponse> types = programmeTypeService.getAllProgrammeTypes();
        return ResponseEntity.ok(types);
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<ProgrammeTypeResponse>> getActiveProgrammeTypes() {
        List<ProgrammeTypeResponse> types = programmeTypeService.getActiveProgrammeTypes();
        return ResponseEntity.ok(types);
    }
    
    @GetMapping("/inactive")
    public ResponseEntity<List<ProgrammeTypeResponse>> getInactiveProgrammeTypes() {
        List<ProgrammeTypeResponse> types = programmeTypeService.getInactiveProgrammeTypes();
        return ResponseEntity.ok(types);
    }
    
    @GetMapping("/{code}")
    public ResponseEntity<ProgrammeTypeResponse> getProgrammeTypeByCode(@PathVariable String code) {
        ProgrammeTypeResponse type = programmeTypeService.getProgrammeTypeByCode(code);
        if (type != null) {
            return ResponseEntity.ok(type);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<ProgrammeTypeResponse> createProgrammeType(@RequestBody ProgrammeTypeRequest request) {
        try {
            ProgrammeTypeResponse response = programmeTypeService.createProgrammeType(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{code}")
    public ResponseEntity<ProgrammeTypeResponse> updateProgrammeType(@PathVariable String code, @RequestBody ProgrammeTypeRequest request) {
        try {
            ProgrammeTypeResponse response = programmeTypeService.updateProgrammeType(code, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{code}/deactivate")
    public ResponseEntity<Void> deactivateProgrammeType(@PathVariable String code) {
        try {
            programmeTypeService.deactivateProgrammeType(code);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{code}")
    public ResponseEntity<Void> deleteProgrammeType(@PathVariable String code) {
        try {
            programmeTypeService.deleteProgrammeType(code);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
