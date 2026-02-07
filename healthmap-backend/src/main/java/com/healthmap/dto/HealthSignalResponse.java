package com.healthmap.dto;

import com.healthmap.model.HealthSignal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthSignalResponse {

    private Long id;
    private String areaId;
    private String areaName;
    private LocalDate signalDate;
    private HealthSignal.SignalType signalType;
    private String signalTypeDisplay;
    private String signalTypeIcon;
    private HealthSignal.SignalLevel signalLevel;
    private String signalLevelDisplay;
    private String signalLevelIcon;
    private HealthSignal.SignalSource source;
    private String sourceDisplay;
    private String notes;
    private Double latitude;
    private Double longitude;
    private String reportedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static HealthSignalResponse fromEntity(HealthSignal signal) {
        return HealthSignalResponse.builder()
                .id(signal.getId())
                .areaId(signal.getAreaId())
                .areaName(signal.getAreaName())
                .signalDate(signal.getSignalDate())
                .signalType(signal.getSignalType())
                .signalTypeDisplay(signal.getSignalType().getDisplayName())
                .signalTypeIcon(signal.getSignalType().getIcon())
                .signalLevel(signal.getSignalLevel())
                .signalLevelDisplay(signal.getSignalLevel().getDisplayName())
                .signalLevelIcon(signal.getSignalLevel().getIcon())
                .source(signal.getSource())
                .sourceDisplay(signal.getSource().getDisplayName())
                .notes(signal.getNotes())
                .latitude(signal.getLatitude())
                .longitude(signal.getLongitude())
                .reportedBy(signal.getReportedBy())
                .createdAt(signal.getCreatedAt())
                .updatedAt(signal.getUpdatedAt())
                .build();
    }
}
