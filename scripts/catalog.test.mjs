import test from 'node:test';
import assert from 'node:assert/strict';
import { games, validate } from './validate-catalog.mjs';
test('catalog includes every reconciled game with separate source-only entries', () => {
  assert.deepEqual(validate(games), { total: 142, playable: 125, sourceOnly: 17 });
  assert.equal(new Set(games.filter(game => game.play).map(game => game.category)).size, 5);
});
test('current names and protected project paths survive the root-site migration', () => {
  for (const [id, title] of [['kata-inspired-by-excitebike-codex-dot', 'Dirt Circuit'], ['kata-inspired-by-warioware-smooth-moves-codex-dot', 'Wiggle Ritual'], ['kata-inspired-by-peggle-2-codex-dot', 'Peglight Party'], ['kata-inspired-by-untitled-goose-game-codex-dot', 'Puddle Trouble'], ['kata-inspired-by-wordle-codex-dot', 'Lexi Conquest'], ['kata-inspired-by-connections-codex-dot', 'Common Thread'], ['kata-minecraft-clone-gpt-6-luna-extra-high', 'Blockbound']]) {
    const game = games.find(game => game.id === id);
    assert.equal(game.title, title);
    assert.equal(game.play, `https://intrepion.github.io/${id}/`);
  }
});
test('rejects duplicate games and unverified or misplaced play links', () => {
  assert.throws(() => validate([games[0], games[0]]));
  const hosted = games.find(game => game.play);
  assert.throws(() => validate([{ ...hosted, play: 'https://intrepion.github.io/' }]));
  assert.throws(() => validate([{ ...hosted, verified: null }]));
});

test('genres cover the catalog and support overlapping games', () => {
  assert.ok(games.every(game => game.genres.length));
  const braid = games.find(game => game.inspiration === 'Braid');
  assert.ok(braid.genres.includes('Puzzle') && braid.genres.includes('Platformer'));
  assert.throws(() => validate([{ ...games[0], genres: [] }]));
  assert.throws(() => validate([{ ...games[0], genres: ['Puzzle', 'Puzzle'] }]));
});

test('screenshots point to unique local assets for playable games', async () => {
  const { readFile, stat } = await import('node:fs/promises');
  const screenshots = JSON.parse(await readFile(new URL('../src/data/screenshots.json', import.meta.url), 'utf8'));
  const files = new Set();
  for (const [id, image] of Object.entries(screenshots)) {
    assert.ok(games.find(game => game.id === id && game.play), `${id} must be playable`);
    assert.match(image.file, /^\/screenshots\/[a-z0-9-]+\.jpg$/);
    assert.ok(image.source && !files.has(image.file));
    files.add(image.file);
    assert.ok((await stat(new URL(`../public${image.file}`, import.meta.url))).size > 0);
  }
  assert.equal(files.size, 42);
});
