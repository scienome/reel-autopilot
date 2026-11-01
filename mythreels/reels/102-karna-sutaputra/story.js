KARNA(2, "सूर्य का बेटा\nसारथी के घर", (k) => {
  const { char, baby, blood, wheel, mud, armour, shaft, glow, CAM } = k;
  return {
    h1: { set: 'river', setOpt: { night: false }, cam: [[360, 720, 1.5], [360, 690, 1.8]], draw: (ctx, t) => { char(ctx, 'adhiratha', 360, 1180, 0.74, t, { arms: 'open', face: { eyes: 'wide', mouth: 'o' } }); baby(ctx, 360, 900, 0.7); } },
    b1: { set: 'village', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'adhiratha', 240, 1170, 0.62, t, { arms: 'down', face: { eyes: 'calm', mouth: 'calm' } });char(ctx, 'radha', 480, 1170, 0.62, t, { arms: 'cover', face: { eyes: 'sad', mouth: 'frown', tears: true } }); } },
    b2: { set: 'village', cam: [[360, 780, 1.55], [360, 800, 1.85]], draw: (ctx, t) => { char(ctx, 'radha', 360, 1200, 0.86, t, { arms: 'rest', face: { eyes: 'happy', mouth: 'smile', tears: true } }); baby(ctx, 360, 915, 0.72); } },
    b3: { set: 'village', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'karna', 360, 1180, 0.76, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown' } });char(ctx, 'villager', 120, 1180, 0.6, t, { arms: 'point', face: { eyes: 'happy', mouth: 'grin' } });char(ctx, 'villager', 610, 1180, 0.6, t, { arms: 'point', face: { eyes: 'happy', mouth: 'grin' }, flip: true }); } },
    nx: { set: 'forest', cam: [[360, 740, 1.3], [360, 700, 1.6]], draw: (ctx, t) => { char(ctx, 'karna', 360, 1180, 0.76, t, { arms: { r: 'up', l: 'down' }, face: { eyes: 'calm', mouth: 'calm' }, hold: 'bow' }); } },
  };
}, { gold: ["कर्ण", "सूतपुत्र", "दुर्योधन", "अर्जुन", "कृष्ण", "कुंती", "कवच", "श्राप", "धनुष", "भालू"] });
