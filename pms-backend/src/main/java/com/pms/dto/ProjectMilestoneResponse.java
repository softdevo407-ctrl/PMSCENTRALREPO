package com.pms.dto;

import java.time.LocalDate;

public class ProjectMilestoneResponse {
    private String projectMilestoneCode;
    private String projectMilestoneFullName;
    private String projectMilestoneShortName;
    private Integer hierarchyOrder;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String userId;
    private String regStatus;
    private boolean active;
    
    public ProjectMilestoneResponse() {
    }
    
    public ProjectMilestoneResponse(String projectMilestoneCode, String projectMilestoneFullName,
                                   String projectMilestoneShortName, Integer hierarchyOrder, LocalDate fromDate,
                                   LocalDate toDate, String userId, String regStatus, boolean active) {
        this.projectMilestoneCode = projectMilestoneCode;
        this.projectMilestoneFullName = projectMilestoneFullName;
        this.projectMilestoneShortName = projectMilestoneShortName;
        this.hierarchyOrder = hierarchyOrder;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.userId = userId;
        this.regStatus = regStatus;
        this.active = active;
    }
    
    public String getProjectMilestoneCode() { return projectMilestoneCode; }
    public void setProjectMilestoneCode(String projectMilestoneCode) { this.projectMilestoneCode = projectMilestoneCode; }
    public String getProjectMilestoneFullName() { return projectMilestoneFullName; }
    public void setProjectMilestoneFullName(String projectMilestoneFullName) { this.projectMilestoneFullName = projectMilestoneFullName; }
    public String getProjectMilestoneShortName() { return projectMilestoneShortName; }
    public void setProjectMilestoneShortName(String projectMilestoneShortName) { this.projectMilestoneShortName = projectMilestoneShortName; }
    public Integer getHierarchyOrder() { return hierarchyOrder; }
    public void setHierarchyOrder(Integer hierarchyOrder) { this.hierarchyOrder = hierarchyOrder; }
    public LocalDate getFromDate() { return fromDate; }
    public void setFromDate(LocalDate fromDate) { this.fromDate = fromDate; }
    public LocalDate getToDate() { return toDate; }
    public void setToDate(LocalDate toDate) { this.toDate = toDate; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getRegStatus() { return regStatus; }
    public void setRegStatus(String regStatus) { this.regStatus = regStatus; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
