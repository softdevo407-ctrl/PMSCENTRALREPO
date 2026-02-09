package com.pms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryStatDTO {
    private String projectCategoryCode;
    private String projectCategoryFullName;
    private String projectCategoryShortName;
    private int projectCount;
    private int onTrackCount;
    private int delayedCount;
    private double totalSanctionedCost;
    private double totalCumulativeExpenditure;
}
