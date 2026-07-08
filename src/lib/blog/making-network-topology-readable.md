---
title: Making Network Topology Readable (C4 + Graph Theory)
description: How we rebuilt Scanopy's topology map using the C4 model, graph readability research, and compound layered layout. The papers, the tradeoffs, the results.
keyword: network topology visualization
slug: making-network-topology-readable
date: 2026-07-05
dateModified: 2026-07-05
tldr: "Cramming physical links, subnet structure, and service dependencies into one network diagram guarantees spaghetti past about 30 hosts. We rebuilt Scanopy's topology around two ideas from the graph drawing literature: one structural edge type per view, with everything else as an opt-in overlay, and C4-style zoom levels that fall out of expand/collapse. This is the research and the tradeoffs."
ctaHeading: See all four views on your own network
ctaDescription: Scanopy discovers your network over SNMP, LLDP, and ARP, then builds physical, logical, workload, and application views from one scan. The Community Edition is free and self-hosted.
faq:
  - question: Why do network diagrams become unreadable as networks grow?
    answer: Edge crossings. Ghoniem, Fekete, and Castagliola (2004) found that node-link diagrams lose to plain adjacency matrices once crossings pile up, and Huang, Hong, and Eades (2006) found crossings are the strongest predictor of graph reading errors. Network tools that draw physical links, subnet membership, and service dependencies in one view multiply crossings until the diagram stops answering any question.
  - question: What is the C4 model applied to network topology?
    answer: "C4 is Simon Brown's four-level zoom for software architecture diagrams: Context, Container, Component, Code. Applied to networks, the levels become collapsed subnets and switches as single nodes, expanded containers showing their members, individual hosts with ports and services, and a full detail panel for one entity. Each level answers one question at one scale instead of all questions at once."
  - question: What are primary and overlay edges in a topology map?
    answer: A primary edge defines the structural question a view answers and participates in layout. An overlay edge adds context, is drawn after layout, and stays off by default. Scanopy's L2 view uses physical links as primary, the L3 view uses interface membership, and the application view uses service dependencies. One primary edge type per view keeps each layout clean.
  - question: Which layout algorithm works best for network topology?
    answer: It depends on the view's structure. Hierarchical views (subnets, workloads, applications) fit compound layered layout in the Sugiyama tradition, which handles containers and layer ordering; elkjs implements it well. Physical L2 topology has no inherent hierarchy, so force-directed layout fits better. Pure tree algorithms fail on real networks because multi-homed hosts have more than one parent.
  - question: Why not show L2 and L3 topology in one diagram?
    answer: They are different graphs over the same devices. L2 answers how switches and hosts are wired; L3 answers how the network is segmented into subnets. A link that matters in one view is noise in the other, and drawing both edge sets forces the layout to compromise on two structural questions at once. NetBox, SolarWinds, and Cisco DNA Center all separate these views for the same reason.
  - question: When should containment replace drawn edges in a diagram?
    answer: Whenever the relationship is parent-child. Nesting a VM inside its hypervisor's container, or a host inside its subnet, communicates the relationship spatially without adding a line to the diagram. Holten's work on hierarchical data formalizes this, using hierarchy to drive layout and reserving drawn edges for relationships that cross the hierarchy.
---

Every network mapping tool demos beautifully. A router, two switches, a dozen hosts, a tidy diagram. Then someone points it at a production network where one 48-port switch has LLDP neighbors on 40 ports, and the tidy diagram becomes a hairball with labels.

We build [Scanopy](/), a tool that discovers network topology over SNMP, LLDP, CDP, and ARP, and draws it. Our original view put everything it discovered in one diagram: physical links, subnet membership, service dependencies. It worked well to about 30 hosts. Past that, users with complex networks opened GitHub issues that all said some version of the same thing: I can't read this, and I want to see it a different way.

[SCREENSHOT: cluttered single-view topology of a complex network in the old renderer. Use the demo or a representative network, 50+ hosts, the messier the better. This is "the spaghetti."]

The fix took us through graph readability research from the last four decades, an abstraction model borrowed from software architecture, and a rewrite of our layout engine. This post is the technical story.

## Why one diagram can't answer three questions

Network topology is at least three different graphs wearing the same nodes.

- **Physical (L2):** which port connects to which port. The wiring question.
- **Logical (L3):** which hosts sit on which subnets, and how subnets reach each other. The segmentation question.
- **Services:** which application talks to which. The dependency question.

A single host appears in all three graphs, connected by edges that mean completely different things. The switch uplink that dominates the physical view is irrelevant when you're asking "what breaks if I decommission this database." The subnet boundary that structures the logical view says nothing about cabling.

Draw all three edge sets at once and the layout algorithm has to satisfy three structural questions simultaneously. It satisfies none of them. This is not a rendering problem you can style your way out of. It is a data modeling problem.

## What the graph readability research says

We went looking for prior art and found that the visualization community settled the underlying questions years ago.

[Ghoniem, Fekete, and Castagliola (2004)](https://hal.science/hal-00340790) compared node-link diagrams against plain adjacency matrices and found that once graphs pass roughly 20 vertices with dense edges, the matrix wins on most reading tasks. Node-link diagrams survive only when crossings stay low. [Purchase (2002)](https://doi.org/10.1006/jvlc.2002.0232) had already established that minimizing edge crossings is the strongest single aesthetic factor in graph readability, ahead of angular resolution and edge-length uniformity. [Huang, Hong, and Eades (2006)](https://www.semanticscholar.org/paper/Predicting-graph-reading-performance:-a-cognitive-Huang-Hong/e2269dc14bd1a866d29b09d2d09f22be13371f88) went further: crossings are the strongest predictor of task error rate. People don't just find cluttered graphs ugly. They read them wrong.

Ware's *Information Visualization* (2004) adds the cognitive ceiling: humans track roughly 3 to 5 visual channels before comprehension degrades. Line style, color, thickness, direction. A diagram mixing physical links, logical membership, and service flows at equal visual weight burns the entire budget on edge type disambiguation before the reader gets to the actual question.

Industry practice agrees. NetBox keeps cable topology and prefix/VLAN structure in separate views. SolarWinds ships separate L2 and L3 mapping modes, and its docs state the reason plainly: combining them creates visual clutter. LibreNMS builds its topology view on LLDP/CDP links alone. Cisco DNA Center draws physical structure and toggles logical overlays on top. Nobody who has to render big networks for a living draws everything at once.

So the direction was clear. The interesting problems were in the details: how many views, what defines each one, and what happens to all the edges that don't fit.

## Borrowing the C4 model from software architecture

Simon Brown's [C4 model](https://c4model.com/) solves a parallel problem for software diagrams: one architecture, different questions at different zoom levels. Context, Container, Component, Code. Each level is a complete diagram at one scale, and you move between levels instead of cramming scales together.

Networks map onto it cleanly:

| C4 level | Software meaning | Network equivalent |
|---|---|---|
| Context | Systems and users | Subnets and switches as single collapsed nodes. The whole-network picture. |
| Container | Deployable units | Subnets and switches expanded, members visible inside. |
| Component | Parts inside a container | Individual hosts with ports, services, addresses. |
| Code | Class-level detail | Everything about one entity, in a side panel. |

The insight that made this workable: zoom level and view type are orthogonal. A view (physical, logical, workloads, applications) decides *what* the nodes and containers represent. The C4 level decides *how much* of it is expanded. Any view can be read at any level.

The pleasant surprise was how little UI this needed. We didn't build a "C4 mode." Three composable features produce all four levels: a view switcher (what am I looking at), expand/collapse on containers (Context to Container and back), and a detail panel on click (Component and Code). Users navigate zoom levels without ever seeing the term C4.

## One structural edge type per view

The second core decision came from [Holten (2006)](https://doi.org/10.1109/TVCG.2006.147), whose hierarchical edge bundling work rests on a separation we adopted wholesale: hierarchy drives layout, and cross-cutting relations are drawn on top of it afterward.

Every edge type in Scanopy is classified per view as either **primary** or **overlay**:

- **Primary edges** define the view's structural question and participate in layout. The layout engine positions nodes to minimize crossings among primary edges only. Each view gets exactly one primary edge type.
- **Overlay edges** are context. They render after layout, don't move nodes, and are off by default. Thinner, dashed, lower opacity.

| View | Primary edge (drives layout) | Everything else |
|---|---|---|
| Physical (L2) | Discovered physical links (LLDP/CDP, MAC tables) | Subnet membership, service flows: overlay or hidden |
| Logical (L3) | Interface-to-subnet membership | Physical links: hidden by default (an OSI abstraction violation in this view) |
| Workloads | Containment, not edges (VM nested in hypervisor) | Network edges: overlay |
| Applications | Service dependency flows | Everything else: hidden |

The "one primary type" rule sounds strict until you look at the math. Crossing count grows with edge density, so a second structural edge type doesn't double the clutter, it multiplies it (this is the Purchase and Ghoniem result again, from the layout engine's perspective). Optimizing for one structural question is the difference between a layout that means something and a layout that averages two meanings into mush.

Two supporting rules do a lot of work:

**Containment replaces edges wherever the relationship is parent-child.** A VM drawn inside its hypervisor's container needs no connecting line. A host inside its subnet needs no membership edge. Nesting communicates the relationship spatially, for free, following Holten's hierarchy principle. Every edge you don't draw is crossings you don't create.

**Overlays aggregate past a threshold.** A node with 30 overlay edges gets one bundled edge with a count badge instead of 30 lines (the Ghoniem crossing findings, applied as a guardrail). And overlays start off by default, per [Shneiderman's (1996)](https://doi.org/10.1109/VL.1996.545307) mantra: overview first, zoom and filter, then details on demand.

## Choosing layout algorithms

With one structural question per view, each view can get an algorithm suited to its structure.

**Hierarchical views (logical, workloads, applications): compound layered layout via [elkjs](https://github.com/kieler/elkjs).** This is the Sugiyama tradition (layer assignment, crossing reduction, coordinate assignment) extended for compound graphs, where nodes contain subgraphs (Sander 1996). Subnets become containers whose inner layout runs first; container dimensions propagate up; the outer layout arranges containers relative to each other. Layer constraints map naturally to subnet ordering.

The obvious question is why not a plain tree layout, which is simpler and faster. Real networks answer it immediately: multi-homed hosts. One host on two subnets has two parents, and tree algorithms assume one. The topology is a DAG, not a tree, and compound layered layout handles DAGs natively. We keep a tree pass only for the fully collapsed Context level, where containers-as-nodes do form a simple tree.

**Physical view (L2): force-directed.** Cable topology has no inherent hierarchy to exploit. Switches and hosts form a peer graph, and force simulation produces the natural clustering people expect from a physical map.

The library landscape, compressed:

| Library | Compound nodes | Layered | Deterministic | Size | Verdict |
|---|---|---|---|---|---|
| elkjs | yes | yes | yes | ~2MB | Our pick for hierarchical views |
| dagre | no | yes | yes | ~30KB | Good Sugiyama, no containers |
| d3-hierarchy | no | tree only | yes | ~10KB | Breaks on multi-parent nodes |
| d3-force | no | no | no | ~15KB | Our pick for L2 |
| cytoscape-fcose | yes | no | no | ~50KB | Nice compound force option, no layer guarantees |

The 2MB elkjs bundle stung. It runs in a Web Worker, loaded lazily, so the map UI never blocks on it and first paint doesn't pay for it. Determinism was a hard requirement we refused to trade away: the same network should produce the same diagram every scan, or users lose their mental map and diffs between scans become meaningless.

## Before and after

Same network, old renderer versus the shipped result.

[SCREENSHOT: before. The old single view of the complex network from the opening image.]

[SCREENSHOT: after. Logical (L3) view at Container level: subnets as containers, hosts nested inside, interface edges only.]

[SCREENSHOT: after. Fully collapsed Context level: subnets as single nodes with count badges. The whole network in one screen.]

[SCREENSHOT: after. Overlay toggle on: primary structure unchanged, overlay edges layered on top at reduced weight.]

The layouts differ because the questions differ. That's the point.

## What we shipped

Four views (Physical L2, Logical L3, Workloads, Applications), C4-style zoom via expand/collapse, one primary edge type per view, overlays off by default, elkjs compound layout in a worker, force-directed for L2. It shipped in Scanopy v0.16 alongside topology snapshots, which version network state between scans (deterministic layout is what makes those diffs readable).

Here's the result on a live network. This is an interactive Scanopy map, not a screenshot:

<!-- scanopy-demo -->

The [Community Edition](/community) is free, self-hosted, and AGPL-3.0 if you want to run it against your own network. The graph drawing literature cited above is worth your time even if you never touch our tool: most of what makes infrastructure diagrams bad was measured and explained decades ago, and most tools still ignore it.
