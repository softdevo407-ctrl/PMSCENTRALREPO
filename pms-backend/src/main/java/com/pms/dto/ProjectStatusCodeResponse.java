package com.pms.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectStatusCodeResponse {
    
    private String projectStatusCode;
    private String projectStatusFullName;
    private String projectStatusShortName;
    private Integer hierarchyOrder;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String userId;
    private String regStatus;
    private LocalDate regTime;
}
