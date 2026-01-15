package com.pms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDetailsResponse {

    private String employeeCode;
    private String name;
    private String presentDesignationFullName;
    private String centre;
    private String userId;
    private String regStatus;
    private String regTime;
}
