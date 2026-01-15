package com.pms.dto;

import java.time.LocalDate;

public class ProjectCategoryResponse {
    private String projectCategoryCode;
    private String projectCategoryFullName;
    private String projectCategoryShortName;
    private String showOnDashboard;
    private Integer hierarchyOrder;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String userId;
    private String regStatus;
    private boolean active;
    
    public ProjectCategoryResponse() {
    }
    
    public ProjectCategoryResponse(String projectCategoryCode, String projectCategoryFullName,
                                  String projectCategoryShortName, String showOnDashboard, Integer hierarchyOrder,
                                  LocalDate fromDate, LocalDate toDate, String userId, String regStatus, boolean active) {
        this.projectCategoryCode = projectCategoryCode;
        this.projectCategoryFullName = projectCategoryFullName;
        this.projectCategoryShortName = projectCategoryShortName;
        this.showOnDashboard = showOnDashboard;
        this.hierarchyOrder = hierarchyOrder;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.userId = userId;
        this.regStatus = regStatus;
        this.active = active;
    }
    
    public String getProjectCategoryCode() {
        return projectCategoryCode;
    }
    
    public void setProjectCategoryCode(String projectCategoryCode) {
        this.projectCategoryCode = projectCategoryCode;
    }
    
    public String getProjectCategoryFullName() {
        return projectCategoryFullName;
    }
    
    public void setProjectCategoryFullName(String projectCategoryFullName) {
        this.projectCategoryFullName = projectCategoryFullName;
    }
    
    public String getProjectCategoryShortName() {
        return projectCategoryShortName;
    }
    
    public void setProjectCategoryShortName(String projectCategoryShortName) {
        this.projectCategoryShortName = projectCategoryShortName;
    }
    
    public String getShowOnDashboard() {
        return showOnDashboard;
    }
    
    public void setShowOnDashboard(String showOnDashboard) {
        this.showOnDashboard = showOnDashboard;
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
    
    public boolean isActive() {
        return active;
    }
    
    public void setActive(boolean active) {
        this.active = active;
    }
}
