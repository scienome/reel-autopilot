KATHA((h) => {
  const { V, at, char, CAM, one, two, cardOn } = h;

  const INK = '#2a1206';
  const stroke = (ctx, w = 4) => { ctx.strokeStyle = INK; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.stroke(); };
  const E = (ctx, x, y, rx, ry, col, rot = 0) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fillStyle = col; ctx.fill(); stroke(ctx); };
  const owl = (ctx, x, y, s, t) => { ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 4); ctx.scale(s, s);
    E(ctx, 0, 0, 95, 120, '#8a5a2a'); E(ctx, -70, 10, 40, 85, '#6a4220', 0.2); E(ctx, 70, 10, 40, 85, '#6a4220', -0.2); E(ctx, 0, -40, 80, 62, '#e8c890');
    [-34, 34].forEach((ex) => { E(ctx, ex, -45, 30, 30, '#ffd23f'); E(ctx, ex, -45, 14, 14 * (Math.sin(t * 1.3) > 0.97 ? 0.1 : 1), '#1a0a04'); });
    ctx.beginPath(); ctx.moveTo(-10, -22); ctx.lineTo(10, -22); ctx.lineTo(0, 2); ctx.closePath(); ctx.fillStyle = '#e8901a'; ctx.fill(); stroke(ctx, 3);
    [-1, 1].forEach((d) => { ctx.beginPath(); ctx.moveTo(d * 50, -95); ctx.lineTo(d * 78, -140); ctx.lineTo(d * 78, -85); ctx.closePath(); ctx.fillStyle = '#8a5a2a'; ctx.fill(); stroke(ctx, 3); });
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-40 + i * 20, 40 + (i % 2) * 12, 9, 0, Math.PI); stroke(ctx, 3); }
    [-30, 30].forEach((fx) => { ctx.beginPath(); ctx.moveTo(fx - 14, 120); ctx.lineTo(fx, 104); ctx.lineTo(fx + 14, 120); stroke(ctx, 6); });
    ctx.restore(); };
  const swan = (ctx, x, y, s, t) => { ctx.save(); ctx.translate(x, y + Math.sin(t * 1.6) * 5); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-150, 0); ctx.quadraticCurveTo(-120, 80, 30, 70); ctx.quadraticCurveTo(140, 60, 150, -20); ctx.quadraticCurveTo(60, 10, -150, 0); ctx.fillStyle = '#fbf8f0'; ctx.fill(); stroke(ctx);
    ctx.beginPath(); ctx.moveTo(-60, 10); ctx.quadraticCurveTo(10, -50, 90, 20); stroke(ctx, 3);
    ctx.beginPath(); ctx.moveTo(-130, 10); ctx.bezierCurveTo(-200, -60, -110, -150, -150, -200); ctx.lineWidth = 34; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 26; ctx.strokeStyle = '#fbf8f0'; ctx.stroke();
    E(ctx, -150, -205, 26, 22, '#fbf8f0'); ctx.beginPath(); ctx.moveTo(-172, -210); ctx.lineTo(-215, -198); ctx.lineTo(-170, -194); ctx.closePath(); ctx.fillStyle = '#f08a20'; ctx.fill(); stroke(ctx, 3);
    E(ctx, -150, -212, 4, 4, '#1a0a04'); ctx.strokeStyle = 'rgba(80,140,200,0.7)'; ctx.lineWidth = 4; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(0, 75 + i * 14, 170 + i * 30 + Math.sin(t * 2 + i) * 8, 10, 0, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore(); };
  const horse = (ctx, x, y, s, t, col = '#f4efe2', run = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const g = Math.sin(t * 9) * 0.5 * run;
    [[-60, g], [-35, -g], [50, -g], [75, g]].forEach(([lx, a]) => { ctx.save(); ctx.translate(lx, 20); ctx.rotate(a); ctx.fillStyle = col; ctx.fillRect(-9, 0, 18, 90); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(-9, 0, 18, 90); ctx.restore(); });
    E(ctx, 0, 0, 105, 48, col); ctx.beginPath(); ctx.moveTo(70, -20); ctx.lineTo(120, -110); ctx.lineTo(170, -95); ctx.lineTo(175, -70); ctx.lineTo(125, -60); ctx.lineTo(100, 10); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); stroke(ctx);
    ctx.beginPath(); ctx.moveTo(78, -30); ctx.quadraticCurveTo(95, -100, 120, -112); ctx.lineWidth = 14; ctx.strokeStyle = '#c8402a'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-100, -10); ctx.quadraticCurveTo(-150, 0, -140, 70); ctx.lineWidth = 12; ctx.strokeStyle = '#c8402a'; ctx.stroke(); E(ctx, 148, -92, 4, 4, '#1a0a04');
    ctx.restore(); };
  const dog = (ctx, x, y, s, t, col = '#c8a070') => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    [-35, -15, 25, 45].forEach((lx) => { ctx.fillStyle = col; ctx.fillRect(lx - 7, 10, 14, 50); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(lx - 7, 10, 14, 50); });
    E(ctx, 0, 0, 62, 30, col); E(ctx, 62, -38, 30, 26, col); E(ctx, 88, -32, 16, 11, col); E(ctx, 100, -34, 5, 5, '#1a0a04'); E(ctx, 50, -55, 10, 22, '#8a5a30', 0.4); E(ctx, 66, -44, 4, 4, '#1a0a04');
    ctx.save(); ctx.translate(-58, -10); ctx.rotate(-0.8 + Math.sin(t * 8) * 0.4); ctx.fillStyle = col; ctx.fillRect(-4, -36, 9, 36); ctx.restore(); ctx.restore(); };
  const bear = (ctx, x, y, s, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const b = Math.sin(t * 3) * 6;
    E(ctx, 0, 0, 120, 150, '#3a2a22'); E(ctx, 0, -190 + b, 80, 70, '#3a2a22'); E(ctx, -60, -245 + b, 22, 22, '#3a2a22'); E(ctx, 60, -245 + b, 22, 22, '#3a2a22'); E(ctx, 0, -165 + b, 38, 28, '#8a6a52'); E(ctx, 0, -180 + b, 12, 9, '#120804');
    E(ctx, -30, -205 + b, 7, 7, '#ffd23f'); E(ctx, 30, -205 + b, 7, 7, '#ffd23f'); E(ctx, -120, -40, 34, 90, '#3a2a22', 0.4); E(ctx, 120, -40, 34, 90, '#3a2a22', -0.4); ctx.restore(); };
  const palki = (ctx, x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#7a3a14'; ctx.fillRect(-240, -10, 480, 16); ctx.fillStyle = '#c8402a'; ctx.fillRect(-110, -150, 220, 140); ctx.strokeStyle = '#e2a83a'; ctx.lineWidth = 6; ctx.strokeRect(-110, -150, 220, 140);
    ctx.beginPath(); ctx.moveTo(-130, -150); ctx.quadraticCurveTo(0, -230, 130, -150); ctx.closePath(); ctx.fillStyle = '#e2a83a'; ctx.fill(); stroke(ctx); ctx.restore(); };
  const temple = (ctx, x, y, s, col = '#e8d8b8') => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = col; ctx.fillRect(-120, -160, 240, 160); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.strokeRect(-120, -160, 240, 160);
    ctx.beginPath(); ctx.moveTo(-100, -160); ctx.quadraticCurveTo(-80, -360, 0, -420); ctx.quadraticCurveTo(80, -360, 100, -160); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); stroke(ctx, 5);
    for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-100 + i * 6, -160 - i * 45); ctx.lineTo(100 - i * 6, -160 - i * 45); stroke(ctx, 3); }
    ctx.fillStyle = '#5a2a10'; ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(-40, -90); ctx.quadraticCurveTo(0, -130, 40, -90); ctx.lineTo(40, 0); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, -420); ctx.lineTo(0, -480); stroke(ctx, 4); ctx.beginPath(); ctx.moveTo(0, -480); ctx.lineTo(50, -465); ctx.lineTo(0, -450); ctx.fillStyle = '#e8601a'; ctx.fill(); ctx.restore(); };
  const linga = (ctx, x, y, s, col = '#3a3a44', glow = 0) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (glow) { ctx.shadowColor = '#ffd23f'; ctx.shadowBlur = 40 * glow; }
    ctx.beginPath(); ctx.ellipse(0, 0, 120, 26, 0, 0, Math.PI * 2); ctx.fillStyle = '#5a5a64'; ctx.fill(); stroke(ctx); ctx.beginPath(); ctx.moveTo(-55, 0); ctx.lineTo(-55, -120); ctx.quadraticCurveTo(0, -190, 55, -120); ctx.lineTo(55, 0); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); stroke(ctx);
    ctx.strokeStyle = '#f4f0e8'; ctx.lineWidth = 6; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-40, -80 - i * 14); ctx.lineTo(40, -80 - i * 14); ctx.stroke(); } ctx.restore(); };
  const gem = (ctx, x, y, s, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.shadowColor = '#ffd23f'; ctx.shadowBlur = 30 + Math.sin(t * 4) * 15; ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(34, -10); ctx.lineTo(0, 44); ctx.lineTo(-34, -10); ctx.closePath(); ctx.fillStyle = '#ff4a5a'; ctx.fill(); stroke(ctx, 3); ctx.restore(); };
  const brick = (ctx, x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#b8542a'; ctx.fillRect(-90, -30, 180, 40); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.strokeRect(-90, -30, 180, 40); ctx.restore(); };
  const cave = (ctx, k = 1) => { ctx.save(); ctx.fillStyle = `rgba(10,4,2,${0.55 * k})`; ctx.fillRect(0, 0, 720, 1280); const g = ctx.createRadialGradient(360, 900, 60, 360, 900, 520); g.addColorStop(0, 'rgba(255,190,110,0.35)'); g.addColorStop(1, 'rgba(255,190,110,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 720, 1280); ctx.restore(); };
  const glowAt = (ctx, x, y, r, col = 'rgba(255,214,120,0.55)') => { const g = ctx.createRadialGradient(x, y, 10, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(255,214,120,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); };

  return {
    h1: { set: 'forest', cam: CAM.push, shake: at('h1', 4), draw: (ctx, t) => { char(ctx, 'prince', 360, 1170, 0.85, t, { arms: 'up', face: { eyes: 'wide', mouth: 'o' }, as: 'kach', glow: 'rgba(120,255,160,0.7)', style: { cloth: '#f4f0e8', cloth2: '#f4c430' } }); } },
    b1: { set: 'forest', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'amba', 210, 1170, 0.72, t, { arms: 'cover', face: { eyes: 'closed', mouth: 'frown', tears: true }, as: 'devyani', style: { cloth: '#ff8ac0', cloth2: '#e2a83a' } }); char(ctx, 'sage', 510, 1170, 0.72, t, { arms: 'belly', face: { eyes: 'wide', mouth: 'o' }, flip: true, as: 'sage', style: { cloth: '#f4f0e8', cloth2: '#e86a1a' } }); } },
    b2: { set: 'forest', cam: CAM.close(480), draw: (ctx, t) => { char(ctx, 'sage', 480, 1170, 0.9, t, { arms: 'belly', face: { eyes: 'sad', mouth: 'frown' }, as: 'sage', style: { cloth: '#f4f0e8', cloth2: '#e86a1a' } }); } },
    b3: { set: 'forest', cam: CAM.mid, draw: (ctx, t) => { glowAt(ctx, 360, 900, 260, 'rgba(120,255,160,0.5)'); char(ctx, 'prince', 210, 1170, 0.72, t, { arms: 'bless', face: { eyes: 'calm', mouth: 'calm' }, as: 'kach', style: { cloth: '#f4f0e8', cloth2: '#f4c430' } }); char(ctx, 'sage', 510, 1170, 0.72, t, { arms: 'down', face: { eyes: 'closed', mouth: 'calm' }, flip: true, as: 'sage', style: { cloth: '#f4f0e8', cloth2: '#e86a1a' } }); }, over: (ctx, W, H_, t) => { cardOn('b3', 9, 'संजीवनी', { y: 300, size: 84 })(ctx, W, H_, t); } },
    b4: { set: 'river', cam: CAM.wide, draw: (ctx, t) => { char(ctx, 'amba', 210, 1170, 0.72, t, { arms: 'open', face: { eyes: 'happy', mouth: 'smile' }, as: 'devyani', style: { cloth: '#ff8ac0', cloth2: '#e2a83a' } }); char(ctx, 'prince', 510, 1170, 0.72, t, { arms: 'namaste', face: { eyes: 'calm', mouth: 'calm' }, flip: true, as: 'kach', style: { cloth: '#f4f0e8', cloth2: '#f4c430' } }); } },
    b5: { set: 'river', cam: CAM.push, shake: at('b5', 12), draw: (ctx, t) => { char(ctx, 'amba', 360, 1170, 0.85, t, { arms: 'point', face: { eyes: 'angry', mouth: 'shout' }, as: 'devyani', glow: 'rgba(255,200,80,0.75)', style: { cloth: '#ff8ac0', cloth2: '#e2a83a' } }); }, over: (ctx, W, H_, t) => { cardOn('b5', 12, 'श्राप!', { y: 300, size: 100 })(ctx, W, H_, t); } },
    end: { set: 'heaven', cam: CAM.mid, draw: (ctx, t) => { char(ctx, 'prince', 360, 1170, 0.85, t, { arms: 'bless', face: { eyes: 'happy', mouth: 'smile' }, as: 'kach', halo: true, style: { cloth: '#f4f0e8', cloth2: '#f4c430' } }); } },
  };
}, {"series": "रावण से पहले: असुरों के रहस्य", "part": 5, "hook": "गुरु के पेट से\nजिंदा निकला शिष्य!", "nextAt": "nx", "gold": ["कच", "देवयानी", "शुक्राचार्य", "संजीवनी", "श्राप"], "next": "एक असुर,\nजो दो ग्रह बन गया"});
