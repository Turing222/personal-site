# Plan 5: LXGW WenKai GB Site Typography

## Goal

Replace the previous Inter / Noto Sans SC stack with **LXGW WenKai GB** for the public site, while keeping code blocks readable in a monospace face.

## Why this font

- OFL 1.1, free for commercial use
- Softer reading feel than the old sans stack
- Works for both Chinese and English body copy
- Web delivery via split WOFF2 packages keeps first-load size manageable

## Scope

Target files:

- `src/layouts/BaseLayout.astro`
- `src/layouts/ContentLayout.astro`
- `src/styles/global.css`

Out of scope for this plan:

- Cover images / per-project themes
- Fluid page-width layout changes
- EntryCard structure or homepage card strip behavior

## Implementation

1. Load `lxgw-wenkai-gb-web@1.522.0` Regular split CSS from jsDelivr in `BaseLayout`.
2. Set site `--font-body` to `'LXGW WenKai GB'` with system fallbacks.
3. Keep `--font-mono` for `.prose code`, `.prose pre`, and Shiki `pre.astro-code`.
4. Normalize non-standard font weights (`850`, `800`, `760`) to `700` / `600` / `500`.
5. Add `lang` on article shells for mixed zh/en content pages.

## Verification

```sh
npm run build
```

Then check:

- `/`
- `/posts/engineering-architecture-overview/`
- `/en/posts/first-engineering-note/`

Confirm:

- Body text renders as WenKai when WOFF2 loads
- Code blocks stay monospace
- Build passes

## Acceptance Criteria

- Build passes
- WenKai loads from CDN without blocking layout
- Code blocks do not inherit the kai face
- No Google Fonts dependency for site body text
