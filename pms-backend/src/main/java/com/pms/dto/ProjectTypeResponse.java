package com.pms.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDate;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectTypeResponse {
    
    private String projectTypesCode;
    private String projectTypesFullName;
    private String projectTypesShortName;
    private Integer hierarchyOrder;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String userId;
    private String regStatus;
    private LocalDate regTime;
    
    // Constructors
    public ProjectTypeResponse() {
    }
    
    public ProjectTypeResponse(String projectTypesCode, String projectTypesFullName, String projectTypesShortName,
                               Integer hierarchyOrder, LocalDate fromDate, LocalDate toDate, String userId,
                               String regStatus, LocalDate regTime) {
        this.projectTypesCode = projectTypesCode;
        this.projectTypesFullName = projectTypesFullName;
        this.projectTypesShortName = projectTypesShortName;
        this.hierarchyOrder = hierarchyOrder;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.userId = userId;
        this.regStatus = regStatus;
        this.regTime = regTime;
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
    
    public LocalDate getRegTime() {
        return regTime;
    }
    
    public void setRegTime(LocalDate regTime) {
        this.regTime = regTime;
    }
}
