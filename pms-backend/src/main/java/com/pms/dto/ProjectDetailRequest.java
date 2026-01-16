package com.pms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDetailRequest {
    
    @NotBlank(message = "Full Name is required")
    private String missionProjectFullName;
    
    @NotBlank(message = "Short Name is required")
    private String missionProjectShortName;
    
    private String missionProjectDescription;
    
    @NotBlank(message = "Budget Code is required")
    private String budgetCode;
    
    @NotBlank(message = "Programme Type is required")
    private String programmeTypeCode;
    
    @NotBlank(message = "Project Type is required")
    private String projectTypesCode;
    
    @NotBlank(message = "Lead Centre is required")
    private String leadCentreCode;
    
    @NotBlank(message = "Sanctioned Authority is required")
    private String sanctionedAuthority;
    
    @NotBlank(message = "Individual/Combined Sanction Cost is required")
    private String individualCombinedSanctionCost;
    
    @NotNull(message = "Sanctioned Cost is required")
    @Min(value = 1, message = "Sanctioned Cost must be greater than 0")
    private BigDecimal sanctionedCost;
    
    @NotNull(message = "Date of Sanction is required")
    private LocalDate dateOffs;
    
    private Integer durationInMonths;
    
    @NotNull(message = "Original Schedule is required")
    private LocalDate originalSchedule;
    
    private String fsCopy;
    
    @NotBlank(message = "Project Director is required")
    private String missionProjectDirector;
    
    @NotBlank(message = "Programme Director is required")
    private String programmeDirector;
}
