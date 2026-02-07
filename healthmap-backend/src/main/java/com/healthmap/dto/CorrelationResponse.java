package com.healthmap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Response DTO for environmental-health correlations
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CorrelationResponse {

    private List<AreaCorrelation> areaCorrelations;
    private OverallStats overallStats;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AreaCorrelation {
        private String areaId;
        private String areaName;
        private Double latitude;
        private Double longitude;
        
        // Environmental risk data
        private Integer assessmentCount;
        private Double averageEnvironmentalRisk;
        private String primaryRiskType; // DEBRIS, WATER, BOTH
        private Integer criticalAssessments;
        
        // Health signal data
        private Integer healthSignalCount;
        private Integer elevatedSignalCount;
        private Boolean hasRespiratoryRisk;
        private Boolean hasGastrointestinalRisk;
        private Boolean hasSkinRisk;
        
        // Correlation analysis
        private String riskLevel; // URGENT, HIGH, MEDIUM, LOW, NORMAL
        private Integer correlationScore; // 0-100
        private String recommendation;
        private List<String> linkedRisks; // e.g., "High debris + Respiratory signals"
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OverallStats {
        private Integer totalAreasAnalyzed;
        private Integer urgentAreas; // Both environmental and health risks
        private Integer highRiskAreas; // One type elevated
        private Integer monitorAreas; // Low risk but requires monitoring
        private Integer normalAreas;
    }
}
