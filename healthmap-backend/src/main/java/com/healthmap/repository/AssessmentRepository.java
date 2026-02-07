package com.healthmap.repository;

import com.healthmap.model.Assessment;
import com.healthmap.model.Assessment.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {

    List<Assessment> findByPriority(Priority priority);

    List<Assessment> findAllByOrderByOverallRiskDesc();

    List<Assessment> findByPriorityIn(List<Priority> priorities);

    @Query("SELECT COUNT(a) FROM Assessment a WHERE a.priority = :priority")
    long countByPriority(Priority priority);

    @Query("SELECT a FROM Assessment a WHERE a.overallRisk >= :minRisk ORDER BY a.overallRisk DESC")
    List<Assessment> findHighRiskSites(int minRisk);

    List<Assessment> findTop10ByOrderByCreatedAtDesc();
}
