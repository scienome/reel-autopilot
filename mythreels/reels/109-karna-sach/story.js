KARNA(9, "युद्ध से पहले\nमेरा असली नाम", (k) => {
  const { char, baby, blood, wheel, mud, armour, shaft, glow, CAM } = k;
  return {
    h1: { set: 'sky', setOpt: { time: 'dusk' }, cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'krishna', 360, 1170, 0.72, t, { arms: 'open', face: { eyes: 'calm', mouth: 'calm' }, halo: true }); } },
    b1: { set: 'sky', setOpt: { time: 'dusk' }, cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'krishna', 220, 1170, 0.64, t, { arms: 'open', face: { eyes: 'calm', mouth: 'calm' }, halo: true });char(ctx, 'karna', 500, 1170, 0.64, t, { arms: 'down', face: { eyes: 'wide', mouth: 'o' }, flip: true }); } },
    b2: { set: 'palace', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'krishna', 360, 1170, 0.7, t, { arms: 'bless', face: { eyes: 'calm', mouth: 'smile' }, halo: true }); } },
    b3: { set: 'sky', setOpt: { time: 'dusk' }, cam: [[360, 720, 1.5], [360, 690, 1.8]], draw: (ctx, t) => { char(ctx, 'karna', 360, 1180, 0.76, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown', tears: true } }); } },
    nx: { set: 'river', setOpt: { night: true }, cam: [[360, 780, 1.2], [360, 740, 1.5]], draw: (ctx, t) => { char(ctx, 'karna', 360, 1170, 0.6, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown' } }); } },
  };
}, { gold: ["कर्ण", "सूतपुत्र", "दुर्योधन", "अर्जुन", "कृष्ण", "कुंती", "कवच", "श्राप", "धनुष", "भालू"] });
