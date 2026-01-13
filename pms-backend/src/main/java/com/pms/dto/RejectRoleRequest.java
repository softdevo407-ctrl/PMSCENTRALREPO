package com.pms.dto;

public class RejectRoleRequest {
    private String rejectionReason;
    
    // Constructors
    public RejectRoleRequest() {}
    
    public RejectRoleRequest(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
    
    // Getters and Setters
    public String getRejectionReason() {
        return rejectionReason;
    }
    
    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
