# ApiGuard Frontend

React dashboard for the ApiGuard API Gateway & Management Platform backend.

## Tech Stack
- React 18 + Vite
- React Router v6
- Tailwind CSS (custom design system — see `tailwind.config.js`)
- Recharts (analytics charts)
- Axios (API client with JWT interceptor)
- lucide-react (icons)

## Design System
- **Ink** `#0B1120` background, **Panel** `#121A2E` cards
- **Signal** `#21D4B4` (teal) = primary actions & "healthy" status
- **Alert** `#F5A623` (amber) = warnings / near rate-limit
- **Danger** `#FF5C5C` (coral) = errors / down status
- Type: Space Grotesk (display) + Inter (UI) + JetBrains Mono (keys, logs, numbers)
- Signature element: the **pulse strip** (`src/components/ui/PulseStrip.jsx`) — a
  heartbeat-monitor style readout of live requests passing through the gateway,
  color-coded by outcome. Appears on the Dashboard.

## Getting Started

```bash
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if not using the dev proxy
npm run dev
```

The Vite dev server proxies `/api/*` to `http://localhost:8080` (your Spring Boot
backend) — see `vite.config.js`. So as long as the backend is running locally on
port 8080, you don't need to change anything.

## Pages

| Route | Page | Access |
|---|---|---|
| `/login`, `/register` | Auth | Public |
| `/dashboard` | Overview: stat cards, live pulse strip, traffic chart, top APIs, health grid | All logged-in users |
| `/apis` | Register/toggle/delete backend APIs | Admin only |
| `/keys` | Generate/revoke your own API keys | All logged-in users |
| `/analytics` | Deeper charts: volume over time, per-API breakdown, failure rate | All logged-in users |
| `/logs` | Searchable/filterable request log table | All logged-in users |
| `/tester` | Postman-style tester — send a request through the gateway with your API key | All logged-in users |

## Folder Structure

```
src/
  api/          axios calls, one file per backend resource
  components/
    layout/     Sidebar, Topbar, AppShell, AuthShowcase
    ui/         StatCard, PulseStrip, Modal, Toast, StatusPill, etc.
  context/      AuthContext (JWT session, stored in localStorage)
  pages/        one file per route
  utils/        formatters (numbers, dates, percentages)
```

## Notes
- Auth: JWT is stored in `localStorage` and attached automatically via an Axios
  request interceptor. This is fine for a portfolio project — for production
  you'd typically move to an httpOnly cookie to reduce XSS exposure.
- The Dashboard polls the backend every 15s for a "live" feel without needing
  WebSockets — a reasonable trade-off to mention if asked in an interview.
- Role-based UI: the "Registered APIs" nav item and admin actions only render
  when the logged-in user's role is `ADMIN` (mirrors the backend's `hasRole("ADMIN")`
  rule, but remember the backend is still the real enforcement point).
