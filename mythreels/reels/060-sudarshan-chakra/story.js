// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const lotus = (ctx, x, y, s = 1, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s); for (let i = -2; i <= 2; i++) { ctx.save(); ctx.rotate(i * 0.4); MYTH.ell(ctx, '#ff9ac0', 0, -34, 18, 40, 0, 3); ctx.restore(); } MYTH.ell(ctx, '#f4c030', 0, 0, 12, 10, 0, 2); ctx.restore(); };
  const chakra = (ctx, x, y, r, t, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(t * 3); ctx.strokeStyle = MYTH.GOLD; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.2832); ctx.stroke(); ctx.lineWidth = 5; for (let i = 0; i < 16; i++) { ctx.rotate(0.3927); ctx.beginPath(); ctx.moveTo(r * 0.45, 0); ctx.lineTo(r * 1.18, 0); ctx.stroke(); } MYTH.ell(ctx, '#fff0a8', 0, 0, r * 0.3, r * 0.3, 0, 4); ctx.restore(); };
  const linga = (ctx, x, y, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); MYTH.ell(ctx, '#6a6a76', 0, 20, 110, 34, 0, 5); MYTH.ell(ctx, '#2a2a34', 0, -50, 52, 90, 0, 5); ctx.restore(); };

  return {
    h1: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { chakra(ctx, 360, 900, 170, t); } },
    b1: { set: 'battle', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'vishnu', 220, 1170, 0.78, t, { halo: true, arms: 'fist', face: { eyes: 'calm', mouth: 'calm' } }); char(ctx, 'asura', 560, 1170, 0.8, t, { flip: true, arms: 'up', face: { eyes: 'angry', mouth: 'shout' } }); } },
    b2: { set: 'kailash', cam: CAM.wide, draw: (ctx, t) => { linga(ctx, 470, 1130, 1.1); char(ctx, 'vishnu', 190, 1170, 0.7, t, { pose: 'sit', halo: true, arms: 'namaste', face: { eyes: 'closed', mouth: 'calm' } }); for (let i = 0; i < 6; i++) lotus(ctx, 330 + i * 28, 1040 - i * 8, 0.6); }, over: cardOn('b2', 'हज़ार', '1000 कमल', { y: 300, size: 70 }) },
    b3: { set: 'kailash', cam: CAM.mid, draw: (ctx, t) => { linga(ctx, 360, 1140, 1.4); const n = Math.floor(H.clamp((t - at('b3', 0)) / 3.5) * 8); for (let i = 0; i < n; i++) lotus(ctx, 220 + (i % 4) * 90, 1030 - Math.floor(i / 4) * 50, 0.7); } },
    b4: { set: 'kailash', cam: CAM.close(), draw: (ctx, t) => { char(ctx, 'vishnu', 360, 1170, 0.85, t, { halo: true, arms: { r: 'point', l: 'down' }, face: { eyes: 'calm', mouth: 'calm' } }); }, over: (ctx, W, H_, t) => MYTH.petals(ctx, W, t, at('b4', 6), 14) },
    b5: { set: 'space', setOpt: { sun: false }, cam: CAM.wide, shake: V('b5', 'प्रकट'), draw: (ctx, t) => { char(ctx, 'shiva', 470, 1170, 0.8, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); char(ctx, 'vishnu', 170, 1170, 0.65, t, { arms: 'namaste', face: { eyes: 'happy', mouth: 'smile' } }); const u = H.clamp((t - V('b5', 'सुदर्शन')) / 0.8); chakra(ctx, 330, 780, 90 * u, t, u); } },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'vishnu', 360, 1170, 0.85, t, { halo: true, arms: { r: 'up', l: 'down' }, hold: 'chakra', face: { eyes: 'calm', mouth: 'smile' } }); }, over: cardOn('end', 'सुदर्शन', 'सुदर्शन चक्र', { y: 300, size: 80 }) },
  };
}, {"series": "देवताओं के रूप का रहस्य", "part": 9, "hook": "एक कमल कम पड़ा...\nतो आँख चढ़ाने चले!", "next": "दुर्गा माँ के हाथों में\nकिसके हथियार?", "nextAt": "nx", "gold": ["सुदर्शन", "चक्र", "कमल", "शिव", "भक्ति", "आँख"]});
