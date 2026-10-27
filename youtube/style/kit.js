  // ==================== video kit: timing, chapters, captions ====================
  // videos/<id>/script.json -> window.SCRIPT = [{ chapter, beats: [{ id, phrases: ['text', ...] }] }]
  // videos/<id>/timing.json -> window.WORD_TIMES = { beatId: [[t0, t1], ...] } (one entry per word, from ElevenLabs)
  const syl = (w) => { const m = w.toLowerCase().replace(/[^a-z]/g, '').replace(/e$/, '').match(/[aeiouy]+/g); return Math.max(1, m ? m.length : 1); };
  const normWord = (w) => w.toLowerCase().replace(/[’]/g, "'").replace(/[^a-z0-9']/g, '');
  const CHAPTER_GAP = 0.6; // seconds of silence voice.py puts between chapters
  const VIDEO_TIMING = (SCRIPT) => {
    const MEAS = window.WORD_TIMES || null, WORDS = {}, BEAT = {}, CHAPTERS = [];
    let clock = 0.4, end = 0;
    SCRIPT.forEach((ch, ci) => {
      if (ci) clock += CHAPTER_GAP;
      ch.beats.forEach((b, bi) => {
        const out = (WORDS[b.id] = []), meas = MEAS && MEAS[b.id]; let wi = 0;
        b.phrases.forEach((text) => {
          const ws = text.split(/\s+/).filter(Boolean), tot = ws.reduce((s, w) => s + syl(w), 0), dur = ws.length / 2.6; let acc = 0;
          ws.forEach((w) => {
            let t0 = clock + (dur * acc) / tot, t1 = clock + (dur * (acc + syl(w))) / tot;
            if (meas && meas[wi]) [t0, t1] = meas[wi];
            out.push({ w: normWord(w), t: t0, e: t1 }); acc += syl(w); wi++; end = Math.max(end, t1);
          });
          clock += dur + (/[.?!…]$/.test(text) ? 0.42 : 0.24);
        });
        BEAT[b.id] = { t0: out[0].t, t1: out[out.length - 1].e, chapter: ci };
        if (bi === 0) CHAPTERS.push({ title: ch.chapter, t: out[0].t });
      });
    });
    const Wt = (id, word, n = 1) => { let k = 0; for (const x of WORDS[id] || []) if (x.w === normWord(word) && ++k === n) return x.t; throw new Error('script has no word "' + word + '" in beat ' + id); };
    const V = (id, word, n) => Wt(id, word, n) - 0.12;
    const B = (id) => BEAT[id].t0 - 0.12; // when a beat starts (visual lead)
    const DURATION = +(Math.max(end, MEAS && window.VOICE_END ? window.VOICE_END : 0) + 1.6).toFixed(2);
    return { WORDS, BEAT, CHAPTERS, Wt, V, B, DURATION, measured: !!MEAS };
  };
  // shots: [[name, start], ...] -> [name, start, end] at t
  const makeShotAt = (SH, DURATION) => (t) => { let i = 0; for (let k = 0; k < SH.length; k++) if (t >= SH[k][1]) i = k; return [SH[i][0], SH[i][1], i + 1 < SH.length ? SH[i + 1][1] : DURATION, i]; };
  // captions: CAPS = [[t0, lines, per?], ...]; the newest chunk that started inside the shot is drawn
  const makeCaps = (CAPS) => (ctx, W, t, a, b) => { let cur = null; for (const c of CAPS) if (c[0] >= a - 0.25 && c[0] < b && t >= c[0]) cur = c; if (cur) caption(ctx, W, cur[1], cur[0], t, cur[2] || 0.12); };

  // ==================== props: voxel brick planets ====================
  // a ball built from bevelled plastic cubes; colour(dir) picks each cube's colour from its direction from the centre.
  const VOX = {};
  const voxCells = (n) => VOX[n] || (VOX[n] = (() => { // surface cells of a ball n cells in radius
    const o = [], inside = (i, j, k) => i * i + j * j + k * k <= n * n;
    for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) for (let k = -n; k <= n; k++) {
      if (!inside(i, j, k)) continue;
      if (inside(i + 1, j, k) && inside(i - 1, j, k) && inside(i, j + 1, k) && inside(i, j - 1, k) && inside(i, j, k + 1) && inside(i, j, k - 1)) continue;
      o.push([i, j, k]);
    }
    return o;
  })());
  const voxBall = (S, c, r, n, colour, spin = 0, tilt = 0, opt = {}) => {
    const cell = r / n, T = (p) => add(rotZ(rotY(p, spin), tilt), c);
    for (const [i, j, k] of voxCells(n)) {
      const lp = [i * cell, j * cell, k * cell], d = norm([i, j, k]);
      const wp = T(lp); // cull cubes on the far side cheaply (the renderer culls faces too)
      if (dot(sub(wp, c), sub(S.E, c)) < -r * r * 0.35) continue;
      S.box((p) => T(add(p, lp)), cell * 0.5, cell * 0.5, cell * 0.5, colour(d, [i, j, k]), { bevel: opt.bevel ?? 0.18 });
    }
  };
  const NZ = H.makeNoise(11);
  const earthCol = (d) => { if (Math.abs(d[1]) > 0.86) return P.white; const v = NZ.n3(d[0] * 1.7, d[1] * 1.7, d[2] * 1.7) + 0.1 * NZ.n3(d[0] * 4, d[1] * 4, d[2] * 4); return v > 0.12 ? (v > 0.32 ? [96, 150, 70] : P.green) : (v > 0.02 ? [62, 140, 226] : P.blue); };
  const moonCol = (d) => { const v = NZ.n3(d[0] * 2.4 + 9, d[1] * 2.4, d[2] * 2.4); return v > 0.22 ? [128, 128, 136] : v < -0.25 ? [222, 222, 226] : [184, 184, 192]; };
  const sunCol = (d) => { const v = NZ.n3(d[0] * 3 + 3, d[1] * 3, d[2] * 3); return v > 0.15 ? [255, 150, 30] : [255, 198, 46]; };
  const earth = (S, c, r, spin = 0, tilt = 0, n = 4) => voxBall(S, c, r, n, earthCol, spin, tilt);
  const moon = (S, c, r, spin = 0, n = 3) => voxBall(S, c, r, n, moonCol, spin, 0);
  const sun = (S, c, r, spin = 0, n = 4) => voxBall(S, c, r, n, sunCol, spin, 0, { bevel: 0.25 });

  // ==================== sets ====================
  // space: deep navy with stars and a soft glow, cached; the diorama floats (no ground shadows)
  const spaceSet = (ctx, W, H_, t, glowX = 0.3) => {
    const L = BXC.space || (BXC.space = (() => {
      const c = H.layer(W, H_), g = c.getContext('2d');
      const bg = g.createLinearGradient(0, 0, 0, H_); bg.addColorStop(0, '#0b1230'); bg.addColorStop(1, '#1b1f4a'); g.fillStyle = bg; g.fillRect(0, 0, W, H_);
      const r = H.rng(41); for (let i = 0; i < 420; i++) { const s = r.range(0.8, 2.6); g.fillStyle = `rgba(255,255,${r.range(220, 255) | 0},${r.range(0.35, 0.95)})`; g.beginPath(); g.arc(r.range(0, W), r.range(0, H_), s, 0, TAU); g.fill(); }
      return c;
    })());
    ctx.drawImage(L, 0, 0);
    const g = ctx.createRadialGradient(W * glowX, H_ * 0.45, 10, W * glowX, H_ * 0.45, W * 0.55); g.addColorStop(0, 'rgba(120,140,255,0.22)'); g.addColorStop(1, 'rgba(120,140,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_);
    const r = H.rng(9); for (let i = 0; i < 40; i++) { const x = r.range(0, W), y = r.range(0, H_), a = 0.5 + 0.5 * Math.sin(t * r.range(1, 3) + i); ctx.fillStyle = `rgba(255,255,240,${0.6 * a})`; ctx.fillRect(x, y, 3, 3); }
  };
  const SPACE_ENV = { shadows: false, sky: [180, 190, 255], ground: [60, 60, 120], light: [-0.7, 0.5, 0.6] };
  // a 2D quad in world space (floors, water, sand)
  const quad3 = (ctx, S, pts, fill) => { const sp = pts.map(S.proj); if (sp.some((p) => p[2] < 0.3)) return; ctx.beginPath(); sp.forEach((s, i) => (i ? ctx.lineTo(s[0], s[1]) : ctx.moveTo(s[0], s[1]))); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
  // beach: sky + far sea in soft focus, sand sloping into the water; the water line moves with the tide (lvl, world units)
  const beachSet = (ctx, W, H_, S, t, lvl = 0) => {
    const hz = S.proj([S.TG[0], 0, S.TG[2] - 60])[1];
    const bg = BXC.bgB || (BXC.bgB = H.layer(W / 4, H_ / 4)), b = bg.getContext('2d', { willReadFrequently: true });
    b.setTransform(0.25, 0, 0, 0.25, 0, 0);
    const sk = b.createLinearGradient(0, 0, 0, hz); sk.addColorStop(0, '#7fbdf2'); sk.addColorStop(1, '#e6f3fb'); b.fillStyle = sk; b.fillRect(0, 0, W, H_);
    const r = H.rng(17);
    for (let i = 0; i < 6; i++) { const cx = ((r.range(-200, W + 120) + t * r.range(4, 10)) % (W + 220)) - 100, cy = r.range(80, Math.max(100, hz - 160)), sc = r.range(1.1, 1.8);
      for (let k = 0; k < 6; k++) { const ox = (k - 2.5) * 34 * sc, oy = -Math.sin((k / 5) * Math.PI) * 26 * sc, rad = (28 + Math.sin(k * 1.7) * 8) * sc; b.fillStyle = '#ffffff'; b.beginPath(); b.arc(cx + ox, cy + oy, rad, 0, TAU); b.fill(); } }
    const sea = b.createLinearGradient(0, hz, 0, H_); sea.addColorStop(0, '#3f8fd8'); sea.addColorStop(1, '#2a6fc0'); b.fillStyle = sea; b.fillRect(0, hz, W, H_ - hz);
    ctx.save(); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high'; ctx.drawImage(bg, 0, 0, W, H_); ctx.restore();
    // sand: a gentle slope up toward the camera (y = (z - 0.5) * 0.18), water: flat at y = lvl
    const slope = 0.18, sy = (z) => (z - 0.5) * slope, zMax = S.E[2] - 0.8, shoreZ = 0.5 + lvl / slope;
    const strip = (z0, z1, col) => quad3(ctx, S, [[-14, sy(z0), z0], [14, sy(z0), z0], [14, sy(z1), z1], [-14, sy(z1), z1]], col);
    for (let z = -12; z < zMax; z += 0.5) strip(z, Math.min(zMax, z + 0.5), (Math.floor(z * 2) % 2) ? '#ecd29a' : '#e8cc92');
    strip(shoreZ - 0.5, shoreZ + 0.25, '#c9ab72'); // wet sand at the water's edge
    quad3(ctx, S, [[-14, lvl, -40], [14, lvl, -40], [14, lvl, shoreZ], [-14, lvl, shoreZ]], 'rgba(48,128,214,0.92)');
    for (let i = 0; i < 3; i++) { const z = shoreZ - 0.15 - i * 0.7 - ((t * 0.4) % 0.7); quad3(ctx, S, [[-14, lvl + 0.005, z - 0.05], [14, lvl + 0.005, z - 0.05], [14, lvl + 0.005, z + 0.05], [-14, lvl + 0.005, z + 0.05]], `rgba(255,255,255,${0.5 - i * 0.14})`); }
    return { sy, shoreZ };
  };
  // night: darken and cool the frame, keep a few stars in the sky band
  const nightGrade = (ctx, W, H_, k, stars = true) => {
    if (k <= 0) return;
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgba(${H.lerp(255, 40, k) | 0},${H.lerp(255, 52, k) | 0},${H.lerp(255, 110, k) | 0},1)`; ctx.fillRect(0, 0, W, H_); ctx.restore();
    if (stars) { const r = H.rng(5); ctx.fillStyle = `rgba(255,255,235,${0.85 * k})`; for (let i = 0; i < 90; i++) { const s = r.range(1.5, 3.2); ctx.fillRect(r.range(0, W), r.range(0, H_ * 0.33), s, s); } }
  };
  // the Moon in a sky (2D, behind or over the set): a glowing pale disc with grey maria
  const skyMoon = (ctx, x, y, R, a = 1) => {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    const g = ctx.createRadialGradient(x, y, R * 0.8, x, y, R * 3.2); g.addColorStop(0, 'rgba(230,236,255,0.35)'); g.addColorStop(1, 'rgba(230,236,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R * 3.2, 0, TAU); ctx.fill();
    ctx.fillStyle = '#f1f0e6'; ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(160,160,170,0.55)'; [[-0.3, -0.2, 0.28], [0.25, 0.1, 0.22], [-0.05, 0.35, 0.16]].forEach(([dx, dy, rr]) => { ctx.beginPath(); ctx.arc(x + dx * R, y + dy * R, rr * R, 0, TAU); ctx.fill(); });
    ctx.restore();
  };
  // underwater reef: teal water with light rays, sand floor
  const reefSet = (ctx, W, H_, S, t) => {
    const g = ctx.createLinearGradient(0, 0, 0, H_); g.addColorStop(0, '#1d6f95'); g.addColorStop(1, '#0d3c5c'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_);
    ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 6; i++) { const x = W * (0.1 + i * 0.17) + Math.sin(t * 0.5 + i) * 30; const rg = ctx.createLinearGradient(x, 0, x + 200, H_); rg.addColorStop(0, 'rgba(160,230,255,0.16)'); rg.addColorStop(1, 'rgba(160,230,255,0)'); ctx.fillStyle = rg; ctx.beginPath(); ctx.moveTo(x - 30, 0); ctx.lineTo(x + 50, 0); ctx.lineTo(x + 260, H_); ctx.lineTo(x + 120, H_); ctx.closePath(); ctx.fill(); } ctx.restore();
    const zMax = S.E[2] - 0.8; quad3(ctx, S, [[-14, 0, -12], [14, 0, -12], [14, 0, zMax], [-14, 0, zMax]], '#c9b98a');
  };
  const REEF_ENV = { sky: [150, 220, 240], ground: [120, 160, 150] };
  // a coral: a stack of plastic cylinders branching up
  const coral = (S, x, z, s, col, seed) => {
    const r = H.rng(seed);
    S.cyl((p) => add(mul(p, s), [x, 0, z]), 0.22, 0.5, col, 10);
    for (let i = 0; i < 3; i++) { const a = r.range(-0.7, 0.7), h = r.range(0.4, 0.8), ox = Math.sin(a) * 0.25, oz = r.range(-0.15, 0.15);
      S.cyl((p) => add(mul(rotZ(p, a), s), [x + ox * s, 0.45 * s, z + oz * s]), 0.12, h, col, 8);
      S.cyl((p) => add(mul(p, s), [x + (ox + Math.sin(a) * h) * s, (0.45 + Math.cos(a) * h) * s, z + oz * s]), 0.14, 0.08, H.mix(col, [255, 255, 255], 0.25), 8); }
  };
  // a clock printed on a plastic plate
  const clockFace = (hours) => (c, w, h) => {
    c.fillStyle = '#fffaf0'; c.beginPath(); c.arc(w / 2, h / 2, w * 0.42, 0, TAU); c.fill(); c.strokeStyle = '#2a2a33'; c.lineWidth = w * 0.03; c.stroke();
    c.fillStyle = '#2a2a33'; for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; c.beginPath(); c.arc(w / 2 + Math.sin(a) * w * 0.34, h / 2 - Math.cos(a) * w * 0.34, w * 0.022, 0, TAU); c.fill(); }
    const ha = (hours / 12) * TAU, ma = (hours % 1) * TAU; c.lineCap = 'round';
    c.lineWidth = w * 0.04; c.beginPath(); c.moveTo(w / 2, h / 2); c.lineTo(w / 2 + Math.sin(ha) * w * 0.2, h / 2 - Math.cos(ha) * w * 0.2); c.stroke();
    c.strokeStyle = '#e2402c'; c.lineWidth = w * 0.025; c.beginPath(); c.moveTo(w / 2, h / 2); c.lineTo(w / 2 + Math.sin(ma) * w * 0.32, h / 2 - Math.cos(ma) * w * 0.32); c.stroke();
  };
  // a red brick X or a green brick tick at (x, y, z), popping with u
  const brickX = (S, x, y, z, u, s = 1) => { if (u <= 0) return; const yy = y + (1 - H.ease.out(H.clamp(u))) * 2.2; for (const a of [0.78, -0.78]) S.box((p) => add(rotZ(mul(p, s), a), [x, yy, z]), 0.5, 0.11, 0.11, P.red, { bevel: 0.35 }); };
  const brickTick = (S, x, y, z, u, s = 1) => { if (u <= 0) return; S.box((p) => add(rotZ(mul(p, u * s), -0.8), [x - 0.22 * s, y - 0.06 * s, z]), 0.2, 0.1, 0.1, P.green, { bevel: 0.35 }); S.box((p) => add(rotZ(mul(p, u * s), 0.9), [x + 0.17 * s, y + 0.08 * s, z]), 0.4, 0.1, 0.1, P.green, { bevel: 0.35 }); };
  // brick confetti burst from (x0, y0) at time st
  const confetti = (S, t, st, x0 = 0, y0 = 0.5, n = 16, seed = 5) => { const r = H.rng(seed); for (let i = 0; i < n; i++) { const vx = r.range(-1.6, 1.6), vy = r.range(2.6, 3.8), z0 = r.range(-0.5, 1.2), d = r() * 0.3, u = t - st - d; if (u < 0) continue; const y = y0 + vy * u - 2.9 * u * u; if (y < 0.1) continue; S.box((p) => add(rotZ(rotX(p, u * 3 + i), u * 2.5), [x0 + vx * u, y, z0]), 0.13, 0.1, 0.13, [P.red, P.yellow, P.blue, P.green][i % 4], { bevel: 0.25 }); } };

  // ==================== sound helpers ====================
  const SFX = (k) => ({
    clack: (t, g = 1, p = 0) => { k.noise(t, { dur: 0.03, filter: 'bandpass', f: 2600, q: 1.6, gain: 0.32 * g, a: 0.001, pan: p, minor: true }); k.tone(t, { f: [[0, 520], [0.05, 380]], dur: 0.06, gain: 0.12 * g, pan: p, minor: true }); },
    seat: (t, g = 1, p = 0) => { k.noise(t, { dur: 0.03, filter: 'bandpass', f: 2600, q: 1.6, gain: 0.32 * g, a: 0.001, pan: p, minor: true }); k.noise(t + 0.035, { dur: 0.012, filter: 'highpass', f: 4200, gain: 0.18 * g, a: 0.001, pan: p, minor: true }); },
    cut: (t) => k.play('swish', t - 0.04, { dur: 0.12, gain: 0.35, minor: true }),
    words: (t0, n, per = 0.12) => { for (let i = 0; i < n; i++) k.play('tick', t0 + i * per, { f: 3400, gain: 0.22, minor: true }); },
  });
