// 053-who-goes-home (fiction). Every time comes from window.TIMING.
(() => { const SPEC = [{"name": "hook", "bg": "beam", "items": [{"k": "paper", "rows": ["WHO", "*GOES HOME"], "px": 104, "x": 360, "y": 520, "w": 520, "h": 380, "dt": 0.1, "rot": -0.03, "at": 0}], "seed": 48, "floor": 920, "hook": {"tag": "ROOM FOUR: PART 12", "fiction": true}}, {"name": "a", "bg": "plain", "items": [{"k": "stat", "s": "3", "y": 450, "px": 260, "red": true, "band": true, "at": 0, "dt": 0.1}]}, {"name": "b", "bg": "plain", "items": [{"k": "paper", "rows": ["NO", "*SCAR"], "px": 130, "x": 360, "y": 520, "w": 520, "h": 380, "dt": 0.1, "rot": -0.03, "at": 0}]}, {"name": "c", "bg": "plain", "items": [{"k": "eyes", "x": 360, "y": 520, "sz": 1.6, "red": false, "at": 0, "dt": 0.1}]}, {"name": "end", "bg": "stripes", "items": [{"k": "stamp", "s": "SHE CHOSE", "y": 560, "px": 96, "at": 0, "dt": 0.2}], "seed": 15, "dim": 0.55, "next": "PART 13 COMING"}];
  const { W, H, INK, PAPER, RED, back, ramp, clamp } = N;
  const TM = window.TIMING, DURATION = TM.duration, S = TM.shots, order = Object.keys(S);
  const span = (name) => { const i = order.indexOf(name); return [S[name], i + 1 < order.length ? S[order[i + 1]] : DURATION]; };
  const line = (name, k = 0) => TM.lines.filter((l) => l.shot === name)[k] || TM.lines.filter((l) => l.shot === name).pop();
  const captionNow = (ctx, t, name) => { let cur = null; for (const l of TM.lines) if (l.shot === name && t >= l.t0) cur = l; if (cur) N.caption(ctx, cur.cap, cur.t0, t); };
  const mask = (ctx, x, y, s, u = 1, red = false) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s * u, s * u); ctx.fillStyle = red ? RED : PAPER; ctx.beginPath(); ctx.moveTo(-52, -70); ctx.quadraticCurveTo(0, -92, 52, -70); ctx.quadraticCurveTo(62, 26, 0, 88); ctx.quadraticCurveTo(-62, 26, -52, -70); ctx.fill(); ctx.fillStyle = INK; [-1, 1].forEach((d) => { ctx.beginPath(); ctx.ellipse(d * 24, -18, 16, 6, d * 0.2, 0, 6.3); ctx.fill(); }); ctx.fillRect(-14, 40, 28, 4); ctx.restore(); };
  const eyes = (ctx, x, y, s, u = 1, col = PAPER) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s * u, s * u); [-1, 1].forEach((d) => { ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(d * 46, 0, 34, 16, d * -0.15, 0, 6.3); ctx.fill(); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(d * 46, 0, 9, 0, 6.3); ctx.fill(); }); ctx.restore(); };
  const door = (ctx, x, y, w, h, label, u = 1, open = 0) => { if (u <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(u, u); ctx.fillStyle = PAPER; ctx.fillRect(-w / 2, 0, w, h); ctx.fillStyle = INK; ctx.fillRect(-w / 2 + 14, 14, w - 28, h - 14); if (open > 0) { ctx.fillStyle = PAPER; ctx.fillRect(-w / 2 + 14, 14, (w - 28) * open, h - 14); } ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(w / 2 - 44, h * 0.55, 9, 0, 6.3); ctx.fill(); if (label) { ctx.fillStyle = PAPER; ctx.font = `${Math.min(110, w * 0.4)}px ${N.F.num}`; ctx.textAlign = 'center'; ctx.fillText(label, 0, h * 0.34); } ctx.restore(); };
  const grid = (ctx, t, x, y, cols, rows, cell, redI, u = 1) => { if (u <= 0) return; ctx.save(); for (let i = 0; i < cols * rows; i++) { const cx = x + (i % cols) * cell, cy = y + Math.floor(i / cols) * cell * 1.3; const on = i === redI ? Math.sin(t * 9) > -0.3 : Math.sin(t * 2 + i * 1.7) > 0.5; ctx.fillStyle = i === redI ? RED : (on ? PAPER : '#2a2a2c'); ctx.globalAlpha = u; ctx.fillRect(cx, cy, cell * 0.7, cell * 0.95); } ctx.restore(); };
  const sheet = (ctx, o, u) => { ctx.save(); ctx.translate(o.x ?? 360, o.y ?? 480); ctx.rotate(o.rot ?? -0.03); ctx.scale(u, u); const w = o.w ?? 520, h = o.h ?? 560; ctx.fillStyle = o.dark ? INK : PAPER; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.strokeStyle = o.dark ? PAPER : INK; ctx.lineWidth = 5; ctx.strokeRect(-w / 2 + 14, -h / 2 + 14, w - 28, h - 28); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const rows = o.rows, gap = (h - 90) / rows.length; rows.forEach((r, i) => { const red = r[0] === '*'; const s = red ? r.slice(1) : r; const px = o.px ?? 84; ctx.font = `${px}px ${o.type ? N.F.type : N.F.num}`; ctx.fillStyle = red ? RED : (o.dark ? PAPER : INK); ctx.fillText(s, 0, -h / 2 + 45 + gap * (i + 0.5)); }); ctx.restore(); };
  const draw1 = (ctx, t, sc, it, st) => {
    const l = line(sc, it.at || 0), t0 = l.t0 + (it.dt || 0), u = back(t, t0, it.d || 0.2); if (t < t0) return;
    switch (it.k) {
      case 'stat': if (it.band !== false) { ctx.fillStyle = INK; ctx.fillRect(0, (it.y || 180) - 85, W, 170); } N.stat(ctx, it.s, it.x ?? W / 2, it.y || 180, it.px || 120, { col: it.red ? RED : PAPER, u }); break;
      case 'stamp': N.stamp(ctx, it.s, it.x ?? W / 2, it.y || 600, u, { px: it.px || 76, rot: it.rot ?? -0.07 }); break;
      case 'paper': sheet(ctx, it, u); break;
      case 'mask': mask(ctx, it.x, it.y, it.sz || 1, u, it.red); break;
      case 'eyes': eyes(ctx, it.x, it.y, it.sz || 1, u, it.red ? RED : PAPER); break;
      case 'door': door(ctx, it.x, it.y, it.w, it.h, it.label, u, it.open ? clamp((t - t0) / 0.6) : 0); break;
      case 'bubble': N.bubble(ctx, it.x, it.y, it.w || 300, it.h || 110, it.s, { u, px: it.px || 34, seed: it.seed || 7, red: it.red }); break;
      case 'tag': N.tag(ctx, it.s, it.x ?? W / 2, it.y || 300, { px: it.px || 34 }); break;
      case 'note': N.note(ctx, it.s, it.x, it.y, { px: it.px || 24, col: it.col || PAPER }); break;
      case 'grid': grid(ctx, t, it.x, it.y, it.cols, it.rows, it.cell, it.red, u); break;
      case 'rect': ctx.fillStyle = it.red ? RED : (it.ink ? INK : PAPER); ctx.fillRect(it.x, it.y, it.w, it.h); break;
      case 'circ': ctx.fillStyle = it.red ? RED : (it.ink ? INK : PAPER); ctx.beginPath(); ctx.ellipse(it.x, it.y, it.w, it.h, 0, 0, 6.3); ctx.fill(); break;
      case 'dim': ctx.fillStyle = `rgba(11,11,12,${it.a ?? 0.7})`; ctx.fillRect(0, 0, W, H); break;
    }
  };
  const BG = { beam: (c, s) => N.beam(c, 360, -160, -60, 780, 930, { lines: 100, seed: s }), corridor: (c, s) => N.corridor(c, 360, 520, { lines: 140, seed: s }), stripes: (c, s) => N.stripes(c, -20, { band: 46, gap: 96, offset: 0, seed: s }), window: (c, s) => N.windowPane(c, 40, 150, 640, 500, 3, { seed: s }), plain: () => {} };
  const mk = (sp) => { const [a, b] = span(sp.name); return { a, b, draw: (ctx, t) => {
    N.bg(ctx); (BG[sp.bg || 'plain'])(ctx, sp.seed || 5); if (sp.dim) { ctx.fillStyle = 'rgba(11,11,12,' + sp.dim + ')'; ctx.fillRect(0, 0, W, H); } if (sp.floor) N.floor(ctx, sp.floor, 1270, { rows: 18 });
    (sp.figs || []).forEach((f) => N.figure(ctx, f.x, f.base ?? 920, f.h ?? 520, { kind: f.kind || 'coat', facing: f.facing || 1, arms: f.arms || [[12, 14], [-8, 8]], rim: true, rimW: 2, walk: f.walk ? t * 0.8 : undefined, t }));
    (sp.items || []).forEach((it) => draw1(ctx, t, sp.name, it, sp));
    if (sp.rain) N.rain(ctx, t, 120, 0.4, 4);
    if (sp.hook) { ctx.fillStyle = INK; ctx.fillRect(0, 252, W, 118); N.tag(ctx, sp.hook.tag, W / 2, 292, { px: 30 }); if (sp.hook.fiction !== false) N.note(ctx, 'A fictional story', 250, 336, { px: 22, col: PAPER }); }
    if (sp.next && t >= line(sp.name, 99).t1 - 0.2) { ctx.fillStyle = INK; ctx.fillRect(0, 96, W, 90); N.tag(ctx, sp.next, W / 2, 144, { px: 38 }); }
    N.finish(ctx, t); captionNow(ctx, t, sp.name); } }; };
  const SHOTS = SPEC.map(mk);
  function score(k) {
    order.slice(1).forEach((n) => k.play('whoosh', S[n] - 0.05, { dur: 0.34, gain: 0.34, minor: true }));
    TM.lines.forEach((l) => k.play('click', l.t0, { gain: 0.35, minor: true }));
    for (let i = 0; i * 5.5 < DURATION; i++) k.tone(i * 5.5, { f: 49 + (i % 2) * 6, type: 'triangle', dur: 5.6, gain: 0.09, a: 1, filter: 'lowpass', f2: 280 });
    SPEC.forEach((sp) => (sp.items || []).forEach((it) => { const t0 = line(sp.name, it.at || 0).t0 + (it.dt || 0); if (it.k === 'rect' || it.k === 'circ' || it.k === 'dim' || it.k === 'tag' || it.k === 'note') {} else if (it.k === 'stamp' || it.k === 'door') k.play('impact', t0, { gain: 0.7 }); else if (['stat', 'paper', 'eyes'].includes(it.k)) k.play('thud', t0, { f: 66, gain: 0.55 }); else if (['bubble', 'mask'].includes(it.k)) k.play('pop', t0, { f: 300, gain: 0.25, minor: true }); }));
    const last = TM.lines[TM.lines.length - 1]; k.play('riser', last.t0 - 0.8, { dur: 1, gain: 0.2 }); k.play('thud', last.t0 + 0.5, { f: 60, gain: 0.6 });
  }
  window.REEL = { DURATION, draw: (ctx, t) => N.sequence(ctx, t, SHOTS), score };
})();
