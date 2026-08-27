# Wolaita Sodo Water-Point Monitoring System

[![Status](https://img.shields.io/badge/status-production--ready-success)](#)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](#)
[![License](https://img.shields.io/badge/license-MIT-green)](#)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](#)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933)](#)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-336791)](#)
[![Express](https://img.shields.io/badge/Express-4-000000)](#)
[![Google Maps](https://img.shields.io/badge/Google%20Maps%20API-Enabled-4285F4)](#)

**A community-driven water infrastructure monitoring and repair platform for Wolaita Zone, South Ethiopia.**

Citizens report broken water points in under a minute; WASH offices turn those reports into trackable repair work orders; everyone sees the real-time status of every water point on a map. Built with a restrained **red / yellow / black** palette inspired by traditional Wolaita cloth, and fully localized in **English, Amharic, and Wolaytta**.

---

## Table of Contents

- [Problem & Goal](#problem--goal)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Admin Accounts](#admin-accounts)
- [API Reference](#api-reference)
- [Database](#database)
- [Security](#security)
- [Code Quality & Conventions](#code-quality--conventions)
- [Build & Production](#build--production)
- [Deployment](#deployment)
  - [Single Node Process (PM2 / Docker)](#single-node-process-pm2--docker)
  - [Vercel (Serverless)](#vercel-serverless)
- [Backup & Restore](#backup--restore)
- [Localization](#localization)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## Problem & Goal

### The Problem

In Wolaita Zone, hand pumps and shallow wells are the primary water source for thousands of families. These water points frequently break down and can stay broken for weeks or months because:

- **No way to report** — Community members have no reliable channel to inform WASH offices about broken water points.
- **Reports get lost** — Word-of-mouth reports are delayed, forgotten, or never reach the people who can fix them.
- **No visibility** — WASH offices have no dashboard showing which points are broken, which work, and where to focus repairs.
- **No accountability** — Without tracking, broken pumps can be ignored indefinitely.
- **Communities suffer** — Families fall back on unsafe water, leading to waterborne disease and lost productivity.

### The Goal

Bridge the gap between citizens and water-infrastructure repair by providing:

1. **A simple citizen portal** where anyone with a phone can report a broken water point in under 60 seconds — with a photo, location, and priority.
2. **An interactive map** showing the real-time status of every water point across Wolaita Zone, giving communities and officials shared visibility.
3. **An admin dashboard** that turns scattered reports into organized, trackable work orders — with technician assignment and status updates.
4. **Analytics & accountability** so offices can measure response times, identify problem areas, and demonstrate performance.

### Who This Is For

| Stakeholder | How They Benefit |
|-------------|------------------|
| Community members | Report issues instantly, track repairs, see when their water point will be fixed |
| WASH office staff | See all incoming reports in one place, assign technicians, track progress |
| Technicians | Receive clear work orders with photos, location, and fault type |
| Zone administrators | Monitor performance across woredas, identify trends, allocate resources |
| Policy makers | Access infrastructure-health data to inform budget and policy decisions |

### Expected Impact

- **Faster repairs** — Reports reach the right people in minutes, not days.
- **More water points working** — Accountability drives timely responses.
- **Healthier communities** — Less time on unsafe water sources.
- **Data-driven decisions** — Real infrastructure data for the first time.
- **Community trust** — Citizens see their reports lead to action.

---

## Features

### Citizen Portal

- **Interactive Map** — All water points across Wolaita Zone on Google Maps with live status (working / broken / under repair) and filters.
- **Quick Reporting** — Submit fault reports with photo, location, and priority (normal / high / urgent).
- **Report Tracking** — Track repair progress by report ID through reported → acknowledged → in progress → resolved.
- **Community Validation** — Confirm others' reports to escalate priority ("Me too").
- **Mobile Responsive** — Full functionality across phones and tablets.

### Admin Portal

- **Dashboard** — Real-time metrics: working points, new reports, in-progress repairs, average resolution time.
- **Report Management** — Review, filter, update status, and assign technicians.
- **Water Points Registry** — Full CRUD with photo upload support.
- **Analytics** — Performance metrics, fault-type breakdowns, monthly trends, office comparisons.
- **Role-Based Access** — Admin, office staff, and technician roles.

### Design & Branding

- **Wolaita Cultural Theme** — Restrained red / yellow / black palette inspired by traditional Wolaita cloth (the "tibeb" stripe), avoiding colour overuse for a clean, professional look.
- **Logo & Identity** — Custom water-point logo across header, sidebar, and public pages.
- **Repair-First Imagery** — Consistent broken-pipe / pipe-fixing / repair imagery across all pages, with a few warm community shots retained for human context.
- **Trilingual** — Full English, Amharic, and Wolaytta localization.
- **Responsive Layout** — Mobile-first design with collapsible navigation.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Axios, i18next, Google Maps JavaScript API (`@googlemaps/js-api-loader`) |
| Backend | Node.js, Express.js |
| Database | PostgreSQL 15+ |
| Authentication | JWT (JSON Web Tokens) + bcrypt |
| Security | Helmet, express-rate-limit, xss-clean, express-mongo-sanitize, hpp, express-validator |
| File Upload | Multer |
| Process Management | PM2 (`ecosystem.config.js`), Docker |
| Serverless | Vercel (`vercel.json`, `api/index.js`) |

---

## Architecture

The Express server serves both the REST API and (in production) the built React frontend with an SPA fallback, so a single process can run the whole site.

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (React, :4000)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Home    │ │   Map    │ │  Report  │ │  Track   │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  About  │  Admin: Login · Dashboard · Reports ·        │ │
│  │         │         WaterPoints · Analytics              │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬─────────────────────────────┘
                        HTTP/REST (CORS)
┌───────────────────────────────┴─────────────────────────────┐
│                   Server (Express.js, :8000)                 │
│  Routes: auth · waterPoints · reports · admin · analytics    │
│  Middleware: JWT · Rate Limit · XSS · HPP · Helmet · Upload │
│  Static: /uploads (photos) + SPA fallback to client/build   │
└───────────────────────────────┬─────────────────────────────┘
                        Parameterized SQL
┌───────────────────────────────┴─────────────────────────────┐
│                PostgreSQL (Water_Point_Monitoring_System)    │
└──────────────────────────────────────────────────────────────┘
```

---

## Repository Structure

```
Comumunity project 101/
├── client/                        # React frontend (Create React App)
│   ├── public/                    # index.html, manifest, logo
│   └── src/
│       ├── components/common/     # Header, Footer, AdminLayout, Icons, PrivateRoute…
│       ├── context/               # AuthContext (JWT session)
│       ├── locales/               # en.json · am.json · wt.json (i18n)
│       ├── pages/
│       │   ├── CitizenPages/      # Home, Map, Report, Track, About
│       │   └── AdminPages/        # Login, Dashboard, Reports, WaterPoints, Analytics
│       ├── services/api.js        # Axios API client
│       ├── styles/index.css       # Global styles + design tokens
│       ├── App.js                 # Routing
│       └── index.js
├── server/                        # Express backend
│   ├── config/database.js         # PG pool
│   ├── middleware/                # auth.js (JWT/RBAC), upload.js (Multer)
│   ├── routes/                    # auth, waterPoints, reports, admin, analytics
│   └── server.js                  # App entry, middleware, SPA serving
├── api/index.js                   # Vercel serverless entry (re-exports app)
├── database/                      # schema.sql · schema_simple.sql · seed.sql · seed_simple.sql · setup-database.sql
├── scripts/                       # db-backup.js · db-restore.js
├── uploads/                       # Uploaded report/water-point photos
├── .env / .env.example / .env.production / .env.production.example
├── Dockerfile
├── ecosystem.config.js            # PM2 process config
├── vercel.json
└── package.json
```

---

## Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** 15 or higher
- **npm** v9 or higher
- A **Google Maps JavaScript API key** (with the Maps JavaScript API + Places API enabled) for the map to render.

> The Google Maps key is required at build time as `REACT_APP_GOOGLE_MAPS_API_KEY` (see [Environment Variables](#environment-variables)).

---

## Local Development Setup

### 1. Clone & install dependencies

```bash
git clone <repository-url>
cd "Comumunity project 101"

# Install server + client dependencies (root has `install-all`)
npm run install-all
# …or manually:
#   npm install
#   cd client && npm install && cd ..
```

### 2. Configure the database

Create the database and load the schema + sample data (adjust the port/user for your local PostgreSQL):

```bash
psql -U postgres -p 8869 -c "CREATE DATABASE \"Water_Point_Monitoring_System\";"
psql -U postgres -p 8869 -d Water_Point_Monitoring_System -f database/schema_simple.sql
psql -U postgres -p 8869 -d Water_Point_Monitoring_System -f database/seed_simple.sql
```

> `schema_simple.sql` / `seed_simple.sql` are the lightweight, recommended files for a quick local start. The full `schema.sql` / `seed.sql` are also provided.

### 3. Configure environment

Copy `.env.example` to `.env` and set real values (see [Environment Variables](#environment-variables)):

```bash
cp .env.example .env
```

### 4. Run the application

```bash
# Terminal 1 — backend (Express on :8000)
npm start            # or: npm run dev  (nodemon auto-reload)

# Terminal 2 — frontend (React dev server on :4000, HMR)
cd client && npm start
```

> The client `package.json` has `"proxy": "http://localhost:8000"`, so dev-mode API calls to `/api/*` are forwarded to the backend automatically.

### 5. Access points

| Service | URL |
|---------|-----|
| Citizen portal | http://localhost:4000 |
| Admin login | http://localhost:4000/admin/login |
| API health | http://localhost:8000/api/health |

---

## Environment Variables

| Variable | Description | Default / Notes |
|----------|-------------|-----------------|
| `PORT` | Backend server port | `5000` (dev uses `8000`) |
| `NODE_ENV` | Environment mode | `development` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` (local dumps use `8869`) |
| `DB_NAME` | Database name | `Water_Point_Monitoring_System` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | — |
| `DATABASE_URL` | (Optional) Full connection string for cloud DBs | Use with `DB_SSL=true` |
| `DB_SSL` | Enable TLS on DB connection | `true` for Neon/Supabase/etc. |
| `JWT_SECRET` | JWT signing secret | Generate a strong 64-char secret |
| `JWT_EXPIRE` | Token expiration | `30d` |
| `GOOGLE_MAPS_API_KEY` | Backend Maps key (informational) | — |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | **Build-time** Maps key (client) | Required for the map |
| `APP_NAME` | Application display name | `Wolaita Sodo Water-Point Monitoring System` |
| `APP_URL` | Frontend URL (CORS origin) | `http://localhost:4000` |
| `MAX_FILE_SIZE` | Upload size limit (bytes) | `5242880` (5 MB) |
| `UPLOAD_PATH` | Upload directory | `./uploads` |
| `SMS_API_KEY` / `SMS_USERNAME` | (Optional) SMS notifications | — |
| `EMAIL_SERVICE` / `EMAIL_API_KEY` / `EMAIL_FROM` | (Optional) Email notifications | — |

> **Security:** never commit real credentials. The repo ships `.env.example` / `.env.production.example` as templates; real values belong in your local `.env` (git-ignored).

---

## Admin Accounts

`seed_simple.sql` seeds the following demo accounts (used only for local development — change them in production):

| Role | Email | Password |
|------|-------|----------|
| System Administrator | `admin@sodowater.gov.et` | `Admin@123` |
| WASH Office Staff | `office@sodowater.gov.et` | `Office@123` |
| Technician | `daniel@sodowater.gov.et` | (see seed) |

> There is **no public self-registration**. Admin/office/technician users are created via the database seed. Share credentials only with authorized WASH staff, and change default passwords after first login.

---

## API Reference

### Public endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/water-points` | List all water points |
| `GET` | `/api/water-points/:id` | Water point details |
| `GET` | `/api/water-points/nearby/:latitude/:longitude` | Nearby water points |
| `GET` | `/api/reports` | List reports (public view) |
| `POST` | `/api/reports` | Submit a new report (multipart, photo optional) |
| `GET` | `/api/reports/:id` | Report details |
| `POST` | `/api/reports/:id/confirm` | Confirm a report ("Me too") |
| `GET` | `/api/analytics/map-data` | Map data (public) |

### Authenticated endpoints

| Method | Endpoint | Roles |
|--------|----------|-------|
| `POST` | `/api/auth/login` | Any |
| `GET` | `/api/auth/me` | Any authenticated |
| `POST` | `/api/auth/change-password` | Any authenticated |
| `GET` | `/api/admin/reports` | Admin, Office |
| `PUT` | `/api/admin/reports/:id/status` | Admin, Office |
| `GET` | `/api/admin/technicians` | Admin, Office |
| `GET` | `/api/admin/offices` | Admin |
| `POST` | `/api/admin/water-points` | Admin |
| `PUT` | `/api/admin/water-points/:id` | Admin, Office |
| `GET` | `/api/analytics/dashboard` | Admin, Office |
| `GET` | `/api/analytics/performance` | Admin |

> Responses use a consistent envelope: `{ "status": "success", "data": … }`, with `{ "status": "error", "message": … }` on failure.

---

## Database

### Core tables (`database/schema_simple.sql`)

| Table | Description |
|-------|-------------|
| `jurisdictions` | Administrative boundaries (woredas in Wolaita Zone) |
| `offices` | WASH office locations and contact info |
| `users` | System users (admin, office staff, technicians) |
| `water_points` | Water infrastructure registry |
| `reports` | Citizen fault reports |
| `report_confirmations` | Community validations ("Me too") |
| `status_history` | Report status-change log |
| `maintenance_logs` | Maintenance records |

### Sample data (`seed_simple.sql`)

- 5 woredas in Wolaita Zone
- 5 WASH offices
- 7 users with roles
- 20 water points with real GPS coordinates
- 8 sample reports across several statuses

---

## Security

The backend includes these measures:

1. **Helmet** — secure HTTP headers and a tailored Content-Security-Policy.
2. **Rate limiting** — 100 req / 15 min per IP on `/api/*`; 5 login attempts / 15 min on `/api/auth/login` (successes skipped).
3. **XSS protection** — `xss-clean` input sanitization.
4. **NoSQL sanitization** — `express-mongo-sanitize`.
5. **HPP protection** — HTTP parameter pollution prevention.
6. **CORS** — restricted to the configured `APP_URL` origin.
7. **JWT authentication** — token-based auth with configurable expiration.
8. **bcrypt hashing** — 10 rounds for passwords.
9. **Role-based access control** — admin / office / technician.
10. **File upload restrictions** — MIME type and size validation (Multer).
11. **SQL injection prevention** — parameterized queries with `pg`.
12. **Input validation** — `express-validator`.
13. **Cookie parsing** — secure token handling.
14. **Error sanitization** — no stack traces in production.
15. **Trust proxy** — correct IP detection behind proxies.
16. **Request logging** — timestamped method/path logs.
17. **Graceful shutdown** — clean server termination on `SIGTERM`.

---

## Code Quality & Conventions

- **Server**: CommonJS modules, `async/await`, parameterized SQL, JSDoc comments on routes and middleware.
- **Client**: React functional components with hooks, ES6+ modules, ES-lint (`react-app` preset).
- **Styling**: Global tokens in `client/src/styles/index.css` (`:root` variables for `--primary`, `--success`, `--warning`, spacing, radii, shadows). Reuse variables rather than inline hex where possible.
- **Branding**: Restrained red / yellow / black Wolaita palette — avoid adding extra colours.
- **Localization**: All user-facing text lives in `client/src/locales/{en,am,wt}.json`; keep the three files key-synced when adding strings.
- **Imagery**: Keep the repair-first visual theme consistent site-wide.

---

## Build & Production

The single backend process serves both the API and the built frontend (SPA fallback included), so one Node process runs the whole site.

```bash
# 1. Set production values in .env (NODE_ENV=production, new JWT_SECRET, real DB + APP_URL)
# 2. Build the frontend
npm run build

# 3. Start the single process (serves your domain + /api)
npm run start:prod
```

### Production checklist

1. Set `NODE_ENV=production`.
2. Use a production database — or `DATABASE_URL` + `DB_SSL=true`.
3. Generate a strong new `JWT_SECRET` (never reuse a dev secret).
4. Set `REACT_APP_GOOGLE_MAPS_API_KEY` before building.
5. Configure `APP_URL` with your HTTPS domain.
6. Terminate TLS at your reverse proxy / load balancer.
7. Change default admin passwords after first login.
8. Schedule regular backups: `npm run db:backup`.

---

## Deployment

### Single Node Process (PM2 / Docker)

**PM2:**

```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Docker:**

```bash
# Build and run (API + frontend on :8000)
docker build -t wolaita-water .
docker run -d -p 8000:8000 --env-file .env -v uploads:/app/uploads wolaita-water
```

### Vercel (Serverless)

The repo ships `vercel.json` and `api/index.js`. The Express API runs as a serverless function and the built React app is served as static files.

```bash
npm i -g vercel
vercel login

# Add environment variables in the Vercel dashboard
# (Project → Settings → Environment Variables):
#   DATABASE_URL                    → a CLOUD Postgres URL (Neon/Supabase/Vercel Postgres)
#                                     — localhost will NOT work on Vercel
#   REACT_APP_GOOGLE_MAPS_API_KEY   → your Maps key (needed at build time)
#   JWT_SECRET / APP_URL / APP_NAME → optional

vercel --prod
```

**Vercel notes:**

- **Photo uploads do not persist** — the Vercel filesystem is ephemeral. For permanent photo storage use S3/Cloudinary and keep `multer` uploads off the API, or use the Docker setup instead.
- Data (reports, users) persists fine in your cloud Postgres.

---

## Backup & Restore

```bash
npm run db:backup     # Dump the current DB to a timestamped file
npm run db:restore    # Restore the DB from a dump
```

---

## Localization

- Files: `client/src/locales/en.json`, `am.json`, `wt.json`.
- `i18next` + `react-i18next` power the language switching; strings are referenced via `t('namespace.key')`.
- **Keep the three locale files key-synced.** When adding a key to `en.json`, add it to `am.json` and `wt.json` too.
- Wolaytta strings should be reviewed by a native speaker where possible.

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit your changes with a clear message.
4. Push to the branch: `git push origin feature/amazing-feature`.
5. Open a Pull Request.

Please follow the [Code Quality & Conventions](#code-quality--conventions) above, keep locales in sync, and verify with a production build before opening a PR.

---

## License

Distributed under the MIT License. See the `LICENSE` file.

---

## Support

- **Documentation**: inline code comments and route JSDoc.
- **Issues**: open an issue on the repository.
- **Contact**: `admin@sodowater.gov.et`.

---

*Built with pride for the people of Wolaita Zone, South Ethiopia — where traditional culture meets modern technology, red · yellow · black.*
