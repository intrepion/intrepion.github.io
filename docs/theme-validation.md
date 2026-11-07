# Theme consistency validation

Validated locally on November 7, 2026. No publishing or deployment was performed.

## Changes

- Shared semantic light/dark palette for page, cards, headings, muted copy, hero artwork background, panels, buttons, tags, search controls, placeholders, hover states, and focus rings.
- Fixed the dark-mode skip link's pale-on-white text. The permanently dark hero keeps a contrasting keyboard focus indicator in either theme.
- Browser controls and theme-color metadata now match the selected mode.
- One pre-paint controller handles saved choices, the system preference, repeated toggles, cross-tab updates, and restored history pages. A CSS system-theme fallback also works without JavaScript.
- Existing layouts, warm geometric artwork, screenshots, catalog data, and game URLs are preserved.

## Automated checks

- `npm run check`: Astro diagnostics, catalog validation, and all 149 playable games' screenshot coverage.
- `npm test`: 33 passing tests, including 11 theme regressions covering initial system/saved preference, live system changes, repeated toggles, storage failures, cross-tab/history updates, fallback palette parity, semantic text/controls, and focus contrast.
- `npm run build`: all 261 static pages generated.

## Browser checks

Used Chrome through CUA with local HTTP development (`127.0.0.1:4327`) and production-preview (`127.0.0.1:4328`) servers. The final production build was checked at 1280×900, 390×844, and 320×700 in both light and dark modes on:

- `/`
- `/genres/puzzle/`
- `/inspirations/picross/`
- `/games/kata-inspired-by-picross-codex-dot/`

All 24 production combinations had a matching CSS color scheme, no document-level horizontal overflow, and no failures in the rendered text-contrast audit (4.5:1 for ordinary text, 3:1 for large text). The audit sampled rendered text against opaque CSS ancestor backgrounds; this is focused regression coverage, not a complete accessibility certification. Artwork and screenshots were not recolored or treated as UI text.

Also verified theme persistence after reload, synchronization between two tabs, Back restoration after a theme change in another tab, keyboard access to the visible dark-mode skip link, home search results, no-match messaging, and resetting search. System-change and blocked-storage behavior were tested using a deterministic controller harness; browser media/no-JavaScript emulation was not part of the browser coverage.
