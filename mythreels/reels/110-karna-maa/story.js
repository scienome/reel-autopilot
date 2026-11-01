KARNA(10, "पूरी ज़िंदगी बाद\nमाँ मेरे पास आई", (k) => {
  const { char, baby, blood, wheel, mud, armour, shaft, glow, CAM } = k;
  return {
    h1: { set: 'river', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'kunti', 360, 1170, 0.72, t, { arms: 'namaste', face: { eyes: 'sad', mouth: 'frown', tears: true } }); } },
    b1: { set: 'river', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'karna', 230, 1170, 0.64, t, { arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } });char(ctx, 'kunti', 520, 1170, 0.6, t, { arms: 'cover', face: { eyes: 'sad', mouth: 'frown', tears: true }, flip: true }); } },
    b2: { set: 'river', cam: [[360, 720, 1.8], [360, 690, 2.1]], draw: (ctx, t) => { char(ctx, 'kunti', 360, 1180, 0.82, t, { arms: 'open', face: { eyes: 'sad', mouth: 'frown', tears: true } }); } },
    b3: { set: 'river', cam: [[360, 720, 1.5], [360, 690, 1.8]], draw: (ctx, t) => { char(ctx, 'karna', 360, 1180, 0.76, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown', tears: true } }); } },
    b4: { set: 'river', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'karna', 230, 1170, 0.68, t, { arms: 'bless', face: { eyes: 'sad', mouth: 'frown', tears: true } });char(ctx, 'kunti', 500, 1170, 0.64, t, { arms: 'namaste', face: { eyes: 'sad', mouth: 'frown', tears: true }, flip: true }); } },
    nx: { set: 'river', cam: [[360, 760, 1.45], [360, 780, 1.75]], draw: (ctx, t) => { char(ctx, 'kunti', 300, 1190, 0.78, t, { arms: 'rest', face: { eyes: 'closed', mouth: 'calm', tears: true } });char(ctx, 'karna', 440, 1190, 0.78, t, { arms: 'rest', face: { eyes: 'closed', mouth: 'calm', tears: true }, flip: true }); } },
  };
}, { gold: ["कर्ण", "सूतपुत्र", "दुर्योधन", "अर्जुन", "कृष्ण", "कुंती", "कवच", "श्राप", "धनुष", "भालू"] });
