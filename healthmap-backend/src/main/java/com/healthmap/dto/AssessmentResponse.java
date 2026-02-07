package com.healthmap.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentResponse {

    private Long id;
    private Double latitude;
    private Double longitude;
    private String imagePath;
    private String siteType;
    private String buildingAge;

    private Boolean dustPresent;
    private Boolean oldMaterials;
    private Boolean nearPopulation;
    private Boolean sewageVisible;
    private Boolean standingWater;

    private String materialType;
    private Integer asbestosRisk;
    private Integer waterRisk;
    private Integer overallRisk;
    private String priority;
    private String recommendation;

    private String notes;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
