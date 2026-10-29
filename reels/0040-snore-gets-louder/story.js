  // ==================== 0040 "What if his snoring got twice as loud every night?" (one-off special, 29 Oct) ====================
  // twice as loud = about +10 dB a night: 60, 80, 100, 120 (thunder), 150 (past a jet engine)
  // sound rings out of his mouth; lvl 0..1 sets how big, thick and red they get
  const snore = (ctx, S, he, t, lvl) => { if (!he) return; const p = S.proj(add(he.head, he.Rh([0, -0.08, 0.3]))); ctx.save(); ctx.lineCap = 'round';
    for (let i = 0; i < 4; i++) { const k = (t * 1.4 + i / 4) % 1, r = 30 + k * (90 + 520 * lvl); ctx.globalAlpha = (1 - k) * 0.85; ctx.strokeStyle = lvl > 0.6 ? '#ff4a3a' : lvl > 0.3 ? '#ffd23f' : '#ffffff'; ctx.lineWidth = 4 + 16 * lvl;
      ctx.beginPath(); ctx.arc(p[0], p[1], r, -0.9, 0.9); ctx.stroke(); ctx.beginPath(); ctx.arc(p[0], p[1], r, Math.PI - 0.9, Math.PI + 0.9); ctx.stroke(); } ctx.restore(); };
  const meter = (n, db, what) => ({ k: 'card', text: `NIGHT ${n} · ${db} dB${what ? ' · ' + what : ''}`, y: 1000, fill: '#1c1a2a', px: 34 });
  const asleep = { arms: 'slump', head: { tilt: 0.35, pitch: 0.2 }, face: { eyes: 'closed', mouth: 'yawn' } };
  const cracks = (ctx, W, H_, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 3; const r = H.rng(4);
    for (const [cx, cy] of [[W * 0.25, H_ * 0.3], [W * 0.75, H_ * 0.42]]) for (let i = 0; i < 7; i++) { let x = cx, y = cy; const ang = (i / 7) * TAU; ctx.beginPath(); ctx.moveTo(x, y); for (let j = 0; j < 4; j++) { x += Math.cos(ang + r.range(-0.4, 0.4)) * 50; y += Math.sin(ang + r.range(-0.4, 0.4)) * 50; ctx.lineTo(x, y); } ctx.stroke(); }
    ctx.restore(); };
  makeCouch({
    keys: ['snoring', 'twice', 'loud', 'sixty', 'barely', 'eighty', 'snooze', 'hundred', 'police', 'thunder', 'alarm', 'jet', 'crack', "doesn't", 'disagrees', 'couch'],
    shots: ({ V }) => ({
      hook: { set: 'bedroom', cam: 'two', he: asleep, she: { arms: 'clasp', face: { eyes: 'wide', mouth: 'flat', brows: 0.6 } },
        over: (ctx, W, H_, t, S, he) => snore(ctx, S, he, t, 0.1),
        fx: [{ k: 'zzz', who: 'he', at: 0.3 }, { k: 'card', text: '×2 LOUDER EVERY NIGHT', at: V('hook', 'twice'), y: 1000, fill: '#c0182a', col: '#fff', px: 38 }] },
      one: { set: 'bedroom', cam: 'two', he: asleep, she: { arms: 'clasp', head: { tilt: -0.2 }, face: { eyes: 'closed', mouth: 'frown', brows: -0.6 } },
        over: (ctx, W, H_, t, S, he) => snore(ctx, S, he, t, 0.15), fx: [{ ...meter(1, 60), at: V('one', 'Sixty') }] },
      three: { set: 'bedroom', cam: 'her', he: { hide: true }, she: { arms: 'head', face: { eyes: 'wide', mouth: 'frown', brows: -0.9, lids: 0.2 } },
        over: (ctx, W, H_, t) => { ctx.save(); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 12; ctx.globalAlpha = 0.8; for (let i = 0; i < 3; i++) { const k = (t * 1.4 + i / 3) % 1; ctx.beginPath(); ctx.arc(-60, 560, 120 + k * 380, -0.6, 0.6); ctx.stroke(); } ctx.restore(); },
        fx: [{ ...meter(3, 80, 'ALARM CLOCK'), at: V('three', 'Eighty') }, { k: 'sweat', who: 'she', at: V('three', 'snooze') }] },
      five: { set: 'bedroom', cam: 'wide', he: asleep, she: { arms: 'head', face: { eyes: 'wide', mouth: 'o' } },
        extras: (t) => [{ who: 'cop', x: 1.05, z: 0.75, yaw: -0.6, sit: false, hide: t < V('five', 'police') - 0.1, face: { mouth: 'o', eyes: 'wide' }, arms: 'head' }],
        over: (ctx, W, H_, t, S, he) => snore(ctx, S, he, t, 0.45),
        fx: [{ ...meter(5, 100), at: V('five', 'hundred') }, { k: 'stamp', text: 'NOISE COMPLAINT', x: 360, y: 860, at: V('five', 'police'), col: '#ff4a4a' }] },
      seven: { set: 'bedroom', cam: 'wide', he: asleep, she: { arms: 'head', face: { eyes: 'closed', mouth: 'frown', brows: -1 } },
        over: (ctx, W, H_, t, S, he) => { snore(ctx, S, he, t, 0.7); if (t > V('seven', 'alarm')) { ctx.save(); ctx.globalAlpha = 0.18 + 0.12 * Math.sin(t * 18); ctx.fillStyle = Math.sin(t * 9) > 0 ? '#ff3030' : '#3060ff'; ctx.fillRect(0, 0, W, H_); ctx.restore(); } },
        flash: [V('seven', 'thunder')], fx: [{ ...meter(7, 120, 'THUNDER'), at: V('seven', 'thunder') }, { k: 'buzz', who: 'she', at: V('seven', 'alarm') }] },
      ten: { set: 'bedroom', cam: 'wide', he: asleep, she: { hide: true },
        over: (ctx, W, H_, t, S, he) => { snore(ctx, S, he, t, 1); cracks(ctx, W, H_, t > V('ten', 'crack') - 0.05 ? 1 : 0); },
        flash: [V('ten', 'crack')], fx: [{ ...meter(10, 150, '> JET ENGINE'), at: V('ten', 'jet') }, { k: 'stamp', text: 'SHE LEFT', x: 470, y: 860, at: V('ten', 'Night'), col: '#ffd23f', rot: -0.1 }] },
      twist: { set: 'bedroom', cam: 'him', he: { arms: 'shrug', face: { mouth: 'smile', eyes: 'happy' } }, she: { hide: true }, twist: V('twist', 'disagrees'),
        fx: [{ k: 'bubble', text: "I don't snore.", x: 400, y: 700, at: V('twist', 'says'), side: -1 }, { k: 'stamp', text: '150 dB RECORDED', x: 360, y: 1000, at: V('twist', 'disagrees'), col: '#ff4a4a' }] },
      close: { cam: 'two', he: { arms: 'slump', face: { mouth: 'frown', brows: 0.6 } }, she: { arms: 'phone', face: { mouth: 'smile', lids: 0.5 } }, sheHold: true,
        fx: [{ k: 'smug', who: 'she', at: V('close', 'Stay') }, { k: 'card', text: 'STAY or COUCH?', at: V('close', 'couch'), y: 1000, fill: '#c0182a', col: '#fff', px: 40 }] },
    }),
  });
