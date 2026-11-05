# Game-owned arcade metadata

The Hours We Keep (`kata-inspired-by-braid-codex-dot`) and Parallax Relay (`kata-inspired-by-portal-codex-dot`) own `public/arcade/manifest.json` and `public/arcade/screenshots/*.jpg`. Vite includes `public/` unchanged in each game's build. Their v1 manifests specify the repository ID, exact play URL, image paths, SHA-256 hashes, alt text, and per-image provenance. Their current images are **existing repository captures** with unknown capture dates and deployed-build identities. They are not automated captures of the current deployment. Moving or syncing them does not change that status.

The arcade remains the discovery hub. `node scripts/pilot-sync.mjs [game-checkout-parent]` validates the registered game-owned manifests and image hashes, then generates `src/data/pilot-screenshots.json` and content-addressed copies under `public/screenshots/game-owned/`. The snapshots are committed with the arcade, so ordinary builds need no network or adjacent checkouts. A sync validates all registered inputs before writing and atomically replaces the index last; a failed validation leaves the previous index in place. The game detail page and gallery previews prefer the game-owned snapshot; a verified empty manifest remains empty, and games not yet registered retain their current images and missing-image fallback. A full sync is an explicit reviewable maintenance action, not a runtime fetch. Previous content-addressed copies can be removed only after confirming they are no longer referenced by a deployed or proposed index.

The initial release snapshot was synced from the two deployed game manifests after verifying each of their five image hashes. That confirms the source assets matched those manifests at sync time; it does not establish when the images were captured or which game build they depict.

## Capture convention for future work

A game-specific, pinned Playwright version and browser could run in CI against the exact built artifact served at `http://127.0.0.1`, using a fixed viewport, locale, clock, seed, and a clean storage state. A game-specific public interaction script should wait for a verifiable ready state, enter representative gameplay without hidden debug shortcuts, and call Playwright's documented `page.screenshot({ path: ... })` API ([Playwright screenshots](https://playwright.dev/docs/screenshots)). Human review should check that each image depicts the intended game and state, includes no private data or browser chrome, and remains readable. This is a proposed convention, not an implemented or verified capture pipeline; no new browser screenshot has been captured by the pilot.

A future automated manifest schema must separately record capture timestamp, source commit, build artifact digest, capture tool/browser versions, and whether it depicts a local artifact or a verified deployment. To claim an exact deployed build, verify the deployed artifact against that digest or an equivalent trusted deployment attestation; a commit SHA or successful capture alone is insufficient. Never silently relabel older images. A failed capture, missing manifest, invalid hash, deployment mismatch, or unavailable network must retain the last validated snapshot with its existing provenance or show a no-screenshot state; it must not prevent play links or substitute another game's images. Version 1 retains empty lists and `existing_repository_capture` entries with unknown date and build. Version 2 additionally accepts reviewed `ci_gameplay_capture` entries with a capture commit, workflow run, hashes of the served inputs and original PNG, and a timestamp recording when the published files were checked against those hashes. The timestamp is historical evidence, not a promise that the live game remains unchanged. The sync checks both original and optimized image hashes before updating the snapshot.

## Maintenance

Deploy each game-owned manifest and its assets before syncing it into the arcade. Verify the published manifest and image hashes, then run the sync against a checkout or staged copies of those verified assets. Game repositories use either a site-root `arcade/` directory or `public/arcade/` copied into their build artifact; each repository documents its own layout.

Establish and test a capture workflow per game before replacing any existing captures, and review output and provenance. Keep unavailable images honest. Consider fetching published manifests at runtime only after integrity, caching, failure handling, supply-chain trust, and review policies are designed. Ordinary arcade builds do not depend on a live endpoint.

## Staged rollout

The registered IDs in `src/data/game-owned-ids.json` are the game manifests included in the checked-in snapshot. Each is added only after its deployment and image hashes have been verified. The registry covers the playable catalog; source-only entries have no deployed game manifest. Empty game-owned manifests preserve the no-screenshot state.

Reviewed CI captures may also include a capture-record path and SHA-256. The sync validates the record against the capture commit, run ID, and input hashes before accepting it; records preserve browser and capture details as well as any documented external-runtime or font limitations. The timestamp is the time the published files were checked, not a guarantee that they remain unchanged.


## Required screenshots for new playable entries

A playable catalog addition now requires at least one reviewed gameplay image in its checked-in game-owned snapshot. `npm run check` runs `scripts/validate-screenshots.mjs`, and `npm test` covers the same invariant. Empty manifests remain valid input to the sync tool and retain the missing-image fallback, but they cannot silently ship as a playable catalog entry. Source-only entries are exempt. Do not remove play links to work around this check; complete the capture first.

For the Ember Below and Sprout & Soil additions, pinned Playwright scripts in each game repository capture real public interactions against the built game served at a loopback HTTP URL. Schema version 3 records these as `local_gameplay_capture`, not as CI runs or claims about a deployed build. Each image retains its capture timestamp, source commit, original PNG hash, served input hashes, and a hashed capture record with the browser/tool versions, viewport, URL, and gameplay steps. The gallery displays the local-capture label and links to that record. The sync validates the record, source PNG, and optimized JPEG before accepting the image. Changing an input requires a new capture and review; publishing or syncing alone does not update capture provenance.

The per-game workflow is:

1. Build the game, then run its documented capture command against a loopback HTTP server.
2. Review the original and optimized images. Confirm they show representative gameplay and contain no private data or browser chrome.
3. Run the game's checks and screenshot/hash tests. Commit and publish the game-owned manifest, capture record, original captures, and optimized images through its existing deployment workflow.
4. Verify the published manifest and each referenced asset match their committed hashes. Then sync only those registered games without replacing unrelated snapshots:

   ```sh
   node scripts/pilot-sync.mjs <parent-directory> --game kata-inspired-by-noita-codex-dot --game kata-inspired-by-farmville-codex-dot
   ```

   Checkouts passed to the sync expose their site files under `public/`; for static site-root games, stage verified files in that layout. Omitting `--game` still performs the full registry sync and requires all game roots.
5. Run the Arcade's `npm run check`, `npm test`, and `npm run build`; inspect the game and inspiration pages through HTTP. Publish and verify the deployed pages and screenshot URLs.

The requirement catches missing captures. Human review remains necessary to judge whether a screenshot is useful and representative.
