KATHA((h) => {
  const { at, char, CAM, cardOn } = h;
  const DG = (ctx, t, x, y, s, o) => DIWA.dog(ctx, x, y, s, t, o);
  return {
    h1: { set: 'diwali', cam: CAM.push, draw: (ctx, t) => DG(ctx, t, 320, 1090, 1.5, { garland: true, tika: true }) },
    b1: { set: 'kailash', cam: CAM.wide, over: cardOn('b1', -2, 'नेपाल', { y: 300, size: 92 }) },
    b2: { set: 'diwali', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'gramin', 240, 1100, 0.6, t, { arms: 'wave', face: { eyes: 'happy', mouth: 'grin' } }); char(ctx, 'bride', 470, 1100, 0.58, t, { flip: true, arms: 'namaste', face: { eyes: 'happy', mouth: 'smile' } }); }, over: cardOn('b2', 3, 'तिहार', { y: 300, size: 92 }) },
    b3: { set: 'road', setOpt: { time: 'dawn' }, cam: CAM.mid, draw: (ctx, t) => { DIWA.crow(ctx, 260, 1060, 1.5, t); DIWA.crow(ctx, 480, 1120, 1.1, t + 2); }, over: cardOn('b3', 1, 'दिन 1: कौए', { y: 300, size: 74 }) },
    b4: { set: 'road', cam: CAM.push, draw: (ctx, t) => { DG(ctx, t, 150, 1130, 0.95, { col: '#3a3030', col2: '#221a1a' }); DG(ctx, t, 430, 1170, 1.15, {}); }, over: cardOn('b4', 2, 'दिन 2: कुकुर तिहार', { y: 300, size: 60 }) },
    b5: { set: 'road', cam: [[360, 900, 1.0], [360, 900, 1.2]], draw: (ctx, t) => { DG(ctx, t, 300, 1130, 1.45, { garland: t > at('b5', 4), tika: t > at('b5', 8) }); if (t > at('b5', -2)) { MYTH.ell(ctx, '#a8b0b8', 560, 1180, 88, 26, 0, 4); MYTH.ell(ctx, '#f4e0a0', 560, 1170, 62, 15, 0, 2); } } },
    b6: { set: 'road', cam: CAM.wide, draw: (ctx, t) => { DG(ctx, t, 60, 1120, 0.78, { garland: true, tika: true, col: '#d8c8a8', col2: '#b8a888' }); DG(ctx, t, 300, 1150, 0.9, { garland: true, tika: true, col: '#6a4a2a', col2: '#4a3218' }); char(ctx, 'gramin2', 560, 1170, 0.6, t, { flip: true, arms: { r: 'namaste', l: 'down' }, face: { eyes: 'open', mouth: 'smile' } }); if (t > at('b6', -5)) MYTH.ell(ctx, '#f4c430', 390, 1040, 22, 22, 0, 4); } },
    b7: { set: 'underworld', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'yama', 260, 1180, 0.76, t, { arms: { r: 'bless', l: 'hips' }, face: { eyes: 'calm', mouth: 'calm' } }); DG(ctx, t, 400, 1180, 0.85, { col: '#20202a', col2: '#101018', tongue: false }); } },
    end: { set: 'diwali', cam: CAM.push, draw: (ctx, t) => { char(ctx, 'gramin', 200, 1100, 0.6, t, { pose: 'sit', arms: { r: 'open', l: 'rest' }, face: { eyes: 'happy', mouth: 'smile' } }); DG(ctx, t, 360, 1110, 1.05, { garland: true, tika: true }); } },
    nx: { set: 'space', setOpt: { sun: false }, cam: CAM.wide, draw: (ctx, t) => char(ctx, 'bali', 360, 1180, 0.82, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }) },
  };
}, {"series": "दिवाली के रहस्य", "part": 5, "hook": "दिवाली पर यहाँ...\nकुत्तों की पूजा होती है!", "gold": ["कुत्तों", "नेपाल", "तिहार", "कुकुर", "माला,", "टीका...", "यमराज", "पदक"], "next": "विष्णु ने पाताल भेजा...\nफिर उसी की पूजा?", "nextAt": "nx"});
