// 142 DIY (cinestory3d, diy3d.js): a bottle water filter. Scroll stopper: brown water goes in the top, clear water drips out
// the bottom, first second. Safety line: clear is not safe, boil it (CDC: rolling boil for 1 minute).
DIY(({ T, root, M, mesh, grp, tex, grab, RH, LH, seg, E, lerp, clamp, PI, glassM, liquid }) => {
  const grain = (base, dots, n = 1400, r = 2) => tex(256, 256, (c, w, h) => { c.fillStyle = base; c.fillRect(0, 0, w, h); for (let i = 0; i < n; i++) { c.fillStyle = dots[i % dots.length]; c.beginPath(); c.arc((i * 73) % w, (i * 151 + i * i) % h, r * (0.6 + (i % 3) * 0.4), 0, 7); c.fill(); } });
  const CLOTH = M('#e9e2d0', 0.9, 0, { map: grain('#e9e2d0', ['#d6cdb6'], 400, 1) }), CHAR = M('#ffffff', 0.9, 0, { map: grain('#1b1b1d', ['#333338', '#0c0c0e'], 900, 5) });
  const FINE = M('#ffffff', 0.95, 0, { map: grain('#e3c992', ['#cfb27a', '#f0dcae'], 2500, 1.2) }), COARSE = M('#ffffff', 0.95, 0, { map: grain('#c79c64', ['#a77f4c', '#e0bb85'], 900, 3) });
  const STONE = M('#8d8a86', 0.8), MUD = liquid('#6b4a25', 0.92), CLEAR = liquid('#6fc0ff', 0.6);
  // filter: bottle with its bottom cut off, upside down on a jar; layers fill from the neck up (u = 0..1 each)
  const R0 = 0.55, filt = grp(root, 0, 1.5, 0); { const pts = []; [[0.17, -0.25], [0.17, 0.1], [0.24, 0.35], [0.45, 0.6], [R0, 0.85], [R0, 3.0]].forEach(([r, y]) => pts.push(new T.Vector2(r, y)));
    mesh(filt, new T.LatheGeometry(pts, 40), glassM({ opacity: 0.22 })); }
  const layer = (m, y0, h, r = R0 - 0.03) => { const l = mesh(filt, new T.CylinderGeometry(r, r, 1, 36), m, 0, y0, 0); l.y0 = y0; l.h = h; l.set = (u) => { l.visible = u > 0.01; l.scale.y = Math.max(0.001, h * u); l.position.y = y0 + h * u / 2; }; l.set(0); return l; };
  const Lc = layer(CLOTH, 0.25, 0.35, 0.3), Lch = layer(CHAR, 0.6, 0.45), Lf = layer(FINE, 1.05, 0.55), Lco = layer(COARSE, 1.6, 0.4), Lst = grp(filt);
  for (let i = 0; i < 40; i++) { const a = i * 2.4, r = (i % 4) * 0.12; const s = mesh(Lst, new T.DodecahedronGeometry(0.1 + (i % 3) * 0.03, 0), STONE, Math.cos(a) * r, 2.06 + Math.floor(i / 8) * 0.08, Math.sin(a) * r); s.rotation.set(i, i * 2, 0); }
  const mudTop = layer(MUD, 2.4, 0.5);
  const jar = grp(root); { const pts = []; [[0, 0], [0.62, 0], [0.65, 0.05], [0.65, 1.45], [0.5, 1.55]].forEach(([r, y]) => pts.push(new T.Vector2(r, y))); mesh(jar, new T.LatheGeometry(pts, 40), glassM({ opacity: 0.2 })); }
  const jarW = mesh(jar, new T.CylinderGeometry(0.6, 0.6, 1, 36), CLEAR, 0, 0, 0); const jarFill = (u) => { jarW.visible = u > 0.01; jarW.scale.y = Math.max(0.001, 1.2 * u); jarW.position.y = 0.03 + 0.6 * u; };
  const drip = mesh(root, new T.SphereGeometry(0.06, 12, 10), CLEAR, 0, 0, 0); drip.scale.y = 1.4;
  const muddy = grp(root); { const pts = []; [[0, 0], [0.5, 0], [0.55, 1.2], [0.5, 1.25]].forEach(([r, y]) => pts.push(new T.Vector2(r, y))); mesh(muddy, new T.LatheGeometry(pts, 32), glassM({ opacity: 0.25 })); }
  const mudIn = mesh(muddy, new T.CylinderGeometry(0.5, 0.5, 1.0, 32), MUD, 0, 0.55, 0); const stream = mesh(root, new T.CylinderGeometry(0.06, 0.06, 1, 10), MUD, 0, 0, 0);
  // cutting the bottle: whole bottle + knife line; pot for boiling with bubbles and steam
  const whole = grp(root); { const pts = []; [[0, 0], [R0, 0], [R0, 2.2], [0.45, 2.45], [0.24, 2.7], [0.17, 2.95], [0.17, 3.2]].forEach(([r, y]) => pts.push(new T.Vector2(r, y))); mesh(whole, new T.LatheGeometry(pts, 40), glassM({ opacity: 0.25 })); }
  const cutLine = mesh(whole, new T.TorusGeometry(R0 + 0.01, 0.015, 6, 48), M('#d8322a', 0.4), 0, 0.5, 0); cutLine.rotation.x = PI / 2;
  const knife = grp(root); mesh(knife, new T.BoxGeometry(0.06, 0.9, 0.18), M('#d8dde4', 0.2, 1), 0, 0.45, 0); mesh(knife, new T.BoxGeometry(0.12, 0.7, 0.24), M('#222', 0.5), 0, 1.25, 0);
  const pot = grp(root); { const pts = []; [[0, 0], [1.1, 0], [1.15, 0.05], [1.15, 1.1], [1.2, 1.15]].forEach(([r, y]) => pts.push(new T.Vector2(r, y))); mesh(pot, new T.LatheGeometry(pts, 40), M('#9aa0a8', 0.3, 0.9, { side: T.DoubleSide })); }
  const potW = mesh(pot, new T.CylinderGeometry(1.1, 1.1, 0.04, 40), CLEAR, 0, 0.85, 0); const bubbles = []; for (let i = 0; i < 26; i++) bubbles.push(mesh(pot, new T.SphereGeometry(0.06 + (i % 3) * 0.03, 10, 8), M('#ffffff', 0.2, 0, { transparent: true, opacity: 0.8 }), 0, 0, 0));
  const steam = []; for (let i = 0; i < 10; i++) { const s = mesh(pot, new T.SphereGeometry(0.35, 14, 10), M('#ffffff', 1, 0, { transparent: true, opacity: 0.2, depthWrite: false }), 0, 0, 0); s.castShadow = false; steam.push(s); }
  const flame = grp(pot, 0, -0.15, 0); for (let i = 0; i < 12; i++) { const f = mesh(flame, new T.ConeGeometry(0.1, 0.35, 10), M('#3f7fff', 0.3, 0, { emissive: '#2f6fff', emissiveIntensity: 2, transparent: true, opacity: 0.85 }), Math.cos(i / 12 * PI * 2) * 0.7, -0.05, Math.sin(i / 12 * PI * 2) * 0.7); f.castShadow = false; }
  // see-inside: magnified layers with mud particles caught at each level
  const inside = grp(root, 0, 3, 0); const bands = [[CHAR, -1.2], [FINE, 0], [COARSE, 1.1]].map(([m, y]) => mesh(inside, new T.BoxGeometry(4, 1, 0.6), m, 0, y, 0));
  const parts = []; for (let i = 0; i < 40; i++) parts.push(mesh(inside, new T.SphereGeometry(0.05 + (i % 4) * 0.04, 8, 6), M('#6b4a25', 0.7), 0, 0, 0.4));
  const P = [filt, jar, drip, muddy, stream, whole, knife, pot, inside];
  const cam = (p, l, fov = 34, o = {}) => Object.assign({ pos: p, look: l, fov, focus: [0.25, 0.8], blur: 8 }, o);
  const built = (u = 1) => { filt.visible = jar.visible = true; Lc.set(1); Lch.set(1); Lf.set(1); Lco.set(1); Lst.visible = true; mudTop.set(u); };
  const dripAt = (t, on) => { drip.visible = on; const u = (t * 1.6) % 1; drip.position.set(0, lerp(1.2, 0.5, u * u), 0); };
  const shots = {
    hook: (t, k) => { built(1); jarFill(0.25 + k * 0.2); dripAt(t, true); muddy.visible = stream.visible = true; muddy.position.set(0.9, 5.0, 0); muddy.rotation.z = 2.0; stream.position.set(0.2, 4.4, 0); stream.scale.y = 1.0;
      return cam([lerp(0.7, 0.3, k), 2.9, lerp(8.6, 7.8, k)], [0.1, 2.6, 0], 36); },
    cut: (t, k) => { whole.visible = knife.visible = true; const a = t * 1.2; knife.position.set(Math.cos(a) * (R0 + 0.05), 0.5, Math.sin(a) * (R0 + 0.05)); knife.rotation.set(0, -a, 0.15);
      grab(RH, [knife.position.x, 1.75, knife.position.z], PI + 0.3, 0.6, 'hold'); grab(LH, [-0.62, 1.8, 0.1], PI - 0.5, 0.2, 'hold'); return cam([0.4, 2.6, 5.0], [0, 1.4, 0]); },
    cloth: (t, k) => { filt.visible = jar.visible = true; Lc.set(E(seg(k, 0.2, 0.8))); grab(RH, [0.05, 1.5 + 2.9 - 2.2 * E(seg(k, 0, 0.8)), 0], PI + 0.3, 0.9, 'point'); return cam([0.4, 3.6, 5.2], [0, 2.3, 0]); },
    charcoal: (t, k) => { filt.visible = jar.visible = true; Lc.set(1); Lch.set(E(k)); return cam([0.3, 3.6, 6.4], [0, 2.3, 0], 32, { focus: [0.3, 0.75], blur: 9 }); },
    sand: (t, k) => { filt.visible = jar.visible = true; Lc.set(1); Lch.set(1); Lf.set(E(seg(k, 0, 0.45))); Lco.set(E(seg(k, 0.4, 0.75))); Lst.visible = k > 0.8; return cam([0.3, 3.8, 7.0], [0, 2.7, 0], 34); },
    pour: (t, k) => { built(E(k)); muddy.visible = stream.visible = true; muddy.position.set(0.9, 5.0, 0); muddy.rotation.z = 2.0; stream.position.set(0.2, 4.4, 0); stream.scale.y = 1.0; jarFill(0.05);
      grab(RH, [1.35, 5.6, 0], -1.3, 0.3, 'hold'); return cam([0.6, 4.2, 6.0], [0.2, 3.6, 0], 36); },
    inside: (t, k) => { inside.visible = true; parts.forEach((p, i) => { const lvl = i % 3; const stopY = [1.1, 0, -1.2][lvl] + 0.55; const y = Math.max(stopY, 2.4 - ((t * 0.8 + i * 0.13) % 1) * 3); p.position.set(((i * 37) % 36) / 10 - 1.8, y, 0.4); });
      return cam([lerp(0.3, -0.3, k), 3.1, lerp(6.4, 5.6, k)], [0, 3, 0], 38, { dark: true, focus: [0.2, 0.9], blur: 4 }); },
    clear: (t, k) => { built(0.4); jarFill(0.3 + k * 0.3); dripAt(t, true); return cam([lerp(0.3, 0.1, k), 1.5, lerp(5.6, 5.0, k)], [0, 1.3, 0], 32, { focus: [0.3, 0.75], blur: 10 }); },
    boil: (t, k) => { pot.visible = true; bubbles.forEach((b, i) => { const u = (t * 1.3 + i * 0.37) % 1; b.position.set(Math.cos(i * 2.4) * (0.2 + (i % 5) * 0.17), 0.1 + u * 0.75, Math.sin(i * 2.4) * (0.2 + (i % 5) * 0.17)); });
      steam.forEach((s, i) => { const u = (t * 0.4 + i / 10) % 1; s.position.set(Math.sin(i * 1.7 + t) * 0.4, 1.0 + u * 2.2, Math.cos(i * 1.3) * 0.3); s.scale.setScalar(0.6 + u * 1.4); s.material.opacity = 0.25 * (1 - u); });
      return cam([0.4, 3.4, 4.6], [0, 1.2, 0], 34); },
    outro: (t, k) => { built(1); muddy.visible = stream.visible = true; muddy.position.set(0.9, 5.0, 0); muddy.rotation.z = 2.0; stream.position.set(0.2, 4.4, 0); stream.scale.y = 1.0; jarFill(0.25); dripAt(t, true); return cam([lerp(0.4, 0.8, k), 3.0, lerp(9.6, 10.5, k)], [0.1, 2.6, 0], 36); },
  };
  return { props: P, shots, wall: '#4c5a3a',
    over: (ctx, t, n) => { if (n !== 'boil') return; ctx.save(); ctx.font = '900 60px "Nunito", Arial, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 12; ctx.fillText('BOIL 1 MIN', 360, 260); ctx.restore(); },
    score: (kit, at) => { kit.play('pop', at('cloth', 0.8), { gain: 0.25 }); kit.play('whoosh', at('pour', 0.3), { dur: 0.8, gain: 0.18 }); kit.play('ding', at('clear', 0.5), { f: 'E6', gain: 0.3 }); } };
});
