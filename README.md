# HLMS - Housing Loan Management System

Enterprise-grade Housing Loan Management System for PSU banks with complete loan lifecycle management.

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repo
git clone https://github.com/KorpseGrinder/HOMELOAN.git
cd HOMELOAN

# Run everything with one command
docker-compose -f docker-compose.dev.yml up --build
```

Wait for the build to complete (first time takes 2-3 minutes), then open:

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:8080 |
| Swagger Docs | http://localhost:8080/swagger-ui.html |
| H2 Console | http://localhost:8080/h2-console |

**Login Credentials:** `admin` / `admin123`

### Option 2: Local Development (Without Docker)

#### Prerequisites
- Node.js 18+
- Java 21
- Maven 3.9+

#### Run Frontend
```bash
cd hlms-frontend
npm install
npm start
```
Frontend runs at http://localhost:4200

#### Run Backend (in separate terminal)
```bash
# From project root
./mvnw spring-boot:run -pl hlms-web
```
Backend runs at http://localhost:8080

---

## Features

### Loan Journey (PSU Bank Flow)
```
Lead → KYC → Documents → Credit → Valuation → Sanction → Agreement → Disbursement
(4h)   (8h)    (48h)      (24h)     (72h)       (24h)       (48h)        (24h)
```

### Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Portfolio overview with key metrics |
| **Workflow Tracker** | SLA tracking across all stages |
| **Applications** | Lead capture and application management |
| **KYC Verification** | PAN, Aadhaar OTP, Bank account, Photo match |
| **Documents** | Upload, verify, OCR auto-extraction |
| **Underwriting** | FOIR/LTV analysis, credit assessment |
| **Sanction** | Maker-checker approval workflow |
| **Disbursement** | Tranche tracking and fund release |
| **Servicing** | EMI schedule, payment history |
| **Collections** | DPD bucket management (0-30, 31-60, 61-90, 90+) |
| **NPA** | IRAC classification (Sub-Standard, Doubtful, Loss) |
| **Reports** | Portfolio, disbursement, risk, regulatory reports |
| **Admin** | User management, system settings |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 17, Tailwind CSS, Angular Material |
| Backend | Java 21, Spring Boot 3.3 |
| Database | Oracle (prod) / H2 in-memory (dev) |
| Build | Maven (backend), npm (frontend) |
| Container | Docker, Docker Compose |

---

## Project Structure

```
HOMELOAN/
├── hlms-frontend/          # Angular 17 SPA
├── hlms-web/               # Spring Boot entry point
├── hlms-application/       # Use cases layer
├── hlms-domain/            # Domain entities
├── hlms-infrastructure/    # Persistence, integrations
├── hlms-common/            # Shared utilities
├── hlms-workflow/          # State machine configs
├── hlms-batch/             # Batch jobs
├── hlms-deployment/        # Docker, K8s configs
└── docker-compose.dev.yml  # Development setup
```

---

## Troubleshooting

### Port already in use
```bash
# Stop existing containers
docker-compose -f docker-compose.dev.yml down

# Or kill process on port
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :4200
kill -9 <PID>
```

### Fresh rebuild
```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up --build --force-recreate
```

### View logs
```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Specific service
docker-compose -f docker-compose.dev.yml logs -f hlms-frontend
docker-compose -f docker-compose.dev.yml logs -f hlms-backend
```

---

## Support

For issues, contact the development team or raise an issue in the repository.
