# @wornpage/layout-surfaces

Compact Svelte 5 panels, containers, cards, folded surfaces, dividers, and resizable panes with named structure,
hostile-content containment, visible focus, reduced-motion support, and
standalone theme fallbacks.

<!-- wornpage-delivery:v2 source -->
## Delivery

`src/` is the canonical implementation and published runtime. This package is source-only; it does not ship a generated `dist/` directory.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Install

```sh
bun add @wornpage/layout-surfaces
```

## Usage

```svelte
<script>
  import { Card, Container, Divider, FoldedSurface, Panel, Resizable } from '@wornpage/layout-surfaces';
</script>

<Panel sectionLabel="Delivery" heading="Launch readiness" headingLevel={2}>
  <p>3 checks remaining.</p>
</Panel>

<Container label="Release" variant="tinted">
  <p>Version 2.4 is ready.</p>
</Container>

<Card href="/work">
  <strong>Acme migration</strong>
  <p>Review due Friday.</p>
</Card>

<FoldedSurface as="section" reveal="hover" aria-label="Project status">
  <p>Ready for review.</p>
</FoldedSurface>

<Divider label="Later" />

<Resizable initialSize={180} label="Resize backlog pane">
  <p>Backlog</p>
  {#snippet content()}<p>In progress</p>{/snippet}
</Resizable>
```

## Container

A labeled Container exposes an accessible group named by its visible label. It
does not impose a heading level, so it can be nested under the consumer's real
document hierarchy. Unlabeled containers remain presentational.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | none | Visible and accessible group label |
| `variant` | `surface \| tinted \| bare \| dashed` | `surface` | Visual treatment |
| `borderless` | `boolean` | `false` | Remove border, padding, and background |

Slot: `children` (required content).

## Panel

Panel is a static section surface for grouped content. A heading names the
section, and `headingLevel` lets the consumer preserve its document hierarchy.
Labels, headings, and body content wrap without widening compact layouts.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `heading` | `string` | none | Visible heading and accessible section name |
| `sectionLabel` | `string` | none | Short visible label above the heading |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | `2` | Native heading level |

Slot: `children` (optional content).

## FoldedSurface

FoldedSurface preserves the consumer's semantic root while owning the optional
paper-fold treatment. Use it when the fold belongs to the surface itself;
static `Panel` remains unchanged and does not gain hover behavior implicitly.
The fold is decorative, ignores pointer input, uses logical corner properties,
and removes its opacity transition for reduced-motion users.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `div \| section \| article` | `div` | Semantic root element |
| `reveal` | `hover \| always \| hidden` | `hover` | Fold visibility behavior |

Slot: `children` (optional content). Native attributes, ARIA attributes, and
consumer classes are forwarded to the root.

## Card

Card renders an anchor when `href` is present and a neutral `div` otherwise.
Linked cards retain native link behavior and visible focus. Content wraps
inside the card instead of being clipped.

Stable border and shadow feedback does not move the linked Card on keyboard
focus or fine-pointer hover. Reduced motion disables those transitions.

Linked-card focus uses `--worn-card-focus`, then `--cockpit-focus`,
`--cockpit-text`, and `currentColor` as progressively broader fallbacks.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | none | Render as a native link |
| `padded` | `boolean` | `true` | Apply the default inner padding |

Slot: `children` (optional content).

## Divider

Both plain and labeled dividers expose horizontal separator semantics. A long
visible label wraps between the rules without widening its parent.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | none | Optional visible separator label |

## Resizable

Resizable is a two-pane layout with a native ARIA separator contract. Pointer
interaction focuses the separator, uses pointer capture, and clears on pointer
up or cancellation. Arrow keys resize one step, while Home and End move to the
declared bounds. The rail remains visible without hover and exposes a wider
coarse-pointer hit area without widening the layout.

Sizes snap to 20-pixel increments in the supported 100-800 pixel range. Grid
tracks can still shrink in a compact parent so neither pane widens the page.
`side="end"` places the resizable pane at the visual end and reverses the arrow
direction accordingly.

Separator focus uses `--worn-resizable-focus`, then `--cockpit-focus`,
`--cockpit-text`, and `currentColor` as progressively broader fallbacks.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialSize` | `number` | `280` | Initial pane width, snapped and clamped |
| `minSize` | `number` | `180` | Minimum pane width |
| `maxSize` | `number` | `480` | Maximum pane width |
| `side` | `start \| end` | `start` | Visual side occupied by the resizable pane |
| `label` | `string` | `Resize pane` | Accessible separator label |

Slots: `children` (resizable pane), `content` (remaining pane).

## Theme tokens

The components consume the existing `--cockpit-*` tokens with complete light
fallbacks. Package-specific overrides use the `--worn-container-*`,
`--worn-panel-*`, `--worn-card-*`, `--worn-fold-*`, `--worn-divider-*`, and
`--worn-resizable-*` prefixes. Outer spacing remains
explicitly tokenized through `--worn-container-margin-block-end` and
`--worn-divider-margin-block` so a parent layout can set either to `0`.
