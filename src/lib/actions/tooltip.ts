import type { Action } from 'svelte/action';

/**
 * Tooltip action for `.tooltip-header` triggers.
 *
 * The trigger element is expected to contain a `.tooltip-content` child holding the
 * popover markup. On hover/focus this action clones that content, portals the clone to
 * `document.body`, and positions it `position: fixed` near the trigger. Because the
 * popover lives on the body and is fixed-positioned, it never expands the table cell or
 * the document, so a tall popover (e.g. Network Views) can no longer push page height or
 * force vertical scroll. It flips above/below the trigger to stay inside the viewport.
 *
 * The inline `.tooltip-content` stays in the DOM (hidden via CSS) so it remains the single
 * source of truth for the markup and keeps server-rendered HTML intact; the action just
 * renders a positioned copy on demand.
 */
export const tooltip: Action = (node) => {
	let popover: HTMLElement | null = null;

	function source(): HTMLElement | null {
		return node.querySelector('.tooltip-content');
	}

	function position(el: HTMLElement) {
		const rect = node.getBoundingClientRect();
		const margin = 8;

		// Measure the popover so we can flip / clamp it within the viewport.
		el.style.left = '0px';
		el.style.top = '0px';
		const pw = el.offsetWidth;
		const ph = el.offsetHeight;

		// Horizontal: align to the trigger's left edge, clamped to the viewport.
		let left = rect.left;
		if (left + pw + margin > window.innerWidth) {
			left = Math.max(margin, window.innerWidth - pw - margin);
		}
		if (left < margin) left = margin;

		// Vertical: prefer below the trigger; flip above if it would overflow the bottom
		// and there is more room above.
		const spaceBelow = window.innerHeight - rect.bottom;
		const spaceAbove = rect.top;
		let top: number;
		if (spaceBelow >= ph + margin || spaceBelow >= spaceAbove) {
			top = rect.bottom + margin;
		} else {
			top = rect.top - ph - margin;
		}
		if (top < margin) top = margin;

		el.style.left = `${left}px`;
		el.style.top = `${top}px`;
	}

	function show() {
		if (popover) return;
		const src = source();
		if (!src) return;

		const el = src.cloneNode(true) as HTMLElement;
		el.classList.add('tooltip-portal');
		// Override the inline-cell positioning with fixed, viewport-relative placement.
		el.style.display = 'block';
		el.style.position = 'fixed';
		el.style.margin = '0';
		el.style.maxWidth = `min(90vw, 22rem)`;
		el.style.whiteSpace = 'normal';
		el.setAttribute('role', 'tooltip');

		document.body.appendChild(el);
		popover = el;
		position(el);
	}

	function hide() {
		if (popover && popover.parentNode) {
			popover.parentNode.removeChild(popover);
		}
		popover = null;
	}

	node.addEventListener('mouseenter', show);
	node.addEventListener('mouseleave', hide);
	node.addEventListener('focusin', show);
	node.addEventListener('focusout', hide);

	// Make the trigger keyboard-focusable so the tooltip is reachable without a mouse.
	if (!node.hasAttribute('tabindex')) {
		node.setAttribute('tabindex', '0');
	}

	return {
		destroy() {
			node.removeEventListener('mouseenter', show);
			node.removeEventListener('mouseleave', hide);
			node.removeEventListener('focusin', show);
			node.removeEventListener('focusout', hide);
			hide();
		}
	};
};
