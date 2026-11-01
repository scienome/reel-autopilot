KARNA(3, "धनुष के लिए\nगुरु से झूठ", (k) => {
  const { char, baby, blood, wheel, mud, armour, shaft, glow, CAM } = k;
  return {
    h1: { set: 'forest', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'parshuram', 230, 1170, 0.66, t, { arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } });char(ctx, 'karna', 500, 1170, 0.66, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' }, flip: true }); } },
    b1: { set: 'palace', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'drona', 220, 1170, 0.68, t, { arms: { r: 'point', l: 'down' }, face: { eyes: 'angry', mouth: 'frown' } });char(ctx, 'karna', 510, 1170, 0.66, t, { arms: 'down', face: { eyes: 'sad', mouth: 'frown' }, flip: true }); } },
    b2: { set: 'forest', cam: [[360, 720, 1.5], [360, 700, 1.75]], draw: (ctx, t) => { char(ctx, 'karna', 360, 1180, 0.76, t, { arms: 'namaste', face: { eyes: 'sad', mouth: 'calm' } }); } },
    b3: { set: 'forest', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'parshuram', 190, 1170, 0.62, t, { arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } });char(ctx, 'karna', 500, 1170, 0.62, t, { arms: 'draw', face: { eyes: 'calm', mouth: 'smile' }, hold: 'bow', flip: true }); } },
    nx: { set: 'forest', cam: [[360, 800, 1.3], [360, 860, 1.7]], draw: (ctx, t) => { char(ctx, 'karna', 360, 1170, 0.72, t, { arms: 'rest', face: { eyes: 'calm', mouth: 'calm' }, pose: 'sit' }); } },
  };
}, { gold: ["कर्ण", "सूतपुत्र", "दुर्योधन", "अर्जुन", "कृष्ण", "कुंती", "कवच", "श्राप", "धनुष", "भालू"] });
