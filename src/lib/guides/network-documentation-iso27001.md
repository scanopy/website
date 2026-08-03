---
title: Network Documentation for ISO 27001 (A.8.20)
description: "What ISO 27001 A.8.20 expects for network documentation: the current diagram and asset inventory auditors ask for, and how automated discovery keeps them current."
keyword: network documentation for ISO 27001
slug: network-documentation-iso27001
date: 2026-07-10
dateModified: 2026-07-10
tldr: "ISO 27001's Annex A 8.20 control statement never says network diagram. But ISO 27002, its implementation guidance, names one directly, and auditors ask for a current diagram plus the A.5.9 asset inventory. Automated network documentation produces both and keeps them current on a schedule."
ctaHeading: Documentation that stays audit-current
ctaDescription: "Scanopy discovers your hosts, services, and topology and keeps the map current on a schedule, so the diagram and inventory A.8.20 assumes are ready when the auditor asks. Self-hosted, so your network data stays on your own infrastructure."
faq:
  - question: Does ISO 27001 require a network diagram?
    answer: Not in a certifiable control. The Annex A 8.20 statement is outcome-based: networks and network devices should be secured, managed, and controlled. It does not name a diagram. But ISO 27002, the implementation guidance for 27001, tells organizations to keep current, version-controlled LAN and WAN network diagrams, and certification auditors ask to see one. So a diagram is expected in practice, even though no clause says the word.
  - question: What does ISO 27001 A.8.20 require?
    answer: A.8.20 (Networks security) requires that networks and network devices be secured, managed, and controlled to protect information in systems and applications. It replaces the 2013 standard's control A.13.1.1. The control itself is outcome-based, so it sets the goal rather than the artifacts. ISO 27002's guidance for it fills in the detail, including maintaining current network diagrams and configuration records for routers, switches, firewalls, and access points.
  - question: Is the network diagram required by A.8.20 or by ISO 27002?
    answer: By ISO 27002, not the A.8.20 control statement. ISO 27001's Annex A lists outcome-based controls, and 8.20 says to secure and manage networks without naming a diagram. ISO 27002 is the companion guidance that explains how, and its guidance for 8.20 directs organizations to maintain up-to-date, version-controlled LAN and WAN diagrams reflecting physical and logical topology. Auditors treat that guidance as the practical bar.
  - question: What network documentation do ISO 27001 auditors ask for?
    answer: A current network topology diagram covering physical and logical layout, an asset inventory that is complete and current, and configuration records for network devices. For A.8.20 the auditor is mainly interested in the documentation of your network, device configurations, and who is responsible for them. A diagram or inventory that drifted since the last audit will not pass.
  - question: How does A.8.20 relate to the A.5.9 asset inventory?
    answer: They overlap. A.8.20 wants a documented, current picture of the network; A.5.9 (Inventory of information and other associated assets) requires an inventory of assets, including owners, that is developed and maintained. A network discovery tool builds the technical half of both: the hosts, services, and devices on the network and how they connect. You still assign owners and classify assets, which A.5.9 requires and a discovery tool does not do.
  - question: Does network documentation software make me ISO 27001 certified?
    answer: No. Certification is an organizational program covering the ISMS clauses and the Annex A controls you select, assessed by an accredited body. No single tool delivers it. Network documentation software produces one input several controls assume you maintain: an accurate, current map of your systems and how they connect. It supports A.8.20 and A.5.9 evidence. It does not run your ISMS, assess risk, or enforce controls.
  - question: How often should ISO 27001 network documentation be updated?
    answer: ISO 27002's guidance for 8.20 says diagrams should be current and dated, which means they have to reflect the network as it is now, not as it was at the last audit. It sets no fixed interval. Automated discovery rescans on a schedule, so the map stays current without anyone redrawing it, and you can capture a dated snapshot at audit time as a version record.
  - question: Can I self-host network documentation for ISO 27001?
    answer: Yes, and for many organizations it fits the ISMS scope better. Self-hosting keeps the discovery data, which describes your internal network, on your own infrastructure rather than with a third party, which simplifies scope and data-residency questions. Scanopy's Community Edition is free and self-hosted; the commercial self-hosted editions remove the seat and network limits and add support. Both run entirely in your environment.
---

ISO 27001 is a common reason a security team goes looking for network documentation, and the requirement is easy to misread in both directions. Some teams assume that because no control says "network diagram," they don't need one. Others draw a diagram once for the certification audit and let it go stale. Both get caught at the next surveillance audit.

## Does ISO 27001 require a network diagram?

Not in a certifiable control. [Annex A 8.20](https://www.isms.online/iso-27001/annex-a-2022/8-20-network-security-2022/) (Networks security) is outcome-based: "Networks and network devices should be secured, managed and controlled to protect information in systems and applications." There's no clause that says "keep a diagram." A.8.20 replaces the 2013 standard's A.13.1.1 and, like the rest of Annex A, states the outcome and leaves the artifacts to you.

The diagram requirement is one level down, in the guidance. [ISO 27002](https://www.isms.online/iso-27002/control-8-20-network-security/), the implementation companion to ISO 27001, is explicit for 8.20: keep up-to-date, version-controlled documentation on LAN and WAN network diagrams and the configuration files of key network devices, and keep those diagrams current, dated, and reflecting both physical and logical topology. That is the bar auditors work to.

This is a real difference from standards like NIS2, where no diagram is named anywhere. Under ISO 27001 the certifiable control is outcome-based, but the guidance names a network diagram directly and auditors ask for one. The practical answer is yes, you need a current network diagram.

## What ISO 27001 A.8.20 requires, and what Scanopy produces for it

A.8.20 anchors network documentation in ISO 27001, but it doesn't stand alone. The same current picture of your network is what a handful of neighboring Annex A controls assume, and each maps to something Scanopy produces:

| Annex A control                                            | Evidence it needs                                                                | What Scanopy produces                                                                 |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| A.8.20 Networks security                                   | A current, dated diagram of physical and logical topology                        | Physical (L2) and Logical (L3) views, refreshed on a schedule                         |
| A.5.9 Inventory of information and other associated assets | A complete, current inventory of the hosts, devices, and services on the network | Discovered host, service, and device inventory, exportable as CSV; the Workloads view |
| A.8.9 Configuration management                             | A documented current-state baseline to review against                            | The discovered topology as that baseline; snapshots record it over time               |
| A.8.21 Security of network services                        | Knowing which services run where                                                 | 200+ service types detected per host, shown across the views                          |

None of these name a diagram except through the 8.20 guidance. All of them break down if your documentation is a drawing from the last audit. You can't inventory assets you haven't discovered, you can't review a configuration against a baseline that no longer matches reality, and you can't secure network services you don't know are running.

Scanopy discovers this from the network itself. Its daemon finds hosts, services, interfaces, and network devices, identifies vendors and models over SNMP, and maps the topology through LLDP, CDP, ARP, and switch MAC forwarding tables. It presents that in four views: physical (L2) and logical (L3) give the physical and logical topology ISO 27002 asks for, the workloads view shows services and VMs on each host, and the applications view maps service-to-service dependencies. The host and service list, exportable as CSV, is the technical foundation of the A.5.9 inventory.

The two that carry most of the compliance weight:

<!-- topology-figure:applications -->

<!-- topology-figure:l3 -->

Explore all four on the live map:

<!-- scanopy-demo -->

Scanopy discovers the network's structure: the devices, the services they run, and how they connect. It builds the inventory and the diagram. It does not assign asset owners or classify assets, which A.5.9 also requires. That part is yours; Scanopy gives you an accurate, current picture to work from instead of a spreadsheet you maintain by hand.

## Auditors ask for a current diagram, inventory, and configuration records

ISO 27001 certification runs through an accredited body, and the Stage 2 audit is where the documentation gets examined. For the network controls, the requests are consistent:

- A current network topology diagram covering both physical and logical layout.
- An asset inventory that is complete and current. Per ISO 27002 guidance for A.5.9, the inventory should be accurate, current, and consistent with other records, which rules out inventories that omit assets or still list retired hardware.
- Configuration records for network devices, with version control and classification.
- Evidence the documentation is maintained, not reconstructed the week before the audit.

Manual documentation fails on maintenance. A Visio file that was accurate at last year's audit asserts a network that no longer exists, which is worse than having nothing, because it's wrong. Automated discovery rescans on a schedule, so "current" is the default state rather than a pre-audit scramble.

## How to turn discovery into A.8.20 evidence

Documentation only counts if you can put it in front of an auditor.

<!-- evidence-exports -->

## What Scanopy does not do for ISO 27001

Scanopy covers one part of the work. It does not do the rest:

- **Scanopy does not make you ISO 27001 certified.** Certification is an ISMS program across the management-system clauses and your selected Annex A controls, assessed by an accredited body. No single tool delivers it.
- It does not run your ISMS or perform risk assessment and treatment. It supplies the current-state map those activities reason about.
- It does not classify assets or assign owners. A.5.9 requires both, and both are decisions a person makes; Scanopy discovers the assets to attach them to.
- It does not enforce segmentation or configuration baselines. A.8.22 and A.8.9 enforcement is your firewalls and switches. Scanopy documents the state; it doesn't change it.
- It does not do monitoring or alerting. It runs alongside those, not instead of them.

On self-hosting: the Community and commercial self-hosted editions run entirely on your infrastructure, so the discovery data, which describes your internal network, stays in your environment. When your ISMS scope excludes third-party or cloud tooling, self-hosted keeps the network documentation inside the boundary.

## Scanopy keeps the network diagram and asset inventory current. It does not run your ISMS.

Scanopy is network documentation software: a lightweight daemon discovers your hosts, services, interfaces, topology, and application dependencies, then builds an interactive map with four views (physical, logical, workloads, applications) that updates on a schedule and exports for evidence. For an organization certifying to ISO 27001, its job is to keep the network diagram and asset inventory that A.8.20 and A.5.9 assume you maintain accurate on their own, so producing current documentation for the auditor stops being manual work. It runs alongside the rest of your ISMS, not in place of it.

The [Community Edition](/community) is free and self-hosted. The [commercial editions](/commercial) remove the seat and network limits and add support, and [pricing](/pricing) covers the plan tiers. For neighboring obligations, see the guides to [network documentation for NIS2](/guides/network-documentation-nis2) and [network documentation for HIPAA](/guides/network-documentation-hipaa), for how Scanopy fits compliance work across standards, the [compliance overview](/solutions/compliance), and for the broader category, the [network documentation software guide](/guides/network-documentation-software).
