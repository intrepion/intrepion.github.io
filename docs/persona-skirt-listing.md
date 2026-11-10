# Persona Forge auxiliary skirt listing

Prepared November 10, 2026 from Tool Shed main `39c9cd949323a5b4a020882ab9b73a01b8f4ee2b` in an isolated checkout. The earlier validated checkout was not modified.

## Scope

Only the Persona Forge catalog entry, its regression assertions, the new comparison image and this record change. Its description, tagline and feature list come directly from the approved app's final `app.json`. All prior face features and all three earlier screenshot records remain unchanged. All other 15 application entries, 149 game entries, routes, styles, workflows, dependency files and settings are unchanged.

The new feature is an optional original A-line skirt with nine garment-only auxiliary bones and editable hem sway. It preserves the 53 body bones and four static poses. Skirt exports contain 62 total joints; trousers exports omit the optional garment and its joints. The listing explicitly says this is bone posing, not cloth simulation, and that arbitrary bone edits may clip. It preserves the earlier face, portrait, compatibility, hardware and export limitations.

## App release evidence

The publishing task confirmed the app live before this hub was published. Exact remote main `599524fb3e55d89f1d87d57394debaf5bb23aad0` passed [check-and-build and Pages deployment](https://github.com/intrepion/kata-app-inspired-by-character-creator-5-codex-dot/actions/runs/42813572579). All 54 deployed files matched the tested production build, totaling 28,883,460 bytes. The app is available at [Persona Forge](https://intrepion.github.io/kata-app-inspired-by-character-creator-5-codex-dot/).

Final app publication validation passed 83 Node checks. The runtime milestone's 82 checks are recorded in `docs/QA-SKIRT.md`; the added publication metadata test brings the final count to 83. Earlier runtime checks remain 40 hardware rig/export checks, 21 software-preview checks and 37 UI workflow checks. Independent sampled fit and actual browser-exported GLB checks, including Blender 5.2.3 bone/shape editing, are described in that app record. These are supported-static-pose and sampled-fit checks, not a proof for every animation or body-parameter combination.

## Image provenance

`persona-skirt-comparison.png` is the exact unmodified file from the app's `docs/screenshots/persona-skirt-comparison.png`: 960 × 970 pixels, 227,834 bytes, SHA-256 `73c9672bfae1c4f7e4ea4883b24eaef242bb2867e9e75299aee743c18f4b55c4`.

It was rendered in Chrome on Apple M1 hardware WebGL using `http://127.0.0.1:4194/tests/skirt.html?auto=1&capture`. Six views show neutral front/back, stride front/back, narrow build with negative sway/Hello and broad build with positive sway/T-pose. The caption identifies it as a test-only rendered comparison sheet rather than production editor UI. It is a local pre-publication capture, not a live-site browser capture; no exact per-image capture timestamp is asserted.

The new image is first in the listing and appears on the existing Tool Shed card. The face comparison and two portrait images follow unchanged. The image was reviewed only through a localhost HTTP server before incorporation.

## Gallery validation

The new skirt regression first failed against the old listing, then passed after updating the approved content. Final pre-publication validation:

- `npm run check`: zero Astro errors, warnings or hints across 26 files; both catalogs and all screenshot hashes validated.
- `npm test`: 68 tests passed.
- `npm run build`: 279 pages and 4,548 internal route, anchor and asset references validated.
- Semantic comparison confirmed the other 15 app entries, all prior Persona features and all three previous screenshot records are unchanged. Git diff checks passed.
- Browser checks used `http://127.0.0.1:4207/` only. The generated Persona detail page and Tool Shed card show the new content and correct launch/source destinations. All four gallery images loaded with their recorded dimensions. Desktop and 390-pixel viewport layouts were inspected; the narrow page had no horizontal overflow. This is a desktop-browser responsive check, not physical-device testing.
- Light/dark theme change persisted on reload and navigation; the original dark setting and default viewport were restored. Keyboard Enter opened the Persona card; browser Back/Forward returned to the expected pages.
- The original Arcade search returned Picross, showed the empty state for an unmatched query and reset correctly. Legacy root `#genres` and `#about` destinations remained present.

No browser file URLs were opened. Public HTTP/hash verification and the listing's exact-commit CI/Pages result are checked separately after publication; they do not assert new live-site browser interaction coverage.
