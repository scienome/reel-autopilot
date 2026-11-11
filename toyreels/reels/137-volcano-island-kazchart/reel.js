// 3D toy reel, time-lapse "What if...?" format (owner's reference, 11 Nov 2026): ONE locked wide shot of the toy town,
// a small TIME WITHOUT HUMANS counter, a big "+1 YEAR" jump card between stages, one quiet subtitle line (no popping captions,
// nothing covering the town). The town changes stage by stage; the gold tank is the twist at the end.
(() => {
  const Y = D.toy.world({}), T = D.THREE, lerp = D.lerp, clamp = D.clamp, FONT = D.FONT, TM = window.TIMING, L = TM.lines;
  const SERIF = 'Georgia, "DejaVu Serif", "Times New Roman", serif';
  const ORDER = ['hook', 's2', 'd1', 'w1', 'y1', 'y10', 'y100', 'y1000', 'y10000', 'tank', 'end'];
  const idx = (n) => ORDER.indexOf(n);
  const sky0 = { sun: Y.sky.sun.intensity, sunC: Y.sky.sun.color.clone(), sky: Y.sky.sky.intensity };
  const FOG = { night: new T.Fog('#0b1630', 30, 120), warm: new T.Fog('#e8b48a', 35, 130), snow: new T.Fog('#d6dde6', 25, 110) };
  const BG = { night: new T.Color('#0b1630'), warm: new T.Color('#e9b48c'), snow: new T.Color('#cfd8e2') };

  // people on the pavement (only in the hook)
  const SH = ['#e8473a', '#3a78d8', '#f0c838', '#5aa04a', '#c86ad0', '#ff8a2a'];
  const crowd = SH.map((c, i) => ({ f: Y.person({ shirt: c, pants: i % 2 ? '#2b2f3a' : '#5a4634', hairColor: ['#4a3020', '#1a1a1a', '#c08a40'][i % 3] }), x0: -12 + i * 5.2, z: i % 2 ? 0.0 : 1.0, v: i % 2 ? 1.1 : -1.0 }));
  // cars on the road
  const carMats = [];
  const car = (col) => { const g = Y.grp(null); const mt = Y.m(col, { r: 0.4, m: 0.2 }); carMats.push({ mt, c: new T.Color(col) });
    Y.box(g, 2.2, 0.6, 1.0, mt, 0, 0.5, 0); Y.box(g, 1.2, 0.5, 0.9, mt, -0.1, 1.0, 0); Y.box(g, 1.1, 0.4, 0.92, Y.m('#bfe3ff', { r: 0.1 }), -0.1, 1.0, 0);
    for (const [x, z] of [[-0.7, 0.5], [0.7, 0.5], [-0.7, -0.5], [0.7, -0.5]]) Y.mesh(g, new T.CylinderGeometry(0.24, 0.24, 0.16, 14), '#2a2a2e', x, 0.24, z).rotation.x = Math.PI / 2;
    return g; };
  const cars = [['#e04040', -16, 2.6, 3.2], ['#3a78d8', 18, 3.8, -2.8], ['#f0c838', -4, 2.6, 2.6], ['#ffffff', 26, 3.8, -3.4]].map(([c, x0, z, v]) => ({ g: car(c), x0, z, v }));
  const RUST = new T.Color('#7a4a2e'), MOSS = new T.Color('#5a7a3a');
  // weeds: many little green spikes that grow out of the road and pavement
  const NW = 420, weeds = new T.InstancedMesh(new T.ConeGeometry(0.09, 0.6, 5), Y.m('#4f9a3a', { r: 0.9 }), NW); weeds.castShadow = false; weeds.frustumCulled = false; Y.root.add(weeds);
  const wSeed = Array.from({ length: NW }, () => [Math.random() * 40 - 16, Math.random() * 6 - 0.6, 0.6 + Math.random() * 0.8, Math.random() * 6]);
  const dm = new T.Object3D();
  const growWeeds = (k) => { wSeed.forEach(([x, z, s, r], i) => { dm.position.set(x, 0.1 + 0.3 * s * k, z); dm.rotation.set(0.15 * Math.sin(r), r, 0.15 * Math.cos(r)); dm.scale.setScalar(Math.max(0.001, s * k)); dm.updateMatrix(); weeds.setMatrixAt(i, dm.matrix); }); weeds.instanceMatrix.needsUpdate = true; };
  // meadow over the road, ivy on the shops, snow on the ground
  const meadow = Y.mesh(null, new T.BoxGeometry(80, 0.06, 6.2), Y.m('#5fae44', { tr: true, op: 0, r: 0.95 }), 0, 0.14, 2.2); meadow.castShadow = false;
  const ivy = []; Y.shops.forEach((g) => { for (let i = 0; i < 7; i++) ivy.push(Y.mesh(g, new T.SphereGeometry(0.35 + Math.random() * 0.3, 10, 8), Y.m(i % 2 ? '#3f8a3a' : '#559a40', { r: 0.9 }), -2.4 + Math.random() * 4.8, 0.4 + Math.random() * 3.6, -0.75)); });
  const snow = Y.mesh(null, new T.BoxGeometry(240, 0.3, 240), Y.m('#f4f8ff', { tr: true, op: 0, r: 0.7 }), 6, 0.15, 0); snow.castShadow = false;
  const NS = 360, flakes = new T.InstancedMesh(new T.SphereGeometry(0.07, 6, 5), Y.m('#ffffff'), NS); flakes.frustumCulled = false; Y.root.add(flakes);
  const fSeed = Array.from({ length: NS }, () => [Math.random() * 44 - 16, Math.random() * 30 - 14, Math.random() * 18]);
  const snowFall = (t, on) => { fSeed.forEach(([x, z, y0], i) => { const y = ((y0 - t * 1.6) % 18 + 18) % 18; dm.position.set(on ? x + Math.sin(t + i) * 0.3 : 0, on ? y : -40, z); dm.rotation.set(0, 0, 0); dm.scale.setScalar(1); dm.updateMatrix(); flakes.setMatrixAt(i, dm.matrix); }); flakes.instanceMatrix.needsUpdate = true; };
  // a forest that takes the town back, and the tree through the bakery
  const forest = [[-9, 1.2], [-4, 3.6], [-1, -1.6], [2, 4.4], [5, 1.0], [12, 2.6], [14, 5.2], [-12, 4.2], [20, 1.4], [23, 4.0], [-6, -3.6], [3, -3.4], [19, -6.5], [-15, -1], [10, 6.2], [0, 6.4], [-17, 3], [25, -2]].map(([x, z], i) => ({ g: Y.tree(x, z, 1), k: i }));
  const bakeryTree = Y.tree(-7.5, -2.2, 1);
  const stones = [[-8, -2.4, 1.6, 0.8], [-2, -2.2, 1.2, 0.6], [5, -2.6, 1.8, 0.7], [15, -3, 2.4, 1.0]].map(([x, z, w, h]) => Y.box(null, w, h, 1.4, '#9a9690', x, h / 2, z));
  // rats and deer
  const rats = Array.from({ length: 8 }, () => { const g = Y.grp(null); Y.box(g, 0.4, 0.2, 0.2, '#6a6a70', 0, 0.12, 0); Y.box(g, 0.14, 0.14, 0.14, '#7a7a80', 0.25, 0.16, 0); Y.box(g, 0.4, 0.03, 0.03, '#c08a8a', -0.38, 0.1, 0); return g; });
  const deer = (s) => { const g = Y.grp(null); g.scale.setScalar(s); const B = '#a8743e';
    Y.box(g, 1.3, 0.55, 0.5, B, 0, 1.1, 0); const neck = Y.grp(g, 0.6, 1.3, 0); Y.box(neck, 0.22, 0.7, 0.22, B, 0, 0.3, 0); Y.box(neck, 0.45, 0.26, 0.26, B, 0.15, 0.68, 0); Y.box(neck, 0.06, 0.4, 0.06, '#e8d8b8', -0.02, 0.98, 0.12); Y.box(neck, 0.06, 0.4, 0.06, '#e8d8b8', -0.02, 0.98, -0.12);
    g.legs = [[-0.5, 0.18], [-0.5, -0.18], [0.5, 0.18], [0.5, -0.18]].map(([x, z]) => { const l = Y.grp(g, x, 0.9, z); Y.box(l, 0.12, 0.9, 0.12, '#8a5a30', 0, -0.45, 0); return l; }); g.neck = neck; return g; };
  const deers = [deer(1), deer(0.75)];
  // shops and flats wear away
  const flatsG = Y.flats.g;
  const winMats = Y.shops.map((g) => g.children[1].material);
  const flatWin = flatsG.children[1].material;
  const tankHome = Y.tank.position.clone();
  const tankTree = Y.root.children.find((c) => c.isGroup && Math.abs(c.position.x - 9.6) < 0.01 && Math.abs(c.position.z + 1.6) < 0.01);

  // stage table: counter label, from, to, unit; jump card; how much the town has decayed
  const STAGE = {
    hook: { pop: true }, s2: { from: 0, to: 5, unit: 'SECONDS' }, d1: { from: 1, to: 6, unit: 'DAYS', jump: ['+1', 'DAY'] },
    w1: { from: 1, to: 51, unit: 'WEEKS', jump: ['+1', 'WEEK'] }, y1: { from: 1, to: 9, unit: 'YEARS', jump: ['+1', 'YEAR'] },
    y10: { from: 10, to: 99, unit: 'YEARS', jump: ['+10', 'YEARS'] }, y100: { from: 100, to: 999, unit: 'YEARS', jump: ['+100', 'YEARS'] },
    y1000: { from: 1000, to: 9999, unit: 'YEARS', jump: ['+1,000', 'YEARS'] }, y10000: { from: 10000, to: 12000, unit: 'YEARS', jump: ['+10,000', 'YEARS'] },
    tank: { from: 12000, to: 12000, unit: 'YEARS' }, end: { from: 12000, to: 12000, unit: 'YEARS' },
  };
  const tS2 = TM.shots.s2;
  const carX = (c, t) => { if (t < tS2) return c.x0 + c.v * t; const d = Math.min(t - tS2, 2.2); return c.x0 + c.v * tS2 + c.v * (d - d * d / 4.4); };
  const M = (S, k = 0) => { const g = clamp(S.t / TM.duration, 0, 1); return { pos: [lerp(4.6, 5.2, g), lerp(11.5, 13, g) + k, lerp(14.5, 16.5, g)], look: [5, 2.4, -3.5], fov: 64, focus: [0.25, 0.85], blur: 2.5 }; };

  D.toy.reel({
    order: ORDER, badge: false, captions: false,
    reset(S) {
      const i = idx(S.n), at = (n) => i >= idx(n);
      // light
      const night = S.n === 'd1', warm = S.n === 'w1', cold = at('y10000');
      Y.sky.sun.color.copy(sky0.sunC); Y.sky.sun.intensity = sky0.sun; Y.sky.sky.intensity = sky0.sky;
      if (night) { D.scene.background = BG.night; D.scene.fog = FOG.night; Y.sky.sun.color.set('#7f9cff'); Y.sky.sun.intensity = 0.12; Y.sky.sky.intensity = 0.16; }
      if (warm) { D.scene.background = BG.warm; D.scene.fog = FOG.warm; Y.sky.sun.color.set('#ffb070'); Y.sky.sun.intensity = 0.8; }
      if (cold) { D.scene.background = BG.snow; D.scene.fog = FOG.snow; Y.sky.sun.color.set('#e8f0ff'); Y.sky.sun.intensity = 0.6; Y.sky.sky.intensity = 0.5; }
      winMats.forEach((mt, k) => { mt.emissiveIntensity = night ? (S.t < S.a + 1.6 + k * 0.9 ? 1.4 : 0.0) : 0.25; });
      flatWin.emissiveIntensity = night ? (S.t < S.a + 1.2 ? 1.4 : 0.0) : 0.2;
      // people: walk in the hook, vanish at the start of s2
      crowd.forEach((c, k) => { const f = c.f; f.position.set(c.x0 + c.v * S.t, 0.12, c.z); f.rotation.y = c.v > 0 ? Math.PI / 2 : -Math.PI / 2; f.walk(S.t * 7 + k, 1);
        const gone = S.n === 's2' ? S.E(S.seg(S.a + 0.15, S.a + 0.45)) : at('s2') ? 1 : 0; f.scale.setScalar(Math.max(0.001, 1 - gone)); f.visible = gone < 1; });
      // cars: drive, roll to a stop, rust, then are gone
      cars.forEach((c) => { c.g.position.set(carX(c, S.t), 0, c.z); c.g.rotation.y = c.v > 0 ? 0 : Math.PI; c.g.visible = !at('y100'); c.g.scale.y = at('y10') ? 0.75 : 1; });
      carMats.forEach(({ mt, c }) => { mt.color.copy(c); if (at('y1')) mt.color.lerp(RUST, 0.7); if (at('y10')) mt.color.lerp(MOSS, 0.6); });
      // weeds, meadow, ivy
      const wk = S.n === 'y1' ? S.E(S.seg(S.a, S.a + 2.5)) * 0.6 : at('y10') ? (at('y10000') ? 0.6 * (1 - S.E(S.seg(S.a, S.a + 3))) : at('y100') ? 1.6 : lerp(0.6, 1.3, S.E(S.seg(S.a, S.a + 2.5)))) : 0;
      if (S.n === 'tank' || S.n === 'end') growWeeds(0); else growWeeds(wk);
      meadow.material.opacity = S.n === 'y10' ? S.E(S.seg(S.a, S.a + 2.5)) : at('y100') && !at('y10000') ? 1 : 0; meadow.visible = meadow.material.opacity > 0.01;
      ivy.forEach((v, k) => { v.visible = at('y10') && !at('y1000'); v.scale.setScalar(S.n === 'y10' ? S.E(S.seg(S.a + k * 0.02, S.a + 2)) : 1.3); });
      // shops and flats
      const shopH = at('y10000') ? 0 : at('y1000') ? 0.16 : at('y100') ? 0.72 : 1;
      Y.shops.forEach((g, k) => { g.visible = shopH > 0; g.scale.y = S.n === 'y100' ? lerp(1, 0.72, S.E(S.seg(S.a + k * 0.3, S.a + 2.5))) : shopH; g.rotation.z = at('y100') ? (k - 1) * 0.04 : 0;
        g.children[1].visible = !at('y10'); g.children[2].rotation.z = at('y10') ? (k % 2 ? -0.35 : 0.3) : 0; g.children[2].visible = !at('y100');
        for (let a = 3; a < 9; a++) if (g.children[a]) g.children[a].visible = !at('y10'); });
      const flH = at('y10000') ? 0.06 : at('y1000') ? 0.22 : at('y100') ? 0.62 : 1;
      flatsG.scale.y = S.n === 'y100' ? lerp(1, 0.62, S.E(S.seg(S.a + 0.5, S.a + 3))) : flH; flatsG.rotation.z = at('y1000') ? 0 : at('y100') ? -0.03 : 0;
      Y.flats.steps.forEach((s) => { s.visible = !at('y1000'); });
      stones.forEach((s) => { s.visible = at('y10000'); });
      // trees take over
      forest.forEach(({ g, k }) => { const sc = at('y1000') ? 1.15 + (k % 3) * 0.2 : at('y100') ? (k % 2 ? 1.1 : 0.7) : at('y10') ? (k % 3 === 0 ? 0.45 * S.E(S.seg(S.a, S.a + 3)) + 0.01 : 0) : 0; const near = (S.n === 'tank' || S.n === 'end') && Math.hypot(g.position.x - tankHome.x, g.position.z - tankHome.z) < 8; g.visible = sc > 0.02 && !near; g.scale.setScalar(Math.max(0.01, sc)); });
      bakeryTree.visible = at('y100') && !at('y1000'); bakeryTree.scale.setScalar(S.n === 'y100' ? lerp(0.4, 2.3, S.E(S.seg(S.a + 0.6, S.a + 3.5))) : 2.3);
      // snow
      const sk = S.n === 'y10000' ? S.E(S.seg(S.a + 0.3, S.a + 3)) : at('tank') ? 1 : 0; snow.material.opacity = sk; snow.visible = sk > 0.01; snowFall(S.t, at('y10000'));
      // rats in the week, deer in the year
      rats.forEach((r, k) => { r.visible = S.n === 'w1'; const ph = (S.t * (0.25 + k * 0.03) + k * 0.13) % 1; const dir = k % 2 ? 1 : -1; r.position.set(-12 + (dir > 0 ? ph : 1 - ph) * 24, 0.12, 0.2 + (k % 3) * 0.5); r.rotation.y = dir > 0 ? 0 : Math.PI; });
      deers.forEach((d, k) => { d.visible = S.n === 'y1' || S.n === 'y10'; const x = S.n === 'y1' ? lerp(-8 + k * 3, 3 + k * 3, S.p) : -2 + k * 4; d.position.set(x, 0, 3.2 + k * 0.9); d.rotation.y = 0;
        const walking = S.n === 'y1'; d.legs.forEach((l, j) => { l.rotation.z = walking ? Math.sin(S.t * 6 + j * 1.6) * 0.35 : 0; }); d.neck.rotation.z = walking ? 0 : -1.0 + Math.sin(S.t * 2 + k) * 0.15; });
      if (tankTree) tankTree.visible = !(S.n === 'tank' || S.n === 'end');
      Y.tank.position.copy(tankHome); Y.tank.turret.rotation.y = S.n === 'tank' ? Math.sin(S.t * 1.2) * 0.4 : 0;
    },
    shots: {
      hook: (S) => { const k = S.E(S.seg(S.a, S.a + 2.5)); return { pos: [lerp(2, 4.2, k), lerp(5, 10.5, k), lerp(14, 13, k)], look: [lerp(2, 4.5, k), lerp(1.5, 2.4, k), lerp(0, -3.5, k)], fov: lerp(48, 58, k), focus: [0.25, 0.85], blur: 3 }; },
      s2: (S) => M(S), d1: (S) => M(S), w1: (S) => M(S), y1: (S) => M(S), y10: (S) => M(S), y100: (S) => M(S), y1000: (S) => M(S), y10000: (S) => M(S),
      tank: (S) => { const k = S.E(S.seg(S.a, S.a + 3)), c = tankHome; return { pos: [lerp(4.8, c.x + 3.6, k), lerp(12, 3.2, k), lerp(15, c.z + 6.5, k)], look: [lerp(4.5, c.x, k), lerp(2.4, 0.9, k), lerp(-3.5, c.z, k)], fov: lerp(58, 36, k), focus: [0.35, 0.8], blur: 4 }; },
      end: (S) => { const c = tankHome, r = lerp(0, 0.9, S.e); return { pos: [c.x + Math.sin(r) * 7.3, lerp(3.2, 6, S.e), c.z + Math.cos(r) * 7.3], look: [c.x, 0.9, c.z], fov: 38, focus: [0.35, 0.8], blur: 4 }; },
    },
    overlays(ctx, S) {
      const st = STAGE[S.n];
      if (S.n === 'd1') { ctx.save(); ctx.fillStyle = 'rgba(8,16,48,0.5)'; ctx.fillRect(0, 0, 720, 1280); ctx.restore(); }
      if (S.n === 'w1') { ctx.save(); ctx.fillStyle = 'rgba(230,120,40,0.2)'; ctx.fillRect(0, 0, 720, 1280); ctx.restore(); }
      const txt = (s, x, y, font, col = '#fff', align = 'left', a = 1) => { ctx.save(); ctx.globalAlpha = a; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; ctx.font = font; ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 10; ctx.fillStyle = col; ctx.fillText(s, x, y); ctx.restore(); };
      const fmt = (n) => Math.round(n).toLocaleString('en-US');
      // counter, top left, small like the reference
      if (st.pop) { txt('PEOPLE ON EARTH', 44, 196, `600 20px ${SERIF}`, 'rgba(255,255,255,.9)'); txt(fmt(8190000000 + S.t * 4.3), 44, 248, `44px ${SERIF}`); }
      else { const k = S.E(S.seg(S.a + 0.2, S.a + (S.b - S.a) * 0.8)), v = lerp(st.from, st.to, k);
        txt('TIME WITHOUT HUMANS', 44, 196, `600 20px ${SERIF}`, 'rgba(255,255,255,.9)'); txt(fmt(v), 44, 252, `52px ${SERIF}`);
        txt(st.unit === 'SECONDS' && Math.round(v) === 1 ? 'SECOND' : st.unit, 46, 280, `600 17px ${SERIF}`, 'rgba(255,255,255,.85)'); }
      // jump card between stages: a soft wash and a big "+1 YEAR"
      if (st.jump) { const t0 = S.a, w = S.seg(t0, t0 + 0.25) * (1 - S.seg(t0 + 0.6, t0 + 1.3)), k = S.seg(t0, t0 + 0.2) * (1 - S.seg(t0 + 1.0, t0 + 1.5));
        if (w > 0) { ctx.save(); ctx.fillStyle = `rgba(235,240,248,${0.45 * w})`; ctx.fillRect(0, 0, 720, 1280); ctx.restore(); }
        if (k > 0) { const s = 0.92 + 0.08 * D.ease(S.seg(t0, t0 + 0.3)); ctx.save(); ctx.translate(360, 560); ctx.scale(s, s);
          txt(st.jump[0], 0, 0, `110px ${SERIF}`, '#fff', 'center', k); txt(st.jump[1].split('').join(' '), 0, 46, `600 24px ${SERIF}`, '#fff', 'center', k); ctx.restore(); } }
      // one quiet subtitle line, above the town (never on top of it)
      L.forEach((l) => { if (S.t < l.t0 || S.t > l.t1 + 0.25 || !l.cap) return; const a = clamp((S.t - l.t0) / 0.25, 0, 1) * clamp((l.t1 + 0.25 - S.t) / 0.25, 0, 1);
        ctx.save(); ctx.font = `italic 34px ${SERIF}`; const words = l.cap.split(' '), out = []; let cur = '';
        words.forEach((w) => { const tr = cur ? cur + ' ' + w : w; if (ctx.measureText(tr).width > 600 && cur) { out.push(cur); cur = w; } else cur = tr; }); out.push(cur); ctx.restore();
        ctx.save(); ctx.globalAlpha = 0.35 * a; ctx.fillStyle = '#000'; const bh = out.length * 44 + 26; ctx.filter = 'blur(14px)'; ctx.fillRect(40, 352 - 40, 640, bh); ctx.restore();
        out.forEach((ln, j) => txt(ln, 360, 352 + j * 44, `italic 34px ${SERIF}`, '#fff', 'center', a)); });
      // the gold tank gleams
      if (S.n === 'tank' || S.n === 'end') { const q = D.screen(Y.tank, [0, 1.6, 0]), g = S.seg(S.a + 1.5, S.a + 2.2) * (S.n === 'end' ? 1 : 1);
        if (g > 0) [[-60, -40, 1], [70, 10, 0.7], [10, -80, 0.55]].forEach(([dx, dy, s], j) => { const tw = 0.6 + 0.4 * Math.sin(S.t * 5 + j * 2); ctx.save(); ctx.globalAlpha = g * tw; ctx.translate(q.x + dx, q.y + dy); ctx.rotate(S.t * 0.6 + j);
          ctx.fillStyle = '#fff8d0'; ctx.shadowColor = '#ffd23f'; ctx.shadowBlur = 18; const r = 26 * s; ctx.beginPath(); for (let a = 0; a < 8; a++) { const rr = a % 2 ? r * 0.22 : r; ctx.lineTo(Math.cos(a * Math.PI / 4) * rr, Math.sin(a * Math.PI / 4) * rr); } ctx.closePath(); ctx.fill(); ctx.restore(); }); }
    },
    score(k, at) {
      k.play('whoosh', 0.05, { dur: 2.0, gain: 0.2 });
      k.play('pop', at('s2') + 0.2, { gain: 0.35 }); k.play('pop', at('s2') + 0.3, { gain: 0.3 }); k.play('pop', at('s2') + 0.4, { gain: 0.3 });
      ['d1', 'w1', 'y1', 'y10', 'y100', 'y1000', 'y10000'].forEach((s) => { k.play('whoosh', at(s) - 0.15, { dur: 1.2, gain: 0.3 }); k.play('click', at(s) + 0.05, { gain: 0.3 }); });
      k.play('thud', at('d1') + 1.4, { f: 50, gain: 0.35 }); k.play('thud', at('y100') + 1.2, { f: 45, gain: 0.5 });
      k.play('ding', at('tank') + 1.6, { gain: 0.5 });
    },
  });
})();
