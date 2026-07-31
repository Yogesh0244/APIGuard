# ApiGuard — API Gateway & Management Platform

A full-stack platform for registering backend APIs, issuing scoped API keys, enforcing per-key rate limits, and monitoring traffic in real time — the kind of internal tool companies use to manage access to their microservices.

Built to explore how a production API gateway actually works under the hood: authentication, rate limiting, async logging, and health monitoring, end to end.

---

## Features

- **API Registration** — Admins register backend services (name, base URL, description) to bring them under gateway management.
- **API Key Management** — Developers generate scoped keys (Free / Premium plans) to authenticate their requests.
- **Rate Limiting** — Redis-backed daily quota per key, enforced atomically with `INCR` + TTL. Requests over the limit get a `429 Too Many Requests`.
- **Gateway Proxying** — A single entry point (`/api/gateway/{apiName}/**`) validates the key, checks the quota, and forwards the request to the real backend service.
- **Live Analytics Dashboard** — Total requests, failure rate, average latency, per-API breakdown, and a live traffic pulse — updates on a polling loop.
- **Async Request Logging** — Every gateway call is logged for analytics without adding latency to the response (`@Async`).
- **Health Monitoring** — A scheduled job pings every registered API every 5 minutes and flags it healthy/down.
- **Role-Based Access Control** — JWT authentication with `ADMIN` / `DEVELOPER` roles; only admins can register or manage APIs.
- **Built-in API Tester** — A Postman-style console to send test requests through the gateway and inspect the response.

---

## Tech Stack

**Backend**
- Java 17, Spring Boot 4.1
- Spring Security + JWT (jjwt)
- Spring Data JPA + PostgreSQL
- Spring Data Redis (rate limiting)
- Spring Scheduling (health checks, daily usage reports)
- springdoc-openapi (Swagger UI)

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Recharts (analytics charts)
- Framer Motion (animation)
- Axios + React Router

---

## Architecture

```
React Dashboard
      │
      ▼
Spring Boot REST API
      │
   ┌──────────────────────┐
   │ JWT Auth & RBAC       │
   │ API Key Management    │
   │ Redis Rate Limiter    │
   │ Gateway Proxy         │
   │ Async Request Logging │
   │ Scheduled Health Check│
   └──────────────────────┘
      │              │
      ▼              ▼
 PostgreSQL         Redis
```

### Request flow through the gateway
1. Client calls `GET /api/gateway/{apiName}/{path}` with header `X-API-KEY`.
2. The key is validated and checked against its daily quota in Redis.
3. If within limits, the request is forwarded to the real backend service's registered base URL.
4. The response is relayed back to the client immediately.
5. The request outcome is logged asynchronously for analytics — this never blocks the response.

---

## Getting Started

### Backend
```bash
cd apiguard-backend
# Requires PostgreSQL and Redis running locally
mvn spring-boot:run
```
Runs on `http://localhost:8080`. Swagger docs at `/swagger-ui.html`.

### Frontend
```bash
cd apiguard-frontend
npm install
npm run dev
```
Runs on `http://localhost:5173` and proxies `/api/*` to the backend.

---

## Demo Flow

1. Register an `ADMIN` user → register a backend API (e.g. `https://jsonplaceholder.typicode.com`).
2. Register a `DEVELOPER` user → generate an API key (`FREE` or `PREMIUM` plan).
3. Call the gateway: `GET /api/gateway/{apiName}/todos/1` with header `X-API-KEY: ak_...`.
4. Watch the request appear on the live dashboard — traffic pulse, charts, and logs update automatically.
5. Exceed the daily limit to see the `429` response in action.

---


## What This Project Demonstrates

- Designing a layered backend (controller → service → repository) with clear separation of concerns
- Implementing stateless JWT authentication and role-based authorization
- Using Redis for a real, atomic rate-limiting mechanism (not just caching)
- Writing non-blocking, asynchronous logging in Spring
- Building a responsive, animated React dashboard backed by live data
- Designing REST APIs and documenting them with OpenAPI/Swagger

---

## License

This project is open source and available under the [MIT License](LICENSE).
