import test from 'node:test';
import assert from 'node:assert/strict';
import { games, validate } from './validate-catalog.mjs';
test('catalog includes every reconciled playable game', () => {
  assert.deepEqual(validate(games), { total: 149, playable: 149, sourceOnly: 0 });
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
  assert.equal(files.size, 45);
});

test('every playable genre has a unique route and every route has games', async () => {
  const { genreDetails, slugify } = await import('../src/data/genres.mjs');
  const genres = Object.keys(genreDetails);
  assert.equal(new Set(genres.map(slugify)).size, genres.length);
  const playable = games.filter(game => game.play);
  for (const game of playable) for (const genre of game.genres) assert.ok(genreDetails[genre], `Missing route for ${genre}`);
  for (const genre of genres) assert.ok(playable.some(game => game.genres.includes(genre)), `Empty genre: ${genre}`);
  assert.equal(slugify('Board & card'), 'board-and-card');
});

test('inspiration routes are unique, canonical, and cover all playable editions', async () => {
  const { groupInspirations, canonicalInspiration } = await import('../src/data/inspirations.mjs');
  const groups = groupInspirations(games);
  assert.equal(new Set(groups.map(group => group.slug)).size, groups.length, 'inspiration slugs must not collide');
  const playable = games.filter(game => game.play);
  assert.equal(groups.flatMap(group => group.games).length, playable.length);
  assert.equal(new Set(groups.flatMap(group => group.games.map(game => game.id))).size, playable.length);
  assert.equal(canonicalInspiration('Final Fantasy 10'), 'Final Fantasy X');
  assert.ok(groups.find(group => group.name === 'Final Fantasy X').games.length > 1);
  assert.ok(groups.find(group => group.name === 'Braid').games[0].genres.includes('Puzzle'));
  assert.ok(groups.find(group => group.name === 'Braid').games[0].genres.includes('Platformer'));
});

test('additional captures have valid sources and unique local files', async () => {
  const { readFile, stat } = await import('node:fs/promises');
  const extras = JSON.parse(await readFile(new URL('../src/data/extra-screenshots.json', import.meta.url), 'utf8'));
  const primary = JSON.parse(await readFile(new URL('../src/data/screenshots.json', import.meta.url), 'utf8'));
  const files = new Set(Object.values(primary).map(image => image.file));
  for (const [id, images] of Object.entries(extras)) {
    assert.ok(games.some(game => game.id === id && game.play));
    for (const image of images) {
      assert.match(image.file, /^\/screenshots\/[a-z0-9-]+\.jpg$/);
      assert.ok(image.source && !files.has(image.file)); files.add(image.file);
      assert.ok((await stat(new URL(`../public${image.file}`, import.meta.url))).size > 0);
    }
  }
  assert.equal(files.size, 72);
});

test('home search indexes genres, inspirations, and individual games with distinct routes', async () => {
  const { makeSearchIndex, matchesSearch } = await import('../src/data/search.mjs');
  const { genreDetails } = await import('../src/data/genres.mjs');
  const index = makeSearchIndex(games, Object.keys(genreDetails));
  for (const [query, type, href] of [['puzzle','Genre','/genres/puzzle/'], ['braid','Inspiration','/inspirations/braid/'], ['hours we keep','Game','/games/kata-inspired-by-braid-codex-dot/']]) {
    assert.ok(index.some(item => item.type === type && item.href === href && matchesSearch(item.search, query)), query);
  }
  assert.equal(index.filter(item => item.type === 'Game').length, 149);
  assert.equal(matchesSearch('Braid', '  '), false);
  assert.equal(matchesSearch('The Hours We Keep', 'HOURS keep'), true);
  assert.equal(index.some(item => matchesSearch(item.search, 'zzzxqnone')), false);
});

test('game-owned pilot snapshots validate and failed sync preserves the previous index', async () => {
  const { mkdtemp, mkdir, readFile, writeFile, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { createHash } = await import('node:crypto');
  const { pilotIds, syncPilot } = await import('./pilot-sync.mjs');
  const tmp = await mkdtemp(join(tmpdir(), 'arcade-pilot-'));
  const bytes = await readFile(new URL('../public/screenshots/vice-district.jpg', import.meta.url));
  const hash = createHash('sha256').update(bytes).digest('hex');
  try {
    for (const id of pilotIds) {
      const root = join(tmp, 'games', id, 'public', 'arcade');
      await mkdir(join(root, 'screenshots'), {recursive:true});
      await writeFile(join(root, 'screenshots', 'view-01.jpg'), bytes);
      await writeFile(join(root, 'manifest.json'), JSON.stringify({schemaVersion:1, gameId:id, playUrl:`https://intrepion.github.io/${id}/`, screenshots:[{path:'arcade/screenshots/view-01.jpg', sha256:hash, alt:'Gameplay view', provenance:{kind:'existing_repository_capture',sourcePath:'original.jpg',deployedBuild:null,captureDate:null}}]}));
    }
    const target = join(tmp, 'gallery');
    const first = await syncPilot(join(tmp, 'games'), target);
    assert.equal(Object.keys(first).length, 2);
    const index = join(target, 'src/data/pilot-screenshots.json');
    const before = await readFile(index, 'utf8');
    await syncPilot(join(tmp, 'games'), target);
    assert.equal(await readFile(index, 'utf8'), before, 'sync is deterministic');
    await writeFile(join(tmp,'games',pilotIds[1],'public','arcade','screenshots','view-01.jpg'), 'corrupt');
    await assert.rejects(syncPilot(join(tmp, 'games'), target), /hash or format mismatch/);
    assert.equal(await readFile(index, 'utf8'), before, 'invalid input must not replace the snapshot');
  } finally { await rm(tmp,{recursive:true,force:true}); }
});

test('checked-in game-owned snapshots match their hashes and preserve provenance', async () => {
  const {readFile} = await import('node:fs/promises');
  const {createHash} = await import('node:crypto');
  const snapshot = JSON.parse(await readFile(new URL('../src/data/pilot-screenshots.json', import.meta.url), 'utf8'));
  const ids = JSON.parse(await readFile(new URL('../src/data/game-owned-ids.json', import.meta.url), 'utf8'));
  assert.deepEqual(Object.keys(snapshot), ids);
  for (const [id, images] of Object.entries(snapshot)) {
    assert.ok(games.some(game => game.id === id && game.play));
    for (const image of images) {
      assert.ok(['existing_repository_capture', 'ci_gameplay_capture', 'local_gameplay_capture'].includes(image.provenance));
      if (image.provenance === 'ci_gameplay_capture') { assert.match(image.capture.captureCommit, /^[a-f0-9]{40}$/); assert.match(image.capture.workflowRunId, /^[0-9]+$/); }
      assert.match(image.file, /^\/screenshots\/game-owned\/kata-[a-z0-9.-]+\/[a-f0-9]{64}-(?:view-\d{2}|[a-z][a-z0-9-]*-\d{8}-\d{2})\.jpg$/);
      const bytes = await readFile(new URL(`../public${image.file}`,import.meta.url));
      assert.equal(createHash('sha256').update(bytes).digest('hex'), image.sha256);
    }
  }
});

test('every playable game has a registered game-owned manifest', async () => {
  const { readFile } = await import('node:fs/promises');
  const ids = JSON.parse(await readFile(new URL('../src/data/game-owned-ids.json', import.meta.url), 'utf8'));
  assert.deepEqual([...ids].sort(), games.filter(game => game.play).map(game => game.id).sort());
});

test('game-owned sync accepts an explicit empty screenshot list', async () => {
  const {mkdtemp, mkdir, writeFile, readFile, rm} = await import('node:fs/promises');
  const {tmpdir} = await import('node:os');
  const {join} = await import('node:path');
  const {syncGames} = await import('./pilot-sync.mjs');
  const tmp = await mkdtemp(join(tmpdir(),'arcade-empty-'));
  const id = 'kata-example';
  try {
    const dir=join(tmp,'games',id,'public','arcade'); await mkdir(dir,{recursive:true});
    await writeFile(join(dir,'manifest.json'),JSON.stringify({schemaVersion:1,gameId:id,playUrl:`https://intrepion.github.io/${id}/`,screenshots:[]}));
    const snapshot=await syncGames(join(tmp,'games'),[id],join(tmp,'gallery'));
    assert.deepEqual(snapshot[id],[]);
    assert.deepEqual(JSON.parse(await readFile(join(tmp,'gallery','src/data/pilot-screenshots.json'),'utf8'))[id],[]);
    await assert.rejects(syncGames(join(tmp,'games'),[id,id],join(tmp,'gallery')),/Invalid game IDs/);
  } finally {await rm(tmp,{recursive:true,force:true});}
});


test('CI captures require valid provenance and untampered original evidence', async () => {
  const {mkdtemp, mkdir, writeFile, rm} = await import('node:fs/promises');
  const {tmpdir} = await import('node:os');
  const {join} = await import('node:path');
  const {createHash} = await import('node:crypto');
  const {syncGames} = await import('./pilot-sync.mjs');
  const tmp = await mkdtemp(join(tmpdir(), 'arcade-ci-')); const id = 'kata-example';
  const dir = join(tmp, 'games', id, 'public', 'arcade');
  const hash = b => createHash('sha256').update(b).digest('hex');
  try {
    await mkdir(join(dir, 'screenshots'), {recursive:true}); await mkdir(join(dir, 'capture-evidence'), {recursive:true});
    const jpg = Buffer.from([255,216,255,217]); const png = Buffer.from('89504e470d0a1a0a00000000', 'hex');
    await writeFile(join(dir, 'screenshots/view-01.jpg'), jpg); await writeFile(join(dir, 'capture-evidence/rally-01.png'), png);
    const image = {path:'arcade/screenshots/view-01.jpg',sha256:hash(jpg),alt:'Game',provenance:{kind:'ci_gameplay_capture',sourcePath:'arcade/capture-evidence/rally-01.png',sourceSha256:hash(png),captureCommit:'a'.repeat(40),workflowRunId:'123',inputHashes:{'index.html':'b'.repeat(64)},publishedFilesVerifiedAt:'2026-11-02T02:26:25Z'}};
    const manifest = {schemaVersion:2,gameId:id,playUrl:`https://intrepion.github.io/${id}/`,screenshots:[image]};
    const save = () => writeFile(join(dir,'manifest.json'),JSON.stringify(manifest)); await save();
    const result = await syncGames(join(tmp,'games'),[id],join(tmp,'gallery')); assert.equal(result[id][0].capture.captureCommit,'a'.repeat(40));
    const record = Buffer.from(JSON.stringify({sourceCommit:'a'.repeat(40),runId:'123',inputs:{'index.html':'b'.repeat(64)}}));
    await writeFile(join(dir,'capture-evidence/record.json'),record);
    image.provenance.captureRecordPath='arcade/capture-evidence/record.json'; image.provenance.captureRecordSha256=hash(record); await save();
    await syncGames(join(tmp,'games'),[id],join(tmp,'gallery'));
    await writeFile(join(dir,'capture-evidence/record.json'),'tampered');
    await assert.rejects(syncGames(join(tmp,'games'),[id],join(tmp,'gallery')),/Capture record hash mismatch/);
    const wrongRecord = Buffer.from(JSON.stringify({sourceCommit:'c'.repeat(40),runId:'123',inputs:{'index.html':'b'.repeat(64)}}));
    await writeFile(join(dir,'capture-evidence/record.json'),wrongRecord); image.provenance.captureRecordSha256=hash(wrongRecord); await save();
    await assert.rejects(syncGames(join(tmp,'games'),[id],join(tmp,'gallery')),/Capture record provenance mismatch/);
    await writeFile(join(dir,'capture-evidence/record.json'),record); image.provenance.captureRecordSha256=hash(record); await save();
    manifest.schemaVersion=1; await save(); await assert.rejects(syncGames(join(tmp,'games'),[id],join(tmp,'gallery')),/Invalid screenshot metadata/);
    manifest.schemaVersion=2; image.provenance.captureCommit='bad'; await save(); await assert.rejects(syncGames(join(tmp,'games'),[id],join(tmp,'gallery')),/Invalid screenshot metadata/);
    image.provenance.captureCommit='a'.repeat(40); await save(); await writeFile(join(dir,'capture-evidence/rally-01.png'),'tampered');
    await assert.rejects(syncGames(join(tmp,'games'),[id],join(tmp,'gallery')),/evidence hash or format mismatch/);
  } finally {await rm(tmp,{recursive:true,force:true});}
});

test('Sprout & Soil has verified play, genre, inspiration, and title search routes', async () => {
  const id = 'kata-inspired-by-farmville-codex-dot';
  const game = games.find(game => game.id === id);
  assert.equal(game.title, 'Sprout & Soil');
  assert.equal(game.play, `https://intrepion.github.io/${id}/`);
  assert.equal(game.verified, '2026-11-05');
  assert.deepEqual(game.genres, ['Simulation & creative', 'Strategy']);
  const { makeSearchIndex, matchesSearch } = await import('../src/data/search.mjs');
  const { genreDetails } = await import('../src/data/genres.mjs');
  const index = makeSearchIndex(games, Object.keys(genreDetails));
  for (const query of ['Sprout', 'Sprout Soil']) {
    assert.ok(index.some(item => item.href === `/games/${id}/` && matchesSearch(item.search, query)));
  }
  assert.ok(index.some(item => item.href === '/inspirations/farmville/' && matchesSearch(item.search, 'FarmVille')));
});

test('publication rejects playable games without reviewed screenshots', async () => {
  const { validateScreenshotCoverage } = await import('./validate-screenshots.mjs');
  const { readFile } = await import('node:fs/promises');
  const snapshot = JSON.parse(await readFile(new URL('../src/data/pilot-screenshots.json', import.meta.url), 'utf8'));
  assert.equal(validateScreenshotCoverage(games, snapshot), games.filter(game => game.play).length);
  const game = { id: 'kata-new-game', play: 'https://intrepion.github.io/kata-new-game/' };
  assert.throws(() => validateScreenshotCoverage([game], {}), /kata-new-game/);
  assert.throws(() => validateScreenshotCoverage([game], { [game.id]: [] }), /kata-new-game/);
  assert.equal(validateScreenshotCoverage([{ ...game, play: null }], {}), 0);
  assert.equal(validateScreenshotCoverage([game], { [game.id]: [{ file: 'reviewed.jpg' }] }), 1);
});

test('local captures require truthful HTTP provenance and intact evidence', async () => {
  const { mkdtemp, mkdir, writeFile, readFile, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { createHash } = await import('node:crypto');
  const { syncGames } = await import('./pilot-sync.mjs');
  const tmp = await mkdtemp(join(tmpdir(), 'arcade-local-'));
  const id = 'kata-local-example';
  const dir = join(tmp, 'games', id, 'public', 'arcade');
  const hash = bytes => createHash('sha256').update(bytes).digest('hex');
  try {
    await mkdir(join(dir, 'screenshots'), { recursive: true });
    await mkdir(join(dir, 'capture-evidence'), { recursive: true });
    const jpg = Buffer.from([255, 216, 255, 217]);
    const png = Buffer.from('89504e470d0a1a0a00000000', 'hex');
    await writeFile(join(dir, 'screenshots/review-20261105-01.jpg'), jpg);
    await writeFile(join(dir, 'capture-evidence/review-20261105-01.png'), png);
    const provenance = { kind: 'local_gameplay_capture', sourcePath: 'arcade/capture-evidence/review-20261105-01.png', sourceSha256: hash(png), captureCommit: 'a'.repeat(40), capturedAt: '2026-11-05T05:00:00Z', inputHashes: { 'index.html': 'b'.repeat(64) }, captureRecordPath: 'arcade/capture-evidence/review-20261105-record.json', captureRecordSha256: '' };
    const record = { sourceCommit: provenance.captureCommit, inputs: provenance.inputHashes, capturedAt: provenance.capturedAt, baseUrl: 'http://127.0.0.1:4173/', tool: { name: 'Playwright', version: '1.56.1' }, browser: { name: 'Chromium', version: '141' }, viewport: { width: 1280, height: 800 }, steps: ['Start a new game and make one ordinary move.'] };
    const manifest = { schemaVersion: 3, gameId: id, playUrl: `https://intrepion.github.io/${id}/`, screenshots: [{ path: 'arcade/screenshots/review-20261105-01.jpg', sha256: hash(jpg), alt: 'A genuine gameplay capture', provenance }] };
    const save = async () => {
      const raw = JSON.stringify(record);
      provenance.captureRecordSha256 = hash(raw);
      await writeFile(join(dir, 'capture-evidence/review-20261105-record.json'), raw);
      await writeFile(join(dir, 'manifest.json'), JSON.stringify(manifest));
    };
    await save();
    const previous = { 'kata-existing': [{ file: '/screenshots/keep.jpg' }] };
    const target = join(tmp, 'gallery');
    const result = await syncGames(join(tmp, 'games'), [id], target, previous);
    assert.deepEqual(result['kata-existing'], previous['kata-existing'], 'selected sync preserves other games');
    assert.equal(result[id][0].capture.kind, 'local_gameplay_capture');
    assert.equal(result[id][0].capture.workflowRunId, undefined, 'local capture must not claim CI');
    const before = await readFile(join(target, 'src/data/pilot-screenshots.json'), 'utf8');
    record.baseUrl = 'file:///tmp/game/index.html'; await save();
    await assert.rejects(syncGames(join(tmp, 'games'), [id], target, previous), /Invalid local capture record/);
    assert.equal(await readFile(join(target, 'src/data/pilot-screenshots.json'), 'utf8'), before);
    record.baseUrl = 'https://example.com/'; await save();
    await assert.rejects(syncGames(join(tmp, 'games'), [id], target), /Invalid local capture record/);
    record.baseUrl = 'http://localhost:4173/'; record.capturedAt = '2026-11-04T05:00:00Z'; await save();
    await assert.rejects(syncGames(join(tmp, 'games'), [id], target), /Invalid local capture record/);
    record.capturedAt = provenance.capturedAt; record.steps = []; await save();
    await assert.rejects(syncGames(join(tmp, 'games'), [id], target), /Invalid local capture record/);
    record.steps = ['Make an ordinary gameplay move.']; provenance.workflowRunId = '123'; await save();
    await assert.rejects(syncGames(join(tmp, 'games'), [id], target), /Invalid screenshot metadata/);
    delete provenance.workflowRunId; await save();
    await writeFile(join(dir, 'capture-evidence/review-20261105-01.png'), 'tampered');
    await assert.rejects(syncGames(join(tmp, 'games'), [id], target), /evidence hash or format mismatch/);
  } finally { await rm(tmp, { recursive: true, force: true }); }
});


test('Nightfall Reliquary has play, search, inspiration and two reviewed gameplay captures', async () => {
  const id = 'kata-inspired-by-vampire-survivors-codex-dot';
  const game = games.find(game => game.id === id);
  assert.equal(game.title, 'Nightfall Reliquary');
  assert.equal(game.play, `https://intrepion.github.io/${id}/`);
  assert.equal(game.inspiration, 'Vampire Survivors');
  const { makeSearchIndex, matchesSearch } = await import('../src/data/search.mjs');
  const { genreDetails } = await import('../src/data/genres.mjs');
  const index = makeSearchIndex(games, Object.keys(genreDetails));
  assert.ok(index.some(item => item.href === `/games/${id}/` && matchesSearch(item.search, 'Nightfall Reliquary')));
  assert.ok(index.some(item => item.href === '/inspirations/vampire-survivors/' && matchesSearch(item.search, 'Vampire Survivors')));
  const { readFile } = await import('node:fs/promises');
  const snapshot = JSON.parse(await readFile(new URL('../src/data/pilot-screenshots.json', import.meta.url), 'utf8'));
  assert.equal(snapshot[id].length, 2);
  assert.ok(snapshot[id].every(image => image.provenance === 'local_gameplay_capture'));
});

test('CUA local captures accept genuine JPEG originals and reject mislabeled evidence', async () => {
  const { mkdtemp, mkdir, writeFile, readFile, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { createHash } = await import('node:crypto');
  const { syncGames } = await import('./pilot-sync.mjs');
  const tmp = await mkdtemp(join(tmpdir(), 'arcade-cua-'));
  const id = 'kata-cua-example';
  const dir = join(tmp, 'games', id, 'public', 'arcade');
  const hash = bytes => createHash('sha256').update(bytes).digest('hex');
  try {
    await mkdir(join(dir, 'screenshots'), { recursive: true });
    await mkdir(join(dir, 'capture-evidence'), { recursive: true });
    const jpg = await readFile(new URL('../public/screenshots/vice-district.jpg', import.meta.url));
    const png = Buffer.from('89504e470d0a1a0a00000000', 'hex');
    await writeFile(join(dir, 'screenshots/view-01.jpg'), jpg);
    await writeFile(join(dir, 'capture-evidence/view-01.jpg'), jpg);
    const provenance = { kind: 'local_gameplay_capture', sourcePath: 'arcade/capture-evidence/view-01.jpg', sourceSha256: hash(jpg), captureCommit: 'a'.repeat(40), capturedAt: '2026-11-05T05:00:00Z', inputHashes: { 'index.html': 'b'.repeat(64) }, captureRecordPath: 'arcade/capture-evidence/record.json', captureRecordSha256: '' };
    const record = { sourceCommit: provenance.captureCommit, inputs: provenance.inputHashes, capturedAt: provenance.capturedAt, baseUrl: 'http://127.0.0.1:4173/', tool: { name: 'cua_repl', version: 'browser-runtime' }, browser: { name: 'Chrome', version: '141' }, viewport: { width: 1280, height: 800 }, steps: ['Make one ordinary gameplay move.'] };
    const manifest = { schemaVersion: 3, gameId: id, playUrl: `https://intrepion.github.io/${id}/`, screenshots: [{ path: 'arcade/screenshots/view-01.jpg', sha256: hash(jpg), alt: 'JPEG gameplay capture', provenance }] };
    const save = async () => {
      const raw = JSON.stringify(record);
      provenance.captureRecordSha256 = hash(raw);
      await writeFile(join(dir, 'capture-evidence/record.json'), raw);
      await writeFile(join(dir, 'manifest.json'), JSON.stringify(manifest));
    };
    await save();
    const target = join(tmp, 'gallery');
    const result = await syncGames(join(tmp, 'games'), [id], target);
    assert.equal(result[id][0].capture.sourcePath, provenance.sourcePath);
    assert.equal(result[id][0].capture.sourceSha256, hash(jpg));
    const before = await readFile(join(target, 'src/data/pilot-screenshots.json'), 'utf8');
    // Even a matching hash cannot turn PNG bytes into valid JPEG evidence.
    await writeFile(join(dir, 'capture-evidence/view-01.jpg'), png);
    provenance.sourceSha256 = hash(png); await save();
    await assert.rejects(syncGames(join(tmp, 'games'), [id], target), /evidence hash or format mismatch/);
    assert.equal(await readFile(join(target, 'src/data/pilot-screenshots.json'), 'utf8'), before);
    await writeFile(join(dir, 'capture-evidence/view-01.jpg'), jpg);
    provenance.sourceSha256 = hash(jpg);
    record.tool = { name: 'Playwright', version: '1.56.1' }; await save();
    await assert.rejects(syncGames(join(tmp, 'games'), [id], target), /Invalid local capture record/);
    record.tool = { name: 'cua_repl', version: 'invented-version' }; await save();
    await assert.rejects(syncGames(join(tmp, 'games'), [id], target), /Invalid local capture record/);
    record.tool.version = 'browser-runtime';
    provenance.sourcePath = 'arcade/capture-evidence/view-01.png'; await save();
    await assert.rejects(syncGames(join(tmp, 'games'), [id], target), /Invalid local capture record/);
  } finally { await rm(tmp, { recursive: true, force: true }); }
});

test('Quiet Grid has Picross discovery routes and two reviewed local gameplay captures', async () => {
  const id = 'kata-inspired-by-picross-codex-dot';
  const game = games.find(game => game.id === id);
  assert.equal(game.title, 'Quiet Grid');
  assert.equal(game.play, `https://intrepion.github.io/${id}/`);
  assert.equal(game.inspiration, 'Picross');
  assert.deepEqual(game.genres, ['Puzzle']);
  const { makeSearchIndex, matchesSearch } = await import('../src/data/search.mjs');
  const { genreDetails } = await import('../src/data/genres.mjs');
  const index = makeSearchIndex(games, Object.keys(genreDetails));
  assert.ok(index.some(item => item.href === `/games/${id}/` && matchesSearch(item.search, 'Quiet Grid')));
  assert.ok(index.some(item => item.href === '/inspirations/picross/' && matchesSearch(item.search, 'Picross')));
  const { readFile } = await import('node:fs/promises');
  const snapshot = JSON.parse(await readFile(new URL('../src/data/pilot-screenshots.json', import.meta.url), 'utf8'));
  assert.equal(snapshot[id].length, 2);
  assert.ok(snapshot[id].every(image => image.provenance === 'local_gameplay_capture' && image.capture.sourcePath.endsWith('.jpg')));
});


test('Embervale has RuneScape discovery routes and reviewed local gameplay captures', async () => {
  const id = 'kata-inspired-by-runescape-codex-dot';
  const game = games.find(game => game.id === id);
  assert.equal(game.title, 'Embervale');
  assert.equal(game.play, `https://intrepion.github.io/${id}/`);
  assert.equal(game.inspiration, 'RuneScape');
  assert.deepEqual(game.genres, ['Adventure', 'Role-playing']);
  assert.ok(!game.evidence.includes('pending'));
  const { makeSearchIndex, matchesSearch } = await import('../src/data/search.mjs');
  const { genreDetails } = await import('../src/data/genres.mjs');
  const index = makeSearchIndex(games, Object.keys(genreDetails));
  assert.ok(index.some(item => item.href === `/games/${id}/` && matchesSearch(item.search, 'Embervale')));
  assert.ok(index.some(item => item.href === '/inspirations/runescape/' && matchesSearch(item.search, 'RuneScape')));
  const { readFile } = await import('node:fs/promises');
  const snapshot = JSON.parse(await readFile(new URL('../src/data/pilot-screenshots.json', import.meta.url), 'utf8'));
  assert.equal(snapshot[id].length, 2);
  assert.ok(snapshot[id].every(image => image.provenance === 'local_gameplay_capture' && image.capture.sourcePath.endsWith('.png')));
});


test('Morrow Garden has Pikmin discovery routes and two reviewed local gameplay captures', async () => {
  const id = 'kata-inspired-by-pikmin-codex-dot';
  const game = games.find(game => game.id === id);
  assert.equal(game.title, 'Morrow Garden');
  assert.ok(!game.evidence.includes('PENDING'));
  assert.ok(game.evidence.includes('42317682862'));
  assert.equal(game.inspiration, 'Pikmin');
  assert.deepEqual(game.genres, ['Strategy', 'Adventure']);
  assert.equal(game.play, `https://intrepion.github.io/${id}/`);
  assert.equal(game.verified, '2026-11-07');
  const { makeSearchIndex, matchesSearch } = await import('../src/data/search.mjs');
  const index = makeSearchIndex(games, []);
  assert.ok(index.some(item => item.href === `/games/${id}/` && matchesSearch(item.search, 'Morrow Garden')));
  assert.ok(index.some(item => item.href === '/inspirations/pikmin/' && matchesSearch(item.search, 'Pikmin')));
  const {readFile} = await import('node:fs/promises');
  const snapshot = JSON.parse(await readFile(new URL('../src/data/pilot-screenshots.json', import.meta.url), 'utf8'));
  assert.equal(snapshot[id].length, 2);
  assert.ok(snapshot[id].every(image => image.provenance === 'local_gameplay_capture' && image.capture.captureCommit === '1a885d283b4e8666ebf670eb83adfb71df06cbbb'));
});
