# Persona Forge and Kinframe listing refresh

Verified November 10, 2026. Only these two app listings, their reviewed captures, and relevant regression tests changed. The other 11 app listings and all 149 game listings remain unchanged.

## App releases

- Persona Forge: commit `2e26ad7bcb5721adcb191f8db5c96273b84dac7f`; [checks and Pages deployment](https://github.com/intrepion/kata-app-inspired-by-character-creator-5-codex-dot/actions/runs/42760407167) succeeded. Public source assets matched the tested tree, and live body/face views were browser-verified. The app's revision QA records 17 Node tests and 19 browser assertions passing. WebGL/GPU execution remains unverified; the software depth-buffer renderer was tested.
- Kinframe: commit `4d2e94fa76dfaeb02b1745085d25fee6dc075b42`; [checks and Pages deployment](https://github.com/intrepion/kata-app-inspired-by-maya-codex-dot/actions/runs/42760341280) succeeded. Public index, model, app and CSS bytes matched the tested build. The revised 13-key wave, 97-key profile walk and playback were verified live. Local revision QA records 16 model tests and 31 browser assertions passing. Existing autosaves intentionally remain unchanged; choose Little steps or Hello, world to load revised presets.

## Capture provenance

Copies preserve the app repositories' original image bytes. Exact hashes, dimensions, alt text and provenance are recorded in `src/data/apps.json` and validated by tests.

- Persona Forge: `docs/screenshots/anatomy-desktop.jpg` (1180 × 763) and `anatomy-face.jpg` (1165 × 753). Genuine local Chromium viewport captures at `http://127.0.0.1:4186/`, documented in the app's `docs/QA-ANATOMY.md`. They replace the earlier body/narrow previews.
- Kinframe: `docs/screenshots/motion-review.jpg` (1165 × 841). Genuine local Chromium capture at `http://127.0.0.1:4313/tests/motion.html`, documented in the app's `docs/QA.md`. This is explicitly labeled as a test-only pose sheet with eight actual app-rendered phases, not the production editor UI. It replaces the older motion previews.

These are local pre-publication captures, not exact deployed-build capture claims. Old capture assets remain in the repository but are no longer referenced by these listings.

## Hub verification

- `npm run check`: 26 Astro files; zero errors, warnings or hints. All app and game catalog/screenshot checks passed.
- `npm test`: 60 tests passed.
- `npm run build`: 276 generated pages and 4,490 internal route, anchor and asset references passed validation.
- Both revised detail pages were browser-reviewed through a Python HTTP server bound to `127.0.0.1:4392`. All three images loaded at their recorded natural dimensions.
- Desktop screenshot layouts and 390 CSS-pixel-wide app iframes were visually reviewed. Each iframe's document width and scroll width matched at 375 pixels after the scrollbar; no horizontal overflow was observed. These are not physical-device tests.
- Tool Shed detail navigation, Back/Forward, and dark-theme persistence through reload passed. No direct file URLs were used.

Dependency installation used a writable temporary npm cache. Astro telemetry was disabled and its config directory redirected to a writable temporary path for this restricted executor. No dependency or lockfile changes were made.
