package com.healthmap.service;

import com.healthmap.model.Assessment;
import com.healthmap.model.Assessment.BuildingAge;
import com.healthmap.model.Assessment.Priority;
import org.springframework.stereotype.Service;

@Service
public class RiskCalculator {

    public void calculateRisks(Assessment assessment) {
        int asbestosRisk = calculateAsbestosRisk(assessment);
        int waterRisk = calculateWaterRisk(assessment);
        int overallRisk = calculateOverallRisk(asbestosRisk, waterRisk);
        Priority priority = determinePriority(overallRisk);
        String materialType = predictMaterialType(assessment);

        assessment.setAsbestosRisk(asbestosRisk);
        assessment.setWaterRisk(waterRisk);
        assessment.setOverallRisk(overallRisk);
        assessment.setPriority(priority);
        assessment.setMaterialType(materialType);
    }

    private int calculateAsbestosRisk(Assessment assessment) {
        int risk = 0;

        // Building age contributes significantly
        if (assessment.getBuildingAge() == BuildingAge.OLD) {
            risk += 30;
        } else if (assessment.getBuildingAge() == BuildingAge.UNKNOWN) {
            risk += 15;
        }

        // Visual indicators
        if (Boolean.TRUE.equals(assessment.getOldMaterials())) {
            risk += 25;
        }
        if (Boolean.TRUE.equals(assessment.getDustPresent())) {
            risk += 20;
        }
        if (Boolean.TRUE.equals(assessment.getNearPopulation())) {
            risk += 15;
        }

        return Math.min(risk, 100);
    }

    private int calculateWaterRisk(Assessment assessment) {
        int risk = 0;

        // Water contamination indicators
        if (Boolean.TRUE.equals(assessment.getSewageVisible())) {
            risk += 40;
        }
        if (Boolean.TRUE.equals(assessment.getStandingWater())) {
            risk += 30;
        }
        if (Boolean.TRUE.equals(assessment.getNearPopulation())) {
            risk += 20;
        }

        // Debris near water increases contamination risk
        if (Boolean.TRUE.equals(assessment.getDustPresent()) &&
            Boolean.TRUE.equals(assessment.getStandingWater())) {
            risk += 10;
        }

        return Math.min(risk, 100);
    }

    private int calculateOverallRisk(int asbestosRisk, int waterRisk) {
        // Weighted average: asbestos 60%, water 40%
        return (int) Math.round(asbestosRisk * 0.6 + waterRisk * 0.4);
    }

    private Priority determinePriority(int overallRisk) {
        if (overallRisk >= 70) {
            return Priority.CRITICAL;
        } else if (overallRisk >= 50) {
            return Priority.HIGH;
        } else if (overallRisk >= 30) {
            return Priority.MEDIUM;
        } else {
            return Priority.LOW;
        }
    }

    private String predictMaterialType(Assessment assessment) {
        if (assessment.getBuildingAge() == BuildingAge.OLD &&
            Boolean.TRUE.equals(assessment.getOldMaterials())) {
            return "Asbestos-containing materials likely";
        } else if (assessment.getBuildingAge() == BuildingAge.OLD) {
            return "Old cement/concrete";
        } else if (assessment.getBuildingAge() == BuildingAge.MODERN) {
            return "Modern concrete";
        } else {
            return "Mixed/Unknown materials";
        }
    }

    public String generateRecommendation(Assessment assessment) {
        StringBuilder recommendation = new StringBuilder();

        if (assessment.getPriority() == Priority.CRITICAL) {
            recommendation.append("URGENT: Immediate intervention required. ");
        } else if (assessment.getPriority() == Priority.HIGH) {
            recommendation.append("HIGH PRIORITY: Schedule intervention within 48 hours. ");
        }

        if (assessment.getAsbestosRisk() >= 50) {
            recommendation.append("Asbestos testing recommended before any cleanup. ");
            recommendation.append("Use PPE and wet methods to suppress dust. ");
        }

        if (assessment.getWaterRisk() >= 50) {
            recommendation.append("Water quality testing required. ");
            if (Boolean.TRUE.equals(assessment.getSewageVisible())) {
                recommendation.append("Sewage remediation needed. ");
            }
        }

        if (Boolean.TRUE.equals(assessment.getNearPopulation())) {
            recommendation.append("Evacuate or restrict access to affected population. ");
        }

        if (recommendation.length() == 0) {
            recommendation.append("Monitor site. Schedule routine assessment.");
        }

        return recommendation.toString().trim();
    }
}
