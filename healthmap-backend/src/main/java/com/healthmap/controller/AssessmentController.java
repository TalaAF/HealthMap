package com.healthmap.controller;

import com.healthmap.dto.AssessmentRequest;
import com.healthmap.dto.AssessmentResponse;
import com.healthmap.dto.GeoJsonResponse;
import com.healthmap.service.AssessmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    @PostMapping
    public ResponseEntity<AssessmentResponse> createAssessment(
            @Valid @RequestBody AssessmentRequest request) {
        AssessmentResponse response = assessmentService.createAssessment(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AssessmentResponse>> getAllAssessments() {
        List<AssessmentResponse> assessments = assessmentService.getAllAssessments();
        return ResponseEntity.ok(assessments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssessmentResponse> getAssessment(@PathVariable Long id) {
        AssessmentResponse response = assessmentService.getAssessment(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssessmentResponse> updateAssessment(
            @PathVariable Long id,
            @RequestBody AssessmentRequest request) {
        AssessmentResponse response = assessmentService.updateAssessment(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssessment(@PathVariable Long id) {
        assessmentService.deleteAssessment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/priorities")
    public ResponseEntity<List<AssessmentResponse>> getPrioritizedAssessments() {
        List<AssessmentResponse> assessments = assessmentService.getPrioritizedAssessments();
        return ResponseEntity.ok(assessments);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<AssessmentResponse>> getRecentAssessments() {
        List<AssessmentResponse> assessments = assessmentService.getRecentAssessments();
        return ResponseEntity.ok(assessments);
    }

    @GetMapping("/geojson")
    public ResponseEntity<GeoJsonResponse> getGeoJson() {
        GeoJsonResponse geoJson = assessmentService.getGeoJson();
        return ResponseEntity.ok(geoJson);
    }
}
