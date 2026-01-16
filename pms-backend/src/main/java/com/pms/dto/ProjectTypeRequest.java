package com.pms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.time.LocalDate;

public class ProjectTypeRequest {
    
    @NotBlank(message = "Project Types Code is required")
    private String projectTypesCode;
    
    @NotBlank(message = "Project Types Full Name is required")
    private String projectTypesFullName;
    
    @NotBlank(message = "Project Types Short Name is required")
    private String projectTypesShortName;
    
    @NotNull(message = "Hierarchy Order is required")
    @Min(value = 0, message = "Hierarchy Order must be non-negative")
    @Max(value = 999, message = "Hierarchy Order cannot exceed 999")
    private Integer hierarchyOrder;
    
    @NotNull(message = "From Date is required")
    private LocalDate fromDate;
    
    private LocalDate toDate;
    
    // Constructors
    public ProjectTypeRequest() {
    }
    
    public ProjectTypeRequest(String projectTypesCode, String projectTypesFullName, String projectTypesShortName,
                              Integer hierarchyOrder, LocalDate fromDate, LocalDate toDate) {
        this.projectTypesCode = projectTypesCode;
        this.projectTypesFullName = projectTypesFullName;
        this.projectTypesShortName = projectTypesShortName;
        this.hierarchyOrder = hierarchyOrder;
        this.fromDate = fromDate;
        this.toDate = toDate;
    }
    
    // Getters and Setters
    public String getProjectTypesCode() {
        return projectTypesCode;
    }
    
    public void setProjectTypesCode(String projectTypesCode) {
        this.projectTypesCode = projectTypesCode;
    }
    
    public String getProjectTypesFullName() {
        return projectTypesFullName;
    }
    
    public void setProjectTypesFullName(String projectTypesFullName) {
        this.projectTypesFullName = projectTypesFullName;
    }
    
    public String getProjectTypesShortName() {
        return projectTypesShortName;
    }
    
    public void setProjectTypesShortName(String projectTypesShortName) {
        this.projectTypesShortName = projectTypesShortName;
    }
    
    public Integer getHierarchyOrder() {
        return hierarchyOrder;
    }
    
    public void setHierarchyOrder(Integer hierarchyOrder) {
        this.hierarchyOrder = hierarchyOrder;
    }
    
    public LocalDate getFromDate() {
        return fromDate;
    }
    
    public void setFromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
    }
    
    public LocalDate getToDate() {
        return toDate;
    }
    
    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
    }
}
