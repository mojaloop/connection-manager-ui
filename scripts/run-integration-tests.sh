#!/usr/bin/env bash
set -e

# Start services and wait for them to be healthy
docker compose up -d --wait

# Run the integration tests
cd integration_test/tests
CONNECTION_MANAGER_ENDPOINT="http://localhost:3000" npm run test:headless
TEST_STATUS=$?

# Cleanup
cd ../..
docker compose down -v

exit $TEST_STATUS
