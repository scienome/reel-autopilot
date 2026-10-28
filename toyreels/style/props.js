  // ==================== toy reels: captions that follow the voice ====================
  const ramp = (t, a, d = 0.4) => H.ease.inOut(H.clamp((t - a) / d));
  // autoCaps(SCRIPT, WORDS, opt): one caption chunk per 2-6 words, each word popping as it is spoken.
  //   opt.say: { 'nineteen eleven': '1911', ... } spoken word runs shown as other text (numbers as digits)
  //   opt.keys: { word: 'y' | 'g' | 'o' | 'r' } key words in a toy colour (digits are yellow automatically)
  const autoCaps = (SCRIPT, WORDS, opt = {}) => {
    const say = Object.entries(opt.say || {}).map(([k, v]) => [k.toLowerCase().split(/\s+/).map(normWord), v]).sort((a, b) => b[0].length - a[0].length);
    const keys = opt.keys || {}, CAPS = [];
    SCRIPT.forEach((ch) => ch.beats.forEach((b) => {
      let wi = 0;
      b.phrases.forEach((ph) => {
        const raw = ph.split(/\s+/).filter(Boolean), n = raw.length, toks = [];
        for (let i = 0; i < n;) {
          let hit = null;
          for (const [seq, rep] of say) if (seq.every((w, k) => i + k < n && normWord(raw[i + k]) === w)) { hit = [seq.length, rep]; break; }
          const t = WORDS[b.id][wi + i].t, e = WORDS[b.id][wi + i + (hit ? hit[0] - 1 : 0)].e;
          let txt = hit ? hit[1] : raw[i]; const last = raw[i + (hit ? hit[0] - 1 : 0)];
          if (hit) { const p = last.match(/[.,?!:;…]+$/); if (p) txt += p[0]; }
          toks.push({ txt, t, e, stop: /[.?!:;…]$/.test(last), comma: /,$/.test(last) });
          i += hit ? hit[0] : 1;
        }
        wi += n;
        // chunk: up to 3 words a line, 2 lines; break after full stops (and after commas once a chunk has 3+ words)
        let cur = [];
        const flush = () => { if (!cur.length) return; const lines = cur.length <= 3 ? [cur] : [cur.slice(0, Math.ceil(cur.length / 2)), cur.slice(Math.ceil(cur.length / 2))];
          CAPS.push({ t: cur[0].t - 0.08, times: cur.map((x) => x.t - 0.08), lines: lines.map((ln) => ln.map((x) => { const bare = x.txt.toUpperCase() === x.txt ? x.txt : x.txt; const k = keys[normWord(x.txt)] || (/\d/.test(x.txt) ? 'y' : null); return k ? [bare, k] : bare; })) }); cur = []; };
        toks.forEach((x) => { cur.push(x); if (x.stop || cur.length >= 6 || (x.comma && cur.length >= 3)) flush(); });
        flush();
      });
    }));
    return CAPS;
  };
  // draw the newest chunk; each word pops at its own spoken time
  const drawCaps = (ctx, W, CAPS, t) => {
    let cur = null; for (const c of CAPS) if (t >= c.t) cur = c; if (!cur) return;
    const next = CAPS[CAPS.indexOf(cur) + 1]; if (!next && t > cur.times[cur.times.length - 1] + 2.5) return;
    ctx.save(); ctx.textBaseline = 'alphabetic'; ctx.font = FONT(600, 50); let k = 0;
    cur.lines.forEach((ln, li) => {
      const words = ln.map((w) => (Array.isArray(w) ? w : [w, null])), sp = ctx.measureText(' ').width;
      let wid = words.reduce((a, [w]) => a + ctx.measureText(w).width, 0) + sp * (words.length - 1), sc = wid > W * 0.9 ? (W * 0.9) / wid : 1;
      let x = (W - wid * sc) / 2; const y = 330 + li * 62;
      for (const [w, ck] of words) {
        const ww = ctx.measureText(w).width * sc, u = H.clamp((t - cur.times[k]) / 0.16); k++;
        if (u > 0) { const s = (0.7 + 0.3 * H.ease.back(u)) * sc; ctx.save(); ctx.translate(x + ww / 2, y - 16); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, u * 1.6); ctx.textAlign = 'center'; ctx.lineJoin = 'round';
          ctx.shadowColor = 'rgba(10,20,40,0.5)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3; ctx.strokeStyle = 'rgba(18,28,48,0.55)'; ctx.lineWidth = 7; ctx.strokeText(w, 0, 16);
          ctx.shadowColor = 'transparent'; ctx.fillStyle = ck ? CAP[ck] : '#ffffff'; ctx.fillText(w, 0, 16); ctx.restore(); }
        x += ww + sp * sc;
      }
    });
    ctx.restore();
  };
  // a series badge in the top band (e.g. "HEISTS 2/4"), below the reel app's own top overlay
  const badge = (ctx, W, txt, col = '#e2402c') => { ctx.save(); ctx.font = FONT(800, 30); const w = ctx.measureText(txt).width + 44; ctx.translate((W - w) / 2, 196); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(0, 0, w, 54, 14); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(0, 44, w, 10); ctx.fillStyle = '#fffaf3'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 22, 26); ctx.restore(); };

  // ==================== sets ====================
  // a museum gallery: coloured wall with a dado rail (soft focus) and a polished wooden floor
  const museumSet = (ctx, W, H_, S, wall = '#7a2b2b', floor = ['#9a6a42', '#8e603a']) => {
    const bg = BXC.bgM || (BXC.bgM = H.layer(W / 4, H_ / 4)), b = bg.getContext('2d', { willReadFrequently: true });
    b.setTransform(0.25, 0, 0, 0.25, 0, 0); b.fillStyle = wall; b.fillRect(0, 0, W, H_);
    const WZ = -2.4, rail = S.proj([0, 1.0, WZ])[1]; b.fillStyle = 'rgba(0,0,0,0.18)'; b.fillRect(0, rail, W, H_); b.fillStyle = 'rgba(255,230,180,0.35)'; b.fillRect(0, rail - 6, W, 8);
    const g = b.createRadialGradient(W / 2, H_ * 0.25, 20, W / 2, H_ * 0.3, W); g.addColorStop(0, 'rgba(255,236,190,0.35)'); g.addColorStop(1, 'rgba(255,236,190,0)'); b.fillStyle = g; b.fillRect(0, 0, W, H_);
    ctx.save(); ctx.imageSmoothingEnabled = true; ctx.drawImage(bg, 0, 0, W, H_); ctx.restore();
    const zMax = S.E[2] - 0.6; for (let x = -10; x < 10; x += 0.6) quad3(ctx, S, [[x, 0, WZ], [x + 0.6, 0, WZ], [x + 0.6, 0, zMax], [x, 0, zMax]], floor[Math.round(x / 0.6) & 1]);
  };
  const MUSEUM_ENV = { sky: [255, 236, 210], ground: [160, 110, 70] };
  // a night city skyline behind (for Boston / Antwerp exteriors)
  const citySet = (ctx, W, H_, S, t, night = 1) => {
    const g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, night ? '#101a3a' : '#7fbdf2'); g.addColorStop(1, night ? '#3a3260' : '#dff0fb'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_);
    const hz = S.proj([0, 0, -12])[1], r = H.rng(8);
    for (let i = 0; i < 14; i++) { const bw = r.range(50, 110), bh = r.range(150, 420), x = i * 55 - 30; ctx.fillStyle = night ? '#1e2244' : '#9fb0c8'; ctx.fillRect(x, hz - bh, bw, bh); if (night) { ctx.fillStyle = 'rgba(255,214,120,0.75)'; for (let k = 0; k < 10; k++) if (r() > 0.55) ctx.fillRect(x + 8 + (k % 3) * 28, hz - bh + 20 + Math.floor(k / 3) * 40, 12, 16); } }
    const zMax = S.E[2] - 0.6; quad3(ctx, S, [[-12, 0, -12], [12, 0, -12], [12, 0, zMax], [-12, 0, zMax]], night ? '#3c4058' : '#a8b0b8');
  };
  // sky with clouds for flying shots (night or dusk)
  const skySet = (ctx, W, H_, t, night = 1) => {
    const g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, night ? '#0e1430' : '#5d9fe0'); g.addColorStop(1, night ? '#3b3f6a' : '#cfe6f8'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_);
    const r = H.rng(3); for (let i = 0; i < 9; i++) { const y = r.range(H_ * 0.15, H_ * 0.9), x = ((r.range(0, W) - t * r.range(80, 200)) % (W + 300) + W + 300) % (W + 300) - 150, s = r.range(0.8, 1.6);
      ctx.fillStyle = night ? 'rgba(120,130,170,0.45)' : 'rgba(255,255,255,0.85)'; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.arc(x + (k - 2) * 34 * s, y - Math.sin((k / 4) * Math.PI) * 22 * s, 30 * s, 0, TAU); ctx.fill(); } }
    if (night) { ctx.fillStyle = 'rgba(160,170,210,0.35)'; const rr = H.rng(4); for (let i = 0; i < 60; i++) { const x = (rr.range(0, W) - t * 900) % W, y = (rr.range(0, H_) + t * 1400) % H_; ctx.fillRect((x + W) % W, y, 2, 16); } } // rain
  };
  // a forest floor at night (D.B. Cooper's landing zone)
  const forestSet = (ctx, W, H_, S, t) => {
    const g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, '#0d1428'); g.addColorStop(1, '#22304a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_);
    const zMax = S.E[2] - 0.6; quad3(ctx, S, [[-12, 0, -12], [12, 0, -12], [12, 0, zMax], [-12, 0, zMax]], '#25402e');
  };

  // ==================== props ====================
  const FRAME_GOLD = [200, 160, 70];
  // paintings (simplified, public-domain subjects): 'mona' (a portrait), 'concert' (three musicians), 'storm' (a boat in a storm)
  const art = (kind) => (c, w, h) => {
    if (kind === 'mona') {
      const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#6f7d58'); g.addColorStop(1, '#3d4a32'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      c.fillStyle = '#2b2116'; c.beginPath(); c.ellipse(w * 0.5, h * 0.36, w * 0.24, h * 0.24, 0, 0, TAU); c.fill(); c.fillRect(w * 0.26, h * 0.36, w * 0.48, h * 0.25);
      c.fillStyle = '#d9a86a'; c.beginPath(); c.ellipse(w * 0.5, h * 0.36, w * 0.15, h * 0.16, 0, 0, TAU); c.fill();
      c.fillStyle = '#2d2418'; c.beginPath(); c.moveTo(w * 0.12, h); c.quadraticCurveTo(w * 0.5, h * 0.48, w * 0.88, h); c.fill();
      c.fillStyle = '#d9a86a'; c.beginPath(); c.ellipse(w * 0.5, h * 0.88, w * 0.14, h * 0.05, 0, 0, TAU); c.fill();
      c.strokeStyle = '#7a4a2a'; c.lineWidth = w * 0.012; c.beginPath(); c.arc(w * 0.5, h * 0.4, w * 0.05, 0.2 * Math.PI, 0.8 * Math.PI); c.stroke();
    } else if (kind === 'concert') {
      c.fillStyle = '#5a4a3a'; c.fillRect(0, 0, w, h); c.fillStyle = '#d8c8a0'; c.fillRect(0, h * 0.62, w, h * 0.38);
      [[0.25, '#c84030'], [0.5, '#e8d8b0'], [0.75, '#304a70']].forEach(([x, col]) => { c.fillStyle = col; c.fillRect(w * (x - 0.08), h * 0.4, w * 0.16, h * 0.32); c.fillStyle = '#e0b890'; c.beginPath(); c.arc(w * x, h * 0.34, w * 0.06, 0, TAU); c.fill(); });
      c.fillStyle = '#2a2018'; c.fillRect(w * 0.1, h * 0.55, w * 0.35, h * 0.08);
    } else if (kind === 'storm') {
      const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#3a3a40'); g.addColorStop(1, '#6a7a7a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
      c.fillStyle = '#1e3a3a'; c.beginPath(); c.moveTo(0, h * 0.7); for (let x = 0; x <= w; x += w / 8) c.lineTo(x, h * (0.66 + 0.05 * Math.sin(x * 0.05))); c.lineTo(w, h); c.lineTo(0, h); c.fill();
      c.fillStyle = '#5a3a20'; c.beginPath(); c.moveTo(w * 0.25, h * 0.62); c.lineTo(w * 0.75, h * 0.52); c.lineTo(w * 0.68, h * 0.7); c.lineTo(w * 0.3, h * 0.75); c.fill();
      c.fillStyle = '#e8dcc0'; c.beginPath(); c.moveTo(w * 0.5, h * 0.12); c.lineTo(w * 0.52, h * 0.55); c.lineTo(w * 0.72, h * 0.5); c.fill();
    }
  };
  const painting = (S, x, y, z, w, h, kind, frameCol = FRAME_GOLD, rot = 0) => {
    const T = (p) => add(rotY(p, rot), [x, y, z]);
    S.box(T, w, h, 0.05, frameCol, { bevel: 0.3, paint: kind ? (c, cw, ch) => { c.fillStyle = 'rgb(' + frameCol.join(',') + ')'; c.fillRect(0, 0, cw, ch); c.save(); c.translate(cw * 0.09, ch * 0.09); art(kind)(c, cw * 0.82, ch * 0.82); c.restore(); } : (c, cw, ch) => { c.fillStyle = 'rgb(' + frameCol.join(',') + ')'; c.fillRect(0, 0, cw, ch); c.fillStyle = '#6e2626'; c.fillRect(cw * 0.09, ch * 0.09, cw * 0.82, ch * 0.82); c.strokeStyle = 'rgba(0,0,0,0.35)'; c.lineWidth = cw * 0.02; c.strokeRect(cw * 0.09, ch * 0.09, cw * 0.82, ch * 0.82); } });
  };
  // a jet airliner (Boeing-727-ish: three tail engines, rear airstair), along +x
  const plane = (S, x, y, z, s = 1, rot = 0, stair = 0, col = [236, 236, 240], stripe = '#d02a2a') => {
    const T = (p) => add(rotY(mul(p, s), rot), [x, y, z]);
    S.box(T, 1.9, 0.28, 0.28, col, { bevel: 0.6, paint: (c, w, h) => { c.fillStyle = stripe; c.fillRect(0, h * 0.55, w, h * 0.12); c.fillStyle = '#2a3a5a'; for (let i = 0; i < 14; i++) c.fillRect(w * (0.14 + i * 0.05), h * 0.32, w * 0.022, h * 0.14); } });
    S.box((p) => T(add(p, [1.95, 0, 0])), 0.18, 0.22, 0.22, col, { bevel: 0.7 });
    S.box((p) => T(add(p, [0.1, -0.12, 0])), 0.38, 0.04, 1.6, col, { bevel: 0.4 });
    S.box((p) => T(add(p, [-1.65, 0.48, 0])), 0.28, 0.32, 0.05, col, { bevel: 0.4, paint: (c, w, h) => { c.fillStyle = stripe; c.fillRect(0, 0, w, h); } });
    S.box((p) => T(add(p, [-1.8, 0.78, 0])), 0.18, 0.03, 0.5, col, { bevel: 0.4 });
    for (const sz of [-0.32, 0.32]) S.cyl((p) => T(add(rotZ(p, Math.PI / 2), [-1.25, 0.2, sz])), 0.1, 0.4, [200, 200, 205], 10);
    if (stair > 0) S.box((p) => T(add(rotZ(add(p, [-0.35, 0, 0]), -0.6 * stair), [-1.9, -0.24, 0])), 0.35, 0.03, 0.12, [150, 150, 158], { bevel: 0.3 });
  };
  const cash = (S, x, y, z, s = 1, rot = 0) => S.box((p) => add(rotY(mul(p, s), rot), [x, y, z]), 0.22, 0.05, 0.11, [120, 176, 96], { bevel: 0.25, paint: (c, w, h) => { c.fillStyle = '#d8f0c8'; c.fillRect(w * 0.1, h * 0.15, w * 0.8, h * 0.7); c.fillStyle = '#4a7a3a'; c.font = FONT(800, h * 0.6); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('$', w / 2, h / 2); } });
  const bag = (S, x, y, z, s = 1, col = [120, 84, 50]) => { S.box((p) => add(mul(p, s), [x, y + 0.3 * s, z]), 0.32, 0.3, 0.22, col, { bevel: 0.45 }); S.box((p) => add(mul(p, s), [x, y + 0.66 * s, z]), 0.12, 0.06, 0.1, col, { bevel: 0.5 }); };
  const gem = (S, x, y, z, s = 0.1, spin = 0, col = [170, 230, 255]) => S.box((p) => add(rotY(rotZ(mul(p, s), 0.78), spin), [x, y, z]), 1, 1, 1, col, { bevel: 0.3 });
  // a round vault door seen face-on, swinging open by `open` (0..1) around its left hinge
  const vaultDoor = (S, x, y, z, R = 1.1, open = 0, spin = 0) => {
    const hx = x - R, ang = -open * 1.9, T = (p) => add(rotY(add(p, [R, 0, 0]), ang), [hx, y, z]);
    S.cyl((p) => T(rotX(p, Math.PI / 2)), R, 0.28, [150, 156, 168], 22, { capPaint: (c, w, h) => { c.fillStyle = '#9aa0ae'; c.beginPath(); c.arc(w / 2, h / 2, w * 0.4, 0, TAU); c.fill(); c.strokeStyle = '#6a707e'; c.lineWidth = w * 0.03; for (let i = 0; i < 3; i++) { const a = spin + (i / 3) * Math.PI; c.beginPath(); c.moveTo(w / 2 - Math.cos(a) * w * 0.3, h / 2 - Math.sin(a) * w * 0.3); c.lineTo(w / 2 + Math.cos(a) * w * 0.3, h / 2 + Math.sin(a) * w * 0.3); c.stroke(); } c.fillStyle = '#ffd23f'; c.beginPath(); c.arc(w / 2, h / 2, w * 0.07, 0, TAU); c.fill(); } });
  };
  // a simple brick wall panel behind a vault
  const vaultWall = (S, z = -0.6) => S.box((p) => add(p, [0, 1.6, z]), 2.6, 1.6, 0.15, [110, 116, 128], { bevel: 0.05, paint: (c, w, h) => { c.fillStyle = '#6e7480'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(0,0,0,0.18)'; c.lineWidth = 3; for (let y2 = 0; y2 < h; y2 += 30) { c.beginPath(); c.moveTo(0, y2); c.lineTo(w, y2); c.stroke(); } } });
  // a printed plastic plate showing a 2D diagram (cutaways, charts): draw(c, w, h)
  const plate = (S, x, y, z, w, h, draw, col = P.white, rot = 0) => S.box((p) => add(rotY(p, rot), [x, y, z]), w, h, 0.06, col, { bevel: 0.25, paint: draw });
  // a parachute canopy (stacked plastic rings) with lines
  const parachute = (S, x, y, z, s = 1, col = [230, 80, 60]) => { for (let i = 0; i < 3; i++) S.cyl((p) => add(mul(p, s), [x, y + i * 0.12 * s, z]), (0.9 - i * 0.28) * 1, 0.12, i % 2 ? P.white : col, 18); for (const a of [0, 1, 2, 3]) { const an = a * Math.PI / 2 + 0.4; S.box((p) => add(rotZ(rotX(mul(p, s), Math.sin(an) * 0.35), -Math.cos(an) * 0.35), [x + Math.cos(an) * 0.35 * s, y - 0.5 * s, z + Math.sin(an) * 0.35 * s]), 0.01, 0.5, 0.01, [240, 240, 240], { bevel: 0.2 }); } };
  // trees made of brick cones for forests
  const tree = (S, x, z, s = 1, col = [52, 110, 70]) => { S.box((p) => add(mul(p, s), [x, 0.3 * s, z]), 0.08, 0.3, 0.08, [110, 74, 44], { bevel: 0.3 }); for (let i = 0; i < 3; i++) S.box((p) => add(rotY(mul(p, s), 0.785), [x, (0.75 + i * 0.32) * s, z]), 0.42 - i * 0.12, 0.16, 0.42 - i * 0.12, col, { bevel: 0.3 }); };
  // an astronaut: a white brick figure with a box helmet and a dark visor
  const astronaut = (S, x, z, s, rot, o = {}) => {
    S.figure(x, z, s, rot, Object.assign({ shirt: [240, 240, 244], pants: [230, 230, 236], skin: [240, 240, 244] }, o));
    const T0 = (p) => add(rotY(mul(p, s), rot), [x, o.bob || 0, z]);
    S.box((p) => T0(add(p, [0, 1.88, 0.02])), 0.36, 0.36, 0.34, [244, 244, 248], { bevel: 0.3, paint: (c, w, h) => { const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#3a5a9a'); g.addColorStop(1, '#141c38'); c.fillStyle = g; c.beginPath(); c.roundRect(w * 0.12, h * 0.18, w * 0.76, h * 0.56, w * 0.15); c.fill(); c.fillStyle = 'rgba(255,255,255,0.4)'; c.fillRect(w * 0.2, h * 0.24, w * 0.18, h * 0.08); } });
    S.box((p) => T0(add(p, [0, 1.25, -0.3])), 0.28, 0.32, 0.12, [220, 220, 228], { bevel: 0.3 });
  };
  // a cat (for goosebumps): fluff 0..1 puffs the fur and arches it
  const cat = (S, x, z, s = 1, rot = 0, fluff = 0, col = P.orange) => {
    const T = (p) => add(rotY(mul(p, s), rot), [x, 0, z]), f = 1 + 0.35 * fluff;
    for (const [lx, lz] of [[-0.35, -0.15], [-0.35, 0.15], [0.35, -0.15], [0.35, 0.15]]) S.box((p) => T(add(p, [lx, 0.18, lz])), 0.07, 0.18, 0.07, col, { bevel: 0.3 });
    S.box((p) => T(add(p, [0, 0.52 + 0.1 * fluff, 0])), 0.5 * f, 0.18 * f, 0.22 * f, col, { bevel: 0.45 });
    S.box((p) => T(add(p, [0.6, 0.72, 0])), 0.2 * f, 0.18 * f, 0.18 * f, col, { bevel: 0.4, paint: (c, w, h) => { c.fillStyle = '#2a2a33'; c.beginPath(); c.arc(w * 0.32, h * 0.42, w * 0.07, 0, TAU); c.arc(w * 0.68, h * 0.42, w * 0.07, 0, TAU); c.fill(); c.fillStyle = '#e0607a'; c.beginPath(); c.arc(w / 2, h * 0.62, w * 0.05, 0, TAU); c.fill(); } });
    for (const sz of [-0.1, 0.1]) S.box((p) => T(add(rotX(p, sz * 3), [0.6, 0.94 * (1 + 0.15 * fluff), sz])), 0.05, 0.08, 0.04, col, { bevel: 0.3 });
    S.box((p) => T(add(rotZ(p, -0.9 - 0.5 * fluff), [-0.62, 0.78, 0])), 0.06 * f * f, 0.3, 0.06 * f * f, col, { bevel: 0.4 });
    if (fluff > 0.3) { const r = H.rng(6); for (let i = 0; i < 14; i++) { const ax = r.range(-0.45, 0.45); S.box((p) => T(add(rotZ(p, ax * 0.6), [ax, 0.75 + 0.08 * fluff, r.range(-0.18, 0.18)])), 0.025, 0.1 * fluff, 0.025, col, { bevel: 0.3 }); } }
  };
  // a bed with a blanket (sleep reel)
  const bed = (S, x, z, s = 1) => { S.box((p) => add(mul(p, s), [x, 0.25, z]), 1.0, 0.18, 0.55, [150, 100, 64], { bevel: 0.25 }); S.box((p) => add(mul(p, s), [x + 0.1, 0.48, z]), 0.88, 0.08, 0.52, [90, 130, 210], { bevel: 0.4 }); S.box((p) => add(mul(p, s), [x - 0.72, 0.5, z]), 0.2, 0.08, 0.4, P.white, { bevel: 0.5 }); S.box((p) => add(mul(p, s), [x - 1.0, 0.6, z]), 0.06, 0.55, 0.55, [150, 100, 64], { bevel: 0.3 }); };
  // a wall clock / alarm clock face (hours as a float), used on plates and tags
  const clock = (S, x, y, z, s, hours, col = P.red) => S.box((p) => add(mul(p, s), [x, y, z]), 0.5, 0.5, 0.1, col, { bevel: 0.25, paint: clockFace(hours) });

  // ---- dark-comedy kit ----
  // a cartoon missile along +y (tilt = radians from vertical), with a flame (0..1) out of the tail
  const missile = (S, x, y, z, s = 1, tilt = 0, flame = 0, col = [236, 236, 240], tip = P.red) => {
    const T = (p) => add(rotZ(mul(p, s), tilt), [x, y, z]);
    S.cyl((p) => T(p), 0.16, 1.1, col, 14);
    for (let i = 0; i < 3; i++) S.cyl((p) => T(add(p, [0, 1.1 + i * 0.1, 0])), 0.16 * (1 - i * 0.3), 0.1, tip, 14);
    for (const a of [0, Math.PI / 2]) S.box((p) => T(add(rotY(p, a), [0, 0.15, 0])), 0.32, 0.15, 0.02, tip, { bevel: 0.3 });
    if (flame > 0) for (let i = 0; i < 3; i++) S.box((p) => T(add(p, [0, -0.15 - i * 0.16 * flame, 0])), 0.12 - i * 0.03, 0.09 * flame, 0.12 - i * 0.03, [[255, 220, 60], [255, 150, 40], [240, 70, 40]][i], { bevel: 0.5 });
  };
  // a stepped brick pyramid; eye = 0..1 opens the glowing all-seeing eye on its capstone (Illuminati jokes)
  const pyramid = (S, x, z, s = 1, eye = 0, col = [226, 190, 120]) => {
    for (let i = 0; i < 5; i++) S.box((p) => add(mul(p, s), [x, (0.12 + i * 0.24) * s, z]), 1.1 - i * 0.22, 0.12, 1.1 - i * 0.22, col, { bevel: 0.15 });
    if (eye > 0) S.box((p) => add(mul(p, s), [x, 1.3 * s, z + 0.12 * s]), 0.2, 0.13, 0.02, [255, 230, 120], { bevel: 0.3, paint: (c, w, h) => { c.fillStyle = '#fff6d0'; c.beginPath(); c.ellipse(w / 2, h / 2, w * 0.42, h * 0.34 * eye, 0, 0, TAU); c.fill(); c.fillStyle = '#2a2a33'; c.beginPath(); c.arc(w / 2, h / 2, h * 0.22 * eye, 0, TAU); c.fill(); } });
  };
  // a cartoon explosion: puffs of bricks growing with u (0..1) and fading out after 1
  const boom = (S, x, y, z, s = 1, u = 1) => {
    if (u <= 0 || u >= 2) return;
    const k = Math.min(u, 1) * (u > 1 ? 2 - u : 1), r = H.rng(11);
    for (let i = 0; i < 14; i++) { const a = r.range(0, TAU), e = r.range(-0.6, 1.2), d = r.range(0.2, 0.9) * k * s; S.box((p) => add(rotY(rotZ(p, a), e), [x + Math.cos(a) * d, y + Math.abs(e) * d * 0.8, z + Math.sin(a) * d * 0.5]), 0.16 * k * s, 0.16 * k * s, 0.16 * k * s, [[255, 220, 60], [255, 150, 40], [240, 70, 40], [90, 90, 100]][i % 4], { bevel: 0.5 }); }
  };
  // jail bars in front of the camera-side of a cell (n bars across width w)
  const jailBars = (S, x, z, w = 2, n = 7, h = 2.6) => { for (let i = 0; i < n; i++) S.cyl((p) => add(p, [x - w / 2 + (i * w) / (n - 1), 0, z]), 0.04, h, [120, 124, 134], 8); for (const y of [0.1, h]) S.box((p) => add(p, [x, y, z]), w / 2 + 0.06, 0.05, 0.06, [100, 104, 114], { bevel: 0.3 }); };
  // a speech podium with printed text on its front
  const podium = (S, x, z, txt = '', col = [120, 84, 50], s = 1) => S.box((p) => add(mul(p, s), [x, 0.55 * s, z]), 0.4, 0.55, 0.25, col, { bevel: 0.2, paint: (c, w, h) => { if (!txt) return; c.fillStyle = '#ffd23f'; c.font = FONT(800, h * 0.12); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, w / 2, h * 0.3); } });
  // the big red button on a desk-top box; press 0..1 pushes it down
  const bigButton = (S, x, y, z, s = 1, press = 0) => { S.box((p) => add(mul(p, s), [x, y + 0.15 * s, z]), 0.3, 0.15, 0.3, [230, 210, 60], { bevel: 0.2, paint: (c, w, h) => { c.fillStyle = '#16161c'; for (let i = 0; i < 6; i++) c.fillRect(w * (i / 6), 0, w / 12, h); } }); S.cyl((p) => add(mul(p, s), [x, y + 0.3 * s, z]), 0.18, 0.12 * (1 - 0.7 * press), [230, 30, 30], 16); };

  // ==================== shot wrappers ====================
  const lawnShot = (ctx, W, H_, t, E, TG, build, night = 0) => { const S = Scene(E, TG, W, H_); build(S); grassSet(ctx, W, H_, S, t); S.render(ctx, W, H_, {}); nightGrade(ctx, W, H_, night); return S; };
  const studioShot = (ctx, W, H_, E, TG, build) => { const S = Scene(E, TG, W, H_); build(S); studioSet(ctx, W, H_, S); S.render(ctx, W, H_, { sky: [210, 225, 255], ground: [110, 150, 230] }); return S; };
  const museumShot = (ctx, W, H_, E, TG, build, wall, night = 0) => { const S = Scene(E, TG, W, H_); build(S); museumSet(ctx, W, H_, S, wall); S.render(ctx, W, H_, MUSEUM_ENV); nightGrade(ctx, W, H_, night, false); return S; };
  const spaceShot = (ctx, W, H_, t, E, TG, build) => { const S = Scene(E, TG, W, H_); build(S); spaceSet(ctx, W, H_, t, 0.5); S.render(ctx, W, H_, SPACE_ENV); return S; };
  const cityShot = (ctx, W, H_, t, E, TG, build, night = 1) => { const S = Scene(E, TG, W, H_); build(S); citySet(ctx, W, H_, S, t, night); S.render(ctx, W, H_, { sky: night ? [120, 130, 200] : [210, 225, 255], ground: [90, 90, 110] }); return S; };
  const skyShot = (ctx, W, H_, t, E, TG, build, night = 1) => { const S = Scene(E, TG, W, H_); build(S); skySet(ctx, W, H_, t, night); S.render(ctx, W, H_, { shadows: false, sky: [150, 160, 220], ground: [60, 60, 90] }); return S; };
  const forestShot = (ctx, W, H_, t, E, TG, build) => { const S = Scene(E, TG, W, H_); build(S); forestSet(ctx, W, H_, S, t); S.render(ctx, W, H_, { sky: [110, 120, 180], ground: [40, 70, 50] }); nightGrade(ctx, W, H_, 0.35, false); return S; };
  // the standard reel scaffold: shots per beat, auto captions, a series badge, cut flashes, finish
  const makeReel = (cfg) => {
    const { V, B, DURATION, CHAPTERS, WORDS, Wt } = VIDEO_TIMING(window.SCRIPT);
    const IDS = window.SCRIPT.flatMap((c) => c.beats.map((b) => b.id));
    const SH = IDS.map((id, i) => [id, i ? B(id) - 0.1 : 0]);
    const shotAt = makeShotAt(SH, DURATION);
    const ctxObj = { V, B, Wt, WORDS, DURATION };
    const CAPS = autoCaps(window.SCRIPT, WORDS, cfg.captions || {});
    const shots = cfg.shots(ctxObj);
    const STORY = (ctx, W, H_, t) => {
      const [name, a, b] = shotAt(t);
      const flash = (shots[name] || shots._default)(ctx, W, H_, t, a, b) || 0;
      if (cfg.badge) badge(ctx, W, cfg.badge, cfg.badgeCol);
      drawCaps(ctx, W, CAPS, t);
      finish(ctx, W, H_, t, flash);
    };
    function scoreSound(k0) {
      // a sound timed to lead the first word can land before 0 s, which Web Audio rejects: clamp every start time to 0
      const k = new Proxy(k0, { get(o, name) { const v = o[name]; if (typeof v !== 'function') return v;
        return (...args) => { const i = typeof args[0] === 'number' ? 0 : 1; if (typeof args[i] === 'number') args[i] = Math.max(0, args[i]); return v.apply(o, args); }; } });
      const fx = SFX(k);
      SH.slice(1).forEach(([, s]) => fx.cut(s));
      CAPS.forEach((c) => c.times.forEach((tt) => k.play('tick', tt, { f: 3400, gain: 0.18, minor: true })));
      if (cfg.sound) cfg.sound(k, fx, ctxObj);
    }
    window.LESSON = { DURATION, CHAPTERS, SH, explainer: STORY };
    window.scoreSound = scoreSound;
  };
