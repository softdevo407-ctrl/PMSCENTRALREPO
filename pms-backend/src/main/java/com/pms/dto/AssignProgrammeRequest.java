package com.pms.dto;

public class AssignProgrammeRequest {
    private Long programmeId;
    private String programmeName;

    // Constructors
    public AssignProgrammeRequest() {}

    public AssignProgrammeRequest(Long programmeId) {
        this.programmeId = programmeId;
    }

    // Getters and Setters
    public Long getProgrammeId() {
        return programmeId;
    }

    public void setProgrammeId(Long programmeId) {
        this.programmeId = programmeId;
    }

    public String getProgrammeName() {
        return programmeName;
    }

    public void setProgrammeName(String programmeName) {
        this.programmeName = programmeName;
    }
}
