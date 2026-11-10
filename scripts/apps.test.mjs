import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateApps} from './validate-apps.mjs';
const read = path => readFile(new URL(path, import.meta.url), 'utf8');
const apps = JSON.parse(await read('../src/data/apps.json'));
const games = JSON.parse(await read('../src/data/games.json'));

test('Tool Shed has its own catalog, separate from all 149 games', async () => {
  const count = await validateApps(apps);
  assert.equal(count.total, 16);
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
  assert.equal(apps.filter(app => app.status === 'live').length, 16);
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
  ['character-creator-5', 'Kata Persona Forge', /weighted 53-bone skeleton/, /editable GLB export/],
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
    assert.equal(app.screenshots.length, slug === 'character-creator-5' ? 5 : slug === 'maya' ? 1 : 2);
    assert.ok(app.screenshots.every((shot, index) => shot.file.endsWith(slug === 'character-creator-5' && index < 3 ? '.png' : revised ? '.jpg' : '.png')));
    for (const shot of app.screenshots) {
      const bytes = await readFile(new URL(`../public${shot.file}`, import.meta.url));
      if (revised && shot.file.endsWith('.jpg')) {
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
  assert.deepEqual(persona.screenshots.map(shot => shot.file.split('/').pop()), ['persona-blink-gaze.png', 'persona-skirt-comparison.png', 'persona-distinct-faces.png', 'persona-portrait-workspace.jpg', 'persona-portrait-face.jpg']);
  assert.ok(persona.projectNotes.some(note => note.includes('Other GPU/browser combinations and low-powered-device performance remain unverified')));
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
    if (inspiration === 'Autodesk Maya') assert.ok(app.screenshots.every(shot => shot.source.includes('not exact deployed-build provenance')));
  }
});


test('Persona human foundation describes rigged exports and approximate migration honestly', () => {
  const persona = apps.find(app => app.inspiration === 'Character Creator 5');
  const notes = persona.projectNotes.join(' ');
  assert.match(notes, /CC0 anatomical adult/);
  assert.match(notes, /twenty-eight appearance morph targets plus three pose corrective morphs/);
  assert.match(notes, /Version-1 migration is explicitly approximate/);
  assert.match(notes, /Blender 4.3.2/);
  assert.match(notes, /zero errors and four documented warnings/);
  assert.ok(persona.screenshots.every(shot => shot.source.includes('Apple M1 hardware WebGL')));
  assert.ok(persona.features.some(feature => feature.includes('rigged GLB')));
  assert.ok(!persona.features.some(feature => feature.includes('OBJ')));
});


test('Persona human foundation records verified deployment and live asset identity', () => {
  const persona = apps.find(app => app.inspiration === 'Character Creator 5');
  assert.match(persona.verificationEvidence, /e4bcb71a217f293876c03c95ab98d7e09e81d02d/);
  assert.match(persona.verificationEvidence, /42769111188/);
  assert.match(persona.verificationEvidence, /6,667,684-byte assets\/human\/foundation.glb byte-match/);
});


test('Persona deformation correction retains historical scope evidence', () => {
  const persona = apps.find(app => app.inspiration === 'Character Creator 5');
  assert.match(persona.projectNotes.join(' '), /Pose correctives preserve joint volume but remain approximate/);
  assert.match(persona.verificationEvidence, /c0e7c43fb0b8667c206f899b306ca6caf3afa05d/);
  assert.match(persona.verificationEvidence, /7,391,544 bytes/);
  assert.match(persona.verificationEvidence, /43 visual comparisons/);
  assert.match(persona.verificationEvidence, /hardware WebGL remains unverified/);
  assert.match(persona.verificationEvidence, /error-9 cause is unconfirmed/);
  assert.ok(persona.screenshots.every(shot => shot.source.includes('Local pre-publication capture')));
});


test('Persona waist repair records precise shading verification and limits', () => {
  const persona = apps.find(app => app.inspiration === 'Character Creator 5');
  assert.match(persona.verificationEvidence, /d8a302a6bc9aea10869d96f4f0d14b668f821830/);
  assert.match(persona.verificationEvidence, /ef437bacbb00960092da3ae23abecb1b0b02b8e6/);
  assert.match(persona.verificationEvidence, /42784499699/);
  assert.match(persona.verificationEvidence, /44 Node tests/);
  assert.match(persona.verificationEvidence, /All 48 deployed files returned HTTP 200/);
  assert.match(persona.verificationEvidence, /7,393,700 bytes/);
  assert.match(persona.verificationEvidence, /324895581787a5fd189862c4e28d725cf508fc107d01cd027e93fc28fe74fc78/);
  assert.match(persona.verificationEvidence, /supersedes the earlier overly broad software-preview claim/);
  assert.match(persona.verificationEvidence, /Hardware WebGL shadows remain unverified/);
  assert.match(persona.verificationEvidence, /docs\/QA-WAIST.md/);
  assert.ok(persona.screenshots.every(shot => shot.source.includes('Local pre-publication capture')));
});


test('worldbuilding and BASIC apps have verified destinations and distinct scope', async () => {
  const scopes = [
    ['tiled', 'Tilehaven', 'Tiled', /finite orthogonal/i, /native Tiled/],
    ['trenchbroom', 'Kata Brushkeep', 'TrenchBroom', /axis-aligned cuboid/i, /experimental/i],
    ['quickbasic-45', 'Bytewell', 'QuickBASIC 4.5', /BASIC subset/, /No arrays/]
  ];
  for (const [slug,title,inspiration,scope,limit] of scopes) {
    const id = `kata-app-inspired-by-${slug}-codex-dot`;
    const app=apps.find(item=>item.id===id);
    assert.equal(app.title,title); assert.equal(app.inspiration,inspiration);
    assert.equal(app.status,'live');
    assert.equal(app.launch,`https://intrepion.github.io/${id}/`);
    assert.equal(app.repo,`https://github.com/intrepion/${id}`);
    assert.match(app.verificationEvidence,/[a-f0-9]{40}/);
    assert.match(app.projectNotes.join(' '),scope);
    assert.match(app.projectNotes.join(' '),limit);
    assert.equal(app.screenshots.length,2);
    assert.ok(app.screenshots.every(shot=>shot.source.includes('http://127.0.0.1:4173/')));
    await validateApps([app]);
  }
});


test('Persona portrait release records hardware provenance and truthful visual limits', () => {
  const app=apps.find(app=>app.inspiration==='Character Creator 5');
  assert.match(app.verificationEvidence,/3a5fb77d854274e9796b81278798954fc69abfb2/);
  assert.match(app.verificationEvidence,/42793477651/);
  assert.match(app.projectNotes.join(' '),/not a photorealistic production groom/);
  assert.match(app.projectNotes.join(' '),/synthetic detail and tints of one diffuse skin source/);
  assert.ok(app.screenshots.slice(3).every(shot=>shot.source.includes('cf82a4d2dbc41509d413662829e15246d574c45d7f4d33412ecf7bb053206b0b')));
  assert.deepEqual(app.screenshots.slice(3).map(shot=>[shot.width,shot.height]),[[1133,1003],[1133,1003]]);
});


test('Persona distinct faces retain the original portrait and truthful comparison provenance', () => {
  const app = apps.find(app => app.inspiration === 'Character Creator 5');
  assert.match(app.description, /distinct adult faces/);
  assert.match(app.features.join(' '), /Nine additional fitted face controls/);
  assert.match(app.features.join(' '), /Twenty-eight editable appearance morph targets/);
  assert.match(app.projectNotes.join(' '), /Angular\/Vale, Rounded\/Marlowe and Long\/Ellis/);
  assert.match(app.projectNotes.join(' '), /preserved Explorer, Pilot and Botanist/);
  assert.match(app.projectNotes.join(' '), /approximately 23 MB/);
  assert.match(app.verificationEvidence, /d5e31df0d2f030ab1d15534d981a72dabdd4a5dc/);
  assert.match(app.verificationEvidence, /42803638969/);
  assert.match(app.verificationEvidence, /all 52 deployed files/);
  const [, , matrix, workspace, face] = app.screenshots;
  assert.deepEqual([matrix.width, matrix.height], [1056, 1096]);
  assert.equal(matrix.sha256, '72da775ccd2859af761ffdb2748929fe01056435a79f3b7aa995304e2886d380');
  assert.match(matrix.caption, /test-only rendered comparison sheet, not the production editor UI/);
  assert.match(matrix.source, /http:\/\/127\.0\.0\.1:4193\/tests\/distinct-faces\.html/);
  assert.equal(workspace.sha256, '1023ca67d4673e076602fb98c36054ef3131aecd8e773c97d4e6b8b55fc1383f');
  assert.equal(face.sha256, '1f843aa76773f898a6b67d8d1b88126f283eeb9dab4e73b70639b709cfa68f79');
});


test('Persona skirt milestone adds an optional auxiliary garment rig without losing faces', () => {
  const app = apps.find(app => app.inspiration === 'Character Creator 5');
  assert.match(app.description, /optional rigged A-line skirt/);
  assert.ok(app.features.includes('Optional original A-line skirt with nine garment-only auxiliary bones'));
  assert.ok(app.features.includes('Hem-sway control, body-build fit morphs and editable garment export'));
  assert.ok(app.features.includes('Three distinct adult face presets plus the preserved original three'));
  assert.match(app.projectNotes.join(' '), /53 body bones/);
  assert.match(app.projectNotes.join(' '), /62 total joints/);
  assert.match(app.projectNotes.join(' '), /bone posing, not cloth simulation/);
  assert.match(app.projectNotes.join(' '), /arbitrary bone edits may clip/);
  assert.match(app.projectNotes.join(' '), /Blender 5\.2\.3/);
  assert.match(app.verificationEvidence, /599524fb3e55d89f1d87d57394debaf5bb23aad0/);
  assert.match(app.verificationEvidence, /42813572579/);
  assert.match(app.verificationEvidence, /all 54 deployed files/);
  const skirt = app.screenshots[1];
  assert.match(skirt.file, /persona-skirt-comparison\.png$/);
  assert.deepEqual([skirt.width, skirt.height], [960, 970]);
  assert.equal(skirt.sha256, '73c9672bfae1c4f7e4ea4883b24eaef242bb2867e9e75299aee743c18f4b55c4');
  assert.match(skirt.caption, /test-only rendered comparison sheet/);
  assert.match(skirt.source, /http:\/\/127\.0\.0\.1:4194\/tests\/skirt\.html/);
  assert.match(skirt.source, /Apple M1 hardware WebGL/);
  assert.match(skirt.source, /Local pre-publication capture/);
});


test('Persona blink and gaze listing preserves prototype and export limits', () => {
  const app = apps.find(app => app.inspiration === 'Character Creator 5');
  assert.match(app.description, /independent blink and gaze controls/);
  assert.ok(app.features.includes('Independent anatomical left/right blink controls with neutral reset'));
  const notes = app.projectNotes.join(' ');
  for (const limit of [/eye-only morph posing/, /no mouth expressions, lip-sync, automatic blink timing/i, /heavy or stretched at extreme identity/, /fitted to the saved identity/, /changing identity in Blender may require refitting/]) assert.match(notes, limit);
  assert.doesNotMatch(notes, /No facial animation, face rig|No facial expressions or animation were added/);
  const shot = app.screenshots[0];
  assert.match(shot.file, /persona-blink-gaze\.png$/);
  assert.deepEqual([shot.width, shot.height], [1320, 1820]);
  assert.match(shot.caption, /test-only rendered comparison sheet, not the production editor UI/);
  assert.match(shot.source, /Apple M1 hardware WebGL/);
});


test('Persona blink publication evidence distinguishes sampled files from live UI checks', () => {
  const evidence = apps.find(app => app.inspiration === 'Character Creator 5').verificationEvidence;
  for (const expected of [/7f578afa16a1e0bf89280e2739077a1bae784806/, /42826109720/, /96 tests/, /all 12 selected public files/, /not a complete deployment-file audit or new live UI interaction/, /642dc95643eca689266fce489bc87ac65377529af77c2e522c0326d87a9d79ab/]) assert.match(evidence, expected);
});
