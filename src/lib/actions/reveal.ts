// repo/src/lib/actions/reveal.ts
// useReveal — Svelte 5 action that dispatches `reveal:enter` when an
// observed element first intersects the viewport. D-19 + D-20 layer 2.
//
// Consumer pattern:
//   <div use:reveal onreveal:enter={() => (visible = true)}>...</div>
//
// Reduced-motion belt-and-suspenders: when prefers-reduced-motion is reduce,
// the action skips the IntersectionObserver entirely and fires immediately.
// (Layer 1 — the global CSS blanket in app.css — flattens any in:fade/in:fly
// transition to 0ms, so even without this early-exit the user-perceived
// outcome is correct; the early-exit avoids spinning up an observer we'd
// immediately collapse.)
import type { Action } from 'svelte/action';
import { prefersReducedMotion } from 'svelte/motion';

export type RevealParams = {
	threshold?: number; // default 0.15
	once?: boolean; // default true — disconnect after first hit
};

export const reveal: Action<HTMLElement, RevealParams | undefined> = (node, params) => {
	const opts = { threshold: 0.15, once: true, ...params };

	if (prefersReducedMotion.current) {
		queueMicrotask(() => node.dispatchEvent(new CustomEvent('reveal:enter')));
		return {};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.dispatchEvent(new CustomEvent('reveal:enter'));
					if (opts.once) observer.disconnect();
				}
			}
		},
		{ threshold: opts.threshold }
	);
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
};
