import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateApps} from './validate-apps.mjs';
const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const apps = JSON.parse(await read('../src/data/apps.json'));
const games = JSON.parse(await read('../src/data/games.json'));

test('Tool Shed has its own catalog, separate from all 149 games', async () => {
  const count = await validateApps(apps);
  assert.equal(count.total, 1);
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
