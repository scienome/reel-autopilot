KATHA((h) => {
  const { at, char, CAM, cardOn } = h;
  const side = (ctx, t, flip, who) => { for (let i = 0; i < 3; i++) char(ctx, who, flip ? 720 - 70 - i * 95 : 70 + i * 95, 1170 - i * 32, 0.52 - i * 0.06, t, { flip, arms: i === 0 ? 'up' : 'fist', face: { eyes: 'angry', mouth: 'shout' } }); };
  return {
    h1: { set: 'field', cam: CAM.wide, draw: (ctx, t) => { DIWA.rocketsFlying(ctx, t, 0, 11); side(ctx, t, false, 'gramin'); side(ctx, t, true, 'gramin2'); }, over: (ctx, W, H_, t) => MYTH.shock(ctx, 360, 760, t, 0.5, 'rgba(255,170,80,') },
    b1: { set: 'road', setOpt: { time: 'dusk' }, cam: CAM.wide, over: cardOn('b1', -1, 'गौतमपुरा', { y: 300, size: 84 }) },
    b2: { set: 'field', cam: CAM.wide, draw: (ctx, t) => { side(ctx, t, false, 'gramin'); side(ctx, t, true, 'gramin2'); } },
    b3: { set: 'field', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'gramin', 200, 1170, 0.68, t, { arms: 'fist', face: { eyes: 'angry', mouth: 'calm' } }); char(ctx, 'gramin2', 520, 1170, 0.68, t, { flip: true, arms: 'fist', face: { eyes: 'angry', mouth: 'calm' } }); }, over: cardOn('b3', 0, 'तुर्रा vs कलंगी', { y: 300, size: 66 }) },
    b4: { set: 'forest', setOpt: { time: 'dusk' }, cam: CAM.mid, draw: (ctx, t) => { MYTH.ell(ctx, '#6a4a22', 360, 900, 180, 88, 0, 7); MYTH.ell(ctx, '#7a5a30', 330, 880, 120, 40, 0, 0); }, over: cardOn('b4', -1, 'हिंगोट', { y: 300, size: 92 }) },
    b5: { set: 'field', cam: CAM.wide, shake: at('b5', 5), draw: (ctx, t) => { if (t > at('b5', 3)) DIWA.rocketsFlying(ctx, t, at('b5', 3), 9); side(ctx, t, false, 'gramin'); side(ctx, t, true, 'gramin2'); }, over: (ctx, W, H_) => MYTH.dark(ctx, W, H_, 0.18) },
    b6: { set: 'field', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'gramin', 250, 1180, 0.7, t, { arms: { r: 'chin', l: 'belly' }, face: { eyes: 'sad', mouth: 'frown' } }); char(ctx, 'gramin2', 490, 1180, 0.66, t, { flip: true, arms: { r: 'open', l: 'down' }, face: { eyes: 'wide', mouth: 'o' } }); }, over: (ctx, W, H_, t) => { MYTH.dark(ctx, W, H_, 0.42); MYTH.card(ctx, W, H_, t, at('b6', 1), 'दर्जनों घायल', { y: 300, size: 66 }); } },
    b7: { set: 'field', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'gramin', 360, 1180, 0.78, t, { arms: { r: 'up', l: 'hips' }, face: { eyes: 'open', mouth: 'calm' } }); MYTH.line(ctx, '#8a6a3a', 9, [[452, 900], [452, 420]]); MYTH.poly(ctx, '#e8742a', [[452, 420], [610, 468], [452, 520]], 4); } },
    end: { set: 'road', setOpt: { time: 'dusk' }, cam: CAM.mid, draw: (ctx, t) => char(ctx, 'pandit', 360, 1140, 0.8, t, { arms: { r: 'up', l: 'down' }, face: { eyes: 'open', mouth: 'calm' } }), over: cardOn('end', 6, 'कभी न आज़माएँ', { y: 300, size: 64 }) },
    nx: { set: 'road', cam: CAM.wide, draw: (ctx, t) => { DIWA.cow(ctx, 150, 1170, 0.9, t); DIWA.cow(ctx, 470, 1120, 0.72, t + 1); } },
  };
}, {"series": "दिवाली के रहस्य", "part": 9, "hook": "दिवाली के अगले दिन...\nआग के गोलों का युद्ध!", "gold": ["आग", "हिंगोट", "तुर्रा", "कलंगी।", "घायल", "ख़तरा", "गौतमपुरा", "आखिरी"], "next": "ज़मीन पर लेटे लोग...\nऊपर से सैकड़ों गायें!", "nextAt": "nx"});
