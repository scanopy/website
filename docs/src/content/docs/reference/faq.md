---
title: FAQ
description: Frequently asked questions about Scanopy.
---

## General

### Is IPv6 supported?

Not currently. See [Limitations](/docs/reference/limitations/) for details on what's planned.

### What's the difference between Cloud and Self-Hosted?

**Scanopy Cloud**:
- Managed server infrastructure
- Quick setup — just deploy daemons
- Automatic updates
- Subscription pricing

**Self-Hosted**:
- Run everything on your infrastructure
- Full data control
- One-time purchase or free (Community Edition)
- You manage updates and backups

Both versions use the same daemon software and have the same features for network discovery.

### How do I contribute?

We welcome contributions! See [contributing.md](https://github.com/scanopy/scanopy/blob/main/CONTRIBUTING.md) for:
- Adding service definitions (great first contribution!)
- Reporting bugs
- Requesting features
- Submitting pull requests

Join our [Discord community](https://discord.gg/b7ffQr8AcZ) for help and discussions.

## Discovery

### How long does discovery take?

See [Discovery Duration](/docs/using-scanopy/discovery/#discovery-duration) for benchmarks and factors affecting scan speed.

### Why is my topology empty after discovery?

1. **Did discovery run at all?** Check **Discover > Sessions** for errors
2. **Wrong network selected**: Check topology options panel for network filter
3. **All services hidden**: Check if service category filters are too aggressive
4. **No hosts found**: Verify daemon can reach the network

### Can I scan networks the daemon isn't directly connected to?

Yes, but you'll miss some data. See [Layer 2 vs Layer 3](/docs/reference/limitations/#layer-2-vs-layer-3) for details on what's available for remote subnets.

For best results, deploy a daemon on each network segment. See [Multi-VLAN Deployment](/docs/daemons/multi-vlan/).

## Networking

### What ports does Scanopy use?

| Component | Port | Purpose |
|-----------|------|---------|
| Server | 60072 | Web UI and API |
| Daemon | 60073 | Push mode communication |

### Does the daemon need inbound firewall rules?

**Pull mode** (recommended): No. The daemon only makes outbound connections to the server.

**Push mode**: Yes. The server needs to reach the daemon on port 60073.

## Getting Help

- **Discord**: [discord.gg/b7ffQr8AcZ](https://discord.gg/b7ffQr8AcZ)
- **GitHub Issues**: [github.com/scanopy/scanopy/issues](https://github.com/scanopy/scanopy/issues)
