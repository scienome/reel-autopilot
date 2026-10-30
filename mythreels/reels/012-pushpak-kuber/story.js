KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'ocean', setOpt: { time: 'dusk', lanka: true }, cam: [[560, 720, 1.8], [500, 740, 1.4]], draw: (ctx, t) => {} },
    b1: { set: 'palace', setOpt: { throne: 360 }, cam: CAM.mid, draw: one('kubera', { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }), over: cardOn('b1', 'कुबेर...', 'कुबेर', { y: 300, size: 80 }) },
    b2: { set: 'palace', setOpt: { throne: 360 }, cam: CAM.wide, draw: two('ravana', { arms: { r: 'point', l: 'hips' }, face: { eyes: 'angry', mouth: 'shout' } }, 'kubera', { arms: 'cover', face: { eyes: 'sad', mouth: 'frown' } }, 0.62) },
    b3: { set: 'palace', cam: CAM.mid, shake: V('b3', 'मार'), draw: one('ravana', { hold: 'sword', arms: { r: 'up', l: 'hips' }, face: { eyes: 'angry', mouth: 'shout' } }), over: (ctx, W, H_, t) => MYTH.dark(ctx, W, H_, t > V('b3', 'मार') ? 0.4 : 0) },
    b4: { set: 'battle', cam: CAM.wide, shake: V('b4', 'हमला'), draw: two('ravana', { hold: 'gada', arms: { r: 'up', l: 'fist' }, face: { eyes: 'angry', mouth: 'shout' } }, 'kubera', { arms: 'cover', lean: 0.3, face: { eyes: 'closed', mouth: 'frown' } }, 0.6) },
    b5: { set: 'sky', setOpt: { time: 'day' }, cam: CAM.push, draw: (ctx, t) => { MYTH.vimana(ctx, 360, 700, 1.2, t); }, over: cardOn('b5', 'पुष्पक', 'पुष्पक विमान', { y: 300, size: 70 }) },
    end: { set: 'sky', setOpt: { time: 'dusk' }, cam: CAM.wide, draw: (ctx, t) => { const u = H.clamp((t - first('end')) / 3); MYTH.vimana(ctx, H.lerp(200, 560, u), 700 - 120 * u, 0.8, t); char(ctx, 'sita', H.lerp(200, 560, u) - 40, 660 - 120 * u, 0.28, t, { arms: 'cover', face: { eyes: 'sad' } }); char(ctx, 'ravana', H.lerp(200, 560, u) + 50, 660 - 120 * u, 0.28, t, { arms: 'hips' }); } },
  };
}, {"series": "रावण के रहस्य", "part": 10, "hook": "लंका असल में रावण की\nथी ही नहीं!", "next": "रावण पिछले जन्म में\nविष्णु का द्वारपाल था!", "nextAt": "nx", "gold": ["लंका", "कुबेर...", "कुबेर", "पुष्पक", "सौतेले", "सीता"]});
