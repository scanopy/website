---
title: Discovery
description: How Scanopy discovers hosts and services on your network.
---

Discovery is the process of scanning your network to find hosts and services. Daemons perform discovery and report findings to the server.

## Discovery Types

### Network Scan

Scans IP addresses on configured subnets to find hosts and services.

- Detects open TCP and UDP ports
- Identifies services via [pattern matching](/docs/reference/service-detection/)
- Performs reverse DNS lookups
- Collects MAC addresses (for directly connected subnets only)

**Subnet selection**: You can scan subnets the daemon isn't directly connected to, but with [limitations](/docs/reference/limitations/#layer-2-vs-layer-3). For best results, deploy a daemon on each network segment (see [Multi-VLAN Deployment](/docs/daemons/multi-vlan/)).

### Docker

Discovers containers via the Docker socket on the daemon's host.

- Lists running containers with names and metadata
- Maps container networks and port bindings
- Identifies containerized services
- Creates Docker bridge subnets automatically

Requires Docker socket access — see [Docker Socket Proxy](/docs/daemons/docker-proxy/) for secure configuration.

### Self-Report

Daemon reports its own capabilities to the server.

- Identifies which subnets the daemon can reach
- Reports Docker socket availability
- Runs automatically on daemon startup

## Run Types

| Type | Behavior |
|------|----------|
| **Scheduled** | Runs automatically on a cron schedule (default: daily) |
| **AdHoc** | Manual execution only, for testing or one-time scans |

## Discovery Duration

**Benchmark**: A /24 subnet (256 IPs) takes **5-10 minutes** to scan.

Factors affecting speed:
- Subnet size (a /16 is 65,536 IPs — avoid scanning these via Network Scan)
- Concurrent scans setting (default: 15, configurable per daemon)
- Network latency and host responsiveness

**Watch out**: Accidentally added 172.17.0.0/16 to your network scan? That's 65,536 IPs. Docker bridge networks should use Docker discovery instead — it queries the Docker API directly and takes seconds.

## Host Naming

When a host is discovered, Scanopy determines its name using this priority:

1. **Reverse DNS** — hostname from PTR record, if available
2. **Best Service** or **IP** — configurable fallback per discovery:
   - *Best Service*: Uses the first named service found on the host
   - *IP*: Uses the host's IP address
3. **Remaining fallback** — whichever option wasn't selected in step 2

Configure naming strategy in the discovery type settings.

Manage discoveries via **Discover > Scheduled** and monitor progress via **Discover > Sessions**.
