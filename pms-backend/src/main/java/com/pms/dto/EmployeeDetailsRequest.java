package com.pms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDetailsRequest {

    @NotBlank(message = "Employee code is required")
    @Size(max = 7, message = "Employee code cannot exceed 7 characters")
    private String employeeCode;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Designation is required")
    @Size(max = 100, message = "Designation cannot exceed 100 characters")
    private String presentDesignationFullName;

    @NotBlank(message = "Centre is required")
    @Size(max = 20, message = "Centre cannot exceed 20 characters")
    private String centre;

    @NotBlank(message = "User ID is required")
    @Size(max = 7, message = "User ID cannot exceed 7 characters")
    private String userId;

    @NotBlank(message = "Status is required")
    @Size(max = 1, message = "Status must be a single character")
    private String regStatus;

    private String regTime;
}
