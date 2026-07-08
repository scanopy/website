/**
 * Tilt actions: entrance tilt on scroll + mouse-follow tilt.
 *
 * Shared by the homepage hero/deploy visuals and the /product deep-dive sections.
 */

// Applies transforms to `target` (defaults to the node itself). Mouse events always
// listen on `node` so the hover area can be larger than the tilt target.
export function tilt(node: HTMLElement, target?: HTMLElement) {
	const el = target ?? node;
	const rect = el.getBoundingClientRect();
	const isSmall = rect.width < 400 || rect.height < 300;
	const maxTilt = isSmall ? 10 : 8;

	// Entrance animation via IntersectionObserver
	el.style.transform = 'perspective(800px) rotateX(3deg) rotateY(-3deg)';
	el.style.opacity = '0';
	el.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1), opacity 0.6s ease';

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
					el.style.opacity = '1';
					observer.unobserve(el);
				}
			}
		},
		{ threshold: 0.2 }
	);
	observer.observe(el);

	// Mouse-follow tilt with smoothing
	let targetX = 0;
	let targetY = 0;
	let currentX = 0;
	let currentY = 0;
	let rafId: number | null = null;

	function animate() {
		currentX += (targetX - currentX) * 0.08;
		currentY += (targetY - currentY) * 0.08;
		el.style.transition = 'none';
		el.style.transform = `perspective(800px) rotateY(${currentX * maxTilt}deg) rotateX(${-currentY * maxTilt}deg)`;
		if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
			rafId = requestAnimationFrame(animate);
		} else {
			rafId = null;
		}
	}

	function handleMove(e: MouseEvent) {
		const r = node.getBoundingClientRect();
		targetX = (e.clientX - r.left) / r.width - 0.5;
		targetY = (e.clientY - r.top) / r.height - 0.5;
		if (!rafId) rafId = requestAnimationFrame(animate);
	}

	function handleLeave() {
		targetX = 0;
		targetY = 0;
		if (!rafId) rafId = requestAnimationFrame(animate);
	}

	node.addEventListener('mousemove', handleMove);
	node.addEventListener('mouseleave', handleLeave);

	return {
		destroy() {
			observer.disconnect();
			if (rafId) cancelAnimationFrame(rafId);
			node.removeEventListener('mousemove', handleMove);
			node.removeEventListener('mouseleave', handleLeave);
		}
	};
}

// Tilt action that targets the `.tiltable` child within the node.
// The tab bar / static chrome stays put; only the framed visual tilts.
export function tiltChild(node: HTMLElement) {
	const target = node.querySelector<HTMLElement>('.tiltable');
	if (!target) return;
	return tilt(node, target);
}
