KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'battle', cam: CAM.push, draw: (ctx, t) => { char(ctx, 'ravana', 600, 1020, 0.55, t, { lean: -Math.PI / 2, style: { heads: 1 }, arms: 'down', face: { eyes: 'half', mouth: 'calm' } }); char(ctx, 'lakshman', 200, 1090, 0.6, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }); } },
    b1: { set: 'battle', cam: CAM.wide, draw: two('rama', { halo: true, holdL: 'bow', arms: { r: 'point', l: 'rest' }, face: { eyes: 'calm', mouth: 'calm' } }, 'lakshman', { arms: 'namaste', face: { eyes: 'calm' } }, 0.7) },
    b2: { set: 'battle', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'ravana', 640, 1020, 0.55, t, { lean: -Math.PI / 2, style: { heads: 1 }, arms: 'down', face: { eyes: 'closed', mouth: 'calm' } }); char(ctx, 'lakshman', 250, 1090, 0.62, t, { arms: 'cross', face: { eyes: 'calm', mouth: 'calm' } }); } },
    b3: { set: 'battle', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'ravana', 470, 1020, 0.55, t, { lean: -Math.PI / 2, style: { heads: 1 }, arms: 'down', face: { eyes: 'half', mouth: 'calm' } }); char(ctx, 'lakshman', 610, 1090, 0.5, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }); } },
    rv1: { set: 'battle', cam: CAM.close(360), draw: one('ravana', { arms: 'down', face: { eyes: 'half', mouth: 'calm' } }), over: cardOn('rv1', 'पहली...', '1. शुभ काम में देर नहीं', { y: 300, size: 50 }) },
    rv2: { set: 'battle', cam: CAM.close(360), draw: one('ravana', { arms: 'down', face: { eyes: 'sad', mouth: 'calm' } }), over: cardOn('rv2', 'दूसरी...', '2. शत्रु को छोटा मत समझो', { y: 300, size: 48 }) },
    rv3: { set: 'battle', cam: CAM.close(360), draw: one('ravana', { arms: 'down', face: { eyes: 'sad', mouth: 'calm', tears: true } }), over: cardOn('rv3', 'तीसरी...', '3. अपना राज़ मत बताओ', { y: 300, size: 50 }) },
    end: { set: 'battle', cam: [[400, 900, 1.3], [400, 920, 1.5]], draw: (ctx, t) => { char(ctx, 'ravana', 620, 1020, 0.6, t, { lean: -Math.PI / 2, style: { heads: 1 }, arms: 'down', face: { eyes: 'closed', mouth: 'calm' } }); }, over: (ctx, W, H_, t) => MYTH.dark(ctx, W, H_, 0.35) },
  };
}, {"series": "रावण के रहस्य", "part": 14, "hook": "मरते हुए रावण की\n3 आखिरी सीख!", "next": "पूरी सीरीज़\nप्रोफ़ाइल पर", "nextAt": "nx", "gold": ["लक्ष्मण", "रावण", "पहली...", "दूसरी...", "तीसरी...", "शुभ", "शत्रु", "राज़"]});
