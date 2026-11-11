// 141 DIY (cinestory3d, diy3d.js): a phone "hologram" (Pepper's ghost pyramid). Scroll stopper: a glowing jellyfish floating
// above a phone in a dark room, first second. Ends on the same image.
DIY(({ T, root, M, mesh, grp, tex, grab, RH, LH, seg, E, lerp, clamp, PI, glassM }) => {
  const PL = glassM({ opacity: 0.28, color: '#cfe6ff', roughness: 0.02, metalness: 0.3 });
  // phone: black slab, screen = live canvas with 4 copies of a glowing jellyfish on black (the "hologram video")
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 512; const sx = cv.getContext('2d'); const scr = new T.CanvasTexture(cv);
  const jelly = (c, x, y, s, rot, t) => { c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.shadowColor = '#5ff'; c.shadowBlur = 18;
    const g = c.createRadialGradient(0, -6, 2, 0, -6, 34); g.addColorStop(0, 'rgba(220,255,255,0.95)'); g.addColorStop(1, 'rgba(60,200,255,0.2)'); c.fillStyle = g;
    c.beginPath(); c.ellipse(0, 0, 32, 24 + Math.sin(t * 3) * 3, 0, PI, 0); c.fill(); c.strokeStyle = 'rgba(150,240,255,0.8)'; c.lineWidth = 3;
    for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(i * 8, 0); for (let k = 1; k <= 6; k++) c.lineTo(i * 8 + Math.sin(t * 4 + k + i) * 4, k * 9); c.stroke(); } c.restore(); };
  const drawScreen = (t, on) => { sx.fillStyle = '#000'; sx.fillRect(0, 0, 256, 512); if (on) { jelly(sx, 128, 150, 1, PI, t); jelly(sx, 128, 362, 1, 0, t); jelly(sx, 50, 256, 1, PI / 2, t); jelly(sx, 206, 256, 1, -PI / 2, t); } scr.needsUpdate = true; };
  const phone = grp(root); mesh(phone, new T.BoxGeometry(1.5, 0.1, 3.0), M('#111216', 0.3, 0.4), 0, 0.05, 0);
  const SCR = M('#ffffff', 0.2, 0, { map: scr, emissive: '#ffffff', emissiveMap: scr, emissiveIntensity: 1.2 }); const sm = mesh(phone, new T.PlaneGeometry(1.38, 2.86), SCR, 0, 0.102, 0); sm.rotation.x = -PI / 2; sm.castShadow = false;
  // pyramid: 4 trapezoids, small end down on the screen (1 cm), big end up (6 cm), slant 3.5 cm -> scene scale 0.25 per cm
  const trap = (top, bot, h) => { const s = new T.Shape(); s.moveTo(-bot / 2, 0); s.lineTo(bot / 2, 0); s.lineTo(top / 2, h); s.lineTo(-top / 2, h); s.closePath(); return new T.ShapeGeometry(s); };
  const pyr = grp(root, 0, 0.11, 0); const a45 = Math.atan2(0.625, Math.sqrt(0.875 * 0.875 - 0.625 * 0.625));
  for (let i = 0; i < 4; i++) { const f = grp(pyr); f.rotation.y = i * PI / 2; const piece = mesh(f, trap(1.5, 0.25, 0.875), PL, 0, 0, 0.125); piece.rotation.x = -(PI / 2 - a45) + 0; piece.rotation.x = -0.79; piece.castShadow = false; }
  // the floating image inside the pyramid (what the eye sees)
  const ghost = grp(root, 0, 0.55, 0); const gm = new T.MeshBasicMaterial({ map: null, transparent: true, depthWrite: false, blending: T.AdditiveBlending });
  const gcv = document.createElement('canvas'); gcv.width = gcv.height = 256; const gx = gcv.getContext('2d'); const gt = new T.CanvasTexture(gcv); gm.map = gt;
  const gp = new T.Mesh(new T.PlaneGeometry(0.8, 0.8), gm); ghost.add(gp); const gp2 = gp.clone(); gp2.position.z = 0.01; ghost.add(gp2); const glow = new T.PointLight('#5fe0ff', 0, 3, 2); glow.position.set(0, 0.6, 0.3); ghost.add(glow);
  // CD case + template pieces
  const cd = grp(root); mesh(cd, new T.BoxGeometry(2.4, 0.2, 2.1), glassM({ opacity: 0.3 }), 0, 0.1, 0);
  const pieces = grp(root); const PP = []; for (let i = 0; i < 4; i++) { const p = mesh(pieces, trap(1.5, 0.25, 0.875), PL, -1.8 + i * 1.2, 0.02, 0); p.rotation.x = -PI / 2; p.castShadow = false; PP.push(p); }
  const ink = tex(256, 256, (c, w, h) => { c.clearRect(0, 0, w, h); c.strokeStyle = '#111'; c.lineWidth = 6; c.beginPath(); c.moveTo(28, 220); c.lineTo(228, 220); c.lineTo(145, 60); c.lineTo(111, 60); c.closePath(); c.stroke();
    c.fillStyle = '#111'; c.font = 'bold 26px Arial'; c.fillText('1 cm', 100, 50); c.fillText('6 cm', 100, 250); c.fillText('3.5', 196, 140); });
  const tmpl = mesh(root, new T.PlaneGeometry(2.0, 2.0), new T.MeshBasicMaterial({ map: ink, transparent: true }), 0, 0.205, 0); tmpl.rotation.x = -PI / 2;
  const pen = grp(root); mesh(pen, new T.CylinderGeometry(0.07, 0.07, 1.6, 16), M('#1a1a1a', 0.35)); mesh(pen, new T.ConeGeometry(0.07, 0.2, 16), M('#1a1a1a'), 0, -0.9, 0).rotation.x = PI;
  const tape = grp(root); mesh(tape, new T.TorusGeometry(0.45, 0.16, 12, 32), M('#e8e2c8', 0.6, 0, { transparent: true, opacity: 0.85 }));
  // see-inside: rays from the screen hit the slanted plastic and bounce to the eye
  const rays = grp(root, 0, 0, 0); const RAY = M('#5fe0ff', 0.3, 0, { emissive: '#5fe0ff', emissiveIntensity: 2 });
  const ray = (pts) => mesh(rays, new T.TubeGeometry(new T.CatmullRomCurve3(pts.map((p) => new T.Vector3(...p)), false, 'catmullrom', 0), 20, 0.02, 6), RAY);
  ray([[0, 0.12, 0.95], [0, 0.5, 0.55]]); ray([[0, 0.5, 0.55], [0, 0.7, 4]]); const eye = mesh(rays, new T.SphereGeometry(0.18, 20, 14), M('#ffffff', 0.3), 0, 0.72, 4.1); mesh(rays, new T.SphereGeometry(0.08, 14, 10), M('#2a5a9a', 0.3), 0, 0.72, 3.98);
  const P = [phone, pyr, ghost, cd, pieces, tmpl, pen, tape, rays];
  let dark = 0; const cam = (p, l, fov = 34, o = {}) => Object.assign({ pos: p, look: l, fov, focus: [0.25, 0.8], blur: 8 }, o);
  const show = (t, a = 1) => { phone.visible = pyr.visible = ghost.visible = true; drawScreen(t, true); gx.clearRect(0, 0, 256, 256); jelly(gx, 128, 120, 2.2, 0, t); gt.needsUpdate = true;
    gm.opacity = a; ghost.position.y = 0.6 + Math.sin(t * 1.5) * 0.04; glow.intensity = 1.5 * a; };
  const shots = {
    hook: (t, k) => { show(t); dark = 1; return cam([lerp(0.5, 0.2, k), 1.4, lerp(3.4, 2.9, k)], [0, 0.6, 0], 34, { focus: [0.3, 0.75], blur: 10 }); },
    case: (t, k) => { dark = 0; cd.visible = true; grab(RH, [1.2, 0.25, 0.4], PI + 0.4, 0.2, 'hold'); return cam([0.3, 4.2, 5.6], [0, 0.2, 0], 34); },
    draw: (t, k) => { dark = 0; cd.visible = tmpl.visible = pen.visible = true; const u = (t * 1.2) % 1; pen.position.set(lerp(-0.7, 0.7, u), 1.0, 0.65); pen.rotation.set(0, 0, 0.3); grab(RH, [lerp(-0.7, 0.7, u) + 0.25, 1.45, 0.65], PI + 0.3, 0.7, 'hold'); return cam([0.2, 3.4, 3.6], [0, 0.2, 0]); },
    cut: (t, k) => { dark = 0; pieces.visible = true; PP.forEach((p, i) => { p.visible = k > i * 0.22; }); grab(RH, [PP[3].position.x, 0.12, 0.1], PI + 0.3, 0.3, 'pinch'); return cam([0.2, 3.6, 4.4], [0, 0, 0], 38); },
    tape: (t, k) => { dark = 0; pyr.visible = tape.visible = true; pyr.position.set(0, 1.0, 0); pyr.rotation.set(PI, t * 0.3, 0); tape.position.set(1.6, 0.16, 0.8); tape.rotation.x = PI / 2; grab(LH, [-0.55, 1.2, 0.2], PI - 0.4, 0.3, 'pinch'); grab(RH, [0.55, 1.2, 0.2], PI + 0.4, 0.3, 'pinch'); return cam([0.2, 2.6, 4.0], [0, 1.0, 0]); },
    video: (t, k) => { dark = 0; phone.visible = true; drawScreen(t, true); grab(RH, [0.65, 0.2, 1.0], PI + 0.3, 0.2, 'point'); return cam([0.2, 3.0, 2.6], [0, 0.1, 0], 34); },
    place: (t, k) => { phone.visible = pyr.visible = true; drawScreen(t, true); pyr.rotation.set(0, 0, 0); pyr.position.set(0, lerp(1.2, 0.11, E(seg(k, 0, 0.5))), 0); dark = E(seg(k, 0.55, 0.9));
      if (k < 0.5) grab(RH, [0.75, pyr.position.y + 0.85, 0], -1.3, 0.3, 'pinch'); ghost.visible = k > 0.85; if (ghost.visible) show(t, seg(k, 0.85, 1)); return cam([0.4, 1.8, 3.6], [0, 0.5, 0]); },
    inside: (t, k) => { dark = 1; phone.visible = pyr.visible = rays.visible = true; drawScreen(t, true); return cam([4.2, 1.6, 2.2], [0, 0.6, 1.2], 38, { focus: [0.2, 0.9], blur: 4 }); },
    ghost: (t, k) => { show(t); dark = 1; return cam([lerp(-0.6, 0.6, k), 1.2, 2.6], [0, 0.6, 0], 32, { focus: [0.3, 0.75], blur: 10 }); },
    outro: (t, k) => { show(t); dark = 1; return cam([lerp(0.2, 0.5, k), 1.4, lerp(2.9, 3.4, k)], [0, 0.6, 0], 34, { focus: [0.3, 0.75], blur: 10 }); },
  };
  return { props: P, shots, wall: '#2b2440',
    over: (ctx, t) => { if (dark <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = `rgba(40,40,70,${0.72 * dark})`; ctx.fillRect(0, 0, 720, 1280);
      ctx.globalCompositeOperation = 'screen'; const g = ctx.createRadialGradient(360, 560, 20, 360, 560, 300); g.addColorStop(0, `rgba(80,220,255,${0.45 * dark})`); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 720, 1280); ctx.restore(); },
    score: (kit, at) => { kit.play('click', at('cut', 0.5), { gain: 0.3 }); kit.play('click', at('cut', 1.4), { gain: 0.3 }); kit.play('pop', at('place', 0.9), { gain: 0.3 }); kit.play('ding', at('place', 2.0), { f: 'E6', gain: 0.3 }); } };
});
