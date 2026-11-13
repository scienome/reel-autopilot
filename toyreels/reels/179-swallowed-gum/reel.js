// re-render: character flicker fix (13 Nov 2026)
// 179 cinestory3d (story3d.js): swallowed gum passes in days (Mayo Clinic; Milov 1998). Scroll stopper: a pink gum ball sitting in a stomach with a 7-YEAR countdown.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const rm = k.LIB.place.room({ wall: '#cfe0ea' }); k.place(rm);
  const kid = k.add(k.LIB.human({ body: 'm', top: '#ffb21a', bottom: '#2f6fd8', hair: '#3b2414', h: 1.3 }), [0, 0, 0], 0, rm);
  const mum = k.add(k.LIB.human({ body: 'f', top: '#7a3a5a', bottom: '#2a2a30', hair: '#1a1210', hairStyle: 'bun' }), [1.0, 0, -0.4], -0.8, rm);
  let ov = null; const gut = (ctx, t, mode, u = 0) => { ctx.save(); ctx.fillStyle = 'rgba(8,16,32,0.86)'; ctx.beginPath(); ctx.roundRect(60, 230, 600, 860, 30); ctx.fill(); ctx.strokeStyle = '#ff9aa8'; ctx.lineWidth = 26; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(360, 260); ctx.lineTo(360, 420); ctx.stroke(); ctx.fillStyle = 'rgba(255,140,150,0.6)'; ctx.beginPath(); ctx.ellipse(400, 500, 130, 90, -0.3, 0, 7); ctx.fill();
    ctx.beginPath(); for (let i = 0; i <= 60; i++) { const s = i / 60; const x = 360 + Math.sin(s * 18) * 170 * (1 - s * 0.2), y = 620 + s * 380; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); } ctx.stroke();
    const P = (s) => s < 0.25 ? [360 + Math.sin(s * 4 * PI) * 0, 260 + s * 4 * 220] : (() => { const q = (s - 0.25) / 0.75; return [360 + Math.sin(q * 18) * 170 * (1 - q * 0.2), 620 + q * 380]; })();
    const [gx, gy] = mode === 'stuck' ? [420, 500] : P(u); ctx.fillStyle = '#ff5fa8'; ctx.beginPath(); ctx.arc(gx, gy, 22, 0, 7); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); };
  const base = () => { k.only(rm); mum.visible = true; kid.position.set(0, 0, 0); kid.rotation.y = 0.4; };
  const shots = {
    hook: (t, kk) => { base(); kid.pose('idle', t); mum.visible = false; ov = (ctx) => { gut(ctx, t, 'stuck'); k.counter(ctx, 'STUCK FOR', `${(7 - kk * 0.01).toFixed(2)} YEARS?`, { y: 170 }); }; return k.close(kid, { d: 2.2, side: 0.3 }); },
    kid: (t, kk) => { base(); kid.pose('idle', t); mum.pose('talk', t); ov = (ctx) => k.card(ctx, '"DON\'T SWALLOW YOUR GUM!"', { y: 200, bg: '#7a3ad8', size: 36 }); return k.cam([1.4, 1.4, 3.6], [0.4, 1.0, -0.2], 40); },
    base: (t, kk) => { base(); kid.pose('idle', t); mum.visible = false; ov = (ctx) => { gut(ctx, t, 'stuck'); k.card(ctx, 'GUM BASE: NOT DIGESTED', { y: 1150, bg: '#c8501e', size: 36 }); }; return k.close(kid, { d: 2.2, side: 0.3 }); },
    inside: (t, kk) => { base(); kid.pose('idle', t); mum.visible = false; ov = (ctx) => gut(ctx, t, 'move', kk * 0.6); return k.close(kid, { d: 2.2, side: 0.3 }); },
    days: (t, kk) => { base(); kid.pose('idle', t); mum.visible = false; ov = (ctx) => { gut(ctx, t, 'move', 0.6 + kk * 0.4); k.counter(ctx, 'GONE IN', 'A FEW DAYS', { y: 170 }); }; return k.close(kid, { d: 2.2, side: 0.3 }); },
    lots: (t, kk) => { base(); kid.pose('idle', t); mum.pose('talk', t); ov = (ctx) => k.card(ctx, 'LOTS, OFTEN = RARE BLOCKAGE', { y: 200, bg: '#e8384f', size: 34 }); return k.cam([1.4, 1.4, 3.6], [0.4, 1.0, -0.2], 40); },
    outro: (t, kk) => { base(); kid.pose('dance', t); mum.pose('idle', t); ov = (ctx) => k.big(ctx, 'GONE BY THE WEEKEND.', { y: 240, size: 52, col: '#ffd23f' }); return k.cam([1.4, 1.4, 3.6], [0.2, 0.9, -0.2], 40); },
  };
  return { shots, lens: 28, minDist: 2.6, sky: '#cfe0ea', over: (ctx) => { if (ov) ov(ctx); ov = null; } };
}, { assets: ['mini/male-a', 'mini/male-b', 'mini/male-c', 'mini/male-d', 'mini/male-e', 'mini/male-f', 'mini/female-a', 'mini/female-b', 'mini/female-c', 'mini/female-d', 'mini/female-e', 'mini/female-f', 'humans/Superhero_Male', 'humans/Superhero_Female', 'humans/ual1'] });
