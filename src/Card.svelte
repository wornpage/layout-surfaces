<script lang="ts">
	import type { Snippet } from 'svelte';

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
	</a>
{:else}
	<div class="worn-card" class:is-padded={padded}>
		{#if children}{@render children()}{/if}
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
		background: var(--worn-card-background, var(--cockpit-surface, #ffffff));
		border: 1px solid var(--worn-card-border, transparent);
		border-radius: var(--worn-card-radius, var(--cockpit-radius, 6px));
		box-shadow: var(--worn-card-shadow, var(--cockpit-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08)));
		text-decoration: none;
		color: inherit;
	}

	:global(.worn-card > *) {
		max-inline-size: 100%;
		min-inline-size: 0;
		overflow-wrap: anywhere;
	}

	a.worn-card {
		transition: border-color 120ms ease, box-shadow 120ms ease, transform 100ms ease;
	}

	a.worn-card:hover,
	a.worn-card:focus-visible {
		border-color: var(--worn-card-active-border, var(--cockpit-border, #d6d3cc));
		box-shadow: var(--worn-card-active-shadow, var(--cockpit-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.08)));
		transform: translateY(-1px);
	}

	a.worn-card:focus-visible {
		outline: 2px solid var(--worn-card-focus, var(--cockpit-accent, #287f73));
		outline-offset: 2px;
	}

	.worn-card.is-padded {
		padding: var(--worn-card-padding, 18px 26px);
	}

	.worn-card::after {
		content: '';
		position: absolute;
		top: -1px;
		right: -1px;
		z-index: 1;
		inline-size: 12px;
		block-size: 12px;
		pointer-events: none;
		opacity: 0;
		background: var(--worn-card-dog-ear-background, var(--cockpit-bg, #f8f6f0));
		border: 1px solid var(--worn-card-dog-ear-border, var(--cockpit-border, #d6d3cc));
		border-block-start: 0;
		border-inline-end: 0;
		border-radius: 0 0 0 3px;
		transition: opacity 120ms ease;
	}

	a.worn-card:hover::after,
	a.worn-card:focus-visible::after {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		a.worn-card,
		.worn-card::after {
			transition: none;
		}

		a.worn-card:hover,
		a.worn-card:focus-visible {
			transform: none;
		}
	}
</style>
