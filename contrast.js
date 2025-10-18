// WCAG Contrast Checker with auto-fix suggestion
(() => {
  const $ = sel => document.querySelector(sel);
  const textEl = $('#colorText');
  const bgEl = $('#colorBg');
  const sizeEl = $('#fontSize');
  const resEl = $('#contrastResult');
  const preview = $('#previewArea');

  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  function hexToRgb(hex){
    hex = hex.trim();
    if (!hex.startsWith('#')) return null;
    const h = hex.replace('#','');
    if (h.length === 3){
      const r = parseInt(h[0]+h[0],16);
      const g = parseInt(h[1]+h[1],16);
      const b = parseInt(h[2]+h[2],16);
      return {r,g,b};
    }
    if (h.length === 6){
      return {r:parseInt(h.slice(0,2),16), g:parseInt(h.slice(2,4),16), b:parseInt(h.slice(4,6),16)};
    }
    return null;
  }
  function rgbToHex({r,g,b}){
    const h = [r,g,b].map(v => clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('');
    return '#'+h;
  }
  function srgbToLin(c){ // c in [0..255]
    const s = c/255;
    return s <= 0.04045 ? s/12.92 : Math.pow((s+0.055)/1.055, 2.4);
  }
  function relativeLuminance({r,g,b}){
    const R = srgbToLin(r);
    const G = srgbToLin(g);
    const B = srgbToLin(b);
    return 0.2126*R + 0.7152*G + 0.0722*B;
  }
  function contrastRatio(rgb1, rgb2){
    const L1 = relativeLuminance(rgb1);
    const L2 = relativeLuminance(rgb2);
    const [light, dark] = L1 > L2 ? [L1, L2] : [L2, L1];
    return (light + 0.05) / (dark + 0.05);
  }
  // RGB <-> HSL for lightness adjustment
  function rgbToHsl({r,g,b}){
    r/=255; g/=255; b/=255;
    const max=Math.max(r,g,b), min=Math.min(r,g,b);
    let h,s,l=(max+min)/2;
    if(max===min){ h=s=0; }
    else{
      const d=max-min;
      s=l>0.5? d/(2-max-min): d/(max+min);
      switch(max){
        case r: h=(g-b)/d + (g<b?6:0); break;
        case g: h=(b-r)/d + 2; break;
        case b: h=(r-g)/d + 4; break;
      }
      h/=6;
    }
    return {h: h*360, s, l};
  }
  function hslToRgb({h,s,l}){
    h/=360;
    function hue2rgb(p,q,t){
      if(t<0) t+=1; if(t>1) t-=1;
      if(t<1/6) return p+(q-p)*6*t;
      if(t<1/2) return q;
      if(t<2/3) return p+(q-p)*(2/3 - t)*6;
      return p;
    }
    let r,g,b;
    if(s===0){ r=g=b=l; }
    else{
      const q = l<0.5 ? l*(1+s) : l+s-l*s;
      const p = 2*l - q;
      r=hue2rgb(p,q,h+1/3);
      g=hue2rgb(p,q,h);
      b=hue2rgb(p,q,h-1/3);
    }
    return {r:Math.round(r*255), g:Math.round(g*255), b:Math.round(b*255)};
  }

  function analyze(){
    const rgbText = hexToRgb(textEl.value);
    const rgbBg = hexToRgb(bgEl.value);
    const size = parseFloat(sizeEl.value)||16;
    if(!rgbText || !rgbBg){
      resEl.innerHTML = '<p class="muted">Enter valid hex colors like #111827 or #fff.</p>';
      return;
    }
    const ratio = contrastRatio(rgbText, rgbBg);
    const large = size >= 24 || (size >= 18.66); // 18.66 ~ 14pt
    const okAA = ratio >= (large? 3 : 4.5);
    const okAAA = ratio >= (large? 4.5 : 7);
    const badge = (okAAA? 'AAA' : okAA? 'AA' : 'Fail');
    resEl.innerHTML = `
      <div class="result-item">
        <strong>Ratio:</strong> ${ratio.toFixed(2)} : 1<br/>
        <strong>WCAG:</strong> <span>${badge}</span> (Large text threshold: ${large? '3.0/4.5' : '4.5/7.0'})
      </div>
    `;
    preview.style.setProperty('--preview-text', rgbToHex(rgbText));
    preview.style.setProperty('--preview-bg', rgbToHex(rgbBg));
  }

  function suggestAA(){
    const rgbText = hexToRgb(textEl.value);
    const rgbBg = hexToRgb(bgEl.value);
    const size = parseFloat(sizeEl.value)||16;
    if(!rgbText || !rgbBg){ return; }
    const large = size >= 24 || (size >= 18.66);
    const target = large? 3 : 4.5;

    // Try adjusting text color lightness minimally to reach target contrast
    let hsl = rgbToHsl(rgbText);
    const base = { ...hsl };
    // Determine direction: if current contrast is low and text is dark (l<0.5), make it darker; otherwise lighten, then try both.
    const startRatio = (contrastRatio(rgbText, rgbBg));
    const bgL = rgbToHsl(rgbBg).l;

    function tryDirection(dir){ // dir: +1 lighten, -1 darken
      let lo = 0, hi = 1;
      let best = null;
      // Binary search across [0..1] lightness around base.l
      for(let i=0;i<18;i++){
        const mid = (lo+hi)/2;
        hsl.l = clamp(base.l + dir*(mid*0.5), 0, 1);
        const rgb = hslToRgb(hsl);
        const c = contrastRatio(rgb, rgbBg);
        if (c >= target){
          best = {rgb, c};
          // If moving in this dir increased contrast, tighten
          hi = mid;
        } else {
          lo = mid;
        }
      }
      return best;
    }

    const darkFirst = base.l > (bgL + 0.1); // if text is much lighter than bg, try darkening first
    const first = darkFirst ? tryDirection(-1) : tryDirection(1);
    const second = darkFirst ? tryDirection(1) : tryDirection(-1);

    const pick = first && second ? (first.c < second.c ? first : second) : (first || second);

    if (pick){
      textEl.value = rgbToHex(pick.rgb);
      analyze();
    } else {
      resEl.innerHTML += `<p class="muted">Could not find an AA-compliant color by tweaking lightness alone. Try another palette.</p>`;
    }
  }

  $('#checkBtn')?.addEventListener('click', analyze);
  $('#suggestBtn')?.addEventListener('click', suggestAA);
  $('#swapBtn')?.addEventListener('click', () => {
    const t = textEl.value;
    textEl.value = bgEl.value;
    bgEl.value = t;
    analyze();
  });

  analyze();
})();
