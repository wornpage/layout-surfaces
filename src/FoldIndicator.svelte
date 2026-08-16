<script lang="ts">
	type Variant = 'card' | 'surface';

	interface Props {
		variant: Variant;
	}

	let { variant }: Props = $props();
</script>

<span class="worn-fold-indicator" data-fold-variant={variant} aria-hidden="true"></span>

<style>
	.worn-fold-indicator {
		box-sizing: border-box;
		inset-block-start: 0;
		inset-inline-end: 0;
		opacity: 0;
		pointer-events: none;
		position: absolute;
	}

	.worn-fold-indicator[data-fold-variant='surface'] {
		background: var(--worn-fold-background, var(--cockpit-bg, #f8f6f0));
		border: 1px solid var(--worn-fold-border, var(--cockpit-border, #d6d3cc));
		border-block-start: 0;
		border-inline-end: 0;
		border-radius: 0 0 0 var(--worn-fold-radius, 4px);
		block-size: var(--worn-fold-size, 14px);
		inline-size: var(--worn-fold-size, 14px);
		transition: opacity var(--worn-fold-duration, 120ms) ease;
		z-index: var(--worn-fold-z-index, 1);
	}

	.worn-fold-indicator[data-fold-variant='card'] {
		background: var(--worn-card-dog-ear-background, var(--cockpit-bg, #f8f6f0));
		border: 1px solid var(--worn-card-dog-ear-border, var(--cockpit-border, #d6d3cc));
		border-block-start: 0;
		border-inline-end: 0;
		border-radius: 0 0 0 3px;
		block-size: 12px;
		inline-size: 12px;
		transition: opacity 120ms ease;
		z-index: 1;
	}

	:global(.worn-folded-surface[data-fold-reveal='always']) > .worn-fold-indicator,
	:global(.worn-folded-surface[data-fold-reveal='hover']:hover) > .worn-fold-indicator,
	:global(.worn-folded-surface[data-fold-reveal='hover']:focus-visible) > .worn-fold-indicator,
	:global(.worn-folded-surface[data-fold-reveal='hover']:focus-within) > .worn-fold-indicator,
	:global(a.worn-card:hover) > .worn-fold-indicator,
	:global(a.worn-card:focus-visible) > .worn-fold-indicator {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.worn-fold-indicator {
			transition: none;
		}
	}
</style>
