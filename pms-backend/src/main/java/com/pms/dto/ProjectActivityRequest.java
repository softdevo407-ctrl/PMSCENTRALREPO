package com.pms.dto;

import java.time.LocalDate;

public class ProjectActivityRequest {
    private String projectActivityCode;
    private String projectActivityFullName;
    private String projectActivityShortName;
    private Integer hierarchyOrder;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String userId;
    private String regStatus;
    
    public ProjectActivityRequest() {
    }
    
    public ProjectActivityRequest(String projectActivityCode, String projectActivityFullName,
                                 String projectActivityShortName, Integer hierarchyOrder, LocalDate fromDate, 
                                 LocalDate toDate, String userId, String regStatus) {
        this.projectActivityCode = projectActivityCode;
        this.projectActivityFullName = projectActivityFullName;
        this.projectActivityShortName = projectActivityShortName;
        this.hierarchyOrder = hierarchyOrder;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.userId = userId;
        this.regStatus = regStatus;
    }
    
    public String getProjectActivityCode() {
        return projectActivityCode;
    }
    
    public void setProjectActivityCode(String projectActivityCode) {
        this.projectActivityCode = projectActivityCode;
    }
    
    public String getProjectActivityFullName() {
        return projectActivityFullName;
    }
    
    public void setProjectActivityFullName(String projectActivityFullName) {
        this.projectActivityFullName = projectActivityFullName;
    }
    
    public String getProjectActivityShortName() {
        return projectActivityShortName;
    }
    
    public void setProjectActivityShortName(String projectActivityShortName) {
        this.projectActivityShortName = projectActivityShortName;
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
