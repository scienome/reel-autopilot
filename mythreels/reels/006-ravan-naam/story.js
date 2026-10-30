KATHA((h) => {
  const { V, at, first, char, card, CAM, one, two, cardOn, AT } = h;
  return {
    h1: { set: 'kailash', cam: CAM.push, draw: one('ravana', { arms: 'hips', face: { eyes: 'angry', mouth: 'grin' } }) },
    b1: { set: 'palace', cam: CAM.mid, draw: one('ravana', { arms: 'cross', face: { eyes: 'open', mouth: 'smile' } }), over: cardOn('b1', 'दशग्रीव...', 'दशग्रीव', { y: 300, size: 76 }) },
    b2: { set: 'sky', setOpt: { time: 'dusk' }, cam: CAM.wide, shake: V('b2', 'रुक'),
      draw: (ctx, t) => { const u = H.clamp((t - first('b2')) / 2.4); MYTH.vimana(ctx, H.lerp(-100, 380, u), 640, 0.9, t); char(ctx, 'ravana', H.lerp(-100, 380, u), 610, 0.32, t, { arms: 'hips', face: { eyes: 'angry' } }); } },
    b3: { set: 'kailash', cam: CAM.wide, shake: V('b3', 'उठा'),
      draw: (ctx, t) => { const u = H.clamp((t - V('b3', 'उठा')) / 0.8); ctx.save(); ctx.translate(0, -60 * u); ctx.restore(); char(ctx, 'ravana', 360, 1180, 0.8, t, { arms: { r: 'carry', l: 'up' }, hold: 'mountain', face: { eyes: 'angry', mouth: 'shout' } }); MYTH.dark(ctx, 720, 1280, 0); } },
    b4: { set: 'kailash', cam: [[360, 760, 1.3], [360, 740, 1.4]], draw: one('shiva', { pose: 'sit', halo: true, arms: { r: 'bless', l: 'down' }, face: { eyes: 'closed', mouth: 'smile' } }, 360, 0.8, 1180) },
    b5: { set: 'kailash', cam: CAM.mid, shake: V('b5', 'चीख'), draw: one('ravana', { arms: 'up', bob: 30, face: { eyes: 'closed', mouth: 'shout', tears: true } }),
      over: (ctx, W, H_, t) => { MYTH.shock(ctx, 360, 640, t, V('b5', 'चीख')); MYTH.dark(ctx, W, H_, 0.25); } },
    b6: { set: 'kailash', cam: CAM.wide, draw: one('ravana', { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'open' } }, 360, 0.7), over: cardOn('b6', 'हज़ार', '1000 साल स्तुति', { y: 300 }) },
    sh: { set: 'kailash', cam: CAM.close(360), draw: one('shiva', { halo: true, hold: 'trishul', arms: { r: 'rest', l: 'bless' }, face: { eyes: 'calm', mouth: 'smile' } }),
      over: cardOn('sh', 'रावण।', 'रावण', { y: 300, size: 90 }) },
  };
}, {"series": "रावण के रहस्य", "part": 4, "hook": "रावण का असली नाम\nरावण नहीं था!", "next": "एक श्राप...\nजिसने लंका का अंत लिखा", "nextAt": "nx", "gold": ["दशग्रीव...", "रावण", "रावण।", "कैलाश", "महादेव", "अँगूठा"]});
