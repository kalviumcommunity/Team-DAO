# 🤖 Agent Operational Guidelines & Architecture Context — Stucart

> **Repository:** `kalviumcommunity/Team-DAO` (Stucart Marketplace)  
> **Target:** AI Autonomous Agents & Assistant Integration (Antigravity / Gemini)  
> **Status:** Active Standard Operational Procedure (SOP)

---

## 1. Core Architectural Guidelines & Principles

When developing features, fixing bugs, or refactoring code in this repository, agents MUST adhere strictly to the following architectural invariants:

### 1.1 Layered Service-Oriented Separation
- **Presentation / Page Layer (`src/app/(frontend)`)**: UI components, React Server Components (RSC), Client Components (`"use client"`), and custom React hooks (`useWebSocket`).
- **Route Handlers (`src/app/api/`)**: Thin controllers handling HTTP requests. **DO NOT** execute direct database queries or complex domain logic here. Always delegate to Service classes.
- **Domain Services (`src/backend/services/`)**: Business logic layer. Enforces state machine rules, calculates stock status transitions, and triggers transactional logging (`AuditLog`, `InventoryLog`).
- **Repositories (`src/backend/repositories/`)**: Encapsulates Prisma ORM primitives and raw database operations.
- **Real-Time Subsystem (`src/backend/websocket/`)**: Node `ws` server handling live socket connections, heartbeats, and stock alert broadcasts.

```
Request Flow Invariant:
[Client] ➔ [Next Middleware] ➔ [Rate Limiter] ➔ [RBAC Guard] ➔ [Route Handler] ➔ [Domain Service] ➔ [Repository] ➔ [Prisma / Postgres]
```

---

## 2. Mandatory Security & Safety Constraints

### 2.1 RBAC & Session Guards
All protected API route handlers MUST execute an RBAC guard before reading request payloads or invoking service logic:
- `requireRole(req, [UserRole.STUDENT, UserRole.VERIFIER, ...])`
- `requireAdmin(req)` (allows `ADMIN` and `SUPER_ADMIN`)
- `requireSuperAdmin(req)` (allows `SUPER_ADMIN` only)

```typescript
// MANDATORY ROUTE PATTERN
export async function POST(req: NextRequest) {
  const { user, response } = await requireAdmin(req);
  if (response) return response; // Return 401 / 403 immediately

  const body = await req.json();
  const result = await AdminService.createProduct(user.id, body);
  return NextResponse.json(result, { status: 201 });
}
```

### 2.2 Account Suspension Guard
Account suspension (`isSuspended: true`) is enforced universally in `src/backend/middleware/rbac.ts`. **DO NOT** bypass or disable `isSuspended` checks under any circumstances.

### 2.3 Immutable Audit Logging
Any endpoint or service method that mutates administrative state (user roles, account suspension, product management, order fulfillment) MUST invoke:
- `AdminRepository.createAuditLog(...)`
- `AdminRepository.createInventoryLog(...)` (if product stock quantity changes)

---

## 3. Data Model & State Machine Rules

### 3.1 Stock & Status Lifecycle Automation
When mutating product stock (`Listing.stock`):
- If `stock <= 0`, listing status MUST automatically transition to `ListingStatus.SOLD`.
- If `stock > 0` and current status is not `DEACTIVATED`, listing status MUST transition to `ListingStatus.ACTIVE`.

### 3.2 Product Verification (CAC)
New products submitted by students start in `PENDING_VERIFICATION`. Only users with `VERIFIER`, `ADMIN`, or `SUPER_ADMIN` roles can alter verification state to `ACTIVE` (Approved) or `DEACTIVATED` (Rejected).

---

## 4. Operational Commands & Diagnostic Workflows

Agents should use the following standard commands to inspect, test, and validate changes:

### 4.1 Development Servers
```bash
# Start Next.js App Router (Port 3000)
npm run dev

# Start Real-Time WebSocket Server (Port 3001)
npm run ws:dev
```

### 4.2 Database Operations
```bash
# Apply Prisma schema migrations
npx prisma migrate dev

# Seed test database with initial accounts and listings
npx prisma db seed
```

### 4.3 Automated Integration Tests
```bash
# Verify stock auto-sold state transitions
npx tsx src/backend/test-sold-out.ts

# Verify RBAC, JWT, and Admin metrics endpoints
npx tsx src/backend/test-admin-rbac.ts
```

---

## 5. File & Directory Reference Map

| Component Path | Description |
|---|---|
| [`src/middleware.ts`](file:///c:/Users/Aditya%20M%20Talikoti/Team-DAO/src/middleware.ts) | Global Next.js middleware handling API rate limiting headers |
| [`src/backend/middleware/rate-limit.ts`](file:///c:/Users/Aditya%20M%20Talikoti/Team-DAO/src/backend/middleware/rate-limit.ts) | Sliding-window in-memory rate limiter |
| [`src/backend/middleware/rbac.ts`](file:///c:/Users/Aditya%20M%20Talikoti/Team-DAO/src/backend/middleware/rbac.ts) | JWT authentication & role-based access controller |
| [`src/backend/websocket/server.ts`](file:///c:/Users/Aditya%20M%20Talikoti/Team-DAO/src/backend/websocket/server.ts) | Node `ws` server and connection registry |
| [`src/backend/services/stock-check.job.ts`](file:///c:/Users/Aditya%20M%20Talikoti/Team-DAO/src/backend/services/stock-check.job.ts) | 30-second active wishlist stock monitor background job |
| [`prisma/schema.prisma`](file:///c:/Users/Aditya%20M%20Talikoti/Team-DAO/prisma/schema.prisma) | Data model & enums definition |
