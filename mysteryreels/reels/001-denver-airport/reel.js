// The Witness, file 1 (fiction): a night worker under Denver Airport. Every time comes from window.TIMING.
(() => {
  const { W, H, INK, PAPER, RED, back, ramp, clamp } = N;
  const TM = window.TIMING, DURATION = TM.duration, S = TM.shots, order = Object.keys(S);
  const span = (name) => { const i = order.indexOf(name); return [S[name], i + 1 < order.length ? S[order[i + 1]] : DURATION]; };
  const line = (name, k = 0) => TM.lines.filter((l) => l.shot === name)[k];
  const at = (name, u) => { const [a, b] = span(name); return a + (b - a) * u; };
  const captionNow = (ctx, t, name) => { let cur = null; for (const l of TM.lines) if (l.shot === name && t >= l.t0) cur = l; if (cur) N.caption(ctx, cur.cap, cur.t0, t); };

  const vault = (ctx, open) => { // a round steel door in the tunnel wall
    ctx.fillStyle = PAPER; ctx.fillRect(60, 170, 600, 700); ctx.fillStyle = INK; ctx.fillRect(84, 194, 552, 652);
    ctx.fillStyle = PAPER; ctx.beginPath(); ctx.arc(360, 520, 262, 0, 6.3); ctx.fill(); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(360, 520, 236, 0, 6.3); ctx.fill();
    ctx.fillStyle = PAPER; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ctx.beginPath(); ctx.arc(360 + Math.cos(a) * 248, 520 + Math.sin(a) * 248, 7, 0, 6.3); ctx.fill(); }
    ctx.save(); ctx.translate(360, 520); ctx.rotate(open * 2.4); ctx.strokeStyle = RED; ctx.lineWidth = 20; ctx.lineCap = 'round'; for (let i = 0; i < 3; i++) { ctx.rotate(Math.PI / 1.5); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -128); ctx.stroke(); } ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(0, 0, 34, 0, 6.3); ctx.fill(); ctx.restore();
  };
  const eyes = (ctx, x, y, r, t) => { // the only colour in the dark, slit like a lizard's
    [-1, 1].forEach((d) => { const ex = x + d * r * 1.5; ctx.globalAlpha = 0.35; ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(ex, y, r * 1.9, 0, 6.3); ctx.fill(); ctx.globalAlpha = 1; ctx.beginPath(); ctx.ellipse(ex, y, r, r * 0.72, 0, 0, 6.3); ctx.fill(); ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(ex, y, r * 0.18 * (1 + 0.2 * Math.sin(t * 3)), r * 0.68, 0, 0, 6.3); ctx.fill(); });
  };
  const badge = (ctx, x, y, s) => { // his crew badge
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.05); ctx.fillStyle = PAPER; ctx.fillRect(-170, -230, 340, 460); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.strokeRect(-154, -214, 308, 428);
    ctx.fillStyle = RED; ctx.fillRect(-154, -214, 308, 64); ctx.fillStyle = PAPER; ctx.textAlign = 'center'; ctx.font = `38px ${N.F.num}`; ctx.fillText('NIGHT CREW', 0, -168);
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, -66, 62, 0, 6.3); ctx.fill(); ctx.fillRect(-90, 0, 180, 62); ctx.font = `30px ${N.F.type}`; ctx.fillText('ACCESS: LEVEL 9', 0, 122); ctx.fillStyle = 'rgba(11,11,12,0.55)'; for (let i = 0; i < 2; i++) ctx.fillRect(-110, 152 + i * 24, i ? 130 : 220, 6); ctx.restore();
  };

  const shot = (name, draw) => { const [a, b] = span(name); return { a, b, draw }; };
  const SHOTS = [
    shot('hook', (ctx, t) => {
      N.bg(ctx); N.corridor(ctx, 360, 520, { lines: 150, seed: 14 });
      N.figure(ctx, 360, 900, 520, { kind: 'coat', hat: true, walk: t * 1.1, facing: 1, arms: [[26, 34], [-14, 10]], rim: true, rimW: 3 });
      N.tag(ctx, 'THE WITNESS: FILE 1', W / 2, 150, { px: 34 }); N.note(ctx, 'A fictional story', 250, 212, { px: 24, col: PAPER });
      N.finish(ctx, t); captionNow(ctx, t, 'hook');
    }),
    shot('door', (ctx, t) => {
      const l2 = line('door', 1), [a, b] = span('door'); N.bg(ctx); ctx.save(); const z = 1 + 0.07 * clamp((t - a) / (b - a)); ctx.translate(360, 520); ctx.scale(z, z); ctx.translate(-360, -520); vault(ctx, 0); ctx.restore();
      if (t >= l2.t0) N.bubble(ctx, 186, 128, 300, 118, 'For luggage?', { u: back(t, l2.t0, 0.18), px: 38, tail: [260, 240], seed: 8 });
      N.finish(ctx, t); captionNow(ctx, t, 'door');
    }),
    shot('nine', (ctx, t) => {
      const l1 = line('nine'), l2 = line('nine', 1); N.bg(ctx);
      if (t < l2.t0) { vault(ctx, clamp((t - l1.t0) / 1.2)); ctx.fillStyle = `rgba(0,0,0,${0.6 * clamp((t - l1.t0) / 1.2)})`; ctx.fillRect(0, 0, W, H); } else { N.stripes(ctx, 90, { band: 40, gap: 90, offset: t * 8, seed: 9 }); ctx.fillStyle = 'rgba(11,11,12,0.45)'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = INK; ctx.fillRect(70, 190, 580, 560); N.stat(ctx, 'LEVEL', W / 2, 330, 130, { u: back(t, l2.t0, 0.2) }); N.stat(ctx, '9', W / 2, 610, 330, { col: RED, u: back(t, l2.t0 + 0.15, 0.22) }); }
      N.finish(ctx, t); captionNow(ctx, t, 'nine');
    }),
    shot('thing', (ctx, t) => {
      const l1 = line('thing'), l2 = line('thing', 1); N.bg(ctx); N.corridor(ctx, 360, 520, { lines: 120, seed: 31 });
      const u = clamp((t - l1.t0) / (l2.t0 - l1.t0)), h = 300 + 130 * u; N.figure(ctx, 360, 900, h, { kind: 'suit', facing: 1, arms: [[4, 6], [-4, 6]], rim: true, rimW: 2 });
      if (t >= l2.t0 + 1.1) { ctx.fillStyle = `rgba(0,0,0,${0.82 * ramp(t, l2.t0 + 1.1, 0.25)})`; ctx.fillRect(0, 0, W, H); eyes(ctx, 360, 470, 58 * back(t, l2.t0 + 1.2, 0.25), t); }
      N.finish(ctx, t); captionNow(ctx, t, 'thing');
    }),
    shot('name', (ctx, t) => {
      const l = line('name'); N.bg(ctx); eyes(ctx, 360, 300, 46, t);
      N.profile(ctx, 360, 720, 1.25, { hat: true, facing: 1, rimW: 4 });
      N.bubble(ctx, 360, 150, 300, 110, 'Daniel.', { u: back(t, l.t0 + 0.7, 0.18), px: 46, red: true, seed: 12 });
      N.finish(ctx, t); captionNow(ctx, t, 'name');
    }),
    shot('gone', (ctx, t) => {
      const l = line('gone'); N.bg(ctx); N.corridor(ctx, 360, 540, { lines: 150, seed: 44 });
      N.figure(ctx, 360, 900, 560, { kind: 'coat', walk: t * 8, facing: 1, arms: [[52 * Math.sin(t * 8), 40], [-52 * Math.sin(t * 8), 40]], rim: true, rimW: 3 });
      N.stamp(ctx, 'NO RECORD', W / 2, 260, back(t, l.t1 - 1.5, 0.18), { px: 110, rot: -0.09 });
      N.finish(ctx, t); captionNow(ctx, t, 'gone');
    }),
    shot('end', (ctx, t) => {
      const l2 = line('end', 1), [a] = span('end'); N.bg(ctx); N.beam(ctx, 360, -160, -100, 820, 980, { lines: 90, seed: 25 }); N.floor(ctx, 880, 1270, { rows: 18 });
      badge(ctx, 360, 490, 1.05 + 0.03 * clamp((t - a) / 4));
      if (t >= l2.t1 - 0.2) { ctx.fillStyle = INK; ctx.fillRect(0, 96, W, 110); N.tag(ctx, 'FILE 2 COMING', W / 2, 154, { px: 40 }); }
      N.finish(ctx, t); captionNow(ctx, t, 'end');
    }),
  ];

  function draw(ctx, t) {
    N.sequence(ctx, t, SHOTS);
    const l2 = line('end', 1);
    for (let i = 0; i < 3; i++) { const k = l2.t0 + 1.2 + i * 0.28; if (t >= k && t < k + 0.09) { ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, 0, W, H); } }
  }

  function score(k) {
    order.slice(1).forEach((n) => k.play('whoosh', S[n] - 0.05, { dur: 0.34, gain: 0.34, minor: true }));
    TM.lines.forEach((l) => k.play('click', l.t0, { gain: 0.35, minor: true }));
    for (let i = 0; i * 5.5 < DURATION; i++) k.tone(i * 5.5, { f: 52 + (i % 2) * 6, type: 'triangle', dur: 5.6, gain: 0.09, a: 1, filter: 'lowpass', f2: 280 });
    k.play('thud', line('door', 1).t0, { f: 70, gain: 0.6 }); k.play('riser', line('thing').t0, { dur: 2.4, gain: 0.2 }); k.play('impact', line('thing', 1).t0 + 1.2, { gain: 0.85 }); k.play('thud', line('name').t0 + 0.7, { f: 60, gain: 0.7 }); k.play('impact', line('gone').t1 - 1.5, { gain: 0.6 });
    const l2 = line('end', 1); for (let i = 0; i < 3; i++) k.play('thud', l2.t0 + 1.2 + i * 0.28, { f: 90, gain: 0.8 });
  }
  window.REEL = { DURATION, draw, score };
})();
