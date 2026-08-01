<div align="center">

# 🎓 Stucart

### Enterprise-Grade Campus Peer-to-Peer Marketplace & Admin Control Platform

*Buy. Sell. Exchange. Verify. In real time.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM%207-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![WebSocket](https://img.shields.io/badge/Realtime-WebSocket-FF6600?logo=socketdotio&logoColor=white)](https://github.com/websockets/ws)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#-license)

[Overview](#-overview) • [Architecture](#-system-architecture) • [Tech Stack](#-technology-stack) • [Data Model](#-data-model) • [Getting Started](#-getting-started) • [API Reference](#-api-reference) • [Security](#-security--reliability)

</div>

---

## 📖 Overview

**Stucart** (developed under the **Team-DAO** organization) is a full-stack, production-grade **campus marketplace platform** that enables students to **buy, sell, exchange, or donate** textbooks, electronics, stationery, and dorm essentials — backed by an institutional-grade **Admin Control Console**.

The platform combines a modern **Next.js 16 / React 19** frontend with a robust **Node.js + PostgreSQL** backend, layered with:

- 🔐 **JWT authentication** with **Role-Based Access Control (RBAC)**
- 🧑‍💼 **Campus Access Controller (CAC)** product verification workflow
- ⚡ **Real-time WebSocket** stock alerts and notifications
- 🛡️ **Sliding-window rate limiting** across all API surfaces
- 📊 A full **Admin Console** — user management, inventory audits, order tracking, and system-wide audit logging

> Built with the same engineering rigor expected of production systems at scale: layered architecture, transactional integrity, observability via audit trails, and defense-in-depth security.

---

## 🏗️ System Architecture

Stucart follows a **layered, service-oriented architecture** separating concerns across presentation, API, business logic, data access, and real-time subsystems.

```mermaid
flowchart TB
    subgraph Client["🖥️ Client Layer"]
        Web["Next.js App Router<br/>React 19 + TypeScript"]
        WSClient["useWebSocket Hook<br/>Auto-Reconnect"]
    end

    subgraph Edge["🛡️ Edge / Middleware Layer"]
        MW["Next.js Middleware<br/>middleware.ts"]
        RL["Sliding-Window<br/>Rate Limiter"]
        RBAC["RBAC Guard<br/>requireRole / requireAdmin"]
    end

    subgraph API["🌐 API Layer (Route Handlers)"]
        AuthAPI["/api/auth/*"]
        ProductAPI["/api/products/*"]
        CartAPI["/api/cart/*"]
        ExchangeAPI["/api/exchange/*"]
        VerifyAPI["/api/verification/*"]
        AdminAPI["/api/admin/*"]
    end

    subgraph Service["⚙️ Service Layer"]
        AuthSvc["auth.service.ts"]
        ListingSvc["listing.service.ts"]
        AdminSvc["admin.service.ts"]
        ExchangeSvc["exchange.service.ts"]
        VerifySvc["verification.service.ts"]
    end

    subgraph Repo["🗃️ Repository Layer"]
        UserRepo["user.repository.ts"]
        ListingRepo["listing.repository.ts"]
        AdminRepo["admin.repository.ts"]
        ExchangeRepo["exchange.repository.ts"]
    end

    subgraph Data["💾 Data Layer"]
        Prisma["Prisma ORM 7"]
        DB[("PostgreSQL")]
    end

    subgraph Realtime["⚡ Real-Time Subsystem"]
        WSServer["WebSocket Server<br/>ws://localhost:3001"]
        StockJob["Stock Monitor Job<br/>(30s interval)"]
    end

    Web -->|HTTPS| MW
    MW --> RL --> RBAC --> API
    API --> Service --> Repo --> Prisma --> DB

    WSClient <-->|Persistent Socket| WSServer
    StockJob -->|Reads Wishlists| Prisma
    StockJob -->|Push Alerts| WSServer
    WSServer -->|LOW_STOCK / OUT_OF_STOCK| WSClient

    style Client fill:#1e293b,stroke:#6366f1,color:#fff
    style Edge fill:#312e81,stroke:#6366f1,color:#fff
    style API fill:#1e3a8a,stroke:#3b82f6,color:#fff
    style Service fill:#164e63,stroke:#06b6d4,color:#fff
    style Repo fill:#134e4a,stroke:#14b8a6,color:#fff
    style Data fill:#3f3f46,stroke:#a1a1aa,color:#fff
    style Realtime fill:#7c2d12,stroke:#f97316,color:#fff
```

### Request Lifecycle

Every API request flows through a strict pipeline of **rate limiting → authentication → authorization → business logic → persistence**, guaranteeing consistent security enforcement regardless of endpoint.

```mermaid
sequenceDiagram
    autonumber
    participant U as Client
    participant MW as Middleware
    participant RL as Rate Limiter
    participant RB as RBAC Guard
    participant R as API Route
    participant S as Service Layer
    participant D as Repository / Prisma
    participant PG as PostgreSQL

    U->>MW: HTTP Request (/api/**)
    MW->>RL: Check sliding window
    alt Limit Exceeded
        RL-->>U: 429 Too Many Requests + Retry-After
    else Within Limit
        RL->>RB: Forward request
        RB->>RB: Verify JWT + role + isSuspended
        alt Unauthorized
            RB-->>U: 401 / 403
        else Authorized
            RB->>R: Proceed to handler
            R->>S: Invoke domain logic
            S->>D: Query / Mutate
            D->>PG: SQL via Prisma
            PG-->>D: Result set
            D-->>S: Typed entities
            S-->>R: Business result
            R-->>U: 200 OK + JSON payload
        end
    end
```

### Real-Time Stock Alert Pipeline

```mermaid
sequenceDiagram
    autonumber
    participant Job as Stock Monitor Job (30s)
    participant DB as PostgreSQL
    participant WS as WebSocket Server
    participant Client as Connected User

    loop Every 30 seconds
        Job->>DB: Fetch wishlists of active WS users
        DB-->>Job: Listings + stock levels
        alt stock <= 2
            Job->>WS: emit LOW_STOCK
            WS->>Client: "Hurry! Almost Sold Out ⚡"
        else stock == 0 or status == SOLD
            Job->>WS: emit OUT_OF_STOCK
            WS->>Client: "Item Sold Out 🚫"
        end
    end
    Client->>WS: heartbeat ping (30s)
    WS-->>Client: pong
```

---

## 🧰 Technology Stack

<table>
<tr><th>Layer</th><th>Technology</th><th>Purpose</th></tr>
<tr><td><b>Frontend Framework</b></td><td>Next.js 16 (App Router), React 19, TypeScript</td><td>SSR/CSR hybrid rendering, type-safe UI</td></tr>
<tr><td><b>Styling</b></td><td>Tailwind CSS v4, Framer Motion</td><td>Glassmorphism design system & micro-interactions</td></tr>
<tr><td><b>Icons</b></td><td>Lucide React</td><td>Consistent iconography</td></tr>
<tr><td><b>Database</b></td><td>PostgreSQL + Prisma ORM 7 (<code>@prisma/adapter-pg</code>)</td><td>Relational integrity, type-safe queries</td></tr>
<tr><td><b>Real-Time</b></td><td>Node.js <code>ws</code> WebSocket Server</td><td>Live stock alerts & connection tracking</td></tr>
<tr><td><b>Auth</b></td><td>JWT (<code>jsonwebtoken</code>), <code>bcryptjs</code></td><td>Stateless auth & secure password hashing</td></tr>
<tr><td><b>Security</b></td><td>Custom sliding-window rate limiter, RBAC middleware</td><td>Abuse prevention & access control</td></tr>
</table>

---

## 🗄️ Data Model

```mermaid
erDiagram
    User ||--o{ Listing : sells
    User ||--o{ WishlistItem : bookmarks
    User ||--o{ CartItem : holds
    User ||--o{ ExchangeRequest : sends
    User ||--o{ ExchangeRequest : receives
    User ||--o{ Verification : reviews
    User ||--o{ Order : places
    User ||--o{ InventoryLog : updates
    User ||--o{ AuditLog : performs

    Listing ||--o{ WishlistItem : "bookmarked in"
    Listing ||--o{ CartItem : "added to"
    Listing ||--o{ OrderItem : "sold as"
    Listing ||--o{ Verification : "verified by"
    Listing ||--o{ InventoryLog : "tracked in"
    Listing ||--o{ ExchangeRequest : "offered/requested"

    Order ||--|{ OrderItem : contains

    User {
        string id PK
        string name
        string email UK
        string password
        string college
        enum role
        bool isSuspended
    }

    Listing {
        string id PK
        string title
        decimal price
        enum condition
        enum status
        enum listingType
        int stock
        bool verified
        string sellerId FK
    }

    ExchangeRequest {
        string id PK
        string senderId FK
        string receiverId FK
        string offeredProductId FK
        string requestedProductId FK
        enum status
    }

    Verification {
        string id PK
        string listingId FK
        string verifierId FK
        enum status
        string remarks
    }

    Order {
        string id PK
        string userId FK
        decimal totalAmount
        enum status
    }

    OrderItem {
        string id PK
        string orderId FK
        string listingId FK
        int quantity
        decimal priceAtPurchase
    }

    InventoryLog {
        string id PK
        string listingId FK
        int previousStock
        int newStock
        string updatedById FK
    }

    AuditLog {
        string id PK
        string adminId FK
        string action
        string targetType
        string targetId
        datetime timestamp
    }
```

### Listing Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> PENDING_VERIFICATION : Listing created
    PENDING_VERIFICATION --> ACTIVE : CAC approves
    PENDING_VERIFICATION --> DEACTIVATED : CAC rejects
    ACTIVE --> SOLD : stock reaches 0
    ACTIVE --> EXCHANGED : exchange approved
    SOLD --> ACTIVE : restock (stock > 0)
    ACTIVE --> DEACTIVATED : seller/admin removes
    EXCHANGED --> [*]
    DEACTIVATED --> [*]
```

---

## 🔐 Security & Reliability

| Control | Implementation |
|---|---|
| **Password Storage** | `bcryptjs` hashing, 10 salt rounds |
| **Session/Auth** | Stateless JWT (Bearer header / HttpOnly cookie) |
| **Authorization** | RBAC guards — `requireRole`, `requireAdmin`, `requireSuperAdmin` |
| **Abuse Prevention** | Sliding-window rate limiter (per-IP, tiered by route sensitivity) |
| **Account Safety** | `isSuspended` flag enforced at the RBAC layer on every request |
| **Auditability** | Immutable `AuditLog` + `InventoryLog` tables for all sensitive mutations |
| **Data Integrity** | Prisma-enforced relational constraints & unique composite keys (e.g., `@@unique([userId, listingId])`) |

### Rate Limiting Tiers

| Route Class | Limit | Window |
|---|---|---|
| `POST /api/auth/*` | 10 requests | 60s |
| Mutations (`POST`/`PUT`/`PATCH`/`DELETE`) | 30 requests | 60s |
| Reads (`GET`) | 100 requests | 60s |

Exceeding a threshold returns `429 Too Many Requests` with `X-RateLimit-*` and `Retry-After` headers.

---

## 🌐 API Reference

<details>
<summary><b>Authentication</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate and issue JWT |
| `GET` | `/api/auth/me` | Fetch current session user |

</details>

<details>
<summary><b>Marketplace</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Search/filter listings |
| `GET` | `/api/products/[id]` | Fetch single listing |
| `POST` | `/api/products` | Create a listing |
| `GET` | `/api/cart` | Retrieve cart contents |
| `POST` | `/api/cart` | Add item to cart |
| `DELETE` | `/api/cart/[id]` | Remove cart line item |
| `GET` | `/api/wishlist` | Retrieve wishlist |
| `POST` | `/api/wishlist/[id]` | Toggle wishlist item |

</details>

<details>
<summary><b>Exchange & Verification</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/exchange` | Create swap request |
| `PATCH` | `/api/exchange/[id]` | Approve / reject / cancel |
| `GET` | `/api/verification` | CAC verifier queue |
| `PATCH` | `/api/verification/[id]` | Approve/reject with remarks |

</details>

<details>
<summary><b>Admin Console</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/dashboard` | System metrics & KPIs |
| `GET`/`PATCH` | `/api/admin/products` | Manage catalogue & stock |
| `GET` | `/api/admin/inventory` | Inventory change history |
| `GET`/`PATCH` | `/api/admin/orders` | Order management |
| `GET`/`PATCH` | `/api/admin/users` | Role promotion & suspension |
| `GET` | `/api/admin/audit-logs` | Full audit trail |

</details>

---

## 🖥️ Application Map

```mermaid
mindmap
  root((Stucart))
    Public
      Home
      Books / Electronics / Stationery
      Product Detail
      Login / Signup
    Student
      Cart
      Wishlist
      Sell Dashboard
      Order Confirmation
    Verifier
      /verify — CAC Workspace
    Admin Console
      Dashboard
      Products
      Inventory
      Orders
      Users
      Audit Logs
      Settings
    Diagnostics
      /ws-test — WebSocket Health
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- PostgreSQL ≥ 15
- npm / pnpm / yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Team-DAO/stucart.git
cd stucart

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Set DATABASE_URL, JWT_SECRET, WS_PORT, etc.

# 4. Run database migrations
npx prisma migrate dev

# 5. Seed sample data (users, listings, orders, audit logs)
npx prisma db seed

# 6. Start the WebSocket server
npm run ws:server

# 7. Start the Next.js app
npm run dev
```

The app will be available at `http://localhost:3000`, and the WebSocket server at `ws://localhost:3001`.

### Seeded Accounts

| Role | Email | Notes |
|---|---|---|
| Super Admin | `superadmin@college.edu` | Full system access |
| Admin | `admin@college.edu` | Standard admin |
| Verifier | seeded ×2 | CAC verification queue |
| Student | seeded ×4 | Buyer/seller accounts |

---

## 🧪 Testing

```bash
# Auto stock-status transition tests
npx ts-node src/backend/test-sold-out.ts

# RBAC / JWT / metrics integration tests
npx ts-node src/backend/test-admin-rbac.ts
```

---

## 📂 Project Structure

```
Team-DAO/
├── prisma/
│   ├── schema.prisma        # Data model & enums
│   └── seed.ts               # Database seeder
├── src/
│   ├── app/
│   │   ├── (frontend)/       # Public + role-based pages
│   │   └── api/               # Route handlers
│   ├── backend/
│   │   ├── middleware/        # RBAC, rate limiting
│   │   ├── repositories/      # Data access layer
│   │   ├── services/          # Business logic
│   │   ├── websocket/         # Real-time server
│   │   └── utils/             # Auth, helpers
│   └── frontend/
│       ├── components/        # UI component library
│       ├── hooks/              # useWebSocket, etc.
│       └── shared/              # Types & validators
└── middleware.ts               # Global Next.js middleware
```

---

## 🗺️ Roadmap

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Image upload to object storage (S3-compatible)
- [ ] Push notifications via web push / FCM
- [ ] GraphQL gateway for mobile clients
- [ ] Horizontal scaling of WebSocket layer (Redis pub/sub)

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

<div align="center">

Built with ⚙️ engineering discipline by **Team-DAO**

</div>