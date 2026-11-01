KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const ardh = (ctx, x, y, s, t, o = {}) => { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, x, 1400); ctx.clip(); char(ctx, 'shiva', x, y, s, t, Object.assign({ halo: true, arms: 'bless' }, o)); ctx.restore(); ctx.save(); ctx.beginPath(); ctx.rect(x, 0, 800, 1400); ctx.clip(); char(ctx, 'parvati', x, y, s * 1.12, t, Object.assign({ halo: true, arms: 'bless' }, o)); ctx.restore(); };

  return {
    h1: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => ardh(ctx, 360, 1170, 0.85, t, { face: { eyes: 'calm', mouth: 'calm' } }) },
    b1: { set: 'heaven', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'brahma', 360, 1170, 0.8, t, { arms: 'open', face: { eyes: 'wide', mouth: 'open' } }); } },
    b2: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'brahma', 360, 1170, 0.7, t, { pose: 'sit', arms: 'namaste', halo: true, face: { eyes: 'closed', mouth: 'calm' } }); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('b2', 6), 14) },
    b3: { set: 'space', setOpt: { sun: false }, cam: CAM.mid, shake: V('b3', 'प्रकट'), draw: (ctx, t) => ardh(ctx, 360, 1170, 0.9, t, { face: { eyes: 'calm', mouth: 'smile' } }), over: cardOn('b3', 'आधे', 'अर्धनारीश्वर', { y: 300, size: 70 }) },
    b4: { set: 'heaven', cam: CAM.wide, draw: (ctx, t) => { ardh(ctx, 470, 1170, 0.7, t, { face: { eyes: 'calm', mouth: 'smile' } }); char(ctx, 'brahma', 180, 1170, 0.6, t, { arms: 'namaste', face: { eyes: 'happy', mouth: 'smile' } }); } },
    b5: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'parvati', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('b5', 6), 26) },
    end: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => ardh(ctx, 360, 1170, 0.85, t, { face: { eyes: 'calm', mouth: 'smile' } }), over: cardOn('end', 'अर्धनारीश्वर', 'शिव + शक्ति', { y: 300, size: 80 }) },
  };
}, {"series": "देवताओं के रूप का रहस्य", "part": 3, "hook": "शिव आधे स्त्री\nरूप में क्यों?", "next": "विष्णु जी की छाती पर\nनिशान किसका?", "nextAt": "nx", "gold": ["अर्धनारीश्वर", "शिव", "शक्ति", "ब्रह्मा", "सृष्टि", "नारी"]});
