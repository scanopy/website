---
title: Hosts, Subnets & Groups
description: Managing discovered hosts, network segments, and logical groupings.
---

## Hosts

Hosts represent devices on your network. They are automatically discovered during network scans.

### Consolidating Duplicate Hosts

When a device appears on multiple VLANs or through different discovery methods, it may be discovered as separate hosts. Use consolidation to merge them:

1. Open the host you want to keep (primary)
2. Click **Consolidate**
3. Select the duplicate host(s) to merge
4. Confirm

The primary host gains all interfaces, services, and properties from the merged hosts. Use this to unify a server that has interfaces on multiple VLANs into a single logical host.

### Unclaimed Open Ports

Ports discovered without a matching service definition are assigned to an "Unclaimed Open Ports" placeholder. To reassign them:

1. Open the host and go to the **Services** tab
2. Select ports from "Unclaimed Open Ports"
3. Click **Transfer Ports** on the service you want to assign them to

Useful when Scanopy detects an open port but can't identify the service running on it.

### Virtualization Relationships

Scanopy tracks which VMs and containers run on which hosts:

- **Proxmox**: Links VMs and LXC containers to their Proxmox host
- **Docker**: Links containers to their Docker host

These relationships appear in the topology and host details, showing your virtualization hierarchy.

### Service Detection

Scanopy automatically detects 200+ services. See [Service Detection](/docs/reference/service-detection/) for how detection works, confidence levels, and what to do when a service isn't found.

## Subnets

Subnets represent network segments. Scanopy automatically detects subnets during discovery, but you can also create them manually. Assign a type (LAN, WiFi, DMZ, etc.) to label your subnets for filtering and organization.

### Organizational Subnets

Two special subnet types use CIDR `0.0.0.0/0` and serve as organizational containers rather than real network segments:

**Internet** — For public/external services:
- Public DNS servers (1.1.1.1, 8.8.8.8)
- Cloud services your network connects to
- External APIs

**Remote** — For hosts not on your local network:
- Mobile devices connecting via VPN
- Remote office machines
- Friend's servers you want to track

## Groups

Groups create logical connections between services for topology visualization. They don't affect how Scanopy discovers or scans — they're purely for showing relationships that network topology alone doesn't capture.

```
Hub and Spoke                      Path

     ┌─────────┐
     │ Web App │
     └────┬────┘
          │
┌───────┐ │ ┌────────┐
│Workers├─┼─┤Database│       User → Proxy → App → Database
└───────┘ │ └────────┘
          │
     ┌────┴────┐
     │  Admin  │
     └─────────┘
```

Use **Hub and Spoke** when multiple services connect to a central one (database clients, API consumers). Use **Path** for linear flows (request routing, data pipelines, backup chains).

Manage groups via **Manage > Groups**.
