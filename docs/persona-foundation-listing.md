# Persona Forge human foundation listing

Prepared November 10, 2026. Only the Persona Forge app catalog entry, its two new captures, relevant regression tests and this record changed. Other app and game listings are unchanged.

## Scope and evidence

The version-2 foundation replaces the old procedural figure with one CC0 MakeHuman/MPFB anatomical adult. The listing now describes the 2048px skin and 1024px eye textures, weighted 53-bone skeleton, ten morph targets, five paired shape controls and overall height, four bone-driven static poses, separate fitted outfit and optional solid cropped hair, and textured rigged GLB export.

It explicitly distinguishes static poses from animation, approximate version-1 migration from original geometry preservation, and the visually tested same-human software preview from unverified hardware WebGL. It does not claim Character Creator parity, photoreal production quality, cloth simulation, strand hair, a facial rig or a demographic library.

App runtime `e4bcb71a217f293876c03c95ab98d7e09e81d02d` passed 31 Node tests, 20 browser harness checks, 13 runtime exporter checks and production build. An exact UI-exported GLB passed eleven Blender 4.3.2 roundtrip checks and Khronos validation with zero errors, four documented warnings and two informational notices. These app results are recorded in the app's `docs/QA-FOUNDATION.md`, `docs/BLENDER-ROUNDTRIP.json` and `docs/GLTF-VALIDATION.json`. Asset licensing is recorded in `docs/ASSET-LICENSES.md`.

## Capture provenance

The original `docs/screenshots/persona-foundation-desktop.png` and `persona-foundation-face.png` were genuine Chromium localhost HTTP captures at `http://127.0.0.1:4186/`, not generated mockups. Both show the same-human software preview. Their pixels were reviewed before use.

Both original files contain JPEG bytes despite their `.png` names. The gallery preserves the exact bytes under the correct `.jpg` extensions; each is 1165 × 753. Hashes, dimensions, original filenames and this correction are recorded in `src/data/apps.json` and covered by the screenshot tests. They are local pre-publication captures, not exact deployed-build screenshot claims. Previous screenshots remain available as historical assets but are no longer referenced by the listing.

## Gallery verification

- `npm run check`: 26 Astro files; zero errors, warnings or hints. All catalog and screenshot validation passed.
- `npm test`: all 62 tests passed, including actual JPEG signatures, dimensions and screenshot hashes.
- `npm run build`: 276 pages and 4,490 internal route, anchor and asset references passed.
- Local production page reviewed in Chromium over `http://127.0.0.1:4394/`. Both screenshots loaded at their recorded 1165 × 753 dimensions and the desktop two-column image layout was visually reviewed.
- Detail-to-Tool Shed navigation, Back/Forward and dark-theme persistence through reload passed. A 375px desktop-browser iframe had matching 360px document and scroll widths after the scrollbar, with no horizontal overflow. This is not a physical-device test.
- No dependencies or lockfiles changed.

## Verified app publication

The publishing task verified runtime `e4bcb71a217f293876c03c95ab98d7e09e81d02d` on remote main. [GitHub Actions run 42769111188](https://github.com/intrepion/kata-app-inspired-by-character-creator-5-codex-dot/actions/runs/42769111188) completed both check-and-build and Pages deployment successfully. Live `index.html`, `src/human-renderer.js` and the 6,667,684-byte `assets/human/foundation.glb` byte-match the tested local production build. This records publication and byte identity, not a new live-browser interaction claim.

This record was prepared before Tool Shed publication. Consult the repository’s GitHub Actions history for the deployment status of the listing commit.
