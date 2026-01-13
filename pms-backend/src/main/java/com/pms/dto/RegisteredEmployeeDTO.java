package com.pms.dto;

import java.time.LocalDateTime;

public class RegisteredEmployeeDTO {
    private Long id;
    private String employeeName;
    private String employeeCode;
    private String assignedRole;
    private String assignedProgramme;
    private String approvalStatus;
    private LocalDateTime submissionDate;

    // Constructors
    public RegisteredEmployeeDTO() {}

    public RegisteredEmployeeDTO(Long id, String employeeName, String employeeCode, 
                                String assignedRole, String assignedProgramme, 
                                String approvalStatus, LocalDateTime submissionDate) {
        this.id = id;
        this.employeeName = employeeName;
        this.employeeCode = employeeCode;
        this.assignedRole = assignedRole;
        this.assignedProgramme = assignedProgramme;
        this.approvalStatus = approvalStatus;
        this.submissionDate = submissionDate;
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

    public String getAssignedRole() {
        return assignedRole;
    }

    public void setAssignedRole(String assignedRole) {
        this.assignedRole = assignedRole;
    }

    public String getAssignedProgramme() {
        return assignedProgramme;
    }

    public void setAssignedProgramme(String assignedProgramme) {
        this.assignedProgramme = assignedProgramme;
    }

    public String getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public LocalDateTime getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(LocalDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }
}
