#!/bin/sh
set -e

# Start vault in dev mode in the background
vault server -dev -dev-root-token-id=myroot -dev-listen-address=0.0.0.0:8233 &

# Wait for vault to be ready by checking health
until vault status >/dev/null 2>&1; do
  echo "Waiting for vault to be ready..."
  sleep 1
done

# Enable and configure APP_ROLE
vault auth enable approle
vault write auth/approle/role/my-role token_ttl=1h token_max_ttl=2h

# Generate role-id and secret-id files
vault read -field=role_id auth/approle/role/my-role/role-id > /vault/tmp/role-id
vault write -field=secret_id -f auth/approle/role/my-role/secret-id > /vault/tmp/secret-id

# Enable secrets engines
vault secrets enable -path=secrets kv
vault secrets enable -path=pki pki
vault secrets tune -max-lease-ttl=8760h pki
vault write pki/roles/example.com allowed_domains=example.com allow_subdomains=true allow_any_name=true max_ttl=720h

# Signal ready
touch /tmp/ready

# Keep container running
wait
