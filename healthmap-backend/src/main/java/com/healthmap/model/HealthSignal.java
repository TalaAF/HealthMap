package com.healthmap.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Health Signal Module - Public Health Early Warning System
 * This module provides public health signals, not clinical diagnoses.
 * It monitors unusual patterns in community health to support early intervention.
 */
@Entity
@Table(name = "health_signals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthSignal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Geographic area/neighborhood identifier
     * Links to assessment areas for environmental correlation
     */
    @Column(nullable = false)
    private String areaId;

    @Column(nullable = false)
    private String areaName;

    @Column(nullable = false)
    private LocalDate signalDate;

    /**
     * Type of health signal observed
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SignalType signalType;

    /**
     * Level of observed cases compared to normal
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SignalLevel signalLevel;

    /**
     * Source of the health signal data
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SignalSource source;

    @Column(length = 1000)
    private String notes;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String reportedBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Core health signal types
     */
    public enum SignalType {
        RESPIRATORY("Respiratory", "🔴", "Dust, debris, old materials"),
        GASTROINTESTINAL("Gastrointestinal", "🟠", "Contaminated water, sewage"),
        SKIN("Skin", "🟡", "Water contamination, hygiene conditions");

        private final String displayName;
        private final String icon;
        private final String relatedFactors;

        SignalType(String displayName, String icon, String relatedFactors) {
            this.displayName = displayName;
            this.icon = icon;
            this.relatedFactors = relatedFactors;
        }

        public String getDisplayName() {
            return displayName;
        }

        public String getIcon() {
            return icon;
        }

        public String getRelatedFactors() {
            return relatedFactors;
        }
    }

    /**
     * Signal level compared to normal baseline
     */
    public enum SignalLevel {
        NORMAL("Normal", "🟢"),
        ELEVATED("Elevated", "🔴");

        private final String displayName;
        private final String icon;

        SignalLevel(String displayName, String icon) {
            this.displayName = displayName;
            this.icon = icon;
        }

        public String getDisplayName() {
            return displayName;
        }

        public String getIcon() {
            return icon;
        }
    }

    /**
     * Source of health signal data
     */
    public enum SignalSource {
        CLINIC("Clinic"),
        FIELD_TEAM("Field Team"),
        MOBILE_UNIT("Mobile Unit"),
        ORGANIZATION("Organization");

        private final String displayName;

        SignalSource(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}
