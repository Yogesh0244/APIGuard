package com.apiguard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * ApiGuard - API Gateway & Management Platform
 *
 * Entry point of the application. @EnableScheduling turns on the
 * scheduled jobs used for health-checks and daily usage reports.
 */
@SpringBootApplication
@EnableScheduling
public class ApiGuardApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGuardApplication.class, args);
    }
}
