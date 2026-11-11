// 139 DIY (cinestory3d, diy3d.js kit): a lemon battery lights an LED. Hands from the bottom of the frame, see-inside shot of
// electrons leaving the zinc, the last shot loops to the first.
DIY(({ T, root, M, mesh, grp, tex, grab, RH, LH, seg, E, lerp, PI }) => {
  const STEEL = M('#aeb4bb', 0.35, 0.9), COPPER = M('#c46a3a', 0.3, 0.9), WIRE_R = M('#d8322a', 0.5), WIRE_K = M('#1d1d1f', 0.5);
  const peel = tex(256, 256, (c, w, h) => { c.fillStyle = '#f2d230'; c.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(${180 + (i % 5) * 10},${150 + (i % 7) * 8},0,0.35)`; c.beginPath(); c.arc((i * 73) % w, (i * 151) % h, 1.5, 0, 7); c.fill(); } });
  const LEMON = M('#ffffff', 0.55, 0, { map: peel, bumpMap: peel, bumpScale: 0.02 });
  const lemon = (x) => { const g = grp(root, x, 0.62, 0); const b = mesh(g, new T.SphereGeometry(0.75, 40, 28), LEMON); b.scale.set(1.35, 0.82, 0.82);
    mesh(g, new T.ConeGeometry(0.16, 0.28, 16), LEMON, 1.08, 0, 0).rotation.z = -PI / 2; mesh(g, new T.ConeGeometry(0.1, 0.18, 12), LEMON, -1.07, 0, 0).rotation.z = PI / 2; return g; };
  const nail = (p, x) => { const g = grp(p, x, 0.5, 0.12); mesh(g, new T.CylinderGeometry(0.035, 0.035, 0.9, 12), STEEL, 0, 0, 0); mesh(g, new T.CylinderGeometry(0.1, 0.1, 0.03, 20), STEEL, 0, 0.45, 0); return g; };
  const coin = (p, x) => { const g = grp(p, x, 0.55, 0.12); const c = mesh(g, new T.CylinderGeometry(0.26, 0.26, 0.03, 32), COPPER, 0, 0, 0); c.rotation.x = PI / 2; c.rotation.z = PI / 2; return g; };
  const wire = (pts, m) => { const g = grp(root); mesh(g, new T.TubeGeometry(new T.CatmullRomCurve3(pts.map((p) => new T.Vector3(...p))), 40, 0.03, 8), m); return g; };
  // the one-lemon setup (shots take..wire) and the four-lemon chain (chain..)
  const L1 = lemon(0); const N1 = nail(L1, -0.45), C1 = coin(L1, 0.45); N1.visible = C1.visible = false;
  const loose = grp(root); const ln = nail(loose, 0); ln.position.set(-1.4, 0.04, 0.6); ln.rotation.z = PI / 2; const lc = coin(loose, 0); lc.position.set(1.4, 0.03, 0.7); lc.rotation.set(0, 0, 0); lc.children[0].rotation.set(0, 0, 0);
  const W1 = wire([[-0.45, 1.02, 0.12], [-0.6, 1.6, 0.3], [0, 1.9, 0.6], [0.6, 1.6, 0.3], [0.45, 0.85, 0.12]], WIRE_R);
  const chain = grp(root); const LS = [-3.3, -1.1, 1.1, 3.3].map((x) => { const l = lemon(0); chain.add(l); l.position.set(x, 0.62, 0); nail(l, -0.45); coin(l, 0.45); return l; });
  for (let i = 0; i < 3; i++) { const x0 = LS[i].position.x + 0.45, x1 = LS[i + 1].position.x - 0.45; chain.add(wire([[x0, 0.95, 0.12], [x0 + 0.3, 1.5, 0.2], [x1 - 0.3, 1.5, 0.2], [x1, 1.02, 0.12]], i % 2 ? WIRE_K : WIRE_R)); }
  const led = grp(root, 0, 0, 0); const LEDM = new T.MeshBasicMaterial({ color: '#7a1a14', transparent: true, opacity: 0.95, toneMapped: false }); const halo = new T.Sprite(new T.SpriteMaterial({ map: tex(128, 128, (c, w, h) => { const g = c.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,90,60,1)'); g.addColorStop(1, 'rgba(255,40,20,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); }), transparent: true, depthWrite: false, toneMapped: false })); halo.scale.set(1.4, 1.4, 1); halo.position.set(0, 2.25, 0.3);
  mesh(led, new T.CylinderGeometry(0.12, 0.12, 0.22, 20), LEDM, 0, 2.2, 0.3); mesh(led, new T.SphereGeometry(0.12, 20, 12), LEDM, 0, 2.31, 0.3);
  const glow = new T.PointLight('#ff3020', 0, 4, 2); glow.position.set(0, 2.4, 0.5); led.add(glow); led.add(halo);
  const legs = [wire([[-0.05, 2.1, 0.3], [-0.05, 1.7, 0.3], [-2.0, 1.4, 0.2], [-3.75, 1.02, 0.12]], STEEL), wire([[0.05, 2.1, 0.3], [0.05, 1.7, 0.3], [2.2, 1.4, 0.2], [3.75, 0.85, 0.12]], STEEL)]; legs.forEach((l) => led.add(l));
  // see-inside: dark cut of the lemon, zinc plate on the left, copper on the right, glowing electrons travel up and over
  const inside = grp(root, 0, 3, 0); mesh(inside, new T.BoxGeometry(5, 3, 0.4), M('#f5e27a', 0.6, 0, { transparent: true, opacity: 0.35 }), 0, 0, -0.3);
  mesh(inside, new T.BoxGeometry(0.25, 2.6, 0.5), STEEL, -1.8, 0, 0); mesh(inside, new T.BoxGeometry(0.25, 2.6, 0.5), COPPER, 1.8, 0, 0);
  const path = new T.CatmullRomCurve3([[-1.8, 1.3, 0], [-1.6, 2.6, 0.2], [0, 3.1, 0.3], [1.6, 2.6, 0.2], [1.8, 1.3, 0]].map((p) => new T.Vector3(...p)));
  mesh(inside, new T.TubeGeometry(path, 40, 0.05, 8), WIRE_R); const EL = M('#8fe8ff', 0.2, 0, { emissive: '#4fd8ff', emissiveIntensity: 2 });
  const els = []; for (let i = 0; i < 14; i++) els.push(mesh(inside, new T.SphereGeometry(0.11, 14, 10), EL));
  const ions = []; for (let i = 0; i < 10; i++) ions.push(mesh(inside, new T.SphereGeometry(0.08, 10, 8), M('#ffd23f', 0.4, 0, { emissive: '#e0a020', emissiveIntensity: 0.6 }), -1.2 + (i % 5) * 0.6, -0.9 + Math.floor(i / 5) * 0.8, 0));
  const lit = (on) => { LEDM.color.setRGB(0.48 + on * 0.52, 0.1 + on * 0.25, 0.08 + on * 0.12); halo.material.opacity = on; halo.visible = on > 0.02; glow.intensity = on * 2.5; };
  const P = [L1, loose, W1, chain, led, inside];
  const cam = (p, l, fov = 36, o = {}) => Object.assign({ pos: p, look: l, fov, focus: [0.25, 0.8], blur: 8 }, o);
  const shots = {
    hook: (t, k) => { chain.visible = led.visible = true; lit(0.6 + 0.4 * Math.sin(t * 6)); return cam([lerp(1.2, 0.4, k), 3.6, lerp(7.2, 6.4, k)], [0, 1.0, 0], 38); },
    take: (t, k) => { L1.visible = loose.visible = true; grab(RH, [1.4, 0.3, 0.7], PI + 0.35, 0.3, k > 0.5 ? 'pinch' : 'relax'); return cam([0.2, 3.0, 4.6], [0, 0.4, 0.2]); },
    roll: (t, k) => { L1.visible = true; const x = Math.sin(t * 5) * 0.5; L1.position.x = x; L1.rotation.x = 0; L1.children[0].rotation.x = x * 1.4; grab(RH, [x + 0.1, 1.15, 0.1], PI + 0.2, 0.9, 'press'); return cam([0.3, 3.0, 4.2], [0, 0.6, 0]); },
    push: (t, k, a, b) => { L1.visible = true; L1.position.x = 0; L1.children[0].rotation.x = 0; const pn = E(seg(t, a, a + (b - a) * 0.45)), pc = E(seg(t, a + (b - a) * 0.5, b));
      N1.visible = true; N1.position.y = lerp(1.3, 0.5, pn); C1.visible = pc > 0; C1.position.y = lerp(1.3, 0.55, pc);
      if (pc <= 0) grab(LH, [-0.45, N1.position.y + 0.42 + 0.62, 0.12], PI - 0.3, 0.9, 'pinch'); else grab(RH, [0.45, C1.position.y + 0.28 + 0.62, 0.12], PI + 0.3, 0.9, 'pinch');
      return cam([0.1, 2.8, 4.0], [0, 0.9, 0]); },
    inside: (t, k) => { inside.visible = true; els.forEach((e, i) => { const u = ((t * 0.35 + i / els.length) % 1); e.position.copy(path.getPointAt(u)); });
      ions.forEach((o, i) => { o.position.x = -1.2 + (i % 5) * 0.6 + Math.sin(t * 2 + i) * 0.08; }); return cam([lerp(0.4, -0.3, k), 4.6, lerp(7.5, 6.6, k)], [0, 4.3, 0], 38, { dark: true, focus: [0.2, 0.9], blur: 5 }); },
    wire: (t, k) => { L1.visible = W1.visible = N1.visible = C1.visible = true; N1.position.y = 0.5; C1.position.y = 0.55; grab(RH, [0.55, 1.0, 0.2], PI + 0.4, 0.5, 'pinch'); return cam([0.3, 3.2, 4.6], [0, 1.0, 0]); },
    chain: (t, k) => { chain.visible = true; led.visible = false; grab(RH, [lerp(2.5, 1.5, E(k)), 1.5, 0.2], PI + 0.4, 0.4, 'pinch'); return cam([lerp(1.0, 0.2, k), 4.0, 7.4], [0, 0.8, 0], 40); },
    led: (t, k) => { chain.visible = led.visible = true; lit(0); grab(RH, [0.1, 2.35, 0.3], PI + 0.3, 0.4, 'pinch'); return cam([0.6, 3.0, 3.4], [0, 2.0, 0.2], 34); },
    glow: (t, k) => { chain.visible = led.visible = true; const on = E(seg(k, 0.05, 0.25)); lit(on * (0.9 + 0.1 * Math.sin(t * 9))); return cam([lerp(0.3, 0.1, k), 2.6, lerp(2.6, 2.1, k)], [0, 2.2, 0.3], 32, { focus: [0.35, 0.65], blur: 12 }); },
    outro: (t, k) => { chain.visible = led.visible = true; lit(1); return cam([lerp(0.4, 1.2, k), 3.6, lerp(6.4, 7.2, k)], [0, 1.0, 0], 38); },
  };
  return { props: P, shots, wall: '#2f7d74',
    score: (kit, at) => { kit.play('pop', at('push', 0.5), { gain: 0.35 }); kit.play('pop', at('push', 1.6), { gain: 0.35 }); kit.play('click', at('wire', 0.8), { gain: 0.3 }); kit.play('ding', at('glow', 0.4), { f: 'E6', gain: 0.35 }); } };
});
