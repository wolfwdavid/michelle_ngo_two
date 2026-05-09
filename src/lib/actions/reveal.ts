// repo/src/lib/actions/reveal.ts
// useReveal — Svelte 5 action that fires when an observed element first
// intersects the viewport. D-19 + D-20 layer 2.
//
// Two consumption shapes (RESEARCH §Pattern 4 lines 460-463 — Svelte 5 reserves
// the ':' character inside attribute names, which makes the `onreveal:enter`
// attribute form illegal in template syntax; the action therefore exposes BOTH
// a CustomEvent dispatch (for plain `node.addEventListener('reveal:enter', ...)`
// consumers) AND a typed `onEnter` callback param (for Svelte component
// wrappers like FadeIn / ScrollReveal):
//
//   // callback (used by FadeIn.svelte, ScrollReveal.svelte):
//   <div use:reveal={{ onEnter: () => (visible = true) }}>...</div>
//
//   // CustomEvent (works for any DOM listener, e.g. dev gallery):
//   const el = ...; el.addEventListener('reveal:enter', handler);
//   <div use:reveal></div>
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
	onEnter?: () => void; // optional typed callback (avoids the colon-attribute trap)
};

export const reveal: Action<HTMLElement, RevealParams | undefined> = (node, params) => {
	const opts = { threshold: 0.15, once: true, ...params };

	function fire() {
		node.dispatchEvent(new CustomEvent('reveal:enter'));
		opts.onEnter?.();
	}

	if (prefersReducedMotion.current) {
		queueMicrotask(fire);
		return {};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					fire();
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
