import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { compile } from 'svelte/compiler';

const read = (name: string) => readFileSync(new URL(`../src/${name}.svelte`, import.meta.url), 'utf8');
const container = read('Container');
const card = read('Card');
const divider = read('Divider');
const foldIndicator = read('FoldIndicator');
const foldedSurface = read('FoldedSurface');
const panel = read('Panel');
const resizable = read('Resizable');

function expectFinePointerHover(source: string, selector: string, topLevelClose: string) {
	const occurrences = [...source.matchAll(new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'), 'gu'))];
	expect(occurrences.length).toBeGreaterThan(0);

	for (const occurrence of occurrences) {
		const index = occurrence.index ?? -1;
		expect(source.lastIndexOf('@media (hover: hover) and (pointer: fine)', index)).toBeGreaterThan(source.lastIndexOf(topLevelClose, index));
	}
}

describe('@wornpage/layout-surfaces', () => {
	it('declares one source-delivered v2 package', () => {
		const pkg = require('../package.json');
		expect(pkg.name).toBe('@wornpage/layout-surfaces');
		expect(pkg.version).toBe('0.2.0');
		expect(pkg.wornpage).toEqual({ contractVersion: 2, delivery: 'source' });
		expect(pkg.main).toBe('./src/index.ts');
		expect(pkg.files).not.toContain('dist');
	});

	it('exports and compiles every layout surface without warnings', async () => {
		const mod = await import('../src/index.ts');
		expect(Object.keys(mod).sort()).toEqual(['Card', 'Container', 'Divider', 'FoldedSurface', 'Panel', 'Resizable']);
		for (const [name, source] of Object.entries({ Card: card, Container: container, Divider: divider, FoldIndicator: foldIndicator, FoldedSurface: foldedSurface, Panel: panel, Resizable: resizable })) {
			const result = compile(source, { filename: `${name}.svelte`, generate: 'client' });
			expect(result.warnings).toHaveLength(0);
		}
	});

	it('owns an optional semantic paper-fold treatment', () => {
		expect(foldedSurface).toContain("type SurfaceElement = 'article' | 'div' | 'section';");
		expect(foldedSurface).toContain("type FoldReveal = 'always' | 'hidden' | 'hover';");
		expect(foldedSurface).toContain('<svelte:element this={as} {...rest} class={rootClass} data-fold-reveal={reveal}>');
		expect(foldedSurface).toContain("import FoldIndicator from './FoldIndicator.svelte';");
		expect(foldedSurface).toContain('<FoldIndicator variant="surface" />');
		expect(foldedSurface).not.toContain('worn-folded-surface-ear');
	});

	it('centralizes both private dog-ear variants in one fold indicator', () => {
		expect(card).toContain("import FoldIndicator from './FoldIndicator.svelte';");
		expect(card).toContain('<FoldIndicator variant="card" />');
		expect(card).not.toContain('::after');
		expect(foldIndicator).toContain("type Variant = 'card' | 'surface';");
		expect(foldIndicator).toContain('<span class="worn-fold-indicator" data-fold-variant={variant} aria-hidden="true"></span>');
		expect(foldIndicator).toMatch(/\.worn-fold-indicator \{[\s\S]*?inset-block-start: 0;[\s\S]*?inset-inline-end: 0;[\s\S]*?pointer-events: none;/u);
		expect(foldIndicator).toContain(".worn-fold-indicator[data-fold-variant='surface']");
		expect(foldIndicator).toContain(".worn-fold-indicator[data-fold-variant='card']");
		expect(foldIndicator).toContain(":global(.worn-folded-surface[data-fold-reveal='hover']:focus-within) > .worn-fold-indicator");
		expect(foldIndicator).toContain(':global(a.worn-card:focus-visible) > .worn-fold-indicator');
		expect(foldIndicator).toContain('var(--worn-fold-background, var(--cockpit-bg, #f8f6f0))');
		expect(foldIndicator).toContain('var(--worn-card-dog-ear-background, var(--cockpit-bg, #f8f6f0))');
		expect(foldIndicator).toMatch(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.worn-fold-indicator \{[\s\S]*?transition: none;/u);
	});

	it('limits hover-only fold reveals to fine pointers while retaining keyboard reveals', () => {
		expect(foldIndicator).toContain(":global(.worn-folded-surface[data-fold-reveal='always']) > .worn-fold-indicator");
		expect(foldIndicator).toContain(":global(.worn-folded-surface[data-fold-reveal='hover']:focus-visible) > .worn-fold-indicator");
		expect(foldIndicator).toContain(":global(.worn-folded-surface[data-fold-reveal='hover']:focus-within) > .worn-fold-indicator");
		expect(foldIndicator).toContain(':global(a.worn-card:focus-visible) > .worn-fold-indicator');
		expectFinePointerHover(foldIndicator, ":global(.worn-folded-surface[data-fold-reveal='hover']:hover) > .worn-fold-indicator", '\n\t}');
		expectFinePointerHover(foldIndicator, ':global(a.worn-card:hover) > .worn-fold-indicator', '\n\t}');
	});

	it('keeps static panels independent from optional fold behavior', () => {
		expect(panel).not.toContain('FoldedSurface');
		expect(panel).not.toContain('dog-ear');
		expect(panel).not.toContain('data-fold-reveal');
	});

	it('gives panels explicit section and heading ownership', () => {
		expect(panel).toContain('const instanceId = $props.id();');
		expect(panel).toContain("let rootTag = $derived(labelledBy ? 'section' : 'div');");
		expect(panel).toContain('aria-labelledby={labelledBy}');
		expect(panel).toContain('let headingTag = $derived(headingTags[headingLevel]);');
		expect(panel).toContain('this={headingTag} class="worn-panel-title" id={headingId}');
	});

	it('stacks and contains panel headings, labels, and hostile body content', () => {
		expect(panel).toMatch(/\.worn-panel \{[\s\S]*?box-sizing: border-box;[\s\S]*?max-inline-size: 100%;[\s\S]*?min-inline-size: 0;[\s\S]*?overflow-wrap: anywhere;/u);
		expect(panel).toMatch(/\.worn-panel-head \{[\s\S]*?display: grid;/u);
		expect(panel).toContain(':global(.worn-panel-body > *)');
		expect(panel).toContain('var(--cockpit-surface, #ffffff)');
		expect(panel).toContain('var(--cockpit-text, #1f2f28)');
		expect(panel).toContain('var(--cockpit-text-muted, #506058)');
	});

	it('names labeled containers without imposing a heading level', () => {
		expect(container).toContain('const instanceId = $props.id();');
		expect(container).toContain("role={visibleLabel ? 'group' : undefined}");
		expect(container).toContain('aria-labelledby={labelId}');
		expect(container).toContain('id={labelId}>{visibleLabel}</span>');
		expect(container).not.toContain('data-surface-depth');
	});

	it('contains hostile container content and supplies standalone theme fallbacks', () => {
		expect(container).toMatch(/\.worn-container \{[\s\S]*?box-sizing: border-box;[\s\S]*?max-inline-size: 100%;[\s\S]*?min-inline-size: 0;[\s\S]*?overflow-wrap: anywhere;/u);
		expect(container).toContain(':global(.worn-container > *)');
		expect(container).toContain('var(--cockpit-surface, #ffffff)');
		expect(container).toContain('--worn-container-margin-block-end');
	});

	it('keeps linked cards focusable while wrapping instead of clipping content', () => {
		expect(card).toContain('<a class="worn-card"');
		expect(card).toMatch(/\.worn-card \{[\s\S]*?max-inline-size: 100%;[\s\S]*?min-inline-size: 0;[\s\S]*?overflow: visible;[\s\S]*?overflow-wrap: anywhere;/u);
		expect(card).toContain(':global(.worn-card > *)');
		expect(card).not.toContain('overflow: hidden;');
		expect(card).toContain('outline-offset: 2px;');
		expect(card).not.toContain('top: 0;');
		expect(card).not.toContain('right: 0;');
	});

	it('limits linked-card hover elevation to fine pointers while retaining focus feedback', () => {
		expect(card).toContain('a.worn-card:focus-visible {');
		expectFinePointerHover(card, 'a.worn-card:hover {', '\n\t}');
	});

	it('removes card transitions for reduced-motion users without widening hover feedback', () => {
		expect(card).toContain('@media (prefers-reduced-motion: reduce)');
		expect(card).toMatch(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?a\.worn-card \{[\s\S]*?transition: none;/u);
		expect(card).toContain('a.worn-card:focus-visible {\n\t\t\ttransform: none;');
		expect(card).toMatch(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?@media \(hover: hover\) and \(pointer: fine\) \{[\s\S]*?a\.worn-card:hover \{\s*transform: none;/u);
	});

	it('exposes both divider forms as separators and contains long labels', () => {
		expect(divider).toContain('role="separator"');
		expect(divider).toContain('aria-labelledby={labelId}');
		expect(divider).toContain('<hr class="worn-divider worn-divider-plain" />');
		expect(divider).toContain('max-inline-size: calc(100% - 40px);');
		expect(divider).toContain('overflow-wrap: anywhere;');
		expect(divider).toContain('flex: 0 1 auto;');
	});

	it('keeps the splitter focused and terminates every pointer lifecycle', () => {
		expect(resizable).toContain('handle.focus({ preventScroll: true });');
		expect(resizable).toContain('handle.setPointerCapture?.(event.pointerId);');
		expect(resizable).toContain('onpointercancel={finishPointer}');
		expect(resizable).toContain('onlostpointercapture={onLostPointerCapture}');
		expect(resizable).toContain("event.key === 'ArrowLeft'");
		expect(resizable).toContain("event.key === 'ArrowRight'");
		expect(resizable).toContain("event.key === 'Home'");
		expect(resizable).toContain("event.key === 'End'");
	});

	it('exposes a contained, theme-safe separator in both pane directions', () => {
		expect(resizable).toContain('role="separator"');
		expect(resizable).toContain('aria-controls={paneId}');
		expect(resizable).toContain('aria-valuetext={`${paneSize} pixels`}');
		expect(resizable).toContain("grid-template-areas: 'pane handle content';");
		expect(resizable).toContain("grid-template-areas: 'content handle pane';");
		expect(resizable).toContain('max-inline-size: 100%;');
		expect(resizable).toContain('minmax(0, var(--worn-resizable-pane-size))');
		expect(resizable).toContain('overflow-wrap: anywhere;');
		expect(resizable).toContain('var(--cockpit-border-strong, #b8b0a5)');
		expect(resizable).toContain('var(--cockpit-accent, #0f766e)');
		expect(resizable).toContain('inset-inline: -16px;');
		expect(resizable).toContain('@media (prefers-reduced-motion: reduce)');
	});

	it('limits splitter hover feedback to fine pointers while retaining focus and drag feedback', () => {
		expect(resizable).toContain('.worn-resizable-handle:focus-visible::after,');
		expect(resizable).toContain('.worn-resizable-handle.is-dragging::after {');
		expectFinePointerHover(resizable, '.worn-resizable-handle:hover::after {', '\n  }');
	});
});
