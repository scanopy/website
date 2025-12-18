---
title: Organization & Access
description: Understanding Scanopy's organizational structure, access control, and tagging.
---

## Organizations

Organizations are the top-level container in Scanopy. Every user belongs to exactly one organization, and all networks, hosts, and services exist within that organization.

Organizations are automatically created during registration and cannot be manually created or transferred.

### Roles

| Role | Can Do |
|------|--------|
| **Owner** | Everything, including organization settings and inviting Admins |
| **Admin** | Everything Members can do, plus invite/remove Members, manage tags |
| **Member** | Create/edit networks, hosts, services; run discoveries; manage daemons; invite Visualizers |
| **Visualizer** | View topology diagrams only |

Invite users via **Manage > Users** — generate an invite link and share it.

## Networks

Networks are the primary organizational unit. Each network represents a distinct environment with its own hosts, services, and topology.

**Common patterns:**
- Separate networks for production vs. development
- One network per physical location
- Distinct networks for different security zones

## API Keys

Each daemon requires its own API key. Create keys via **Manage > API Keys** or during daemon setup. Use one key per daemon — don't share keys between daemons.

## Tags

Tags provide organization-wide labels for categorizing and filtering entities. Apply tags to hosts, services, subnets, networks, groups, and daemons.

### What Tags Are For

- **Environment classification**: production, staging, development
- **Criticality levels**: critical, high, medium, low
- **Ownership tracking**: team-a, team-b, contractor
- **Lifecycle status**: deprecated, migrating, new
- **Compliance**: pci-scope, hipaa, gdpr, internal-only

### Tag Scope

Tags are defined at the **organization level**:
- The same tag can be applied across all networks
- Tag definitions are shared by all users
- Deleting a tag removes it from all entities

### Example Tag Schemes

**By environment and criticality:**
```
production + critical    → Core infrastructure
production + standard    → Supporting services
staging + low-priority   → Test environments
```

**By team ownership:**
```
platform-team     → Infrastructure, databases, networking
frontend-team     → Web servers, CDN, static assets
data-team         → Analytics, ETL, data warehouses
```

**For compliance audits:**
```
pci-scope         → Systems handling payment data
hipaa             → Healthcare data systems
gdpr              → EU user data processing
internal-only     → No external exposure allowed
```

Manage tags via **Manage > Tags**. You can also create tags inline while editing any entity.
