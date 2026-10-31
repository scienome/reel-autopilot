KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;
  const fire = (ctx, x, y, t, s = 1.4) => { MYTH.flame(ctx, x, y, s, t); };
  return {
    h1: { set: 'heaven', setOpt: { om: true }, cam: CAM.mid, draw: one('brahma', { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }, 360, 0.8) },
    b1: { set: 'river', cam: CAM.wide, draw: (ctx, t) => { fire(ctx, 360, 1230, t); char(ctx, 'brahma', 360, 1150, 0.6, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); }, over: cardOn('b1', 'पुष्कर', 'पुष्कर', { y: 300, size: 90 }) },
    b2: { set: 'river', cam: CAM.mid, draw: (ctx, t) => { fire(ctx, 360, 1230, t); char(ctx, 'brahma', 250, 1150, 0.6, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); } },
    b3: { set: 'sky', setOpt: { time: 'dusk' }, cam: [[360, 760, 1.0], [360, 740, 1.3]], draw: (ctx, t) => { char(ctx, 'saraswati', 360 + 40 * Math.sin(t * 4), 1170, 0.78, t, { arms: 'down', face: { eyes: 'sad', mouth: 'calm' } }); }, over: cardOn('b3', 'सावित्री', 'सावित्री', { y: 300, size: 78 }) },
    b4: { set: 'river', cam: CAM.mid, draw: (ctx, t) => { fire(ctx, 360, 1230, t); char(ctx, 'brahma', 210, 1170, 0.6, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }); char(ctx, 'sita', 510, 1170, 0.6, t, { pose: 'sit', flip: true, arms: 'namaste', face: { eyes: 'closed', mouth: 'smile' } }); }, over: cardOn('b4', 'गायत्री', 'गायत्री', { y: 300, size: 78 }) },
    b5: { set: 'river', cam: CAM.wide, draw: (ctx, t) => { fire(ctx, 360, 1230, t); char(ctx, 'brahma', 230, 1170, 0.5, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'wide', mouth: 'o' } }); char(ctx, 'sita', 400, 1170, 0.5, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); char(ctx, 'saraswati', 620, 1170, 0.6, t, { flip: true, arms: 'wide', face: { eyes: 'wide', mouth: 'o' } }); } },
    b6: { set: 'sky', setOpt: { time: 'dusk' }, cam: CAM.close(), shake: V('b6', 'श्राप'), draw: one('saraswati', { arms: { r: 'point', l: 'fist' }, face: { eyes: 'angry', mouth: 'shout' } }) },
    b7: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'sita', 360, 1170, 0.8, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('b7', 3), 22) },
    end: { set: 'kailash', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'brahma', 210, 1170, 0.55, t, { arms: 'bless', halo: true, face: { eyes: 'calm', mouth: 'smile' } }); char(ctx, 'sita', 330, 1170, 0.5, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'smile' } }); char(ctx, 'saraswati', 600, 960, 0.4, t, { flip: true, arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }); } },
  };
}, {series: 'पूजा के पीछे की कथा', part: 2, hook: 'ब्रह्मा जी के मंदिर\nगिने-चुने क्यों?', next: 'शिव पर तुलसी\nक्यों नहीं चढ़ती?', nextAt: 'nx', gold: ['मंदिर', 'पुष्कर', 'सावित्री', 'गायत्री', 'श्राप', 'यज्ञ']});
