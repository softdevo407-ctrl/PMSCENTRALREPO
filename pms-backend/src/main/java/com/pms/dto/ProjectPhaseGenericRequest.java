package com.pms.dto;

import java.time.LocalDate;

public class ProjectPhaseGenericRequest {
    private String projectPhaseCode;
    private String projectPhaseFullName;
    private String projectPhaseShortName;
    private Integer hierarchyOrder;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String userId;
    private String regStatus;
    
    public ProjectPhaseGenericRequest() {
    }
    
    public ProjectPhaseGenericRequest(String projectPhaseCode, String projectPhaseFullName,
                                     String projectPhaseShortName, Integer hierarchyOrder, LocalDate fromDate,
                                     LocalDate toDate, String userId, String regStatus) {
        this.projectPhaseCode = projectPhaseCode;
        this.projectPhaseFullName = projectPhaseFullName;
        this.projectPhaseShortName = projectPhaseShortName;
        this.hierarchyOrder = hierarchyOrder;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.userId = userId;
        this.regStatus = regStatus;
    }
    
    public String getProjectPhaseCode() { return projectPhaseCode; }
    public void setProjectPhaseCode(String projectPhaseCode) { this.projectPhaseCode = projectPhaseCode; }
    public String getProjectPhaseFullName() { return projectPhaseFullName; }
    public void setProjectPhaseFullName(String projectPhaseFullName) { this.projectPhaseFullName = projectPhaseFullName; }
    public String getProjectPhaseShortName() { return projectPhaseShortName; }
    public void setProjectPhaseShortName(String projectPhaseShortName) { this.projectPhaseShortName = projectPhaseShortName; }
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
}
