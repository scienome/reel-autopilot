KATHA((h) => {
  const { V, first, char, card } = h;
  const KK = 'kumbhakarna';
  // floating Z's over a sleeper
  const zzz = (ctx, x, y, t, s = 1) => { ctx.save(); ctx.font = `900 ${46 * s}px sans-serif`; ctx.textAlign = 'center'; for (let i = 0; i < 3; i++) { const k = (t * 0.5 + i / 3) % 1; ctx.globalAlpha = 1 - k; ctx.lineWidth = 6; ctx.strokeStyle = MYTH.INK; ctx.strokeText('Z', x + k * 80 * s + i * 8, y - k * 160 * s); ctx.fillStyle = '#f4f0ff'; ctx.fillText('Z', x + k * 80 * s + i * 8, y - k * 160 * s); } ctx.restore(); };
  const sleeper = (ctx, t, x = 600, y = 1130, s = 0.62) => { const p = char(ctx, KK, x, y, s, t, { lean: -Math.PI / 2, bob: Math.sin(t * 1.6) * 6, arms: 'down', face: { eyes: 'closed', mouth: 'o' } }); zzz(ctx, x - 548 * s * 1.12 + 30, y - 70, t); return p; };
  const vibhishana = { style: { skin: '#9a6a4e', sh: '#7a5038', cloth: '#f2f2f2', cloth2: '#3a8a5a', crown: 'small', tilak: 'vaishnav', mustache: true } };
  return {
    h1: { set: 'forest', setOpt: { time: 'night' }, cam: [[540, 1020, 1.45], [520, 1020, 1.6]],
      draw: (ctx, t) => sleeper(ctx, t, 790, 1110, 0.7),
      over: (ctx, W, H_, t) => MYTH.dark(ctx, W, H_, 0.2) },
    // three brothers in tapasya
    b1: { set: 'forest', setOpt: { time: 'dusk' }, cam: [[360, 900, 1.0], [360, 880, 1.1]],
      draw: (ctx, t) => { MYTH.flame(ctx, 360, 1200, 0.9, t);
        char(ctx, 'deva', 130, 1120, 0.5, t, Object.assign({ pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }, vibhishana));
        char(ctx, KK, 360, 1080, 0.55, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } });
        char(ctx, 'ravana', 600, 1120, 0.45, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); } },
    // a giant; the gods tremble
    b2: { set: 'forest', setOpt: { time: 'dusk' }, cam: [[360, 760, 0.9], [360, 700, 1.0]], shake: V('b2', 'विशाल'),
      draw: (ctx, t) => { char(ctx, KK, 360, 1190, 1.15, t, { arms: 'fist', face: { eyes: 'open', mouth: 'grin' } });
        char(ctx, 'deva', 90, 1240, 0.3, t, { arms: 'cover', face: { eyes: 'wide', mouth: 'o' } }); char(ctx, 'indra', 640, 1240, 0.3, t, { flip: true, arms: 'cover', face: { eyes: 'wide', mouth: 'o' } }); } },
    b3: { set: 'palace', setOpt: { throne: 360 }, cam: [[360, 760, 1.4], [360, 740, 1.6]],
      draw: (ctx, t) => char(ctx, KK, 360, 1180, 0.82, t, { arms: { r: 'point', l: 'hips' }, face: { eyes: 'open', mouth: 'grin', look: [0, -1] } }),
      over: (ctx, W, H_, t) => card(ctx, W, H_, t, V('b3', 'इंद्रासन।'), 'इंद्रासन', { y: 330, size: 70 }) },
    // the gods pray to Saraswati
    b4: { set: 'heaven', cam: [[360, 800, 1.05], [360, 760, 1.2]],
      draw: (ctx, t) => { char(ctx, 'saraswati', 360, 1120, 0.78, t, { halo: true, hold: 'veena', arms: { r: 'rest', l: 'bless' }, face: { eyes: 'calm', mouth: 'smile' } });
        char(ctx, 'indra', 110, 1240, 0.5, t, { arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); char(ctx, 'deva', 610, 1240, 0.5, t, { flip: true, arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); } },
    // the goddess sits on his tongue
    b5: { set: 'palace', cam: [[360, 720, 1.6], [360, 690, 2.4]],
      draw: (ctx, t) => { const p = char(ctx, KK, 360, 1180, 0.82, t, { arms: 'fist', face: { eyes: 'open', mouth: t > V('b5', 'जीभ') ? 'open' : 'calm' } });
        const u = H.ease.inOut(H.clamp((t - V('b5', 'माता')) / 1.2)); const x = H.lerp(600, p.mouth[0], u), y = H.lerp(300, p.mouth[1] + 6, u);
        const g = ctx.createRadialGradient(x, y, 2, x, y, 60); g.addColorStop(0, 'rgba(255,250,220,0.95)'); g.addColorStop(1, 'rgba(255,240,180,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 60, 0, Math.PI * 2); ctx.fill();
        for (let i = 0; i < 4; i++) FX.sparkle(ctx, x + Math.cos(t * 4 + i * 1.6) * 34, y + Math.sin(t * 4 + i * 1.6) * 34, 12, t + i); } },
    kk1: { set: 'palace', cam: [[360, 690, 2.4], [360, 690, 2.5]], shake: V('kk1', 'निद्रासन'),
      draw: (ctx, t) => char(ctx, KK, 360, 1180, 0.82, t, { arms: { r: 'point', l: 'fist' }, face: { eyes: t > V('kk1', 'निद्रासन') + 0.6 ? 'wide' : 'open', mouth: 'shout' } }) },
    b6: { set: 'palace', cam: [[360, 760, 1.3], [360, 740, 1.4]],
      draw: (ctx, t) => char(ctx, KK, 360, 1180, 0.82, t, { arms: 'cover', face: { eyes: 'wide', mouth: 'o' } }),
      over: (ctx, W, H_, t) => { card(ctx, W, H_, t, V('b6', 'निद्रासन...'), 'इंद्रासन → निद्रासन', { y: 330, size: 50 }); } },
    br1: { set: 'heaven', cam: [[360, 720, 1.7], [360, 700, 1.9]],
      draw: (ctx, t) => char(ctx, 'brahma', 360, 1170, 0.82, t, { halo: true, hold: 'kamandal', arms: { r: 'rest', l: 'bless' }, face: { eyes: 'calm', mouth: 'calm' } }),
      over: (ctx, W, H_, t) => MYTH.shock(ctx, 360, 640, t, V('br1', 'तथास्तु।') + 0.3) },
    b7: { set: 'heaven', cam: [[360, 820, 1.0], [360, 800, 1.1]],
      draw: (ctx, t) => { char(ctx, 'brahma', 500, 1150, 0.68, t, { flip: true, halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }); char(ctx, 'ravana', 200, 1180, 0.55, t, { arms: 'namaste', face: { eyes: 'sad', mouth: 'calm', look: [1, 0] } }); } },
    b8: { set: 'forest', setOpt: { time: 'night' }, cam: [[520, 960, 1.3], [520, 960, 1.4]],
      draw: (ctx, t) => sleeper(ctx, t, 790, 1110, 0.7),
      over: (ctx, W, H_, t) => { card(ctx, W, H_, t, V('b8', 'छह'), '6 महीने नींद', { y: 300, size: 60 }); card(ctx, W, H_, t, V('b8', 'एक'), '1 दिन जागना', { y: 470, size: 60 }); } },
    end: { set: 'battle', cam: [[360, 760, 1.0], [360, 700, 1.2]], shake: V('end', 'युद्ध'),
      draw: (ctx, t) => char(ctx, KK, 360, 1200, 1.0, t, { arms: 'fist', face: { eyes: 'angry', mouth: 'shout' } }),
      over: (ctx, W, H_, t) => { MYTH.dark(ctx, W, H_, 0.2); if (t > V('end', 'जय')) card(ctx, W, H_, t, V('end', 'जय'), 'जय श्री राम', { y: 300, size: 72 }); } },
  };
}, {
  title: 'कुंभकर्ण की नींद का रहस्य',
  gold: ['कुंभकर्ण', 'इंद्रासन।', 'इंद्रासन', 'निद्रासन', 'निद्रासन!', 'निद्रासन...', 'सरस्वती', 'तथास्तु।', 'छह', 'एक'],
});
