#!/usr/bin/env bash
set -e

# Install Playwright browsers
echo "Installing Playwright browsers..."
npm run test:integration:install

# Start services and wait for them to be healthy
echo "Starting services..."
docker compose up -d --wait

# Run Playwright integration tests
echo "Running integration tests..."
npm run test:integration:run
TEST_STATUS=$?

# Cleanup
echo "Cleaning up..."
docker compose down -v

exit $TEST_STATUS
