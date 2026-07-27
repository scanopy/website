import { source } from '@/lib/source';
import { Card, Cards } from 'fumadocs-ui/components/card';
import type { Node } from 'fumadocs-core/page-tree';

/**
 * Renders cards for all pages under a named section separator in the page tree.
 * Usage in MDX: <SectionCards section="Guides" />
 */
export function SectionCards({ section }: { section: string }) {
	const pages = getPagesInSection(source.pageTree.children, section);

	return (
		<Cards>
			{pages.map((page) => (
				<Card
					key={page.url}
					title={page.name as string}
					description={page.description as string}
					href={page.url}
				/>
			))}
		</Cards>
	);
}

function getPagesInSection(nodes: Node[], sectionName: string) {
	let inSection = false;
	const pages: Array<{ url: string; name: React.ReactNode; description?: React.ReactNode }> = [];

	for (const node of nodes) {
		if (node.type === 'separator') {
			if (inSection) break;
			if (node.name === sectionName) inSection = true;
			continue;
		}
		if (inSection && node.type === 'page') {
			pages.push(node);
		}
	}

	return pages;
}
