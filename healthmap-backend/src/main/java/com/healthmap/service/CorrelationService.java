package com.healthmap.service;

import com.healthmap.dto.CorrelationResponse;
import com.healthmap.model.Assessment;
import com.healthmap.model.HealthSignal;
import com.healthmap.repository.AssessmentRepository;
import com.healthmap.repository.HealthSignalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CorrelationService {

    private final AssessmentRepository assessmentRepository;
    private final HealthSignalRepository healthSignalRepository;

    private static final double AREA_PROXIMITY_KM = 2.0; // Consider areas within 2km as same area
    private static final int RECENT_DAYS = 30; // Last 30 days for health signals

    /**
     * Analyzes correlations between environmental risks and health signals
     */
    public CorrelationResponse analyzeCorrelations() {
        log.info("Starting environmental-health correlation analysis");

        List<Assessment> assessments = assessmentRepository.findAll();
        List<HealthSignal> recentSignals = healthSignalRepository.findRecentSignals(
                LocalDate.now().minusDays(RECENT_DAYS));

        // Group assessments and signals by area
        Map<String, List<Assessment>> assessmentsByArea = groupAssessmentsByArea(assessments);
        Map<String, List<HealthSignal>> signalsByArea = recentSignals.stream()
                .collect(Collectors.groupingBy(HealthSignal::getAreaId));

        // Build correlations for each area
        List<CorrelationResponse.AreaCorrelation> areaCorrelations = new ArrayList<>();
        Set<String> allAreas = new HashSet<>();
        allAreas.addAll(assessmentsByArea.keySet());
        allAreas.addAll(signalsByArea.keySet());

        for (String areaId : allAreas) {
            List<Assessment> areaAssessments = assessmentsByArea.getOrDefault(areaId, Collections.emptyList());
            List<HealthSignal> areaSignals = signalsByArea.getOrDefault(areaId, Collections.emptyList());
            
            CorrelationResponse.AreaCorrelation correlation = buildAreaCorrelation(
                    areaId, areaAssessments, areaSignals);
            areaCorrelations.add(correlation);
        }

        // Sort by correlation score (highest risk first)
        areaCorrelations.sort((a, b) -> Integer.compare(
                b.getCorrelationScore(), a.getCorrelationScore()));

        // Calculate overall stats
        CorrelationResponse.OverallStats overallStats = calculateOverallStats(areaCorrelations);

        log.info("Correlation analysis complete: {} areas analyzed", areaCorrelations.size());

        return CorrelationResponse.builder()
                .areaCorrelations(areaCorrelations)
                .overallStats(overallStats)
                .build();
    }

    private Map<String, List<Assessment>> groupAssessmentsByArea(List<Assessment> assessments) {
        // For now, group by proximity or use a simple grid system
        // In production, this would use actual area IDs or neighborhood names
        Map<String, List<Assessment>> grouped = new HashMap<>();
        
        for (Assessment assessment : assessments) {
            // Generate area ID based on location (simple grid)
            String areaId = generateAreaId(assessment.getLatitude(), assessment.getLongitude());
            grouped.computeIfAbsent(areaId, k -> new ArrayList<>()).add(assessment);
        }
        
        return grouped;
    }

    private String generateAreaId(Double lat, Double lon) {
        // Simple grid-based area ID (0.01 degree ~= 1km)
        int latGrid = (int) (lat / 0.01);
        int lonGrid = (int) (lon / 0.01);
        return String.format("AREA_%d_%d", latGrid, lonGrid);
    }

    private CorrelationResponse.AreaCorrelation buildAreaCorrelation(
            String areaId, 
            List<Assessment> assessments, 
            List<HealthSignal> signals) {

        // Calculate environmental risk metrics
        int assessmentCount = assessments.size();
        double avgEnvRisk = assessments.stream()
                .mapToInt(Assessment::getOverallRisk)
                .average()
                .orElse(0.0);
        
        int criticalAssessments = (int) assessments.stream()
                .filter(a -> a.getPriority() == Assessment.Priority.CRITICAL)
                .count();

        String primaryRiskType = determinePrimaryRiskType(assessments);

        // Calculate health signal metrics
        int signalCount = signals.size();
        int elevatedCount = (int) signals.stream()
                .filter(s -> s.getSignalLevel() == HealthSignal.SignalLevel.ELEVATED)
                .count();

        boolean hasRespiratory = signals.stream()
                .anyMatch(s -> s.getSignalType() == HealthSignal.SignalType.RESPIRATORY 
                        && s.getSignalLevel() == HealthSignal.SignalLevel.ELEVATED);

        boolean hasGI = signals.stream()
                .anyMatch(s -> s.getSignalType() == HealthSignal.SignalType.GASTROINTESTINAL 
                        && s.getSignalLevel() == HealthSignal.SignalLevel.ELEVATED);

        boolean hasSkin = signals.stream()
                .anyMatch(s -> s.getSignalType() == HealthSignal.SignalType.SKIN 
                        && s.getSignalLevel() == HealthSignal.SignalLevel.ELEVATED);

        // Calculate correlation score and risk level
        int correlationScore = calculateCorrelationScore(
                avgEnvRisk, elevatedCount, hasRespiratory, hasGI, hasSkin);

        String riskLevel = determineRiskLevel(correlationScore, avgEnvRisk, elevatedCount);

        // Generate recommendations
        String recommendation = generateRecommendation(
                riskLevel, primaryRiskType, hasRespiratory, hasGI, hasSkin);

        // Identify linked risks
        List<String> linkedRisks = identifyLinkedRisks(
                primaryRiskType, hasRespiratory, hasGI, hasSkin);

        // Get area name and location
        String areaName = signals.isEmpty() ? 
                (assessments.isEmpty() ? areaId : "Area " + areaId) :
                signals.get(0).getAreaName();
        
        Double latitude = signals.isEmpty() ?
                (assessments.isEmpty() ? null : assessments.get(0).getLatitude()) :
                signals.get(0).getLatitude();
        
        Double longitude = signals.isEmpty() ?
                (assessments.isEmpty() ? null : assessments.get(0).getLongitude()) :
                signals.get(0).getLongitude();

        return CorrelationResponse.AreaCorrelation.builder()
                .areaId(areaId)
                .areaName(areaName)
                .latitude(latitude)
                .longitude(longitude)
                .assessmentCount(assessmentCount)
                .averageEnvironmentalRisk(Math.round(avgEnvRisk * 10.0) / 10.0)
                .primaryRiskType(primaryRiskType)
                .criticalAssessments(criticalAssessments)
                .healthSignalCount(signalCount)
                .elevatedSignalCount(elevatedCount)
                .hasRespiratoryRisk(hasRespiratory)
                .hasGastrointestinalRisk(hasGI)
                .hasSkinRisk(hasSkin)
                .riskLevel(riskLevel)
                .correlationScore(correlationScore)
                .recommendation(recommendation)
                .linkedRisks(linkedRisks)
                .build();
    }

    private String determinePrimaryRiskType(List<Assessment> assessments) {
        if (assessments.isEmpty()) return "NONE";

        long debrisCount = assessments.stream()
                .filter(a -> a.getSiteType() == Assessment.SiteType.DEBRIS || 
                             a.getSiteType() == Assessment.SiteType.BOTH)
                .count();

        long waterCount = assessments.stream()
                .filter(a -> a.getSiteType() == Assessment.SiteType.WATER || 
                             a.getSiteType() == Assessment.SiteType.BOTH)
                .count();

        if (debrisCount > 0 && waterCount > 0) return "BOTH";
        if (debrisCount > waterCount) return "DEBRIS";
        if (waterCount > 0) return "WATER";
        return "UNKNOWN";
    }

    private int calculateCorrelationScore(
            double envRisk, 
            int elevatedSignals, 
            boolean hasResp, 
            boolean hasGI, 
            boolean hasSkin) {

        int score = 0;

        // Environmental risk component (0-50 points)
        score += Math.min(50, (int) (envRisk * 0.5));

        // Health signal component (0-50 points)
        score += elevatedSignals * 10; // 10 points per elevated signal
        
        // Bonus for specific correlations (respiratory + high env risk)
        if (hasResp && envRisk > 70) score += 20;
        if (hasGI && envRisk > 60) score += 15;
        if (hasSkin && envRisk > 50) score += 10;

        return Math.min(100, score);
    }

    private String determineRiskLevel(int correlationScore, double envRisk, int elevatedSignals) {
        if (correlationScore >= 80 || (envRisk >= 70 && elevatedSignals > 0)) {
            return "URGENT";
        } else if (correlationScore >= 60 || (envRisk >= 50 && elevatedSignals > 0)) {
            return "HIGH";
        } else if (correlationScore >= 40 || envRisk >= 40 || elevatedSignals > 0) {
            return "MEDIUM";
        } else if (correlationScore >= 20 || envRisk >= 20) {
            return "LOW";
        }
        return "NORMAL";
    }

    private String generateRecommendation(
            String riskLevel, 
            String primaryRiskType, 
            boolean hasResp, 
            boolean hasGI, 
            boolean hasSkin) {

        switch (riskLevel) {
            case "URGENT":
                if (hasResp && primaryRiskType.contains("DEBRIS")) {
                    return "URGENT: Immediate dust control and PPE required. Health impact detected.";
                } else if (hasGI && primaryRiskType.contains("WATER")) {
                    return "URGENT: Water contamination intervention needed immediately.";
                } else {
                    return "URGENT: Immediate intervention required - multiple risk factors present.";
                }
            
            case "HIGH":
                if (hasResp) return "HIGH PRIORITY: Implement dust control measures and monitor respiratory health.";
                if (hasGI) return "HIGH PRIORITY: Water testing and hygiene measures needed.";
                if (hasSkin) return "HIGH PRIORITY: Improve sanitation and hygiene conditions.";
                return "HIGH PRIORITY: Enhanced monitoring and risk mitigation required.";
            
            case "MEDIUM":
                return "Monitor closely. Environmental risk present but no health signals yet.";
            
            case "LOW":
                return "Standard monitoring adequate. Low risk factors present.";
            
            default:
                return "Continue routine assessments.";
        }
    }

    private List<String> identifyLinkedRisks(
            String primaryRiskType, 
            boolean hasResp, 
            boolean hasGI, 
            boolean hasSkin) {

        List<String> risks = new ArrayList<>();

        if (primaryRiskType.contains("DEBRIS") && hasResp) {
            risks.add("High debris risk + Respiratory signals detected");
        }
        if (primaryRiskType.contains("WATER") && hasGI) {
            risks.add("Water contamination + Gastrointestinal signals detected");
        }
        if (primaryRiskType.contains("WATER") && hasSkin) {
            risks.add("Water/hygiene issues + Skin condition signals detected");
        }
        if (hasResp && !primaryRiskType.contains("DEBRIS")) {
            risks.add("Respiratory signals present - investigate environmental causes");
        }
        if (hasGI && !primaryRiskType.contains("WATER")) {
            risks.add("Gastrointestinal signals present - check water sources");
        }

        if (risks.isEmpty()) {
            risks.add("No direct correlations detected");
        }

        return risks;
    }

    private CorrelationResponse.OverallStats calculateOverallStats(
            List<CorrelationResponse.AreaCorrelation> correlations) {

        int urgent = (int) correlations.stream()
                .filter(c -> "URGENT".equals(c.getRiskLevel()))
                .count();

        int high = (int) correlations.stream()
                .filter(c -> "HIGH".equals(c.getRiskLevel()))
                .count();

        int medium = (int) correlations.stream()
                .filter(c -> "MEDIUM".equals(c.getRiskLevel()) || "LOW".equals(c.getRiskLevel()))
                .count();

        int normal = (int) correlations.stream()
                .filter(c -> "NORMAL".equals(c.getRiskLevel()))
                .count();

        return CorrelationResponse.OverallStats.builder()
                .totalAreasAnalyzed(correlations.size())
                .urgentAreas(urgent)
                .highRiskAreas(high)
                .monitorAreas(medium)
                .normalAreas(normal)
                .build();
    }
}
