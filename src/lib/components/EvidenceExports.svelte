<script lang="ts">
	// The canonical "three ways to get the map out" block, shared across the compliance guides via
	// the `<!-- evidence-exports -->` marker, so the product-capability description (exports, embed,
	// shared link, snapshots) lives in one place and stays in sync with the product instead of being
	// retyped and drifting per guide. The export format list mirrors src/lib/fixtures/features.json
	// (the source of truth). Per CLAUDE.md, exports, embed, and share are always described together.
</script>

<p>Scanopy gets the current map out three ways:</p>
<ul>
	<li>
		<strong>Exports</strong> are a static copy of the map: an image (PNG, SVG, or PDF) or a
		self-contained HTML page, diagram markup for a wiki (Mermaid or Confluence), or CSV of the
		underlying host and service data. Good for dropping the current diagram into a compliance
		document or internal wiki.
	</li>
	<li>
		<strong>Embeds</strong> put the live map inside another page via iframe, so a wiki, dashboard, or
		intranet shows the current topology rather than a stale attached file.
	</li>
	<li>
		<strong>Shared links</strong> hand someone the live map directly, read-only, and it stays current
		as the network rescans. Useful for giving an auditor a view without exporting anything.
	</li>
</ul>
<p>
	Those show the network as it is now. Auditors and authorities also ask whether it is kept current
	over time, and <strong>topology snapshots</strong> are the feature for that. A snapshot is a saved, dated capture of
	the network state; take one at each audit or review and you have a record of what the network looked
	like on that date and what changed since. That dated record is the evidence your documentation is
	maintained, not reconstructed for the assessment.
</p>
