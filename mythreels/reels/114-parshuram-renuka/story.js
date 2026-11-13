// motion: camera moves + living characters (kit/katha.js)
// narrator: Anuj (Cartesia), 13 Nov 2026
// cinematic finish: kit/katha.js CINEMA (13 Nov 2026)
KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;
  const axe = (ctx, x, y, s = 1, rot = 0, glow = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); if (glow) { ctx.shadowColor = '#ffd23f'; ctx.shadowBlur = 30 * glow; } ctx.fillStyle = '#7a4a22'; ctx.fillRect(-8, -40, 16, 260); ctx.fillStyle = '#c8ccd4'; ctx.beginPath(); ctx.moveTo(8, -40); ctx.quadraticCurveTo(110, -60, 120, 30); ctx.quadraticCurveTo(70, 10, 8, 40); ctx.fill(); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); };
  const pr = (ctx, x, y, s, t, o = {}) => { char(ctx, 'sage', x, y, s, t, Object.assign({ as: 'sage', style: { skin: '#e8b48a', cloth: '#e86a1a', cloth2: '#f4c430', hair: '#2a1a0a' } }, o)); };
  const prAxe = (ctx, x, y, s, t, o = {}, rot = -0.3, glow = 0) => { pr(ctx, x, y, s, t, o); axe(ctx, x + 80 * s / 0.85, y - 420 * s / 0.85, 0.9 * s / 0.85, rot, glow); };
  const cow = (ctx, x, y, s, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#f4f0e8'; ctx.beginPath(); ctx.ellipse(0, -110, 140, 60, 0, 0, 7); ctx.fill(); for (const lx of [-90, -40, 50, 100]) ctx.fillRect(lx - 12, -70, 24, 70); ctx.beginPath(); ctx.ellipse(150, -150, 46, 36, 0.3, 0, 7); ctx.fill(); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(130, -180); ctx.lineTo(120, -230); ctx.lineTo(145, -185); ctx.moveTo(170, -180); ctx.lineTo(185, -230); ctx.lineTo(160, -182); ctx.fill(); ctx.shadowColor = '#ffd23f'; ctx.shadowBlur = 24; ctx.fillStyle = 'rgba(255,210,63,0.25)'; ctx.beginPath(); ctx.ellipse(0, -120, 170, 90, 0, 0, 7); ctx.fill(); ctx.restore(); };
  const ren = (ctx, x, y, s, t, o = {}) => char(ctx, 'parvati', x, y, s, t, Object.assign({ as: 'parvati', style: { cloth: '#e8384f', cloth2: '#ffd23f' } }, o));
  const jam = (ctx, x, y, s, t, o = {}) => char(ctx, 'sage', x, y, s, t, Object.assign({ as: 'sage' }, o));
  return {
    h1: { set: 'forest', setOpt: {}, cam: CAM.mid, draw: (ctx, t) => { jam(ctx, 220, 1170, 0.8, t, { arms: 'point', face: { eyes: 'angry', mouth: 'open' } }); prAxe(ctx, 500, 1170, 0.78, t, { flip: true, arms: 'down', face: { eyes: 'wide', mouth: 'o' } }, 0.2); } },
    b1: { set: 'river', cam: CAM.wide, draw: (ctx, t) => { ren(ctx, 360, 1170, 0.8, t, { hold: 'pot', arms: 'down', face: { eyes: 'calm', mouth: 'calm' } }); }, over: cardOn('b1', 1, 'रेणुका', { y: 300, size: 90 }) },
    b2: { set: 'forest', cam: CAM.push, shake: at('b2', 3), draw: (ctx, t) => { jam(ctx, 360, 1170, 0.85, t, { arms: 'point', glow: 'rgba(214,16,42,0.6)', face: { eyes: 'angry', mouth: 'open' } }); } },
    b3: { set: 'forest', cam: CAM.wide, draw: (ctx, t) => { jam(ctx, 180, 1170, 0.75, t, { arms: 'point', face: { eyes: 'angry', mouth: 'open' } }); for (let i = 0; i < 3; i++) char(ctx, 'sage', 380 + i * 110, 1170, 0.55, t, { as: 'sage', flip: true, arms: 'cover', face: { eyes: 'sad', mouth: 'frown' } }); }, over: cardOn('b3', 6, 'श्राप', { y: 300, size: 100 }) },
    b4: { set: 'forest', cam: CAM.close(360), draw: (ctx, t) => { prAxe(ctx, 360, 1170, 0.9, t, { arms: 'up', face: { eyes: 'sad', mouth: 'frown', tears: true } }, -0.5); } },
    b5: { set: 'forest', cam: CAM.wide, draw: two('sage', { as: 'sage', arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }, 'sage', { as: 'sage', style: { skin: '#e8b48a', cloth: '#e86a1a', cloth2: '#f4c430' }, arms: 'namaste', face: { eyes: 'sad', mouth: 'calm' } }), over: cardOn('b5', 3, 'वर माँगो', { y: 300, size: 90 }) },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { ren(ctx, 240, 1170, 0.8, t, { halo: true, arms: 'bless', face: { eyes: 'calm', mouth: 'smile' } }); pr(ctx, 500, 1170, 0.78, t, { flip: true, arms: 'namaste', face: { eyes: 'calm', mouth: 'smile', tears: true } }); } },
  };
}, {"series": "परशुराम की गाथा", "part": 2, "hook": "पिता का आदेश:\nअपनी माँ को मार दो", "nextAt": "nx", "gold": ["परशुराम", "रेणुका", "जमदग्नि", "वर", "आज्ञा"], "next": "एक राजा ने कामधेनु छीनी,\nऔर फरसा उठा"});
