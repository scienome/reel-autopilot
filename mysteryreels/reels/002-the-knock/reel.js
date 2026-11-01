// The Witness, file 2 (fiction): the knock. Every time comes from window.TIMING.
(() => {
  const { W, H, INK, PAPER, RED, back, ramp, clamp } = N;
  const TM = window.TIMING, DURATION = TM.duration, S = TM.shots, order = Object.keys(S);
  const span = (name) => { const i = order.indexOf(name); return [S[name], i + 1 < order.length ? S[order[i + 1]] : DURATION]; };
  const line = (name, k = 0) => TM.lines.filter((l) => l.shot === name)[k];
  const captionNow = (ctx, t, name) => { let cur = null; for (const l of TM.lines) if (l.shot === name && t >= l.t0) cur = l; if (cur) N.caption(ctx, cur.cap, cur.t0, t); };

  const door = (ctx, open) => { // his front door, seen from inside
    ctx.fillStyle = PAPER; ctx.fillRect(166, 170, 388, 720); ctx.fillStyle = INK; ctx.fillRect(180, 184, 360, 706);
    if (open > 0) { ctx.fillStyle = PAPER; ctx.fillRect(180, 184, 360 * open, 706); ctx.fillStyle = INK; ctx.save(); ctx.globalAlpha = 0.2; for (let i = 0; i < 12; i++) ctx.fillRect(180, 200 + i * 58, 360 * open, 3); ctx.restore(); }
    ctx.fillStyle = PAPER; if (open <= 0) { ctx.fillRect(280, 280, 160, 110); ctx.beginPath(); ctx.arc(494, 560, 13, 0, 6.3); ctx.fill(); }
  };
  const photoCard = (ctx, x, y, s, rot) => { // a man asleep, seen from above the bed
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = PAPER; ctx.fillRect(-250, -190, 500, 380); ctx.fillStyle = INK; ctx.fillRect(-226, -166, 452, 288);
    ctx.fillStyle = PAPER; ctx.fillRect(-190, -60, 380, 150); ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(-112, -6, 42, 34, 0, 0, 6.3); ctx.fill(); ctx.fillRect(-64, -34, 230, 90);
    ctx.fillStyle = RED; ctx.font = `28px ${N.F.type}`; ctx.textAlign = 'center'; ctx.fillText('03:12 AM', 0, 164); ctx.restore();
  };
  const paperBack = (ctx, x, y, s, u) => { ctx.save(); ctx.translate(x, y); ctx.rotate(0.03); ctx.scale(s, s); ctx.fillStyle = PAPER; ctx.fillRect(-270, -200, 540, 400); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.strokeRect(-250, -180, 500, 360); ctx.textAlign = 'center'; ctx.globalAlpha = u; ctx.fillStyle = INK; ctx.font = `76px ${N.F.num}`; ctx.fillText('LEVEL NINE', 0, -18); ctx.fillStyle = RED; ctx.fillText('NEEDS YOU', 0, 86); ctx.restore(); };
  const badge = (ctx, x, y, s, on) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.05); ctx.fillStyle = PAPER; ctx.fillRect(-170, -230, 340, 460); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.strokeRect(-154, -214, 308, 428);
    ctx.fillStyle = on ? RED : INK; ctx.fillRect(-154, -214, 308, 64); ctx.fillStyle = PAPER; ctx.textAlign = 'center'; ctx.font = `38px ${N.F.num}`; ctx.fillText('NIGHT CREW', 0, -168);
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, -66, 62, 0, 6.3); ctx.fill(); ctx.fillRect(-90, 0, 180, 62); ctx.font = `30px ${N.F.type}`; ctx.fillText('ACCESS: LEVEL 9', 0, 122);
    if (on) { ctx.globalAlpha = 0.4; ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(116, 182, 48, 0, 6.3); ctx.fill(); ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(116, 182, 20, 0, 6.3); ctx.fill(); }
    ctx.restore();
  };

  const shot = (name, draw) => { const [a, b] = span(name); return { a, b, draw }; };
  const SHOTS = [
    shot('hook', (ctx, t) => {
      const l2 = line('hook', 1); N.bg(ctx); door(ctx, clamp((t - l2.t0 - 0.2) / 0.5)); N.floor(ctx, 890, 1270, { rows: 18 });
      N.tag(ctx, 'THE WITNESS: FILE 2', W / 2, 120, { px: 34 });
      if (t >= l2.t0 + 0.2) N.figure(ctx, 300, 900, 480, { kind: 'coat', facing: 1, arms: [[60, 20], [-6, 8]] });
      N.note(ctx, 'A fictional story', 250, 160, { px: 22, col: PAPER }); N.rain(ctx, t, 60, 0.3); N.finish(ctx, t); captionNow(ctx, t, 'hook');
    }),
    shot('photo', (ctx, t) => {
      const [a, b] = span('photo'); N.bg(ctx); N.beam(ctx, 360, -160, -100, 820, 980, { lines: 90, seed: 25 }); N.floor(ctx, 880, 1270, { rows: 18 });
      photoCard(ctx, 360, 500, 1.1 + 0.08 * clamp((t - a) / (b - a)), -0.04);
      N.finish(ctx, t); captionNow(ctx, t, 'photo');
    }),
    shot('back', (ctx, t) => {
      const l2 = line('back', 1); N.bg(ctx); N.stripes(ctx, -20, { band: 56, gap: 80, offset: t * 5, seed: 18 }); ctx.fillStyle = 'rgba(11,11,12,0.45)'; ctx.fillRect(0, 0, W, H);
      paperBack(ctx, 360, 500, 1.15, ramp(t, l2.t0, 0.3));
      N.finish(ctx, t); captionNow(ctx, t, 'back');
    }),
    shot('badge', (ctx, t) => {
      const l1 = line('badge'); N.bg(ctx); N.beam(ctx, 360, -160, -100, 820, 980, { lines: 90, seed: 41 }); N.floor(ctx, 880, 1270, { rows: 18 });
      badge(ctx, 360, 490, 1.15, t >= l1.t0 + 1 && Math.sin(t * 8) > -0.2);
      N.finish(ctx, t); captionNow(ctx, t, 'badge');
    }),
    shot('end', (ctx, t) => {
      const l = line('end'); N.bg(ctx); N.corridor(ctx, 360, 520, { lines: 150, seed: 14 }); const u = clamp((t - l.t0) / (DURATION - l.t0));
      N.figure(ctx, 360, 900 - 100 * u, 540 - 220 * u, { kind: 'coat', hat: true, walk: t * 2, facing: 1, arms: [[24, 30], [-14, 10]], rim: true, rimW: 3 });
      if (t >= l.t1 - 0.2) { ctx.fillStyle = INK; ctx.fillRect(0, 96, W, 110); N.tag(ctx, 'FILE 3 COMING', W / 2, 154, { px: 40 }); }
      N.finish(ctx, t); captionNow(ctx, t, 'end');
    }),
  ];

  function draw(ctx, t) {
    N.sequence(ctx, t, SHOTS);
    const l = line('hook'); for (let i = 0; i < 3; i++) { const k = l.t0 + 0.9 + i * 0.28; if (t >= k && t < k + 0.09) { ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, 0, W, H); } }
  }

  function score(k) {
    order.slice(1).forEach((n) => k.play('whoosh', S[n] - 0.05, { dur: 0.34, gain: 0.34, minor: true }));
    TM.lines.forEach((l) => k.play('click', l.t0, { gain: 0.35, minor: true }));
    for (let i = 0; i * 5.5 < DURATION; i++) k.tone(i * 5.5, { f: 52 + (i % 2) * 6, type: 'triangle', dur: 5.6, gain: 0.09, a: 1, filter: 'lowpass', f2: 280 });
    const l = line('hook'); for (let i = 0; i < 3; i++) k.play('thud', l.t0 + 0.9 + i * 0.28, { f: 90, gain: 0.8 });
    k.play('impact', line('photo', 1).t0, { gain: 0.75 }); k.play('thud', line('back', 1).t0, { f: 64, gain: 0.7 });
    for (let i = 0; i < 6; i++) k.play('click', line('badge').t0 + 1 + i * 0.78, { gain: 0.5 });
    k.play('riser', line('end').t0 - 0.5, { dur: 1.6, gain: 0.22 });
  }
  window.REEL = { DURATION, draw, score };
})();
