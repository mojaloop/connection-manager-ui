set -euxo pipefail
# Init vault and save keys
kubectl wait --for=condition=Ready pod/vault-0
kubectl exec vault-0 -- vault operator init -key-shares=1 -key-threshold=1 -format=json > cluster-keys.json

# Store key and unseal vault
VAULT_UNSEAL_KEY=$(jq -r '.unseal_keys_b64[]' cluster-keys.json)
kubectl exec vault-0 -- sh -c "vault operator unseal $VAULT_UNSEAL_KEY"

# Store root key and login
VAULT_ROOT_KEY=$(jq -r '.root_token'  cluster-keys.json)
kubectl exec vault-0 -- sh -c "vault login $VAULT_ROOT_KEY"

kubectl exec vault-0 -- sh -c "vault auth enable approle"
kubectl exec vault-0 -- sh -c "vault write auth/approle/role/my-role secret_id_ttl=1000m token_ttl=1000m token_max_ttl=1000m"
kubectl exec vault-0 -- sh -c "vault read -field role_id auth/approle/role/my-role/role-id > vault/data/role-id"
kubectl exec vault-0 -- sh -c "vault write -field secret_id -f auth/approle/role/my-role/secret-id > vault/data/secret-id"
kubectl exec vault-0 -- sh -c "vault secrets enable -path=pki pki"
kubectl exec vault-0 -- sh -c "vault secrets enable -path=secrets kv"
kubectl exec vault-0 -- sh -c "vault secrets tune -max-lease-ttl=97600h pki"
kubectl exec vault-0 -- sh -c "vault write -field=certificate pki/root/generate/internal \
        common_name='example.com' \
        ttl=97600h"
kubectl exec vault-0 -- sh -c "vault write pki/config/urls \
    issuing_certificates='http://127.0.0.1:8200/v1/pki/ca' \
    crl_distribution_points='http://127.0.0.1:8200/v1/pki/crl'"
kubectl exec vault-0 -- sh -c "vault write pki/roles/example.com allowed_domains=example.com allow_subdomains=true allow_any_name=true allow_localhost=true enforce_hostnames=false max_ttl=97600h"

kubectl exec vault-0 -- sh -c "echo '
path \"secrets/*\"
{
  capabilities = [\"create\", \"read\", \"update\", \"delete\", \"list\", \"sudo\"]
}
path \"kv/*\"
{
  capabilities = [\"create\", \"read\", \"update\", \"delete\", \"list\", \"sudo\"]
}
path \"pki/*\"
{
  capabilities = [\"create\", \"read\", \"update\", \"delete\", \"list\", \"sudo\"]
}
path \"pki_int/*\"
{
  capabilities = [\"create\", \"read\", \"update\", \"delete\", \"list\", \"sudo\"]
}' > vault/data/policy.hcl"

kubectl exec vault-0 -- sh -c "vault policy write test-policy vault/data/policy.hcl"

kubectl exec vault-0 -- sh -c "vault write auth/approle/role/my-role policies=test-policy ttl=1h"

kubectl exec vault-0 -- sh -c "vault secrets enable -path=pki_int pki"
kubectl exec vault-0 -- sh -c "vault secrets tune -max-lease-ttl=43800h pki_int"
kubectl exec vault-0 -- sh -c "vault write pki_int/roles/example.com allowed_domains=example.com allow_subdomains=true allow_any_name=true allow_localhost=true enforce_hostnames=false max_ttl=600h"
