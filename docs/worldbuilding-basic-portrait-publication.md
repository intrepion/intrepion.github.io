# Worldbuilding, BASIC and portrait release

User-approved publication on November 10, 2026 UTC. This update adds three independent apps and refreshes Persona Forge's portrait listing. The Tool Shed now contains 16 published apps; all 149 Arcade games and their records are unchanged.

## Verified app releases

| App | Exact main commit | Successful Actions / Pages run | Live verification |
| --- | --- | --- | --- |
| [Tilehaven](https://intrepion.github.io/kata-app-inspired-by-tiled-codex-dot/) | `c8ef8f6f5129306011e71d90dae91aac0ad49f7e` | [42792776582](https://github.com/intrepion/kata-app-inspired-by-tiled-codex-dot/actions/runs/42792776582), separate [checks](https://github.com/intrepion/kata-app-inspired-by-tiled-codex-dot/actions/runs/42792776078) | All 12 deployed files returned HTTP 200 and matched the final production build's SHA-256 hashes. |
| [Kata Brushkeep](https://intrepion.github.io/kata-app-inspired-by-trenchbroom-codex-dot/) | `ee400505b398c2331098527af423d3c12d450134` | [42793049811](https://github.com/intrepion/kata-app-inspired-by-trenchbroom-codex-dot/actions/runs/42793049811) | All 10 deployed files matched at 09:45:57 UTC. Downloaded public runtime also passed numeric editing, add brush, undo and export-dialog smoke checks served over Mac localhost HTTP. |
| [Bytewell](https://intrepion.github.io/kata-app-inspired-by-quickbasic-45-codex-dot/) | `19fce9c02a95616cd6ea98eab56b33a0f419c565` | [42792742989](https://github.com/intrepion/kata-app-inspired-by-quickbasic-45-codex-dot/actions/runs/42792742989) | All 10 deployed files, including both screenshots, returned HTTP 200 and matched the final production build at 09:42:12 UTC. |
| [Kata Persona Forge](https://intrepion.github.io/kata-app-inspired-by-character-creator-5-codex-dot/) | `3a5fb77d854274e9796b81278798954fc69abfb2` | [42793477651](https://github.com/intrepion/kata-app-inspired-by-character-creator-5-codex-dot/actions/runs/42793477651) | Public index, app script, human renderer, GLB, asset manifest, app metadata and both new JPEGs match the final local build. |

## Application checks and limits

- **Tilehaven:** 13 Node tests, 11 browser regressions, syntax/build checks and real project/PNG/Tiled ZIP downloads passed. Original 24-tile palette and finite orthogonal maps only. Own JSON projects are the sole import format. TMJ plus atlas export was structurally decoded but not tested in native Tiled.
- **Brushkeep:** 65 browser-served regressions, real pointer drawing/movement/orbit/undo/autosave and downloaded JSON reopen passed. Axis-aligned cuboids only. OBJ is untextured geometry; Quake MAP remains experimental and unverified in native TrenchBroom or a game engine.
- **Bytewell:** 32 interpreter tests and 29 browser UI regressions passed, including actual BAS export/reopen/run. Documented scalar BASIC subset, not a DOS emulator or QuickBASIC-compatible compiler. No arrays, SUB/FUNCTION, file I/O, sound or executable compilation.
- **Persona:** 51 Node tests and build passed. Original synthetic portrait detail, independent iris tint, fitted brows/lashes and stylized textured short crop. Hardware WebGL was checked on Apple M1 through localhost, not all GPUs or browsers. Procedural hair is not a photoreal groom; no facial animation or cloth simulation. Historical release evidence is retained and explicitly scoped to those older versions.

## Screenshots

Eight original JPEGs were copied byte-for-byte into `public/screenshots/apps/`. Every catalog image has verified dimensions, SHA-256, capture date, alt text and source notes. Each detail page links to the full-resolution image.

- Tilehaven desktop predates the final recovery/pointer-cache fixes. Its narrow capture follows those fixes in a 390 CSS-pixel iframe.
- Brushkeep desktop is a production-build viewport capture; the lower plan view lies outside it. Its narrow review image includes a 390 CSS-pixel iframe plus the visible QA controls/background, not a 390px-wide cropped image.
- Bytewell desktop and 390px iframe captures follow the panel-height fix.
- Persona body and face captures are original unmodified app-only full-page JPEGs on Apple M1 hardware WebGL. They show Explorer/Juniper, default shapes/colors and Neutral A-pose. Their asset hash is `cf82a4d2dbc41509d413662829e15246d574c45d7f4d33412ecf7bb053206b0b`; see the app's `docs/screenshots/portrait-provenance.json`.

All screenshots came from localhost HTTP, not directly opened files. Local capture provenance and public served-byte verification are separate claims. Responsive iframe checks are not physical-device tests. Previous Persona screenshot files remain available for historical links, but the active gallery now uses the new portrait images.

## Tool Shed verification

- Astro check: zero errors, warnings or hints in 26 files.
- All 66 repository tests pass. App validation: 16 live apps; game validation and screenshot coverage: 149 games.
- Production build: 279 HTML pages with 4,544 internal route/anchor/asset references validated.
- Browser review used only `http://127.0.0.1:4173/`, serving the production build. All four updated detail pages displayed the correct launch/source links and both images. The images decoded to the recorded dimensions and desktop pages had no horizontal overflow.
- Tool Shed and all four pages settled without horizontal overflow in a 390 CSS-pixel same-origin iframe (375px content area after the scrollbar). Bytewell was rechecked after stylesheet loading; its settled width was 375px, not the transient unstyled width.
- Keyboard Enter navigation, Back/Forward, theme persistence after reload, the 16-card inventory, Arcade's 149-game count and empty-search reset were exercised. A final nonessential theme-restore observation timed out in the browser tooling after the substantive checks; no claim of a completed final console audit is made.
- No files were opened directly in a browser. The temporary responsive fixture and preview server are outside the committed source and public build.
