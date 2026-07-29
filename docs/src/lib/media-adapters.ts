import type { MediaAdapter } from 'fumadocs-openapi';

/** `MediaContext` is not exported on its own; derive it from the public adapter type. */
type MediaContext = Parameters<MediaAdapter['generateExample']>[1];

/**
 * `text/plain` support for request and response bodies.
 *
 * fumadocs ships adapters for the JSON/XML/form family only, and throws
 * "Media type text/plain is not supported" while prerendering any operation
 * that takes a plain-text body. Registering this keeps those endpoints
 * documenting the content type they actually use, instead of the docs
 * pipeline rewriting them to `application/json` and misreporting them.
 */
const quote = (value: unknown, delimiter: string) =>
	`${delimiter}${String(value ?? '').replaceAll(delimiter, `\\${delimiter}`)}${delimiter}`;

/**
 * `MediaContext` ends in a catch-all `{ lang: string }` member, so narrowing on
 * `ctx.lang` never excludes it and `addImport` stays off the narrowed type. The
 * per-language signatures also differ (JS takes two arguments), hence the cast.
 */
function addImport(ctx: MediaContext, specifier: string) {
	if ('addImport' in ctx) {
		(ctx.addImport as (name: string) => void)(specifier);
	}
}

export const textPlainAdapter: MediaAdapter = {
	encode: ({ body }) => String(body ?? ''),
	generateExample: ({ body }, ctx) => {
		switch (ctx.lang) {
			case 'js':
				return `const body = ${quote(body, '`')}`;
			case 'python':
				return `body = ${quote(body, '"""')}`;
			case 'go':
				addImport(ctx, 'strings');
				return `body := strings.NewReader(${quote(body, '`')})`;
			case 'java':
				addImport(ctx, 'java.net.http.HttpRequest.BodyPublishers');
				return `var body = BodyPublishers.ofString(${quote(body, '"""')});`;
			case 'csharp':
				addImport(ctx, 'System.Text');
				return `var body = new StringContent(${quote(body, '"""')}, Encoding.UTF8, "text/plain");`;
			default:
				return undefined;
		}
	}
};

export const mediaAdapters = {
	'text/plain': textPlainAdapter
};
