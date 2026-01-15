package com.pms.dto;

import java.time.LocalDate;

public class ProgrammeTypeRequest {
    private String programmeTypeCode;
    private String projectCategoryCode;
    private String programmeTypeFullName;
    private String programmeTypeShortName;
    private Integer hierarchyOrder;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String userId;
    private String regStatus;
    
    // Constructors
    public ProgrammeTypeRequest() {
    }
    
    public ProgrammeTypeRequest(String programmeTypeCode, String projectCategoryCode, String programmeTypeFullName,
                               String programmeTypeShortName, Integer hierarchyOrder, LocalDate fromDate, LocalDate toDate,
                               String userId, String regStatus) {
        this.programmeTypeCode = programmeTypeCode;
        this.projectCategoryCode = projectCategoryCode;
        this.programmeTypeFullName = programmeTypeFullName;
        this.programmeTypeShortName = programmeTypeShortName;
        this.hierarchyOrder = hierarchyOrder;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.userId = userId;
        this.regStatus = regStatus;
    }
    
    // Getters and Setters
    public String getProgrammeTypeCode() {
        return programmeTypeCode;
    }
    
    public void setProgrammeTypeCode(String programmeTypeCode) {
        this.programmeTypeCode = programmeTypeCode;
    }
    
    public String getProjectCategoryCode() {
        return projectCategoryCode;
    }
    
    public void setProjectCategoryCode(String projectCategoryCode) {
        this.projectCategoryCode = projectCategoryCode;
    }
    
    public String getProgrammeTypeFullName() {
        return programmeTypeFullName;
    }
    
    public void setProgrammeTypeFullName(String programmeTypeFullName) {
        this.programmeTypeFullName = programmeTypeFullName;
    }
    
    public String getProgrammeTypeShortName() {
        return programmeTypeShortName;
    }
    
    public void setProgrammeTypeShortName(String programmeTypeShortName) {
        this.programmeTypeShortName = programmeTypeShortName;
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
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getRegStatus() {
        return regStatus;
    }
    
    public void setRegStatus(String regStatus) {
        this.regStatus = regStatus;
    }
}
