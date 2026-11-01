KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const dar = (ctx, x, y, t, open) => { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#5a2a14'; ctx.strokeStyle = MYTH.INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-130, -300, 260, 380, 18); ctx.fill(); ctx.stroke(); if (open > 0) { ctx.fillStyle = `rgba(255,220,120,${0.9 * open})`; ctx.beginPath(); ctx.roundRect(-110 * open, -280, 220 * open, 340, 10); ctx.fill(); } ctx.restore(); };
  const log = (ctx, x, y, w, h, fill = '#3a6ec0') => { MYTH.ell(ctx, fill, x, y, w, h, 0, 5); for (const k of [-1, 1]) { MYTH.ell(ctx, '#fff6d0', x + k * w * 0.4, y - h * 0.3, w * 0.28, w * 0.28, 0, 4); MYTH.ell(ctx, '#1a0c06', x + k * w * 0.4, y - h * 0.3, w * 0.1, w * 0.1, 0, 2); } };
  const raja = (ctx, x, y, s, t, o = {}) => char(ctx, 'indra', x, y, s, t, Object.assign({ as: 'indra', style: { cloth: '#c8332a', cloth2: '#f4c430' } }, o));

  return {
    h1: { set: 'palace', cam: CAM.mid, draw: (ctx, t) => { log(ctx, 360, 900, 90, 220, '#2a2a3a');  } },
    b1: { set: 'palace', cam: CAM.mid, draw: (ctx, t) => { raja(ctx, 360, 1170, 0.85, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }); }, over: cardOn('b1', 'इंद्रद्युम्न', 'राजा इंद्रद्युम्न', { y: 300, size: 62 }) },
    b2: { set: 'village', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'sage', 360, 1170, 0.85, t, { halo: true, arms: { r: 'bless', l: 'down' }, face: { eyes: 'calm', mouth: 'smile' } }); }, over: cardOn('b2', 'विश्वकर्मा', 'विश्वकर्मा', { y: 300, size: 80 }) },
    b3: { set: 'palace', cam: CAM.wide, draw: (ctx, t) => { dar(ctx, 360, 900, t, 0); char(ctx, 'sage', 140, 1170, 0.5, t, { arms: 'point', face: { eyes: 'calm', mouth: 'open' } }); }, over: cardOn('b3', 'द्वार', 'कोई द्वार न खोले', { y: 300, size: 56 }) },
    b4: { set: 'palace', cam: [[360, 800, 1.0], [360, 780, 1.3]], draw: (ctx, t) => { dar(ctx, 360, 900, t, 0); raja(ctx, 560, 1170, 0.6, t, { flip: true, arms: 'hips', face: { eyes: 'sad', mouth: 'o' } }); } },
    b5: { set: 'palace', cam: CAM.wide, shake: V('b5', 'खोल'), draw: (ctx, t) => { dar(ctx, 360, 900, t, H.clamp((t - V('b5', 'खोल')) / 0.6)); raja(ctx, 560, 1170, 0.6, t, { flip: true, arms: 'wide', face: { eyes: 'wide', mouth: 'o' } }); } },
    b6: { set: 'heaven', cam: CAM.wide, draw: (ctx, t) => { log(ctx, 150, 980, 80, 190, '#f2f0ea'); log(ctx, 360, 1000, 95, 220, '#2a2a3a'); log(ctx, 570, 1000, 70, 160, '#e8b020');  }, over: cardOn('b6', 'तीन', 'जगन्नाथ  बलभद्र  सुभद्रा', { y: 300, size: 46 }) },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { raja(ctx, 360, 1170, 0.85, t, { arms: 'namaste', halo: true, face: { eyes: 'closed', mouth: 'smile' } }); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('end', 5), 24) },
  };
}, {"series": "पूजा के पीछे की कथा", "part": 5, "hook": "जगन्नाथ जी की\nमूर्ति अधूरी क्यों?", "next": "नारियल को राजा का\nसिर क्यों कहते हैं?", "nextAt": "nx", "gold": ["जगन्नाथ", "इंद्रद्युम्न", "विश्वकर्मा", "मूर्ति", "अधूरी", "द्वार"]});
