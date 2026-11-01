KARNA(4, "खून बहता रहा\nमैं हिला नहीं", (k) => {
  const { char, baby, blood, wheel, mud, armour, shaft, glow, CAM } = k;
  return {
    h1: { set: 'forest', cam: [[360, 860, 1.6], [360, 900, 2]], draw: (ctx, t) => { char(ctx, 'karna', 360, 1170, 0.72, t, { arms: 'rest', face: { eyes: 'closed', mouth: 'frown' }, pose: 'sit' }); blood(ctx, 300, 1030, Math.min(1, t / 12)); } },
    b1: { set: 'forest', cam: [[360, 720, 1.5], [360, 690, 1.8]], draw: (ctx, t) => { char(ctx, 'karna', 360, 1180, 0.76, t, { arms: 'rest', face: { eyes: 'closed', mouth: 'frown', tears: true } }); } },
    b2: { set: 'forest', cam: [[360, 720, 1.7], [360, 680, 2.1]], draw: (ctx, t) => { char(ctx, 'parshuram', 360, 1180, 0.8, t, { arms: 'down', face: { eyes: 'wide', mouth: 'o' } }); } },
    b3: { set: 'forest', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'parshuram', 220, 1170, 0.68, t, { arms: { r: 'point', l: 'down' }, face: { eyes: 'angry', mouth: 'shout' } });char(ctx, 'karna', 510, 1170, 0.66, t, { arms: 'namaste', face: { eyes: 'sad', mouth: 'frown', tears: true }, flip: true }); } },
    b4: { set: 'battle', setOpt: { sun: false }, cam: [[360, 720, 1.6], [360, 680, 2]], draw: (ctx, t) => { char(ctx, 'parshuram', 360, 1180, 0.8, t, { arms: 'up', face: { eyes: 'angry', mouth: 'shout' } }); } },
    nx: { set: 'forest', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'karna', 360, 1100, 0.5, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown' } }); } },
  };
}, { gold: ["कर्ण", "सूतपुत्र", "दुर्योधन", "अर्जुन", "कृष्ण", "कुंती", "कवच", "श्राप", "धनुष", "भालू"] });
