// 143 cinestory3d (story3d.js): foxes dive into snow facing north-east (Červený 2011). Scroll stopper: a fox head-first in the snow.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const snow = k.snow();
  const fox = k.add(k.LIB.animal('fox', { h: 0.5 }), [0, 0, 0], 0.6, snow);
  const mound = k.add(new T.Mesh(new T.SphereGeometry(0.35, 20, 12, 0, PI * 2, 0, PI / 2), M('#ffffff', 0.9)), [0, -0.05, 0], 0, snow); mound.scale.set(1, 0.5, 1);
  // under the snow: a cut-away block with a mouse in its tunnel
  const cut = new T.Group(); snow.add(cut); const SN = M('#e9f1f8', 0.9, 0, { transparent: true, opacity: 0.22, depthWrite: false });
  const blk = new T.Mesh(new T.BoxGeometry(3, 1.2, 1.2), SN); blk.position.y = -0.6; cut.add(blk); const tun = new T.Mesh(new T.CylinderGeometry(0.14, 0.14, 3, 16), M('#5d7590', 0.9, 0, { transparent: true, opacity: 0.6 })); tun.rotation.z = PI / 2; tun.position.y = -0.9; cut.add(tun);
  const mouse = new T.Group(); cut.add(mouse); mouse.scale.setScalar(1.8); const MB = M('#8a7a6a', 0.8); mouse.add(new T.Mesh(new T.SphereGeometry(0.06, 14, 10), MB)); const hd = new T.Mesh(new T.SphereGeometry(0.035, 12, 8), MB); hd.position.x = 0.07; mouse.add(hd);
  const waves = []; for (let i = 0; i < 4; i++) { const w = new T.Mesh(new T.TorusGeometry(0.2, 0.012, 6, 40), M('#ffd23f', 0.3, 0, { emissive: '#ffb02e', emissiveIntensity: 2, transparent: true })); w.rotation.x = PI / 2; cut.add(w); waves.push(w); }
  // magnetic field lines over the field (see-inside shot)
  const field = new T.Group(); snow.add(field); for (let i = 0; i < 9; i++) { const l = new T.Mesh(new T.TorusGeometry(1.2 + i * 0.55, 0.025, 6, 120, PI), M('#7fe0ff', 0.3, 0, { emissive: '#5fd0ff', emissiveIntensity: 3, transparent: true, opacity: 0.9 })); l.rotation.y = PI / 4; l.position.set(0, 0, 0); field.add(l); }
  const NE = PI / 4; // the fox faces +z at rotation.y 0; north = -z here, north-east = rotation PI + PI/4... keep: dive heading
  const head = PI * 0.75; // north-east in our compass overlay
  const dive = (t, u) => { fox.rotation.order = 'YXZ'; const air = u < 0.55; const a = seg(u, 0, 0.55);
    fox.position.set(Math.sin(head) * lerp(-1.2, 0, a), air ? Math.sin(a * PI) * 1.1 : -0.32, Math.cos(head) * lerp(-1.2, 0, a)); fox.rotation.set(air ? lerp(-0.4, 1.0, a) : 1.25, head, 0); fox.pose(air ? 'jump' : 'idle', 0.35); mound.visible = !air; };
  const compass = (ctx, ang) => { ctx.save(); ctx.translate(360, 250); ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.fill(); ctx.rotate(ang); ctx.fillStyle = '#e8384f'; ctx.beginPath(); ctx.moveTo(0, -95); ctx.lineTo(16, 0); ctx.lineTo(-16, 0); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(0, 95); ctx.lineTo(16, 0); ctx.lineTo(-16, 0); ctx.fill(); ctx.restore();
    ctx.save(); ctx.font = '900 40px Nunito, Arial'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.fillText('N', 360, 120); ctx.fillText('NE', 470, 160); ctx.restore(); };
  let ov = null;
  const G0 = () => { snow.children[0].visible = true; };
  const shots = {
    hook: (t, kk) => { G0(); k.only(snow); cut.visible = field.visible = false; dive(t, 0.62); fox.position.y = -0.32 + Math.sin(t * 9) * 0.01; ov = null; return k.cam([lerp(1.6, 1.2, kk), 0.6, lerp(1.4, 1.1, kk)], [0, 0.15, 0], 36, { focus: [0.3, 0.75], blur: 8, sky: snow.sky }); },
    listen: (t, kk) => { G0(); k.only(snow); cut.visible = field.visible = false; mound.visible = false; fox.rotation.set(0, 0.6, 0); fox.position.set(0, 0, 0); fox.pose('idle', t); ov = null; return k.close(fox, { d: 1.3, side: -0.5, h: 0.9, extra: { sky: snow.sky } }); },
    under: (t, kk) => { G0(); k.only(snow); cut.visible = field.visible = false; mound.visible = false; fox.rotation.set(0, 0.6, 0); fox.position.set(0, 0, 0); fox.pose('idle', t);
      ov = (ctx) => { const y0 = 700; ctx.save(); const g = ctx.createLinearGradient(0, y0, 0, 1280); g.addColorStop(0, '#f4f8fc'); g.addColorStop(1, '#b9cde0'); ctx.fillStyle = g; ctx.fillRect(0, y0, 720, 580);
        ctx.strokeStyle = '#8fa9c2'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(720, y0); ctx.stroke(); ctx.fillStyle = '#7d93ab'; ctx.beginPath(); ctx.ellipse(360, 930, 330, 46, 0, 0, 7); ctx.fill();
        const mx = 360 + Math.sin(t * 1.4) * 200; ctx.fillStyle = '#8a7a6a'; ctx.beginPath(); ctx.ellipse(mx, 930, 40, 24, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(mx + 38, 920, 16, 0, 7); ctx.fill(); ctx.fillStyle = '#c9a99a'; ctx.beginPath(); ctx.arc(mx + 30, 902, 9, 0, 7); ctx.fill();
        ctx.strokeStyle = '#8a7a6a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(mx - 38, 936); ctx.quadraticCurveTo(mx - 70, 920, mx - 90, 940); ctx.stroke();
        for (let i = 0; i < 4; i++) { const u = (t * 0.7 + i / 4) % 1; ctx.strokeStyle = 'rgba(255,170,40,' + (1 - u) + ')'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(mx, 930, 40 + u * 300, -PI * 0.85, -PI * 0.15); ctx.stroke(); }
        ctx.fillStyle = '#5d7590'; ctx.font = '900 30px Nunito, Arial'; ctx.textAlign = 'left'; ctx.fillText('SNOW', 30, y0 + 50); ctx.restore(); };
      return k.cam([0.2, 0.9, 2.6], [0, 0.0, 0], 40, { focus: [0.1, 0.9], blur: 2, sky: snow.sky }); },
    turn: (t, kk) => { G0(); k.only(snow); cut.visible = field.visible = false; mound.visible = false; fox.position.set(0, 0, 0); fox.rotation.set(0, lerp(0.6, head, E(kk)), 0); fox.pose('walk', t * 0.5); ov = (ctx) => compass(ctx, lerp(0, PI / 4, E(kk))); return k.cam([0.3, 3.2, 0.6], [0, 0.1, 0], 40, { sky: snow.sky }); },
    jump: (t, kk) => { G0(); k.only(snow); cut.visible = field.visible = false; dive(t, Math.min(1, kk * 1.2)); ov = null; return k.cam([Math.sin(head + 1.6) * 2.4, 0.3, Math.cos(head + 1.6) * 2.4], [0, 0.4, 0], 40, { sky: snow.sky }); },
    inside: (t, kk) => { G0(); k.only(snow); cut.visible = false; field.visible = true; field.children.forEach((l, i) => { l.material.opacity = 0.5 + 0.4 * Math.sin(t * 3 - i); }); fox.position.set(0, 0, 0); fox.rotation.set(0, head, 0); fox.pose('idle', t); mound.visible = false; ov = (ctx) => k.tint(ctx, '#06122a', 0.2);
      return k.cam([lerp(3, 2, kk), 1.6, 4], [0, 0.6, 0], 42, { sky: '#16233a' }); },
    stats: (t, kk, a) => { G0(); k.only(snow); cut.visible = field.visible = false; dive(t, 0.62); ov = (ctx) => { k.card(ctx, 'NORTH-EAST: 3 in 4', { t, at: a + 0.3, y: 200, bg: '#2ecc71' }); k.card(ctx, 'OTHER WAYS: under 1 in 5', { t, at: a + 2.6, y: 330, bg: '#e8384f', size: 44 }); };
      return k.cam([1.8, 1.0, 1.8], [0, 0.1, 0], 38, { sky: snow.sky }); },
    outro: (t, kk) => { G0(); k.only(snow); cut.visible = field.visible = false; dive(t, 0.62); fox.rotation.z = Math.sin(t * 8) * 0.05; ov = null; return k.cam([lerp(1.2, 1.6, kk), 0.6, lerp(1.1, 1.4, kk)], [0, 0.15, 0], 36, { focus: [0.3, 0.75], blur: 8, sky: snow.sky }); },
  };
  return { shots, sky: snow.sky, over: (ctx) => { if (ov) ov(ctx); },
    score: (kit, at) => { kit.play('whoosh', at('jump', 0.4), { dur: 0.4, gain: 0.2 }); kit.play('pop', at('jump', 1.0), { gain: 0.3 }); kit.play('ding', at('stats', 0.3), { f: 'E6', gain: 0.3 }); } };
}, { assets: ['animals/fox', 'nature/tree_birch', 'nature/tree_oak', 'nature/rock_a', 'nature/rock_b', 'nature/rock_medium'] });
