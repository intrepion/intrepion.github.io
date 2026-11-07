import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../src/scripts/theme.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const layout = await readFile(new URL('../src/layouts/Base.astro', import.meta.url), 'utf8');

function harness({ stored = null, dark = false, blocked = false } = {}) {
  const listeners = { document: {}, window: {}, preference: {}, toggle: {} };
  const on = target => (name, listener) => { listeners[target][name] = listener; };
  const root = { dataset: {} };
  const metas = [{ content: '' }, { content: '' }];
  const toggle = { hidden: true, attributes: {}, setAttribute(name, value) { this.attributes[name] = value; }, addEventListener: on('toggle') };
  const preference = { matches: dark, addEventListener: on('preference') };
  const document = { documentElement: root, addEventListener: on('document'), querySelector: selector => selector === '#theme-toggle' ? toggle : null, querySelectorAll: () => metas };
  const storage = { value: stored, getItem() { if (blocked) throw Error('blocked'); return this.value; }, setItem(key, value) { assert.equal(key, 'kata-arcade-theme'); if (blocked) throw Error('blocked'); this.value = value; } };
  runInNewContext(source, { document, window: { addEventListener: on('window') }, localStorage: storage, matchMedia: () => preference });
  return { root, metas, toggle, preference, storage, listeners, mount: () => listeners.document.DOMContentLoaded(), click: () => listeners.toggle.click(), os(value) { preference.matches = value; listeners.preference.change(); } };
}

for (const dark of [false, true]) {
  test(`system ${dark ? 'dark' : 'light'} preference applies before the first paint and updates live`, () => {
    const h = harness({ dark });
    assert.equal(h.root.dataset.theme, dark ? 'dark' : 'light');
    assert.equal(h.toggle.hidden, true);
    assert.ok(h.metas.every(meta => meta.content === (dark ? '#14231c' : '#f6f6ed')));
    h.mount();
    assert.equal(h.toggle.hidden, false);
    assert.equal(h.toggle.attributes['aria-pressed'], String(dark));
    h.os(!dark);
    assert.equal(h.root.dataset.theme, dark ? 'light' : 'dark');
    assert.equal(h.toggle.attributes['aria-pressed'], String(!dark));
  });
  test(`saved ${dark ? 'dark' : 'light'} preference wins over the system`, () => {
    const h = harness({ stored: dark ? 'dark' : 'light', dark: !dark });
    h.mount(); h.os(!dark);
    assert.equal(h.root.dataset.theme, dark ? 'dark' : 'light');
  });
}

test('repeated theme toggles persist and synchronize the accessible state and browser chrome', () => {
  const h = harness(); h.mount();
  for (const theme of ['dark', 'light', 'dark', 'light']) {
    h.click();
    assert.equal(h.root.dataset.theme, theme);
    assert.equal(h.storage.value, theme);
    assert.equal(h.toggle.attributes['aria-pressed'], String(theme === 'dark'));
    assert.equal(h.toggle.title, `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    assert.ok(h.metas.every(meta => meta.content === (theme === 'dark' ? '#14231c' : '#f6f6ed')));
  }
});

test('invalid preferences and unavailable storage do not break the theme toggle', () => {
  for (const options of [{ stored: 'invalid' }, { blocked: true }]) {
    const h = harness({ ...options, dark: true }); h.mount();
    assert.equal(h.root.dataset.theme, 'dark');
    h.click();
    assert.equal(h.root.dataset.theme, 'light');
    h.os(true);
    assert.equal(h.root.dataset.theme, 'light');
  }
});

test('other tabs and restored history pages adopt the current preference', () => {
  const h = harness(); h.mount();
  h.storage.value = 'dark'; h.listeners.window.storage({ key: 'unrelated' });
  assert.equal(h.root.dataset.theme, 'light');
  h.listeners.window.storage({ key: 'kata-arcade-theme' });
  assert.equal(h.root.dataset.theme, 'dark');
  h.storage.value = null; h.listeners.window.storage({ key: null });
  assert.equal(h.root.dataset.theme, 'light');
  h.os(true);
  assert.equal(h.root.dataset.theme, 'dark');
  h.storage.value = 'light'; h.listeners.window.pageshow({ persisted: true });
  assert.equal(h.root.dataset.theme, 'light');
});

const palette = selector => Object.fromEntries([...css.slice(css.indexOf(selector)).match(/\{([^}]+)\}/s)[1].matchAll(/--([\w-]+):\s*(#[a-f\d]+);/g)].map(([, key, value]) => [key, value]));
const light = palette(':root {');
const dark = palette(':root[data-theme="dark"]');
function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(part => parseInt(part, 16) / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a, b) { const l = [luminance(a), luminance(b)].sort((a, b) => b - a); return (l[0] + 0.05) / (l[1] + 0.05); }

test('both themes define all semantic colors and the no-JavaScript fallback matches dark mode', () => {
  assert.deepEqual(Object.keys(light).sort(), Object.keys(dark).sort());
  assert.deepEqual(palette(':root:not([data-theme])'), dark);
  for (const [, token] of css.matchAll(/var\(--([\w-]+)\)/g)) assert.ok(token in light, `Missing ${token}`);
  assert.match(layout, /meta name="color-scheme" content="light dark"/);
  assert.ok(layout.indexOf('set:html={themeScript}') < layout.indexOf('<body>'));
});

for (const [name, theme] of [['light', light], ['dark', dark]]) {
  test(`${name} theme text, controls, and keyboard focus have sufficient contrast`, () => {
    for (const [ink, bg, minimum] of [
      ['ink', 'page', 4.5], ['ink', 'surface', 4.5], ['muted', 'page', 4.5], ['muted', 'surface', 4.5],
      ['accent', 'page', 4.5], ['ink', 'panel', 4.5], ['panel-muted', 'panel', 4.5], ['accent', 'panel', 3],
      ['ink', 'chip', 4.5], ['ink', 'subtle-button', 4.5], ['hover-ink', 'lime', 4.5],
      ['button-ink', 'button', 4.5], ['button-ink', 'button-hover', 4.5], ['page', 'ink', 4.5],
      ['placeholder-ink', 'placeholder', 4.5], ['art-ink', 'art', 4.5],
      ['focus', 'page', 3], ['focus', 'surface', 3], ['focus', 'panel', 3],
    ]) assert.ok(contrast(theme[ink], theme[bg]) >= minimum, `${name} ${ink}/${bg}: ${contrast(theme[ink], theme[bg]).toFixed(2)} < ${minimum}`);
  });
}

test('the permanently dark hero uses a visible focus ring in either theme', () => {
  assert.match(css, /\.hero\{--focus:#f3b78c;/);
  assert.ok(contrast('#f3b78c', '#193d33') >= 3);
});
