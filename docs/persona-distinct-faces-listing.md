# Persona Forge distinct-face listing

Prepared November 10, 2026 from current Tool Shed main `d2fcfbfdd02873e7188cde2efcac780d134537dd`.

## Scope

Only the Persona Forge entry, its regression assertions, the new comparison image and this record change. Existing portrait image files and both portrait metadata records remain unchanged. All other application and game entries, routes, styles, workflows and settings remain unchanged.

The listing describes three new adult face presets, nine additional paired face controls and twenty-eight appearance morph targets. It preserves the single-foundation, stylized scope, software-preview and device limits. It distinguishes the historical foundation Khronos result from the new Blender 5.2.3 export checks and notes the approximately 23 MB runtime GLB.

## App release evidence

Approved app commit `d5e31df0d2f030ab1d15534d981a72dabdd4a5dc` passed [check-and-build and Pages deployment](https://github.com/intrepion/kata-app-inspired-by-character-creator-5-codex-dot/actions/runs/42803638969). The publishing task verified all 52 deployed files against the approved build at `2026-11-10T11:02:26.161862+00:00`, including the 23,020,472-byte foundation GLB and new PNG. This is deployment and byte-identity evidence, not public-site browser testing.

The app's `docs/QA-DISTINCT-FACES.md` records local tests, actual Apple M1 WebGL and software-preview comparisons, project compatibility and editable export checks. All browser testing remains on localhost HTTP.

## Image provenance

`persona-distinct-faces.png` is the exact unmodified PNG from the app's `artifacts/distinct-presets.png`, also published in its `docs/screenshots/` directory. It is 1056 × 1096 pixels and 702,279 bytes, with SHA-256 `72da775ccd2859af761ffdb2748929fe01056435a79f3b7aa995304e2886d380`.

It was rendered by the actual app renderer in Chrome on Apple M1 WebGL at `http://127.0.0.1:4193/tests/distinct-faces.html?auto=1&capture`. The final recorded hardware run completed at `2026-11-10T10:38:51.365Z`. The image date is November 10; no exact per-image capture timestamp is asserted. Its four columns compare original Explorer/Juniper, Angular/Vale, Rounded/Marlowe and Long/Ellis in front, three-quarter and profile views with identical styling. The caption explicitly identifies the test-only rendered comparison sheet rather than production editor UI.

The image is first in the listing, so the existing Tool Shed component also uses it as the card preview. Both earlier portrait captures follow it with their existing metadata intact.

## Gallery validation

Validation passed before publication: No browser interaction or new visual layout claim is made for this metadata-only gallery update; the existing gallery component is unchanged.

- `npm run check`: 26 Astro files, zero errors/warnings/hints; catalog and screenshot validation passed.
- `npm test`: all 67 tests passed.
- `npm run build`: 279 pages and 4,546 internal route, anchor and asset references passed.
- Local HTTP checks passed for `/tools/`, the Persona detail route and all three screenshot assets. Screenshot order, current description/scope, launch destination, explicit comparison-sheet caption and all three SHA-256 hashes matched.
- Semantic comparison against the starting commit confirmed the other 15 app entries and both complete existing Persona portrait records were unchanged. No routes, styles, dependencies, lockfiles, workflows or settings changed.

This record describes checks completed before the Tool Shed commit was published. The listing commit's GitHub Actions run and final public HTTP/hash verification are checked separately after publication.
