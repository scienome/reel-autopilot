KATHA((h) => {
  const { at, char, CAM, cardOn } = h;
  const lying = (ctx, t, n = 4) => { for (let i = 0; i < n; i++) { const x = 70 + i * 180, y = 1160 + (i % 2) * 34; ctx.save(); ctx.translate(x, y); MYTH.smooth(ctx, i % 2 ? '#f2ead8' : '#e8742a', [[-90, -16], [10, -34], [78, -18], [78, 12], [-90, 14]], 4); MYTH.ell(ctx, '#c88c62', 104, -10, 28, 25, 0, 4); MYTH.ell(ctx, i % 2 ? '#2a7a9a' : '#f4c430', 110, -28, 28, 13, 0, 3); ctx.restore(); } };
  const herd = (ctx, t, k, n = 5) => { for (let i = 0; i < n; i++) { const x = -360 + k * 1450 - i * 200, y = 1080 + (i % 2) * 34; DIWA.cow(ctx, x, y, 0.74 + (i % 2) * 0.1, t + i); } };
  return {
    h1: { set: 'road', cam: [[360, 940, 1.0], [360, 940, 1.08]], draw: (ctx, t) => { lying(ctx, t); herd(ctx, t, 0.45 + 0.08 * t); } },
    b1: { set: 'road', setOpt: { time: 'dawn' }, cam: CAM.wide, over: cardOn('b1', -2, 'भिड़ावद', { y: 300, size: 92 }) },
    b2: { set: 'road', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'pandit', 200, 1100, 0.66, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' } }); DIWA.cow(ctx, 410, 1130, 0.86, 0); }, over: cardOn('b2', -2, 'गाय-गौरी पूजा', { y: 300, size: 66 }) },
    b3: { set: 'diwali', cam: CAM.wide, draw: (ctx, t) => { for (let i = 0; i < 3; i++) char(ctx, i % 2 ? 'gramin2' : 'gramin', 150 + i * 210, 1090, 0.58, t, { pose: 'sit', arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); } },
    b4: { set: 'road', setOpt: { time: 'dawn' }, cam: CAM.mid, draw: (ctx, t) => { DIWA.cow(ctx, 260, 1130, 1.05, 0); char(ctx, 'bride', 560, 1150, 0.55, t, { flip: true, arms: { r: 'namaste', l: 'down' }, face: { eyes: 'calm', mouth: 'smile' } }); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('b4', 3), 22) },
    b5: { set: 'road', cam: CAM.mid, draw: (ctx, t) => { const k = H.clamp((t - at('b5', 6)) / 1.2); if (k < 1) { for (let i = 0; i < 3; i++) char(ctx, i % 2 ? 'gramin2' : 'gramin', 150 + i * 210, 1130, 0.6, t, { lean: k * 1.4, arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); } else lying(ctx, t); } },
    b6: { set: 'road', cam: [[360, 940, 1.0], [360, 940, 1.08]], shake: at('b6', 2), draw: (ctx, t) => { lying(ctx, t); herd(ctx, t, H.clamp((t - at('b6', 2)) / 3.4)); }, over: cardOn('b6', -2, 'सैकड़ों गायें', { y: 300, size: 68 }) },
    b7: { set: 'road', setOpt: { time: 'dusk' }, cam: CAM.wide, draw: (ctx, t) => { for (let i = 0; i < 4; i++) char(ctx, i % 2 ? 'gramin2' : 'gramin', 90 + i * 180, 1160, 0.52, t, { flip: i > 1, bob: Math.abs(Math.sin(t * 7 + i)) * 12, arms: i % 2 ? 'up' : 'wave', face: { eyes: 'happy', mouth: 'grin' } }); } },
    b8: { set: 'road', setOpt: { time: 'dusk' }, cam: CAM.close(), draw: (ctx, t) => char(ctx, 'gramin', 360, 1170, 0.82, t, { arms: { r: 'open', l: 'down' }, face: { eyes: 'calm', mouth: 'open' } }) },
    end: { set: 'diwali', cam: CAM.push, draw: (ctx, t) => { DIWA.cow(ctx, 240, 1100, 0.72, 0); DIWA.diya(ctx, 540, 1110, 2, t); }, over: (ctx, W, H_, t) => { MYTH.petals(ctx, W, t, at('end', -2), 34); MYTH.card(ctx, W, H_, t, at('end', -2), 'शुभ दीपावली!', { y: 300, size: 74 }); } },
  };
}, {"series": "दिवाली के रहस्य", "part": 10, "hook": "लोग ज़मीन पर लेटे...\nऊपर से सैकड़ों गायें!", "gold": ["गायें।", "गायें", "सैकड़ों", "आस्था", "ख़तरा।", "गाय-गौरी", "भिड़ावद", "दीपावली!"]});
