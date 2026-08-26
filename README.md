# Wolaita Sodo Water-Point Monitoring System

![Status](https://img.shields.io/badge/status-production--ready-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791)

**A community-driven water infrastructure monitoring platform for Wolaita Zone, South Ethiopia.**

---

## Project Goal

### The Problem

In Wolaita Zone, South Ethiopia, hand pumps and shallow wells are the primary water source for thousands of families. These water points frequently break down and stay broken for **weeks or months** because:

- **No way to report** — Community members have no reliable method to inform WASH offices about broken water points
- **Reports get lost** — Word-of-mouth reports are delayed, forgotten, or never reach the people who can fix them
- **No visibility** — WASH offices have no dashboard to see which water points are broken, which are working, and where to focus repairs
- **No accountability** — There is no tracking system, so broken pumps can be ignored indefinitely
- **Communities suffer** — Families are forced back onto unsafe water sources, leading to waterborne disease and lost productivity

### The Goal

This project exists to **bridge the gap between citizens and water infrastructure repair** by providing:

1. **A simple citizen portal** where anyone with a phone can report a broken water point in under 60 seconds — with a photo, location, and priority level
2. **An interactive map** that shows the real-time status of every water point in Wolaita Zone, so communities and officials both have visibility
3. **An admin dashboard** for WASH offices that turns scattered reports into organized, trackable work orders with technician assignment and status updates
4. **Analytics and accountability** so offices can measure response times, identify problem areas, and demonstrate performance

### Who This Is For

| Stakeholder | How They Benefit |
|-------------|-----------------|
| **Community members** | Report issues instantly, track repairs, see when their water point will be fixed |
| **WASH office staff** | See all incoming reports in one place, assign technicians, track progress |
| **Technicians** | Receive clear work orders with photos, location, and fault type |
| **Zone administrators** | Monitor performance across all woredas, identify trends, allocate resources |
| **Policy makers** | Access data on infrastructure health to inform budget and policy decisions |

### Expected Impact

- **Faster repairs** — Reports reach the right people in minutes, not days
- **More water points working** — Accountability drives timely responses
- **Healthier communities** — Less time on unsafe water sources
- **Data-driven decisions** — Real infrastructure data for the first time
- **Community trust** — Citizens see their reports lead to action

> *This project was built with pride for the people of Wolaita Zone. Every drop of clean water matters.*

---

## Table of Contents

- [Project Goal](#project-goal)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Security](#-security)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## Features

### Citizen Portal
- **Interactive Map** — View all water points across Wolaita Zone on Google Maps with real-time status
- **Quick Reporting** — Submit fault reports with photos, location, and priority in under 1 minute
- **Report Tracking** — Track repair progress by report ID with live status updates
- **Community Validation** — Confirm others' reports to escalate priority
- **Mobile Responsive** — Full functionality on smartphones and tablets

### Admin Portal
- **Dashboard** — Real-time metrics: working points, new reports, in-progress repairs, avg resolution time
- **Report Management** — Review, filter, update status, and assign technicians
- **Water Points Registry** — Full CRUD operations with photo upload support
- **Analytics** — Performance metrics, fault type breakdowns, monthly trends, office comparisons
- **User Management** — Role-based access for admin, office staff, and technicians

### Design & Branding
- **Wolaita Cultural Theme** — Red, gold, and black palette inspired by traditional Wolaita cloth
- **Logo Integration** — Custom water-point logo across header, sidebar, and public pages
- **Responsive Layout** — Mobile-first design with collapsible navigation

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Axios, Google Maps JavaScript API |
| Backend | Node.js, Express.js |
| Database | PostgreSQL 15+ with PostGIS (optional) |
| Authentication | JWT (JSON Web Tokens) |
| Security | Helmet, express-rate-limit, xss-clean, hpp, bcrypt |
| File Upload | Multer |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Citizen │  │   Map    │  │  Report  │  │  About   │   │
│  │  Pages   │  │  Page    │  │  Page    │  │  Page    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Admin Pages                        │   │
│  │  Login  │  Dashboard  │  Reports  │  WaterPoints  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                        HTTP/REST API
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Server (Express.js)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │  Water   │  │ Reports  │  │Analytics │   │
│  │  Routes  │  │  Points  │  │  Routes  │  │  Routes  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Middleware & Security                      │   │
│  │  JWT Auth  │  Rate Limit  │  XSS  │  Upload  │  CORS │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                        PostgreSQL
                   (Water_Point_Monitoring_System)
```

---

## Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **PostgreSQL** 15 or higher
- **npm** v9 or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd "Comumunity project 101"

# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Database Setup

```bash
# Create database (run as postgres user)
psql -U postgres -p 8869 -c "CREATE DATABASE \"Water_Point_Monitoring_System\";"

# Initialize schema
psql -U postgres -p 8869 -d Water_Point_Monitoring_System -f database/schema_simple.sql

# Load sample data
psql -U postgres -p 8869 -d Water_Point_Monitoring_System -f database/seed_simple.sql
```

### Environment Configuration

Copy `.env.example` to `.env` and update the values:

```env
# Server
PORT=8000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=8869
DB_NAME=Water_Point_Monitoring_System
DB_USER=postgres
DB_PASSWORD=your_password

# Authentication
JWT_SECRET=your_64_character_secret_key
JWT_EXPIRE=30d

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Application
APP_NAME=Wolaita Sodo Water-Point Monitoring System
APP_URL=http://localhost:4000
```

### Running the Application

```bash
# Terminal 1 — Start backend server
npm start
# → Server running on http://localhost:8000

# Terminal 2 — Start frontend dev server
cd client
npm start
# → Frontend running on http://localhost:4000
```

### Access Points

| Service | URL |
|---------|-----|
| Citizen Portal | http://localhost:4000 |
| Admin Login | http://localhost:4000/admin/login |
| API Health | http://localhost:8000/api/health |

### Admin Credentials

| Role | Email | Password |
|------|-------|----------|
| **System Administrator** | admin@sodowater.gov.et | Admin@123 |
| **WASH Office Staff** | office@sodowater.gov.et | Office@123 |

> Share these credentials only with authorized WASH office staff.

---

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `8000` |
| `NODE_ENV` | Environment mode | `development` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `8869` |
| `DB_NAME` | Database name | `Water_Point_Monitoring_System` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | — |
| `JWT_SECRET` | JWT signing secret | — |
| `JWT_EXPIRE` | Token expiration | `30d` |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key | — |
| `APP_NAME` | Application name | `Wolaita Sodo Water-Point Monitoring System` |
| `APP_URL` | Frontend URL (CORS) | `http://localhost:4000` |
| `MAX_FILE_SIZE` | Upload limit (bytes) | `5242880` (5MB) |
| `UPLOAD_PATH` | Upload directory | `./uploads` |

---

## API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/water-points` | List all water points |
| `GET` | `/api/water-points/:id` | Get water point details |
| `GET` | `/api/water-points/nearby/:lat/:lng` | Find nearby water points |
| `POST` | `/api/reports` | Submit a new report |
| `GET` | `/api/reports/:id` | Get report details |
| `POST` | `/api/reports/:id/confirm` | Confirm a report |

### Protected Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `POST` | `/api/auth/login` | User login | Any |
| `GET` | `/api/auth/me` | Get current user | Any authenticated |
| `POST` | `/api/auth/change-password` | Change password | Any authenticated |
| `GET` | `/api/admin/reports` | List all reports | Admin, Office |
| `PUT` | `/api/admin/reports/:id/status` | Update report status | Admin, Office |
| `POST` | `/api/admin/water-points` | Add water point | Admin |
| `PUT` | `/api/admin/water-points/:id` | Update water point | Admin, Office |
| `GET` | `/api/admin/technicians` | List technicians | Admin, Office |
| `GET` | `/api/admin/offices` | List offices | Admin |
| `GET` | `/api/analytics/dashboard` | Dashboard stats | Admin, Office |
| `GET` | `/api/analytics/performance` | Office performance | Admin |
| `GET` | `/api/analytics/map-data` | Map data | Public |

---

## Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `jurisdictions` | Administrative boundaries (Woredas in Wolaita Zone) |
| `offices` | WASH office locations and contact info |
| `users` | System users (admin, office staff, technicians) |
| `water_points` | Water infrastructure registry |
| `reports` | Citizen fault reports |
| `report_confirmations` | Community validations ("Me too") |
| `status_history` | Report status change log |
| `maintenance_logs` | Maintenance records |

### Sample Data

The seed scripts include:
- 5 Woredas in Wolaita Zone
- 5 WASH offices
- 7 users with roles
- 20 water points with real GPS coordinates
- 8 sample reports with various statuses

---

## Security

The backend implements the following security measures:

1. **Helmet** — Security HTTP headers
2. **Rate Limiting** — 100 requests per 15 minutes (5 for login)
3. **XSS Protection** — xss-clean middleware
4. **NoSQL Injection Sanitization** — express-mongo-sanitize
5. **HPP Protection** — HTTP parameter pollution prevention
6. **CORS Configuration** — Restricts origins to configured `APP_URL`
7. **JWT Authentication** — Token-based auth with configurable expiration
8. **bcrypt Password Hashing** — 10 rounds
9. **Role-Based Access Control** — Admin, office, technician roles
10. **File Upload Restrictions** — Type and size validation
11. **SQL Injection Prevention** — Parameterized queries with `pg`
12. **Input Validation** — express-validator
13. **Cookie Security** — Secure cookie settings
14. **Error Sanitization** — No stack traces in production
15. **Trust Proxy** — Correct IP detection behind proxies
16. **Session Management** — Secure token handling
17. **Graceful Shutdown** — Clean server termination

---

## Development

### Project Structure

```
Comumunity project 101/
├── client/
│   ├── public/
│   │   ├── images/
│   │   │   └── wolaita-logo.png
│   │   ├── index.html
│   │   └── manifest.json
│   └── src/
│       ├── components/
│       │   └── common/
│       │       ├── CitizenHeader.js
│       │       ├── AdminSidebar.js
│       │       ├── AdminLayout.js
│       │       ├── Footer.js
│       │       └── PrivateRoute.js
│       ├── pages/
│       │   ├── CitizenPages/
│       │   │   ├── HomePage.js
│       │   │   ├── MapPage.js
│       │   │   ├── ReportPage.js
│       │   │   ├── TrackReportPage.js
│       │   │   └── AboutPage.js
│       │   └── AdminPages/
│       │       ├── AdminLogin.js
│       │       ├── AdminDashboard.js
│       │       ├── AdminReports.js
│       │       ├── AdminWaterPoints.js
│       │       └── AdminAnalytics.js
│       ├── context/
│       │   └── AuthContext.js
│       ├── services/
│       │   └── api.js
│       ├── styles/
│       │   └── index.css
│       ├── App.js
│       └── index.js
├── server/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── waterPoints.js
│   │   ├── reports.js
│   │   ├── admin.js
│   │   └── analytics.js
│   └── server.js
├── database/
│   ├── schema.sql
│   ├── schema_simple.sql
│   ├── seed.sql
│   └── seed_simple.sql
├── uploads/
├── .env
├── .env.example
├── package.json
├── README.md
└── TODO.md
```

### Code Style

- **Server**: CommonJS modules, async/await, parameterized SQL queries
- **Client**: ES6+ modules, React functional components with hooks
- **Comments**: JSDoc on server routes and middleware
- **Linting**: ESLint with `react-app` preset

---

## Deployment

### Production Checklist

1. Set `NODE_ENV=production` in `.env`
2. Use a production PostgreSQL database
3. Generate a strong `JWT_SECRET`
4. Configure `APP_URL` with your domain
5. Enable HTTPS
6. Build frontend: `cd client && npm run build`
7. Serve static frontend from Express or separate host (Nginx, Vercel, Netlify)
8. Use `PM2` or similar for process management

### Example Production Start

```bash
# Build frontend
cd client && npm run build && cd ..

# Start with PM2
pm2 start server/server.js --name "wolaita-water-api"
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgments

- **Wolaita Zone Water Office** — Project guidance and domain expertise
- **South Ethiopia Regional Water Bureau** — Technical oversight
- **Local WASH Offices** — Field testing and feedback
- **Community Members** — User testing and reports
- **Traditional Wolaita Culture** — Design inspiration

---

## Support

- **Documentation**: See inline code comments and route JSDoc
- **Issues**: Open an issue on the project repository
- **Contact**: admin@sodowater.gov.et

---

*Built with pride for the people of Wolaita Zone, South Ethiopia 🇪🇹*

*Where Traditional Culture Meets Modern Technology*
