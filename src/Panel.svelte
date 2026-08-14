<script lang="ts">
	import type { Snippet } from 'svelte';

	type HeadingLevel = 2 | 3 | 4 | 5 | 6;

	interface Props {
		/** Heading that names the panel section. */
		heading?: string;
		/** Short label shown above the heading. */
		sectionLabel?: string;
		/** Heading level used in the surrounding document hierarchy. */
		headingLevel?: HeadingLevel;
		children?: Snippet;
	}

	const headingTags = { 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6' } as const;
	const instanceId = $props.id();
	let { heading, sectionLabel, headingLevel = 2, children }: Props = $props();
	let visibleHeading = $derived(heading?.trim() || '');
	let visibleLabel = $derived(sectionLabel?.trim() || '');
	let headingId = $derived(visibleHeading ? `${instanceId}-heading` : undefined);
	let labelId = $derived(visibleLabel ? `${instanceId}-label` : undefined);
	let labelledBy = $derived(headingId ?? labelId);
	let rootTag = $derived(labelledBy ? 'section' : 'div');
	let headingTag = $derived(headingTags[headingLevel]);
</script>

<svelte:element this={rootTag} class="worn-panel" aria-labelledby={labelledBy}>
	{#if visibleLabel || visibleHeading}
		<div class="worn-panel-head">
			{#if visibleLabel}<span class="worn-panel-label" id={labelId}>{visibleLabel}</span>{/if}
			{#if visibleHeading}
				<svelte:element this={headingTag} class="worn-panel-title" id={headingId}>{visibleHeading}</svelte:element>
			{/if}
		</div>
	{/if}
	<div class="worn-panel-body">
		{#if children}{@render children()}{/if}
	</div>
</svelte:element>

<style>
	.worn-panel {
		box-sizing: border-box;
		inline-size: 100%;
		max-inline-size: 100%;
		min-inline-size: 0;
		margin: 0 0 var(--worn-panel-margin-block-end, 16px);
		padding: var(--worn-panel-padding, 14px);
		overflow: visible;
		overflow-wrap: anywhere;
		background: var(--worn-panel-background, var(--cockpit-surface, #ffffff));
		border: 1px solid var(--worn-panel-border, transparent);
		border-radius: var(--worn-panel-radius, var(--cockpit-radius, 6px));
		box-shadow: var(--worn-panel-shadow, var(--cockpit-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08)));
		color: var(--worn-panel-color, var(--cockpit-text, #1f2f28));
	}

	.worn-panel-head,
	.worn-panel-body,
	:global(.worn-panel-body > *) {
		box-sizing: border-box;
		max-inline-size: 100%;
		min-inline-size: 0;
	}

	.worn-panel-head {
		display: grid;
		gap: var(--worn-panel-heading-gap, 4px);
		margin: 0 0 var(--worn-panel-head-margin-block-end, 4px);
		padding: var(--worn-panel-head-padding, 10px);
	}

	.worn-panel-label,
	.worn-panel-title,
	.worn-panel-body,
	:global(.worn-panel-body > *) {
		overflow-wrap: anywhere;
	}

	.worn-panel-label {
		display: block;
		font-family: var(--font-typewriter, ui-monospace, monospace);
		font-size: 11px;
		font-weight: 560;
		line-height: 1.35;
		letter-spacing: 0;
		color: var(--worn-panel-label-color, var(--cockpit-text-muted, #506058));
	}

	.worn-panel-title {
		margin: 0;
		font-family: var(--font-family-display, ui-serif, Georgia, serif);
		font-size: var(--worn-panel-heading-size, 22px);
		font-weight: 680;
		line-height: 1.08;
		letter-spacing: 0;
		color: var(--worn-panel-heading-color, var(--cockpit-text, #1f2f28));
	}

	.worn-panel-body {
		padding: var(--worn-panel-body-padding, 4px 0);
	}
</style>
