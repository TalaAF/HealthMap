package com.healthmap.dto;

import com.healthmap.model.HealthSignal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthSignalRequest {

    private String areaId;
    private String areaName;
    private LocalDate signalDate;
    private HealthSignal.SignalType signalType;
    private HealthSignal.SignalLevel signalLevel;
    private HealthSignal.SignalSource source;
    private String notes;
    private Double latitude;
    private Double longitude;
    private String reportedBy;
}
