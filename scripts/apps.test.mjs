import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateApps} from './validate-apps.mjs';
const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const apps = JSON.parse(await read('../src/data/apps.json'));
const games = JSON.parse(await read('../src/data/games.json'));

test('Tool Shed has its own catalog, separate from all 149 games', async () => {
  const count = await validateApps(apps);
  assert.equal(count.total, 13);
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


test('three approved apps have verified publication links and release evidence', async () => {
  const expected = [
    ['kata-app-inspired-by-fl-studio-codex-dot', 'Kata Pulse Foundry', '3eca42123c77aba11c298acce6ddc1b8a14e55d1', '42738753303'],
    ['kata-app-inspired-by-reaper-codex-dot', 'Trackstead', 'e0f8e53f550bb9848edfbae6f5777a9684293aa4', '42738671042'],
    ['kata-app-inspired-by-krita-codex-dot', 'Kata Mosslight', 'eb983976824eb1167122acafe0f98206399d7870', '42738675983']
  ];
  assert.equal(apps.filter(app => app.status === 'live').length, 13);
  for (const [id, title, sha, run] of expected) {
    const app = apps.find(app => app.id === id);
    assert.equal(app.title, title);
    assert.equal(app.status, 'live');
    assert.equal(app.repo, `https://github.com/intrepion/${id}`);
    assert.equal(app.launch, `https://intrepion.github.io/${id}/`);
    assert.equal(app.verified, '2026-11-10');
    assert.ok(app.verificationEvidence.includes(sha));
    assert.ok(app.verificationEvidence.includes(run));
    assert.equal(app.screenshots.length, 2);
    assert.ok(app.screenshots.every(shot => shot.source.includes('http://127.0.0.1:4173/')));
    await validateApps([app]);
  }
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


test('Fluxgrove includes verified publication and truthful procedural scope', async () => {
  const app = apps.find(app => app.id === 'kata-app-inspired-by-houdini-codex-dot');
  assert.ok(app);
  assert.equal(app.title, 'Kata Fluxgrove');
  assert.equal(app.status, 'live');
  assert.match(app.verificationEvidence, /045a75ec46b7d70fd39ff10c9a871e04282f4f60/);
  assert.match(app.verificationEvidence, /42740821668/);
  assert.equal(app.screenshots.length, 2);
  assert.match(app.screenshots[1].caption, /390 CSS-pixel-wide/);
  assert.ok(app.projectNotes.some(note => note.includes('not a branching node graph or a physical simulation')));
  await validateApps([app]);
});


const creativeScopes = [
  ['blender', 'Kata Formyard', /40 objects/, /OBJ/],
  ['zbrush', 'Kata Claywell', /1,962 vertices/, /fixed-topology/],
  ['character-creator-5', 'Kata Persona Forge', /weighted 53-bone skeleton/, /textured, rigged GLB/],
  ['substance-3d-painter', 'Kata Patina Lab', /not a physically based renderer/, /sphere-only/],
  ['maya', 'Kata Kinframe', /2D FK puppet/, /2D forward-kinematic/],
  ['cinema-4d', 'Kata Orbitweave', /Canvas 2D orthographic/, /3D coordinates/]
];
for (const [slug, title, scope, description] of creativeScopes) {
  test(`${title} retains accurate scope and intact localhost screenshots`, async () => {
    const app = apps.find(app => app.id === `kata-app-inspired-by-${slug}-codex-dot`);
    assert.equal(app.title, title);
    assert.match(app.projectNotes.join(' '), scope);
    assert.match(app.description, description);
    assert.notEqual(app.description, app.tagline);
    const revised = ['character-creator-5', 'maya'].includes(slug);
    assert.equal(app.screenshots.length, slug === 'maya' ? 1 : 2);
    assert.ok(app.screenshots.every(shot => shot.file.endsWith(revised ? '.jpg' : '.png')));
    for (const shot of app.screenshots) {
      const bytes = await readFile(new URL(`../public${shot.file}`, import.meta.url));
      if (revised) {
        assert.deepEqual([...bytes.subarray(0,3)], [0xff,0xd8,0xff]);
        let dimensions;
        for (let offset = 2; offset < bytes.length;) {
          assert.equal(bytes[offset], 0xff);
          const marker = bytes[offset + 1];
          const length = bytes.readUInt16BE(offset + 2);
          if ([0xc0,0xc1,0xc2].includes(marker)) {
            dimensions = [bytes.readUInt16BE(offset + 7), bytes.readUInt16BE(offset + 5)];
            break;
          }
          offset += length + 2;
        }
        assert.deepEqual(dimensions, [shot.width, shot.height]);
      } else {
        assert.equal(bytes.subarray(1,4).toString(), 'PNG');
        assert.deepEqual([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], [shot.width, shot.height]);
      }
    }
    assert.ok(app.screenshots.every(shot => /localhost HTTP capture/.test(shot.source)));
    if (!revised && slug !== 'character-creator-5') {
      assert.match(app.screenshots[1].source, /iframe/);
      assert.match(app.screenshots[1].source, /not a physical-device test/);
    }
    assert.match(app.verificationEvidence, /native OS file pickers and downloaded-file round trips are not verified/);
    await validateApps([app]);
  });
}


test('six creative releases record their final verified publication', () => {
  const releases = {"blender": ["a7406ea83d6a8691544f849027dfeb676e418c04", "42749065191"], "zbrush": ["8ead396b262afe2b4dafa6a5d3cb42629b9781f2", "42749037267"], "character-creator-5": ["3826ab42c349f15d40dfd9cc3fcc66753addd272", "42749030109"], "substance-3d-painter": ["b378469228d379549abe7087f2f74b530e97a3a9", "42749071856"], "maya": ["074d6fc60ea86078fc7abdc1395203c54006fce4", "42749049119"], "cinema-4d": ["9ecd7be7962037b677418ad33ebd70cf02f94930", "42749083158"]};
  for (const [slug, [head, run]] of Object.entries(releases)) {
    const app = apps.find(app => app.id === `kata-app-inspired-by-${slug}-codex-dot`);
    assert.equal(app.status, 'live');
    assert.equal(app.repo, `https://github.com/intrepion/${app.id}`);
    assert.equal(app.launch, `https://intrepion.github.io/${app.id}/`);
    assert.equal(app.verified, '2026-11-10');
    assert.ok(app.verificationEvidence.includes(head));
    assert.ok(app.verificationEvidence.includes(run));
  }
});


test('Persona Forge and Kinframe revision captures retain accurate scope', () => {
  const persona = apps.find(app => app.inspiration === 'Character Creator 5');
  assert.deepEqual(persona.screenshots.map(shot => shot.file.split('/').pop()), ['persona-foundation-desktop.jpg', 'persona-foundation-face.jpg']);
  assert.ok(persona.projectNotes.some(note => note.includes('WebGL/GPU rendering and low-powered-device performance remain unverified')));
  const kinframe = apps.find(app => app.inspiration === 'Autodesk Maya');
  assert.match(kinframe.screenshots[0].file, /motion-review\.jpg$/);
  assert.match(kinframe.screenshots[0].source, /test-only pose sheet, not the production editor UI/);
  assert.ok(kinframe.projectNotes.some(note => note.includes('Existing autosaves remain unchanged')));
});

test('revised Persona Forge and Kinframe releases have verified exact commit evidence', () => {
  for (const [inspiration, sha, run] of [
    ['Character Creator 5', '2e26ad7bcb5721adcb191f8db5c96273b84dac7f', '42760407167'],
    ['Autodesk Maya', '4d2e94fa76dfaeb02b1745085d25fee6dc075b42', '42760341280']
  ]) {
    const app = apps.find(app => app.inspiration === inspiration);
    assert.ok(app.verificationEvidence.includes(sha));
    assert.ok(app.verificationEvidence.includes(run));
    assert.ok(app.screenshots.every(shot => shot.source.includes('not exact deployed-build provenance')));
  }
});


test('Persona human foundation describes rigged exports and approximate migration honestly', () => {
  const persona = apps.find(app => app.inspiration === 'Character Creator 5');
  const notes = persona.projectNotes.join(' ');
  assert.match(notes, /CC0 anatomical adult/);
  assert.match(notes, /ten appearance morph targets plus three pose corrective morphs/);
  assert.match(notes, /Version-1 migration is explicitly approximate/);
  assert.match(notes, /Blender 4.3.2/);
  assert.match(notes, /zero errors and four documented warnings/);
  assert.ok(persona.screenshots.every(shot => shot.source.includes('same-human software preview')));
  assert.ok(persona.features.some(feature => feature.includes('rigged GLB')));
  assert.ok(!persona.features.some(feature => feature.includes('OBJ')));
});


test('Persona human foundation records verified deployment and live asset identity', () => {
  const persona = apps.find(app => app.inspiration === 'Character Creator 5');
  assert.match(persona.verificationEvidence, /e4bcb71a217f293876c03c95ab98d7e09e81d02d/);
  assert.match(persona.verificationEvidence, /42769111188/);
  assert.match(persona.verificationEvidence, /6,667,684-byte assets\/human\/foundation.glb byte-match/);
});


test('Persona deformation correction records scope and preserves historical screenshots', () => {
  const persona = apps.find(app => app.inspiration === 'Character Creator 5');
  assert.match(persona.projectNotes.join(' '), /Pose correctives preserve joint volume but remain approximate/);
  assert.match(persona.verificationEvidence, /c0e7c43fb0b8667c206f899b306ca6caf3afa05d/);
  assert.match(persona.verificationEvidence, /7,391,544 bytes/);
  assert.match(persona.verificationEvidence, /43 visual comparisons/);
  assert.match(persona.verificationEvidence, /hardware WebGL remains unverified/);
  assert.match(persona.verificationEvidence, /error-9 cause is unconfirmed/);
  assert.ok(persona.screenshots.every(shot => shot.source.includes('Local pre-publication capture')));
});
