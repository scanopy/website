'use client';

import { marked } from 'marked';

export function MarkdownDescription({ children }: { children?: string }) {
	if (!children) return null;

	const html = marked.parse(children) as string;

	return (
		<div
			className="text-fd-muted-foreground prose mb-8"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
