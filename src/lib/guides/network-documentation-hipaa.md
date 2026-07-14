---
title: Network Documentation for HIPAA Compliance
description: "What HIPAA expects for network documentation: the risk analysis, asset inventory, and data-flow mapping the Security Rule assumes, and how automated discovery produces that evidence."
keyword: network documentation for HIPAA
slug: network-documentation-hipaa
date: 2026-07-07
dateModified: 2026-07-07
tldr: "HIPAA's Security Rule never names a network diagram. But the required risk analysis (45 CFR 164.308(a)(1)(ii)(A)) and NIST's implementation guidance both assume you can map the systems, data flows, and assets that touch ePHI. Automated network documentation produces that current-state map, kept up to date on its own."
ctaHeading: Documentation your risk analysis can rely on
ctaDescription: "Scanopy discovers your hosts, services, topology, and application dependencies, then keeps the map current on a schedule. Self-hosted, so your network data never leaves your environment."
faq:
  - question: Does HIPAA require a network diagram?
    answer: Not explicitly. The HIPAA Security Rule never uses the words "network diagram," unlike PCI-DSS, which names it directly. What HIPAA requires is a risk analysis (45 CFR 164.308(a)(1)(ii)(A)), and NIST's implementation guidance (SP 800-66 Rev 2) says that analysis should map the systems, data flows, and assets that store or process ePHI. A current network map is one way to satisfy that expectation.
  - question: What is a HIPAA data flow diagram?
    answer: A data flow diagram shows how electronic protected health information moves between the systems that create, receive, store, or transmit it. HIPAA doesn't mandate one by name, but NIST SP 800-66 Rev 2 directs organizations to map data flows as part of the risk analysis. In practice it means documenting which systems connect to which, so you can see the paths ePHI can travel across your network.
  - question: Does network documentation software make me HIPAA compliant?
    answer: No. There is no such thing as HIPAA-certified software, and no single tool makes an organization compliant. Network documentation software produces one piece of evidence the Security Rule assumes you maintain: an accurate, current map of your systems and their connections. It supports the risk analysis and audit process. It does not perform the risk analysis, classify ePHI, or enforce access controls.
  - question: How does automated discovery help with a HIPAA risk analysis?
    answer: A risk analysis has to start from an accurate picture of what exists and how it connects, and OCR audits repeatedly cite incomplete or outdated inventories as a top failing. Automated discovery builds that picture from the network itself (hosts, services, topology, and application dependencies) and refreshes it on a schedule, so the inventory and data-flow map your risk analysis depends on stay current instead of aging into fiction.
  - question: How often should HIPAA network documentation be updated?
    answer: HIPAA requires periodic review and updates as the environment changes (45 CFR 164.308(a)(8)), without setting a fixed interval. The practical answer is that documentation should reflect the network as it is now, not as it was at the last audit. Automated discovery rescans on a schedule (daily or weekly for most teams), so the map stays current without someone remembering to redraw it.
  - question: Can I self-host network documentation for HIPAA?
    answer: Yes, and for a covered entity it's often the cleaner path. Self-hosting means the discovery data (which describes your internal network) never leaves your environment, so there's no third party holding it, and a business associate agreement with Scanopy is not implicated for the self-hosted editions. Scanopy's Community Edition is free and self-hosted; the commercial self-hosted edition removes the seat and network limits. Both run entirely on your own infrastructure.
  - question: Does topology documentation prove network segmentation for HIPAA?
    answer: It provides the evidence. Segmenting systems that handle ePHI from the rest of the network is a common safeguard under the access control and transmission security standards (45 CFR 164.312). A current logical topology shows which subnets exist and how hosts sit across them, which is what an assessor looks at to confirm segmentation is real rather than assumed. It documents the state; it doesn't enforce it.
---

HIPAA is a common reason healthcare IT teams go looking for network documentation, and a commonly misunderstood one. The Security Rule never says "keep a network diagram." So teams either assume they're off the hook, or they draw a diagram once for an audit and let it go stale. Both are the wrong read.

## Does HIPAA require a network diagram?

No. If you're looking for a citation that says "you must have a diagram," it isn't there.

What is there is the requirement that anchors everything else: the risk analysis. [45 CFR 164.308(a)(1)(ii)(A)](https://www.ecfr.gov/current/title-45/section-164.308) requires every covered entity and business associate to "conduct an accurate and thorough assessment of the potential risks and vulnerabilities to the confidentiality, integrity, and availability" of electronic protected health information. You cannot assess risk to ePHI accurately without knowing what systems exist, where ePHI lives, and how those systems connect. The diagram isn't the requirement. It's how you meet one.

## What HIPAA requires that network documentation supports

The authoritative guidance on implementing the Security Rule is [NIST SP 800-66 Rev 2](https://csrc.nist.gov/pubs/sp/800/66/r2/final) (February 2024). It tells organizations to "map systems, data flows, and assets that store or process ePHI" as part of assessing their current state. That single sentence names the three things network documentation gives you: systems, data flows, and assets.

Several Security Rule standards lean on that same current-state picture:

| HIPAA requirement | Citation | What it needs from you |
|---|---|---|
| Risk analysis | 164.308(a)(1)(ii)(A) | An accurate map of systems, assets, and how ePHI flows between them |
| Evaluation | 164.308(a)(8) | Periodic review against a current baseline as the environment changes |
| Contingency plan | 164.308(a)(7) | Knowing your infrastructure well enough to restore it |
| Access control | 164.312(a)(1) | Evidence that systems handling ePHI are appropriately separated |
| Transmission security | 164.312(e)(1) | Understanding the paths ePHI travels across the network |

None of these say "diagram." All of them assume you have a current, accurate model of your network. Automated documentation supplies that current-state model.

## How discovery maps your ePHI data flows

NIST's guidance also asks for data flows, which an inventory alone does not give you. Knowing you own 400 devices doesn't tell you where ePHI can travel. Knowing which systems talk to which does.

Scanopy discovers this from the network directly. Its topology views (physical and logical) show the hosts, subnets, and links, which is the systems-and-assets half. The Applications view maps service-to-service dependencies, which is the closest thing to a data-flow map you can build without manual diagramming: it shows which applications and services depend on which others, and therefore the routes data can move between them.

<figure class="my-8">
  <img
    class="block dark:hidden w-full rounded-lg border border-gray-200"
    src="/common/app-light-960w.webp"
    srcset="/common/app-light-960w.webp 960w, /common/app-light-1440w.webp 1440w, /common/app-light-2400w.webp 2400w"
    sizes="(min-width: 1024px) 720px, 100vw"
    loading="lazy"
    alt="Scanopy Applications view: services grouped by application with the dependencies between them drawn as edges, showing which systems connect to which and the routes data can travel between them."
  />
  <img
    class="hidden dark:block w-full rounded-lg border border-gray-800"
    src="/common/app-960w.webp"
    srcset="/common/app-960w.webp 960w, /common/app-1440w.webp 1440w, /common/app-2400w.webp 2400w"
    sizes="(min-width: 1024px) 720px, 100vw"
    loading="lazy"
    alt="Scanopy Applications view: services grouped by application with the dependencies between them drawn as edges, showing which systems connect to which and the routes data can travel between them."
  />
</figure>

Scanopy maps the connections and dependencies between systems, discovered from the network. It does not read, classify, or track the ePHI itself. It shows the paths ePHI can travel, based on how your systems are wired and which services depend on each other. It is not deep packet inspection and not a data-classification tool. Scanopy gives your risk analysis an accurate map of the structure; deciding where ePHI actually lives is part of the analysis.

Here's what the map looks like on a live network. This is an interactive Scanopy map, not a screenshot:

<!-- scanopy-demo -->

## Assessors ask for a current inventory, a topology, and segmentation evidence

Whether it's an internal risk analysis, an external assessment, or a cyber-insurance questionnaire, the requests are much the same:

- A current inventory of systems and devices, not a list from the last audit.
- A network topology showing how those systems connect.
- Evidence of segmentation between ePHI systems and the rest of the network.
- Confirmation that the documentation reflects the network as it is now.

OCR investigations and assessors repeatedly flag inventories and diagrams that were accurate once and drifted. A Visio file from two years ago is worse than useless in an audit, because it asserts a state that no longer exists. Automated discovery answers this by rebuilding the map from the live network on a schedule, so "current" is the default rather than a scramble before an assessment.

## How to turn discovery into audit evidence

Documentation only helps if you can hand it to someone. Scanopy exports the topology as an image (PNG, SVG, or PDF), as diagram markup for a wiki (Mermaid or Confluence), or as CSV of the underlying host and service data, and maps embed via iframe, so the current diagram can live in the risk-analysis document or the internal wiki rather than in a tool nobody else can open. Topology snapshots version the network state over time, which gives you a point-in-time record: what the network looked like at the date of the assessment, and what changed since.

<figure class="my-8">
  <img
    class="block dark:hidden w-full rounded-lg border border-gray-200"
    src="/common/l2-light-960w.webp"
    srcset="/common/l2-light-960w.webp 960w, /common/l2-light-1440w.webp 1440w, /common/l2-light-2400w.webp 2400w"
    sizes="(min-width: 1024px) 720px, 100vw"
    loading="lazy"
    alt="Scanopy physical (L2) view: switches and the hosts connected to them with port speeds and links, an automatically discovered inventory of the network's devices that exports for a risk-analysis document."
  />
  <img
    class="hidden dark:block w-full rounded-lg border border-gray-800"
    src="/common/l2-960w.webp"
    srcset="/common/l2-960w.webp 960w, /common/l2-1440w.webp 1440w, /common/l2-2400w.webp 2400w"
    sizes="(min-width: 1024px) 720px, 100vw"
    loading="lazy"
    alt="Scanopy physical (L2) view: switches and the hosts connected to them with port speeds and links, an automatically discovered inventory of the network's devices that exports for a risk-analysis document."
  />
</figure>

## What Scanopy does not do for HIPAA

Scanopy covers one slice of the work. It does not do the rest:

- **Scanopy is not "HIPAA compliant" software, because that category does not exist.** No tool certifies an organization. Scanopy produces one evidence artifact several requirements assume you maintain.
- It does not perform your risk analysis. It supplies the current-state map the analysis reasons about; a person still has to assess the risks.
- It does not classify or track ePHI. It maps systems and their connections, not data content.
- It does not enforce access control or segmentation. It documents whether they exist; enforcement is your firewalls and switches.
- It does not do monitoring, alerting, or patch management. It runs alongside those tools, not instead of them.

On self-hosting: the Community and commercial self-hosted editions run entirely on your infrastructure, so the discovery data (a description of your internal network) never leaves your environment and no third party holds it. Because nothing is shared with Scanopy, a business associate agreement with Scanopy is not implicated for the self-hosted editions.

## Scanopy keeps the risk-analysis map current. It does not do the analysis.

Scanopy is network documentation software: a lightweight daemon discovers your hosts, services, interfaces, topology, and application dependencies, then builds an interactive map with four views (physical, logical, workloads, applications) that updates on a schedule and exports for audit use. For a HIPAA covered entity, its job is narrow: it keeps the systems-and-data-flow map your risk analysis depends on accurate without anyone maintaining it by hand. It runs alongside your monitoring, access control, and risk-management work, not in place of them.

The [Community Edition](/community) is free and self-hosted. The [commercial editions](/commercial) remove the seat and network limits and add support. If you want the deeper category overview, see the guide to [network documentation software](/guides/network-documentation-software).
