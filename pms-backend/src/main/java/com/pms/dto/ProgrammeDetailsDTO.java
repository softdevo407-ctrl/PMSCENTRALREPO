package com.pms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgrammeDetailsDTO {
    private Long id;
    private String programmeName;
    private String description;
    private Long budget;
    private String status;
    private String startDate;
    private String endDate;
    private Integer totalProjects;
    private Integer activeProjects;
}
