---
title: Daemon Configuration
description: Configuration options for Scanopy daemons.
---

## Configuration Priority

Scanopy daemons use the following priority order (highest to lowest):

1. **Command-line arguments** (highest priority)
2. **Environment variables**
3. **Configuration file**
4. **Default values** (lowest priority)

Later sources override earlier ones. For example, an environment variable overrides the config file but is overridden by a command-line argument.

## Configuration Methods

**Command-line arguments**:

```bash
scanopy-daemon --server-url http://192.168.1.100:60072 --api-key YOUR_KEY
```

**Environment variables**:

```bash
export SCANOPY_SERVER_URL=http://192.168.1.100:60072
export SCANOPY_DAEMON_API_KEY=YOUR_KEY
scanopy-daemon
```

**Docker environment**:

```yaml
environment:
  - SCANOPY_SERVER_URL=http://192.168.1.100:60072
  - SCANOPY_DAEMON_API_KEY=YOUR_KEY
```

**Configuration file**:

The daemon automatically creates a config file at:

- **Linux**: `~/.config/scanopy/daemon/config.json`
- **macOS**: `~/Library/Application Support/com.scanopy.daemon/config.json`
- **Windows**: `%APPDATA%\scanopy\daemon\config.json`

The config file stores runtime state (daemon ID, host ID) alongside your settings. Command-line and environment variables take priority over the file.

## Parameter Reference

| Parameter | CLI Flag | Environment Variable | Config File Key | Default | Description |
|-----------|----------|---------------------|-----------------|---------|-------------|
| **Server URL** | `--server-url` | `SCANOPY_SERVER_URL` | `server_url` | `http://127.0.0.1:60072` | URL where the daemon can reach the server |
| **API Key** | `--daemon-api-key` | `SCANOPY_DAEMON_API_KEY` | `api_key` | *Required* | Authentication key for daemon (generated via UI) |
| **Mode** | `--mode` | `SCANOPY_MODE` | `mode` | Push | Pull: daemon polls server. Push: server initiates scans (daemon must be reachable) |
| **Network ID** | `--network-id` | `SCANOPY_NETWORK_ID` | `network_id` | *Auto-assigned* | UUID of the network to scan |
| **Daemon URL** | `--daemon-url` | `SCANOPY_DAEMON_URL` | `daemon_url` | detected IP + port | Public URL where server can reach daemon (Push mode only) |
| **Daemon Port** | `--daemon-port` or `-p` | `SCANOPY_DAEMON_PORT` | `port` | `60073` | Port for daemon to listen on |
| **Bind Address** | `--bind-address` | `SCANOPY_BIND_ADDRESS` | `bind_address` | `0.0.0.0` | IP address to bind daemon to |
| **Daemon Name** | `--name` | `SCANOPY_NAME` | `name` | `scanopy-daemon` | Name for this daemon |
| **Log Level** | `--log-level` | `SCANOPY_LOG_LEVEL` | `log_level` | `info` | Logging verbosity |
| **Heartbeat Interval** | `--heartbeat-interval` | `SCANOPY_HEARTBEAT_INTERVAL` | `heartbeat_interval` | `30` | Seconds between heartbeats/work requests |
| **Concurrent Scans** | `--concurrent-scans` | `SCANOPY_CONCURRENT_SCANS` | `concurrent_scans` | *Auto* | Maximum parallel host scans |
| **Allow Self-Signed Certs** | `--allow-self-signed-certs` | `SCANOPY_ALLOW_SELF_SIGNED_CERTS` | `allow_self_signed_certs` | *None* | Allow self-signed certs for daemon → server connections |
| **Docker Proxy** | `--docker-proxy` | `SCANOPY_DOCKER_PROXY` | `docker_proxy` | *None* | Optional proxy for Docker API |
| **Docker SSL Cert** | `--docker-proxy-ssl-cert` | `SCANOPY_DOCKER_PROXY_SSL_CERT` | `docker_proxy_ssl_cert` | *None* | Path to SSL certificate for Docker proxy |
| **Docker SSL Key** | `--docker-proxy-ssl-key` | `SCANOPY_DOCKER_PROXY_SSL_KEY` | `docker_proxy_ssl_key` | *None* | Path to SSL private key for Docker proxy |
| **Docker SSL Chain** | `--docker-proxy-ssl-chain` | `SCANOPY_DOCKER_PROXY_SSL_CHAIN` | `docker_proxy_ssl_chain` | *None* | Path to SSL chain for Docker proxy |

## Concurrent Scans

Controls how many hosts the daemon scans simultaneously during network discovery.

**Default behavior**: Auto-detected based on system resources

- Calculates based on available memory
- Typical range: 10-20 for most systems
- Adjusts to prevent memory exhaustion

**When to set manually**:

- System crashes during scans
- Memory errors in logs
- Very large networks (100+ hosts)
- Resource-constrained devices (Raspberry Pi)

**Recommended values**:

- **Raspberry Pi 4 (4GB)**: 5-10
- **Standard desktop**: 15-20
- **Server**: 20-30+
- **Low memory**: Start with 5, increase gradually

**Setting**:

```bash
# CLI
scanopy-daemon --concurrent-scans 10

# Environment
export SCANOPY_CONCURRENT_SCANS=10

# Docker
environment:
  - SCANOPY_CONCURRENT_SCANS=10
```

**Symptoms of too high**:

- Daemon crashes during scans
- "CONCURRENT_SCANS too high for this system" error
- Out of memory errors
- System becomes unresponsive

**Impact**:

- Lower value = slower scans, more stable
- Higher value = faster scans, more memory usage
