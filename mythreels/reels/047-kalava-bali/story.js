KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const thread = (ctx, x, y, t, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#e8283c'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.ellipse(x, y, 70, 26, 0, 0, 6.2832); ctx.stroke(); ctx.strokeStyle = '#ffd24a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(x, y, 70, 26, 0, 0.3, 6.0); ctx.stroke(); ctx.restore(); };
  const bali = (ctx, x, y, s, t, o = {}) => char(ctx, 'asura', x, y, s, t, Object.assign({ style: { horns: false, tusks: false, redEyes: false, skin: '#8a6a4a', sh: '#6a4e34', cloth: '#d8a030', cloth2: '#c8332a' }, as: 'asura' }, o));

  return {
    h1: { set: 'kailash', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'villager', 360, 1170, 0.85, t, { arms: { r: 'bless', l: 'down' }, face: { eyes: 'calm', mouth: 'smile' } }); thread(ctx, 270, 940, t); } },
    b1: { set: 'village', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'sage', 250, 1170, 0.78, t, { arms: { r: 'point', l: 'down' }, face: { eyes: 'calm', mouth: 'open' } }); char(ctx, 'villager', 520, 1170, 0.78, t, { flip: true, arms: { r: 'down', l: 'bless' }, face: { eyes: 'calm', mouth: 'smile' } }); thread(ctx, 500, 920, t); }, over: cardOn('b1', 'बली', 'बली राजा', { y: 300, size: 80 }) },
    b2: { set: 'palace', cam: CAM.mid, draw: (ctx, t) => { bali(ctx, 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); }, over: cardOn('b2', 'बलि', 'राजा बलि', { y: 300, size: 80 }) },
    b3: { set: 'heaven', cam: CAM.wide, draw: (ctx, t) => { bali(ctx, 400, 1170, 0.82, t, { arms: 'open', face: { eyes: 'calm', mouth: 'smile' } }); char(ctx, 'indra', 130, 1170, 0.4, t, { arms: 'down', face: { eyes: 'sad', mouth: 'calm' } }); } },
    b4: { set: 'palace', cam: CAM.wide, draw: (ctx, t) => { bali(ctx, 220, 1170, 0.82, t, { arms: 'open', face: { eyes: 'calm', mouth: 'smile' } }); char(ctx, 'kumara', 510, 1170, 0.62, t, { flip: true, arms: { r: 'point', l: 'down' }, face: { eyes: 'calm', mouth: 'smile' } }); }, over: cardOn('b4', 'तीन', '3 पग', { y: 300, size: 80 }) },
    b5: { set: 'space', setOpt: { sun: false }, cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'vishnu', 360, 930, 0.55, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); bali(ctx, 360, 1190, 0.45, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'smile' } }); } },
    b6: { set: 'village', cam: CAM.close(), draw: (ctx, t) => { char(ctx, 'villager', 360, 1170, 0.85, t, { arms: { r: 'bless', l: 'down' }, face: { eyes: 'happy', mouth: 'smile' } }); thread(ctx, 360, 800, t); } },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { thread(ctx, 360, 640, t); thread(ctx, 360, 640, t); }, over: (ctx, W, H_, t) => { MYTH.petals(ctx, W, t, at('end', 0), 24); cardOn('end', 'वचन', 'वचन का धागा', { y: 300, size: 70 })(ctx, W, H_, t); } },
  };
}, {"series": "पूजा के पीछे की कथा", "part": 4, "hook": "कलावे के मंत्र में\nदानव राजा का नाम?", "next": "जगन्नाथ जी की\nमूर्ति अधूरी क्यों?", "nextAt": "nx", "gold": ["कलावा", "बलि", "वामन", "तीन", "वचन", "मंत्र"]});
