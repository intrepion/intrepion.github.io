# Persona Forge expression listing

Prepared November 10, 2026 from Tool Shed main `d56d2ebfff79c81218d55f334c110fda4a28210b` in an isolated checkout.

## Scope

Only Persona metadata, its regression tests, the new expression PNG and this record change. The description and features match the approved app manifest. All other 15 apps, all 149 games and the five prior Persona screenshot records are unchanged. No routes, styles, dependencies or workflows change.

Closed-mouth smile, frown and brow controls are described as a prototype, with stylized extremes, no mouth interior or lip-sync, and explicit Blender eye-weight and opposing-control limitations. The app QA record covers 106 Node checks, 99 expression UI checks, the earlier 94 eye checks, hardware Apple M1 WebGL and software-preview views, independent browser-export validation and Blender 5.2.3 editability. These are local checks, not new public-browser interaction coverage.

## Screenshot provenance

The unmodified app screenshot `docs/screenshots/persona-expressions.png` is first in the gallery. It is 1320 × 1820 pixels, SHA-256 `821c6fa722d366fea27566afb00cd4014a57232918032b8d0a2a90a8d804cb1f`. The nine-view sheet shows neutral, half/full smile, frown, brow directions, profile and combined eyes/expressions.

It was rendered by Chrome over localhost HTTP at `http://127.0.0.1:4193/tests/expressions.html?auto&capture` using Apple M1 hardware WebGL. Its image pixels were visually reviewed before listing. It is explicitly labeled a test-only rendered comparison sheet, not production editor UI or a public-site browser capture. No file URLs were opened.

## Gallery validation

Strict checks pass with no errors, warnings or hints across 26 Astro files. All 71 tests pass. The production build contains 279 HTML pages and passes validation of 4,552 local route, anchor and asset references. Semantic comparison confirmed that other apps and all prior Persona screenshot records are unchanged. No new gallery layout or browser-interaction coverage is claimed.

## Confirmed app publication

Expression release af1477d0b3ca356294efece7a1ab2873e2bcf8d9 (implementation d54d407) passed check-and-build and Pages deployment at https://github.com/intrepion/kata-app-inspired-by-character-creator-5-codex-dot/actions/runs/42836128612 . The publishing task verified 10 selected public files with HTTP 200 and matching SHA-256 against the tested production build, including HTML, app metadata, expression/project/eye runtime code, the unchanged foundation GLB and both new screenshots. This is sampled deployment-file verification, not a complete deployment audit or new public-browser interaction coverage. Local verification passed 106 Node tests, 99 expression browser checks and the earlier 94 blink/gaze checks; reviewed Apple M1 hardware WebGL and software-preview views and independently validated browser GLB exports retain editable expression targets in Blender 5.2.3. The new gallery image is a localhost test-only comparison sheet. Closed-mouth, stylized-expression and manual Blender eye-weight/opposing-control limits remain. See docs/QA-EXPRESSIONS.md in the app repository.
