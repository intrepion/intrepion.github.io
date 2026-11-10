# Persona Forge blink and gaze listing

Prepared November 10, 2026 from Tool Shed main `c2e586dedaef797a6ef42a3c18c4db9a1ff66d7b` in an isolated checkout.

## Scope

Only Persona metadata, its regression tests, the new comparison PNG and this record change. Description and features match the final app.json. All other 15 app entries, all four previous Persona screenshot records and historical verification evidence remain intact. No routes, styles, workflows, settings or dependencies change.

The listing identifies eye-only morph posing, not a production facial rig. It preserves the limits on mouth expressions, lip-sync, automatic blinking, extreme-identity eyelid appearance and saved-identity export fitting.

## Confirmed app publication

Release `7f578afa16a1e0bf89280e2739077a1bae784806`, implementation `4ecfb22`, passed [check-and-build and Pages deployment](https://github.com/intrepion/kata-app-inspired-by-character-creator-5-codex-dot/actions/runs/42826109720). Final local validation passed 96 tests and production build.

The publishing task's independent public HTTP comparison at `2026-11-10T13:38:11.188730+00:00` verified 12 selected files against dist, all HTTP 200 with matching SHA-256. These include index, app.json, styles, six runtime modules, the foundation GLB, comparison PNG and asset-license record. This is sampled file verification, not an audit of every deployed file or live UI interaction. The unchanged foundation is 23,020,472 bytes, SHA-256 `642dc95643eca689266fce489bc87ac65377529af77c2e522c0326d87a9d79ab`.

Local app QA, including hardware WebGL, CPU fallback, 94 browser-control assertions and Blender 5.2.3 reimport/editability checks, is described in the app's docs/QA-BLINK-GAZE.md. Visual browser inspection was localhost only.

## Screenshot provenance

The unmodified docs/screenshots/persona-blink-gaze.png from the app is first in the gallery. It is 1320 × 1820 pixels, 1,130,998 bytes, SHA-256 `d30ab85edd29f36c9ee7ba6c12aaf8263f8ff036de767d32bd1068febf94c189`.

The nine-view sheet was captured through Chrome localhost HTTP at http://127.0.0.1:4192/tests/blink-gaze.html?auto&capture on Apple M1 hardware WebGL. It shows neutral, closed, wink, half-blink, profile and gaze views. The caption explicitly identifies a test-only rendered comparison sheet, not production editor UI. The retained image was visually reviewed through a separate localhost HTTP image URL before this listing commit. No file URLs were opened.

## Gallery validation

The preceding metadata change passed npm run check with zero errors, warnings or hints across 26 Astro files; all 69 tests; and npm run build with 279 pages and 4,550 internal references. After adding publication evidence, the complete checks, tests and build were rerun. The final test count is 70. Semantic comparison verified that other apps and earlier screenshot metadata remain unchanged. No new gallery layout or public-site browser interaction coverage is claimed.

This commit is prepared locally. Tool Shed publication and its exact-commit CI/Pages verification are separate steps.
