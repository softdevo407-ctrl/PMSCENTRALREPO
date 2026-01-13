package com.pms.dto;

import java.time.LocalDateTime;

public class PendingRoleRequestDTO {
    private Long id;
    private String employeeName;
    private String employeeCode;
    private String requestedRole;
    private LocalDateTime submissionDate;
    private String status; // PENDING, APPROVED, REJECTED

    // Constructors
    public PendingRoleRequestDTO() {}

    public PendingRoleRequestDTO(Long id, String employeeName, String employeeCode,
                                String requestedRole, LocalDateTime submissionDate, String status) {
        this.id = id;
        this.employeeName = employeeName;
        this.employeeCode = employeeCode;
        this.requestedRole = requestedRole;
        this.submissionDate = submissionDate;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getRequestedRole() {
        return requestedRole;
    }

    public void setRequestedRole(String requestedRole) {
        this.requestedRole = requestedRole;
    }

    public LocalDateTime getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(LocalDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
