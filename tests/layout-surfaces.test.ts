import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { compile } from 'svelte/compiler';

const read = (name: string) => readFileSync(new URL(`../src/${name}.svelte`, import.meta.url), 'utf8');
const container = read('Container');
const card = read('Card');
const divider = read('Divider');
const panel = read('Panel');
const resizable = read('Resizable');

describe('@wornpage/layout-surfaces', () => {
	it('declares one source-delivered v2 package', () => {
		const pkg = require('../package.json');
		expect(pkg.name).toBe('@wornpage/layout-surfaces');
		expect(pkg.version).toBe('0.1.2');
		expect(pkg.wornpage).toEqual({ contractVersion: 2, delivery: 'source' });
		expect(pkg.main).toBe('./src/index.ts');
		expect(pkg.files).not.toContain('dist');
	});

	it('exports and compiles every layout surface without warnings', async () => {
		const mod = await import('../src/index.ts');
		expect(Object.keys(mod).sort()).toEqual(['Card', 'Container', 'Divider', 'Panel', 'Resizable']);
		for (const [name, source] of Object.entries({ Card: card, Container: container, Divider: divider, Panel: panel, Resizable: resizable })) {
			const result = compile(source, { filename: `${name}.svelte`, generate: 'client' });
			expect(result.warnings).toHaveLength(0);
		}
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
		expect(card).toContain('top: 0;');
		expect(card).toContain('right: 0;');
		expect(card).toMatch(/\.worn-card::after \{[\s\S]*?box-sizing: border-box;/u);
		expect(card).not.toContain('right: -1px;');
	});

	it('removes all card transitions for reduced-motion users', () => {
		expect(card).toContain('@media (prefers-reduced-motion: reduce)');
		expect(card).toMatch(/a\.worn-card,\s*\.worn-card::after \{\s*transition: none;/u);
		expect(card).toMatch(/a\.worn-card:hover,\s*a\.worn-card:focus-visible \{\s*transform: none;/u);
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
});
