import { readFile, mkdir, writeFile, rename, realpath } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname, relative, isAbsolute } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const arcade = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const pilotIds = ['kata-inspired-by-braid-codex-dot', 'kata-inspired-by-portal-codex-dot'];
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export async function loadPilot(gameRoot, id) {
 const publicDir = resolve(gameRoot, 'public');
 const manifest = JSON.parse(await readFile(resolve(publicDir, 'arcade/manifest.json'), 'utf8'));
 if (![1, 2].includes(manifest.schemaVersion) || manifest.gameId !== id || manifest.playUrl !== `https://intrepion.github.io/${id}/` || !Array.isArray(manifest.screenshots)) throw new Error(`Invalid manifest for ${id}`);
 const seen = new Set();
 const images = [];
 for (const image of manifest.screenshots) {
  const provenance = image.provenance;
  const legacy = provenance?.kind === 'existing_repository_capture' && typeof provenance.sourcePath === 'string' && !!provenance.sourcePath.trim() && provenance.deployedBuild === null && provenance.captureDate === null;
  const hashes = provenance?.inputHashes;
  const captured = manifest.schemaVersion === 2 && provenance?.kind === 'ci_gameplay_capture' && /^arcade\/capture-evidence\/[a-z0-9-]+\.png$/.test(provenance.sourcePath || '') && /^[a-f0-9]{64}$/.test(provenance.sourceSha256 || '') && /^[a-f0-9]{40}$/.test(provenance.captureCommit || '') && /^[0-9]+$/.test(provenance.workflowRunId || '') && typeof provenance.publishedFilesVerifiedAt === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(provenance.publishedFilesVerifiedAt) && !Number.isNaN(Date.parse(provenance.publishedFilesVerifiedAt)) && hashes && Object.keys(hashes).length > 0 && Object.entries(hashes).every(([name, hash]) => /^[a-zA-Z0-9._/-]+$/.test(name) && !name.startsWith('/') && !name.split('/').includes('..') && /^[a-f0-9]{64}$/.test(hash));
  if (typeof image.path !== 'string' || !/^arcade\/screenshots\/[a-z0-9-]+\.jpg$/.test(image.path) || seen.has(image.path) || !/^[a-f0-9]{64}$/.test(image.sha256) || typeof image.alt !== 'string' || !image.alt.trim() || !(legacy || captured)) throw new Error(`Invalid screenshot metadata for ${id}`);
  if (captured) {
   if (provenance.captureRecordPath !== undefined || provenance.captureRecordSha256 !== undefined) {
    if (!/^arcade\/capture-evidence\/[a-z0-9-]+\.json$/.test(provenance.captureRecordPath || '') || !/^[a-f0-9]{64}$/.test(provenance.captureRecordSha256 || '')) throw new Error(`Invalid capture record metadata: ${id}`);
    const recordPath = await realpath(resolve(publicDir, provenance.captureRecordPath)); const recordRel = relative(await realpath(publicDir), recordPath);
    if (recordRel.startsWith('..') || isAbsolute(recordRel)) throw new Error('Capture record outside public directory');
    const rawRecord = await readFile(recordPath);
    if (digest(rawRecord) !== provenance.captureRecordSha256) throw new Error(`Capture record hash mismatch: ${id}`);
    const record = JSON.parse(rawRecord);
    if (record.sourceCommit !== provenance.captureCommit || String(record.runId) !== provenance.workflowRunId || JSON.stringify(record.inputs) !== JSON.stringify(provenance.inputHashes)) throw new Error(`Capture record provenance mismatch: ${id}`);
   }
   const evidencePath = await realpath(resolve(publicDir, provenance.sourcePath)); const rel = relative(await realpath(publicDir), evidencePath);
   if (rel.startsWith('..') || isAbsolute(rel)) throw new Error('Evidence outside public directory');
   const original = await readFile(evidencePath);
   if (original.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a' || digest(original) !== provenance.sourceSha256) throw new Error(`Capture evidence hash or format mismatch: ${id}`);
  }
  seen.add(image.path);
  const path = await realpath(resolve(publicDir, image.path)); const rel = relative(await realpath(publicDir), path);
  if (rel.startsWith('..') || isAbsolute(rel)) throw new Error('Image outside public directory');
  const bytes = await readFile(path);
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || digest(bytes) !== image.sha256) throw new Error(`Screenshot hash or format mismatch: ${id}/${image.path}`);
  images.push({file:`/screenshots/game-owned/${id}/${image.sha256}-${image.path.split('/').at(-1)}`, source:image.provenance.sourcePath, alt:image.alt, sha256:image.sha256, provenance:image.provenance.kind, ...(captured ? {capture:provenance} : {}), bytes});
 }
 return {schemaVersion:manifest.schemaVersion,gameId:id,playUrl:manifest.playUrl,images};
}
export async function syncGames(root, ids, destination = arcade) {
 // Validate everything before writing; a failed sync leaves the last snapshot available.
 if (!Array.isArray(ids) || new Set(ids).size !== ids.length || ids.some(id => !/^kata-[a-z0-9.-]+$/.test(id))) throw new Error('Invalid game IDs');
 const loaded = await Promise.all(ids.map(id => loadPilot(resolve(root,id), id)));
 const snapshot = {};
 for (const game of loaded) {
  snapshot[game.gameId] = game.images.map(({bytes,...meta}) => meta);
  for (const image of game.images) {const path=resolve(destination,'public',image.file.slice(1)); await mkdir(dirname(path),{recursive:true}); await writeFile(path,image.bytes);}
 }
 await mkdir(resolve(destination,'src/data'),{recursive:true});
 const output = resolve(destination,'src/data/pilot-screenshots.json'); const temporary = `${output}.tmp`; await writeFile(temporary, JSON.stringify(snapshot,null,2)+'\n'); await rename(temporary,output);
 return snapshot;
}
export async function syncPilot(root, destination = arcade) { return syncGames(root, pilotIds, destination); }
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
 const root = resolve(process.argv[2] || resolve(arcade, '../pilot-games'));
 const ids = JSON.parse(await readFile(resolve(arcade,'src/data/game-owned-ids.json'),'utf8')); await syncGames(root, ids); console.log(`Synced ${ids.length} game-owned manifests from ${root}`);
}
