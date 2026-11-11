// 140 DIY (cinestory3d, diy3d.js): instant ice. Scroll stopper: a bottle of clear water turns to ice in one tap, first second.
DIY(({ T, root, M, mesh, grp, tex, grab, RH, LH, seg, E, lerp, clamp, PI, glassM, liquid }) => {
  const frost = tex(256, 256, (c, w, h) => { c.fillStyle = '#eef6fb'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(160,200,230,0.8)'; c.lineWidth = 2;
    for (let i = 0; i < 120; i++) { const x = (i * 97) % w, y = (i * 61) % h, r = 6 + (i % 5) * 4; for (let k = 0; k < 6; k++) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(k * PI / 3) * r, y + Math.sin(k * PI / 3) * r); c.stroke(); } } });
  const ICE = M('#ffffff', 0.35, 0, { map: frost, transparent: true, opacity: 0.95 }), WATER = liquid('#9fd4f0', 0.35), CAP = M('#2f7fd8', 0.4);
  // bottle: profile lathe, water core and an ice core that grows from the bottom (u 0..1)
  const bottle = (p) => { const g = grp(p); const pts = []; [[0.0, 0], [0.42, 0], [0.45, 0.05], [0.45, 1.9], [0.4, 2.15], [0.2, 2.45], [0.16, 2.6], [0.16, 2.72]].forEach(([r, y]) => pts.push(new T.Vector2(r, y)));
    mesh(g, new T.LatheGeometry(pts, 40), glassM({ opacity: 0.25 })); mesh(g, new T.CylinderGeometry(0.19, 0.19, 0.22, 24), CAP, 0, 2.8, 0);
    mesh(g, new T.TorusGeometry(0.45, 0.02, 6, 40), glassM({ opacity: 0.4 }), 0, 0.7, 0).rotation.x = PI / 2; mesh(g, new T.TorusGeometry(0.45, 0.02, 6, 40), glassM({ opacity: 0.4 }), 0, 1.3, 0).rotation.x = PI / 2;
    const lab = tex(256, 64, (c, w, h) => { c.fillStyle = '#e8f3fb'; c.fillRect(0, 0, w, h); c.fillStyle = '#2f7fd8'; c.font = 'bold 34px Arial'; c.textAlign = 'center'; c.fillText('PURE WATER', w / 2, 44); });
    const L = mesh(g, new T.CylinderGeometry(0.455, 0.455, 0.45, 40, 1, true), M('#ffffff', 0.6, 0, { map: lab, side: T.DoubleSide }), 0, 1.0, 0); L.castShadow = false; L.rotation.y = -PI / 2;
    const w = mesh(g, new T.CylinderGeometry(0.41, 0.41, 2.1, 32), WATER, 0, 1.08, 0); const ice = mesh(g, new T.CylinderGeometry(0.42, 0.42, 1, 32), ICE, 0, 0, 0);
    g.freeze = (u) => { ice.visible = u > 0.001; ice.scale.y = 2.1 * u; ice.position.y = 0.03 + 1.05 * u; w.scale.y = Math.max(0.001, 1 - u); w.position.y = 0.03 + 2.1 * u + 1.05 * (1 - u); };
    g.freeze(0); return g; };
  const B = bottle(root);
  // freezer: white box with a shelf, cold blue light, frost
  const fr = grp(root, 0, 0, -0.5); const FW = M('#f2f4f6', 0.5);
  mesh(fr, new T.BoxGeometry(6, 0.2, 4), FW, 0, 0, 0); mesh(fr, new T.BoxGeometry(6, 0.2, 4), FW, 0, 3.4, 0); mesh(fr, new T.BoxGeometry(0.2, 3.6, 4), FW, -3, 1.7, 0); mesh(fr, new T.BoxGeometry(0.2, 3.6, 4), FW, 3, 1.7, 0); mesh(fr, new T.BoxGeometry(6, 3.6, 0.2), FW, 0, 1.7, -2);
  const cold = new T.PointLight('#bfe4ff', 1.4, 9, 2); cold.position.set(0, 3, 1); fr.add(cold);
  const frB = bottle(fr); frB.rotation.z = PI / 2; frB.position.set(1.4, 0.55, 0.3);
  // inside: molecules wandering, then a crystal lattice spreading from one seed
  const inside = grp(root, 0, 3, 0); const MOL = M('#5fc8ff', 0.3, 0, { emissive: '#2a9ad8', emissiveIntensity: 0.9 }), XT = M('#ffffff', 0.2, 0, { emissive: '#bfe8ff', emissiveIntensity: 1.2 });
  const mols = []; for (let i = 0; i < 80; i++) { const m = mesh(inside, new T.SphereGeometry(0.11, 12, 8), MOL); m.home = [((i % 10) - 4.5) * 0.42, (Math.floor(i / 10) - 3.5) * 0.42, 0]; m.ph = i * 1.7; mols.push(m); }
  // pour: bowl with an ice cube, a slush tower that grows
  const pour = grp(root); const bowl = []; { const pts = []; for (let i = 0; i <= 10; i++) { const a = i / 10; pts.push(new T.Vector2(0.9 + Math.sin(a * 1.4) * 0.35, a * 0.5)); } bowl.push(mesh(pour, new T.LatheGeometry(pts, 40), M('#2c2c34', 0.3, 0, { side: T.DoubleSide }))); }
  const cube = mesh(pour, new T.BoxGeometry(0.45, 0.4, 0.45), ICE, 0, 0.25, 0); const tower = mesh(pour, new T.ConeGeometry(0.42, 1, 24), ICE, 0, 0.45, 0);
  const stream = mesh(pour, new T.CylinderGeometry(0.04, 0.05, 1, 10), WATER, 0, 1.5, 0); const PB = bottle(pour);
  const P = [B, fr, inside, pour];
  const cam = (p, l, fov = 34, o = {}) => Object.assign({ pos: p, look: l, fov, focus: [0.25, 0.8], blur: 8 }, o);
  const slam = (t, a) => { const u = seg(t, a, a + 0.25); return u < 1 ? Math.sin(u * PI) * 0.5 : 0; };
  const shots = {
    hook: (t, k, a) => { B.visible = true; B.position.set(0, slam(t, a + 0.35), 0); B.freeze(E(seg(t, a + 0.6, a + 1.6))); grab(RH, [0, 2.45 + B.position.y, 0], -1.35, 0.3, 'hold');
      return cam([lerp(0.6, 0.3, k), 1.7, 4.8], [0, 1.75, 0], 34); },
    take: (t, k) => { B.visible = true; B.position.set(0, 0, 0); B.freeze(0); grab(RH, [lerp(1.6, 0.42, E(seg(k, 0, 0.6))), 1.2, 0.1], -1.4, 0.15, k > 0.6 ? 'hold' : 'relax'); return cam([0.3, 1.8, 4.0], [0, 1.4, 0]); },
    freezer: (t, k) => { fr.visible = true; return cam([lerp(0.8, 0.3, k), 2.0, lerp(9.5, 8.5, k)], [0.4, 1.4, 0], 38); },
    out: (t, k) => { B.visible = true; B.freeze(0); B.position.set(0, lerp(0.4, 0, E(k)), 0); grab(RH, [0, 2.45 + B.position.y, 0], -1.35, 0.3, 'hold'); return cam([0.4, 1.6, 4.6], [0, 1.7, 0], 34, { focus: [0.3, 0.75], blur: 10 }); },
    inside: (t, k, a, b) => { inside.visible = true; const sp = seg(t, a + (b - a) * 0.55, b);
      mols.forEach((m, i) => { const d = Math.hypot(m.home[0], m.home[1]); const locked = sp * 3.2 > d; m.material = locked ? XT : MOL;
        const j = locked ? 0 : 0.35; m.position.set(m.home[0] + Math.sin(t * 3 + m.ph) * j, m.home[1] + Math.cos(t * 2.6 + m.ph * 1.3) * j, Math.sin(t * 2 + m.ph) * j); });
      return cam([lerp(0.3, -0.2, k), 3.4, lerp(6.4, 5.6, k)], [0, 3, 0], 38, { dark: true, focus: [0.2, 0.9], blur: 4 }); },
    tap: (t, k, a) => { B.visible = true; B.freeze(0); B.position.set(0, slam(t, a + 0.5) + (seg(t, a, a + 0.5) * 0.4) * (t < a + 0.5 ? 1 : 0), 0); grab(RH, [0, 2.45 + B.position.y, 0], -1.35, 0.3, 'hold'); return cam([0.5, 1.5, 4.6], [0, 1.7, 0], 34); },
    freeze: (t, k) => { B.visible = true; B.position.set(0, 0, 0); B.freeze(E(seg(k, 0, 0.7))); return cam([lerp(0.3, 0, k), 1.6, lerp(6.4, 5.6, k)], [0, 1.4, 0], 32, { focus: [0.3, 0.7], blur: 10 }); },
    pour: (t, k) => { pour.visible = true; const g = E(seg(k, 0.1, 1)); PB.position.set(0.15, 2.3, 0); PB.rotation.z = 2.3; PB.freeze(0); stream.position.y = 0.45 + g * 0.9 + (1.6 - g * 0.9) / 2; stream.scale.y = 1.6 - g * 0.9;
      tower.scale.set(1, 0.2 + g * 1.0, 1); tower.position.y = 0.45 + (0.2 + g) / 2; grab(RH, [0.75, 3.0, 0], -1.3, 0.2, 'hold'); return cam([0.7, 1.9, 5.6], [0.3, 1.5, 0], 34); },
    outro: (t, k, a) => { B.visible = true; B.position.set(0, 0, 0); B.freeze(E(seg(t, a + 0.3, a + 1.3))); return cam([lerp(0.3, 0.7, k), 1.8, lerp(6.0, 6.6, k)], [0, 1.45, 0], 34); },
  };
  return { props: P, shots, wall: '#24394f',
    over: (ctx, t, n, k) => { if (n !== 'freezer') return; ctx.save(); ctx.font = '900 64px "Nunito", Arial, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 12;
      const m = Math.floor(lerp(150, 0, k)); ctx.fillText(`${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}:00`, 360, 300); ctx.restore(); },
    score: (kit, at) => { kit.play('click', at('hook', 0.55), { gain: 0.5 }); kit.play('ding', at('hook', 0.9), { f: 'E6', gain: 0.3 }); kit.play('click', at('tap', 0.7), { gain: 0.5 }); kit.play('ding', at('freeze', 0.3), { f: 'C6', gain: 0.35 }); kit.play('pop', at('pour', 0.6), { gain: 0.25 }); } };
});
