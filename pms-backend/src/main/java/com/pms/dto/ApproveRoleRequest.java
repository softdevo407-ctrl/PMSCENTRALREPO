package com.pms.dto;

public class ApproveRoleRequest {
    private Long programmeId;
    
    // Constructors
    public ApproveRoleRequest() {}
    
    public ApproveRoleRequest(Long programmeId) {
        this.programmeId = programmeId;
    }
    
    // Getters and Setters
    public Long getProgrammeId() {
        return programmeId;
    }
    
    public void setProgrammeId(Long programmeId) {
        this.programmeId = programmeId;
    }
}
