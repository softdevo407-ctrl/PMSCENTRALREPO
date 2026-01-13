package com.pms.dto;

public class ProgrammeDTO {
    private Long id;
    private String programmeName;
    private String programmeCode;

    // Constructors
    public ProgrammeDTO() {}

    public ProgrammeDTO(Long id, String programmeName) {
        this.id = id;
        this.programmeName = programmeName;
    }

    public ProgrammeDTO(Long id, String programmeName, String programmeCode) {
        this.id = id;
        this.programmeName = programmeName;
        this.programmeCode = programmeCode;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProgrammeName() {
        return programmeName;
    }

    public void setProgrammeName(String programmeName) {
        this.programmeName = programmeName;
    }

    public String getProgrammeCode() {
        return programmeCode;
    }

    public void setProgrammeCode(String programmeCode) {
        this.programmeCode = programmeCode;
    }
}
