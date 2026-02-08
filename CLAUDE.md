# HLMS - Housing Loan Management System

## Project Overview
Enterprise-grade Housing Loan Management System for PSU banks. Modular monolith architecture with Java 21, Spring Boot 3.3.x, Oracle DB, and Angular 17+ frontend.

## Quick Start

```bash
# Option 1: Run with Docker (recommended for teammates)
docker-compose -f docker-compose.dev.yml up --build

# Option 2: Run frontend locally (for development)
cd hlms-frontend && npm install && npm start

# Access:
# Frontend: http://localhost:4200
# Backend:  http://localhost:8080
# Swagger:  http://localhost:8080/swagger-ui.html
# Login:    admin / admin123
```

## Architecture
- **Pattern:** Modular Monolith with Hexagonal (Ports & Adapters) Architecture
- **Backend:** Single deployable Spring Boot JAR with clean module boundaries
- **Frontend:** Angular 17+ SPA served separately via NGINX
- **Database:** Oracle (prod) / H2 in-memory (dev)
- **Build:** Maven multi-module (backend), npm (frontend)

## Module Structure
```
hlms-common        → Shared kernel (security, audit, exceptions, utils)
hlms-domain        → Pure domain logic, no framework dependencies
hlms-application   → Use cases / orchestration layer
hlms-infrastructure → Outbound adapters (persistence, integrations, messaging)
hlms-workflow      → Spring State Machine configurations
hlms-batch         → Spring Batch jobs
hlms-web           → Spring Boot entry point (@SpringBootApplication)
hlms-frontend/     → Angular 17+ SPA (see Frontend Structure below)
hlms-deployment/   → Docker, K8s, CI/CD
```

## Loan Journey (PSU Bank Flow)

The frontend follows the complete loan lifecycle as per PSU bank standards:

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   LEAD      │ → │    KYC      │ → │  DOCUMENTS  │ → │   CREDIT    │
│  Capture    │   │ Verification│   │ Collection  │   │ Assessment  │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
       ↓                 ↓                 ↓                 ↓
   4 hrs SLA        8 hrs SLA        48 hrs SLA       24 hrs SLA

┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ VALUATION   │ → │  SANCTION   │ → │  AGREEMENT  │ → │ DISBURSEMENT│
│  Property   │   │  Approval   │   │  Execution  │   │   Release   │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
       ↓                 ↓                 ↓                 ↓
   72 hrs SLA       24 hrs SLA        48 hrs SLA       24 hrs SLA
```

## Frontend Structure
```
hlms-frontend/src/app/
├── core/
│   ├── auth/           → auth.service, auth.guard, auth.interceptor
│   └── services/       → api.service (base HTTP client)
├── layout/
│   ├── main-layout/    → App shell with sidebar + header
│   ├── sidebar/        → Navigation menu
│   └── header/         → Top bar with user menu
└── pages/
    ├── login/          → JWT authentication
    ├── dashboard/      → Portfolio stats, charts
    ├── workflow/       → workflow-tracker (SLA tracking, stage progression)
    ├── customers/      → customer-list, customer-detail
    ├── applications/   → application-list, application-form, application-detail
    ├── kyc/            → kyc-verification (queue), kyc-detail (PAN/Aadhaar/Bank/Photo)
    ├── documents/      → document-checklist (upload, verify, OCR extraction)
    ├── underwriting/   → credit-assessment, assessment-detail (FOIR/LTV)
    ├── sanction/       → approval-queue (maker-checker)
    ├── disbursement/   → disbursement-list (tranche tracking)
    ├── servicing/      → loan-list, loan-detail (EMI schedule)
    ├── collections/    → overdue-list (DPD buckets 0-30, 31-60, 61-90, 90+)
    ├── npa/            → npa-list (IRAC: Sub-Standard, Doubtful, Loss)
    ├── reports/        → reports-dashboard (CSV download)
    └── admin/          → user-management, settings
```

## Frontend Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | LoginComponent | JWT authentication |
| `/dashboard` | DashboardComponent | Portfolio overview |
| `/workflow` | WorkflowTrackerComponent | SLA tracking, stage progression |
| `/customers` | CustomerListComponent | Customer search/list |
| `/customers/:id` | CustomerDetailComponent | Customer profile |
| `/applications` | ApplicationListComponent | Application pipeline |
| `/applications/new` | ApplicationFormComponent | New loan application |
| `/applications/:id` | ApplicationDetailComponent | Application workflow |
| `/kyc` | KycVerificationComponent | KYC verification queue |
| `/kyc/:id` | KycDetailComponent | PAN/Aadhaar/Bank/Photo verification |
| `/documents` | DocumentChecklistComponent | Document upload & verification |
| `/underwriting` | CreditAssessmentComponent | Credit assessment queue |
| `/underwriting/assess/:id` | AssessmentDetailComponent | FOIR/LTV analysis |
| `/sanction` | ApprovalQueueComponent | Approval workflow |
| `/disbursement` | DisbursementListComponent | Disbursement tracking |
| `/servicing/loans` | LoanListComponent | Active loans |
| `/servicing/loans/:id` | LoanDetailComponent | EMI schedule, payments |
| `/collections` | OverdueListComponent | DPD bucket management |
| `/npa` | NpaListComponent | NPA classification |
| `/reports` | ReportsDashboardComponent | Report generation |
| `/admin/users` | UserManagementComponent | User CRUD |
| `/admin/settings` | SettingsComponent | System configuration |

## KYC & Document Verification Features
- **e-KYC**: PAN verification, Aadhaar OTP-based verification, Bank account verification, Photo/face match
- **Document OCR**: Auto-extract data from uploaded documents (name, address, salary)
- **Document Checklist**: Track required vs uploaded, verification status, rejection reasons
- **Workflow Automation**: SLA tracking per stage, breach alerts, at-risk indicators

## Coding Standards

### Java
- Java 21 features encouraged: records, sealed classes, pattern matching, virtual threads
- Package convention: `com.hlms.<module>.<layer>.<feature>`
- Domain entities are POJOs with no Spring/JPA annotations — persistence mapping in infrastructure layer
- Use MapStruct for DTO ↔ Entity mapping (no manual mapping)
- Use Lombok (@Data, @Builder, @AllArgsConstructor) for boilerplate reduction
- All monetary values use `BigDecimal` with scale 2 and `RoundingMode.HALF_UP`
- Date/time: `LocalDate`, `LocalDateTime`, `ZonedDateTime` (no java.util.Date)
- Enums for all status fields, type codes, and categories
- No `null` returns — use `Optional<T>` for queries that may return empty

### Spring Boot
- Constructor injection only (no @Autowired on fields)
- Use `@Validated` + Jakarta Bean Validation on all DTOs
- REST controllers return `ResponseEntity<ApiResponse<T>>`
- Global exception handler in hlms-common-exception
- Profiles: `dev`, `test`, `staging`, `prod`, `batch`
- Configuration via `application.yml` (not .properties)

### Database (Oracle)
- Table names: UPPER_SNAKE_CASE (e.g., `LOAN_APPLICATION`)
- Column names: UPPER_SNAKE_CASE (e.g., `CUSTOMER_ID`)
- All tables have: `CREATED_BY`, `CREATED_DATE`, `MODIFIED_BY`, `MODIFIED_DATE`, `VERSION` (optimistic locking)
- Flyway migrations: `V{number}__{description}.sql` (e.g., `V1__create_customer_tables.sql`)
- Use sequences for ID generation (e.g., `SEQ_CUSTOMER_ID`)
- Foreign keys named: `FK_{child_table}_{parent_table}`
- Indexes named: `IDX_{table}_{columns}`

### Security
- JWT authentication with 15-minute access tokens, 8-hour refresh tokens
- RBAC with hierarchical roles — permissions checked via Spring Security annotations
- All PII (PAN, Aadhaar) encrypted at field level with AES-256
- Audit every CUD operation via @Auditable annotation

### Testing
- Unit tests: JUnit 5 + Mockito, target 80%+ coverage on domain/application layers
- Integration tests: Testcontainers with Oracle XE
- Mock external systems: WireMock
- Test class naming: `{ClassName}Test` for unit, `{ClassName}IT` for integration

### Angular (Frontend)
- Angular 17+ with standalone components (no NgModules)
- Use new control flow syntax: `@if`, `@for`, `@switch` (not `*ngIf`, `*ngFor`)
- Use signals for reactive state: `signal()`, `computed()`
- Native HTML form inputs with custom CSS (avoid Angular Material form fields with Tailwind)
- Lazy-loaded routes for all page components
- Use `&#64;` HTML entity for `@` symbol in template strings (Angular 17 requirement)
- Component file naming: `feature-name.component.ts`
- Services use `inject()` function or constructor injection

### API Conventions
- Base path: `/api/v1/`
- REST resource naming: plural nouns (e.g., `/customers`, `/applications`)
- Standard response wrapper: `{ "success": boolean, "data": T, "error": { "code": string, "message": string } }`
- Pagination: `?page=0&size=20&sort=createdDate,desc`
- Error codes: `HLMS-{MODULE}-{NUMBER}` (e.g., `HLMS-CUST-001`)

### Docker
- Development: `docker-compose.dev.yml` with H2 in-memory DB
- Production: `docker-compose.yml` with Oracle
- Frontend served via NGINX with API proxy to backend
- Backend health check: `/actuator/health`

### Git Conventions
- Branch naming: `feature/HLMS-{ticket}-{short-description}`, `bugfix/HLMS-{ticket}-{short-description}`
- Commit messages: `feat(module): description`, `fix(module): description`, `chore(module): description`

## Key Domain Concepts
- **Loan Lifecycle:** Lead → Application → Sanction → Disbursement → Servicing → Closure
- **Maker-Checker:** Every critical operation requires maker (create) + checker (verify) + approver (sanction)
- **Authority Matrix:** Approval limits vary by role and branch hierarchy level
- **FOIR:** Fixed Obligation to Income Ratio — max 50-60% for loan eligibility
- **DPD:** Days Past Due — drives collection actions and NPA classification
- **IRAC Norms:** RBI norms for NPA classification (90+ DPD = NPA)
