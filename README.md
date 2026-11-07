# The Kata Arcade

[**Play Online →**](https://intrepion.github.io/)

A responsive Astro gallery of intrepion’s browser game experiments. The catalog currently contains **149 hosted games** and **0 source-only game repositories**. Browse genres, choose an original inspiration, then explore the experiments it inspired. Each playable game has its own page with a play link, source link, and reviewed gameplay screenshots. Search the home page by genre, inspiration, or game title, or search within a genre by inspiration, game title, repository, or edition. Games run at their existing project URLs.

## Develop and verify

Use Node.js 24.13+ (Node 24 LTS is used in CI).

```sh
npm ci
npm run dev
npm run check
npm test
npm run build
npm run preview
```

`check` runs Astro’s strict TypeScript diagnostics and catalog validation. Tests enforce catalog integrity and important project URLs. Astro generates a static `dist/` directory. The browser makes no runtime catalog API requests and loads no third-party fonts, images, or game iframes. All 149 games remain available through the genre and inspiration pages without JavaScript; JavaScript adds genre search and theme preference.

## Maintain the collection

Edit `src/data/games.json`. Each record contains the actual published title, inspiration, broad artwork category, one or more genres, edition, repository URL, optional `play` URL, and verification date/evidence. Keep one entry per repository, including independently built editions of the same inspiration. Do not infer playability from a repository name or a successful build alone.

The initial reconciliation used the October 25–26, 2026 hosted-game manifest (109 previously verified games), its companion hosted-games inventory, and all current public game-kata repositories/Pages metadata. All 110 initial hosted entry points returned HTTP 200 on October 26. Puddle Trouble adds the 112th entry, with its Pages deployment and automated objective flow verified on October 30. Common Thread adds the 111th entry, verified with a live practice solve on October 30. Lexi Conquest added the 110th entry; its title was read from the live site (the repository description still used its former name). Blockbound’s prior gameplay evidence includes the user’s confirmation. Existing gameplay verification was reused; this gallery migration does not assert a new complete gameplay test of each game.

To add a playable entry, confirm its public Pages deployment and rendered game, use the current title, test an ordinary gameplay action, and record evidence. Set `play` and `verified` to `null` for projects without a verified hosted game. They appear only in the workbench. Todo applications and unrelated non-game kata repositories are outside this collection. Update count assertions, page metadata, featured selections if appropriate, and the catalog date when changing the inventory. Run checks and test genre routes, search, empty results, keyboard navigation, and mobile layout before publishing. Genres are descriptive and may overlap; assign at least one to every entry. The registered game-owned snapshots provide screenshots for all 149 playable games. `npm run check` and `npm test` reject playable entries with missing or empty screenshot snapshots, so capture and sync images before publishing a new entry. The game page identifies missing images. Legacy captures remain in `src/data/screenshots.json` and `src/data/extra-screenshots.json`; game-owned manifests and their validated snapshots take precedence. Verify both the game and capture before adding more images.


Sprout & Soil adds the 145th playable entry on November 5, 2026. Its [Pages workflow](https://github.com/intrepion/kata-inspired-by-farmville-codex-dot/actions/runs/41973141967) deployed commit `cdd54bbeb0d0a320e0fb78588200aad94f20c1ed`. The public HTML and manifest returned HTTP 200; gameplay was tested through local HTTP development and production-preview servers, including harvesting, plowing, planting, persistence, growth, withering, shopping, and moving. Its 59 regression tests passed. Its game-owned manifest now includes two reviewed local gameplay captures, added on November 5, 2026.

Quiet Grid adds the 147th playable entry on November 5, 2026, inspired by Picross. Its [Pages workflow](https://github.com/intrepion/kata-inspired-by-picross-codex-dot/actions/runs/41984405743) deployed commit `835b53f659c20ae46bd8e783d497d52cbc441b8b`. All 11 published runtime, manifest, screenshot, original-evidence and capture-record files returned HTTP 200 and matched their local SHA-256 hashes at 07:04:09 UTC. The game passed 28 tests, a production build, and desktop/mobile CUA gameplay checks over loopback HTTP, including a complete puzzle solve. Its two reviewed gameplay screenshots retain truthful CUA/JPEG local-capture provenance.

## Publish to GitHub Pages

A normal push to `main` runs `.github/workflows/deploy.yml`: install the locked dependencies, check, test, build, upload `dist/` using `actions/upload-pages-artifact`, and publish with `actions/deploy-pages`. Repository Settings → Pages → Source must be **GitHub Actions**. The deploy job uses the `github-pages` environment and narrowly scoped Pages/OIDC permissions.

Astro uses `site: 'https://intrepion.github.io'`, `base: '/'`, and static output. No CNAME is configured. The user-site artifact contains only this gallery; existing game repositories continue to serve their own `/kata-…/` paths. Do not copy games into the root repository or add a catch-all redirect that intercepts those paths.

References: [Astro GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/) and [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Recover the previous site

The complete previous tracked tree is preserved on [`backup/pre-astro-gallery-2026-10-26`](https://github.com/intrepion/intrepion.github.io/tree/backup/pre-astro-gallery-2026-10-26), commit `cab0c2f6abe62108e371edc8da148d30c5ed07ce`. The working tree was clean before migration. Its ignored `.DS_Store` was excluded. To recover individual files, use `git restore --source backup/pre-astro-gallery-2026-10-26 -- <path>` after fetching the backup branch. Review, commit, and push recovery normally; do not rewrite history.

## License and attribution

The existing MIT LICENSE and Oliver Forral copyright are retained. Decorative gallery art, icons, and layouts are authored geometry and typography; screenshots are captures from the corresponding game repositories. Referenced game names are descriptive inspiration credits belonging to their respective owners; these independent learning projects are not affiliated with or endorsed by those owners. Each linked game repository retains its own license and credits. The OS portions of `.gitignore` come from the public [github/gitignore](https://github.com/github/gitignore) Global/Linux, Global/Windows, and Global/macOS templates (CC0), retrieved October 26, 2026, followed by Astro/Node exclusions.

Inspiration routes use the canonical names and explicit aliases in `src/data/inspirations.mjs`; the tests reject slug collisions. Game routes use their unique repository IDs. Genre pages list matching inspirations, and an inspiration page includes all its playable editions, even if their genre labels differ.

For the two-game game-owned metadata pilot and the proposed capture convention, see [docs/game-owned-capture-pilot.md](docs/game-owned-capture-pilot.md). Their current images are existing captures, not verified captures of the current deployed build.

Embervale adds the 148th playable entry on November 6, 2026. This original 3D point-and-click skill adventure is inspired by RuneScape. Its [Pages workflow](https://github.com/intrepion/kata-inspired-by-runescape-codex-dot/actions/runs/42269360289) deployed commit `cdd6ac8f0c0396151a67d28d6de078236c7a331c`. All 12 published runtime, manifest, screenshot and capture-evidence files matched their recorded hashes. Forty tests and local HTTP browser gameplay passed; two reviewed local gameplay screenshots retain schema-v3 provenance.

Morrow Garden adds the 149th playable entry on November 7, 2026, inspired by Pikmin. This original 3D squad-command expedition passed 29 core tests and a real HTTP browser suite. Its [Pages workflow](https://github.com/intrepion/kata-inspired-by-pikmin-codex-dot/actions/runs/42317682862) deployed commit `447e9fa491473924889fb03a26c43ac9c39c6a12`; [game checks](https://github.com/intrepion/kata-inspired-by-pikmin-codex-dot/actions/runs/42317629324) also passed. All 10 published runtime, manifest, screenshot and capture-evidence files returned HTTP 200 and matched their hashes at `2026-11-07T00:22:14Z`. Two reviewed local gameplay captures from commit `1a885d283b4e8666ebf670eb83adfb71df06cbbb` retain schema-v3 hash and provenance validation. The game recreates the core loop with original maps and simpler AI, rather than claiming complete gameplay parity.
