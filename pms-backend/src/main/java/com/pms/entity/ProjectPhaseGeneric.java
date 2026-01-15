package com.pms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "projectphases", schema = "pmsgeneric")
public class ProjectPhaseGeneric {
    
    @Id
    @Column(name = "projectphasescode", length = 5)
    private String projectPhaseCode;
    
    @Column(name = "projectphasesfullname", length = 255, nullable = false)
    private String projectPhaseFullName;
    
    @Column(name = "projectphasesshortname", length = 50, nullable = false)
    private String projectPhaseShortName;
    
    @Column(name = "hierarchyorder", nullable = false)
    private Integer hierarchyOrder;
    
    @Column(name = "fromdate", nullable = false)
    private LocalDate fromDate;
    
    @Column(name = "todate")
    private LocalDate toDate;
    
    @Column(name = "userid", length = 7, nullable = false)
    private String userId;
    
    @Column(name = "regstatus", length = 1, nullable = false)
    private String regStatus;
    
    @Column(name = "regtime")
    private LocalDate regTime;
    
    public ProjectPhaseGeneric() {
    }
    
    public ProjectPhaseGeneric(String projectPhaseCode, String projectPhaseFullName,
                              String projectPhaseShortName, Integer hierarchyOrder, LocalDate fromDate, LocalDate toDate,
                              String userId, String regStatus, LocalDate regTime) {
        this.projectPhaseCode = projectPhaseCode;
        this.projectPhaseFullName = projectPhaseFullName;
        this.projectPhaseShortName = projectPhaseShortName;
        this.hierarchyOrder = hierarchyOrder;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.userId = userId;
        this.regStatus = regStatus;
        this.regTime = regTime;
    }
    
    public boolean isActive() {
        return toDate == null || toDate.isAfter(LocalDate.now());
    }
    
    public String getProjectPhaseCode() {
        return projectPhaseCode;
    }
    
    public void setProjectPhaseCode(String projectPhaseCode) {
        this.projectPhaseCode = projectPhaseCode;
    }
    
    public String getProjectPhaseFullName() {
        return projectPhaseFullName;
    }
    
    public void setProjectPhaseFullName(String projectPhaseFullName) {
        this.projectPhaseFullName = projectPhaseFullName;
    }
    
    public String getProjectPhaseShortName() {
        return projectPhaseShortName;
    }
    
    public void setProjectPhaseShortName(String projectPhaseShortName) {
        this.projectPhaseShortName = projectPhaseShortName;
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
