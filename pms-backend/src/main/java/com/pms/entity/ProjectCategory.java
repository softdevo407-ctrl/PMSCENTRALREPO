package com.pms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "projectcategory", schema = "pmsgeneric")
public class ProjectCategory {
    
    @Id
    @Column(name = "projectcategorycode", length = 5)
    private String projectCategoryCode;
    
    @Column(name = "projectcategoryfullname", length = 255, nullable = false)
    private String projectCategoryFullName;
    
    @Column(name = "projectcategoryshortname", length = 50, nullable = false)
    private String projectCategoryShortName;
    
    @Column(name = "showondashboard", length = 3, nullable = false)
    private String showOnDashboard;
    
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
    public ProjectCategory() {
    }
    
    public ProjectCategory(String projectCategoryCode, String projectCategoryFullName,
                          String projectCategoryShortName, String showOnDashboard, Integer hierarchyOrder, 
                          LocalDate fromDate, LocalDate toDate, String userId, String regStatus, LocalDate regTime) {
        this.projectCategoryCode = projectCategoryCode;
        this.projectCategoryFullName = projectCategoryFullName;
        this.projectCategoryShortName = projectCategoryShortName;
        this.showOnDashboard = showOnDashboard;
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
    
    public LocalDate getRegTime() {
        return regTime;
    }
    
    public void setRegTime(LocalDate regTime) {
        this.regTime = regTime;
    }
}
