import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
export const games = JSON.parse(readFileSync(new URL('../src/data/games.json', import.meta.url), 'utf8'));
export function validate(catalog) {
  const ids = new Set();
  const urls = new Set();
  for (const game of catalog) {
    assert.ok(game.title && game.inspiration && game.category && game.edition, 'Each game needs descriptive metadata');
    assert.ok(!ids.has(game.id), `Duplicate repository: ${game.id}`);
    ids.add(game.id);
    assert.equal(game.repo, `https://github.com/intrepion/${game.id}`);
    if (game.play) {
      const url = new URL(game.play);
      assert.equal(url.origin, 'https://intrepion.github.io');
      assert.equal(url.pathname, `/${game.id}/`);
      assert.ok(!urls.has(game.play), 'Duplicate play URL');
      urls.add(game.play);
      assert.ok(game.verified && game.evidence, 'Play links require verification evidence');
    } else assert.equal(game.verified, null, 'Source-only projects cannot claim verification');
  }
  return { total: catalog.length, playable: urls.size, sourceOnly: catalog.length - urls.size };
}
console.log('Catalog valid:', validate(games));
