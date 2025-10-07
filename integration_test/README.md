# E2E UI Tests

## Structure

We use page models to abstract the UI and reduce duplication in tests. This speeds up UI refactoring and makes tests more maintainable.

**Rule**: If you find yourself writing a selector, use an existing page model (extend it if necessary), or create a new page model if none exists.

References for those unfamiliar with page models:
- https://testcafe.io/documentation/402826/guides/concepts/page-model#why-use-page-model
- https://github.com/SeleniumHQ/selenium/wiki/PageObjects
- https://martinfowler.com/bliki/PageObject.html

## Prerequisites

- Docker and Docker Compose
- Node.js and yarn (for local development)

## Running Tests

From the project root:

```sh
yarn run test:integration
```

This will:
1. Build the UI Docker image
2. Start all required services (API, database, vault, UI)
3. Run the integration tests
4. Clean up containers

## Running Tests Manually

If you want to run tests without the cleanup:

```sh
# Start services
docker compose up -d --wait

# Run tests
cd integration_test/tests
CONNECTION_MANAGER_ENDPOINT="http://localhost:3000" npm run test:headless

# Clean up when done
cd ../..
docker compose down -v
```

## Run a Single Test

```sh
cd integration_test/tests
npm run test -- -t 'name of test'
```

Example:
```sh
npm run test -- -t 'Log in with valid credentials'
```

## View Test Results

Results are generated in `integration_test/tests/results.html` after running tests.

## With a Different Browser

```sh
BROWSER_TCAFE=chromium npm run test
# or
BROWSER_TCAFE=firefox npm run test
```
