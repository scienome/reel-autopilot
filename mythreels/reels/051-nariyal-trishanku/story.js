KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const nar = (ctx, x, y, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); MYTH.ell(ctx, '#6a4222', 0, 0, 80, 92, 0, 6); MYTH.ell(ctx, '#2a1a10', -28, -14, 11, 13, 0, 2); MYTH.ell(ctx, '#2a1a10', 28, -14, 11, 13, 0, 2); MYTH.ell(ctx, '#2a1a10', 0, 24, 12, 14, 0, 2); ctx.restore(); };
  const palm = (ctx, x, y, t, u = 1) => { ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#7a4a22'; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(24, -190 * u, 6, -380 * u); ctx.stroke(); if (u > 0.9) { ctx.strokeStyle = '#2f8a3a'; ctx.lineWidth = 14; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(6, -380); ctx.quadraticCurveTo(6 + i * 60, -430 - Math.abs(i) * -10, 6 + i * 110, -380 + Math.abs(i) * 20 + Math.sin(t * 2 + i) * 6); ctx.stroke(); } } ctx.restore(); };
  const tri = (ctx, x, y, s, t, o = {}) => char(ctx, 'indra', x, y, s, t, Object.assign({ as: 'indra', style: { cloth: '#8a2a8a', cloth2: '#f4c430' } }, o));

  return {
    h1: { set: 'forest', cam: CAM.mid, draw: (ctx, t) => { nar(ctx, 360, 900, 1.6); } },
    b1: { set: 'palace', cam: CAM.mid, draw: (ctx, t) => { tri(ctx, 360, 1170, 0.85, t, { arms: 'up', face: { eyes: 'calm', mouth: 'smile' } }); }, over: cardOn('b1', 'त्रिशंकु', 'राजा त्रिशंकु', { y: 300, size: 70 }) },
    b2: { set: 'forest', cam: CAM.wide, draw: (ctx, t) => { tri(ctx, 200, 1170, 0.7, t, { arms: 'namaste', face: { eyes: 'sad', mouth: 'calm' } }); char(ctx, 'sage', 520, 1170, 0.74, t, { flip: true, arms: { r: 'bless', l: 'down' }, face: { eyes: 'calm', mouth: 'smile' } }); }, over: cardOn('b2', 'विश्वामित्र', 'विश्वामित्र', { y: 300, size: 70 }) },
    b3: { set: 'sky', setOpt: { time: 'dusk' }, cam: [[360, 1000, 1.0], [360, 600, 1.0]], draw: (ctx, t) => { const u = H.clamp((t - at('b3', 4)) / 4); tri(ctx, 360, H.lerp(1150, 520, u), 0.5, t, { pose: 'fly', arms: 'up', face: { eyes: 'happy', mouth: 'smile' } }); } },
    b4: { set: 'sky', setOpt: { time: 'dusk' }, cam: [[360, 600, 1.0], [360, 900, 1.0]], draw: (ctx, t) => { const u = H.clamp((t - at('b4', 5)) / 3.5); tri(ctx, 360, H.lerp(420, 1000, u), 0.5, t, { pose: 'fly', lean: 3.1, arms: 'wide', face: { eyes: 'wide', mouth: 'o' } }); } },
    b5: { set: 'sky', setOpt: { time: 'dusk' }, cam: CAM.wide, shake: V('b5', 'रुको'), draw: (ctx, t) => { tri(ctx, 360, 620, 0.5, t, { pose: 'fly', lean: 3.1, arms: 'wide', face: { eyes: 'wide', mouth: 'o' } }); char(ctx, 'sage', 360, 1170, 0.6, t, { arms: 'up', face: { eyes: 'angry', mouth: 'shout' } }); } },
    b6: { set: 'forest', cam: CAM.wide, draw: (ctx, t) => { palm(ctx, 360, 1170, t, H.clamp((t - at('b6', 7)) / 1.5)); nar(ctx, 330, 800 + 320 * H.clamp((t - at('b6', 7)) / 1.5), 0.7 + 0.5 * H.clamp((t - at('b6', 7)) / 1.5)); } },
    end: { set: 'forest', cam: CAM.mid, draw: (ctx, t) => { nar(ctx, 360, 880, 1.7); }, over: cardOn('end', 'तीन', 'तीन निशान', { y: 300, size: 80 }) },
  };
}, {"series": "पूजा के पीछे की कथा", "part": 6, "hook": "नारियल को राजा का\nसिर क्यों कहते हैं?", "next": "शिवलिंग पर जल\nक्यों चढ़ाते हैं?", "nextAt": "nx", "gold": ["नारियल", "त्रिशंकु", "विश्वामित्र", "इंद्र", "स्वर्ग", "सिर"]});
