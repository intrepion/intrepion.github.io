# Persona Forge regional skin listing

Prepared from Tool Shed main `082ac2d` in an isolated worktree for the user-approved publication.

## Scope

The Persona description and features match the approved app manifest. One reviewed skin screenshot is prepended, all six previous Persona screenshot records are preserved, and all 16 other apps and all 149 games are unchanged. No routes, styles, dependencies or workflows change.

The listing states the export limitation explicitly: region-aware PBR textures transfer, but the browser thin-tissue backlight shader does not become Blender subsurface scattering. This is an incremental realism improvement, not a fully photorealistic scan.

## Reviewed screenshot

`persona-skin-closeup.png` is copied unmodified from the app repository: 1120 × 1510 pixels, SHA-256 `c0c87928a465df7409de9986af9fea5a4389938974e2bff8d8b624a31f6c9c4c`. It compares the original and new materials with the same face, camera and lighting. Chrome captured it over `http://127.0.0.1:4194/tests/skin.html?auto&capture` using Apple M1 hardware WebGL. It is a test-only rendered comparison sheet, not production editor UI or a public-site browser capture.

## Validation

The strict catalog checks passed with zero Astro errors, warnings or hints across 26 files. All 75 existing/new tests passed before adding the exact-publication assertion. The built listing and lead image were visually reviewed through localhost HTTP, with no console errors. The final production build contains 280 pages and passes validation of 4,572 local route, anchor and asset references. Browser work used localhost only; live verification below uses HTTP file checks.

## Confirmed app release

Regional skin release d689681b16eddbd461946f270baded35166d1516 (implementation 7c3970a) passed 109 local checks, production build, GitHub check-and-build and Pages deployment at https://github.com/intrepion/kata-app-inspired-by-character-creator-5-codex-dot/actions/runs/42922954421 . At 2026-11-10T23:25:47.625870+00:00, all 72 deployed files returned HTTP 200 and SHA-256 byte-matched the tested build (50,217,037 bytes total); the root launch page also matched. This verifies deployed file identity, not new public-browser interactions. Local Mac M1 hardware WebGL covered eighteen matched material/angle/light views, actual exported-GLB reimport comparisons and 99 expression UI checks. Blender 5.2.3 verified exact decoded skin texture pixels and retained editable bones, expression, blink and gaze targets. The new first screenshot is an unmodified localhost test-only comparison sheet. This remains an incremental realism pass, not a fully photorealistic scan; only the PBR textures transfer to GLB, not the browser backlight shader. See docs/QA-SKIN.md in the app repository.
