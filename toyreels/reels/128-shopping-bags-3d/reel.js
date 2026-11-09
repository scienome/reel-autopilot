// 3D toy reel: shopping bags. Fix chain: double bag -> too heavy -> trolley -> stairs -> tank tracks -> stairs collapse -> crane -> wind -> window.
(() => {
  const Y = D.toy.world({}), T = D.THREE, F = Y.flats, [sx, sz] = F.foot, lerp = D.lerp;
  const you = Y.person({ shirt: '#3a78d8' }), nb = Y.person({ shirt: '#5aa04a', pants: '#5a4634', hairColor: '#a0a0a0', mood: 'glare' });
  const handBags = [0, 1].map((i) => [0, 1, 2].map((k) => Y.bag(you.hand(i), 0, -0.98, -k * 0.24, 0.9)));
  const crumbs = Y.debris(7, Y.ITEM, 0.2, { round: true });
  // trolley: basket, handle, wheels that pop on one by one, tank tracks that drop on later
  const trolley = Y.grp(null), body = Y.grp(trolley), blue = Y.m('#3f7fe0', { r: 0.5 }), steel = Y.m('#c4c8d0', { m: 0.7, r: 0.3 });
  Y.box(body, 1.5, 0.08, 0.9, blue, 0, 0.55, 0); for (const d of [-1, 1]) { Y.box(body, 1.5, 0.55, 0.06, blue, 0, 0.82, d * 0.42); Y.box(body, 0.06, 0.55, 0.9, blue, d * 0.72, 0.82, 0); }
  [-0.4, 0.4].forEach((z) => Y.box(body, 0.06, 0.9, 0.06, steel, -0.85, 1.2, z)); Y.box(body, 0.06, 0.06, 0.86, steel, -0.85, 1.62, 0);
  const tBags = [-0.4, 0.05, 0.45].map((x) => Y.bag(body, x, 1.0, 0, 0.95, true));
  const wheels = []; for (const a of [-1, 1]) for (const d of [-1, 1]) { const w = Y.mesh(trolley, new T.CylinderGeometry(0.22, 0.22, 0.12, 18), '#25252b', a * 0.55, 0.22, d * 0.4); w.home = [a * 0.55, 0.22, d * 0.4]; wheels.push(w); }
  const tracks = [-1, 1].map((d) => { const tr = Y.grp(trolley, 0, 0, d * 0.42); Y.box(tr, 1.7, 0.42, 0.2, '#34343c', 0, 0.24, 0); tr.cleats = Array.from({ length: 7 }, (_, i) => Y.box(tr, 0.1, 0.46, 0.22, Y.GOLD, -0.75 + i * 0.25, 0.24, 0)); return tr; });
  // crane on your balcony
  const crane = Y.grp(F.g, 3.6, 3.55, 3.6), pole = Y.box(crane, 0.2, 3.2, 0.2, '#f2c230', 0, 1.6, 0), armG = Y.grp(crane, 0, 3.15, 0);
  Y.box(armG, 4.2, 0.18, 0.18, '#f2c230', 2.0, 0, 0); const rope = Y.box(armG, 0.03, 1, 0.03, '#2a2a2a', 3.9, -0.5, 0), hook = Y.grp(armG, 3.9, -2, 0);
  Y.box(hook, 1.1, 0.08, 0.7, '#9a7048', 0, 0, 0); [-0.28, 0.28].forEach((x) => Y.bag(hook, x, 0.36, 0, 0.9, true));
  const shards = Y.debris(14, [Y.m('#cfe9ff', { tr: true, op: 0.8, r: 0.1 })], 0.16, { flat: true });
  const bags = (n, dbl) => handBags.forEach((arr) => arr.forEach((g, k) => { g.visible = k < n; g.outer.visible = dbl; }));
  const rip = (S) => S.line('hook', 0) + 1.3;
  const crash = (S) => S.line('b6', 1) + 0.4, hit = (S) => S.line('b8', 1) + 0.35;
  const broken = () => F.steps.forEach((s, i) => { s.position.set(s.home.x + (i % 2 ? 0.3 : -0.2), 0.12, s.home.z + (i % 3 - 1) * 0.6); s.rotation.set(i % 2 ? 0.8 : -0.6, 0, i % 2 ? -0.5 : 0.7); });
  const push = (x, z, ph) => { trolley.position.set(x, 0.12, z); you.position.set(x - 1.5, 0.12, z); you.rotation.y = Math.PI / 2; you.arms(-1.25, -1.25, 0.05); you.walk(ph, 1); bags(0); };

  D.toy.reel({
    order: ['hook', 'fix', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'twist', 'close'],
    reset(S) {
      bags(1, false); handBags.forEach((arr) => arr.forEach((g) => g.position.y = -0.98)); Y.fly(crumbs, [0, 0, 0], 0); Y.fly(shards, [0, 0, 0], 0);
      trolley.visible = false; trolley.rotation.set(0, 0, 0); body.position.y = 0; tBags.forEach((g) => { g.visible = true; g.position.y = 1.0; });
      wheels.forEach((w) => { w.visible = true; w.position.set(...w.home); w.rotation.set(Math.PI / 2, 0, 0); }); tracks.forEach((tr) => { tr.visible = false; tr.position.y = 0; });
      crane.visible = false; nb.visible = false; you.position.set(0.5, 0.12, 0.6);
    },
    shots: {
      hook(S) { const x = lerp(-3.5, 0.5, S.p), r = rip(S); you.position.x = x; you.rotation.y = 0.95; you.walk(S.t * 7, S.t < r ? 1 : 0.2); you.arms(Math.sin(S.t * 7) * 0.15, -Math.sin(S.t * 7) * 0.15); you.setMood(S.t < r ? 'calm' : 'shock');
        if (S.t > r) { handBags[0][0].visible = false; Y.fly(crumbs, [x - 0.4, 0.9, 0.7], S.t - r, 0.8, 0.24); }
        return { pos: [lerp(4.5, 3.5, S.e), 3.0, 11], look: [lerp(-1.4, 0.3, S.e), 1.3, 0.4], fov: 36, focus: [0.45, 0.85], blur: 5 }; },
      fix(S) { you.rotation.y = 0.15; you.arms(0, -1.0 * S.E(S.seg(S.a, S.a + 0.4))); you.hand(1).rotation.z = 0.5; return { pos: [1.2, 2.2, lerp(6.2, 5.2, S.e)], look: [0.5, 1.7, 0.6], fov: 30, focus: [0.25, 0.75] }; },
      b1(S) { you.rotation.y = 0.3; you.arms(-0.5, -0.5, 0.2); const k = S.E(S.seg(S.at(1) - 0.2, S.at(1) + 0.6));
        handBags.forEach((arr) => { const o = arr[0].outer; o.visible = true; o.position.y = lerp(-1.2, -0.01, k); o.scale.y = lerp(0.2, 1, k); });
        const r = lerp(-0.6, 0.6, S.e); return { pos: [0.5 + Math.sin(r) * 5.5, 2.3, 0.6 + Math.cos(r) * 5.5], look: [0.5, 1.2, 0.6], fov: 34, focus: [0.4, 0.85], blur: 5 }; },
      b2(S) { you.rotation.y = 0.2; const heavy = S.t > S.at(1), k = heavy ? S.E(S.seg(S.at(1), S.at(1) + 0.4)) : 0; bags(3, true); handBags.forEach((arr) => arr.forEach((g, i) => g.position.z = -i * 0.24));
        you.arms(0, 0, heavy ? 0.04 : 0.3); you.setMood(heavy ? 'shock' : 'calm'); you.sag(k);
        return { pos: [2.6, 1.0, 7.6], look: [0.5, 1.3, 0.6], fov: 36, shake: heavy ? 0.3 * (1 - S.seg(S.at(1), S.at(1) + 1.2)) : 0 }; },
      b3(S) { trolley.visible = true; const bld = (k0) => S.E(S.seg(S.a + k0, S.a + k0 + 0.35)), roll = S.seg(S.at(1) + 0.6, S.b), tx = lerp(1.2, 6.5, S.E(roll));
        trolley.position.set(tx, 0.12, 0.6); body.position.y = lerp(3, 0, bld(0)); wheels.forEach((w, i) => { w.position.y = lerp(2.4, w.home[1], bld(0.4 + i * 0.18)); w.rotation.z = -tx / 0.22; });
        tBags.forEach((g, i) => { const t0 = S.at(1) - 0.2 + i * 0.15; g.visible = S.t > t0; g.position.y = lerp(2.6, 1.0, S.E(S.seg(t0, t0 + 0.35))); });
        you.position.set(tx - 1.5, 0.12, 0.6); you.rotation.y = Math.PI / 2; you.arms(-1.25, -1.25, 0.05); you.walk(tx * 3.2, roll > 0 && roll < 1 ? 1 : 0); bags(0);
        return { pos: [lerp(1.0, 5.5, S.E(roll)), 3.4, 12], look: [lerp(0.5, 5.0, S.E(roll)), 1.0, 0.6], fov: 36, focus: [0.45, 0.85], blur: 5 }; },
      b4(S) { trolley.visible = true; const k = S.E(S.seg(S.a, S.a + 1.6)), tx = lerp(sx - 6, sx - 1.6, k); push(tx, sz, tx * 3.2); you.walk(tx * 3.2, k < 1 ? 1 : 0); wheels.forEach((w) => { w.rotation.z = -tx / 0.22; });
        you.setMood(S.t > S.at(1) ? 'shock' : 'calm'); const up = S.E(S.seg(S.at(1) - 0.2, S.b));
        return { pos: [sx - 7.5, lerp(3.0, 5.0, up), sz + 12.5], look: [lerp(sx - 2.5, sx + 2.5, up), lerp(1.2, 3.6, up), sz], fov: 40, focus: [0.3, 0.85] }; },
      b5(S) { trolley.visible = true; const tx = sx - 1.6; trolley.position.set(tx, 0.12, sz); you.position.set(tx - 2.3, 0.12, sz - 0.3); you.rotation.y = Math.PI / 2; you.arms(-1.0, -1.0, 0.1); bags(0);
        wheels.forEach((w, i) => { const k = S.E(S.seg(S.a + i * 0.12, S.a + 0.5 + i * 0.12)); w.position.set(w.home[0] * (1 + k * 2), w.home[1] + Math.sin(k * 3.14) * 0.8, w.home[2] * (1 + k)); w.visible = k < 0.98; });
        const tk = S.E(S.seg(S.at(1), S.at(1) + 0.6)); tracks.forEach((tr) => { tr.visible = S.t > S.at(1); tr.position.y = lerp(1.6, 0, tk); });
        return { pos: [tx + 4.2, 2.0, sz + 5.6], look: [tx, 0.7, sz], fov: 36, focus: [0.35, 0.85], blur: 5 }; },
      b6(S) { trolley.visible = true; wheels.forEach((w) => { w.visible = false; }); tracks.forEach((tr) => { tr.visible = true; tr.cleats.forEach((c, i) => { c.position.x = -0.75 + ((i * 0.25 + S.t * 0.8) % 1.75); }); });
        const c = crash(S), k = S.E(S.seg(S.a, c)), along = lerp(-1.6, 3.8, k), fall = S.seg(c, c + 0.9);
        trolley.position.set(sx + along, 0.12 + Math.max(0, along) * (0.245 / 0.42) * (1 - S.E(fall)), sz); trolley.rotation.z = along > 0 ? 0.52 * (1 - S.E(fall)) : 0;
        F.steps.forEach((s, i) => { const f = S.seg(c + i * 0.03, c + 0.7 + i * 0.03); s.position.set(s.home.x + (i % 2 ? 0.3 : -0.2) * f, Math.max(0.12, s.home.y * (1 - f * f)), s.home.z + (i % 3 - 1) * 0.6 * f); s.rotation.set(f * (i % 2 ? 0.8 : -0.6), 0, f * (i % 2 ? -0.5 : 0.7)); });
        you.position.set(sx - 2.8, 0.12, sz + 1.0); you.rotation.y = Math.PI / 2 - 0.3; bags(0); you.setMood(S.t > c ? 'shock' : 'calm'); you.arms(S.t > c ? -2.6 : -0.3, S.t > c ? -2.6 : -0.3, 0.3);
        return { pos: [sx - 6, 4.5, sz + 15], look: [sx + 1.6, 2.0, sz], fov: 40, focus: [0.3, 0.88], shake: S.t > c ? 1 - S.seg(c, c + 0.8) : 0 }; },
      b7(S) { broken(); trolley.visible = true; trolley.position.set(sx + 1, 0.3, sz + 0.4); trolley.rotation.z = 0.3; tracks.forEach((tr) => tr.visible = true); wheels.forEach((w) => { w.visible = false; }); tBags.forEach((g) => g.visible = false); bags(0); crane.visible = true;
        const k1 = S.E(S.seg(S.at(1), S.at(1) + 0.5)), k2 = S.E(S.seg(S.at(1) + 0.4, S.at(1) + 0.9)), k3 = S.E(S.seg(S.at(1) + 0.9, S.b));
        pole.scale.y = Math.max(0.01, k1); pole.position.y = 1.6 * k1; armG.visible = k2 > 0.01; armG.scale.x = Math.max(0.01, k2); armG.rotation.y = 0;
        const hy = lerp(-6.6, -1.6, k3); hook.position.y = hy; rope.scale.y = -hy; rope.position.y = hy / 2;
        you.position.set(F.BX + 1.5, 0.12, F.BZ + 6.2); you.rotation.y = Math.PI * 0.85; you.arms(-2.2, -0.3, 0.2);
        return { pos: F.at(9, lerp(2.5, 5.0, k3), 15), look: F.at(4.5, lerp(1.8, 4.2, k3), 3.4), fov: 40, focus: [0.25, 0.85], blur: 3 }; },
      b8(S) { broken(); crane.visible = true; armG.visible = true; armG.scale.x = 1; pole.scale.y = 1; pole.position.y = 1.6; bags(0); const h = hit(S), sw = S.E(S.seg(S.at(0) + 0.3, h));
        armG.rotation.y = lerp(0, 2.62, sw) + (S.t > h ? Math.sin((S.t - h) * 9) * 0.06 * Math.exp(-(S.t - h) * 2) : 0); hook.position.y = -1.6; rope.scale.y = 1.6; rope.position.y = -0.8;
        const smashed = S.t > h; F.nbWin.visible = !smashed; F.nbHole.visible = smashed; Y.fly(shards, F.at(0, 5.2, 2.7), S.t - h, 1.1); Y.blowWind(S.t, 3.5, F.BZ + 4.5);
        you.position.set(F.BX + 1.5, 0.12, F.BZ + 6.2); you.rotation.y = Math.PI * 0.85; you.arms(smashed ? -2.7 : -2.2, smashed ? -2.7 : -0.3, 0.3); you.setMood(smashed ? 'shock' : 'calm');
        return { pos: F.at(2, 4.2, 16), look: F.at(0.5, 4.6, 2.5), fov: 44, focus: [0.25, 0.8], blur: 3, shake: smashed ? 1 - S.seg(h, h + 0.8) : 0 }; },
      twist(S) { broken(); crane.visible = true; armG.visible = true; armG.scale.x = 1; pole.scale.y = 1; pole.position.y = 1.6; armG.rotation.y = 2.62; hook.position.y = -1.6; F.nbWin.visible = false; F.nbHole.visible = true;
        nb.visible = true; nb.position.set(F.BX, 3.7, F.BZ + 2.9); nb.rotation.y = 0.25; nb.setMood('glare'); const w = Math.sin(S.t * 14); nb.arms(-2.4 + w * 0.4, -2.4 - w * 0.4, 0.5);
        you.position.set(F.BX + 3, 3.55, F.BZ + 3.3); you.rotation.y = -0.3; you.arms(0, 0, 0.3); bags(1, true);
        const k = S.E(S.seg(S.at(1) - 0.1, S.b)); return { pos: F.at(lerp(1.0, 3.6, k), 5.6, 13), look: F.at(lerp(0.2, 3.0, k), 5.2, 3.0), fov: 36, focus: [0.3, 0.75] }; },
      close(S) { broken(); crane.visible = true; armG.visible = true; armG.scale.x = 1; pole.scale.y = 1; pole.position.y = 1.6; armG.rotation.y = 2.62; F.nbWin.visible = false; F.nbHole.visible = true;
        you.position.set(F.BX + 3, 3.55, F.BZ + 3.3); you.rotation.y = -0.1; you.arms(0, 0, 0.3); bags(1, true); const sad = S.t > S.at(1) + 0.5; you.setMood(sad ? 'down' : 'calm'); you.userData.head.rotation.x = sad ? 0.35 : 0;
        return { pos: F.at(3.6, 6.0, lerp(10.5, 9.0, S.e)), look: F.at(3, 5.2, 3.3), fov: 34, focus: [0.3, 0.75] }; },
    },
    overlays(ctx, S) {
      const n = S.n;
      if (n === 'hook') Y.tag(ctx, S, 'RIIIP!', you, [-0.6, 0.6, 0], rip(S));
      if (n === 'b1') Y.tag(ctx, S, 'BAG x2', you, [0.9, 2.0, 0], S.at(0) + 0.3, '#e8a020');
      if (n === 'b2') Y.tag(ctx, S, '18 KG', you, [0.9, 2.5, 0], S.at(0) + 0.3);
      if (n === 'b4') Y.tag(ctx, S, 'YOUR FLAT', F.steps[13], [0, 1.4, 0], S.at(1), '#3a78d8');
      if (n === 'b5') Y.tag(ctx, S, 'TANK TRACKS', trolley, [0, 2.2, 0], S.at(1) + 0.1, '#e8a020');
      if (n === 'b7') Y.tag(ctx, S, 'CRANE', crane, [0, 3.8, 0], S.at(1) + 0.1, '#e8a020');
      if (n === 'twist') Y.tag(ctx, S, '!!!', nb, [0, 2.8, 0], S.a + 0.2);
      if (n === 'close') Y.tag(ctx, S, 'NO MILK', you, [0, 2.9, 0], S.at(1) + 0.4, '#3a78d8');
    },
    score(k, at) {
      k.play('slap', at('hook') + 1.3, { gain: 0.5 }); k.play('pop', at('fix'), { gain: 0.5 }); k.play('thud', at('b2', 1), { f: 60, gain: 0.6 });
      for (let i = 0; i < 4; i++) k.play('click', at('b3') + 0.2 + i * 0.18, { gain: 0.4 });
      k.play('stamp', at('b5', 1), { gain: 0.5 }); k.play('impact', at('b6', 1) + 0.4, { gain: 0.8 }); k.play('thud', at('b6', 1) + 0.5, { f: 50, gain: 0.7 });
      k.play('press', at('b7', 1) + 0.1, { gain: 0.4 }); k.play('whoosh', at('b8'), { dur: 1.2, gain: 0.35 }); k.play('glitch', at('b8', 1) + 0.35, { gain: 0.5 }); k.play('impact', at('b8', 1) + 0.35, { gain: 0.7 });
      k.play('buzz', at('twist'), { gain: 0.3 }); k.play('ding', at('twist', 1), { gain: 0.4 }); k.play('error', at('close', 1) + 0.4, { gain: 0.45 });
    },
  });
})();
