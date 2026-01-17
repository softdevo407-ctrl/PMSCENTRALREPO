package com.pms.entity;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ProjectScheduleId implements Serializable {
    
    @Column(name = "missionprojectcode", length = 8, nullable = false)
    private String missionProjectCode;
    
    @Column(name = "schedulecode", length = 5, nullable = false)
    private String scheduleCode;
    
    public ProjectScheduleId() {
    }
    
    public ProjectScheduleId(String missionProjectCode, String scheduleCode) {
        this.missionProjectCode = missionProjectCode;
        this.scheduleCode = scheduleCode;
    }
    
    public String getMissionProjectCode() {
        return missionProjectCode;
    }
    
    public void setMissionProjectCode(String missionProjectCode) {
        this.missionProjectCode = missionProjectCode;
    }
    
    public String getScheduleCode() {
        return scheduleCode;
    }
    
    public void setScheduleCode(String scheduleCode) {
        this.scheduleCode = scheduleCode;
    }
    
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ProjectScheduleId that = (ProjectScheduleId) o;
        return Objects.equals(missionProjectCode, that.missionProjectCode) &&
               Objects.equals(scheduleCode, that.scheduleCode);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(missionProjectCode, scheduleCode);
    }
}
