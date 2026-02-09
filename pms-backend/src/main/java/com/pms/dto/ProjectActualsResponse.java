package com.pms.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProjectActualsResponse {
    
    private String missionProjectCode;
    private Integer budgetYear;
    private BigDecimal plannedCashFlow;
    private BigDecimal votedGrant;
    private BigDecimal revisedEstimates;
    private BigDecimal actualExpenditure;
    private String userId;
    private String regStatus;
    private LocalDateTime regTime;
    
    // Constructors
    public ProjectActualsResponse() {
    }
    
    public ProjectActualsResponse(String missionProjectCode, Integer budgetYear, 
                                   BigDecimal plannedCashFlow, BigDecimal votedGrant, 
                                   BigDecimal revisedEstimates, BigDecimal actualExpenditure, 
                                   String userId, String regStatus, LocalDateTime regTime) {
        this.missionProjectCode = missionProjectCode;
        this.budgetYear = budgetYear;
        this.plannedCashFlow = plannedCashFlow;
        this.votedGrant = votedGrant;
        this.revisedEstimates = revisedEstimates;
        this.actualExpenditure = actualExpenditure;
        this.userId = userId;
        this.regStatus = regStatus;
        this.regTime = regTime;
    }
    
    // Getters and Setters
    
    public String getMissionProjectCode() {
        return missionProjectCode;
    }
    
    public void setMissionProjectCode(String missionProjectCode) {
        this.missionProjectCode = missionProjectCode;
    }
    
    public Integer getBudgetYear() {
        return budgetYear;
    }
    
    public void setBudgetYear(Integer budgetYear) {
        this.budgetYear = budgetYear;
    }
    
    public BigDecimal getPlannedCashFlow() {
        return plannedCashFlow;
    }
    
    public void setPlannedCashFlow(BigDecimal plannedCashFlow) {
        this.plannedCashFlow = plannedCashFlow;
    }
    
    public BigDecimal getVotedGrant() {
        return votedGrant;
    }
    
    public void setVotedGrant(BigDecimal votedGrant) {
        this.votedGrant = votedGrant;
    }
    
    public BigDecimal getRevisedEstimates() {
        return revisedEstimates;
    }
    
    public void setRevisedEstimates(BigDecimal revisedEstimates) {
        this.revisedEstimates = revisedEstimates;
    }
    
    public BigDecimal getActualExpenditure() {
        return actualExpenditure;
    }
    
    public void setActualExpenditure(BigDecimal actualExpenditure) {
        this.actualExpenditure = actualExpenditure;
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
    
    @Override
    public String toString() {
        return "ProjectActualsResponse{" +
                "missionProjectCode='" + missionProjectCode + '\'' +
                ", budgetYear=" + budgetYear +
                ", plannedCashFlow=" + plannedCashFlow +
                ", votedGrant=" + votedGrant +
                ", revisedEstimates=" + revisedEstimates +
                ", actualExpenditure=" + actualExpenditure +
                ", userId='" + userId + '\'' +
                ", regStatus='" + regStatus + '\'' +
                ", regTime=" + regTime +
                '}';
    }
}
