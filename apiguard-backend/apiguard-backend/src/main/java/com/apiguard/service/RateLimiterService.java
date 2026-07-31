package com.apiguard.service;

import com.apiguard.entity.ApiKey;
import com.apiguard.exception.RateLimitExceededException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.TimeUnit;

/**
 * Simple fixed-window daily rate limiter backed by Redis.
 *
 * Key format:  ratelimit:{apiKeyValue}:{yyyy-MM-dd}
 * Each request does an atomic INCR. The first INCR on a key sets an
 * expiry of 24h so the counter resets automatically at midnight.
 *
 * This is intentionally simple (fixed window, not sliding-log/bucket)
 * to keep the concept easy to explain in an interview while still
 * demonstrating real Redis usage.
 */
@Service
@RequiredArgsConstructor
public class RateLimiterService {

    private final RedisTemplate<String, String> redisTemplate;

    private static final DateTimeFormatter DAY_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public void checkAndIncrement(ApiKey apiKey) {
        String redisKey = buildKey(apiKey.getKeyValue());

        Long currentCount = redisTemplate.opsForValue().increment(redisKey);

        if (currentCount != null && currentCount == 1L) {
            // first request of the day for this key -> set 24h TTL
            redisTemplate.expire(redisKey, 24, TimeUnit.HOURS);
        }

        if (currentCount != null && currentCount > apiKey.getDailyLimit()) {
            throw new RateLimitExceededException(
                    "Daily rate limit of " + apiKey.getDailyLimit() + " requests exceeded for this API key");
        }
    }

    public long getCurrentUsage(String keyValue) {
        String redisKey = buildKey(keyValue);
        String value = redisTemplate.opsForValue().get(redisKey);
        return value == null ? 0 : Long.parseLong(value);
    }

    private String buildKey(String keyValue) {
        return "ratelimit:" + keyValue + ":" + LocalDate.now().format(DAY_FORMAT);
    }
}
