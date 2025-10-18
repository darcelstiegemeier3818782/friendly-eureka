// Theme toggle + SW register + nav toggle + dynamic year
(() => {
  const html = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const navBtn = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  const yearEl = document.getElementById('year');

  // dynamic year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // theme toggle
  function getTheme(){
    return localStorage.getItem('theme') || 'auto';
  }
  function setTheme(val){
    localStorage.setItem('theme', val);
    applyTheme(val);
  }
  function applyTheme(val){
    if (val === 'dark') html.classList.add('dark');
    else if (val === 'light'){ html.classList.remove('dark'); }
    else { // auto
      window.matchMedia('(prefers-color-scheme: dark)').matches ? html.classList.add('dark') : html.classList.remove('dark');
    }
  }
  btn?.addEventListener('click', () => {
    const cur = getTheme();
    const next = cur === 'auto' ? 'dark' : cur === 'dark' ? 'light' : 'auto';
    setTheme(next);
    btn.setAttribute('aria-label', `Theme: ${next}`);
  });
  applyTheme(getTheme());

  // mobile nav
  navBtn?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open');
    navBtn.setAttribute('aria-expanded', String(!!open));
  });

  // PWA: register SW (works on https or localhost)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
})();
