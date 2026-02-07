package com.healthmap.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "assessments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    private String imagePath;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SiteType siteType;

    @Enumerated(EnumType.STRING)
    private BuildingAge buildingAge;

    @Column(nullable = false)
    private Boolean dustPresent = false;

    @Column(nullable = false)
    private Boolean oldMaterials = false;

    @Column(nullable = false)
    private Boolean nearPopulation = false;

    @Column(nullable = false)
    private Boolean sewageVisible = false;

    @Column(nullable = false)
    private Boolean standingWater = false;

    private String materialType;

    @Column(nullable = false)
    private Integer asbestosRisk = 0;

    @Column(nullable = false)
    private Integer waterRisk = 0;

    @Column(nullable = false)
    private Integer overallRisk = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.LOW;

    @Column(length = 1000)
    private String notes;

    private String createdBy;

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

    public enum SiteType {
        DEBRIS, WATER, BOTH
    }

    public enum BuildingAge {
        OLD, MODERN, UNKNOWN
    }

    public enum Priority {
        CRITICAL, HIGH, MEDIUM, LOW
    }
}
