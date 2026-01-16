package com.pms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectStatusCodeRequest {
    
    @NotBlank(message = "Project Status Code is required")
    private String projectStatusCode;
    
    @NotBlank(message = "Project Status Full Name is required")
    private String projectStatusFullName;
    
    @NotBlank(message = "Project Status Short Name is required")
    private String projectStatusShortName;
    
    private Integer hierarchyOrder;
    
    private LocalDate fromDate;
    
    private LocalDate toDate;
    
    @NotBlank(message = "User ID is required")
    private String userId;
    
    @NotBlank(message = "Registration Status is required")
    private String regStatus;
    
    private LocalDate regTime;
}
