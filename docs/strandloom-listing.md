# Kata Strandloom listing

Prepared November 11, 2026 in a dedicated worktree based on remote main 3678a33. App source commit: 5d44373a31d7d125f3d8e13ded324e7aaf696556. Initially prepared as a local-only draft. The user subsequently approved publication.

Adds one original Reblium-inspired 3D hair-grooming app. The 17 existing apps and all 149 games are unchanged. Publication fields now reflect the verified release.

## Evidence and limits

Two original unedited Chrome/CUA JPEG captures were visually reviewed and copied from the app's docs/screenshots directory. Exact times, dimensions and hashes are preserved from app.json. Both depict localhost HTTP at port 5197. Narrow capture used a 390 × 844 CSS viewport and is not a physical-phone test.

The app's docs/QA.md records 33 model tests plus check/build, real Comb drag, undo/redo, layer hiding, preset replacement Cancel/confirm, all four presets, side-view visual review and reset/zoom controls (back invoked but not independently screenshot-verified), native JSON import and autosave restore. Length and Smooth native gestures, completed native downloads, DCC import, physical touch, other GPUs and full accessibility are not verified. The listing preserves stylized-study and format limits.

Hub validation passed: npm run check (zero Astro diagnostics, catalog and image hashes), npm test, and npm run build (281 pages; 4,592 local references). These screenshots show the app, not a browser review of the hub.

## Verified app publication

Published commit d843c284fb49f6414443045a1306726e7909d00e passed build and deploy in https://github.com/intrepion/kata-app-inspired-by-reblium-codex-dot/actions/runs/42983419436 . The public app returned HTTP 200 and all 12 tested deployed files matched local dist bytes: HTML, CSS, favicon, app.json, LICENSE, three source modules, two Three.js modules and two screenshots. Local check/build and 33 model tests passed. Local browser Comb, undo/redo, layer hiding, presets, JSON import and autosave restore were verified. Native JSON, PNG and OBJ download completion remains unverified; screenshots retain their local capture provenance.

Public Chrome smoke verified mannequin/strands, Soft bob, Undo restoring Side sweep and the Tool Shed backlink. No app errors were observed.
