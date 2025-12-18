---
title: Topology
description: Interactive network visualization.
---

The topology view generates an interactive diagram of your network structure, showing hosts, services, subnets, and their relationships.

## Topology States

The topology indicator shows whether your visualization is current with the underlying data.

### Up to Date

All data is current. No action needed.

### Stale

New entities have been added or updated since the last rebuild. Click **Rebuild** to add them to the visualization.

### Conflict

Entities on the graph have been deleted from the database. Click **Rebuild** to see what will be removed — you'll get a confirmation before changes are applied.

### Locked

The topology is locked and won't show state changes. Use this when you want to preserve a specific layout. Click **Lock/Unlock** to toggle.

### Auto Rebuild

When enabled, the topology rebuilds automatically after changes. Useful for hands-off operation, but may reset manual positioning.

**Note**: Rebuilding resets node positions and subnet sizes. Edge handle positions are preserved when possible.

## Visual Elements

| Element | Represents |
|---------|------------|
| **Subnet containers** | Network segments (show CIDR and name) |
| **Interface nodes** | Host network interfaces with IP addresses |
| **Service icons** | Detected services with port numbers |
| **Edges** | Relationships (interfaces, gateways, groups, containers) |
| **Left zone** | Optional section for infrastructure services within subnets |

## Customization

Access options via the panel on the right side of the topology view. Key options include:

**Visual**
- Toggle edge fading, resize handles, port numbers

**Docker**
- Group all Docker bridges into one subnet per host
- Hide virtualization provider indicators

**Left Zone**
- Customize title (default: "Infrastructure")
- Choose which service categories appear there
- Show/hide gateway services

**Filtering**
- Hide entire service categories
- Hide specific edge types (interface, gateway, group, container)

## Manual Adjustments

- **Drag nodes** to reposition
- **Drag subnet corners** to resize
- **Click edges** to show handles, then drag handles to reroute

## Exporting

Click **Export** to download a PNG image of your current topology. Includes all customizations and positioning.

Use for documentation, presentations, or sharing with team members.
