/**
 * An app screenshot in both themes: the light capture in light mode, the dark one in dark mode.
 *
 * `src` names a pair under `public/images/` (`daemons/poll` → `daemons/poll-light.webp` and
 * `daemons/poll-dark.webp`). The path is absolute because the docs app's `basePath` doesn't apply
 * to a plain `<img>`.
 */
export function Screenshot({ src, alt }: { src: string; alt: string }) {
	const frame = 'my-6 w-full rounded-lg border border-fd-border';

	return (
		<>
			<img
				src={`/docs/images/${src}-light.webp`}
				alt={alt}
				loading="lazy"
				className={`${frame} dark:hidden`}
			/>
			<img
				src={`/docs/images/${src}-dark.webp`}
				alt={alt}
				loading="lazy"
				className={`${frame} hidden dark:block`}
			/>
		</>
	);
}
