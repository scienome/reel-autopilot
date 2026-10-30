KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'heaven', setOpt: { om: true }, cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'vishnu', 360, 1110, 0.62, t, { halo: true, hold: 'chakra', arms: { r: 'up', l: 'bless' }, face: { eyes: 'calm', mouth: 'smile' } }); char(ctx, 'jaya', 130, 1200, 0.55, t, { hold: 'gada', arms: { r: 'rest', l: 'hips' } }); char(ctx, 'jaya', 590, 1200, 0.55, t, { flip: true, hold: 'gada', arms: { r: 'rest', l: 'hips' }, style: { cloth: '#3a6ec0', cloth2: '#f4c430' } }); } },
    b1: { set: 'heaven', cam: CAM.mid, draw: two('jaya', { hold: 'gada', arms: { r: 'rest', l: 'hips' }, face: { mouth: 'smile' } }, 'jaya', { hold: 'gada', arms: { r: 'rest', l: 'hips' }, style: { cloth: '#3a6ec0', cloth2: '#f4c430' }, face: { mouth: 'smile' } }, 0.72),
      over: cardOn('b1', 'जय', 'जय - विजय', { y: 300, size: 70 }) },
    b2: { set: 'heaven', cam: CAM.wide, draw: (ctx, t) => { for (let i = 0; i < 4; i++) char(ctx, 'kumara', 150 + i * 140, 1180, 0.6, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }); } },
    b3: { set: 'heaven', cam: CAM.wide, shake: V('b3', 'रोक'), draw: (ctx, t) => { char(ctx, 'jaya', 480, 1170, 0.7, t, { flip: true, hold: 'gada', arms: { r: 'rest', l: 'point' }, face: { eyes: 'angry', mouth: 'grin' } }); char(ctx, 'kumara', 170, 1180, 0.62, t, { arms: 'down', face: { eyes: 'wide', mouth: 'o' } }); } },
    km: { set: 'heaven', cam: [[360, 760, 1.9], [360, 740, 2.2]], shake: V('km', 'असुर'), draw: one('kumara', { halo: true, arms: { r: 'point', l: 'down' }, face: { eyes: 'angry', mouth: 'calm' } }, 360, 0.75, 1180),
      over: (ctx, W, H_, t) => MYTH.dark(ctx, W, H_, 0.2) },
    b4: { set: 'heaven', setOpt: { om: true }, cam: CAM.mid, draw: one('vishnu', { halo: true, hold: 'chakra', arms: { r: 'up', l: 'bless' }, face: { eyes: 'calm', mouth: 'calm' } }),
      over: (ctx, W, H_, t) => { card(ctx, W, H_, t, V('b4', 'सात'), '7 जन्म भक्त', { y: 300, size: 56 }); card(ctx, W, H_, t, V('b4', 'तीन'), '3 जन्म शत्रु', { y: 450, size: 56 }); } },
    b5: { set: 'heaven', cam: CAM.wide, draw: two('jaya', { arms: 'namaste', face: { eyes: 'sad', mouth: 'calm' } }, 'jaya', { arms: 'namaste', style: { cloth: '#3a6ec0', cloth2: '#f4c430' }, face: { eyes: 'sad', mouth: 'calm' } }, 0.72), over: cardOn('b5', 'तीन', '3 जन्म', { y: 300, size: 70 }) },
    end: { set: 'palace', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'ravana', 230, 1170, 0.6, t, { arms: 'hips', face: { eyes: 'angry', mouth: 'grin' } }); char(ctx, 'kumbhakarna', 540, 1170, 0.6, t, { flip: true, arms: 'fist', face: { eyes: 'angry', mouth: 'grin' } }); },
      over: (ctx, W, H_, t) => { card(ctx, W, H_, t, V('end', 'रावण'), 'जय = रावण', { y: 300, size: 56 }); card(ctx, W, H_, t, V('end', 'कुंभकर्ण।'), 'विजय = कुंभकर्ण', { y: 440, size: 56 }); } },
  };
}, {"series": "रावण के रहस्य", "part": 11, "hook": "रावण पिछले जन्म में\nविष्णु का द्वारपाल था!", "next": "रावण के बेटे ने\nइंद्र को कैद किया!", "nextAt": "nx", "gold": ["जय", "विजय", "वैकुंठ", "सात", "तीन", "रावण", "कुंभकर्ण।"]});
