# ApiGuard – API Gateway & Management Platform (Backend)

A simplified, portfolio-friendly clone of API management platforms like Kong /
Apigee: register backend APIs, issue API keys, rate-limit traffic, and view
usage analytics — all through a Spring Boot REST API.

## Tech Stack
- Java 17
- Spring Boot 4.1.0 (Spring Framework 7 / Jakarta EE 11)
- Spring Web, Spring Data JPA, PostgreSQL
- Spring Security 6 + JWT (jjwt 0.12.x)
- Spring Data Redis (daily rate-limit counters)
- springdoc-openapi (Swagger UI / developer portal docs)
- Spring Scheduling (health checks + daily reports)
- Lombok

## How to Run

1. **Create the project shell** using [start.spring.io](https://start.spring.io)
   with: Java 17, Maven, Spring Boot 4.1.0, and these dependencies:
   - Spring Web
   - Spring Data JPA
   - PostgreSQL Driver
   - Spring Security
   - Spring Data Redis (Access+Driver)
   - Validation
   - Spring Boot Actuator
   - Lombok
   - Spring Boot DevTools (optional)

   Then manually add to `pom.xml` (Spring Initializr doesn't list these):
   - `io.jsonwebtoken:jjwt-api`, `jjwt-impl`, `jjwt-jackson` (v0.12.6)
   - `org.springdoc:springdoc-openapi-starter-webmvc-ui` (v2.8.5)

   Or simplest: just copy the `pom.xml` from this bundle directly.

2. **Copy every file** from this bundle into the matching path inside your
   generated project (`src/main/java/com/apiguard/...`, `src/main/resources/...`).

3. **Start PostgreSQL & Redis** locally (or via Docker):
   ```bash
   docker run -d --name apiguard-postgres -e POSTGRES_DB=apiguard_db \
     -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16
   docker run -d --name apiguard-redis -p 6379:6379 redis:7
   ```

4. **Update `application.yml`** if your DB credentials differ.

5. **Run it**:
   ```bash
   mvn spring-boot:run
   ```

6. Open Swagger docs at: `http://localhost:8080/swagger-ui.html`

## Feature → Code Map

| Feature (from the brief)        | Where it lives |
|----------------------------------|----------------|
| API registration                 | `ApiResourceController` / `ApiResourceService` |
| API key generation               | `ApiKeyController` / `ApiKeyService` |
| Rate limiting                    | `RateLimiterService` (Redis `INCR` + TTL) |
| Request logging                  | `RequestLogService` (`@Async`, non-blocking) |
| API usage analytics              | `AnalyticsController` / `AnalyticsService` |
| JWT Authentication                | `security/` package + `SecurityConfig` |
| Role-based access (Admin/Dev)     | `Role` enum + `@PreAuthorize`/URL rules in `SecurityConfig` |
| API health monitoring             | `HealthCheckService` (`@Scheduled` every 5 min) |
| Scheduled / monthly reports        | `ReportService` (`@Scheduled` cron, `UsageReport` entity) |
| API documentation (dev portal)    | springdoc + Swagger UI |
| The Gateway itself                | `GatewayController` / `GatewayService` (proxies to real service via `RestTemplate`) |

## Suggested Demo Flow

1. `POST /api/auth/register` → create an ADMIN user (`"role": "ADMIN"`).
2. `POST /api/auth/login` → grab the JWT.
3. `POST /api/admin/apis` (as ADMIN, Bearer token) → register an API, e.g.
   ```json
   { "name": "jsonplaceholder", "baseUrl": "https://jsonplaceholder.typicode.com", "description": "demo" }
   ```
4. Register / login a second user as a DEVELOPER.
5. `POST /api/keys` (as DEVELOPER) with `{ "planType": "FREE" }` → get an `ak_...` key.
6. Call the gateway (no JWT needed, just the key):
   ```
   GET /api/gateway/jsonplaceholder/todos/1
   Header: X-API-KEY: ak_xxx
   ```
7. `GET /api/analytics/summary` (as ADMIN) → see totals, per-API breakdown, time series.
8. Hit the gateway 101+ times with a FREE key → get `429 Too Many Requests`.

## Notes for Interviews
- Rate limiting uses a **fixed daily window** in Redis (`INCR` + `EXPIRE`) —
  simple to reason about and explain, while still demonstrating real Redis usage.
  (A follow-up talking point: you could extend it to a sliding-window or
  token-bucket algorithm.)
- Logging is **asynchronous** (`@Async`) so the audit trail never adds
  latency to the caller's response — a common real-world gateway pattern.
- `ddl-auto: update` is fine for a portfolio project; in production you'd use
  Flyway/Liquibase migrations instead.
