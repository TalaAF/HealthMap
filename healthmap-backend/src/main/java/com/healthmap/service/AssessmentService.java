package com.healthmap.service;

import com.healthmap.dto.AssessmentRequest;
import com.healthmap.dto.AssessmentResponse;
import com.healthmap.dto.GeoJsonResponse;
import com.healthmap.model.Assessment;
import com.healthmap.model.Assessment.Priority;
import com.healthmap.repository.AssessmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;
    private final RiskCalculator riskCalculator;

    @Transactional
    public AssessmentResponse createAssessment(AssessmentRequest request) {
        Assessment assessment = Assessment.builder()
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .imagePath(request.getImagePath())
                .siteType(request.getSiteType())
                .buildingAge(request.getBuildingAge())
                .dustPresent(request.getDustPresent() != null ? request.getDustPresent() : false)
                .oldMaterials(request.getOldMaterials() != null ? request.getOldMaterials() : false)
                .nearPopulation(request.getNearPopulation() != null ? request.getNearPopulation() : false)
                .sewageVisible(request.getSewageVisible() != null ? request.getSewageVisible() : false)
                .standingWater(request.getStandingWater() != null ? request.getStandingWater() : false)
                .notes(request.getNotes())
                .createdBy(request.getCreatedBy())
                .build();

        riskCalculator.calculateRisks(assessment);
        Assessment saved = assessmentRepository.save(assessment);
        return toResponse(saved);
    }

    public List<AssessmentResponse> getAllAssessments() {
        return assessmentRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AssessmentResponse getAssessment(Long id) {
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found with id: " + id));
        return toResponse(assessment);
    }

    @Transactional
    public AssessmentResponse updateAssessment(Long id, AssessmentRequest request) {
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assessment not found with id: " + id));

        if (request.getLatitude() != null) assessment.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) assessment.setLongitude(request.getLongitude());
        if (request.getImagePath() != null) assessment.setImagePath(request.getImagePath());
        if (request.getSiteType() != null) assessment.setSiteType(request.getSiteType());
        if (request.getBuildingAge() != null) assessment.setBuildingAge(request.getBuildingAge());
        if (request.getDustPresent() != null) assessment.setDustPresent(request.getDustPresent());
        if (request.getOldMaterials() != null) assessment.setOldMaterials(request.getOldMaterials());
        if (request.getNearPopulation() != null) assessment.setNearPopulation(request.getNearPopulation());
        if (request.getSewageVisible() != null) assessment.setSewageVisible(request.getSewageVisible());
        if (request.getStandingWater() != null) assessment.setStandingWater(request.getStandingWater());
        if (request.getNotes() != null) assessment.setNotes(request.getNotes());

        riskCalculator.calculateRisks(assessment);
        Assessment saved = assessmentRepository.save(assessment);
        return toResponse(saved);
    }

    @Transactional
    public void deleteAssessment(Long id) {
        if (!assessmentRepository.existsById(id)) {
            throw new RuntimeException("Assessment not found with id: " + id);
        }
        assessmentRepository.deleteById(id);
    }

    public List<AssessmentResponse> getPrioritizedAssessments() {
        return assessmentRepository.findAllByOrderByOverallRiskDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<AssessmentResponse> getRecentAssessments() {
        return assessmentRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public GeoJsonResponse getGeoJson() {
        List<Assessment> assessments = assessmentRepository.findAll();
        List<GeoJsonResponse.Feature> features = new ArrayList<>();

        for (Assessment a : assessments) {
            Map<String, Object> properties = new HashMap<>();
            properties.put("id", a.getId());
            properties.put("siteType", a.getSiteType().name());
            properties.put("overallRisk", a.getOverallRisk());
            properties.put("asbestosRisk", a.getAsbestosRisk());
            properties.put("waterRisk", a.getWaterRisk());
            properties.put("priority", a.getPriority().name());
            properties.put("materialType", a.getMaterialType());
            properties.put("imagePath", a.getImagePath());

            GeoJsonResponse.Geometry geometry = new GeoJsonResponse.Geometry(
                    "Point",
                    new double[]{a.getLongitude(), a.getLatitude()}
            );

            features.add(new GeoJsonResponse.Feature("Feature", properties, geometry));
        }

        return new GeoJsonResponse("FeatureCollection", features);
    }

    private AssessmentResponse toResponse(Assessment assessment) {
        return AssessmentResponse.builder()
                .id(assessment.getId())
                .latitude(assessment.getLatitude())
                .longitude(assessment.getLongitude())
                .imagePath(assessment.getImagePath())
                .siteType(assessment.getSiteType().name())
                .buildingAge(assessment.getBuildingAge() != null ? assessment.getBuildingAge().name() : null)
                .dustPresent(assessment.getDustPresent())
                .oldMaterials(assessment.getOldMaterials())
                .nearPopulation(assessment.getNearPopulation())
                .sewageVisible(assessment.getSewageVisible())
                .standingWater(assessment.getStandingWater())
                .materialType(assessment.getMaterialType())
                .asbestosRisk(assessment.getAsbestosRisk())
                .waterRisk(assessment.getWaterRisk())
                .overallRisk(assessment.getOverallRisk())
                .priority(assessment.getPriority().name())
                .notes(assessment.getNotes())
                .recommendation(riskCalculator.generateRecommendation(assessment))
                .createdBy(assessment.getCreatedBy())
                .createdAt(assessment.getCreatedAt())
                .updatedAt(assessment.getUpdatedAt())
                .build();
    }
}
