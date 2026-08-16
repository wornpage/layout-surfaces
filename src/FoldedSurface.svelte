<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type SurfaceElement = 'article' | 'div' | 'section';
	type FoldReveal = 'always' | 'hidden' | 'hover';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
		/** Semantic element used for the surface root. */
		as?: SurfaceElement;
		/** When the decorative paper fold is visible. */
		reveal?: FoldReveal;
		children?: Snippet;
	}

	let {
		as = 'div',
		reveal = 'hover',
		class: className,
		children,
		...rest
	}: Props = $props();
	let rootClass = $derived(className ? `worn-folded-surface ${className}` : 'worn-folded-surface');
</script>

<svelte:element this={as} {...rest} class={rootClass} data-fold-reveal={reveal}>
	{#if children}{@render children()}{/if}
	<span class="worn-folded-surface-ear" aria-hidden="true"></span>
</svelte:element>

<style>
	.worn-folded-surface {
		position: relative;
	}

	.worn-folded-surface-ear {
		background: var(--worn-fold-background, var(--cockpit-bg, #f8f6f0));
		border: 1px solid var(--worn-fold-border, var(--cockpit-border, #d6d3cc));
		border-block-start: 0;
		border-inline-end: 0;
		border-radius: 0 0 0 var(--worn-fold-radius, 4px);
		block-size: var(--worn-fold-size, 14px);
		box-sizing: border-box;
		inline-size: var(--worn-fold-size, 14px);
		inset-block-start: 0;
		inset-inline-end: 0;
		opacity: 0;
		pointer-events: none;
		position: absolute;
		transition: opacity var(--worn-fold-duration, 120ms) ease;
		z-index: var(--worn-fold-z-index, 1);
	}

	.worn-folded-surface[data-fold-reveal='always'] > .worn-folded-surface-ear,
	.worn-folded-surface[data-fold-reveal='hover']:hover > .worn-folded-surface-ear {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.worn-folded-surface-ear {
			transition: none;
		}
	}
</style>
