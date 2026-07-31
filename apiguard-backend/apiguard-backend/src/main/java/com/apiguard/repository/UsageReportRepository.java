package com.apiguard.repository;

import com.apiguard.entity.UsageReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UsageReportRepository extends JpaRepository<UsageReport, Long> {
    List<UsageReport> findAllByOrderByReportDateDesc();
}
