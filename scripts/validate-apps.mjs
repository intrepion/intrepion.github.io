import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

export async function validateApps(apps, publicRoot = new URL('../public/', import.meta.url)) {
  assert.ok(Array.isArray(apps), 'App catalog must be an array');
  const ids = new Set();
  for (const app of apps) {
    assert.match(app.id, /^kata-app-[a-z0-9-]+$/, 'Apps must use a separate kata-app ID');
    assert.ok(!ids.has(app.id), `Duplicate app: ${app.id}`); ids.add(app.id);
    for (const key of ['title', 'inspiration', 'category', 'tagline', 'description']) assert.ok(typeof app[key] === 'string' && app[key].trim(), `Missing ${key}: ${app.id}`);
    assert.ok(['preview', 'live'].includes(app.status), `Invalid app status: ${app.id}`);
    assert.ok(Array.isArray(app.features) && app.features.length && app.features.every(s => typeof s === 'string' && s.trim()), `Missing features: ${app.id}`);
    assert.ok(Array.isArray(app.projectNotes) && app.projectNotes.length && app.projectNotes.every(s => typeof s === 'string' && s.trim()), `Missing project notes: ${app.id}`);
    if (app.repo !== null) assert.equal(app.repo, `https://github.com/intrepion/${app.id}`, 'App repository must match its ID');
    if (app.status === 'preview') {
      assert.equal(app.launch, null, 'Preview apps cannot have an unverified launch link');
      assert.equal(app.verified, null, 'Preview apps cannot claim deployment verification');
    } else {
      assert.equal(app.launch, `https://intrepion.github.io/${app.id}/`, 'Live app URL must match its project');
      assert.ok(app.repo, 'Live apps need a published source repository');
      assert.match(app.verified ?? '', /^\d{4}-\d{2}-\d{2}$/, 'Live apps need a verification date');
      assert.ok(app.screenshots?.length, 'Live apps need reviewed screenshots');
      assert.ok(app.verificationEvidence?.trim(), 'Live apps need verification evidence');
    }
    assert.ok(Array.isArray(app.screenshots), 'Screenshots must be an array');
    const files = new Set();
    for (const shot of app.screenshots) {
      assert.match(shot.file, /^\/screenshots\/apps\/[a-z0-9/-]+\.(jpg|png|webp)$/, 'Screenshot must be a local app asset');
      assert.ok(!files.has(shot.file), 'Duplicate app screenshot'); files.add(shot.file);
      assert.ok(shot.alt?.trim() && shot.caption?.trim() && shot.source?.trim(), 'Screenshot needs a description and source');
      assert.ok(Number.isInteger(shot.width) && shot.width > 0 && Number.isInteger(shot.height) && shot.height > 0, 'Screenshot dimensions must be positive integers');
      assert.ok(!Number.isNaN(Date.parse(shot.capturedAt)), 'Screenshot needs a real capture date');
      assert.match(shot.sha256, /^[a-f0-9]{64}$/, 'Screenshot needs a SHA-256 hash');
      const bytes = await readFile(new URL(shot.file.slice(1), publicRoot));
      assert.equal(createHash('sha256').update(bytes).digest('hex'), shot.sha256, `Screenshot hash mismatch: ${shot.file}`);
    }
  }
  return {total: apps.length, live: apps.filter(app => app.status === 'live').length, preview: apps.filter(app => app.status === 'preview').length};
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const apps = JSON.parse(await readFile(new URL('../src/data/apps.json', import.meta.url), 'utf8'));
  console.log('App catalog valid:', await validateApps(apps));
}
