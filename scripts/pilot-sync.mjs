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
 if (manifest.schemaVersion !== 1 || manifest.gameId !== id || manifest.playUrl !== `https://intrepion.github.io/${id}/` || !Array.isArray(manifest.screenshots) || !manifest.screenshots.length) throw new Error(`Invalid manifest for ${id}`);
 const seen = new Set();
 const images = [];
 for (const image of manifest.screenshots) {
  if (typeof image.path !== 'string' || !/^arcade\/screenshots\/[a-z0-9-]+\.jpg$/.test(image.path) || seen.has(image.path) || !/^[a-f0-9]{64}$/.test(image.sha256) || typeof image.alt !== 'string' || !image.alt.trim() || image.provenance?.kind !== 'existing_repository_capture' || typeof image.provenance.sourcePath !== 'string' || !image.provenance.sourcePath.trim() || image.provenance.deployedBuild !== null || image.provenance.captureDate !== null) throw new Error(`Invalid screenshot metadata for ${id}`);
  seen.add(image.path);
  const path = await realpath(resolve(publicDir, image.path)); const rel = relative(await realpath(publicDir), path);
  if (rel.startsWith('..') || isAbsolute(rel)) throw new Error('Image outside public directory');
  const bytes = await readFile(path);
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || digest(bytes) !== image.sha256) throw new Error(`Screenshot hash or format mismatch: ${id}/${image.path}`);
  images.push({file:`/screenshots/game-owned/${id}/${image.sha256}-${image.path.split('/').at(-1)}`, source:image.provenance.sourcePath, alt:image.alt, sha256:image.sha256, provenance:image.provenance.kind, bytes});
 }
 return {schemaVersion:manifest.schemaVersion,gameId:id,playUrl:manifest.playUrl,images};
}
export async function syncPilot(root, destination = arcade) {
 // Validate everything before writing; a failed sync leaves the last snapshot available.
 const loaded = await Promise.all(pilotIds.map(id => loadPilot(resolve(root,id), id)));
 const snapshot = {};
 for (const game of loaded) {
  snapshot[game.gameId] = game.images.map(({bytes,...meta}) => meta);
  for (const image of game.images) {const path=resolve(destination,'public',image.file.slice(1)); await mkdir(dirname(path),{recursive:true}); await writeFile(path,image.bytes);}
 }
 await mkdir(resolve(destination,'src/data'),{recursive:true});
 const output = resolve(destination,'src/data/pilot-screenshots.json'); const temporary = `${output}.tmp`; await writeFile(temporary, JSON.stringify(snapshot,null,2)+'\n'); await rename(temporary,output);
 return snapshot;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
 const root = resolve(process.argv[2] || resolve(arcade, '../pilot-games'));
 await syncPilot(root); console.log(`Synced ${pilotIds.length} game-owned manifests from ${root}`);
}
