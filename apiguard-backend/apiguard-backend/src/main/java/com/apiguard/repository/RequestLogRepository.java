package com.apiguard.repository;

import com.apiguard.entity.RequestLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface RequestLogRepository extends JpaRepository<RequestLog, Long> {

    long countByStatusCodeGreaterThanEqual(int statusCode);

    List<RequestLog> findByApiKeyIdOrderByTimestampDesc(Long apiKeyId);

    List<RequestLog> findByApiResourceIdOrderByTimestampDesc(Long apiResourceId);

    @Query("SELECT AVG(r.responseTimeMs) FROM RequestLog r")
    Double findAverageResponseTime();

    @Query("SELECT r.apiResource.name, COUNT(r) FROM RequestLog r GROUP BY r.apiResource.name ORDER BY COUNT(r) DESC")
    List<Object[]> countRequestsGroupedByApi();

    @Query("SELECT FUNCTION('DATE', r.timestamp), COUNT(r) FROM RequestLog r " +
           "WHERE r.timestamp >= :since GROUP BY FUNCTION('DATE', r.timestamp) ORDER BY FUNCTION('DATE', r.timestamp)")
    List<Object[]> countRequestsPerDaySince(@Param("since") LocalDateTime since);

    long countByTimestampBetween(LocalDateTime start, LocalDateTime end);
}
