'use client';

import { marked } from 'marked';

export function MarkdownDescription({ children }: { children?: string }) {
  if (!children) return null;

  const html = marked.parse(children) as string;

  return (
    <div
      className="mb-8 text-fd-muted-foreground prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
