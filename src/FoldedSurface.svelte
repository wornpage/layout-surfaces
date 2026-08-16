<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import FoldIndicator from './FoldIndicator.svelte';

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
	<FoldIndicator variant="surface" />
</svelte:element>

<style>
	.worn-folded-surface {
		position: relative;
	}

</style>
