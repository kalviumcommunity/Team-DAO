# ==============================================================================
# Multi-Stage Production Dockerfile for Stucart (Next.js 16 + Node WebSocket)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Dependencies Installation
# ------------------------------------------------------------------------------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci

# ------------------------------------------------------------------------------
# Stage 2: Application Build & Prisma Generation
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Provide build-time fallback environment variables required by Next.js build & Prisma 7
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/stucart_db?schema=public"
ENV JWT_SECRET="build-time-secret-key-for-nextjs-build"
ENV NEXT_PHASE="phase-production-build"
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Prisma client artifacts
RUN npx prisma generate

# Build Next.js standalone application
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 3: Production Runner Image
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV WS_PORT=3001
ENV NEXT_TELEMETRY_DISABLED=1

# Create unprivileged system user/group for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and standalone build output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema, source code, and full node_modules for WebSocket runner & migrations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
EXPOSE 3001

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "server.js"]
