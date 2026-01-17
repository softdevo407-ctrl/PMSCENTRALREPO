package com.pms.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "projectschedule", schema = "pmsmaintables")
public class ProjectSchedule {
    
    @EmbeddedId
    private ProjectScheduleId id;
    
    @Column(name = "schedulelevel", nullable = false)
    private Integer scheduleLevel;
    
    @Column(name = "scheduleparentcode", length = 5)
    private String scheduleParentCode;
    
    @Column(name = "numberofdaystorealise")
    private Integer numberOfDaysToRealise;
    
    @Column(name = "schedulestartdate")
    private LocalDate scheduleStartDate;
    
    @Column(name = "scheduleenddate")
    private LocalDate scheduleEndDate;
    
    @Column(name = "weight")
    private Integer weight;
    
    @Column(name = "statuscode", length = 6)
    private String statusCode;
    
    @Column(name = "hierarchyorder", nullable = false)
    private Integer hierarchyOrder;
    
    @Column(name = "remarks")
    private String remarks;
    
    @Column(name = "completedweight")
    private Integer completedWeight;
    
    @Column(name = "completeddate")
    private LocalDate completedDate;
    
    @Column(name = "revisedschedulestartdate")
    private LocalDate revisedScheduleStartDate;
    
    @Column(name = "revisedscheduleenddate")
    private LocalDate revisedScheduleEndDate;
    
    @Column(name = "userid", length = 7, nullable = false)
    private String userId;
    
    @Column(name = "regstatus", length = 1, nullable = false)
    private String regStatus;
    
    @Column(name = "regtime", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime regTime;
    
    // Constructors
    public ProjectSchedule() {
    }
    
    public ProjectSchedule(ProjectScheduleId id, Integer scheduleLevel,
                          String scheduleParentCode, Integer numberOfDaysToRealise, LocalDate scheduleStartDate,
                          LocalDate scheduleEndDate, Integer weight, String statusCode, Integer hierarchyOrder,
                          String remarks, Integer completedWeight, LocalDate completedDate,
                          LocalDate revisedScheduleStartDate, LocalDate revisedScheduleEndDate,
                          String userId, String regStatus) {
        this.id = id;
        this.scheduleLevel = scheduleLevel;
        this.scheduleParentCode = scheduleParentCode;
        this.numberOfDaysToRealise = numberOfDaysToRealise;
        this.scheduleStartDate = scheduleStartDate;
        this.scheduleEndDate = scheduleEndDate;
        this.weight = weight;
        this.statusCode = statusCode;
        this.hierarchyOrder = hierarchyOrder;
        this.remarks = remarks;
        this.completedWeight = completedWeight;
        this.completedDate = completedDate;
        this.revisedScheduleStartDate = revisedScheduleStartDate;
        this.revisedScheduleEndDate = revisedScheduleEndDate;
        this.userId = userId;
        this.regStatus = regStatus;
        this.regTime = LocalDateTime.now();
    }
    
    // Getters and Setters
    public ProjectScheduleId getId() {
        return id;
    }
    
    public void setId(ProjectScheduleId id) {
        this.id = id;
    }
    
    public Integer getScheduleLevel() {
        return scheduleLevel;
    }
    
    public void setScheduleLevel(Integer scheduleLevel) {
        this.scheduleLevel = scheduleLevel;
    }
    
    public String getScheduleParentCode() {
        return scheduleParentCode;
    }
    
    public void setScheduleParentCode(String scheduleParentCode) {
        this.scheduleParentCode = scheduleParentCode;
    }
    
    public Integer getNumberOfDaysToRealise() {
        return numberOfDaysToRealise;
    }
    
    public void setNumberOfDaysToRealise(Integer numberOfDaysToRealise) {
        this.numberOfDaysToRealise = numberOfDaysToRealise;
    }
    
    public LocalDate getScheduleStartDate() {
        return scheduleStartDate;
    }
    
    public void setScheduleStartDate(LocalDate scheduleStartDate) {
        this.scheduleStartDate = scheduleStartDate;
    }
    
    public LocalDate getScheduleEndDate() {
        return scheduleEndDate;
    }
    
    public void setScheduleEndDate(LocalDate scheduleEndDate) {
        this.scheduleEndDate = scheduleEndDate;
    }
    
    public Integer getWeight() {
        return weight;
    }
    
    public void setWeight(Integer weight) {
        this.weight = weight;
    }
    
    public String getStatusCode() {
        return statusCode;
    }
    
    public void setStatusCode(String statusCode) {
        this.statusCode = statusCode;
    }
    
    public Integer getHierarchyOrder() {
        return hierarchyOrder;
    }
    
    public void setHierarchyOrder(Integer hierarchyOrder) {
        this.hierarchyOrder = hierarchyOrder;
    }
    
    public String getRemarks() {
        return remarks;
    }
    
    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
    
    public Integer getCompletedWeight() {
        return completedWeight;
    }
    
    public void setCompletedWeight(Integer completedWeight) {
        this.completedWeight = completedWeight;
    }
    
    public LocalDate getCompletedDate() {
        return completedDate;
    }
    
    public void setCompletedDate(LocalDate completedDate) {
        this.completedDate = completedDate;
    }
    
    public LocalDate getRevisedScheduleStartDate() {
        return revisedScheduleStartDate;
    }
    
    public void setRevisedScheduleStartDate(LocalDate revisedScheduleStartDate) {
        this.revisedScheduleStartDate = revisedScheduleStartDate;
    }
    
    public LocalDate getRevisedScheduleEndDate() {
        return revisedScheduleEndDate;
    }
    
    public void setRevisedScheduleEndDate(LocalDate revisedScheduleEndDate) {
        this.revisedScheduleEndDate = revisedScheduleEndDate;
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
    
    public LocalDateTime getRegTime() {
        return regTime;
    }
    
    public void setRegTime(LocalDateTime regTime) {
        this.regTime = regTime;
    }
}
