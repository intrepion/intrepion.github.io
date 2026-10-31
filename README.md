# The Kata Arcade

[**Play Online →**](https://intrepion.github.io/)

A responsive Astro gallery of intrepion’s browser game experiments. The catalog currently contains **121 hosted games** and **17 source-only game repositories**. Search by title, inspiration, repository, or edition; filter by category; sort; or pick a random visible game. Every card links to its source. Games run at their existing project URLs.

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

`check` runs Astro’s strict TypeScript diagnostics and catalog validation. Tests enforce catalog integrity and important project URLs. Astro generates a static `dist/` directory. The browser makes no runtime catalog API requests and loads no third-party fonts, images, or game iframes. All 121 game cards remain available without JavaScript; JavaScript adds local search, category filters, sorting, and random selection.

## Maintain the collection

Edit `src/data/games.json`. Each record contains the actual published title, inspiration, category, edition, repository URL, optional `play` URL, and verification date/evidence. Keep one entry per repository, including independently built editions of the same inspiration. Do not infer playability from a repository name or a successful build alone.

The initial reconciliation used the October 25–26, 2026 hosted-game manifest (109 previously verified games), its companion hosted-games inventory, and all current public game-kata repositories/Pages metadata. All 110 current hosted entry points returned HTTP 200 on October 26. Puddle Trouble adds the 112th entry, with its Pages deployment and automated objective flow verified on October 30. Common Thread adds the 111th entry, verified with a live practice solve on October 30. Lexi Conquest added the 110th entry; its title was read from the live site (the repository description still used its former name). Blockbound’s prior gameplay evidence includes the user’s confirmation. Existing gameplay verification was reused; this gallery migration does not assert a new complete gameplay test of each game.

To add a playable entry, confirm its public Pages deployment and rendered game, use the current title, test an ordinary gameplay action, and record evidence. Set `play` and `verified` to `null` for projects without a verified hosted game. They appear only in the workbench. Todo applications and unrelated non-game kata repositories are outside this collection. Update count assertions, page metadata, featured selections if appropriate, and the catalog date when changing the inventory. Run checks and test search, filters, empty results, keyboard navigation, and mobile layout before publishing. Original category artwork is decorative and does not claim to be a game screenshot.

## Publish to GitHub Pages

A normal push to `main` runs `.github/workflows/deploy.yml`: install the locked dependencies, check, test, build, upload `dist/` using `actions/upload-pages-artifact`, and publish with `actions/deploy-pages`. Repository Settings → Pages → Source must be **GitHub Actions**. The deploy job uses the `github-pages` environment and narrowly scoped Pages/OIDC permissions.

Astro uses `site: 'https://intrepion.github.io'`, `base: '/'`, and static output. No CNAME is configured. The user-site artifact contains only this gallery; existing game repositories continue to serve their own `/kata-…/` paths. Do not copy games into the root repository or add a catch-all redirect that intercepts those paths.

References: [Astro GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/) and [GitHub custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Recover the previous site

The complete previous tracked tree is preserved on [`backup/pre-astro-gallery-2026-10-26`](https://github.com/intrepion/intrepion.github.io/tree/backup/pre-astro-gallery-2026-10-26), commit `cab0c2f6abe62108e371edc8da148d30c5ed07ce`. The working tree was clean before migration. Its ignored `.DS_Store` was excluded. To recover individual files, use `git restore --source backup/pre-astro-gallery-2026-10-26 -- <path>` after fetching the backup branch. Review, commit, and push recovery normally; do not rewrite history.

## License and attribution

The existing MIT LICENSE and Oliver Forral copyright are retained. Gallery art, icons, and layouts are authored geometry and typography. Referenced game names are descriptive inspiration credits belonging to their respective owners; these independent learning projects are not affiliated with or endorsed by those owners. Each linked game repository retains its own license and credits. The OS portions of `.gitignore` come from the public [github/gitignore](https://github.com/github/gitignore) Global/Linux, Global/Windows, and Global/macOS templates (CC0), retrieved October 26, 2026, followed by Astro/Node exclusions.
