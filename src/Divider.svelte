<script lang="ts">
	interface Props {
		label?: string;
	}

	const instanceId = $props.id();
	let { label }: Props = $props();
	let visibleLabel = $derived(label?.trim() || '');
	let labelId = $derived(visibleLabel ? `${instanceId}-label` : undefined);
</script>

{#if visibleLabel}
	<div class="worn-divider" role="separator" aria-orientation="horizontal" aria-labelledby={labelId}>
		<span class="worn-divider-line" aria-hidden="true"></span>
		<span class="worn-divider-label" id={labelId}>{visibleLabel}</span>
		<span class="worn-divider-line" aria-hidden="true"></span>
	</div>
{:else}
	<hr class="worn-divider worn-divider-plain" />
{/if}

<style>
	.worn-divider {
		box-sizing: border-box;
		inline-size: 100%;
		max-inline-size: 100%;
		min-inline-size: 0;
		margin: var(--worn-divider-margin-block, 16px) 0;
	}

	.worn-divider:not(.worn-divider-plain) {
		display: flex;
		align-items: center;
		gap: var(--worn-divider-gap, 12px);
		overflow: visible;
	}

	.worn-divider-plain {
		display: block;
		block-size: 0;
		border: 0;
		border-block-start: 1px solid var(--worn-divider-color, var(--cockpit-border, #d6d3cc));
	}

	.worn-divider-line {
		flex: 1 1 24px;
		min-inline-size: 8px;
		block-size: 1px;
		background: var(--worn-divider-color, var(--cockpit-border, #d6d3cc));
	}

	.worn-divider-label {
		flex: 0 1 auto;
		max-inline-size: calc(100% - 40px);
		min-inline-size: 0;
		overflow-wrap: anywhere;
		text-align: center;
		font-family: var(--font-typewriter, ui-monospace, monospace);
		font-size: 11px;
		font-weight: 560;
		line-height: 1.35;
		text-transform: uppercase;
		letter-spacing: 0;
		color: var(--worn-divider-label-color, var(--cockpit-text-muted, #506058));
	}
</style>
