import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function validateScreenshotCoverage(catalog, snapshots) {
  const missing = catalog.filter(game => game.play && (!Array.isArray(snapshots[game.id]) || snapshots[game.id].length === 0));
  assert.equal(missing.length, 0, `Playable games need reviewed gameplay screenshots before publishing: ${missing.map(game => game.id).join(', ')}. Capture in the game repository, verify its published manifest/assets, and sync the Arcade snapshot.`);
  return catalog.filter(game => game.play).length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const catalog = JSON.parse(readFileSync(new URL('../src/data/games.json', import.meta.url), 'utf8'));
  const snapshots = JSON.parse(readFileSync(new URL('../src/data/pilot-screenshots.json', import.meta.url), 'utf8'));
  console.log(`Screenshot coverage valid: ${validateScreenshotCoverage(catalog, snapshots)} playable games`);
}
