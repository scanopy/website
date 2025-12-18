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

Subnets represent network segments. Scanopy automatically detects subnets during discovery, but you can also create them manually.

### Subnet Types

Scanopy categorizes subnets by their purpose:

| Type | Description |
|------|-------------|
| **LAN** | Standard local area network |
| **WiFi** | Wireless networks |
| **IoT** | IoT device networks |
| **Guest** | Guest/visitor networks |
| **Gateway** | Gateway interfaces |
| **VPN Tunnel** | VPN connections |
| **DMZ** | Demilitarized zones |
| **Management** | Management/IPMI networks |
| **Docker Bridge** | Docker container networks |

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

Groups create logical connections between services for topology visualization. They don't affect how Scanopy discovers or scans — they're purely organizational.

### Group Types

**Hub and Spoke**
- Central service connected to multiple others
- Use for: databases with multiple clients, API gateways, shared infrastructure

```
         ┌─────────┐
         │ Web App │
         └────┬────┘
              │
┌─────────┐   │   ┌─────────┐
│ Workers ├───┼───┤Database │ (Hub)
└─────────┘   │   └─────────┘
              │
         ┌────┴────┐
         │  Admin  │
         └─────────┘
```

**Path**
- Linear flow through services
- Use for: request flows, data pipelines, network paths

```
User → Cloudflare → Traefik → App → Database
```

### Use Cases

**Document a web application stack:**
```
Type: Hub and Spoke
Hub: PostgreSQL database
Spokes: Web server, background workers, admin panel
```

**Show reverse proxy routing:**
```
Type: Path
Path: Internet → Cloudflare → Traefik → Application
```

**Visualize backup flow:**
```
Type: Path
Path: Production DB → Backup Agent → NAS → Offsite
```

Manage hosts via **Manage > Hosts**, subnets via **Manage > Subnets**, and groups via **Manage > Groups**.
