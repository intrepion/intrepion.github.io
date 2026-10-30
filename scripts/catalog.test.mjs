import test from 'node:test';
import assert from 'node:assert/strict';
import { games, validate } from './validate-catalog.mjs';
test('catalog includes every reconciled game with separate source-only entries', () => {
  assert.deepEqual(validate(games), { total: 132, playable: 115, sourceOnly: 17 });
  assert.equal(new Set(games.filter(game => game.play).map(game => game.category)).size, 5);
});
test('current names and protected project paths survive the root-site migration', () => {
  for (const [id, title] of [['kata-inspired-by-untitled-goose-game-codex-dot', 'Puddle Trouble'], ['kata-inspired-by-wordle-codex-dot', 'Lexi Conquest'], ['kata-inspired-by-connections-codex-dot', 'Common Thread'], ['kata-minecraft-clone-gpt-6-luna-extra-high', 'Blockbound']]) {
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
