// Inlined in the head so the first paint and every route use the same preference.
(() => {
  const key = 'kata-arcade-theme';
  const preference = matchMedia('(prefers-color-scheme: dark)');
  const root = document.documentElement;
  const normalize = value => value === 'light' || value === 'dark' ? value : null;
  const readChoice = () => {
    try { return normalize(localStorage.getItem(key)); } catch { return null; }
  };
  let choice = readChoice();
  let toggle;

  function sync() {
    const theme = choice || (preference.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      meta.content = theme === 'dark' ? '#14231c' : '#f6f6ed';
    });
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      toggle.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
    }
  }

  sync();
  document.addEventListener('DOMContentLoaded', () => {
    toggle = document.querySelector('#theme-toggle');
    if (!toggle) return;
    sync();
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      choice = root.dataset.theme === 'dark' ? 'light' : 'dark';
      sync();
      try { localStorage.setItem(key, choice); } catch { /* Keep the in-page choice usable. */ }
    });
  }, { once: true });

  preference.addEventListener('change', () => { if (!choice) sync(); });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      choice = readChoice();
      sync();
    }
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) {
      choice = readChoice();
      sync();
    }
  });
})();
