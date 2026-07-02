# Plan 7: Dependency Size Audit and Cleanup

## Goal

Document the dependency and bundle-size findings from the July 2, 2026 audit, and record the changes made to reduce unnecessary client-side JavaScript and tighten dependency versions.

## Initial Findings

The site source was small, but dependency and generated assets dominated the project size.

Observed before changes:

- `node_modules`: `236.01 MiB`
- `dist`: `3.23 MiB`
- `.git`: `1.74 MiB`
- Source/content/config files excluding `node_modules`, `.git`, `dist`, and `.astro`: about `151.6 KiB`
- Direct dependencies: `5`
- Locked packages under `node_modules`: `487`
- `package-lock.json`: about `237.7 KiB`

Direct dependencies before changes:

- `@astrojs/mdx@6.0.2`
- `astro@6.4.4`
- `fuse.js@7.4.2`
- `mermaid@11.15.0`
- `typescript@6.0.3`

Largest installed dependency areas before changes:

- `mermaid`: `72.81 MiB`
- `typescript`: `23.22 MiB`
- `@img/*` optional Sharp platform packages: `19.04 MiB`
- `@mermaid-js/*`: `10.95 MiB`
- `@esbuild/*`: `10.86 MiB`

## Main Issue

`src/layouts/BaseLayout.astro` imported Mermaid at the top level of the layout script:

```js
import mermaid from 'mermaid';
```

That made every page load the Mermaid entry chunk, even when the page had no Mermaid diagrams. Only three MDX files contained Mermaid code blocks at the time of the audit:

- `src/content/posts/zh/engineering-architecture-overview.mdx`
- `src/content/projects/zh/project-notes-starter.mdx`
- `src/content/projects/en/project-notes-starter.mdx`

Before changes, the generated `BaseLayout` client script was about `597.8 KiB` raw and `146.1 KiB` gzip.

## Security Findings

`npm audit` initially reported three vulnerability groups:

- `astro`: high severity group, fixed by upgrading Astro
- `dompurify`: moderate severity, pulled through Mermaid
- `esbuild`: low severity, pulled through Astro/Vite

The project also used `"latest"` for `astro`, `@astrojs/mdx`, and `typescript`, which made fresh installs less predictable when lockfile behavior changed.

## Changes Made

### Mermaid lazy loading

`src/layouts/BaseLayout.astro` now checks for Mermaid code blocks first. It only imports Mermaid when the page contains `pre[data-language="mermaid"]`.

The Mermaid module promise is cached, so client-side route changes can reuse the loaded module after the first diagram page.

### Dependency version pinning

`package.json` now pins direct runtime dependencies:

- `@astrojs/mdx`: `7.0.1`
- `astro`: `7.0.5`
- `fuse.js`: `7.4.2`
- `mermaid`: `11.16.0`

`typescript` was moved to `devDependencies` and pinned to `6.0.3`.

### Lockfile refresh and audit fix

`npm install` refreshed `package-lock.json`.

`npm audit fix` updated the remaining vulnerable transitive dependency, clearing the DOMPurify audit item.

## Verification

Commands run:

```sh
npm run build
npm audit --json
npm prune
```

Browser checks were also run against `astro preview` at `http://127.0.0.1:4321/`.

Runtime checks:

- A non-diagram article page did not load Mermaid, Cytoscape, or KaTeX resources.
- A Mermaid article page rendered the Mermaid code block into an SVG.
- The Mermaid pending marker was removed after render.
- Browser console had no warnings or errors during the checked flow.

Build result after changes:

- Build passed
- Static pages built: `53`
- Observed build time: about `1.82s`
- `npm audit`: `0 vulnerabilities`

## Size After Changes

Observed after changes:

- `node_modules`: `289.46 MiB`
- `dist`: `3.44 MiB`
- Direct runtime dependencies: `4`
- Direct dev dependencies: `1`
- Locked packages under `node_modules`: `518`
- Optional packages: `106`

Generated asset totals after changes:

- JS raw: `3,428,789 bytes`
- JS gzip: `963,967 bytes`
- Total `dist` raw: `3,611,724 bytes`
- Total `dist` gzip: `1,041,657 bytes`
- Total `dist` brotli: `881,802 bytes`

Key client script improvement:

- `BaseLayout` client script after changes: `4.8 KiB` raw, about `2.2 KiB` gzip
- `SearchPage` script: `27.2 KiB` raw, about `9.9 KiB` gzip
- `HeroField` script: `5.5 KiB` raw, about `2.4 KiB` gzip
- `ClientRouter` script: `15.7 KiB` raw, about `5.5 KiB` gzip

## Tradeoff

The main user-facing win is that pages without diagrams no longer pay the Mermaid runtime cost.

The main local-development cost is that upgrading to Astro 7 increased `node_modules` size from `236.01 MiB` to `289.46 MiB`. The increase comes mostly from newer optional native/wasm platform packages in the Astro/Vite/Rolldown dependency graph.

This is acceptable for now because:

- `npm audit` is clean.
- Public non-diagram pages now ship much less layout JavaScript.
- Runtime behavior was verified in the browser.

## Future Options

1. Test `astro@6.4.6` with `@astrojs/mdx@6.0.2` as a lower-risk patch-line alternative if local dependency size matters more than moving to Astro 7.
2. Render Mermaid diagrams at build time into SVG/HTML to remove Mermaid from the client bundle entirely.
3. Keep `package.json` pinned unless there is a deliberate upgrade task.
4. Add a lightweight bundle-size check to future maintenance work so Mermaid or other heavy libraries do not return to global layout scripts.
