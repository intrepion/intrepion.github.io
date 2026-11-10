import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateApps} from './validate-apps.mjs';
const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const apps = JSON.parse(await read('../src/data/apps.json'));
const games = JSON.parse(await read('../src/data/games.json'));

test('Tool Shed has its own catalog, separate from all 149 games', async () => {
  const count = await validateApps(apps);
  assert.equal(count.total, 6);
  assert.equal(apps[0].id, 'kata-app-inspired-by-jsfxr-codex-dot');
  assert.equal(apps[0].title, 'Kata Sound Lab');
  assert.equal(apps[0].inspiration, 'jsfxr');
  assert.equal(games.length, 149);
  assert.ok(apps.every(app => !games.some(game => game.id === app.id)));
});

test('unpublished app cannot silently advertise a public launch or verification', async () => {
  const preview = {...apps[0], status:'preview', launch:null, verified:null};
  await validateApps([preview]);
  await assert.rejects(validateApps([{...preview, launch:`https://intrepion.github.io/${preview.id}/`}]), /unverified launch/);
  await assert.rejects(validateApps([{...preview, verified:'2026-11-09'}]), /claim deployment/);
  await assert.rejects(validateApps([preview, preview]), /Duplicate app/);
});

test('live app requires matching project URLs, verification, and screenshots', async () => {
  const live = {...apps[0],status:'live',repo:`https://github.com/intrepion/${apps[0].id}`,launch:`https://intrepion.github.io/${apps[0].id}/`,verified:'2026-11-09'};
  await assert.rejects(validateApps([{...live, screenshots:[]}]), /reviewed screenshots/);
  await assert.rejects(validateApps([{...live, launch:'https://example.com/'}]), /match its project/);
  await assert.rejects(validateApps([{...live, repo:'https://github.com/intrepion/wrong'}]), /match its ID/);
  await assert.rejects(validateApps([{...live, verified:null}]), /verification date/);
  await assert.rejects(validateApps([{...live, verificationEvidence:null}]), /verification evidence/);
});

test('root retains the old genre and about anchors without relying on JavaScript', async () => {
  const home = await read('../src/pages/index.astro');
  assert.match(home, /id="genres"/); assert.match(home, /id="about"/);
  assert.match(home, /href="\/arcade\/"/); assert.match(home, /href="\/tools\/"/);
  assert.match(home, /Object\.keys\(genreDetails\)\.map/);
  assert.doesNotMatch(home, /location\.(replace|href)/);
});

test('Arcade keeps full search, genre browsing, and shared theme controls', async () => {
  const arcade = await read('../src/pages/arcade/index.astro');
  const layout = await read('../src/layouts/Base.astro');
  for (const id of ['home-search-input', 'home-search-clear', 'home-search-reset', 'home-search-empty', 'genres', 'about']) assert.ok(arcade.includes(`id="${id}"`), id);
  assert.match(layout, /id="theme-toggle"/);
  assert.match(layout, /aria-current/);
  assert.match(layout, /href="#main"/);
  for (const type of ['genres/[genre]', 'inspirations/[inspiration]']) assert.match(await read(`../src/pages/${type}.astro`), /href="\/arcade\/#genres"/);
});

test('app pages render launch and source links only when published data supplies them', async () => {
  const page = await read('../src/pages/apps/[app].astro');
  assert.match(page, /app\.launch \?/);
  assert.match(page, /app\.repo &&/);
  assert.match(page, /Unpublished local preview/);
  assert.match(page, /local HTTP server/);
});

function luminance(hex) {
  const rgb = hex.match(/../g).map(part => parseInt(part, 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}
function contrast(a,b) { const l=[luminance(a),luminance(b)].sort((a,b)=>b-a);return (l[0]+.05)/(l[1]+.05); }
test('fixed collection palettes retain readable text and keyboard focus in both themes', () => {
  for (const [ink,bg,min] of [['f7f8eb','193d33',4.5],['352719','f0be8c',4.5],['fff5e7','382c22',4.5],['e1d1c1','382c22',4.5],['ebc49b','382c22',4.5],['f4bd82','382c22',4.5],['352719','f3bd83',4.5],['fff3b9','193d33',3],['713a1a','f0be8c',3],['ffcf91','382c22',3]]) assert.ok(contrast(ink,bg)>=min, `${ink}/${bg}: ${contrast(ink,bg)}`);
});


test('Sound Lab includes two intact and truthfully labeled local screenshots', async () => {
  const app = apps[0];
  assert.equal(app.screenshots.length, 2);
  assert.deepEqual(app.screenshots.map(shot => [shot.width,shot.height]), [[1165,1185],[485,1636]]);
  assert.ok(app.screenshots.every(shot => shot.source.includes('http://127.0.0.1:4173/')));
  assert.match(app.screenshots[1].caption, /500 CSS-pixel/);
  assert.match(app.screenshots[1].source, /not a physical-device test/);
  await assert.rejects(validateApps([{...app,screenshots:[{...app.screenshots[0],sha256:'0'.repeat(64)}]}]), /Screenshot hash mismatch/);
  await assert.rejects(validateApps([{...app,screenshots:[{...app.screenshots[0],alt:''}]}]), /description and source/);
  assert.ok(app.projectNotes.some(note => note.includes('jsfxr preset files are not compatible')));
});


test('published Sound Lab links point to the verified app and repository', () => {
  assert.equal(apps[0].status, 'live');
  assert.equal(apps[0].launch, 'https://intrepion.github.io/kata-app-inspired-by-jsfxr-codex-dot/');
  assert.equal(apps[0].repo, 'https://github.com/intrepion/kata-app-inspired-by-jsfxr-codex-dot');
  assert.equal(apps[0].verified, '2026-11-09');
  assert.match(apps[0].verificationEvidence, /42713404377/);
});


test('each app supplies its own attribution and compatibility notes', async () => {
  for (const app of apps) {
    assert.ok(app.projectNotes.some(note => note.includes(app.inspiration)));
    await assert.rejects(validateApps([{...app, projectNotes:[]}]), /Missing project notes/);
  }
  const page = await read('../src/pages/apps/[app].astro');
  assert.match(page, /Inside \{app\.title\}/);
  assert.match(page, /app\.projectNotes\.map/);
  assert.doesNotMatch(page, /jsfxr|Inside the Sound Lab/);
});


test('Wave Room is a separate Audacity-inspired single-clip editor', () => {
  const app = apps.find(app => app.id === 'kata-app-inspired-by-audacity-codex-dot');
  assert.ok(app);
  assert.equal(app.title, 'Kata Wave Room');
  assert.equal(app.inspiration, 'Audacity');
  assert.match(app.description, /mono or stereo clip/);
  assert.ok(app.projectNotes.some(note => note.includes('one audio clip at a time')));
  assert.ok(app.projectNotes.every(note => !/jsfxr|Sound Lab/.test(note)));
});


test('Wave Room has matching public links and intact local screenshot provenance', async () => {
  const app = apps.find(app => app.id === 'kata-app-inspired-by-audacity-codex-dot');
  assert.equal(app.status, 'live');
  assert.equal(app.launch, `https://intrepion.github.io/${app.id}/`);
  assert.equal(app.repo, `https://github.com/intrepion/${app.id}`);
  assert.equal(app.verified, '2026-11-10');
  assert.equal(app.screenshots.length, 2);
  assert.deepEqual(app.screenshots.map(shot => [shot.width,shot.height]), [[1133,1203],[375,1536]]);
  assert.ok(app.screenshots.every(shot => shot.source.includes('http://127.0.0.1:4174/')));
  assert.ok(app.screenshots.every(shot => shot.source.includes('before final selection/playback')));
  assert.match(app.screenshots[1].source, /not a physical-device test/);
  await validateApps([app]);
});


test('Pixel Loom has its own Aseprite-inspired graphics entry and honest compatibility limits', () => {
  const app = apps.find(app => app.id === 'kata-app-inspired-by-aseprite-codex-dot');
  assert.ok(app);
  assert.equal(app.title, 'Pixel Loom');
  assert.equal(app.inspiration, 'Aseprite');
  assert.equal(app.category, 'Graphics');
  assert.match(app.description, /pixel-art and flipbook editor/);
  assert.ok(app.features.includes('PNG frames and sprite-sheet export'));
  assert.ok(app.projectNotes.some(note => note.includes('Aseprite project files, GIF/APNG export, selections, and variable frame timing are not supported')));
  assert.ok(app.projectNotes.every(note => !/Audacity|jsfxr|Sound Lab|Wave Room/.test(note)));
});


test('Pixel Loom has verified public links and intact local screenshots', async () => {
  const app = apps.find(app => app.id === 'kata-app-inspired-by-aseprite-codex-dot');
  assert.equal(app.status, 'live');
  assert.equal(app.launch, `https://intrepion.github.io/${app.id}/`);
  assert.equal(app.repo, `https://github.com/intrepion/${app.id}`);
  assert.equal(app.verified, '2026-11-10');
  assert.match(app.verificationEvidence, /e95dd05be59ab83a4e8c0af4761933cc812e3e7e/);
  assert.match(app.verificationEvidence, /42732061963/);
  assert.equal(app.screenshots.length, 2);
  assert.deepEqual(app.screenshots.map(shot => [shot.width,shot.height]), [[1165,961],[485,1417]]);
  assert.ok(app.screenshots.every(shot => shot.source.includes('http://127.0.0.1:4173/')));
  assert.ok(app.screenshots.every(shot => shot.source.includes('pre-publication')));
  assert.match(app.screenshots[1].source, /not a physical-device test/);
  await validateApps([app]);
});


test('three new local prototypes stay unpublished with no invented destinations', async () => {
  const previews = apps.filter(app => app.status === 'preview');
  assert.deepEqual(previews.map(app => app.title), ['Kata Pulse Foundry', 'Trackstead', 'Kata Mosslight']);
  assert.equal(apps.filter(app => app.status === 'live').length, 3);
  for (const app of previews) {
    assert.equal(app.repo, null);
    assert.equal(app.launch, null);
    assert.equal(app.verified, null);
    assert.equal(app.verificationEvidence, null);
    assert.equal(app.screenshots.length, 2);
    assert.ok(app.screenshots.every(shot => shot.source.includes('http://127.0.0.1:4173/')));
  }
  await validateApps(previews);
});


test('prototype notes distinguish workflows, file formats, and untested hardware', () => {
  const pulse = apps.find(app => app.inspiration === 'FL Studio');
  const track = apps.find(app => app.inspiration === 'REAPER');
  const moss = apps.find(app => app.inspiration === 'Krita');
  assert.ok(pulse.projectNotes.some(note => note.includes('0.6-second sound tail')));
  assert.ok(pulse.projectNotes.some(note => note.includes('FLP')));
  assert.ok(track.projectNotes.some(note => note.includes('no autosave')));
  assert.ok(track.projectNotes.some(note => note.includes('real microphone hardware')));
  assert.ok(moss.projectNotes.some(note => note.includes('physical pen')));
  assert.ok(moss.projectNotes.some(note => note.includes('1200 × 900')));
  assert.match(track.screenshots[1].caption, /no microphone was accessed/);
  assert.match(moss.screenshots[1].source, /Not a physical-phone or full-page capture/);
});


test('two desktop screenshots get equal columns without stretching portrait previews', async () => {
  const page = await read('../src/pages/apps/[app].astro');
  const css = await read('../src/styles/collections.css');
  assert.match(page, /app\.screenshots\.every\(shot => shot\.width >= 800\)/);
  assert.match(css, /app-screenshot-grid\.app-screenshot-pair\{grid-template-columns:1fr 1fr\}/);
});
