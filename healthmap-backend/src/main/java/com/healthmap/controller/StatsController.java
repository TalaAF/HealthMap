package com.healthmap.controller;

import com.healthmap.dto.CorrelationResponse;
import com.healthmap.dto.StatsResponse;
import com.healthmap.model.Assessment;
import com.healthmap.model.Assessment.Priority;
import com.healthmap.repository.AssessmentRepository;
import com.healthmap.service.CorrelationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final AssessmentRepository assessmentRepository;
    private final CorrelationService correlationService;

    @GetMapping
    public ResponseEntity<StatsResponse> getStats() {
        List<Assessment> assessments = assessmentRepository.findAll();

        long total = assessments.size();
        long critical = assessmentRepository.countByPriority(Priority.CRITICAL);
        long high = assessmentRepository.countByPriority(Priority.HIGH);
        long medium = assessmentRepository.countByPriority(Priority.MEDIUM);
        long low = assessmentRepository.countByPriority(Priority.LOW);

        double avgAsbestos = assessments.stream()
                .mapToInt(Assessment::getAsbestosRisk)
                .average()
                .orElse(0.0);

        double avgWater = assessments.stream()
                .mapToInt(Assessment::getWaterRisk)
                .average()
                .orElse(0.0);

        double avgOverall = assessments.stream()
                .mapToInt(Assessment::getOverallRisk)
                .average()
                .orElse(0.0);

        Map<String, Long> riskDistribution = new HashMap<>();
        riskDistribution.put("CRITICAL", critical);
        riskDistribution.put("HIGH", high);
        riskDistribution.put("MEDIUM", medium);
        riskDistribution.put("LOW", low);

        Map<String, Long> siteTypeDistribution = new HashMap<>();
        siteTypeDistribution.put("DEBRIS", assessments.stream()
                .filter(a -> a.getSiteType() == Assessment.SiteType.DEBRIS)
                .count());
        siteTypeDistribution.put("WATER", assessments.stream()
                .filter(a -> a.getSiteType() == Assessment.SiteType.WATER)
                .count());
        siteTypeDistribution.put("BOTH", assessments.stream()
                .filter(a -> a.getSiteType() == Assessment.SiteType.BOTH)
                .count());

        StatsResponse response = StatsResponse.builder()
                .totalAssessments(total)
                .criticalCount(critical)
                .highCount(high)
                .mediumCount(medium)
                .lowCount(low)
                .averageAsbestosRisk(Math.round(avgAsbestos * 10.0) / 10.0)
                .averageWaterRisk(Math.round(avgWater * 10.0) / 10.0)
                .averageOverallRisk(Math.round(avgOverall * 10.0) / 10.0)
                .riskDistribution(riskDistribution)
                .siteTypeDistribution(siteTypeDistribution)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/risk-distribution")
    public ResponseEntity<Map<String, Long>> getRiskDistribution() {
        Map<String, Long> distribution = new HashMap<>();
        distribution.put("CRITICAL", assessmentRepository.countByPriority(Priority.CRITICAL));
        distribution.put("HIGH", assessmentRepository.countByPriority(Priority.HIGH));
        distribution.put("MEDIUM", assessmentRepository.countByPriority(Priority.MEDIUM));
        distribution.put("LOW", assessmentRepository.countByPriority(Priority.LOW));
        return ResponseEntity.ok(distribution);
    }

    /**
     * Get environmental-health correlations
     */
    @GetMapping("/correlations")
    public ResponseEntity<CorrelationResponse> getCorrelations() {
        CorrelationResponse correlations = correlationService.analyzeCorrelations();
        return ResponseEntity.ok(correlations);
    }
}
