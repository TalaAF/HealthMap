package com.healthmap.controller;

import com.healthmap.dto.HealthSignalRequest;
import com.healthmap.dto.HealthSignalResponse;
import com.healthmap.dto.HealthSignalStatsResponse;
import com.healthmap.service.HealthSignalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/health-signals")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class HealthSignalController {

    private final HealthSignalService healthSignalService;

    /**
     * Create a new health signal entry
     */
    @PostMapping
    public ResponseEntity<HealthSignalResponse> createHealthSignal(
            @RequestBody HealthSignalRequest request) {
        log.info("Received health signal creation request for area: {}", request.getAreaName());
        HealthSignalResponse response = healthSignalService.createHealthSignal(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all health signals
     */
    @GetMapping
    public ResponseEntity<List<HealthSignalResponse>> getAllHealthSignals() {
        List<HealthSignalResponse> signals = healthSignalService.getAllHealthSignals();
        return ResponseEntity.ok(signals);
    }

    /**
     * Get recent health signals (last N days)
     */
    @GetMapping("/recent")
    public ResponseEntity<List<HealthSignalResponse>> getRecentHealthSignals(
            @RequestParam(defaultValue = "7") int days) {
        List<HealthSignalResponse> signals = healthSignalService.getRecentHealthSignals(days);
        return ResponseEntity.ok(signals);
    }

    /**
     * Get health signals by area
     */
    @GetMapping("/area/{areaId}")
    public ResponseEntity<List<HealthSignalResponse>> getHealthSignalsByArea(
            @PathVariable String areaId) {
        List<HealthSignalResponse> signals = healthSignalService.getHealthSignalsByArea(areaId);
        return ResponseEntity.ok(signals);
    }

    /**
     * Get health signal statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<HealthSignalStatsResponse> getHealthSignalStats() {
        HealthSignalStatsResponse stats = healthSignalService.getHealthSignalStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get specific health signal by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<HealthSignalResponse> getHealthSignalById(@PathVariable Long id) {
        return healthSignalService.getHealthSignalById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a health signal
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHealthSignal(@PathVariable Long id) {
        healthSignalService.deleteHealthSignal(id);
        return ResponseEntity.noContent().build();
    }
}
