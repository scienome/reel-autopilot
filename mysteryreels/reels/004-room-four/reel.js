// Room Four, part 1 (fiction): a cleaner at Area 51 and the door he must never open. Every time comes from window.TIMING.
(() => {
  const { W, H, INK, PAPER, RED, back, ramp, clamp } = N;
  const TM = window.TIMING, DURATION = TM.duration, S = TM.shots, order = Object.keys(S);
  const span = (name) => { const i = order.indexOf(name); return [S[name], i + 1 < order.length ? S[order[i + 1]] : DURATION]; };
  const line = (name, k = 0) => TM.lines.filter((l) => l.shot === name)[k];
  const captionNow = (ctx, t, name) => { let cur = null; for (const l of TM.lines) if (l.shot === name && t >= l.t0) cur = l; if (cur) N.caption(ctx, cur.cap, cur.t0, t); };
  const TAPS = (t0, n = 3) => Array.from({ length: n }, (_, i) => t0 + i * 0.3);

  const door = (ctx, slot) => { // steel door with a number and a sliding window
    ctx.fillStyle = PAPER; ctx.fillRect(110, 130, 500, 760); ctx.fillStyle = INK; ctx.fillRect(130, 150, 460, 740); ctx.fillStyle = PAPER; [[150, 170], [570, 170], [150, 870], [570, 870]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 7, 0, 6.3); ctx.fill(); });
    ctx.fillStyle = RED; ctx.font = `150px ${N.F.num}`; ctx.textAlign = 'center'; ctx.fillText('4', 360, 650);
    ctx.strokeStyle = PAPER; ctx.lineWidth = 5; ctx.strokeRect(210, 240, 300, 150); if (slot > 0) { ctx.fillStyle = PAPER; ctx.fillRect(210, 240, 300 * slot, 150); }
  };
  const oldFace = (ctx, x, y, s) => { // the narrator's own hat, with deep lines and tired eyes
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = INK; ctx.strokeStyle = PAPER; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(0, 0, 100, 128, 0, 0, 6.3); ctx.fill(); ctx.stroke();
    ctx.fillRect(-150, -92, 300, 16); ctx.fillRect(-82, -168, 164, 80); ctx.strokeRect(-150, -92, 300, 16); ctx.strokeRect(-82, -168, 164, 76);
    ctx.lineWidth = 4; [[-58, 26, -34, 62], [58, 26, 34, 62], [-30, 92, 30, 92]].forEach(([x0, y0, x1, y1]) => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); });
    [-1, 1].forEach((d) => { ctx.fillStyle = PAPER; ctx.beginPath(); ctx.ellipse(d * 40, -18, 24, 11, 0, 0, 6.3); ctx.fill(); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(d * 40, -18, 8, 0, 6.3); ctx.fill(); ctx.strokeStyle = PAPER; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(d * 18, -48); ctx.lineTo(d * 66, -40); ctx.stroke(); }); ctx.restore();
  };
  const mop = (ctx, x, y, h) => { ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x - 26, y); ctx.stroke(); ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(x - 28, y, 46, 16, 0, 0, 6.3); ctx.fill(); };
  const phone = (ctx, x, y, s, t) => { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 26) * 0.03); ctx.scale(s, s); ctx.fillStyle = PAPER; ctx.fillRect(-120, -240, 240, 480); ctx.fillStyle = INK; ctx.fillRect(-106, -214, 212, 410); ctx.fillStyle = PAPER; ctx.textAlign = 'center'; ctx.font = `40px ${N.F.num}`; ctx.fillText('HOME', 0, -100); ctx.font = `24px ${N.F.type}`; ctx.fillText('calling...', 0, -56); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(0, 90, 46, 0, 6.3); ctx.fill(); ctx.restore(); };

  const shot = (name, draw) => { const [a, b] = span(name); return { a, b, draw }; };
  const SHOTS = [
    shot('hook', (ctx, t) => {
      const l2 = line('hook', 1); N.bg(ctx); N.corridor(ctx, 360, 520, { lines: 140, seed: 21 });
      N.figure(ctx, 340, 900, 500, { kind: 'coat', facing: 1, walk: t * 0.8, arms: [[50, 20], [-8, 8]], rim: true, rimW: 3 }); mop(ctx, 470, 900, 420);
      ctx.fillStyle = INK; ctx.fillRect(0, 96, W, 170); N.stat(ctx, 'AREA 51', W / 2, 180, 130, { u: back(t, 0.3, 0.25) });
      N.tag(ctx, 'ROOM FOUR: PART 1', W / 2, 310, { px: 30 }); N.note(ctx, 'A fictional story', 250, 350, { px: 22, col: INK });
      N.finish(ctx, t); captionNow(ctx, t, 'hook');
    }),
    shot('tap', (ctx, t) => {
      const l1 = line('tap'), l2 = line('tap', 1); N.bg(ctx); door(ctx, 0); const taps = TAPS(l1.t1 - 1).concat(TAPS(l2.t1 + 0.15));
      const hit = taps.some((k) => t >= k && t < k + 0.1); if (hit) { ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, W, H); }
      if (t >= l2.t1 + 0.15) N.bubble(ctx, 190, 110, 280, 100, 'Tap. Tap. Tap.', { u: back(t, l2.t1 + 0.15, 0.15), px: 32, seed: 6 });
      N.finish(ctx, t); captionNow(ctx, t, 'tap');
    }),
    shot('face', (ctx, t) => {
      const l1 = line('face'), l2 = line('face', 1); N.bg(ctx); door(ctx, clamp((t - l1.t0) / 0.6)); ctx.save(); ctx.beginPath(); ctx.rect(210, 240, 300, 150); ctx.clip(); if (t >= l1.t0 + 0.6) oldFace(ctx, 360, 330, 0.72); ctx.restore();
      if (t >= l2.t0) { ctx.fillStyle = 'rgba(0,0,0,0.9)'; ctx.fillRect(0, 0, W, H); oldFace(ctx, 360, 480, 2.2 * back(t, l2.t0, 0.2)); }
      N.finish(ctx, t); captionNow(ctx, t, 'face');
    }),
    shot('sign', (ctx, t) => {
      const l = line('sign'); N.bg(ctx); N.beam(ctx, 360, -160, -100, 820, 980, { lines: 90, seed: 29 });
      ctx.save(); ctx.translate(360, 480); ctx.rotate(-0.05); const u = back(t, l.t0 + 0.4, 0.2); ctx.scale(u, u); ctx.fillStyle = PAPER; ctx.fillRect(-300, -200, 600, 400); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.strokeRect(-300, -200, 600, 400); ctx.textAlign = 'center'; ctx.fillStyle = INK; ctx.font = `104px ${N.F.num}`; ctx.fillText("DON'T", 0, -30); ctx.fillStyle = RED; ctx.fillText('GO HOME', 0, 90); ctx.restore();
      N.finish(ctx, t); captionNow(ctx, t, 'sign');
    }),
    shot('end', (ctx, t) => {
      const l2 = line('end', 1); N.bg(ctx); N.stripes(ctx, -22, { band: 50, gap: 90, offset: t * 4, seed: 33 }); ctx.fillStyle = 'rgba(11,11,12,0.55)'; ctx.fillRect(0, 0, W, H);
      phone(ctx, 360, 500, 1.3, t < l2.t0 ? t : 0);
      if (t >= l2.t1 - 0.2) { ctx.fillStyle = INK; ctx.fillRect(0, 96, W, 90); N.tag(ctx, 'PART 2 COMING', W / 2, 144, { px: 38 }); }
      N.finish(ctx, t); captionNow(ctx, t, 'end');
    }),
  ];

  function score(k) {
    order.slice(1).forEach((n) => k.play('whoosh', S[n] - 0.05, { dur: 0.34, gain: 0.34, minor: true }));
    TM.lines.forEach((l) => k.play('click', l.t0, { gain: 0.35, minor: true }));
    for (let i = 0; i * 5.5 < DURATION; i++) k.tone(i * 5.5, { f: 55 + (i % 2) * 5, type: 'triangle', dur: 5.6, gain: 0.09, a: 1, filter: 'lowpass', f2: 280 });
    TAPS(line('tap').t1 - 1).concat(TAPS(line('tap', 1).t1 + 0.15)).forEach((x) => k.play('thud', x, { f: 110, gain: 0.7 }));
    k.play('whoosh', line('face').t0, { dur: 0.5, gain: 0.4 }); k.play('impact', line('face', 1).t0, { gain: 0.85 }); k.play('thud', line('sign').t0 + 0.4, { f: 66, gain: 0.7 });
    k.play('riser', line('end', 1).t0, { dur: 1.8, gain: 0.2 }); k.play('impact', line('end', 1).t1 - 0.2, { gain: 0.8 });
  }
  window.REEL = { DURATION, draw: (ctx, t) => N.sequence(ctx, t, SHOTS), score };
})();
