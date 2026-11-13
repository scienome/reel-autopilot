// motion: camera moves + living characters (kit/katha.js)
// narrator: Anuj (Cartesia), 13 Nov 2026
// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const hal = (ctx, x, y, rot = 0, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.strokeStyle = '#8a5a1a'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-120, -160); ctx.quadraticCurveTo(-100, 100, 40, 150); ctx.lineTo(120, 150); ctx.stroke(); ctx.strokeStyle = '#c8ccd4'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(40, 150); ctx.lineTo(150, 190); ctx.stroke(); ctx.restore(); };
  const river = (ctx, t, a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#3a8ad0'; ctx.fillRect(0, 980, 720, 120); ctx.strokeStyle = '#a8d8ff'; ctx.lineWidth = 6; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(i * 130 - 20, 1020); ctx.quadraticCurveTo(i * 130 + 30, 1000 + Math.sin(t * 3 + i) * 10, i * 130 + 80, 1020); ctx.stroke(); } ctx.restore(); };
  const bal = (ctx, x, y, s, t, o = {}) => char(ctx, 'bhima', x, y, s, t, Object.assign({ as: 'bhima', style: { skin: '#f2f0ea', sh: '#cfcac0', cloth: '#3a6ec0', cloth2: '#f4c430' } }, o));

  return {
    h1: { set: 'village', cam: CAM.mid, draw: (ctx, t) => { bal(ctx, 360, 1170, 0.85, t, { halo: true, arms: { r: 'up', l: 'down' }, face: { eyes: 'calm', mouth: 'calm' } }); hal(ctx, 560, 1000, 0.1, 1.1); } },
    b1: { set: 'village', cam: CAM.mid, draw: (ctx, t) => { bal(ctx, 280, 1170, 0.85, t, { arms: { r: 'point', l: 'down' }, face: { eyes: 'calm', mouth: 'calm' } }); hal(ctx, 560, 1000, 0.1, 1.2); }, over: cardOn('b1', 'हल', 'हल', { y: 300, size: 100 }) },
    b2: { set: 'river', cam: CAM.wide, draw: (ctx, t) => { bal(ctx, 250, 1170, 0.8, t, { arms: 'open', face: { eyes: 'calm', mouth: 'open' } }); river(ctx, t, 0.9); } },
    b3: { set: 'river', cam: CAM.wide, shake: V('b3', 'खींच'), draw: (ctx, t) => { bal(ctx, 250, 1170, 0.8, t, { arms: 'draw', face: { eyes: 'angry', mouth: 'calm' } }); hal(ctx, 420, 1050, -0.5, 1.0); river(ctx, t, 0.9); } },
    b4: { set: 'river', cam: CAM.wide, draw: (ctx, t) => { bal(ctx, 210, 1170, 0.8, t, { arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); char(ctx, 'sita', 520, 1170, 0.7, t, { flip: true, arms: 'namaste', style: { cloth: '#3a8ad0', cloth2: '#a8d8ff' }, face: { eyes: 'sad', mouth: 'calm' } }); }, over: cardOn('b4', 'यमुना', 'यमुना', { y: 300, size: 90 }) },
    b5: { set: 'palace', cam: CAM.wide, shake: V('b5', 'झुकने'), draw: (ctx, t) => { bal(ctx, 210, 1170, 0.75, t, { arms: 'draw', face: { eyes: 'angry', mouth: 'calm' } }); hal(ctx, 440, 1050, -0.4, 1.0); char(ctx, 'duryodhana', 590, 1170, 0.5, t, { flip: true, arms: 'namaste', face: { eyes: 'wide', mouth: 'o' } }); }, over: cardOn('b5', 'हस्तिनापुर', 'हस्तिनापुर', { y: 300, size: 70 }) },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { bal(ctx, 330, 1170, 0.85, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); hal(ctx, 560, 1000, 0.1, 1.2); } },
  };
}, {"series": "देवताओं के रूप का रहस्य", "part": 11, "hook": "हल से खींच ली\nएक पूरी नदी!", "next": "शिव के डमरू से\nनिकली एक भाषा!", "nextAt": "nx", "gold": ["बलराम", "हल", "यमुना", "हस्तिनापुर", "भागवत", "शक्ति"]});
