---
title: What Happens When Your Network Person Leaves
description: 42% of network knowledge lives in one person's head. When they leave, you don't just lose an employee. You lose the map. Here's how to fix that.
keyword: network documentation best practices
slug: network-person-leaves
date: 2026-03-31
dateModified: 2026-07-03
tldr: Most network documentation depends on one person's memory and habits. When they leave, the knowledge leaves too. The fix isn't documenting more. It's automating documentation so it survives personnel changes.
ctaDescription: Your documentation shouldn't depend on any one person. Scanopy deploys a lightweight daemon that discovers your network and builds a live topology map in minutes. When someone leaves, the map stays current because it was never dependent on them.
faq:
  - question: What is the bus factor, and why does it matter for networks?
    answer: The bus factor is how many people would need to leave before critical knowledge is lost, often just one. For networks it is acute because the most valuable knowledge is not the configuration itself, which lives in the devices, but the reasoning behind it. That why accumulates over years in one person's head and can walk out the door in an afternoon.
  - question: Why isn't just document everything enough?
    answer: Because manual documentation is a second job nobody signed up for, and it decays by default. Surveys show many organizations rarely update their docs even though they change configs weekly, so a gap opens between what changed and what is written down. Telling overworked staff to document more adds a task to an already overloaded list rather than fixing the cause.
  - question: What network knowledge is lost when the network person leaves?
    answer: The configs stay in the devices, but the reasoning leaves: why the OSPF areas are split a certain way, which firewall rules were temporary fixes never removed, why a subnet uses a /23, which vendor's SNMP needs a workaround, and undocumented dependencies between systems. This tribal knowledge accumulates over years and is the hardest part for a replacement to reverse-engineer.
  - question: How do you keep network documentation from depending on one person?
    answer: Remove the human bottleneck by generating documentation from the network itself. A lightweight daemon scans on a schedule and discovers hosts, services, connections, and topology via SNMP, LLDP, CDP, and ARP, producing a live map that reflects the network right now. Anything that updates itself survives a departure; anything that depends on one person's habits does not.
  - question: What can I do this week to reduce my bus factor?
    answer: Identify who holds knowledge nobody else has, list the undocumented decisions behind the configs (the why, not the settings), run an automated discovery scan to give the next person a starting point, export your current network state, and test a handoff by asking someone else to complete a specific task without the network person. Whatever they cannot do is what to document first.
  - question: What are the network documentation best practices that actually stick?
    answer: Favor documentation that maintains itself over documentation that relies on memory. Use automated discovery for the live inventory and topology, write down the reasoning behind design decisions separately, keep output shareable so the whole team can use it, and treat templates as a starting point rather than the system of record. The goal is documentation that survives personnel changes.
---

Your network person puts in two weeks' notice. Or gets a better offer and leaves in one. Or just stops showing up.

Everything they know about your network leaves with them. Subnet layouts, firewall rule rationale, that workaround on the core switch that nobody else understands, the reason VLAN 42 exists. None of it is written down. Some of it is in a spreadsheet from 2023 that's missing half the current infrastructure.

Their replacement starts on Monday. Day one is not productive. Neither is day thirty.

This is the "bus factor" problem, and almost every IT team has it.

## The Knowledge That Lives in Someone's Head

Auvik's [2023 Network IT Management Report](https://www.auvik.com/franklyit/reports/network-it-management-report/) surveyed 4,500 IT professionals and found that 45% of IT teams don't fully know the configuration of their own networks. That's not "we forgot to update the diagram." That's "we don't know what's running."

Across industries, [roughly 42% of institutional knowledge](https://www.iteratorshq.com/blog/cost-of-organizational-knowledge-loss-and-countermeasures/) resides solely with individual employees. For network infrastructure specifically, the problem is worse because the most critical knowledge isn't what's configured. It's _why_ it's configured that way.

The configs are in the devices. You can pull them. What you can't pull:

- Why the OSPF areas are split the way they are
- Which firewall rules were added as temporary fixes and never removed
- Why that one subnet uses a /23 instead of a /24
- Which vendor's SNMP implementation is broken and requires a workaround
- The undocumented dependency between the print server and a specific VLAN

This is tribal knowledge. It accumulates over years and it walks out the door in an afternoon.

## What It Actually Costs

IT staff turnover [averages about 13% annually](https://future-code.dev/en/blog/employee-retention-rate-in-tech-company-navigating-high-turnover-rates/), higher than the national average across industries. That means roughly one in eight IT roles turns over every year.

The direct cost of replacing a specialized IT role runs [150% to 213% of their annual salary](https://bloomfire.com/blog/cost-of-losing-employee/). For a senior network engineer making $120k, that's $180k to $255k in recruiting, onboarding, and lost productivity.

But the hidden cost is bigger. The replacement doesn't just need to learn the job. They need to reverse-engineer the network. Every undocumented decision becomes a puzzle to solve, and they're solving it while also handling tickets and keeping things running.

[Gartner estimates](https://moldstud.com/articles/p-best-practices-for-network-documentation-and-configurations) that 40% of network outages stem from human errors tied to inadequate documentation. When someone new is working from incomplete information, that number gets worse.

## The Inheritance Nightmare

These scenarios show up in sysadmin communities constantly. Not as edge cases. As the default experience.

**The cascade departure.** A junior tech [posted on r/Sysadmin_Fr](https://www.reddit.com/r/Sysadmin_Fr/comments/1rvjtb0/) about joining a training organization where the original admin had stepped back, one replacement quit because the lack of processes was unbearable, and another went on sick leave right after getting hired permanently. The junior was now solo on a 400-PC fleet with scattered configs, no procedures, and passwords they couldn't find. They spent an entire morning just getting a FortiClient passphrase. When a remote site's firewall went down, the stored password didn't match. They later found two wall sockets patched together causing a network loop, something spanning tree would have caught if it had been configured. The community recommended NetBox, draw.io, Excel, and pen and paper. Starting from scratch was the only option.

**The fired sysadmin.** A viral thread described a senior admin who was terminated after a new manager pushed him out. During offboarding, his accounts were deleted, which also wiped the documentation tied to those accounts. Manufacturing plants went down. The company begged him to come back. He refused.

**The MSP handoff.** New MSP takes over a client from the previous provider. The first month isn't service delivery. It's discovery. Figuring out what's connected to what, which IPs are in use, which services run where. The client is paying for IT support and getting an archaeology project.

**The part-timer.** Previous admin was a developer doing sysadmin work on the side. No group policy, no patch management, multiple antivirus products installed on the same machines, and documentation that existed mostly as scattered notes.

These aren't worst-case stories. They're Tuesday.

## Why "Just Document Everything" Doesn't Work

The standard advice is "write everything down." The problem: manual documentation is a second job nobody signed up for.

[Auvik's network field report](https://www.auvik.com/franklyit/blog/network-documentation-best-practices/) found that 27% of organizations never or rarely update their network documentation. Another 41.5% update monthly or less, despite 53% making config changes daily or weekly.

There's a gap between "config changed" and "docs updated." That gap is where knowledge loss lives, and it widens every time someone is busy (which is always). Red Hat's sysadmin blog put it well: [poor documentation is not a job insurance strategy](https://www.redhat.com/sysadmin/poor-documentation). But telling overworked IT staff to document more doesn't fix the problem. It adds a task to a list that's already too long.

Manual documentation decays by default. The person who writes it eventually leaves, and the person who replaces them doesn't trust it because they can't tell what's current.

## Documentation That Survives Personnel Changes

The fix isn't discipline. It's removing the human bottleneck.

Documentation that depends on someone remembering to update a spreadsheet will always lag behind reality. Documentation that generates itself from the network doesn't have that problem.

Automated discovery works like this: a lightweight daemon runs on your network and scans it on a schedule. It discovers hosts, services, connections, and topology using protocols like SNMP, LLDP, CDP, and ARP. The output is a live topology map that reflects what's actually on the network right now, not what someone drew six months ago.

What survives a departure: anything that updates itself. What doesn't: anything that depends on one person's habits.

This is what we built [Scanopy](https://demo.scanopy.net/) to do. Deploy a daemon, get a topology map that updates on a schedule. No manual drawing, no spreadsheets to maintain. When your network person leaves, the map is still current because it was never dependent on them.

Here's what that looks like in practice; this is a live Scanopy map you can interact with:

<!-- scanopy-demo -->

But even if you don't use Scanopy, the principle holds. Any automated discovery tool ([there are several](/blog/automated-network-documentation)) is better than documentation that relies on human memory.

## What to Do This Week

You don't need a month-long documentation initiative. Start with these:

1. **Identify your bus factor.** Who on your team holds network knowledge that nobody else has? If the answer is one person, that's your single point of failure.

2. **List the undocumented decisions.** Not the configs (those are in the devices) but the _why_ behind the configs. Why is the network segmented this way? Why does that rule exist? Write down the reasoning, not just the settings.

3. **Run an automated discovery scan.** Even a single scan gives the next person a starting point. They'll know what's on the network without having to trace cables. If you're picking a tool, our [comparison of automated network diagram tools](/comparisons/best-automated-network-diagram-tools) breaks down discovery method and pricing across the main options.

4. **Export your current network state.** If your network topology lives in someone's head, get it out. A rough diagram is better than no diagram. An [auto-generated one](/blog/network-diagrams-wrong) is better than both.

5. **Test the handoff.** Pick a specific task (find the DHCP server, identify what's on VLAN 10, trace the path between two hosts) and ask someone else on your team to do it without asking the network person. If they can't, that's what you need to document first.

6. **Stop relying on templates alone.** [Templates are a starting point](/blog/network-documentation-template), but they go stale for the same reason all manual documentation goes stale. The goal is documentation that maintains itself.
