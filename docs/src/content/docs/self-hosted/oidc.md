---
title: OIDC Setup
description: Configuring OpenID Connect authentication for self-hosted Scanopy.
---

Scanopy supports OpenID Connect (OIDC) for enterprise authentication with providers like Authentik, Keycloak, Auth0, Okta, PocketID, and others.

## Quick Start

1. Copy `oidc.toml.example` to `oidc.toml`
2. Configure your provider settings (see examples below)
3. Mount the file in docker-compose
4. Restart the server

## Configuration File Format

```toml
[[oidc_providers]]
name = "Provider Name"           # Display name in UI
slug = "provider-slug"           # Used in callback URL (lowercase, no spaces)
logo = "https://..."             # Optional: logo URL for UI
issuer_url = "https://..."       # Provider's OIDC issuer URL
client_id = "your-client-id"
client_secret = "your-client-secret"
```

You can configure multiple providers by adding multiple `[[oidc_providers]]` sections.

## Callback URL Format

Configure this URL in your OIDC provider's redirect/callback settings:

```
http://your-scanopy-domain:60072/api/auth/oidc/{slug}/callback
```

Replace `{slug}` with the slug value from your oidc.toml. For example, if `slug = "authentik"`:

```
http://scanopy.local:60072/api/auth/oidc/authentik/callback
```

**Required scopes**: `openid`, `email`, `profile` (profile is optional but recommended)

## Docker Compose Setup

Add the following volume mount to your `scanopy-server` service:

```yaml
services:
  scanopy-server:
    image: ghcr.io/scanopy/scanopy/server:latest
    volumes:
      - ./oidc.toml:/oidc.toml:ro
    # ... rest of config
```

## Provider Examples

### Authentik

1. **Create Application** in Authentik Admin → Applications → Create:
   - Name: `Scanopy`
   - Slug: `scanopy`
   - Provider: Create a new OAuth2/OpenID Provider

2. **Configure Provider**:
   - Name: `Scanopy OIDC`
   - Authorization flow: `default-provider-authorization-implicit-consent`
   - Client type: `Confidential`
   - Redirect URIs: `http://your-scanopy:60072/api/auth/oidc/authentik/callback`
   - Copy the Client ID and Client Secret

3. **Find your Issuer URL**:
   - Go to Providers → your provider → OpenID Configuration Issuer
   - Usually: `https://auth.yourdomain.com/application/o/scanopy/`
   - **Important**: Remove trailing slash if present (see Common Issues)

4. **Configure oidc.toml**:

```toml
[[oidc_providers]]
name = "Authentik"
slug = "authentik"
logo = "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/authentik.svg"
issuer_url = "https://auth.yourdomain.com/application/o/scanopy"
client_id = "your-client-id"
client_secret = "your-client-secret"
```

### Keycloak

1. **Create Client** in Keycloak Admin → Clients → Create:
   - Client ID: `scanopy`
   - Client type: `OpenID Connect`
   - Client authentication: `On`

2. **Configure Client Settings**:
   - Valid redirect URIs: `http://your-scanopy:60072/api/auth/oidc/keycloak/callback`
   - Web origins: `http://your-scanopy:60072`

3. **Get Credentials**:
   - Go to Credentials tab
   - Copy Client Secret

4. **Configure oidc.toml**:

```toml
[[oidc_providers]]
name = "Keycloak"
slug = "keycloak"
logo = "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/keycloak.svg"
issuer_url = "https://keycloak.yourdomain.com/realms/your-realm"
client_id = "scanopy"
client_secret = "your-client-secret"
```

### PocketID

1. **Create OIDC Client** in PocketID:
   - Go to OIDC Clients → Add Client
   - Name: `Scanopy`
   - Callback URLs: `http://your-scanopy:60072/api/auth/oidc/pocketid/callback`

2. **Copy Credentials**:
   - Client ID
   - Client Secret

3. **Configure oidc.toml**:

```toml
[[oidc_providers]]
name = "PocketID"
slug = "pocketid"
logo = "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/pocketid.svg"
issuer_url = "https://pocketid.yourdomain.com"
client_id = "your-client-id"
client_secret = "your-client-secret"
```

### Auth0

1. **Create Application** in Auth0 Dashboard → Applications → Create:
   - Type: `Regular Web Application`
   - Name: `Scanopy`

2. **Configure Application Settings**:
   - Allowed Callback URLs: `http://your-scanopy:60072/api/auth/oidc/auth0/callback`
   - Allowed Web Origins: `http://your-scanopy:60072`

3. **Configure oidc.toml**:

```toml
[[oidc_providers]]
name = "Auth0"
slug = "auth0"
logo = "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/auth0.svg"
issuer_url = "https://your-tenant.auth0.com"
client_id = "your-client-id"
client_secret = "your-client-secret"
```

### Okta

1. **Create App Integration** in Okta Admin → Applications → Create:
   - Sign-in method: `OIDC - OpenID Connect`
   - Application type: `Web Application`

2. **Configure Settings**:
   - Sign-in redirect URIs: `http://your-scanopy:60072/api/auth/oidc/okta/callback`
   - Sign-out redirect URIs: `http://your-scanopy:60072`

3. **Configure oidc.toml**:

```toml
[[oidc_providers]]
name = "Okta"
slug = "okta"
logo = "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/okta.svg"
issuer_url = "https://your-org.okta.com"
client_id = "your-client-id"
client_secret = "your-client-secret"
```

### Authelia

```yaml
identity_providers:
  oidc:
    clients:
      - client_id: 'scanopy'
        client_name: 'Scanopy'
        client_secret: { { secret "/run/secrets/authelia_scanopy_oidc" | msquote } }
        public: false
        authorization_policy: 'two_factor'
        require_pkce: false
        pkce_challenge_method: ''
        redirect_uris:
          - 'https://scanopy.YOURDOMAIN/api/auth/oidc/authelia/callback'
        scopes:
          - 'openid'
          - 'email'
          - 'profile'
        response_types:
          - 'code'
        grant_types:
          - 'authorization_code'
        access_token_signed_response_alg: 'none'
        userinfo_signed_response_alg: 'none'
        token_endpoint_auth_method: 'client_secret_basic'
        consent_mode: 'auto'
        pre_configured_consent_duration: '1M'
```

```toml
[[oidc_providers]]
name = "Authelia"
slug = "authelia"
logo = "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/authelia.svg"
issuer_url = "https://auth.YOURDOMAIN"
client_id = "scanopy"
client_secret = "YOURSUPERSECRET"
```

## Linking OIDC to Existing Accounts

If OIDC is enabled, users can link it to their existing email/password account:

1. Log in with your existing email and password
2. Go to **Account Settings** (click the user icon in top right)
3. Click **Link** under your OIDC provider
4. Complete the authentication flow with your provider
5. Your account is now linked — you can log in with either method

**Unlinking**: You can unlink OIDC at any time from Account Settings, but you'll need to have a password set first.

## Common Issues

### "Unexpected issuer URI" error

```
Failed to generate auth URL: Validation error: unexpected issuer URI
`https://auth.example.com/app/` (expected `https://auth.example.com/app`)
```

**Cause**: Trailing slash mismatch between your config and what the provider returns.

**Solution**: Try both with and without trailing slash in `issuer_url`. The value must exactly match what your provider returns in its `.well-known/openid-configuration`.

To check what your provider expects:

```bash
curl https://your-provider/.well-known/openid-configuration | jq .issuer
```

### "Invalid redirect URI" error

**Cause**: The callback URL in your provider doesn't match what Scanopy sends.

**Solution**: Ensure the redirect URI in your provider exactly matches:

```
http://your-scanopy:60072/api/auth/oidc/{slug}/callback
```

Common mistakes:

- Wrong protocol (http vs https)
- Wrong port
- Wrong slug (must match oidc.toml)
- Missing `/callback` at the end

### OIDC button not appearing in UI

**Causes**:

1. oidc.toml file not mounted in Docker
2. oidc.toml has syntax errors
3. Server not restarted after adding config

**Solution**:

1. Verify the volume mount exists in docker-compose.yml
2. Validate TOML syntax (use a TOML validator)
3. Restart with `docker compose restart scanopy-server`
4. Check server logs: `docker logs scanopy-server`

### "Connection refused" when authenticating

**Cause**: Scanopy server can't reach your OIDC provider.

**Solutions**:

1. Ensure the provider URL is reachable from the server container
2. If provider is internal, ensure Docker can resolve the hostname
3. Add provider to Docker's extra_hosts if needed:
   ```yaml
   extra_hosts:
     - 'auth.internal:192.168.1.100'
   ```
