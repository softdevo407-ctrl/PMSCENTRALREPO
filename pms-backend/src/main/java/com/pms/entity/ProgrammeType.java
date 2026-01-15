package com.pms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "programmetypes", schema = "pmsgeneric")
public class ProgrammeType {
    
    @Id
    @Column(name = "programmetypescode", length = 5)
    private String programmeTypeCode;
    
    @Column(name = "projectcategoriescode", length = 5, nullable = false)
    private String projectCategoryCode;
    
    @Column(name = "programmetypesfullname", length = 255, nullable = false)
    private String programmeTypeFullName;
    
    @Column(name = "programmetypesshortname", length = 50, nullable = false)
    private String programmeTypeShortName;
    
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
    public ProgrammeType() {
    }
    
    public ProgrammeType(String programmeTypeCode, String projectCategoryCode, String programmeTypeFullName,
                        String programmeTypeShortName, Integer hierarchyOrder, LocalDate fromDate, LocalDate toDate,
                        String userId, String regStatus, LocalDate regTime) {
        this.programmeTypeCode = programmeTypeCode;
        this.projectCategoryCode = projectCategoryCode;
        this.programmeTypeFullName = programmeTypeFullName;
        this.programmeTypeShortName = programmeTypeShortName;
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
    
    public LocalDate getRegTime() {
        return regTime;
    }
    
    public void setRegTime(LocalDate regTime) {
        this.regTime = regTime;
    }
}
