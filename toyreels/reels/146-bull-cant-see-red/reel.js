// 146 cinestory3d (story3d.js): bulls are red-green colourblind; movement, not colour, triggers the charge. Scroll stopper: a bull charging the camera.
STORY((k) => {
  const { T, M, PI, E, seg, lerp } = k; const ar = k.arena();
  const bull = k.add(k.LIB.animal('bull', { h: 1.6 }), [0, 0, -6], 0, ar);
  const mat = k.add(k.LIB.human({ body: 'm', top: '#c9a24a', bottom: '#1d3557', shoes: '#111', hair: '#111', hairStyle: 'short' }), [0, 0, 3], PI, ar);
  const still = k.add(k.LIB.human({ body: 'm', top: '#c0392b', bottom: '#c0392b', hair: '#3b2414' }), [-2.5, 0, 2], PI, ar);
  const cape = new T.Mesh(new T.PlaneGeometry(1.1, 0.9, 12, 8), M('#d0141e', 0.6, 0, { side: T.DoubleSide })); ar.add(cape); const cp0 = cape.geometry.attributes.position.array.slice();
  const flags = ['#d0141e', '#1f5fd6', '#f4f4f4'].map((c, i) => { const g = new T.Group(); const pole = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 2.2, 8), M('#5a4a3a')); pole.position.y = 1.1; g.add(pole);
    const f = new T.Mesh(new T.PlaneGeometry(0.9, 0.6), M(c, 0.7, 0, { side: T.DoubleSide })); f.position.set(0.45, 1.9, 0); g.add(f); g.flag = f; g.position.set(-3 + i * 3, 0, 2); ar.add(g); return g; });
  const capeAt = (t, swirl) => { cape.visible = true; const hp = mat.position; cape.position.set(hp.x + 0.55, 0.9, hp.z - 0.3); cape.rotation.set(0, Math.sin(t * 2) * 0.3 * swirl, 0);
    const p = cape.geometry.attributes.position; for (let i = 0; i < p.count; i++) { const x = cp0[i * 3], y = cp0[i * 3 + 1]; p.setZ(i, Math.sin(x * 4 + t * 7) * 0.12 * swirl * (0.5 - y)); } p.needsUpdate = true; };
  const reset = () => { cape.visible = false; flags.forEach((f) => { f.visible = false; }); still.visible = false; mat.visible = true; bull.visible = true; };
  const charge = (t, u, from, to) => k.walk(bull, from, to, u, 'gallop', t);
  let ov = null; const shots = {
    hook: (t, kk) => { reset(); k.only(ar); mat.visible = false; charge(t, E(kk) * 0.9, [0, 0, -12], [0, 0, 3]); ov = (ctx) => k.vignette(ctx, 0.6); return k.cam([0.4, 0.7, 6], [0, 1.0, -2], 40, { sky: ar.sky }); },
    cape: (t, kk) => { reset(); k.only(ar); mat.pose('idle', t); capeAt(t, 1); bull.position.set(0, 0, -6); bull.rotation.y = 0; bull.pose('idle', t); return k.cam([3, 1.4, 6.5], [0, 1, 0], 40, { sky: ar.sky }); },
    eye: (t, kk) => { reset(); k.only(ar); mat.pose('idle', t); capeAt(t, 1); bull.position.set(0, 0, -2); bull.rotation.y = 0; bull.pose('idle', t);
      ov = (ctx) => { const half = 360; ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = 'hsl(0,0%,50%)'; ctx.fillRect(half, 0, 360, 1280); ctx.restore(); ctx.fillStyle = '#fff'; ctx.fillRect(357, 0, 6, 1280);
        ctx.save(); ctx.font = '900 40px Nunito, Arial'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('YOU', 180, 160); ctx.fillText('BULL', 540, 160); ctx.restore(); };
      return k.cam([0.6, 1.6, 0.4], [0.5, 1.0, 3], 46, { sky: ar.sky }); },
    test: (t, kk) => { reset(); k.only(ar); mat.visible = false; flags.forEach((f, i) => { f.visible = true; f.flag.rotation.y = Math.sin(t * (i === 1 ? 6 : 0.5)) * (i === 1 ? 0.6 : 0.05); }); charge(t, E(kk) * 0.75, [0, 0, -8], [0, 0, 1.2]); return k.cam([5, 2.2, 7], [0, 1, -1], 42, { sky: ar.sky }); },
    move: (t, kk) => { reset(); k.only(ar); mat.pose('idle', t); capeAt(t, 1.6); charge(t, 0.3 + kk * 0.5, [0, 0, -8], [0.6, 0, 3]); return k.low(mat, { d: 3.5, side: 0.7, extra: { sky: ar.sky } }); },
    still: (t, kk) => { reset(); k.only(ar); still.visible = true; still.pose('idle', 0); mat.pose('dance', t); mat.position.set(2.5, 0, 2); charge(t, E(kk) * 0.8, [0, 0, -8], [2.5, 0, 1.2]); ov = (ctx) => { k.card(ctx, 'STILL = IGNORED', { y: 200, bg: '#2ecc71', size: 40 }); };
      return k.cam([-1, 3, 9], [0.5, 0.8, -1], 42, { sky: ar.sky }); },
    why: (t, kk) => { reset(); k.only(ar); mat.pose('idle', t); capeAt(t, 0.6); bull.position.set(0, 0, -6); bull.pose('idle', t); ov = (ctx) => { k.card(ctx, 'TRADITION', { t: kk * 10, at: 0.3, y: 190, bg: '#c9a24a' }); k.card(ctx, 'HIDES BLOOD', { t: kk * 10, at: 4, y: 310, bg: '#8b0000' }); };
      return k.close(mat, { d: 2.4, side: 0.5, extra: { sky: ar.sky } }); },
    outro: (t, kk) => { reset(); k.only(ar); mat.visible = false; charge(t, E(kk) * 0.9, [0, 0, -12], [0, 0, 3]); ov = (ctx) => k.vignette(ctx, 0.6); return k.cam([0.4, 0.7, 6], [0, 1.0, -2], 40, { sky: ar.sky }); },
  };
  return { shots, lens: 28, minDist: 2.6, sky: ar.sky, over: (ctx) => { if (ov) ov(ctx); ov = null; }, score: (kit, at) => { kit.play('whoosh', at('hook', 0.2), { dur: 0.8, gain: 0.2 }); kit.play('whoosh', at('outro', 0.2), { dur: 0.8, gain: 0.2 }); } };
}, { assets: ['mini/male-a', 'mini/male-b', 'mini/male-c', 'mini/male-d', 'mini/male-e', 'mini/male-f', 'mini/female-a', 'mini/female-b', 'mini/female-c', 'mini/female-d', 'mini/female-e', 'mini/female-f', 'animals/bull', 'humans/Superhero_Male', 'humans/ual1'] });
