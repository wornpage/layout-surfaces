<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Section label shown above the content. */
		label?: string;
		/** Visual treatment for the contained content. */
		variant?: 'surface' | 'tinted' | 'bare' | 'dashed';
		/** Remove the border, padding, and background. */
		borderless?: boolean;
		children: Snippet;
	}

	const instanceId = $props.id();
	let { label, variant = 'surface', borderless = false, children }: Props = $props();
	let visibleLabel = $derived(label?.trim() || '');
	let labelId = $derived(visibleLabel ? `${instanceId}-label` : undefined);
</script>

<div
	class="worn-container"
	class:is-tinted={variant === 'tinted'}
	class:is-bare={variant === 'bare'}
	class:is-dashed={variant === 'dashed'}
	class:is-borderless={borderless}
	role={visibleLabel ? 'group' : undefined}
	aria-labelledby={labelId}
>
	{#if visibleLabel}<span class="worn-container-label" id={labelId}>{visibleLabel}</span>{/if}
	{@render children()}
</div>

<style>
	.worn-container {
		box-sizing: border-box;
		inline-size: 100%;
		max-inline-size: 100%;
		min-inline-size: 0;
		margin: 0 0 var(--worn-container-margin-block-end, 18px);
		padding: var(--worn-container-padding, 16px);
		overflow: visible;
		overflow-wrap: anywhere;
		background: var(--worn-container-background, var(--cockpit-surface, #ffffff));
		background: var(
			--worn-container-background,
			color-mix(in srgb, var(--cockpit-surface, #ffffff) 92%, var(--cockpit-bg, #f8f6f0) 8%)
		);
		border: 1px solid var(--worn-container-border, var(--cockpit-border, #d6d3cc));
		border-radius: var(--worn-container-radius, var(--cockpit-radius, 6px));
	}

	:global(.worn-container > *) {
		max-inline-size: 100%;
		min-inline-size: 0;
	}

	.worn-container.is-tinted {
		background: var(--worn-container-tinted-background, var(--cockpit-bg, #f8f6f0));
		background: var(
			--worn-container-tinted-background,
			color-mix(in srgb, var(--cockpit-accent, #287f73) 4%, var(--cockpit-bg, #f8f6f0))
		);
		border-color: var(--worn-container-tinted-border, var(--cockpit-accent, #287f73));
		box-shadow: var(
			--worn-container-tinted-shadow,
			0 0 0 1px var(--cockpit-accent-50, rgba(40, 127, 115, 0.22))
		);
	}

	.worn-container.is-bare {
		background: var(--worn-container-bare-background, var(--cockpit-bg, #f8f6f0));
		border-color: var(--worn-container-border, var(--cockpit-border, #d6d3cc));
	}

	.worn-container.is-dashed {
		background: var(--worn-container-dashed-background, var(--cockpit-bg, #f8f6f0));
		border-style: dashed;
		border-color: var(--worn-container-dashed-border, var(--cockpit-border-strong, #9ca49f));
	}

	.worn-container.is-borderless {
		padding: 0;
		border: 0;
		background: transparent;
		box-shadow: none;
	}

	.worn-container-label {
		display: block;
		max-inline-size: 100%;
		min-inline-size: 0;
		margin: 0 0 var(--worn-container-label-gap, 10px);
		overflow-wrap: anywhere;
		font-size: 11px;
		font-weight: 610;
		line-height: 1.35;
		text-transform: uppercase;
		letter-spacing: 0;
		color: var(--worn-container-label-color, var(--cockpit-text-muted, #506058));
	}
</style>
