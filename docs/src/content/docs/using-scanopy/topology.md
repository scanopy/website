---
title: Topology
description: Interactive network visualization.
---

The topology view generates an interactive diagram of your network structure, showing hosts, services, subnets, and their relationships.

## Topology States

The topology indicator shows whether your visualization is current with the underlying data.

| State | Meaning |
|-------|---------|
| **Up to Date** | All data is current. No action needed. |
| **Stale** | New entities added since last rebuild. Click **Rebuild** to include them. |
| **Conflict** | Entities have been deleted. Click **Rebuild** to review removals before applying. |
| **Locked** | Layout is frozen. Toggle with **Lock/Unlock** to preserve positioning. |
| **Auto Rebuild** | Rebuilds automatically after changes. Convenient, but resets manual positioning. |

**Note**: Rebuilding resets node positions and subnet sizes. Edge handle positions are preserved when possible.

## Refining Your Topology

After initial discovery, these refinements make your diagram more accurate.

### Link Virtualization

If you have Proxmox hosts, open each one and use the **Virtualization** tab to specify which hosts are VMs or containers running on it. They'll be highlighted and clustered together in the topology.

See [Virtualization Relationships](/docs/using-scanopy/network-data/#virtualization-relationships).

### Create Groups

Use groups to show request paths, dependencies, and data flows between services that network topology alone doesn't capture.

See [Groups](/docs/using-scanopy/network-data/#groups).

### Manage External Dependencies

The default **Internet** and **Remote Network** subnets at the top of your topology are for tracking external services. Add your external dependencies there, or delete these subnets via **Manage > Subnets** if you don't need them.

See [Organizational Subnets](/docs/using-scanopy/network-data/#organizational-subnets).

### Assign Unclaimed Ports

Open hosts and go to **Services > Unclaimed Open Ports** to assign detected ports to the services that are actually listening on them.

See [Unclaimed Open Ports](/docs/using-scanopy/network-data/#unclaimed-open-ports).

### Consolidate Multi-NIC Hosts

Hosts detected across multiple VLANs can be merged into a single logical host.

See [Consolidating Duplicate Hosts](/docs/using-scanopy/network-data/#consolidating-duplicate-hosts).

### Clean Up the Diagram

Two options in the panel on the right are particularly useful for reducing clutter:

- **Hide Stuff > Categories > Open Port** — Hides unclaimed ports
- **Docker > Group Docker Bridges** — Collapses Docker bridge networks into one subnet per host

## Adjusting the Layout

- **Drag nodes** to reposition hosts and services
- **Drag subnet corners** to resize containers
- **Click edges** to show handles, then drag to reroute connections

Use **Lock** to preserve your layout after arranging things.

## Exporting

Click **Export** to download a PNG of your topology with all customizations and positioning intact.
