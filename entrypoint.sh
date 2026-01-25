#!/bin/sh
# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running migrations..."
pnpm migrate:up

echo "Seeding..."
pnpm seed:prod

echo "Starting app..."
exec "$@"