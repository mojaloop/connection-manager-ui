#!/usr/bin/env bash
set -eo pipefail

# Install Playwright browsers
echo "Installing Playwright browsers..."
npm run test:integration:install

# Start services and wait for them to be healthy
echo "Starting services..."
if ! docker compose up -d --wait; then
  echo "=== docker compose up failed; dumping container status and logs ==="
  docker compose ps -a
  docker compose logs --no-color --timestamps
  docker compose down -v
  exit 1
fi

# Run Playwright integration tests
echo "Running integration tests..."
if ! npm run test:integration:run; then
  echo "=== integration tests failed; dumping container status and logs ==="
  docker compose ps -a
  docker compose logs --no-color --timestamps
  exit 1
fi

# Cleanup
echo "Cleaning up..."
docker compose down -v
