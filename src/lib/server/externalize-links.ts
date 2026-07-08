// Post-process rendered markdown HTML so that only off-site links open in a new
// tab. Links to scanopy.net (and its subdomains) stay in the same tab; every
// external link gets target="_blank" rel="noopener noreferrer".
export function externalizeLinks(html: string): string {
	return html.replace(/<a href="(https?:\/\/[^"]+)"/g, (match, url) => {
		try {
			const host = new URL(url).hostname;
			if (host === 'scanopy.net' || host.endsWith('.scanopy.net')) return match;
		} catch {
			return match;
		}
		return `<a href="${url}" target="_blank" rel="noopener noreferrer"`;
	});
}
