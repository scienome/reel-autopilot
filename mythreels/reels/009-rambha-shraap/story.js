KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'forest', setOpt: { time: 'night' }, cam: CAM.push, draw: (ctx, t) => { char(ctx, 'sita', 360, 1170, 0.8, t, { arms: 'namaste', face: { eyes: 'sad', mouth: 'calm' } }); } },
    b1: { set: 'heaven', cam: CAM.wide, draw: two('ravana', { arms: { r: 'point', l: 'hips' }, face: { eyes: 'open', mouth: 'grin' } }, 'rambha', { arms: 'namaste', face: { eyes: 'wide', mouth: 'o' } }, 0.66) },
    b2: { set: 'heaven', cam: CAM.close(360), draw: one('rambha', { arms: 'namaste', face: { eyes: 'sad', mouth: 'calm' } }) },
    b3: { set: 'heaven', cam: CAM.mid, draw: one('ravana', { arms: 'hips', face: { eyes: 'angry', mouth: 'grin' } }), over: (ctx, W, H_, t) => MYTH.dark(ctx, W, H_, 0.45) },
    b4: { set: 'heaven', cam: CAM.wide, draw: two('rambha', { arms: 'cover', face: { eyes: 'sad', mouth: 'frown', tears: true } }, 'nalakubara', { arms: { r: 'fist', l: 'bless' }, face: { eyes: 'angry', mouth: 'calm' } }, 0.7) },
    nk: { set: 'heaven', cam: [[360, 700, 1.9], [360, 680, 2.3]], shake: V('nk', 'सात'), draw: one('nalakubara', { glow: 'rgba(160,210,255,0.4)', arms: { r: 'point', l: 'fist' }, face: { eyes: 'angry', mouth: 'calm' } }),
      over: cardOn('nk', 'सात', 'सिर के 7 टुकड़े', { y: 300 }) },
    end: { set: 'forest', setOpt: { time: 'night' }, cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'sita', 520, 1170, 0.66, t, { flip: true, arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' }, halo: true }); char(ctx, 'ravana', 170, 1170, 0.6, t, { arms: 'cover', face: { eyes: 'wide', mouth: 'frown' } }); } },
  };
}, {"series": "रावण के रहस्य", "part": 7, "hook": "रावण ने सीता को\nकभी छुआ क्यों नहीं?", "next": "रावण को बगल में दबाकर\n4 समुद्र घुमाए!", "nextAt": "nx", "gold": ["सीता", "रंभा", "नलकूबर", "सात", "श्राप", "क्यों?"]});
