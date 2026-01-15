package com.pms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "projectmilestones", schema = "pmsgeneric")
public class ProjectMilestone {
    
    @Id
    @Column(name = "projectmilestonescode", length = 5)
    private String projectMilestoneCode;
    
    @Column(name = "projectmilestonesfullname", length = 255, nullable = false)
    private String projectMilestoneFullName;
    
    @Column(name = "projectmilestonesshortname", length = 50, nullable = false)
    private String projectMilestoneShortName;
    
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
    
    public ProjectMilestone() {
    }
    
    public ProjectMilestone(String projectMilestoneCode, String projectMilestoneFullName,
                           String projectMilestoneShortName, Integer hierarchyOrder, LocalDate fromDate, LocalDate toDate,
                           String userId, String regStatus, LocalDate regTime) {
        this.projectMilestoneCode = projectMilestoneCode;
        this.projectMilestoneFullName = projectMilestoneFullName;
        this.projectMilestoneShortName = projectMilestoneShortName;
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
    
    public String getProjectMilestoneCode() {
        return projectMilestoneCode;
    }
    
    public void setProjectMilestoneCode(String projectMilestoneCode) {
        this.projectMilestoneCode = projectMilestoneCode;
    }
    
    public String getProjectMilestoneFullName() {
        return projectMilestoneFullName;
    }
    
    public void setProjectMilestoneFullName(String projectMilestoneFullName) {
        this.projectMilestoneFullName = projectMilestoneFullName;
    }
    
    public String getProjectMilestoneShortName() {
        return projectMilestoneShortName;
    }
    
    public void setProjectMilestoneShortName(String projectMilestoneShortName) {
        this.projectMilestoneShortName = projectMilestoneShortName;
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
