# Three local Tool Shed previews

Prepared November 10, 2026, for review only. No repository was created, pushed, or deployed as part of this task. The public Tool Shed is unchanged.

The isolated branch adds **Kata Pulse Foundry** (FL Studio-inspired sequencing), **Trackstead** (REAPER-inspired multitrack arrangement), and **Kata Mosslight** (Krita-inspired painting). All three use `preview` status, null repository/launch/verification fields, and explicit unpublished labels. Existing Sound Lab, Wave Room, and Pixel Loom catalog records and all 149 games are unchanged.

## Review pages

Serve the production build over HTTP using `npm run preview -- --host 127.0.0.1 --port 4336`. The local review routes are:

- `/apps/kata-app-inspired-by-fl-studio-codex-dot/`
- `/apps/kata-app-inspired-by-reaper-codex-dot/`
- `/apps/kata-app-inspired-by-krita-codex-dot/`

Do not open build files through `file://`. Publication requires a separate user instruction and verification of each real deployed app before adding public launch links.

## Verification

- `npm run check`: zero Astro errors, warnings, or hints; all catalog and screenshot validators passed.
- `npm test`: 50 tests passed, including preview-only destinations, hardware/file-format caveats, and existing catalog/theme regressions.
- `npm run build`: 269 pages and 4,366 internal route/anchor/asset references passed validation.
- Local Chrome: all three detail pages show their correct original screenshots, features, limits, and unpublished labels without launch/source links.
- Trackstead’s two desktop images display at equal width. Existing portrait-image layouts retain their previous sizing.
- No horizontal overflow at 390 CSS pixels for Trackstead or at 320 CSS pixels for Pulse Foundry and Mosslight. These are gallery-layout checks, not physical-device tests of the underlying apps.
- Theme change persisted through reload and navigation. Full-resolution image navigation and Back worked. Keyboard Tab exposed the skip link with a 3px focus outline. No console errors appeared during these checks.

## Source and image provenance

All six images were copied unchanged from the completed app source archives, their actual pixels reviewed on the Mac, and SHA-256 hashes recorded in the app catalog. No generated mockups or composites were used.

- Pulse Foundry: genuine Chromium full-page captures from `http://127.0.0.1:4173/`, with exact capture timestamps and source hashes from `app.json`. The narrow image is a resized browser view, not a physical phone.
- Trackstead: two genuine desktop captures from `http://127.0.0.1:4173/`, with dimensions, hashes, and date from `docs/screenshots/provenance.json`. The armed-track indicator is a UI state; no real microphone was accessed.
- Mosslight: genuine desktop and narrow iframe captures documented in `docs/QA.md`, from `http://127.0.0.1:4173/`. The 392 × 846 image includes the border of the 390 × 844 iframe and shows its top portion only. The capture date is documented; an exact capture timestamp was not supplied or invented. Hashes were calculated from the original transferred JPEG bytes.

App builders reported 40 automated tests for Pulse Foundry, 30 for Trackstead, and 17 Node plus 12 browser-engine tests for Mosslight, with respective builds and local workflow QA passing. These app suites were not rerun as part of the gallery integration. Their documented remaining hardware/cross-browser limits are preserved in the preview notes. Wave Room’s separate Mac file workflow recheck is in [wave-room-file-qa.md](wave-room-file-qa.md).
