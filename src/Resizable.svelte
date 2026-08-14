<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    initialSize?: number;
    minSize?: number;
    maxSize?: number;
    side?: 'start' | 'end';
    label?: string;
    children?: Snippet;
    content?: Snippet;
  }

  const MIN_SUPPORTED_SIZE = 100;
  const MAX_SUPPORTED_SIZE = 800;
  const SIZE_STEP = 20;

  let {
    initialSize = 280,
    minSize = 180,
    maxSize = 480,
    side = 'start',
    label = 'Resize pane',
    children,
    content,
  }: Props = $props();

  function snapSize(value: number) {
    return Math.round(value / SIZE_STEP) * SIZE_STEP;
  }

  function supportedSize(value: number) {
    return Math.max(MIN_SUPPORTED_SIZE, Math.min(MAX_SUPPORTED_SIZE, snapSize(value)));
  }

  let lowerBound = $derived(supportedSize(Math.min(minSize, maxSize)));
  let upperBound = $derived(supportedSize(Math.max(minSize, maxSize)));

  // svelte-ignore state_referenced_locally -- initialSize intentionally seeds uncontrolled pane state.
  let paneSize = $state(Math.max(lowerBound, Math.min(upperBound, supportedSize(initialSize))));
  let dragging = $state(false);
  let activePointerId: number | null = null;
  let dragStartX = 0;
  let dragStartSize = 0;

  const instanceId = $props.id();
  const paneId = `${instanceId}-pane`;
  const contentId = `${instanceId}-content`;

  $effect(() => {
    paneSize = Math.max(lowerBound, Math.min(upperBound, paneSize));
  });

  function setPaneSize(value: number) {
    paneSize = Math.max(lowerBound, Math.min(upperBound, supportedSize(value)));
  }

  function onPointerDown(event: PointerEvent) {
    if (event.button !== 0 || activePointerId !== null) return;
    event.preventDefault();

    const handle = event.currentTarget as HTMLElement;
    handle.focus({ preventScroll: true });
    activePointerId = event.pointerId;
    dragStartX = event.clientX;
    dragStartSize = paneSize;
    dragging = true;
    handle.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event: PointerEvent) {
    if (!dragging || event.pointerId !== activePointerId) return;
    const delta = side === 'end' ? dragStartX - event.clientX : event.clientX - dragStartX;
    setPaneSize(dragStartSize + delta);
  }

  function finishPointer(event: PointerEvent) {
    if (event.pointerId !== activePointerId) return;
    const handle = event.currentTarget as HTMLElement;
    const pointerId = activePointerId;
    activePointerId = null;
    dragging = false;
    if (pointerId !== null && handle.hasPointerCapture?.(pointerId)) {
      handle.releasePointerCapture(pointerId);
    }
  }

  function onLostPointerCapture(event: PointerEvent) {
    if (event.pointerId !== activePointerId) return;
    activePointerId = null;
    dragging = false;
  }

  function onHandleKeydown(event: KeyboardEvent) {
    let next = paneSize;
    if (event.key === 'ArrowLeft') next = paneSize + (side === 'end' ? SIZE_STEP : -SIZE_STEP);
    else if (event.key === 'ArrowRight') next = paneSize + (side === 'end' ? -SIZE_STEP : SIZE_STEP);
    else if (event.key === 'Home') next = lowerBound;
    else if (event.key === 'End') next = upperBound;
    else return;

    event.preventDefault();
    setPaneSize(next);
  }
</script>

<div
  class="worn-resizable worn-resizable-{paneSize}"
  class:is-end={side === 'end'}
  class:is-dragging={dragging}
>
  <div class="worn-resizable-pane" id={paneId}>
    {#if children}{@render children()}{/if}
  </div>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex, a11y_no_noninteractive_element_interactions -- ARIA separators are keyboard-operable widgets. -->
  <div
    class="worn-resizable-handle"
    class:is-dragging={dragging}
    role="separator"
    aria-orientation="vertical"
    aria-label={label}
    aria-controls={paneId}
    aria-valuenow={paneSize}
    aria-valuemin={lowerBound}
    aria-valuemax={upperBound}
    aria-valuetext={`${paneSize} pixels`}
    tabindex="0"
    onpointerdown={onPointerDown}
    onpointermove={onPointerMove}
    onpointerup={finishPointer}
    onpointercancel={finishPointer}
    onlostpointercapture={onLostPointerCapture}
    onkeydown={onHandleKeydown}
  ></div>
  <div class="worn-resizable-content" id={contentId}>
    {#if content}{@render content()}{/if}
  </div>
</div>

<style>
  .worn-resizable {
    --worn-resizable-pane-size: 280px;
    --worn-resizable-handle-size: 12px;
    box-sizing: border-box;
    display: grid;
    grid-template-areas: 'pane handle content';
    grid-template-columns: minmax(0, var(--worn-resizable-pane-size)) var(--worn-resizable-handle-size) minmax(0, 1fr);
    inline-size: 100%;
    max-inline-size: 100%;
    min-inline-size: 0;
    block-size: 100%;
    overflow: hidden;
    color: var(--worn-resizable-color, var(--cockpit-text, #1f2f28));
  }

  .worn-resizable.is-end {
    grid-template-areas: 'content handle pane';
    grid-template-columns: minmax(0, 1fr) var(--worn-resizable-handle-size) minmax(0, var(--worn-resizable-pane-size));
  }

  .worn-resizable-100 { --worn-resizable-pane-size: 100px; }
  .worn-resizable-120 { --worn-resizable-pane-size: 120px; }
  .worn-resizable-140 { --worn-resizable-pane-size: 140px; }
  .worn-resizable-160 { --worn-resizable-pane-size: 160px; }
  .worn-resizable-180 { --worn-resizable-pane-size: 180px; }
  .worn-resizable-200 { --worn-resizable-pane-size: 200px; }
  .worn-resizable-220 { --worn-resizable-pane-size: 220px; }
  .worn-resizable-240 { --worn-resizable-pane-size: 240px; }
  .worn-resizable-260 { --worn-resizable-pane-size: 260px; }
  .worn-resizable-280 { --worn-resizable-pane-size: 280px; }
  .worn-resizable-300 { --worn-resizable-pane-size: 300px; }
  .worn-resizable-320 { --worn-resizable-pane-size: 320px; }
  .worn-resizable-340 { --worn-resizable-pane-size: 340px; }
  .worn-resizable-360 { --worn-resizable-pane-size: 360px; }
  .worn-resizable-380 { --worn-resizable-pane-size: 380px; }
  .worn-resizable-400 { --worn-resizable-pane-size: 400px; }
  .worn-resizable-420 { --worn-resizable-pane-size: 420px; }
  .worn-resizable-440 { --worn-resizable-pane-size: 440px; }
  .worn-resizable-460 { --worn-resizable-pane-size: 460px; }
  .worn-resizable-480 { --worn-resizable-pane-size: 480px; }
  .worn-resizable-500 { --worn-resizable-pane-size: 500px; }
  .worn-resizable-520 { --worn-resizable-pane-size: 520px; }
  .worn-resizable-540 { --worn-resizable-pane-size: 540px; }
  .worn-resizable-560 { --worn-resizable-pane-size: 560px; }
  .worn-resizable-580 { --worn-resizable-pane-size: 580px; }
  .worn-resizable-600 { --worn-resizable-pane-size: 600px; }
  .worn-resizable-620 { --worn-resizable-pane-size: 620px; }
  .worn-resizable-640 { --worn-resizable-pane-size: 640px; }
  .worn-resizable-660 { --worn-resizable-pane-size: 660px; }
  .worn-resizable-680 { --worn-resizable-pane-size: 680px; }
  .worn-resizable-700 { --worn-resizable-pane-size: 700px; }
  .worn-resizable-720 { --worn-resizable-pane-size: 720px; }
  .worn-resizable-740 { --worn-resizable-pane-size: 740px; }
  .worn-resizable-760 { --worn-resizable-pane-size: 760px; }
  .worn-resizable-780 { --worn-resizable-pane-size: 780px; }
  .worn-resizable-800 { --worn-resizable-pane-size: 800px; }

  .worn-resizable-pane,
  .worn-resizable-content {
    box-sizing: border-box;
    min-inline-size: 0;
    overflow: auto;
    overflow-wrap: anywhere;
  }

  .worn-resizable-pane { grid-area: pane; }
  .worn-resizable-content { grid-area: content; }

  .worn-resizable-handle {
    position: relative;
    z-index: 1;
    grid-area: handle;
    inline-size: var(--worn-resizable-handle-size);
    min-inline-size: var(--worn-resizable-handle-size);
    cursor: col-resize;
    touch-action: none;
    user-select: none;
  }

  .worn-resizable-handle::after {
    content: '';
    position: absolute;
    inset-block: 0;
    inset-inline-start: 50%;
    inline-size: 2px;
    translate: -50% 0;
    background: var(--worn-resizable-rail, var(--cockpit-border-strong, #b8b0a5));
    transition: background-color 0.15s ease, inline-size 0.15s ease;
  }

  .worn-resizable-handle:hover::after,
  .worn-resizable-handle:focus-visible::after,
  .worn-resizable-handle.is-dragging::after {
    inline-size: 4px;
    background: var(--worn-resizable-active, var(--cockpit-accent, #0f766e));
  }

  .worn-resizable-handle:focus-visible {
    outline: 2px dashed var(--worn-resizable-focus, var(--cockpit-accent, #0f766e));
    outline-offset: -2px;
  }

  @media (pointer: coarse) {
    .worn-resizable-handle::before {
      content: '';
      position: absolute;
      inset-block: 0;
      inset-inline: -16px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .worn-resizable-handle::after { transition: none; }
  }
</style>
