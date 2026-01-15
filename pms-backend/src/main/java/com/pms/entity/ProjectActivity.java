package com.pms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "projectactivities", schema = "pmsgeneric")
public class ProjectActivity {
    
    @Id
    @Column(name = "projectactivitiescode", length = 5)
    private String projectActivityCode;
    
    @Column(name = "projectactivitiesfullname", length = 255, nullable = false)
    private String projectActivityFullName;
    
    @Column(name = "projectactivitiesshortname", length = 50, nullable = false)
    private String projectActivityShortName;
    
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
    
    // Constructors
    public ProjectActivity() {
    }
    
    public ProjectActivity(String projectActivityCode, String projectActivityFullName,
                          String projectActivityShortName, Integer hierarchyOrder, LocalDate fromDate, LocalDate toDate,
                          String userId, String regStatus, LocalDate regTime) {
        this.projectActivityCode = projectActivityCode;
        this.projectActivityFullName = projectActivityFullName;
        this.projectActivityShortName = projectActivityShortName;
        this.hierarchyOrder = hierarchyOrder;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.userId = userId;
        this.regStatus = regStatus;
        this.regTime = regTime;
    }
    
    // Methods
    public boolean isActive() {
        return toDate == null || toDate.isAfter(LocalDate.now());
    }
    
    // Getters and Setters
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
    
    public LocalDate getRegTime() {
        return regTime;
    }
    
    public void setRegTime(LocalDate regTime) {
        this.regTime = regTime;
    }
}
