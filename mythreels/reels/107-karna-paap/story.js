KARNA(7, "मेरा सबसे बड़ा पाप\nमेरी ज़ुबान थी", (k) => {
  const { char, baby, blood, wheel, mud, armour, shaft, glow, CAM } = k;
  return {
    h1: { set: 'palace', setOpt: { night: true }, cam: [[360, 720, 1.5], [360, 690, 1.8]], draw: (ctx, t) => { char(ctx, 'karna', 360, 1180, 0.76, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown' } }); } },
    b1: { set: 'palace', setOpt: { night: true }, cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'draupadi', 360, 1170, 0.66, t, { arms: 'cover', face: { eyes: 'sad', mouth: 'frown', tears: true } }); } },
    b2: { set: 'palace', setOpt: { night: true }, cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'karna', 360, 1170, 0.72, t, { arms: { r: 'point', l: 'hips' }, face: { eyes: 'angry', mouth: 'frown' } }); } },
    b3: { set: 'palace', setOpt: { night: true }, cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'draupadi', 500, 1170, 0.64, t, { arms: 'cover', face: { eyes: 'sad', mouth: 'frown', tears: true }, flip: true });char(ctx, 'karna', 210, 1170, 0.66, t, { arms: 'hips', face: { eyes: 'happy', mouth: 'grin' } }); } },
    nx: { set: 'river', setOpt: { night: true }, cam: [[360, 740, 1.3], [360, 700, 1.6]], draw: (ctx, t) => { char(ctx, 'karna', 360, 1180, 0.76, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown', tears: true } }); } },
  };
}, { gold: ["कर्ण", "सूतपुत्र", "दुर्योधन", "अर्जुन", "कृष्ण", "कुंती", "कवच", "श्राप", "धनुष", "भालू"] });
