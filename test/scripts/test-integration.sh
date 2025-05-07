#!/bin/bash
set -xe

# Change to the directory containing this script
cd "$(dirname "$0")"
# Set Chrome Binary Path
export CHROME_BIN=/usr/bin/google-chrome
export CHROME_PATH=/usr/bin/
export BROWSER_TCAFE=chrome:headless
export DISPLAY=:99
Xvfb :99 -screen 0 1024x768x16 &

# temporarily disable auth for integration tests
sed -i 's/AUTH_ENABLED=true/AUTH_ENABLED=false/' ../../.env

cd ${PROJECT_ROOT}/tmp

# checkout connection-maanger-api and run docker services
git clone https://github.com/pm4ml/connection-manager-api.git
cd connection-manager-api
git checkout feat/integration-test

cat <<EOF >> .env
PORT=3001
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=mcm
DATABASE_PASSWORD=mcm
DATABASE_SCHEMA=mcm
AUTH_ENABLED=false
VAULT_ENDPOINT=http://localhost:8233
VAULT_AUTH_METHOD=APP_ROLE
VAULT_ROLE_ID_FILE=./docker/vault/tmp/role-id
VAULT_ROLE_SECRET_ID_FILE=./docker/vault/tmp/secret-id
VAULT_PKI_CLIENT_ROLE=example.com
VAULT_PKI_SERVER_ROLE=example.com
SWITCH_ID=switch
EOF

# I want to replace docker compose context to be context: ../../../connection-manager-ui  instead of context: ../../connection-manager-ui 
cd docker
ls -la
ls -ls ../../
sed -i 's|context: ../../connection-manager-ui|context: ../../|' docker-compose.yml

docker compose up -d --wait 

npm run migrate-and-seed &

cd ../../integration_test/tests

npm ci
npm run test:headless


# cleanup 
cd ${PROJECT_ROOT}/tmp/connection-manager-api
docker compose down
#  kill the npm process
pkill -f "npm run migrate-and-seed"

rm -rf connection-manager-api

# restore auth
sed -i 's/AUTH_ENABLED=false/AUTH_ENABLED=true/' ${PROJECT_ROOT}/connection-manager-api/.env
