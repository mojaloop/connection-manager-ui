#!/usr/bin/env bash
set -e

# Start services and wait for them to be healthy
docker compose up -d --wait

# Install dependencies and run the integration tests
cd integration_test/tests
npm install
CONNECTION_MANAGER_ENDPOINT="http://localhost:3000" npm run test:headless
TEST_STATUS=$?

# Cleanup
cd ../..
docker compose down -v

exit $TEST_STATUS
