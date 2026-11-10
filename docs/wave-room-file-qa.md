# Wave Room native file workflow recheck

Date: November 10, 2026. Local Chrome on the unlocked Mac, served through `http://127.0.0.1:4174/`. No app code, permissions, security settings, or public deployment changed.

The native macOS file picker successfully opened a known `fixture.wav`. Wave Room displayed stereo audio, 3.000 seconds, and −6.0 dBFS. The source fixture was 44.1 kHz; browser decoding resampled it to the AudioContext’s 48 kHz.

The native Save dialog completed the exported WAV download. The saved file was independently parsed:

- Stereo 16-bit PCM, 48,000 Hz.
- 144,000 frames, exactly 3.0 seconds.
- 576,044 bytes.
- Nonzero signed audio samples, range −16,453 to 16,468.
- SHA-256: `b867a7ac1f1f492184dbfc0c3f53d67abf2358b2fade0154f519744b198d9146`.

The audit artifact is named `wave-room-native-qa-20261110.wav` and remains in the Mac Downloads folder. The fixture remains under the app’s ignored `test-results/` directory. The test server was stopped afterward.

These results resolve the earlier end-to-end import and native download-completion gaps using native UI. The extension’s direct file assignment still lacks local-file permission, but no permission expansion was needed. Subjective listening, other browsers, and physical mobile devices remain untested. This record supplements, rather than rewrites, the earlier publication-time evidence.
