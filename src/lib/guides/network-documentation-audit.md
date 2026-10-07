---
title: Network Documentation for Audits
description: "What auditors ask for when they review a network: a current diagram, a complete asset inventory, and evidence that both are maintained rather than reconstructed."
keyword: network documentation for audits
slug: network-documentation-audit
date: 2026-10-05
dateModified: 2026-10-05
tldr: "Auditors ask for three things about a network: a current diagram, a complete asset inventory, and evidence both are maintained. Almost no standard names a diagram in a certifiable clause, so the requirement arrives through what the evidence demands. Automated discovery produces both and keeps them current on a schedule."
ctaHeading: Documentation that is already current when the audit starts
ctaDescription: "Scanopy discovers your hosts, services and topology and keeps the map current on a schedule, so the diagram and inventory an auditor asks for are ready rather than rebuilt. Self-hosted, so your network data stays on your own infrastructure."
faq:
  - question: What network documentation do auditors ask for?
    answer: Three artifacts, consistently. A current network topology diagram covering physical and logical layout. An asset inventory that is complete and current, listing hosts, devices and the services running on them. And evidence that both are maintained on an ongoing basis rather than assembled in the weeks before the audit. The third is the one teams most often fail, because a diagram with no revision history looks reconstructed whether or not it is.
  - question: Does an IT audit require a network diagram?
    answer: Rarely in those words. Most frameworks state an outcome and leave the artifacts to you, so the diagram arrives as the practical way to evidence something else: asset management, risk analysis, segmentation, or scope definition. PCI-DSS and CMMC name a diagram directly. ISO 27002 names one in guidance. NIS2 and HIPAA name none, and auditors ask anyway, because the underlying obligations cannot be evidenced without one.
  - question: How current does a network diagram have to be for an audit?
    answer: Current enough that an auditor sampling it against reality finds no discrepancy. No framework states an interval, which makes this a judgment the assessor exercises. A diagram dated from the previous audit asserts a network that has since changed, and a stale diagram is worse than none because it is a document that is wrong. Scheduled rediscovery makes current the default state rather than a pre-audit project.
  - question: What is the difference between a network diagram and an asset inventory for audit purposes?
    answer: The diagram shows structure, meaning how devices and subnets connect. The inventory shows population, meaning what exists and where. Auditors cross-reference them, and they also cross-reference both against other records such as vulnerability scan output. A device present in a scan but absent from the inventory is a finding, which is why partial coverage of the network causes problems that partial detail does not.
  - question: Can I give an auditor direct access to the network map?
    answer: Yes. A read-only shared link hands someone the live map without an account on your system, and it stays current as the network is rescanned. For teams that currently field individual requests from InfoSec and external auditors for IP lists, subnet breakdowns and diagrams, this replaces the request queue with self-service. Access is controlled per view, so the link shows what you choose to show.
  - question: Does automated discovery satisfy audit requirements on its own?
    answer: It produces the artifacts, not the program. Discovery builds the diagram and the inventory and keeps them current, which is the part that fails most often because it is manual. Classifying assets, assigning owners, deciding what is in scope and running the risk assessment all remain human judgments. No tool makes an organisation compliant, and any vendor claiming otherwise is describing something else.
  - question: Which standards require network documentation?
    answer: ISO 27001 through ISO 27002 guidance on A.8.20, PCI-DSS through requirement 1.2.3 which names a current diagram directly, CMMC Level 2 through 32 CFR 170.19 which requires a diagram of the assessment scope, NIS2 through Article 21 risk-management measures, and HIPAA through the Security Rule risk analysis. Internal audits and parent-company reviews frequently ask for the same artifacts without citing any framework.
  - question: What makes network documentation fail an audit?
    answer: Two things, and neither is detail. Staleness, where the document describes a network that has changed since it was drawn. And partial coverage, where parts of the estate were never documented, so the inventory is incomplete by construction. A beautifully detailed diagram of sixty percent of the network evidences less than a plain one that covers all of it.
---

An annual audit asks for the network in writing, and the request usually lands on whoever runs the network rather than on whoever owns the audit. The artifacts are consistent across internal audits, certification audits and parent-company reviews, and so are the two ways they fail.

## Auditors ask for a current diagram, a complete inventory, and evidence of maintenance

The specific wording varies by framework and by assessor. The substance does not.

| What the auditor asks for                                 | Why they ask                                                                   | What Scanopy produces                                                   |
| --------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| A current network topology diagram, physical and logical  | Segmentation, scope boundaries and risk analysis are all argued from structure | Physical (L2) and Logical (L3) views, refreshed on a schedule           |
| A complete asset inventory of hosts, devices and services | Controls apply to assets, so an incomplete inventory means unassessed assets   | Discovered host, service and device inventory, exportable as CSV        |
| Evidence the documentation is maintained                  | A document with no history cannot be distinguished from one written last week  | Snapshots, which record the discovered state as a dated series          |
| Which services run where                                  | Service exposure drives most of the technical findings                         | 200+ service types detected per host, shown across the views            |
| How systems depend on each other                          | Continuity and impact analysis need dependencies, not just links               | The applications view, where you define the dependencies you care about |

## Almost no standard says "network diagram"

The obligation usually arrives one level down from the certifiable clause, which is why teams disagree about whether they need a diagram at all.

| Standard                                            | Where the documentation obligation sits                                                                |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [ISO 27001](/guides/network-documentation-iso27001) | A.8.20 is outcome-based; ISO 27002 guidance names current, version-controlled LAN and WAN diagrams     |
| PCI-DSS                                             | Requirement 1.2.3 names a current diagram directly, with no inference needed                           |
| [CMMC Level 2](/guides/network-documentation-cmmc)  | 32 CFR 170.19 requires every in-scope asset in an inventory and in a diagram of the assessment scope   |
| [NIS2](/guides/network-documentation-nis2)          | Article 21 names no diagram; three of its ten risk-management measures cannot be evidenced without one |
| [HIPAA](/guides/network-documentation-hipaa)        | The Security Rule risk analysis presumes you know where ePHI lives and what it traverses               |

Internal audit functions and parent-company reviews often cite none of these. They ask for a consolidated map of every site and a full inventory of addresses, subnets and devices, which is the same pair of artifacts arrived at from a different direction.

Scanopy discovers this from the network itself. Its daemon finds hosts, services, interfaces and network devices, identifies vendors and models over SNMP, and maps the topology through LLDP, CDP, ARP and switch MAC forwarding tables. It presents that in four views: physical (L2) and logical (L3) give the topology, the workloads view shows containers and VMs on each host, and the applications view maps the service dependencies you define. The host and service list, exportable as CSV, is the technical foundation of the inventory.

The two that carry most of the audit weight:

<!-- topology-figure:applications -->

<!-- topology-figure:l3 -->

Explore all four on the live map:

<!-- scanopy-demo -->

Scanopy discovers structure and population: the devices, the services they run, and how they connect. Classifying assets, assigning owners and deciding what falls inside the audit scope stay with you. Discovery gives those decisions an accurate current picture to attach to instead of a spreadsheet maintained by hand.

## Staleness and partial coverage are what fail an audit, not missing detail

Manual documentation fails on maintenance. A diagram that was accurate at last year's audit asserts a network that no longer exists, which is worse than having nothing, because it is a document that is wrong. Scheduled rediscovery makes current the default state rather than a pre-audit scramble.

Partial coverage fails more quietly. Auditors cross-reference the inventory against other records, and a device that appears in a vulnerability scan but not in the asset inventory is a finding on its own. Completeness applies to the fields on a record as well as to the list of records: an MSP [described being marked down on an audit](https://www.reddit.com/r/sysadmin/comments/1sljwr5/listing_ips_on_an_internal_network_diagram_for/) because the diagram omitted IP addresses, which the NCUA asks for specifically. Discovery fills those fields because it read them off the network rather than asking someone to type them in. This is where the commercial model of a documentation tool stops being a procurement detail: if the tool is metered per device or per agent, every device added to it has a cost attached, and the cheapest way to stay inside the budget is to leave parts of the estate out. An inventory with deliberate gaps in it evidences nothing. Coverage has to be complete to be worth producing, so the pricing has to let it be complete.

## How to put discovery in front of an auditor

Documentation only counts if you can hand it over. The read-only shared link matters most for audit work, because it replaces the queue of one-off requests from InfoSec and external auditors with a live map they can read themselves.

<!-- evidence-exports -->

## What Scanopy does not do for an audit

Scanopy covers one part of the work. It does not do the rest:

- **Scanopy does not make you compliant or certified.** Certification and attestation are programs assessed by people. No single tool delivers one, whatever the standard.
- It does not run your risk assessment. It supplies the current-state map that a risk assessment reasons about.
- It does not classify assets or assign owners. Both are decisions a person makes; Scanopy discovers the assets to attach them to.
- It does not enforce segmentation or configuration baselines. Your firewalls and switches do that. Scanopy documents the state; it does not change it.
- It does not generate compliance reports or track control status. A GRC platform does that, and Scanopy is one of the sources it draws on.
- It does not do monitoring or alerting. It runs alongside those, not instead of them.

On self-hosting: the Community and commercial self-hosted editions run entirely on your infrastructure, so the discovery data, which describes your internal network in detail, stays in your environment. Where an audit scope or a parent company's security review restricts which third parties may hold network data, self-hosted keeps it inside the boundary.

## Scanopy keeps the diagram and the inventory current. It does not run your audit.

Scanopy is network documentation software: a lightweight daemon discovers your hosts, services, interfaces, topology and application dependencies, then builds an interactive map with four views that updates on a schedule and exports for evidence. For a team that produces network documentation for an audit every year, its job is to make the diagram and the inventory accurate on their own, so the week before the audit stops being a reconstruction project.

The [Community Edition](/community) is free and self-hosted. The [commercial editions](/commercial) raise the seat and site limits and add support, and [pricing](/pricing) covers the tiers. For a specific obligation, see the guides to [ISO 27001](/guides/network-documentation-iso27001), [NIS2](/guides/network-documentation-nis2), [HIPAA](/guides/network-documentation-hipaa) and [CMMC Level 2](/guides/network-documentation-cmmc), the [compliance overview](/solutions/compliance) for how Scanopy fits across standards, and the [network documentation software guide](/guides/network-documentation-software) for the broader category.
