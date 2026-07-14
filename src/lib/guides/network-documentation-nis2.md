---
title: Network Documentation for NIS2 Compliance
description: "What NIS2 Article 21 expects around network documentation: the risk analysis and asset management measures that assume a current network map, and how automated discovery produces it."
keyword: network documentation for NIS2
slug: network-documentation-nis2
date: 2026-07-08
dateModified: 2026-07-14
tldr: "NIS2 Article 21 never names a network diagram. But three of its ten required risk-management measures (risk analysis, asset management, and business continuity) assume you have a current, accurate map of your network and assets. Automated network documentation produces that map and keeps it current on its own."
ctaHeading: Documentation that keeps pace with NIS2
ctaDescription: "Scanopy discovers your hosts, services, topology, and application dependencies and keeps the map current on a schedule. Self-hosted, so your network data stays on your own infrastructure."
faq:
  - question: Does NIS2 require a network diagram?
    answer: Not by name. NIS2 Article 21 is outcomes-based and technology-neutral, so it lists what to achieve, not specific artifacts like a diagram. But three of its ten required measures (risk analysis, asset management, and business continuity) can't be done properly without a current, accurate picture of your network and assets. A network map is one way to meet that expectation.
  - question: What does NIS2 Article 21 actually require?
    answer: Article 21(2) sets out ten minimum cybersecurity risk-management measures for essential and important entities, including risk analysis and security policies, incident handling, business continuity and backup, supply chain security, secure network maintenance, cyber hygiene, cryptography, and human resources security, access control, and asset management. The measures must be proportionate to the entity's size and risk exposure.
  - question: How does network documentation support NIS2 asset management?
    answer: Asset management under Article 21(2)(i) starts with knowing what assets you have. You can't manage or secure devices you don't know exist. Automated discovery builds an inventory of hosts, services, and network devices directly from the network and keeps it current, which is the foundation the asset-management measure is built on. It answers the "what do we have and how does it connect" question that everything else depends on.
  - question: Does NIS2 apply to municipalities and public administration?
    answer: Often, yes. NIS2 covers essential and important entities across sectors including drinking water, wastewater, energy, and digital infrastructure, and it brings much of public administration into scope. A municipality that runs water, energy, or other essential services is typically an essential or important entity. National transposition determines the exact scope, so entities should confirm their status under their country's implementing law.
  - question: Does network documentation software make me NIS2 compliant?
    answer: No. NIS2 compliance is an organizational program, not a product you install. Network documentation software produces one input that several Article 21 measures assume you maintain: an accurate, current map of your systems and their connections. It supports the risk analysis, asset management, and continuity work. It does not perform risk management, handle incidents, or manage your supply chain.
  - question: Can I self-host network documentation for NIS2?
    answer: Yes, and for a European essential entity it's often preferable. Self-hosting keeps the discovery data, which describes your internal network, on your own infrastructure rather than with a third party, which simplifies data-residency questions. Scanopy's Community Edition is free and self-hosted; the commercial self-hosted edition removes the seat and network limits. Both run entirely in your environment.
  - question: How often should NIS2 network documentation be updated?
    answer: NIS2 expects risk-management measures to stay effective as the environment changes, which means documentation has to reflect the network as it is now, not as it was at the last review. Article 21(2)(f) specifically covers assessing whether measures remain effective. Automated discovery rescans on a schedule, so the map stays current without anyone maintaining it by hand.
---

<!-- quote:motala-kommun -->

Motala's IT department is describing exactly the problem NIS2 creates for essential entities: the directive raises what you have to document, while the network keeps changing faster than anyone can redraw a diagram.

## Does NIS2 require a network diagram?

No. [NIS2 Article 21](https://eur-lex.europa.eu/eli/dir/2022/2555/oj) does not name a network diagram, an asset inventory, or any specific artifact. It's deliberately outcomes-based and technology-neutral: it tells essential and important entities what to achieve, and leaves the how to them, scaled to their size and risk (the proportionality principle in Article 21(1)).

So there's no line to point to that says "keep a diagram." What there is instead is a set of measures that assume you have one.

## What NIS2 requires that network documentation supports

Article 21(2) lists ten minimum risk-management measures. Three of them are hard to satisfy without a current, accurate model of your network:

| NIS2 measure | Article | What it needs from you |
|---|---|---|
| Risk analysis | 21(2)(a) | An accurate picture of the systems and assets you're assessing risk to |
| Asset management | 21(2)(i) | An inventory of what's on the network, kept current |
| Business continuity, backup, disaster recovery | 21(2)(c) | Knowing your infrastructure well enough to restore it |
| Assessing effectiveness of measures | 21(2)(f) | A current baseline to evaluate against |

None of these say "diagram." All of them break down if your documentation is a drawing from the last audit. You can't analyze risk to assets you haven't inventoried, you can't restore infrastructure you can't describe, and you can't judge whether a control is effective against a baseline that no longer matches reality.

## How discovery covers asset management and risk analysis

Asset management under 21(2)(i) is the clearest fit, because it starts from a question automated discovery resolves directly: what is actually on the network? You cannot manage or secure devices you don't know exist, and at the scale Motala describes (800-plus switches), keeping that inventory complete and current by hand is what their IT department calls "almost impossible."

Scanopy discovers this from the network itself. Its daemon finds hosts, services, interfaces, and network devices, identifies vendors and models over SNMP, and maps the topology through LLDP, CDP, and ARP. That's the asset inventory and the network map, built from live data rather than memory.

For risk analysis under 21(2)(a), the same current-state picture is the input. The Applications view maps service-to-service dependencies, so you can see which systems interconnect and where data can travel between them, not just that a device exists.

<figure class="my-8">
  <img
    class="block dark:hidden w-full rounded-lg border border-gray-200"
    src="/common/app-light-960w.webp"
    srcset="/common/app-light-960w.webp 960w, /common/app-light-1440w.webp 1440w, /common/app-light-2400w.webp 2400w"
    sizes="(min-width: 1024px) 720px, 100vw"
    loading="lazy"
    alt="Scanopy Applications view: services grouped by application with the dependencies between them drawn as edges, showing which systems interconnect and the routes data can travel across the network."
  />
  <img
    class="hidden dark:block w-full rounded-lg border border-gray-800"
    src="/common/app-960w.webp"
    srcset="/common/app-960w.webp 960w, /common/app-1440w.webp 1440w, /common/app-2400w.webp 2400w"
    sizes="(min-width: 1024px) 720px, 100vw"
    loading="lazy"
    alt="Scanopy Applications view: services grouped by application with the dependencies between them drawn as edges, showing which systems interconnect and the routes data can travel across the network."
  />
</figure>

Here's what the map looks like on a live network. This is an interactive Scanopy map, not a screenshot:

<!-- scanopy-demo -->

Scanopy documents the network's structure, the devices and how they connect and depend on each other. It doesn't classify data or decide which assets are critical; that judgment is part of your risk analysis. It gives the analysis an accurate map to reason about.

## Supervisory authorities want documentation that is demonstrable and maintained

NIS2 enforcement runs through national competent authorities, and while the exact evidence varies by country, the recurring theme is demonstrability: you have to show that a measure exists and works, not just assert it. For the documentation-adjacent measures that means:

- A current asset inventory, not a spreadsheet last touched a year ago.
- A network topology that reflects the environment as it is now.
- Evidence you can produce this on request, and that it's maintained rather than reconstructed for the occasion.

Manual documentation fails on maintenance. Automated discovery rescans on a schedule, so "current" is the default state rather than a pre-audit scramble.

## How to turn discovery into evidence

Scanopy exports the topology as an image (PNG, SVG, or PDF), as diagram markup for a wiki (Mermaid or Confluence), or as CSV of the underlying host and service data, and maps embed via iframe, so the current diagram can live in your risk-management documentation or internal wiki. Topology snapshots version the network state over time, which gives you a dated record of what the network looked like and what changed, useful when an authority or an auditor asks you to show that your documentation is actually maintained.

<figure class="my-8">
  <img
    class="block dark:hidden w-full rounded-lg border border-gray-200"
    src="/common/l2-light-960w.webp"
    srcset="/common/l2-light-960w.webp 960w, /common/l2-light-1440w.webp 1440w, /common/l2-light-2400w.webp 2400w"
    sizes="(min-width: 1024px) 720px, 100vw"
    loading="lazy"
    alt="Scanopy physical (L2) view: switches and the hosts connected to them with port speeds and links, an automatically discovered inventory of the network's devices."
  />
  <img
    class="hidden dark:block w-full rounded-lg border border-gray-800"
    src="/common/l2-960w.webp"
    srcset="/common/l2-960w.webp 960w, /common/l2-1440w.webp 1440w, /common/l2-2400w.webp 2400w"
    sizes="(min-width: 1024px) 720px, 100vw"
    loading="lazy"
    alt="Scanopy physical (L2) view: switches and the hosts connected to them with port speeds and links, an automatically discovered inventory of the network's devices."
  />
</figure>

## What Scanopy does not do for NIS2

Scanopy covers one part of the work. It does not do the rest:

- **Scanopy does not make you NIS2 compliant.** Compliance is an organizational program across all ten measures; no single tool delivers it.
- It does not perform your risk analysis. It supplies the current-state map the analysis reasons about.
- It does not handle incidents, manage your supply chain, run your backups, or train your staff. Those are other Article 21 measures and other tools.
- It does not do monitoring or alerting. It runs alongside those, not instead of them.

On self-hosting: the Community and commercial self-hosted editions run entirely on your infrastructure, so the discovery data, which describes your internal network, stays in your environment. For a European essential entity, that keeps data-residency questions simple.

## Scanopy keeps the asset inventory and map current. It does not run your risk program.

Scanopy is network documentation software: a lightweight daemon discovers your hosts, services, interfaces, topology, and application dependencies, then builds an interactive map with four views that updates on a schedule and exports for evidence. For an entity under NIS2, its job is narrow: it keeps the asset inventory and network map that the risk-analysis, asset-management, and continuity measures assume you maintain accurate on their own, so producing current documentation stops being manual work. It runs alongside the rest of your risk-management program, not in place of it.

The [Community Edition](/community) is free and self-hosted. The [commercial editions](/commercial) remove the seat and network limits and add support. For the broader category, see the guide to [network documentation software](/guides/network-documentation-software).
