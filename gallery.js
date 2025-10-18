(() => {
  const mount = document.getElementById('artMount');
  const regen = document.getElementById('regenerate');
  const saveSvg = document.getElementById('saveSvg');

  function rand(seed){
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function pick(arr, t){
    return arr[Math.floor(rand(t) * arr.length)];
  }

  function render(){
    const seed = Date.now() / 1234;
    const w = 900, h = 420;
    const layers = 6;
    const shapesPerLayer = 7;

    const colors = [
      'var(--accent-500)','var(--accent-300)','var(--primary)','#60a5fa','#34d399','#f59e0b'
    ];

    const svg = [`<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Generative art">`,
      `<defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="var(--surface-2)"/>
        <stop offset="1" stop-color="var(--surface)"/>
      </linearGradient></defs>`,
      `<rect width="${w}" height="${h}" fill="url(#grad)" rx="18" ry="18"/>`
    ];

    for (let L=0; L<layers; L++){
      for (let i=0; i<shapesPerLayer; i++){
        const t = seed + L*100 + i;
        const cx = 40 + rand(t+1) * (w-80);
        const cy = 40 + rand(t+2) * (h-80);
        const r = 20 + rand(t+3) * 80;
        const fill = pick(colors, t+4);
        const opacity = 0.15 + rand(t+5)*0.5;
        const blur = (rand(t+6) > 0.75) ? 6 : 0;
        if (blur){
          svg.push(`<g style="filter:url(#f${L})">`);
        }
        svg.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${fill}" opacity="${opacity.toFixed(2)}"/>`);
        if (blur){ svg.push(`</g>`); }
      }
    }
    svg.push('</svg>');
    mount.innerHTML = svg.join('\n');
  }

  function download(){
    const svg = mount.querySelector('svg');
    if(!svg) return;
    const blob = new Blob([svg.outerHTML], {type:'image/svg+xml'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'art.svg';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  }

  regen?.addEventListener('click', render);
  saveSvg?.addEventListener('click', download);

  render();
})();
