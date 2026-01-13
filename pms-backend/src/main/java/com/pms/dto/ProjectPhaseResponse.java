package com.pms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectPhaseResponse {
    private Long id;
    private Long projectId;
    private String phaseName;
    private Integer phaseWeight;
    private String status;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private List<MilestoneResponse> milestones;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MilestoneResponse {
        private Long id;
        private Long phaseId;
        private String milestoneName;
        private LocalDate startDate;
        private LocalDate endDate;
        private LocalDate revisedEndDate;
        private Integer milestoneWeight;
        private Integer milestoneOrder;
        private String status;
        private LocalDateTime createdDate;
        private LocalDateTime updatedDate;
        private List<ActivityResponse> activities;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class ActivityResponse {
            private Long id;
            private Long milestoneId;
            private String activityName;
            private Integer activityWeight;
            private LocalDate startDate;
            private LocalDate endDate;
            private LocalDate revisedEndDate;
            private String status;
            private String description;
            private LocalDateTime createdDate;
            private LocalDateTime updatedDate;
        }
    }
}
