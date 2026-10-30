KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'forest', setOpt: { time: 'dusk' }, cam: CAM.push, draw: one('shurpanakha', { arms: 'fist', face: { eyes: 'angry', mouth: 'frown' } }) },
    b1: { set: 'palace', cam: CAM.wide, draw: two('shurpanakha', { arms: 'namaste', face: { eyes: 'happy', mouth: 'smile' } }, 'asura', { arms: 'namaste', style: { horns: false, tusks: false, skin: '#6a7a9a', sh: '#4e5e7e', cloth: '#2a3a6a', crown: 'small' }, face: { eyes: 'happy', mouth: 'smile' } }, 0.68),
      over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, first('b1'), 20) },
    b2: { set: 'battle', cam: CAM.wide, shake: V('b2', 'लड़'), draw: (ctx, t) => { char(ctx, 'ravana', 230, 1170, 0.6, t, { hold: 'sword', arms: { r: 'up', l: 'fist' }, face: { eyes: 'angry', mouth: 'shout' } }); for (let i = 0; i < 2; i++) char(ctx, 'asura', 480 + i * 120, 1180, 0.5, t, { flip: true, arms: 'fist', face: { eyes: 'angry', mouth: 'shout' } }); } },
    b3: { set: 'battle', cam: CAM.mid, shake: V('b3', 'मार'), draw: (ctx, t) => { const f = H.clamp((t - V('b3', 'मार')) / 0.5); char(ctx, 'asura', 470, 1170, 0.66, t, { flip: true, lean: -1.2 * f, arms: 'open', style: { horns: false, tusks: false, skin: '#6a7a9a', sh: '#4e5e7e', cloth: '#2a3a6a', crown: 'small' }, face: { eyes: 'closed', mouth: 'o' } }); char(ctx, 'ravana', 220, 1170, 0.62, t, { hold: 'sword', arms: { r: 'point', l: 'fist' }, face: { eyes: 'angry', mouth: 'shout' } }); },
      over: (ctx, W, H_, t) => MYTH.dark(ctx, W, H_, t > V('b3', 'मार') ? 0.35 : 0) },
    b4: { set: 'palace', cam: CAM.close(360), draw: one('shurpanakha', { arms: 'cover', face: { eyes: 'sad', mouth: 'frown', tears: true } }) },
    b5: { set: 'palace', setOpt: { throne: 220 }, cam: CAM.wide, draw: two('ravana', { arms: { r: 'point', l: 'hips' }, face: { eyes: 'calm', mouth: 'calm' } }, 'shurpanakha', { arms: 'down', face: { eyes: 'sad', mouth: 'frown' } }, 0.62) },
    end: { set: 'forest', setOpt: { time: 'day', hut: 560 }, cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'rama', 380, 1170, 0.62, t, { holdL: 'bow', arms: { r: 'down', l: 'rest' }, face: { eyes: 'calm', mouth: 'calm' } }); char(ctx, 'lakshman', 560, 1180, 0.58, t, { holdL: 'bow', arms: { r: 'hips', l: 'rest' }, face: { eyes: 'calm' } }); char(ctx, 'shurpanakha', 150, 1180, 0.6, t, { arms: 'wave', face: { eyes: 'open', mouth: 'smile' } }); } },
  };
}, {"series": "रावण के रहस्य", "part": 13, "hook": "शूर्पणखा का बदला...\nअसल में रावण से था?", "next": "मरते हुए रावण ने\nलक्ष्मण को क्या सिखाया?", "nextAt": "nx", "gold": ["शूर्पणखा", "विद्युज्जिह्व", "दंडक", "राम", "लक्ष्मण"]});
