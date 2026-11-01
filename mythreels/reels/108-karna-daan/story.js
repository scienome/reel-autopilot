KARNA(8, "पिता ने कहा\nकवच मत देना", (k) => {
  const { char, baby, blood, wheel, mud, armour, shaft, glow, CAM } = k;
  return {
    h1: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'surya', 360, 1170, 0.72, t, { arms: 'open', face: { eyes: 'sad', mouth: 'frown' }, halo: true }); } },
    b1: { set: 'heaven', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'surya', 220, 1170, 0.62, t, { arms: { r: 'point', l: 'down' }, face: { eyes: 'sad', mouth: 'frown' }, halo: true });char(ctx, 'karna', 500, 1170, 0.62, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' }, flip: true }); } },
    b2: { set: 'river', cam: [[360, 720, 1.5], [360, 690, 1.8]], draw: (ctx, t) => { char(ctx, 'karna', 360, 1180, 0.76, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }); } },
    b3: { set: 'river', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'indra_beggar', 230, 1170, 0.64, t, { arms: 'open', face: { eyes: 'calm', mouth: 'calm' } });char(ctx, 'karna', 500, 1170, 0.68, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' }, flip: true }); } },
    b4: { set: 'river', cam: [[360, 690, 1.25], [360, 700, 1.5]], draw: (ctx, t) => {  armour(ctx, 360, 690, 1.3, t); blood(ctx, 300, 800, Math.min(1, t / 40)); } },
    nx: { set: 'river', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'indra_beggar', 230, 1170, 0.64, t, { arms: 'namaste', face: { eyes: 'sad', mouth: 'frown' } });char(ctx, 'karna', 500, 1170, 0.68, t, { arms: 'bless', face: { eyes: 'sad', mouth: 'frown', tears: true }, flip: true }); } },
  };
}, { gold: ["कर्ण", "सूतपुत्र", "दुर्योधन", "अर्जुन", "कृष्ण", "कुंती", "कवच", "श्राप", "धनुष", "भालू"] });
