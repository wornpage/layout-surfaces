# @wornpage/layout-surfaces

Compact Svelte 5 panels, containers, cards, and dividers with named structure,
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
  import { Card, Container, Divider, Panel } from '@wornpage/layout-surfaces';
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

<Divider label="Later" />
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

## Card

Card renders an anchor when `href` is present and a neutral `div` otherwise.
Linked cards retain native link behavior and visible focus. Content wraps
inside the card instead of being clipped.

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

## Theme tokens

The components consume the existing `--cockpit-*` tokens with complete light
fallbacks. Package-specific overrides use the `--worn-container-*`,
`--worn-panel-*`, `--worn-card-*`, and `--worn-divider-*` prefixes. Outer spacing remains
explicitly tokenized through `--worn-container-margin-block-end` and
`--worn-divider-margin-block` so a parent layout can set either to `0`.
