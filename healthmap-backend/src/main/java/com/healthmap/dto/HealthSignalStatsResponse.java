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
public class HealthSignalStatsResponse {

    private Long totalSignals;
    private Long elevatedSignals;
    private Long normalSignals;
    private Map<String, Long> signalsByType;
    private Map<String, Long> elevatedByType;
    private Map<String, AreaSignalSummary> signalsByArea;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AreaSignalSummary {
        private String areaName;
        private Long totalSignals;
        private Long respiratoryElevated;
        private Long gastrointestinalElevated;
        private Long skinElevated;
        private Boolean hasRisk;
    }
}
