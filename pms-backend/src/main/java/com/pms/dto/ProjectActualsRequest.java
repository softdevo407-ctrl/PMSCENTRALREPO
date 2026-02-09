package com.pms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;

public class ProjectActualsRequest {
    
    @NotBlank(message = "Mission Project Code is required")
    private String missionProjectCode;
    
    @NotNull(message = "Budget Year is required")
    @Min(value = 2000, message = "Budget Year must be at least 2000")
    @Max(value = 2100, message = "Budget Year cannot exceed 2100")
    private Integer budgetYear;
    
    @DecimalMin(value = "0.00", message = "Planned Cash Flow amount must be non-negative")
    private BigDecimal plannedCashFlow;
    
    @DecimalMin(value = "0.00", message = "Voted Grant amount must be non-negative")
    private BigDecimal votedGrant;
    
    @DecimalMin(value = "0.00", message = "Revised Estimates amount must be non-negative")
    private BigDecimal revisedEstimates;
    
    @DecimalMin(value = "0.00", message = "Actual Expenditure amount must be non-negative")
    private BigDecimal actualExpenditure;
    
    @NotBlank(message = "User ID is required")
    @Max(value = 7, message = "User ID cannot exceed 7 characters")
    private String userId;
    
    @NotBlank(message = "Registration Status is required")
    private String regStatus;
    
    // Constructors
    public ProjectActualsRequest() {
    }
    
    public ProjectActualsRequest(String missionProjectCode, Integer budgetYear, BigDecimal plannedCashFlow,
                                 BigDecimal votedGrant, BigDecimal revisedEstimates, 
                                 BigDecimal actualExpenditure, String userId, String regStatus) {
        this.missionProjectCode = missionProjectCode;
        this.budgetYear = budgetYear;
        this.plannedCashFlow = plannedCashFlow;
        this.votedGrant = votedGrant;
        this.revisedEstimates = revisedEstimates;
        this.actualExpenditure = actualExpenditure;
        this.userId = userId;
        this.regStatus = regStatus;
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
    
    @Override
    public String toString() {
        return "ProjectActualsRequest{" +
                "missionProjectCode='" + missionProjectCode + '\'' +
                ", budgetYear=" + budgetYear +
                ", plannedCashFlow=" + plannedCashFlow +
                ", votedGrant=" + votedGrant +
                ", revisedEstimates=" + revisedEstimates +
                ", actualExpenditure=" + actualExpenditure +
                ", userId='" + userId + '\'' +
                ", regStatus='" + regStatus + '\'' +
                '}';
    }
}
