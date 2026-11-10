# Pixel Loom listing

Pixel Loom is the third Tool Shed app and its first graphics entry. Its `/apps/kata-app-inspired-by-aseprite-codex-dot/` page includes Aseprite inspiration credit, original app screenshots, implemented features, editable-file compatibility limits, and the need to keep project backups.

Only Pixel Loom is added in this release. Existing Sound Lab and Wave Room catalog records and all 149 games remain unchanged. The Tool Shed page description now includes graphics and animation.

## Local gallery verification

The production build was served at `http://127.0.0.1:4335/`, not a `file://` URL.

- `npm run check`: zero Astro errors, warnings, or hints; catalog and screenshot validators passed.
- `npm test`: 47 passing tests, including graphics identity, scope limits, screenshot hashes, and existing app/game regressions.
- `npm run build`: 266 pages; generated route, image, anchor, and heading checks passed.
- Browser: Home → Tool Shed → Pixel Loom, Back/Forward, full-resolution screenshot link and Back all worked.
- Both catalog images loaded with their correct intrinsic sizes. The desktop detail page and both themes were visually reviewed.
- Responsive detail-page checks at 390 and 320 CSS pixels found no horizontal overflow. This is browser viewport emulation, not a physical-phone test.
- Theme preference persisted after reload. Keyboard Tab exposed the skip link with a visible 3px focus outline. No browser-console errors appeared during these gallery checks.

## Image provenance

Images were copied unchanged from the app’s `app.json` manifest and visually reviewed. They show the original Mosslight cottage demo with three layers and four frames, captured from `http://127.0.0.1:4173/` before publication. They do not claim exact deployed-build provenance.

- Desktop: 1165 × 961 pixels, captured `2026-11-10T00:48:18.480564+00:00`, SHA-256 `08a36f94fea78d182e31870244a3c19e3e0d970e8d3bf25083668a5ee2ffa6fc`.
- Responsive: 500 CSS-pixel-wide viewport; 485 × 1417 image pixels, captured `2026-11-10T00:48:18.482180+00:00`, SHA-256 `2d5e2be3238eb505f8dca05b9d6abfe4f1b968d0b5643026a26638017130dddd`.

## Publication

The user approved publishing Pixel Loom and its listing. The app’s final main commit is `e95dd05be59ab83a4e8c0af4761933cc812e3e7e`; [checks and Pages deployment](https://github.com/intrepion/kata-app-inspired-by-aseprite-codex-dot/actions/runs/42732061963) completed successfully. Its [public app](https://intrepion.github.io/kata-app-inspired-by-aseprite-codex-dot/) and [repository](https://github.com/intrepion/kata-app-inspired-by-aseprite-codex-dot) were verified on November 10, 2026 UTC. The initial release returned HTTP 200 and all six served app files matched the tested build. The final release changes only metadata and QA notes, not runtime assets.

The app passed 15 automated tests and local HTTP browser workflows, including downloaded PNG/frame-sheet exports, editable JSON round-trip, PNG import, drawing, undo/redo, layers, animation, responsive layout, and autosave reload. See the app’s `docs/TESTING.md` for detailed scope and limitations. The catalog is now marked live with these matching public links. Screenshot evidence remains separate from deployment verification.

The final localhost listing’s launch link was clicked through to the public app in Chrome. The original demo rendered correctly; animation changed to Playing, advanced from frame 1 to frame 2, and paused successfully with no console errors.
