package com.healthmap.dto;

import com.healthmap.model.Assessment.BuildingAge;
import com.healthmap.model.Assessment.SiteType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentRequest {

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String imagePath;

    @NotNull(message = "Site type is required")
    private SiteType siteType;

    private BuildingAge buildingAge;

    private Boolean dustPresent;
    private Boolean oldMaterials;
    private Boolean nearPopulation;
    private Boolean sewageVisible;
    private Boolean standingWater;

    private String notes;
    private String createdBy;
}
