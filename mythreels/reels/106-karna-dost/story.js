KARNA(6, "जिसने मेरा मान रखा\nउसके लिए जान दूँगा", (k) => {
  const { char, baby, blood, wheel, mud, armour, shaft, glow, CAM } = k;
  return {
    h1: { set: 'battle', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'duryodhana', 360, 1170, 0.72, t, { arms: { r: 'point', l: 'hips' }, face: { eyes: 'angry', mouth: 'frown' } }); } },
    b1: { set: 'palace', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'duryodhana', 220, 1170, 0.64, t, { arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } });char(ctx, 'karna', 500, 1170, 0.64, t, { arms: 'namaste', face: { eyes: 'wide', mouth: 'smile' }, flip: true }); } },
    b2: { set: 'palace', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'duryodhana', 230, 1170, 0.68, t, { arms: 'open', face: { eyes: 'calm', mouth: 'smile' } });char(ctx, 'karna', 500, 1170, 0.68, t, { arms: 'open', face: { eyes: 'calm', mouth: 'smile', tears: true }, flip: true }); } },
    b3: { set: 'palace', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'adhiratha', 240, 1170, 0.66, t, { arms: 'open', face: { eyes: 'sad', mouth: 'frown', tears: true } });char(ctx, 'karna', 470, 1170, 0.62, t, { arms: 'namaste', face: { eyes: 'sad', mouth: 'frown', tears: true }, flip: true, lean: -0.3 }); } },
    nx: { set: 'palace', cam: [[360, 720, 1.5], [360, 690, 1.8]], draw: (ctx, t) => { char(ctx, 'karna', 360, 1180, 0.76, t, { arms: 'fist', face: { eyes: 'calm', mouth: 'calm', tears: true } }); } },
  };
}, { gold: ["कर्ण", "सूतपुत्र", "दुर्योधन", "अर्जुन", "कृष्ण", "कुंती", "कवच", "श्राप", "धनुष", "भालू"] });
