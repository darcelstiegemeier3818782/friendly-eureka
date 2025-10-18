// Simple client-side search with TF-IDF-ish scoring
(() => {
  const q = document.getElementById('q');
  const go = document.getElementById('go');
  const out = document.getElementById('results');

  function tokenize(s){
    return (s||'').toLowerCase().replace(/[^a-z0-9\s]+/g,' ').split(/\s+/).filter(Boolean);
  }

  // Precompute document frequencies
  const docs = DATA.map(d => ({
    ...d,
    tokens: tokenize(d.title + ' ' + d.body)
  }));
  const df = new Map();
  docs.forEach(d => {
    new Set(d.tokens).forEach(tok => df.set(tok, (df.get(tok)||0)+1));
  });

  function score(query){
    const qTokens = tokenize(query);
    if (!qTokens.length) return [];
    const N = docs.length;
    return docs.map(d => {
      let s = 0;
      qTokens.forEach(tok => {
        const tf = d.tokens.filter(t => t===tok).length;
        const idf = Math.log((N + 1) / ((df.get(tok)||0) + 1)) + 1;
        s += tf * idf;
      });
      return { doc: d, score: s };
    }).filter(x => x.score>0).sort((a,b) => b.score - a.score);
  }

  function render(results){
    if(!results.length){
      out.innerHTML = '<p class="muted">No results. Try keywords like <em>PWA</em>, <em>accessibility</em>, or <em>contrast</em>.</p>';
      return;
    }
    out.innerHTML = results.map(r => `
      <div class="result-item">
        <a href="${r.doc.url}">${r.doc.title}</a>
        <p class="muted">${r.doc.body.slice(0,150)}...</p>
      </div>
    `).join('');
  }

  go?.addEventListener('click', () => render(score(q.value)));
  q?.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){ render(score(q.value)); }
  });
})();
