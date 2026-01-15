package com.pms.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SanctioningAuthorityRequest {
    private String sanctioningAuthorityCode;
    private String sanctioningAuthorityFullName;
    private String sanctioningAuthorityShortName;
    private Integer hierarchyOrder;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fromDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate toDate;
    
    private String userId;
    private String regStatus;
}
