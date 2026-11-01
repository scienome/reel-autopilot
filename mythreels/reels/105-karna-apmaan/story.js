KARNA(5, "सबके सामने पूछा\nतेरी जाति क्या है?", (k) => {
  const { char, baby, blood, wheel, mud, armour, shaft, glow, CAM } = k;
  return {
    h1: { set: 'battle', cam: [[360, 720, 1.5], [360, 690, 1.8]], draw: (ctx, t) => { char(ctx, 'kripa', 360, 1180, 0.8, t, { arms: { r: 'point', l: 'down' }, face: { eyes: 'angry', mouth: 'frown' } }); } },
    b1: { set: 'battle', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'arjuna', 360, 1170, 0.68, t, { arms: 'draw', face: { eyes: 'calm', mouth: 'smile' }, hold: 'bow' }); } },
    b2: { set: 'battle', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'karna', 220, 1170, 0.68, t, { arms: 'draw', face: { eyes: 'angry', mouth: 'frown' }, hold: 'bow' });char(ctx, 'arjuna', 510, 1170, 0.66, t, { arms: 'down', face: { eyes: 'wide', mouth: 'o' }, flip: true }); } },
    b3: { set: 'battle', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'kripa', 220, 1170, 0.68, t, { arms: { r: 'point', l: 'down' }, face: { eyes: 'angry', mouth: 'frown' } });char(ctx, 'karna', 510, 1170, 0.66, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown' }, flip: true }); } },
    nx: { set: 'battle', cam: [[360, 720, 1.5], [360, 690, 1.8]], draw: (ctx, t) => { char(ctx, 'karna', 360, 1180, 0.76, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown', tears: true } }); } },
  };
}, { gold: ["कर्ण", "सूतपुत्र", "दुर्योधन", "अर्जुन", "कृष्ण", "कुंती", "कवच", "श्राप", "धनुष", "भालू"] });
