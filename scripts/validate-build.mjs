import assert from 'node:assert/strict';
import {readFile, readdir, access} from 'node:fs/promises';
import {join, resolve, extname} from 'node:path';
const root = resolve('dist');
const documents = new Map();
async function walk(dir) {
  for (const item of await readdir(dir, {withFileTypes:true})) {
    const path = join(dir,item.name);
    if (item.isDirectory()) await walk(path);
    else if (item.name.endsWith('.html')) documents.set(path, await readFile(path,'utf8'));
  }
}
await walk(root);
let checked = 0;
for (const [path,html] of documents) {
  for (const [,raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = raw.replaceAll('&amp;', '&');
    if (!value.startsWith('/') && !value.startsWith('#')) continue;
    if (value.startsWith('//')) continue;
    const [pathname,hash] = value.split('#');
    const clean = pathname.split('?')[0];
    const target = clean ? join(root, clean.replace(/^\//,''), extname(clean) ? '' : 'index.html') : path;
    await access(target).catch(() => {throw Error(`Broken local asset or route: ${value} in ${path}`);});
    if (hash && documents.has(target)) {
      assert.ok(documents.get(target).includes(`id="${decodeURIComponent(hash)}"`), `Missing anchor ${value} in ${path}`);
    }
    checked++;
  }
  assert.equal([...html.matchAll(/<h1(?:\s|>)/g)].length, 1, `Expected one h1: ${path}`);
}
const apps = JSON.parse(await readFile(new URL('../src/data/apps.json', import.meta.url), 'utf8'));
for (const path of ['index.html','arcade/index.html','tools/index.html', ...apps.map(app => `apps/${app.id}/index.html`)]) assert.ok(documents.has(join(root,path)), `Missing collection route: ${path}`);
console.log(`Built site valid: ${documents.size} HTML pages, ${checked} local route/anchor/asset references.`);
