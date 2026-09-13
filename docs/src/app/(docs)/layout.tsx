import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<DocsLayout
			tree={source.pageTree}
			sidebar={{
				prefetch: false,
				footer: (
					// Opens the cookie settings panel on the main site's privacy policy.
					<a
						href="/privacy#do-not-sell"
						className="text-fd-muted-foreground hover:text-fd-foreground text-xs"
					>
						Do Not Sell or Share My Personal Information
					</a>
				)
			}}
			{...baseOptions()}
		>
			{children}
		</DocsLayout>
	);
}
