KATHA((h) => {
  const { V, first, char, pulse, card, partTwo } = h;
  const strike = V('b4', 'गदा'), chained = V('b4', 'बेड़ियों'), freed = V('b7', 'तोड़कर');
  // Shani lying in front of the throne as a step (feet on the right, head on the left)
  const lyingShani = (ctx, t, chainsOn = true) => { char(ctx, 'shani', 520, 1130, 0.5, t, { lean: -Math.PI / 2, arms: 'down', face: { eyes: 'closed', mouth: 'calm' } }); if (chainsOn) { MYTH.chains(ctx, 250, 1100, 250, 1170, 4); MYTH.chains(ctx, 470, 1100, 470, 1170, 4); } };
  return {
    // hook: the demon king with the nine planets chained around him
    h1: { set: 'palace', setOpt: { throne: 360 }, cam: [[360, 760, 1.0], [360, 700, 1.25]],
      draw: (ctx, t) => { MYTH.grahas(ctx, 360, 520, 300, t, 0.15); char(ctx, 'ravana', 360, 1160, 0.78, t, { arms: 'hips', face: { eyes: 'angry', mouth: 'grin' } }); MYTH.chains(ctx, 80, 560, 280, 900, 12); MYTH.chains(ctx, 640, 560, 440, 900, 12); },
      over: (ctx, W, H_, t) => MYTH.dark(ctx, W, H_, 0.15) },
    h2: { set: 'palace', setOpt: { throne: 220 }, cam: [[360, 860, 1.05], [380, 920, 1.3]],
      draw: (ctx, t) => { char(ctx, 'ravana', 220, 1080, 0.7, t, { arms: 'hips', face: { eyes: 'angry', mouth: 'grin', look: [1, 1] } }); lyingShani(ctx, t); } },
    // the order for Meghnad's horoscope
    b1: { set: 'space', setOpt: { sun: false }, cam: [[360, 700, 1.0], [360, 660, 1.1]],
      draw: (ctx, t) => { MYTH.grahas(ctx, 360, 420, 260, t, 0.2); char(ctx, 'ravana', 360, 1220, 0.8, t, { arms: { r: 'up', l: 'hips' }, face: { eyes: 'angry', look: [0, -1] } }); } },
    rv1: { set: 'palace', cam: [[360, 680, 2.0], [360, 660, 2.3]], shake: V('rv1', 'अमर'),
      draw: (ctx, t) => char(ctx, 'ravana', 360, 1160, 0.85, t, { arms: { r: 'point', l: 'fist' }, face: { eyes: 'angry', mouth: t > V('rv1', 'अमर') ? 'grin' : 'shout' } }) },
    // all obey, except one
    b2: { set: 'space', setOpt: { sun: false }, cam: [[360, 640, 1.0], [520, 640, 1.3]],
      draw: (ctx, t) => { const s0 = V('b2', 'शनि'); MYTH.grahas(ctx, 300, 520, 200, 0, 0, 0.9, 6); const u = popU(t, s0, 0.4);
        char(ctx, 'shani', 560, 1100, 0.62, t, { halo: t > s0, haloCol: 'rgba(130,160,255,', arms: 'down', face: { eyes: 'calm', mouth: 'calm' } });
        if (u > 0) { ctx.save(); ctx.globalAlpha = Math.min(1, u); MYTH.grahas(ctx, 560, 360, 0, t, 0, 1.6 * u, -1); ctx.restore(); } } },
    b3: { set: 'space', setOpt: { sun: false }, cam: [[360, 620, 1.05], [360, 620, 1.05]],
      draw: (ctx, t) => { const u = H.ease.inOut(H.clamp((t - V('b3', 'बदल')) / 0.8)); MYTH.grahas(ctx, 360, 560, 230, 0, 0, 1, 6); const a = (6 / 9) * Math.PI * 2;
        const px = 360 + Math.cos(a) * 230, py = 560 + Math.sin(a) * 230 * 0.45; ctx.save(); ctx.translate(H.lerp(px, 600, u), H.lerp(py, 260, u)); MYTH.ell(ctx, '#3a4a9a', 0, 0, 30, 30, 0, 4); ctx.restore();
        char(ctx, 'shani', 360, 1250, 0.6, t, { flip: t > V('b3', 'बदल'), arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }); } },
    // the mace, the chains
    b4: { set: 'palace', cam: [[360, 800, 1.0], [360, 800, 1.08]], shake: strike,
      draw: (ctx, t) => { const fall = H.clamp((t - strike) / 0.5);
        char(ctx, 'shani', 590, 1160, 0.62, t, { lean: 0.9 * fall, arms: fall > 0 ? 'cover' : 'down', face: { eyes: fall > 0 ? 'closed' : 'calm', mouth: fall > 0 ? 'frown' : 'calm' } });
        char(ctx, 'ravana', 210, 1160, 0.6, t, { hold: 'gada', arms: h.AT(t, [[0, { r: 'up', l: 'hips' }], [strike - 0.15, { r: 'point', l: 'hips' }]]), face: { eyes: 'angry', mouth: 'shout' } });
        if (t > chained) { const u = H.clamp((t - chained) / 0.4); ctx.save(); ctx.globalAlpha = u; MYTH.chains(ctx, 380, 900, 640, 900, 10); MYTH.chains(ctx, 380, 1100, 640, 1100, 10); ctx.restore(); } } },
    // Hanuman arrives in Lanka
    b6: { set: 'ocean', setOpt: { time: 'night', lanka: true }, cam: [[360, 760, 1.0], [360, 720, 1.3]],
      draw: (ctx, t) => char(ctx, 'hanuman', 360, 1180, 0.85, t, { halo: t > V('b6', 'हनुमान।'), hold: 'gada', arms: { r: 'rest', l: 'fist' }, face: { eyes: 'calm', mouth: 'smile' } }) },
    b7: { set: 'palace', setOpt: { throne: 600 }, cam: [[360, 820, 1.15], [360, 800, 1.3]], shake: freed,
      draw: (ctx, t) => { const up = H.clamp((t - freed - 0.3) / 0.6);
        char(ctx, 'shani', 470, 1160, 0.68, t, { lean: -Math.PI / 2 * (1 - up), arms: up > 0.5 ? 'namaste' : 'down', face: { eyes: up > 0.5 ? 'open' : 'closed', mouth: 'smile' } });
        if (t < freed) { MYTH.chains(ctx, 300, 1080, 300, 1170, 4); MYTH.chains(ctx, 500, 1080, 500, 1170, 4); }
        char(ctx, 'hanuman', 200, 1160, 0.75, t, { arms: t < freed ? 'fist' : { r: 'up', l: 'hips' }, face: { eyes: 'angry', mouth: 'shout' } });
        MYTH.shock(ctx, 400, 1100, t, freed); } },
    // Shani's promise
    sh1: { set: 'heaven', cam: [[360, 700, 1.9], [360, 690, 2.1]],
      draw: (ctx, t) => char(ctx, 'shani', 360, 1160, 0.85, t, { halo: true, haloCol: 'rgba(130,160,255,', arms: { r: 'bless', l: 'down' }, face: { eyes: 'calm', mouth: 'smile' } }) },
    b8: { set: 'heaven', setOpt: { om: true }, cam: [[360, 800, 1.1], [360, 780, 1.15]],
      draw: (ctx, t) => { char(ctx, 'hanuman', 240, 1170, 0.72, t, { halo: true, hold: 'gada', arms: { r: 'rest', l: 'bless' }, face: { mouth: 'smile' } }); char(ctx, 'shani', 500, 1170, 0.7, t, { arms: 'namaste', face: { eyes: 'closed', mouth: 'smile' } }); },
      over: (ctx, W, H_, t) => card(ctx, W, H_, t, V('b8', 'शनिवार'), 'शनिवार = हनुमान पूजा', { y: 330, size: 52 }) },
    // Shani's gaze falls on Lanka: it burns
    end: { set: 'ocean', setOpt: { time: 'night', lanka: true }, cam: [[560, 730, 2.1], [500, 740, 1.5]],
      draw: (ctx, t) => { const u = H.clamp((t - V('end', 'जल')) / 1.5); for (let i = 0; i < 9; i++) MYTH.flame(ctx, 420 + i * 34, 760, (0.3 + 0.9 * u) * (0.8 + 0.3 * Math.sin(i)), t + i);
        const g = ctx.createRadialGradient(560, 700, 10, 560, 700, 400); g.addColorStop(0, `rgba(255,120,30,${0.6 * u})`); g.addColorStop(1, 'rgba(255,80,20,0)'); ctx.fillStyle = g; ctx.fillRect(160, 300, 800, 800); },
      over: (ctx, W, H_, t) => MYTH.dark(ctx, W, H_, t > first('nx') ? 0.35 : 0) },
  };
}, {
  series: 'रावण के रहस्य', part: 1, hook: 'रावण ने शनि देव को\nसीढ़ी बना दिया!', next: 'एक शब्द की गलती...\n6 महीने की नींद!', nextAt: 'nx',
  gold: ['शनि', 'रावण', 'हनुमान।', 'हनुमान', 'शनिवार', 'लंका', 'नौ', 'ग्रहों'],
});
