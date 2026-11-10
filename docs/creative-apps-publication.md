# Creative app publication

The user approved publication of the ready apps on November 10, 2026. Only Kata Pulse Foundry, Trackstead, and Kata Mosslight are added by this gallery release. The seven new 3D prototypes are not included.

## Verified releases

### Kata Pulse Foundry

- App: https://intrepion.github.io/kata-app-inspired-by-fl-studio-codex-dot/
- Repository: https://github.com/intrepion/kata-app-inspired-by-fl-studio-codex-dot
- Exact main commit: `3eca42123c77aba11c298acce6ddc1b8a14e55d1`.
- Successful checks and Pages: https://github.com/intrepion/kata-app-inspired-by-fl-studio-codex-dot/actions/runs/42738753303

All served source files, assets, manifest, and screenshots returned HTTP 200 and matched the final dist bytes. Forty automated tests, syntax checks, and the build passed locally and in CI. Live Chrome rendering, step toggle, Undo, Play, and Stop passed. Physical-phone, Safari/Firefox, screen-reader, and human hardware-listening checks remain untested.

### Trackstead

- App: https://intrepion.github.io/kata-app-inspired-by-reaper-codex-dot/
- Repository: https://github.com/intrepion/kata-app-inspired-by-reaper-codex-dot
- Exact main commit: `e0f8e53f550bb9848edfbae6f5777a9684293aa4`.
- Successful checks and Pages: https://github.com/intrepion/kata-app-inspired-by-reaper-codex-dot/actions/runs/42738671042

Public index.html and all four JS/CSS runtime assets returned HTTP 200 and matched the final build bytes. Thirty automated tests and the build passed locally and in CI. Live Chrome rendering, playback clock, numeric trim from 20 to 18 seconds, and Undo to 20 seconds passed. Real microphone hardware, touch devices, and broad cross-browser behavior remain unverified.

### Kata Mosslight

- App: https://intrepion.github.io/kata-app-inspired-by-krita-codex-dot/
- Repository: https://github.com/intrepion/kata-app-inspired-by-krita-codex-dot
- Exact main commit: `eb983976824eb1167122acafe0f98206399d7870`.
- Successful checks and Pages: https://github.com/intrepion/kata-app-inspired-by-krita-codex-dot/actions/runs/42738675983

All ten checked live assets returned HTTP 200 and matched the final dist bytes, including HTML, CSS, four JS modules, icon, manifest, and both screenshots. Seventeen Node tests and the build passed on the Mac and in CI; the earlier local Chromium engine suite passed twelve tests. Live Chrome rendered the landscape, presets, and layers, and Help opened and closed. Physical pen, pressure, and touch hardware remain untested.

## Gallery verification

- All 50 gallery tests passed; Astro reported zero errors, warnings, or hints.
- The final build contains 269 pages; generated route, anchor, asset and screenshot checks passed.
- Existing Sound Lab, Wave Room, and Pixel Loom catalog records and all 149 games remain unchanged.
- All six screenshots retain original bytes, dimensions and truthful local capture provenance. They are not presented as new screenshots of the released builds.
- Initial gallery review covered responsive layouts, theme persistence, images, keyboard focus and history navigation. Final localhost review confirmed all three matching app/source links, published labels, and six loaded screenshots, with no browser console errors.

Real microphone capture in Trackstead and physical pen/touch input in Mosslight remain untested. Pulse Foundry exports one bar with a 0.6-second tail; it is not a full DAW and its WAV is not a seamless loop. Project-format limits and backup recommendations remain visible on each listing.

Wave Room native file-picker import and completed saved WAV validation passed separately on the unlocked Mac, without changing app code or security permissions. See [the recheck](wave-room-file-qa.md).
