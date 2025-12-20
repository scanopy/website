---
title: Limitations
description: What Scanopy can and cannot do.
---

Scanopy is designed for discovering and visualizing local network infrastructure. This page documents known limitations and boundaries.

## Network Scanning

### IPv6

Scanopy currently supports IPv4 only.

**Planned**:
- Collecting and displaying IPv6 addresses during discovery
- Manual entry of IPv6 addresses when editing hosts

**Not planned**:
- Full IPv6 subnet scanning (a /64 contains 18 quintillion addresses)

### Large Subnets

Trying to scan a /8? That's 16 million IPs. Scanopy automatically skips subnets larger than /10 to prevent accidental mega-scans. Still, a /10 will probably take a couple of days to fully scan.

If you need to scan a large network, break it into smaller subnets and scan them individually.

### Layer 2 vs Layer 3

For subnets the daemon is directly connected to:
- MAC addresses are collected via ARP
- All responsive hosts are discovered

For remote subnets (routed through a gateway):
- No MAC addresses (ARP doesn't cross routers)
- Only hosts with open ports are discovered
- Some hosts may not respond to remote probes

For best results, deploy a daemon on each network segment. See [Multi-VLAN Deployment](/docs/daemons/multi-vlan/).

## Service Detection

### Pattern-Based Detection

Scanopy detects services by matching against known patterns (ports, HTTP endpoints, headers). This means:

- Services on non-standard ports may not be detected
- Services must respond to HTTP probes to match endpoint patterns
- Custom or obscure services won't be detected automatically

See [Service Detection](/docs/reference/service-detection/) for how detection works and how to improve it.

### What Can't Be Detected

- Services that don't listen on network ports
- Services behind authentication that block probing
- Internal application components (microservices behind a gateway)
- Cloud/SaaS services (Scanopy scans your network, not the internet)

## Platform-Specific

### Docker on macOS/Windows

Docker Desktop on macOS and Windows doesn't support host networking — the container can't see your actual network. Use the standalone binary instead.

### Windows ARP Discovery

Windows requires [Npcap](https://npcap.com/#download) for ARP-based host discovery. Without it, the daemon falls back to port scanning only (slower, less reliable for hosts without open ports).

## Requesting Features

If a limitation affects your use case:
- [Open an issue](https://github.com/scanopy/scanopy/issues/new) describing your scenario
- Join the [Discord community](https://discord.gg/b7ffQr8AcZ) to discuss
