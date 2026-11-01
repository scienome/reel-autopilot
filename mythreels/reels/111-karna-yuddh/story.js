KARNA(11, "चार पांडव मेरे हाथ में\nमैंने छोड़ दिए", (k) => {
  const { char, baby, blood, wheel, mud, armour, shaft, glow, CAM } = k;
  return {
    h1: { set: 'battle', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'karna', 360, 1170, 0.72, t, { arms: 'draw', face: { eyes: 'angry', mouth: 'frown' }, hold: 'bow' }); } },
    b1: { set: 'battle', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'bhima', 230, 1170, 0.62, t, { arms: 'cover', face: { eyes: 'wide', mouth: 'o' } });char(ctx, 'karna', 500, 1170, 0.66, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown' }, flip: true, hold: 'bow' }); } },
    b2: { set: 'battle', cam: [[360, 720, 1.5], [360, 690, 1.8]], draw: (ctx, t) => {  glow(ctx, 360, 640, 320, 'rgba(255,230,140,0.55)');char(ctx, 'karna', 360, 1180, 0.76, t, { arms: 'up', face: { eyes: 'angry', mouth: 'frown' } }); } },
    b3: { set: 'battle', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'ghatotkach', 360, 1170, 0.74, t, { arms: 'up', face: { eyes: 'angry', mouth: 'shout' } }); } },
    b4: { set: 'battle', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'ghatotkach', 360, 1170, 0.74, t, { arms: 'cover', face: { eyes: 'wide', mouth: 'o' } }); shaft(ctx, 60, 500, 360, 800, Math.min(1, (t % 3) / 1)); } },
    nx: { set: 'battle', cam: [[360, 720, 1.5], [360, 690, 1.8]], draw: (ctx, t) => { char(ctx, 'krishna', 360, 1180, 0.8, t, { arms: 'down', face: { eyes: 'calm', mouth: 'smile' }, halo: true }); } },
  };
}, { gold: ["कर्ण", "सूतपुत्र", "दुर्योधन", "अर्जुन", "कृष्ण", "कुंती", "कवच", "श्राप", "धनुष", "भालू"] });
