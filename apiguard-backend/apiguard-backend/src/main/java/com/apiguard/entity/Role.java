package com.apiguard.entity;

/**
 * Application-level roles used for Role-Based Access Control (RBAC).
 * ADMIN      -> can register/manage APIs, view all analytics & logs
 * DEVELOPER  -> can generate API keys, view own usage & analytics
 */
public enum Role {
    ADMIN,
    DEVELOPER
}
