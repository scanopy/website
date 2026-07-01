---
title: How to Visualize Docker Containers on Your Network
description: "See Docker containers in network context, not just per host. How Scanopy discovers your containers and maps them under the host they run on, alongside the rest of your network."
keyword: docker network visualization
slug: visualize-docker-containers-network
date: 2026-07-01
dateModified: 2026-07-01
tldr: "Docker tools show you containers one host at a time. They don't show where those containers sit on your network or what they connect to. Scanopy discovers Docker containers and nests them under the host they run on, in the same topology map as the rest of your network."
ctaHeading: See your containers in context
ctaDescription: "Scanopy discovers Docker containers and nests them under their host in a live topology map, next to everything else on your network. Deploy a daemon and see it."
---

Docker makes it easy to lose track of where things actually run. `docker ps` tells you what is running on the host you happen to be SSHed into. Portainer gives you a clean dashboard, one environment at a time. Neither one answers the question I keep hitting in my own homelab: which host is this container on, what subnet can reach it, and what does it talk to.

That last question is a network question, and container tools are not built to answer it. This is about seeing your containers as part of your network, not as a list sitting on top of it.

## Container tools think per host. Your network doesn't.

A container is an IP and a set of ports, like anything else on your network. But the tooling around Docker is organized by host: you look at one machine's containers, then another machine's containers, and you stitch the picture together in your head. The moment you are debugging "why can't service A reach service B," that per-host view is the wrong altitude. You want to see the container sitting on its network, under the host it runs on, next to the database it depends on and the switch the whole thing hangs off.

That is the gap. Not "what containers exist" (Docker already tells you that), but "where do they live on my network, and what is around them."

## What Scanopy pulls from Docker

When the Scanopy daemon has access to the Docker API (via socket or TLS proxy), it reads each host's containers as part of its normal scan and collects:

- the **image** each container runs
- its **published ports**
- the **Docker networks** it is attached to
- its **labels**

This happens in the same pass that discovers the rest of your network over SNMP, LLDP, CDP, and ARP (here is [how that automated discovery works](/blog/automated-network-documentation)). So your containers are not a separate inventory you have to reconcile. They land in the same topology as your switches, VMs, and bare-metal hosts.

## The Workloads view

Scanopy produces four views from a single scan. The one built for this is the **Workloads view**, which shows the full nesting chain: bare metal, to hypervisor, to VM, to container.

So a Postgres container shows up nested under the Docker host it runs on, which might itself be a VM on a Proxmox node, which is a physical box plugged into a switch port. You see the whole stack in one place. No more holding the layers in your head, no more guessing which physical machine a container actually lives on.

<figure class="my-8">
  <img
    class="block dark:hidden w-full rounded-lg border border-gray-200"
    src="/wl-light-960w.webp"
    srcset="/wl-light-960w.webp 960w, /wl-light-1440w.webp 1440w, /wl-light-2400w.webp 2400w"
    sizes="(min-width: 1024px) 720px, 100vw"
    loading="lazy"
    alt="Scanopy Workloads view: Docker containers nested under the host they run on, with the host shown as a VM on a hypervisor and the hypervisor on a physical machine, laying out the full bare-metal-to-container stack."
  />
  <img
    class="hidden dark:block w-full rounded-lg border border-gray-800"
    src="/wl-960w.webp"
    srcset="/wl-960w.webp 960w, /wl-1440w.webp 1440w, /wl-2400w.webp 2400w"
    sizes="(min-width: 1024px) 720px, 100vw"
    loading="lazy"
    alt="Scanopy Workloads view: Docker containers nested under the host they run on, with the host shown as a VM on a hypervisor and the hypervisor on a physical machine, laying out the full bare-metal-to-container stack."
  />
</figure>

Containers are not stuck in that one view, either. They also show up in the **L3 (logical) view**, where a Docker stack is drawn alongside the subnet it sits on, so you can see the stack in the context of the network it actually talks on, not just the host it runs on.

<figure class="my-8">
  <img
    class="block dark:hidden w-full rounded-lg border border-gray-200"
    src="/l3-light-960w.webp"
    srcset="/l3-light-960w.webp 960w, /l3-light-1440w.webp 1440w, /l3-light-2400w.webp 2400w"
    sizes="(min-width: 1024px) 720px, 100vw"
    loading="lazy"
    alt="Scanopy L3 logical view: a Docker stack drawn alongside the subnet it sits on, showing the containers in the context of the network they talk on rather than just the host they run on."
  />
  <img
    class="hidden dark:block w-full rounded-lg border border-gray-800"
    src="/l3-960w.webp"
    srcset="/l3-960w.webp 960w, /l3-1440w.webp 1440w, /l3-2400w.webp 2400w"
    sizes="(min-width: 1024px) 720px, 100vw"
    loading="lazy"
    alt="Scanopy L3 logical view: a Docker stack drawn alongside the subnet it sits on, showing the containers in the context of the network they talk on rather than just the host they run on."
  />
</figure>

Because the map redraws on every scan, a container that moves to a different host, or one that appears or disappears, is reflected automatically. The view stays current without anyone updating a diagram.

## Setting it up

By default, the Scanopy daemon discovers containers by connecting to the local Docker socket (`/var/run/docker.sock`) on its own host. During daemon setup you pick **Local Socket** in the Docker mode selector, or flip **Scan local Docker socket** in the discovery settings, and container detection runs as part of the normal scan. One daemon covers the whole network.

If you want to lock down what the daemon can touch, or discover containers on a host the daemon does not run on, point it at a [Docker socket proxy](/docs/guides/docker-proxy) instead (Scanopy is tested with Tecnativa's and wollomatic's). You run the proxy with read-only access to the socket, restrict it to the handful of API calls Scanopy needs (list and inspect containers, list networks), and create a Docker Proxy credential in Scanopy pointing at it. The same setup works for remote Docker hosts: run the proxy there, and the daemon discovers those containers over the network.

Either way, detection picks up containers wherever they run, so a mixed homelab of Docker on one host and VMs or LXC on others shows up as one coherent map rather than several disconnected ones.

## What this is not

Scanopy is not a container manager. It will not start, stop, or deploy anything, and it is not trying to replace Portainer, Komodo, or your orchestrator. Those tools manage containers. Scanopy shows you where your containers sit on the network and what they connect to. They work well side by side: manage in your container tool, see the topology in Scanopy. It is a documentation tool, and it stays in that lane on purpose.

If you are mapping the rest of your gear too, the same scan that finds your containers also walks your switches and routers over SNMP. Here is the deeper version of that: [exploring your network topology with SNMP](/guides/snmp-network-topology-mapping). And Scanopy fingerprints [the services running on each host](/services), so a host is not just an IP, it is "the box running Postgres, Nginx, and twelve containers."
