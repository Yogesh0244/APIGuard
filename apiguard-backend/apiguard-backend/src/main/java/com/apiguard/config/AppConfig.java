package com.apiguard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.client.RestTemplate;

/**
 * General purpose beans used across the app.
 * @EnableAsync allows the request-logging step in GatewayService to run
 * off the request thread so it never slows down the response to the caller.
 */
@Configuration
@EnableAsync
public class AppConfig {

    /**
     * Used by the GatewayService to actually forward requests to the
     * real backend service registered as an ApiResource.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
