# Persona Forge refined hair listing

Prepared from Tool Shed main `9e0f22917892bbd8382f3ef9e34509e76c8b23ec` in an isolated worktree.

## Scope and screenshot

Only the Persona listing changes. Description and features match app.json. All seven prior screenshots and other catalogue entries are preserved. No routes, styles, dependencies or workflows change.

The lead image persona-hair-edges-closeup.png is copied unmodified from the app repository: 1120 × 1504, SHA-256 `343aaf72ab54abe282fd2744ef03be7d7f45fb80749627c71e19ad672ad46bc4`. Previous cards are left and refined cards right under matching cameras and lights. This is an actual localhost Apple M1 hardware WebGL test comparison, not production editor UI or public-site browser capture.

Static layered cards retain crown arcs, rear layering and a cap-like appearance; this is not a photorealistic production groom. 435 editable guide curves and a manual card-rebake workflow preserve 28 identity targets on each hair mesh. The focused Blender roundtrip excludes animation; browser exports separately verify four pose clips. There is no demonstrated speed improvement.

## Publication evidence

Refined hair release 828fd66bef459dbd60ad9857417b58e2bc8be7ec passed check-and-build and Pages deployment at https://github.com/intrepion/kata-app-inspired-by-character-creator-5-codex-dot/actions/runs/42944441906 . At 2026-11-11T02:14:22.775389+00:00, all 97 deployed files returned HTTP 200 and SHA-256 matched the tested production build (76,894,407 bytes total); the landing page also matched. Public browser DOM/accessibility smoke confirmed WebGL, 56,508 triangles, the selected layered crop, enabled GLB export and selected Face view; no public screenshot visual review is claimed. Local verification passed 128 final tests, 107 application UI checks, 30 hardware WebGL views and 30 software-preview views. Four actual browser GLB exports, 15 negative controls and Blender 5.2.3 edit/reexport/reimport checks retained 53 body bones plus nine skirt bones and 28 targets on each hair mesh. The focused Blender roundtrip excludes animation; browser exports separately check all four pose clips. The lead image is an unmodified localhost Apple M1 WebGL comparison, previous cards left and refined right, not production editor UI. Crown arcs, rear layering and a cap-like appearance remain; no demonstrated speed improvement is claimed. See docs/QA-HAIR-EDGES.md in the app repository.

## Tool Shed validation

Astro check: zero errors, warnings or hints across 26 files. All 78 tests pass. Production build validates 280 pages and 4,574 local route, anchor and asset references. The built detail page and lead gallery image were visually reviewed in Chrome over localhost HTTP. All 16 other apps and all seven prior Persona screenshots remain unchanged. No public screenshot visual review is claimed.
