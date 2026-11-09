# Kata Arcade and Tool Shed release

## What changed

- `/` is a two-collection entrance, with distinct green Arcade and amber Tool Shed cards.
- `/arcade/` retains the complete existing game home, search, genre browsing, and about section.
- `/tools/` starts the independent app catalog. `/apps/kata-app-inspired-by-jsfxr-codex-dot/` is its first detail page.
- All 149 games and their project, genre, inspiration, and detail URLs stay unchanged.
- Existing `/#genres` bookmarks still reach a complete genre-link directory; `/#about` still reaches an about section, including with JavaScript disabled.
- The shared header, section indication, keyboard focus, skip link, and persisted light/dark theme work across both collections.
- Kata Sound Lab was staged as an unpublished preview. After its approved publication and live verification, the catalog now shows working launch and source links.

## Local verification

Development was served over `http://127.0.0.1:4329/`; the production build was served over `http://127.0.0.1:4332/`. No HTML file was opened through `file://`.

- `npm run check`: zero Astro errors, warnings, or hints. Existing game catalog, game screenshot coverage, and new app-catalog checks pass.
- `npm test`: 42 passing tests, including shared theme behavior, collection separation, preview/live URL safety, legacy anchors, and palette contrast.
- `npm run build`: 264 static HTML pages; all local routes, image references, and anchors validate. Each generated page has one h1.
- Browser review: 1440px desktop, 390px phone, and 320px narrow phone. No horizontal overflow on reviewed routes.
- Browser flows: Home → Tool Shed → app detail → Arcade; Morrow Garden title search → unchanged game detail → Back restores query; unmatched search → empty state → Clear restores focus to search.
- Theme: light/dark toggling, persistence after reload, and preference across collection navigation. Keyboard Tab exposes the skip link with a visible 3px focus outline.
- The old `/#genres` bookmark was followed in the browser and reached all 12 genre links.
- JavaScript was temporarily disabled for an Arcade browser check: genre browsing remained available, the no-script explanation appeared, and unusable search/theme controls were hidden. Normal script behavior was restored afterward.

## Publication boundary

The user approved publishing the app first, followed by the updated gallery. App commit `9b7d672be819a4bef334263c5185d20bf8efe5e4` passed [checks and deployment](https://github.com/intrepion/kata-app-inspired-by-jsfxr-codex-dot/actions/runs/42713404377). Public runtime/metadata bytes matched the final build at `2026-11-09T22:37:46.832Z`, and its screenshot hashes were verified. Only then was the catalog entry switched to `live`. Future publication also requires authorization; a push to gallery `main` triggers GitHub Pages.


## Sound Lab screenshots

Two original, unedited Chromium/CUA full-page captures from `http://127.0.0.1:4173/`, captured on November 9, 2026 at 21:50:07 UTC, were imported into the app catalog. File hashes and actual image dimensions were checked after transfer. Both were visually reviewed through the local HTTP server before integration.

- Desktop: viewport 1180 CSS px, image 1165 × 1185, SHA-256 `de53252a5f5bbbc1c3ddc95f7e7c35faa90beed1fd16deff299d13e3a4164a02`.
- Narrow-screen: viewport 500 CSS px, image 485 × 1636, SHA-256 `0ed305c745959ef17aa347b1106ecde6774e83d30ec11e0575f2cd8794e901cc`. This is responsive browser emulation, not a physical-device test.

Both show the Coin pickup preset. They preceded a final noise-only control-disable fix and documentation update in app commit `f972f1e84e5e53e6577e4bde3926cd5c420231cf`; they do not claim to be captures of that exact commit. The Coin preset screen was unchanged. App implementation checks reported 12 passing tests, syntax checks, a static build, WAV export, and JSON round-trip verification. The hub documents that settings are Sound Lab v1, not jsfxr compatible.
