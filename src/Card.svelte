<script lang="ts">
	import type { Snippet } from 'svelte';
	import FoldIndicator from './FoldIndicator.svelte';

	interface Props {
		href?: string;
		padded?: boolean;
		children?: Snippet;
	}

	let { href, padded = true, children }: Props = $props();
</script>

{#if href}
	<a class="worn-card" class:is-padded={padded} {href}>
		{#if children}{@render children()}{/if}
		<FoldIndicator variant="card" />
	</a>
{:else}
	<div class="worn-card" class:is-padded={padded}>
		{#if children}{@render children()}{/if}
		<FoldIndicator variant="card" />
	</div>
{/if}

<style>
	.worn-card {
		box-sizing: border-box;
		display: block;
		inline-size: 100%;
		max-inline-size: 100%;
		min-inline-size: 0;
		position: relative;
		overflow: visible;
		overflow-wrap: anywhere;
		background: var(--worn-card-background, var(--worn-surface, #ffffff));
		border: 1px solid var(--worn-card-border, transparent);
		border-radius: var(--worn-card-radius, var(--worn-radius, 6px));
		box-shadow: var(--worn-card-shadow, var(--worn-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08)));
		text-decoration: none;
		color: inherit;
	}

	:global(.worn-card > *) {
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}

	a.worn-card {
		transition: border-color 120ms ease, box-shadow 120ms ease;
	}

	a.worn-card:focus-visible {
		border-color: var(--worn-card-active-border, var(--worn-border, #d6d3cc));
		box-shadow: var(--worn-card-active-shadow, var(--worn-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.08)));
	}

	@media (hover: hover) and (pointer: fine) {
		a.worn-card:hover {
			border-color: var(--worn-card-active-border, var(--worn-border, #d6d3cc));
			box-shadow: var(--worn-card-active-shadow, var(--worn-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.08)));
		}
	}

	a.worn-card:focus-visible {
		outline: 2px solid var(--worn-card-focus, var(--worn-focus, var(--worn-text, currentColor)));
		outline-offset: 2px;
	}

	.worn-card.is-padded {
		padding: var(--worn-card-padding, 18px 26px);
	}

	@media (prefers-reduced-motion: reduce) {
		a.worn-card {
			transition: none;
		}
	}
</style>
