#!/bin/bash
set -xe

# Function to handle errors
handle_error() {
    local line_no=$1
    local error_code=$2
    local last_command=$3
    echo "Error occurred in line $line_no, exit code: $error_code"
    echo "Failed command: $last_command"
    exit $error_code
}

# Set error handler
trap 'handle_error ${LINENO} $? "$BASH_COMMAND"' ERR

# Change to the directory containing this script
cd "$(dirname "$0")"
pwd
# Set Firefox Binary Path
export FIREFOX_BIN=/usr/bin/firefox
export FIREFOX_PATH=/usr/bin/
export BROWSER_TCAFE=firefox:headless
export DISPLAY=:99
# Xvfb :99 -screen 0 1024x768x16 &

# temporarily disable auth for integration tests
sed -i 's/AUTH_ENABLED=true/AUTH_ENABLED=false/' ../../.env

cd ../../
# checkout connection-maanger-api and run docker services
git clone https://github.com/pm4ml/connection-manager-api.git
cd connection-manager-api
git checkout feat/integration-test
# nvm use

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

cat docker-compose.yml
docker compose up -d --wait 

# Set NVM_DIR to match CircleCI's setup
export NVM_DIR="/opt/circleci/.nvm"

set +x
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" >/dev/null 2>&1

nvm list
nvm install v18.15.0
nvm use v18.15.0

set -x

cd ..
npm ci
npm run migrate-and-seed

cd ../
ls -la
# nvm use
cd integration_test/tests
echo "node --version"
node --version


node -v
npm ci
npx testcafe --version
npm run test:headless

