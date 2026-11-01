KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const moon = (ctx, x, y, r, a = 1) => { const g = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 2.2); g.addColorStop(0, `rgba(255,246,200,${0.5 * a})`); g.addColorStop(1, 'rgba(255,246,200,0)'); ctx.fillStyle = g; ctx.fillRect(x - r * 2.2, y - r * 2.2, r * 4.4, r * 4.4); MYTH.ell(ctx, '#fff3c0', x, y, r, r, 0, 4); };
  const cres = (ctx, x, y, r, rot = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.2832); ctx.clip(); ctx.fillStyle = '#fff3c0'; ctx.beginPath(); ctx.rect(-r * 2, -r * 2, r * 4, r * 4); ctx.arc(r * 0.5, -r * 0.1, r * 0.85, 0, 6.2832); ctx.fill('evenodd'); ctx.restore(); };

  const chandra = (ctx, x, y, s, t, o = {}) => char(ctx, 'deva', x, y, s, t, Object.assign({ style: { skin: '#e4ecf8', sh: '#b8c6e0', cloth: '#f4f0ff', cloth2: '#8aa8e0' } }, o));

  return {
    h1: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }); cres(ctx, 402, 622, 38, -0.5); } },
    b1: { set: 'sky', setOpt: { time: 'night' }, cam: CAM.wide, draw: (ctx, t) => { moon(ctx, 120, 330, 50); chandra(ctx, 250, 1170, 0.62, t, { arms: 'rest', face: { eyes: 'happy', mouth: 'smile' } }); char(ctx, 'sita', 450, 1170, 0.62, t, { flip: true, halo: true, arms: 'namaste', face: { eyes: 'happy', mouth: 'smile' } }); char(ctx, 'parvati', 610, 1170, 0.5, t, { flip: true, arms: 'down', face: { eyes: 'sad', mouth: 'calm' } }); }, over: cardOn('b1', 'रोहिणी', 'रोहिणी', { y: 300, size: 80 }) },
    b2: { set: 'palace', cam: CAM.wide, shake: V('b2', 'श्राप'), draw: (ctx, t) => { char(ctx, 'sage', 220, 1170, 0.72, t, { arms: { r: 'point', l: 'fist' }, face: { eyes: 'angry', mouth: 'shout' } }); chandra(ctx, 520, 1170, 0.72, t, { flip: true, arms: 'down', face: { eyes: 'wide', mouth: 'o' } }); } },
    b3: { set: 'sky', setOpt: { time: 'night' }, cam: [[360, 700, 1.0], [360, 700, 1.1]], draw: (ctx, t) => { const u = H.clamp((t - at('b3', 0)) / 4); moon(ctx, 360, 520, 150 - 105 * u, 1 - 0.6 * u); chandra(ctx, 360, 1170, 0.5, t, { arms: 'down', face: { eyes: 'sad', mouth: 'calm' } }); } },
    b4: { set: 'river', setOpt: { night: true }, cam: CAM.mid, draw: (ctx, t) => { chandra(ctx, 360, 1170, 0.7, t, { pose: 'sit', arms: 'namaste', halo: true, face: { eyes: 'closed', mouth: 'calm' } }); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('b4', 4), 14) },
    b5: { set: 'kailash', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'shiva', 440, 1170, 0.78, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); chandra(ctx, 170, 1170, 0.5, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); } },
    b6: { set: 'heaven', cam: CAM.close(), draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); const u = H.clamp((t - V('b6', 'मस्तक')) / 0.8); cres(ctx, 402, H.lerp(300, 622, u), 38, -0.5); } },
    end: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'shiva', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); cres(ctx, 402, 622, 38, -0.5); }, over: cardOn('end', 'चंद्रशेखर', 'चंद्रशेखर', { y: 300, size: 80 }) },
  };
}, {"series": "देवताओं के रूप का रहस्य", "part": 1, "hook": "शिव के सिर पर\nचाँद क्यों?", "next": "गणेश जी का एक\nदाँत कैसे टूटा?", "nextAt": "nx", "gold": ["चाँद", "चंद्रमा", "श्राप", "रोहिणी", "चंद्रशेखर", "दक्ष"]});
