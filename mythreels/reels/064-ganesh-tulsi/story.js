// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const tul = (ctx, x, y, s, t, o = {}) => char(ctx, 'sita', x, y, s, t, Object.assign({ as: 'sita', style: { cloth: '#2f8a4a', cloth2: '#f0d070' } }, o));
  const leaf = (ctx, x, y, s = 1, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s); for (let i = 0; i < 5; i++) MYTH.ell(ctx, '#3aa04a', (i - 2) * 30, -Math.abs(i - 2) * 10, 22, 12, (i - 2) * 0.25, 3); ctx.restore(); };

  return {
    h1: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'ganesha', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'calm' } }); leaf(ctx, 360, 640, 2.2); } },
    b1: { set: 'river', cam: CAM.wide, draw: (ctx, t) => { tul(ctx, 360, 1170, 0.78, t, { arms: 'down', face: { eyes: 'calm', mouth: 'smile' } }); }, over: cardOn('b1', 'गंगा', 'गंगा किनारा', { y: 300, size: 70 }) },
    b2: { set: 'river', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'ganesha', 470, 1170, 0.7, t, { pose: 'sit', halo: true, arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); tul(ctx, 170, 1170, 0.7, t, { arms: 'chin', face: { eyes: 'happy', mouth: 'smile' } }); } },
    b3: { set: 'river', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'ganesha', 480, 1170, 0.72, t, { flip: true, halo: true, arms: 'bless', face: { eyes: 'wide', mouth: 'o' } }); tul(ctx, 190, 1170, 0.72, t, { arms: 'open', face: { eyes: 'calm', mouth: 'open' } }); } },
    b4: { set: 'river', cam: CAM.close(), draw: (ctx, t) => { char(ctx, 'ganesha', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'open' } }); } },
    b5: { set: 'river', cam: CAM.close(), shake: V('b5', 'श्राप'), draw: (ctx, t) => { tul(ctx, 360, 1170, 0.85, t, { arms: { r: 'point', l: 'fist' }, face: { eyes: 'angry', mouth: 'shout' } }); } },
    b6: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'ganesha', 360, 1170, 0.85, t, { halo: true, arms: { r: 'point', l: 'down' }, face: { eyes: 'calm', mouth: 'calm' } }); } },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'ganesha', 360, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); leaf(ctx, 360, 640, 2.2); }, over: (ctx, W, H_, t) => { const u = H.clamp((t - V('end', 'नहीं')) / 0.3); if (u > 0) { ctx.save(); ctx.strokeStyle = '#e8384f'; ctx.lineWidth = 16; ctx.globalAlpha = u; ctx.beginPath(); ctx.arc(360, 480, 150, 0, 6.2832); ctx.moveTo(254, 374); ctx.lineTo(466, 586); ctx.stroke(); ctx.restore(); } } },
  };
}, {"series": "पूजा के पीछे की कथा", "part": 10, "hook": "हर पूजा में तुलसी...\nबस यहाँ मना है!", "next": "गणेश जी को दूर्वा\nक्यों चढ़ती है?", "nextAt": "nx", "gold": ["तुलसी", "गणेश", "श्राप", "ब्रह्मचारी", "विवाह", "गंगा"]});
