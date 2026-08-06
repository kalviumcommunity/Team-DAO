# 🏗️ Stucart — High-Level Design (HLD) Document

> **Document Version:** 1.0.0  
> **System Name:** Stucart Campus Marketplace Platform  
> **Organization:** Team-DAO  
> **Target Audience:** System Architects, Backend Engineers, DevOps, and Technical Leads

---

## 1. System Architecture Overview

Stucart is constructed using a **layered, service-oriented architecture** that decouples presentation, API routing, business domain logic, data access, and real-time event broadcasting. 

The architecture strictly adheres to separation of concerns, ensuring that security controls (rate limiting, authentication, authorization) are executed before requests hit application business logic.

```mermaid
flowchart TB
    subgraph Client["🖥️ Client Layer (Next.js 16 App Router)"]
        UI["React 19 Server & Client Components"]
        Hooks["Custom Hooks (useWebSocket, etc.)"]
    end

    subgraph Edge["🛡️ Edge / Security Layer"]
        Middleware["Next.js Global Middleware<br/>(middleware.ts)"]
        RateLimiter["Sliding-Window Rate Limiter<br/>(rate-limit.ts)"]
        RBAC["RBAC Guard & Session Enforcement<br/>(rbac.ts)"]
    end

    subgraph API["🌐 API Route Layer"]
        AuthAPI["/api/auth/*"]
        ProductAPI["/api/products/*"]
        CartAPI["/api/cart/*"]
        ExchangeAPI["/api/exchange/*"]
        VerifyAPI["/api/verification/*"]
        AdminAPI["/api/admin/*"]
    end

    subgraph Service["⚙️ Domain Service Layer"]
        AuthSvc["AuthService"]
        ListingSvc["ListingService"]
        AdminSvc["AdminService"]
        ExchangeSvc["ExchangeService"]
        VerifySvc["VerificationService"]
        StockJob["StockCheckJob (30s Polling)"]
    end

    subgraph Repo["🗃️ Repository Layer"]
        UserRepo["UserRepository"]
        ListingRepo["ListingRepository"]
        AdminRepo["AdminRepository"]
        ExchangeRepo["ExchangeRepository"]
        VerifyRepo["VerificationRepository"]
    end

    subgraph Persistence["💾 Persistence Layer"]
        Prisma["Prisma ORM 7 (@prisma/adapter-pg)"]
        Postgres[("PostgreSQL Database")]
    end

    subgraph Realtime["⚡ Real-Time Subsystem"]
        WSServer["WebSocket Server (ws://localhost:3001)"]
        ClientsMap["Active User Sockets Registry"]
    end

    UI -->|HTTPS Requests| Middleware
    Hooks <-->|WSS Sockets| WSServer
    Middleware --> RateLimiter --> RBAC --> API
    API --> Service
    Service --> Repo
    Repo --> Prisma --> Postgres
    StockJob -->|Check Active Sockets| WSServer
    StockJob -->|Fetch Active Wishlists| Prisma
    StockJob -->|Send Low Stock Alert| WSServer
    WSServer -->|Push Push Alerts| Hooks

    style Client fill:#1e293b,stroke:#6366f1,color:#fff
    style Edge fill:#312e81,stroke:#6366f1,color:#fff
    style API fill:#1e3a8a,stroke:#3b82f6,color:#fff
    style Service fill:#164e63,stroke:#06b6d4,color:#fff
    style Repo fill:#134e4a,stroke:#14b8a6,color:#fff
    style Persistence fill:#3f3f46,stroke:#a1a1aa,color:#fff
    style Realtime fill:#7c2d12,stroke:#f97316,color:#fff
```

---

## 2. Layer & Subsystem Breakdown

### 2.1 Edge & Security Layer
- **Global Middleware (`middleware.ts`):** Intercepts all incoming requests matching `/api/:path*`. Extracts client IP (supporting `x-forwarded-for` and `x-real-ip`) and evaluates rate limits.
- **Sliding-Window Rate Limiter (`rate-limit.ts`):** Maintains in-memory request timestamps per IP and route bucket. Returns `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and HTTP `429` on violations.
- **RBAC Guard (`rbac.ts`):** Decodes JWT tokens, validates active session, checks account suspension (`isSuspended`), and verifies role permissions (`STUDENT`, `VERIFIER`, `ADMIN`, `SUPER_ADMIN`).

### 2.2 API & Route Handlers Layer
- Located under `src/app/api/`.
- Acts as thin HTTP controllers responsible for:
  1. Invoking RBAC guards.
  2. Parsing and validating request body/query parameters.
  3. Delegating execution to domain services.
  4. Returning standardized JSON responses and HTTP status codes (`200`, `201`, `400`, `401`, `403`, `404`, `500`).

### 2.3 Domain Service Layer
- Located under `src/backend/services/`.
- Encapsulates business logic, transactional invariants, role validation checks, and automatic side-effects (e.g., auto-updating listing status based on stock levels, creating `InventoryLog` entries, and recording `AuditLog` records).

### 2.4 Repository Layer
- Located under `src/backend/repositories/`.
- Decouples domain logic from Prisma ORM primitives.
- Provides type-safe query builders, filter constructs, paginated queries, and composite relational mutations.

### 2.5 Real-Time WebSocket Subsystem
- Located under `src/backend/websocket/server.ts` and `src/backend/services/stock-check.job.ts`.
- Runs a standalone HTTP/WebSocket server listening on port `3001`.
- **Connection Management:** Tracks active sockets with unique client IDs and associated `userId` / `userEmail`.
- **Heartbeat Protocol:** Runs 30-second ping/pong cycles to detect and terminate broken TCP connections.
- **Wishlist Stock Check Job:** A periodic worker that runs every 30 seconds, identifies active connected users, checks their wishlisted items in PostgreSQL, and pushes targeted `LOW_STOCK` or `OUT_OF_STOCK` notifications via WebSockets.

---

## 3. Data Flow & Sequence Diagrams

### 3.1 Request Execution & Defense Pipeline

```mermaid
sequenceDiagram
    autonumber
    participant Client as Client Application
    participant MW as Next.js Middleware
    participant RL as Rate Limiter Guard
    participant RBAC as RBAC Guard
    participant API as Route Handler
    participant Svc as Domain Service
    participant Repo as Repository Layer
    participant DB as PostgreSQL

    Client->>MW: HTTP Request (e.g. POST /api/admin/products)
    MW->>RL: checkRateLimit(ip, path, method)
    alt Rate Limit Exceeded
        RL-->>Client: HTTP 429 Too Many Requests
    else Allowed
        RL->>RBAC: requireAdmin(req)
        alt Token Missing or Invalid / Account Suspended
            RBAC-->>Client: HTTP 401 Unauthorized / HTTP 403 Forbidden
        else Authorized Admin
            RBAC->>API: Next step handler execution
            API->>Svc: AdminService.createProduct(adminId, payload)
            Svc->>Repo: AdminRepository.createProduct(...)
            Repo->>DB: INSERT into "Listing"
            DB-->>Repo: Created entity
            Svc->>Repo: AdminRepository.createInventoryLog(...)
            Svc->>Repo: AdminRepository.createAuditLog(...)
            Repo->>DB: INSERT into "InventoryLog" & "AuditLog"
            Svc-->>API: Result payload
            API-->>Client: HTTP 201 Created + JSON body
        end
    end
```

### 3.2 Peer-to-Peer Product Verification Sequence

```mermaid
sequenceDiagram
    autonumber
    participant Seller as Student Seller
    participant API as Verification API
    participant Svc as VerificationService
    participant Verifier as CAC Verifier
    participant DB as PostgreSQL

    Seller->>API: POST /api/products (Create Listing)
    API->>Svc: ListingService.createListing()
    Svc->>DB: INSERT Listing (status = PENDING_VERIFICATION)
    Verifier->>API: GET /api/verification (Fetch Queue)
    API->>Svc: VerificationService.getPendingQueue()
    Svc-->>Verifier: List of pending listings
    alt Approve Listing
        Verifier->>API: PATCH /api/verification/:id { status: APPROVED }
        API->>Svc: VerificationService.updateStatus()
        Svc->>DB: UPDATE Listing SET status = 'ACTIVE', verified = true
    else Reject Listing
        Verifier->>API: PATCH /api/verification/:id { status: REJECTED, remarks: "Incomplete description" }
        API->>Svc: VerificationService.updateStatus()
        Svc->>DB: UPDATE Listing SET status = 'DEACTIVATED'
    end
```

---

## 4. Key Cross-Cutting Architecture Strategies

### 4.1 Tiered Sliding-Window Rate Limiting

Rate limiting is governed by an in-memory timestamp sliding-window store:

| Bucket | Matching Condition | Limit Threshold | Window Size |
|---|---|---|---|
| **`auth`** | Endpoint begins with `/api/auth` | 10 requests | 60 seconds |
| **`mutation`** | HTTP method is `POST`, `PUT`, `DELETE`, or `PATCH` | 30 requests | 60 seconds |
| **`general`** | All standard read operations (`GET`) | 100 requests | 60 seconds |

### 4.2 Auditability & Inventory Tracking

Every write action by an administrator triggers two transactional side effects:
1. **`InventoryLog` Record:** Captures `previousStock`, `newStock`, `listingId`, `updatedById`, and timestamp whenever stock is modified.
2. **`AuditLog` Record:** Captures `adminId`, `action` (e.g. `UPDATE_USER_ROLE`, `SUSPEND_USER`, `CREATE_PRODUCT`, `DELETE_PRODUCT`), `targetType`, `targetId`, `details`, and timestamp.

### 4.3 Resilience & Fault Tolerance

- **Database Connection Pooling:** Utilizes `@prisma/adapter-pg` over `pg.Pool` to reuse database TCP sockets efficiently.
- **WebSocket Singleton Guard:** Prevents duplicate server listener bindings during Next.js Hot Module Replacement (HMR) in development environments.
