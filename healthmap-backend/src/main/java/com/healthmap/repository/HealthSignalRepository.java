package com.healthmap.repository;

import com.healthmap.model.HealthSignal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HealthSignalRepository extends JpaRepository<HealthSignal, Long> {

    List<HealthSignal> findByAreaIdOrderBySignalDateDesc(String areaId);

    List<HealthSignal> findBySignalDateBetweenOrderBySignalDateDesc(LocalDate startDate, LocalDate endDate);

    List<HealthSignal> findBySignalTypeAndSignalLevel(
            HealthSignal.SignalType signalType,
            HealthSignal.SignalLevel signalLevel
    );

    @Query("SELECT COUNT(h) FROM HealthSignal h WHERE h.signalLevel = 'ELEVATED'")
    Long countElevatedSignals();

    @Query("SELECT h FROM HealthSignal h WHERE h.signalDate >= :startDate ORDER BY h.signalDate DESC")
    List<HealthSignal> findRecentSignals(@Param("startDate") LocalDate startDate);

    List<HealthSignal> findTop10ByOrderByCreatedAtDesc();

    @Query("SELECT DISTINCT h.areaId FROM HealthSignal h WHERE h.signalLevel = 'ELEVATED'")
    List<String> findAreasWithElevatedSignals();
}
