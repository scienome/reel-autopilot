// Denver Airport tells its own story. Every time comes from window.TIMING.
(() => {
  const { W, H, INK, PAPER, RED, back, ramp, clamp } = N;
  const TM = window.TIMING, DURATION = TM.duration, S = TM.shots, order = Object.keys(S);
  const span = (name) => { const i = order.indexOf(name); return [S[name], i + 1 < order.length ? S[order[i + 1]] : DURATION]; };
  const line = (name, k = 0) => TM.lines.filter((l) => l.shot === name)[k];
  const at = (name, u) => { const [a, b] = span(name); return a + (b - a) * u; };
  const captionNow = (ctx, t, name) => { let cur = null; for (const l of TM.lines) if (l.shot === name && t >= l.t0) cur = l; if (cur) N.caption(ctx, cur.cap, cur.t0, t); };

  const tents = (ctx, y) => { // the airport's famous white peaks
    ctx.fillStyle = PAPER; ctx.beginPath(); ctx.moveTo(0, y);
    [[60, y - 120], [130, y - 30], [210, y - 170], [290, y - 40], [370, y - 200], [450, y - 40], [530, y - 165], [610, y - 30], [680, y - 110], [720, y - 40]].forEach(([x, py]) => ctx.lineTo(x, py));
    ctx.lineTo(720, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 3; [[210, y - 170], [370, y - 200], [530, y - 165]].forEach(([x, py]) => { ctx.beginPath(); ctx.moveTo(x, py); ctx.lineTo(x, y); ctx.stroke(); });
  };
  const stone = (ctx, x, y, s) => { // dedication stone with square and compass
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = INK; ctx.fillRect(-212, -232, 440, 480); ctx.fillStyle = PAPER; ctx.fillRect(-220, -240, 440, 480); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.strokeRect(-204, -224, 408, 448);
    ctx.lineCap = 'round'; ctx.strokeStyle = RED; ctx.lineWidth = 15; ctx.beginPath(); ctx.moveTo(0, -180); ctx.lineTo(-92, 30); ctx.moveTo(0, -180); ctx.lineTo(92, 30); ctx.stroke();
    ctx.strokeStyle = INK; ctx.lineWidth = 15; ctx.beginPath(); ctx.moveTo(-108, -62); ctx.lineTo(0, 44); ctx.lineTo(108, -62); ctx.stroke();
    ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.font = `25px ${N.F.type}`; ctx.fillText('NEW WORLD', 0, 106); ctx.fillText('AIRPORT COMMISSION', 0, 142); ctx.font = `30px ${N.F.num}`; ctx.fillText('1994', 0, 192); ctx.restore();
  };
  const horse = (ctx, t) => { // rearing mustang in black, the only colour is its eyes
    ctx.save(); ctx.translate(372, 920); ctx.fillStyle = INK; ctx.beginPath();
    ctx.moveTo(-178, 0); ctx.lineTo(-150, -190); ctx.quadraticCurveTo(-158, -310, -60, -350); ctx.lineTo(10, -420); ctx.lineTo(16, -560); ctx.quadraticCurveTo(30, -650, 92, -668); ctx.lineTo(118, -716); ctx.lineTo(134, -668); ctx.lineTo(214, -604); ctx.lineTo(196, -562); ctx.lineTo(126, -574); ctx.quadraticCurveTo(116, -484, 92, -420);
    ctx.lineTo(190, -448); ctx.lineTo(232, -372); ctx.lineTo(206, -360); ctx.lineTo(170, -392); ctx.lineTo(80, -340); ctx.lineTo(116, -292); ctx.lineTo(172, -300); ctx.lineTo(180, -258); ctx.lineTo(90, -250); ctx.lineTo(10, -300);
    ctx.quadraticCurveTo(-30, -220, -60, -180); ctx.lineTo(-40, 0); ctx.lineTo(-84, 0); ctx.lineTo(-110, -130); ctx.lineTo(-128, 0); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-154, -270); ctx.quadraticCurveTo(-258, -240, -236, -90); ctx.quadraticCurveTo(-190, -170, -144, -190); ctx.closePath(); ctx.fill();
    const g = 0.72 + 0.28 * Math.sin(t * 5); ctx.globalAlpha = g * 0.45; ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(116, -624, 32, 0, 6.3); ctx.fill(); ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(116, -624, 13, 0, 6.3); ctx.fill(); ctx.restore();
  };
  const bag = (ctx, x, y, s, red) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = red ? RED : PAPER; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.fillRect(-62, -44, 124, 88); ctx.strokeRect(-62, -44, 124, 88); ctx.strokeRect(-24, -66, 48, 22); ctx.beginPath(); ctx.moveTo(-34, -44); ctx.lineTo(-34, 44); ctx.moveTo(34, -44); ctx.lineTo(34, 44); ctx.stroke(); ctx.restore(); };

  const shot = (name, draw) => { const [a, b] = span(name); return { a, b, draw }; };
  const SHOTS = [
    shot('hook', (ctx, t) => {
      N.bg(ctx); N.beam(ctx, 360, -160, -60, 780, 930, { lines: 100, seed: 4 }); tents(ctx, 880); N.floor(ctx, 860, 1270, { rows: 20 });
      N.figure(ctx, 360, 940, 300, { kind: 'coat', facing: -1, walk: t * 0.9, arms: [[30, 36], [-12, 8]] });
      ctx.fillStyle = INK; ctx.fillRect(0, 96, W, 170); N.stat(ctx, 'DENVER', W / 2, 180, 150, { u: back(t, 0.12, 0.25) });
      N.rain(ctx, t, 150, 0.5); N.finish(ctx, t); captionNow(ctx, t, 'hook');
    }),
    shot('stone', (ctx, t) => {
      const [a, b] = span('stone'); N.bg(ctx); N.beam(ctx, 360, -160, -120, 840, 980, { lines: 90, seed: 25 }); N.floor(ctx, 880, 1270, { rows: 18 });
      stone(ctx, 360, 510, 1.14 + 0.05 * clamp((t - a) / (b - a)));
      N.finish(ctx, t); captionNow(ctx, t, 'stone');
    }),
    shot('horse', (ctx, t) => {
      const l2 = line('horse', 1); N.bg(ctx); N.stripes(ctx, -18, { band: 70, gap: 66, offset: t * 4, seed: 12 }); N.floor(ctx, 900, 1270, { rows: 18 }); horse(ctx, t);
      if (t >= line('horse').t0 + 0.6) { ctx.fillStyle = INK; ctx.fillRect(40, 92, 240, 118); } N.stat(ctx, '32 FT', 160, 170, 100, { u: back(t, line('horse').t0 + 0.6, 0.22) });
      N.stamp(ctx, 'R.I.P. 2006', 468, 830, back(t, l2.t0 + 0.5, 0.18), { px: 64, rot: -0.07 });
      N.rain(ctx, t, 90, 0.34); N.finish(ctx, t); captionNow(ctx, t, 'horse');
    }),
    shot('tunnels', (ctx, t) => {
      const l2 = line('tunnels', 1); N.bg(ctx); N.corridor(ctx, 360, 520, { lines: 150, seed: 14 });
      N.figure(ctx, 360, 900, 460, { kind: 'coat', walk: t * 3, facing: 1, arms: [[34 * Math.sin(t * 3), 30], [-34 * Math.sin(t * 3), 30]], rim: true, rimW: 3 });
      [['A bunker?', 186, 210, 0.1, [260, 400], false], ['For who?', 552, 236, 0.75, [450, 420], false], ['Lizard people!', 216, 380, 1.6, [320, 470], true]].forEach(([s, x, y, d, tail, red], i) => N.bubble(ctx, x, y, 300, 124, s, { u: back(t, l2.t0 + d, 0.18), px: 38, tail, red, seed: 60 + i }));
      N.finish(ctx, t); captionNow(ctx, t, 'tunnels');
    }),
    shot('late', (ctx, t) => {
      const l1 = line('late'), l2 = line('late', 1), [a] = span('late'); N.bg(ctx); N.windowPane(ctx, 54, 410, 612, 360, 3, { seed: 6 }); N.floor(ctx, 800, 1270, { rows: 20 });
      ctx.fillStyle = INK; ctx.fillRect(0, 96, W, 280); N.stat(ctx, '16', 200, 262, 250, { col: RED, u: back(t, l1.t0 + 1.2, 0.22) }); N.stat(ctx, 'MONTHS', 490, 200, 92, { u: back(t, l1.t0 + 1.4, 0.2) }); N.stat(ctx, 'LATE', 490, 310, 92, { u: back(t, l1.t0 + 1.6, 0.2) });
      const u = clamp((t - l2.t0) / 2); [[120, 0], [290, 1], [460, 0], [620, 0]].forEach(([x, r], i) => bag(ctx, x - 40 + 40 * u, 730 + (i % 2) * 22 + 60 * u * (i % 2 ? 1 : -0.3), 1, !!r));
      N.stamp(ctx, 'SWITCHED OFF', W / 2, 620, back(t, l2.t1 - 1, 0.18), { px: 66, rot: -0.06 });
      N.finish(ctx, t); captionNow(ctx, t, 'late');
    }),
  ];
  const KEYS = ['hook', 'stone', 'horse', 'tunnels', 'late'].map((n) => at(n, 0.9));

  function draw(ctx, t) {
    if (t < S.end) { N.sequence(ctx, t, SHOTS); return; }
    const l2 = line('end', 1);
    N.pageOut(ctx, t, S.end, 1.1, SHOTS, KEYS); N.finish(ctx, t); ctx.fillStyle = `rgba(0,0,0,${0.7 * ramp(t, l2.t0, 0.35)})`; ctx.fillRect(0, 0, W, H);
    N.stat(ctx, 'TRUTH', W / 2, 400, 152, { u: back(t, l2.t0, 0.22) }); N.stat(ctx, 'OR STORY?', W / 2, 568, 136, { col: RED, u: back(t, l2.t0 + 0.2, 0.22) });
    captionNow(ctx, t, 'end');
    if (t >= l2.t1 - 0.1) N.tag(ctx, 'FOLLOW FOR THE NEXT SECRET', W / 2, 760, { px: 32 });
  }

  function score(k) {
    order.slice(1).forEach((n) => k.play('whoosh', S[n] - 0.05, { dur: 0.34, gain: 0.34, minor: true }));
    TM.lines.forEach((l) => k.play('click', l.t0, { gain: 0.42, minor: true }));
    for (let i = 0; i * 2 < DURATION; i++) k.noise(i * 2, { dur: 2.2, color: 'pink', filter: 'highpass', f: 2400, gain: 0.018 });
    for (let i = 0; i * 5.5 < DURATION; i++) k.tone(i * 5.5, { f: 58 + (i % 2) * 7, type: 'triangle', dur: 5.6, gain: 0.08, a: 1, filter: 'lowpass', f2: 300 });
    k.play('thud', line('stone').t0, { f: 72, gain: 0.5 }); k.play('impact', line('horse', 1).t0 + 0.5, { gain: 0.75 }); k.play('thud', line('late').t0 + 1.2, { f: 64, gain: 0.7 }); k.play('impact', line('late', 1).t1 - 1, { gain: 0.6 });
    const l2 = line('tunnels', 1); [0.1, 0.75, 1.6].forEach((d) => k.play('pop', l2.t0 + d, { f: 560, gain: 0.25, minor: true }));
    k.play('riser', S.end - 0.7, { dur: 0.8, gain: 0.26 }); k.play('impact', line('end', 1).t0, { gain: 0.7 });
  }
  window.REEL = { DURATION, draw, score };
})();
