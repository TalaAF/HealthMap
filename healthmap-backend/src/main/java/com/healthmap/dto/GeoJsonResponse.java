package com.healthmap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeoJsonResponse {

    private String type;
    private List<Feature> features;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Feature {
        private String type;
        private Map<String, Object> properties;
        private Geometry geometry;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Geometry {
        private String type;
        private double[] coordinates;
    }
}
