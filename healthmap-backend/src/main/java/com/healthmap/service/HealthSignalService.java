package com.healthmap.service;

import com.healthmap.dto.HealthSignalRequest;
import com.healthmap.dto.HealthSignalResponse;
import com.healthmap.dto.HealthSignalStatsResponse;
import com.healthmap.model.HealthSignal;
import com.healthmap.repository.HealthSignalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class HealthSignalService {

    private final HealthSignalRepository healthSignalRepository;

    @Transactional
    public HealthSignalResponse createHealthSignal(HealthSignalRequest request) {
        log.info("Creating health signal for area: {}, type: {}", 
                request.getAreaName(), request.getSignalType());

        HealthSignal signal = HealthSignal.builder()
                .areaId(request.getAreaId())
                .areaName(request.getAreaName())
                .signalDate(request.getSignalDate() != null ? request.getSignalDate() : LocalDate.now())
                .signalType(request.getSignalType())
                .signalLevel(request.getSignalLevel())
                .source(request.getSource())
                .notes(request.getNotes())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .reportedBy(request.getReportedBy())
                .build();

        HealthSignal saved = healthSignalRepository.save(signal);
        log.info("Health signal created with ID: {}", saved.getId());

        return HealthSignalResponse.fromEntity(saved);
    }

    public List<HealthSignalResponse> getAllHealthSignals() {
        return healthSignalRepository.findAll().stream()
                .map(HealthSignalResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<HealthSignalResponse> getRecentHealthSignals(int days) {
        LocalDate startDate = LocalDate.now().minusDays(days);
        return healthSignalRepository.findRecentSignals(startDate).stream()
                .map(HealthSignalResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<HealthSignalResponse> getHealthSignalsByArea(String areaId) {
        return healthSignalRepository.findByAreaIdOrderBySignalDateDesc(areaId).stream()
                .map(HealthSignalResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public HealthSignalStatsResponse getHealthSignalStats() {
        List<HealthSignal> allSignals = healthSignalRepository.findAll();

        long totalSignals = allSignals.size();
        long elevatedSignals = allSignals.stream()
                .filter(s -> s.getSignalLevel() == HealthSignal.SignalLevel.ELEVATED)
                .count();
        long normalSignals = totalSignals - elevatedSignals;

        // Signals by type
        Map<String, Long> signalsByType = allSignals.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getSignalType().getDisplayName(),
                        Collectors.counting()
                ));

        // Elevated by type
        Map<String, Long> elevatedByType = allSignals.stream()
                .filter(s -> s.getSignalLevel() == HealthSignal.SignalLevel.ELEVATED)
                .collect(Collectors.groupingBy(
                        s -> s.getSignalType().getDisplayName(),
                        Collectors.counting()
                ));

        // Signals by area
        Map<String, HealthSignalStatsResponse.AreaSignalSummary> signalsByArea = 
                allSignals.stream()
                .collect(Collectors.groupingBy(HealthSignal::getAreaId))
                .entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> buildAreaSummary(entry.getValue())
                ));

        return HealthSignalStatsResponse.builder()
                .totalSignals(totalSignals)
                .elevatedSignals(elevatedSignals)
                .normalSignals(normalSignals)
                .signalsByType(signalsByType)
                .elevatedByType(elevatedByType)
                .signalsByArea(signalsByArea)
                .build();
    }

    private HealthSignalStatsResponse.AreaSignalSummary buildAreaSummary(List<HealthSignal> signals) {
        if (signals.isEmpty()) {
            return null;
        }

        String areaName = signals.get(0).getAreaName();
        long totalSignals = signals.size();

        long respiratoryElevated = signals.stream()
                .filter(s -> s.getSignalType() == HealthSignal.SignalType.RESPIRATORY 
                        && s.getSignalLevel() == HealthSignal.SignalLevel.ELEVATED)
                .count();

        long gastrointestinalElevated = signals.stream()
                .filter(s -> s.getSignalType() == HealthSignal.SignalType.GASTROINTESTINAL 
                        && s.getSignalLevel() == HealthSignal.SignalLevel.ELEVATED)
                .count();

        long skinElevated = signals.stream()
                .filter(s -> s.getSignalType() == HealthSignal.SignalType.SKIN 
                        && s.getSignalLevel() == HealthSignal.SignalLevel.ELEVATED)
                .count();

        boolean hasRisk = respiratoryElevated > 0 || gastrointestinalElevated > 0 || skinElevated > 0;

        return HealthSignalStatsResponse.AreaSignalSummary.builder()
                .areaName(areaName)
                .totalSignals(totalSignals)
                .respiratoryElevated(respiratoryElevated)
                .gastrointestinalElevated(gastrointestinalElevated)
                .skinElevated(skinElevated)
                .hasRisk(hasRisk)
                .build();
    }

    public Optional<HealthSignalResponse> getHealthSignalById(Long id) {
        return healthSignalRepository.findById(id)
                .map(HealthSignalResponse::fromEntity);
    }

    @Transactional
    public void deleteHealthSignal(Long id) {
        log.info("Deleting health signal with ID: {}", id);
        healthSignalRepository.deleteById(id);
    }
}
