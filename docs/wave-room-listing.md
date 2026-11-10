# Kata Wave Room listing

Kata Wave Room is the second app in the Tool Shed. It has its own Audacity attribution, single-clip scope note, and detail route at `/apps/kata-app-inspired-by-audacity-codex-dot/`. Kata Sound Lab keeps its jsfxr credit and settings-compatibility note. The shared template now reads these notes from each app’s catalog record.

## Local verification

The production build was served at `http://127.0.0.1:4334/`; no `file://` URLs were used.

- `npm run check` passed with zero Astro errors, warnings, or hints.
- `npm test` passed all 45 tests.
- `npm run build` generated 265 pages and validated all internal route, asset, and anchor references.
- Desktop review and responsive checks at 390 and 320 CSS pixels found no horizontal overflow on the new detail route or Tool Shed listing. These are browser viewport tests, not physical-device tests.
- Home → Tool Shed → Wave Room, Back/Forward, and the existing Sound Lab detail route worked. Both apps displayed their own title and attribution.
- Light theme persisted after reload and through navigation. The initial dark-theme layout was also reviewed.
- Keyboard Tab focused the skip link with a visible 3px outline.
- Arcade regression: Morrow Garden search opened the correct game; Back restored the query; unmatched search displayed the empty state; Clear restored search focus.
- The legacy `/#genres` route still reached all 12 genre links.

## Release boundary

The user approved publication. The app’s final commit `7daf800fbd3799a3a701549fcc9786b909bd1368` passed [checks and Pages deployment](https://github.com/intrepion/kata-app-inspired-by-audacity-codex-dot/actions/runs/42726970027). Its published JavaScript hash matched the final source; a live browser trim from 12 seconds to 6 seconds and Undo were verified. Only then was the catalog prepared as `live` with matching source and launch links.

The app passed 32 automated tests and its build. Browser file import was blocked by the extension’s local-file permission, and native download completion was not independently verified. The app’s [QA record](https://github.com/intrepion/kata-app-inspired-by-audacity-codex-dot/blob/main/docs/QA.md) preserves these limits; the catalog does not claim full end-to-end import/export verification.

## Screenshot provenance

Two original, unedited Chrome full-page screenshots from `http://127.0.0.1:4174/` were reviewed and copied with hashes intact. They predate the final selection/playback edge-case fixes and are labeled as local captures, not exact deployed-build evidence.

- Desktop: `2026-11-10T00:07:53.637326+00:00`, 1133 × 1203 pixels, SHA-256 `8df4ac233ea6b532fc7dfcac7b1971d5896020b8e0d682df3237f0cd02066d1f`.
- Narrow layout: `2026-11-10T00:08:11.462202+00:00`, 390 × 844 CSS-pixel viewport, 375 × 1536 screenshot pixels, SHA-256 `f9afbaf0ca04e41300b99665c0eefa2eacec202c2c07e5f28c9f71108e644e56`. This is browser emulation, not a physical-device test.

The catalog validator checks the copied image hashes. The final detail page was reviewed with both images loaded over localhost HTTP.
