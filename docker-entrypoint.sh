#!/bin/sh
set -e

echo "[Docker Entrypoint] Initializing Stucart Container Environment..."

# Execute database migrations if DATABASE_URL is present
if [ -n "$DATABASE_URL" ]; then
  echo "[Docker Entrypoint] Running Prisma database migrations (prisma migrate deploy)..."
  npx prisma migrate deploy || echo "[Docker Entrypoint] Migration failed or skipped."

  if [ "$SEED_DATABASE" = "true" ]; then
    echo "[Docker Entrypoint] Seeding database (npx prisma db seed)..."
    npx prisma db seed || echo "[Docker Entrypoint] Database seeding failed or already seeded."
  fi
else
  echo "[Docker Entrypoint] WARNING: DATABASE_URL is not set. Skipping migrations."
fi

echo "[Docker Entrypoint] Launching container command: $@"
exec "$@"
