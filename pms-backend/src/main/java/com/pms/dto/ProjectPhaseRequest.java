package com.pms.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectPhaseRequest {
    @NotBlank(message = "Phase name is required")
    private String phaseName;

    @NotNull(message = "Phase weight is required")
    @Min(value = 0, message = "Weight must be at least 0")
    @Max(value = 100, message = "Weight cannot exceed 100")
    private Integer phaseWeight;

    @NotEmpty(message = "At least one milestone is required")
    private List<MilestoneRequest> milestones;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MilestoneRequest {
        @NotBlank(message = "Milestone name is required")
        private String milestoneName;

        @NotNull(message = "Start date is required")
        private LocalDate startDate;

        @NotNull(message = "End date is required")
        private LocalDate endDate;

        private LocalDate revisedEndDate;

        private Integer milestoneOrder = 0;

        @NotNull(message = "Milestone weight is required")
        @Min(value = 0, message = "Weight must be at least 0")
        @Max(value = 100, message = "Weight cannot exceed 100")
        private Integer milestoneWeight;

        @NotEmpty(message = "At least one activity is required")
        private List<ActivityRequest> activities;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        @Builder
        public static class ActivityRequest {
            @NotBlank(message = "Activity name is required")
            private String activityName;

            @NotNull(message = "Activity weight is required")
            @Min(value = 0, message = "Weight must be at least 0")
            @Max(value = 100, message = "Weight cannot exceed 100")
            private Integer activityWeight;

            @NotNull(message = "Start date is required")
            private LocalDate startDate;

            @NotNull(message = "End date is required")
            private LocalDate endDate;

            private LocalDate revisedEndDate;

            private String description;
        }
    }
}
