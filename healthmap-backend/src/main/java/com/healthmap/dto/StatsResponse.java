package com.healthmap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsResponse {

    private long totalAssessments;
    private long criticalCount;
    private long highCount;
    private long mediumCount;
    private long lowCount;

    private double averageAsbestosRisk;
    private double averageWaterRisk;
    private double averageOverallRisk;

    private Map<String, Long> riskDistribution;
    private Map<String, Long> siteTypeDistribution;
}
