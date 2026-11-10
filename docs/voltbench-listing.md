# Kata Voltbench listing

Prepared November 10, 2026 from verified Tool Shed remote main `7f2c2e401b15174287542c8c23a9a10231d550f0` in an isolated local worktree.

## Scope

Adds Kata Voltbench as an Electronics app inspired by HSPICE. Its original educational solver supports a focused linear R/C/L subset with independent voltage and current sources, operating point, DC sweep, AC response and transient plots. It does not include nonlinear diode/transistor models, use an HSPICE binary, or claim HSPICE compatibility or production signoff suitability.

Initially staged with null publication fields. Following explicit user publication authorization and verified app deployment, repository, launch, date and evidence now describe the confirmed live app. Other 16 app entries and all 149 games remain unchanged.

## Screenshots and validation

Two original unedited full-page Chrome/CUA captures from http://127.0.0.1:5193/ were visually reviewed and copied without pixel edits. Capture times are approximate, explicitly identified in catalog provenance. Desktop shows the RC low-pass transient in a default 1148 × 623 CSS-pixel viewport; its image is 1133 × 1005 pixels. Narrow shows RLC AC resonance with V(in) hidden, using an explicit 390 × 844 CSS-pixel viewport; its image is 375 × 1805 pixels, excluding the scrollbar. This is responsive browser review, not a physical-device test. Both source and copied SHA-256 hashes were verified.

Final validation passed: `npm run check` reports zero errors, warnings or hints across 26 Astro files; game catalog and screenshot checks pass; app catalog contains 17 entries (all live). `npm test` passes all 74 tests. `npm run build` emits 280 HTML pages and validates 4,570 local route, anchor and asset references. Tests require ordinary temporary-file write access; a read-only sandbox repeat could not create its temporary fixture, and the permitted rerun passed all 74. Semantic comparison verified the other 16 app records are unchanged.

The final local production build is served at http://127.0.0.1:5194/apps/kata-app-inspired-by-hspice-codex-dot/ and returned HTTP 200. Browser layout review of this catalog page is delegated to the coordinating task; this record does not claim it has happened.


## Verified app publication

App commit `766d64801109e5cb4ce76c7de85288da7743c5bb` passed checks/build and Pages deployment in [run 42857292361](https://github.com/intrepion/kata-app-inspired-by-hspice-codex-dot/actions/runs/42857292361). The coordinating task verified the public app in Chrome: default RC transient solved 1,501 samples, AC magnitude/phase solved 201, and voltage-divider DC yielded 5 V and 2.5 V. The gallery images retain their local capture provenance.
