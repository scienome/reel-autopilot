KARNA(12, "मेरी मौत के दिन\nसारे श्राप लौट आए", (k) => {
  const { char, baby, blood, wheel, mud, armour, shaft, glow, CAM } = k;
  return {
    h1: { set: 'battle', cam: [[360, 720, 1.5], [360, 690, 1.8]], draw: (ctx, t) => { char(ctx, 'karna', 360, 1180, 0.76, t, { arms: 'down', face: { eyes: 'wide', mouth: 'o' } }); } },
    b1: { set: 'battle', cam: [[360, 900, 1.25], [360, 960, 1.55]], draw: (ctx, t) => {  wheel(ctx, 360, 1020, 1.25, 0.1); mud(ctx, 1080); } },
    b2: { set: 'battle', cam: [[360, 720, 1.5], [360, 690, 1.8]], draw: (ctx, t) => { char(ctx, 'karna', 360, 1180, 0.76, t, { arms: 'up', face: { eyes: 'wide', mouth: 'o' } }); } },
    b3: { set: 'battle', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'karna', 200, 1170, 0.62, t, { arms: 'open', face: { eyes: 'sad', mouth: 'frown', tears: true } });char(ctx, 'krishna', 520, 1170, 0.62, t, { arms: { r: 'point', l: 'down' }, face: { eyes: 'calm', mouth: 'calm' }, flip: true, halo: true }); } },
    b4: { set: 'battle', cam: [[360, 700, 1.6], [360, 700, 1.9]], draw: (ctx, t) => { char(ctx, 'karna', 360, 1180, 0.76, t, { arms: 'down', face: { eyes: 'closed', mouth: 'calm' } }); shaft(ctx, 720, 500, 380, 720, Math.min(1, (t % 2.5) / 0.7)); } },
    b5: { set: 'river', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'kunti', 360, 1170, 0.66, t, { arms: 'cover', face: { eyes: 'sad', mouth: 'frown', tears: true } }); } },
    nx: { set: 'sky', setOpt: { time: 'dusk', sun: true }, cam: [[360, 760, 1.3], [360, 720, 1.5]], draw: (ctx, t) => {  glow(ctx, 360, 480, 420, 'rgba(255,190,70,0.8)');char(ctx, 'karna', 360, 1180, 0.76, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }); } },
  };
}, { next: false, gold: ["कर्ण", "सूतपुत्र", "दुर्योधन", "अर्जुन", "कृष्ण", "कुंती", "कवच", "श्राप", "धनुष", "भालू"] });
