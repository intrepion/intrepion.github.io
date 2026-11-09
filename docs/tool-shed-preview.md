# Kata Arcade and Tool Shed preview

## What changed

- `/` is a two-collection entrance, with distinct green Arcade and amber Tool Shed cards.
- `/arcade/` retains the complete existing game home, search, genre browsing, and about section.
- `/tools/` starts the independent app catalog. `/apps/kata-app-inspired-by-jsfxr-codex-dot/` is its first detail page.
- All 149 games and their project, genre, inspiration, and detail URLs stay unchanged.
- Existing `/#genres` bookmarks still reach a complete genre-link directory; `/#about` still reaches an about section, including with JavaScript disabled.
- The shared header, section indication, keyboard focus, skip link, and persisted light/dark theme work across both collections.
- Kata Sound Lab is an unpublished local preview. No app launch or source link is shown until those destinations actually exist and are verified.

## Local verification

Development was served over `http://127.0.0.1:4329/`; the production build was served over `http://127.0.0.1:4332/`. No HTML file was opened through `file://`.

- `npm run check`: zero Astro errors, warnings, or hints. Existing game catalog, game screenshot coverage, and new app-catalog checks pass.
- `npm test`: 40 passing tests, including shared theme behavior, collection separation, preview/live URL safety, legacy anchors, and palette contrast.
- `npm run build`: 264 static HTML pages; all local routes, image references, and anchors validate. Each generated page has one h1.
- Browser review: 1440px desktop, 390px phone, and 320px narrow phone. No horizontal overflow on reviewed routes.
- Browser flows: Home → Tool Shed → app detail → Arcade; Morrow Garden title search → unchanged game detail → Back restores query; unmatched search → empty state → Clear restores focus to search.
- Theme: light/dark toggling, persistence after reload, and preference across collection navigation. Keyboard Tab exposes the skip link with a visible 3px focus outline.
- The old `/#genres` bookmark was followed in the browser and reached all 12 genre links.
- JavaScript was temporarily disabled for an Arcade browser check: genre browsing remained available, the no-script explanation appeared, and unusable search/theme controls were hidden. Normal script behavior was restored afterward.

## Publication boundary

This branch is a local preview, not a deployment. Do not push to `main` without authorization: the repository's workflow publishes that branch to GitHub Pages. Publish the app only after approval and verify it before switching the catalog entry to `live`. Never infer a working app URL from the repository naming convention alone.
