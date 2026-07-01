# Plan 6: Fluid Layout and Homepage Card Strip

## Goal

Make the site scale more smoothly across viewport widths while keeping the homepage featured-project cards at a fixed size with hidden horizontal scrolling.

## Scope

Target files:

- `src/styles/global.css`
- `src/components/EntryCard.astro`
- `src/components/HeroField.astro`
- `src/layouts/BaseLayout.astro`
- `src/pages/index.astro`
- `src/pages/en/index.astro`

Related plan:

- `docs/04-content-surfaces-v2-plan.md` for EntryCard hierarchy and surface polish

## Implementation

1. Replace fixed `1120px` shells with fluid `--page-width` / `--content-width` tokens using `clamp()` and `vw`.
2. Use fluid typography tokens for hero, page titles, section headings, and prose body text.
3. Restore homepage `.card-grid` as a horizontal strip with fixed `300 x 520` cards and hidden scrollbars.
4. Show all published projects in the homepage featured strip instead of only `featured: true` items.
5. Soften HeroField edge falloff and keep section dots anchored on the right rail.

## Verification

```sh
npm run build
```

Check `/`, `/projects`, and a post detail page at desktop, tablet, and ~390px widths.

## Acceptance Criteria

- Build passes
- Page width and type scale change continuously when resizing
- Featured cards keep fixed dimensions and scroll horizontally without visible scrollbars
- EntryCard markup exposes clearer copy/meta structure
