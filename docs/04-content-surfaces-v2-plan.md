# Plan 4: Content Surfaces V2 - Typography and List Polish

## Goal

Polish the rough edges across content surfaces after the homepage motion and Header V2 work.

This round focuses on typography, card rhythm, list density, tags, updates, search results, and mobile readability. It should make the site feel more like a durable personal knowledge and project archive, without changing the content model, routes, publishing workflow, or homepage animation system.

## Current Issues

- Heading sizes feel dramatic in some places and cramped in others.
- Several headings use viewport-scaled font sizes, which makes type feel less controlled across widths.
- Entry cards are readable but still generic: title, summary, dates, and tags do not have enough hierarchy.
- List pages are visually flat and need a clearer surface boundary.
- Tags and meta pills are functional but slightly heavy.
- Search results and update cards should share more of the same visual language as EntryCard.
- Mobile layouts need better density without shrinking touch targets.

## Design Direction

Keywords:

- editorial lab archive
- quieter hierarchy
- stable type scale
- denser scanning
- restrained surfaces

The polish should feel precise, not decorative. Use subtle contrast, spacing, and typography before adding more glow or animation.

## Scope

Target files:

- `src/components/EntryCard.astro`
- `src/styles/global.css`

Optional files:

- page files only if a semantic wrapper is needed
- no content collection schema changes
- no route changes
- no new animation library

## Implementation Notes

- Replace viewport-driven heading font sizes with stable rem sizes and existing media breakpoints.
- Improve base text rendering, line height, and font weight hierarchy.
- Give EntryCard a clearer internal structure: text block, description, and footer meta.
- Make cards slightly denser but more refined.
- Keep featured homepage cards as vertical strips in a horizontal scroll rail.
- Use temporary Chinese placeholder projects to validate the multi-card rail rhythm.
- Tune the homepage project rail to show roughly 3.5 cards with hidden scrollbars and side fade hints.
- Add a subtle top edge to list surfaces.
- Align update cards, tag cloud, and search results with the same surface language.
- Keep hover states light and avoid layout shift.
- Keep mobile controls at comfortable touch sizes.

## Verification

Run:

```sh
npm run build
```

Then check:

- `/`
- `/posts`
- `/projects`
- `/updates`
- `/tags`
- `/search`
- `/en/`
- mobile width around 390px

## Acceptance Criteria

- Build passes.
- Typography feels more stable and less rough across desktop and mobile.
- Entry cards are easier to scan.
- List pages have clearer rhythm without feeling card-heavy.
- Tags, updates, and search results feel related to the card system.
- No publishing or routing behavior changes.
