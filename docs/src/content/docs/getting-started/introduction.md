---
title: Introduction
description: What is Scanopy and how to get started.
---

Scanopy is a network discovery and visualization tool that automatically discovers hosts, services, and network topology across your infrastructure.

## Key Features

- **Network Discovery** — Automatically find hosts and services on your network
- **Service Detection** — Identify 200+ services including databases, web servers, and home automation
- **Topology Visualization** — Interactive network maps with filtering and grouping
- **Distributed Scanning** — Deploy daemons across multiple networks
- **Docker Integration** — Discover containers via Docker socket

## Cloud vs Self-Hosted

Scanopy is available in two deployment models:

### Scanopy Cloud

- **Managed service** — We handle the server infrastructure
- **Quick setup** — Create an account and deploy daemons immediately
- **Automatic updates** — Always on the latest version

With Scanopy Cloud, you only need to deploy daemons to your networks. The server, database, and UI are managed for you.

### Self-Hosted

- **Full control** — Run everything on your own infrastructure
- **Data sovereignty** — All data stays on your servers
- **Customization** — Configure server settings, OIDC, and more

Self-hosted users need to install the Scanopy server before deploying daemons. See the [Self-Hosted](/docs/self-hosted/server-installation/) section for setup instructions.

## How Scanopy Works

```
┌─────────────────────────────────────────────────────────────┐
│                    Scanopy Server                           │
│              (Cloud or Self-Hosted)                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│   Network 1   │ │   Network 2   │ │   Network 3   │
│  [Daemon]     │ │  [Daemon]     │ │  [Daemon]     │
└───────────────┘ └───────────────┘ └───────────────┘
```

1. **Daemons** run on your networks and perform discovery scans
2. **Server** stores data and serves the web UI
3. **UI** provides visualization, management, and configuration

## Next Steps

- **Cloud users**: Continue to [Quick Start](/docs/getting-started/quick-start/)
- **Self-hosted users**: Start with [Server Installation](/docs/self-hosted/server-installation/), then return to Quick Start
