// 3D toy reel, "What if...?" time-lapse format (owner's references, 11 Nov 2026): one toy street, a big time counter top-left,
// a giant stat card, the world changing stage by stage, one hero reacting, a YES / NO question at the end.
(() => {
  const Y = D.toy.world({}), T = D.THREE, F = Y.flats, lerp = D.lerp, clamp = D.clamp, FONT = D.FONT;
  const you = Y.person({ shirt: '#e8473a', pants: '#2b2f3a', hairColor: '#4a3020', phone: true });
  const nb = Y.person({ shirt: '#5aa04a', pants: '#5a4634', hairColor: '#a0a0a0', mood: 'calm' });
  // water: one big see-through slab that rises
  const water = Y.mesh(null, new T.BoxGeometry(220, 1, 220), Y.m('#2f86d6', { tr: true, op: 0.72, r: 0.12, m: 0.1 }), 6, 0, 0); water.castShadow = false;
  const puddles = [[-4, 0.6, 1.2], [2, 1.2, 1.6], [7, 0.3, 1.0], [11, 3.4, 1.4], [-9, 3.0, 1.8]].map(([x, z, r]) => { const p = Y.mesh(null, new T.CylinderGeometry(r, r, 0.02, 24), Y.m('#5aa6e8', { tr: true, op: 0.8, r: 0.1 }), x, 0.14, z); p.castShadow = false; return p; });
  // rain: thin falling streaks
  const N = 520, rain = new T.InstancedMesh(new T.BoxGeometry(0.03, 0.55, 0.03), Y.m('#dfefff', { tr: true, op: 0.55 }), N); rain.frustumCulled = false; Y.root.add(rain);
  const seeds = Array.from({ length: N }, () => [Math.random() * 34 - 6, Math.random() * 26 - 8, Math.random() * 20]);
  const dm = new T.Object3D();
  const rainAt = (t, on) => { seeds.forEach(([x, z, y0], i) => { dm.position.set(x, on ? (y0 - t * 15) % 20 + (y0 - t * 15 < 0 ? 20 : 0) : -50, z); dm.rotation.z = 0.12; dm.updateMatrix(); rain.setMatrixAt(i, dm.matrix); }); rain.instanceMatrix.needsUpdate = true; };
  // bathtub boat for the neighbour
  const tub = Y.grp(null); Y.box(tub, 2.2, 0.7, 1.1, '#f4f4f4', 0, 0.35, 0); Y.box(tub, 1.9, 0.1, 0.8, '#bfe6ff', 0, 0.66, 0);
  [-0.85, 0.85].forEach((x) => Y.box(tub, 0.14, 0.3, 0.14, '#d9b45a', x, 0, 0));
  const oar = Y.box(tub, 0.08, 0.08, 2.2, '#8a5a34', 0.2, 1.3, 0);
  // fish
  const fish = Array.from({ length: 7 }, (_, i) => { const g = Y.grp(null); Y.mesh(g, new T.SphereGeometry(0.28, 12, 8), i % 2 ? '#ff8a2a' : '#f0c838', 0, 0, 0).scale.set(1.5, 0.8, 0.6); Y.box(g, 0.3, 0.36, 0.06, i % 2 ? '#ff6a1a' : '#e0a820', -0.5, 0, 0); return g; });
  const tankHome = Y.tank.position.clone();

  const STAGE = { hook: [0, 0], d1: [1, 0.02], d3: [3, 0.6], d7: [7, 3.0], d30: [30, 3.35], d100: [100, 6.6], d365: [365, 10.15], twist: [365, 10.15], close: [365, 10.15], ask: [365, 10.15] };
  const ORDER = ['hook', 'd1', 'd3', 'd7', 'd30', 'd100', 'd365', 'twist', 'close', 'ask'];
  const prev = (n) => STAGE[ORDER[Math.max(0, ORDER.indexOf(n) - 1)]];
  const level = (S) => { const [, h1] = STAGE[S.n], [, h0] = prev(S.n); return lerp(h0, h1, S.E(S.seg(S.a, S.a + (S.b - S.a) * 0.7))); };
  const day = (S) => { const [d1] = STAGE[S.n], [d0] = prev(S.n); return Math.round(lerp(d0, d1, S.E(S.seg(S.a, S.a + 0.9)))); };
  let H = 0;
  const M = (S, dx = 0) => ({ pos: [lerp(9, 11, S.e) + dx, 12.5, 23], look: [11 + dx * 0.5, 2.6, -1.5], fov: 46, focus: [0.25, 0.8], blur: 3 });
  const sunny = (n) => n === 'twist' || n === 'close' || n === 'ask';

  D.toy.reel({
    order: ORDER,
    badge: 'WHAT IF...',
    capY: 1105,
    reset(S) {
      H = level(S); const wet = H > 0.05;
      water.visible = wet; water.scale.y = Math.max(0.01, H); water.position.y = H / 2;
      puddles.forEach((p) => { p.visible = !wet && S.n !== 'hook'; p.scale.setScalar(S.n === 'd1' ? 0.4 + S.e * 0.8 : 1); });
      const on = !sunny(S.n);
      rainAt(S.t, on);
      D.scene.background = on ? new T.Color('#7d8ba0') : Y.sky.skyTex; D.scene.fog = on ? new T.Fog('#8a97ab', 30, 110) : Y.sky.fog;
      Y.sky.sun.intensity = on ? 0.42 : 0.95; Y.sky.sky.intensity = on ? 0.55 : 0.38;
      const fl = H > 1.2; Y.tank.position.set(tankHome.x, fl ? H - 0.45 + Math.sin(S.t * 2) * 0.06 : 0, tankHome.z); Y.tank.rotation.z = fl ? Math.sin(S.t * 1.6) * 0.05 : 0;
      tub.visible = false; nb.visible = false; fish.forEach((f) => { f.visible = false; });
      you.position.set(10, 0.12, 0.6);
    },
    shots: {
      hook(S) { you.position.set(lerp(6, 9, S.e), 0.12, 0.8); you.rotation.y = Math.PI / 2; you.walk(S.t * 7, 1); you.setMood('calm'); you.userData.head.rotation.x = -0.45;
        return { pos: [lerp(9.5, 9, S.e), lerp(4, 12.5, S.e), lerp(10, 23, S.e)], look: [lerp(8.5, 11, S.e), lerp(1.8, 2.6, S.e), lerp(0.5, -1.5, S.e)], fov: 46, focus: [0.25, 0.8], blur: 3 }; },
      d1(S) { you.position.set(lerp(9, 12, S.e), 0.12, 0.8); you.rotation.y = Math.PI / 2; you.walk(S.t * 9, 1); you.arms(-2.7, -2.7, 0.45); you.setMood('nervous');
        return M(S); },
      d3(S) { you.position.set(lerp(8, 11, S.e), 0.12, 1.4); you.rotation.y = Math.PI / 2; you.walk(S.t * 4, 0.6); you.arms(-0.6, -1.8, 0.3); you.setMood('shock');
        return M(S, -1); },
      d7(S) { you.position.set(...F.at(3, 3.55, 3.3)); you.rotation.y = -0.2; you.setMood('shock'); you.arms(-0.4, -0.4, 0.5);
        return M(S, -2); },
      d30(S) { you.position.set(...F.at(3, 3.55, 3.3)); you.rotation.y = -0.15; you.setMood('nervous'); you.sag(0.25); you.arms(-0.2, -0.2, 0.05);
        return { pos: F.at(lerp(5, 4, S.e), 8.5, lerp(10, 8.5, S.e)), look: F.at(3, 4.2, 3.3), fov: 38, focus: [0.3, 0.85], blur: 4 }; },
      d100(S) { you.position.set(...F.at(2, 10.6, 1.5)); you.rotation.y = 0.3; you.setMood('shock'); const w = Math.sin(S.t * 8); you.arms(-2.6 + w * 0.3, 0, 0.3);
        tub.visible = true; nb.visible = true; const tx = lerp(2, 18, S.p); tub.position.set(tx, H - 0.25, 4.5); tub.rotation.z = Math.sin(S.t * 2) * 0.05;
        nb.position.set(tx, H + 0.1, 4.5); nb.rotation.y = Math.PI / 2; nb.sag(0.5); nb.setMood('calm'); nb.arms(-1.2 + Math.sin(S.t * 5) * 0.5, -1.2 - Math.sin(S.t * 5) * 0.5, 0.2); oar.rotation.x = Math.sin(S.t * 5) * 0.5;
        return { pos: [lerp(11, 13, S.e), 16, 24], look: [13, 7.5, -1.5], fov: 44, focus: [0.3, 0.85], blur: 3 }; },
      d365(S) { you.position.set(...F.at(2.6, 10.6, 2.0)); you.rotation.y = 0.1; you.setMood('calm'); you.sag(0.55); you.arms(-0.6, -0.6, 0.2);
        fish.forEach((f, i) => { f.visible = true; const k = (S.t * 0.25 + i / 7) % 1; f.position.set(F.at(0, 0, 0)[0] - 9 + k * 20, H - 0.7 - (i % 3) * 0.5, -3.2 + 3.6 + (i % 2) * 1.2); f.rotation.y = 0; });
        return { pos: F.at(lerp(6, 4, S.e), 17, lerp(13, 11, S.e)), look: F.at(2.2, 10.2, 1.4), fov: 40, focus: [0.3, 0.85], blur: 4 }; },
      twist(S) { you.position.set(...F.at(2.6, 10.6, 2.0)); you.rotation.y = 0.1; you.setMood('calm'); const k = S.E(S.seg(S.a + 0.6, S.a + 1.2)); you.arms(-2.8 * k, -2.8 * k, 0.5 * k);
        return { pos: F.at(lerp(2.5, 5, S.e), lerp(12.2, 15, S.e), lerp(9, 16, S.e)), look: F.at(1.4, 10, 1.6), fov: 40, focus: [0.3, 0.85], blur: 4 }; },
      close(S) { you.position.set(...F.at(2.6, 10.6, 2.0)); you.rotation.y = 0.1; you.pose({ phoneUp: 1, mood: S.t > S.at(0) + 1.2 ? 'shock' : 'calm' }); you.userData.head.rotation.x = 0.3;
        return { pos: F.at(3.4, 12.4, lerp(6.5, 5.6, S.e)), look: F.at(2.6, 11.9, 2.0), fov: 34, focus: [0.4, 0.8], blur: 5 }; },
      ask(S) { you.position.set(...F.at(2.6, 10.6, 2.0)); you.rotation.y = 0.1 + Math.sin(S.t * 1.4) * 0.3; you.setMood('nervous');
        const r = lerp(-0.4, 0.4, S.e); return { pos: F.at(2.6 + Math.sin(r) * 16, 16, 2 + Math.cos(r) * 16), look: F.at(2, 9, 0), fov: 42, focus: [0.3, 0.85], blur: 3 }; },
    },
    overlays(ctx, S) {
      const n = S.n;
      const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
      // time counter, top left (reference 1)
      if (n !== 'hook' && n !== 'ask') {
        const d = day(S), txt = n === 'd365' || sunny(n) ? (d >= 365 ? '1 YEAR' : 'DAY ' + d) : 'DAY ' + d;
        ctx.save(); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.font = `32px ${FONT}`; ctx.fillStyle = '#fff';
        ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 8; ctx.lineWidth = 8; ctx.strokeStyle = D.INK; ctx.lineJoin = 'round'; ctx.strokeText(sunny(n) ? 'RAIN: STOPPED' : 'TIME RAINING', 40, 200); ctx.fillText(sunny(n) ? 'RAIN: STOPPED' : 'TIME RAINING', 40, 200);
        ctx.font = `92px ${FONT}`; ctx.fillStyle = '#fff'; ctx.lineWidth = 10; ctx.strokeStyle = D.INK; ctx.lineJoin = 'round'; ctx.strokeText(txt, 40, 290); ctx.fillText(txt, 40, 290); ctx.restore();
      }
      // giant stat card (reference 2)
      if (['d3', 'd7', 'd30', 'd100', 'd365'].includes(n)) {
        const k = D.ease(S.seg(S.a + 0.15, S.a + 0.45)), w = 300, x = 680 - w, y = 330;
        ctx.save(); ctx.globalAlpha = k; ctx.translate(x + w / 2, y + 60); ctx.scale(0.8 + 0.2 * k, 0.8 + 0.2 * k); ctx.translate(-(x + w / 2), -(y + 60));
        ctx.fillStyle = '#fff'; rr(x, y, w, 120, 18); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = D.INK; ctx.stroke();
        ctx.textAlign = 'center'; ctx.fillStyle = '#1f6fe0'; ctx.font = `24px ${FONT}`; ctx.fillText('WATER LEVEL', x + w / 2, y + 36);
        ctx.fillStyle = D.INK; ctx.font = `58px ${FONT}`; ctx.fillText(H.toFixed(1) + ' M', x + w / 2, y + 96); ctx.restore();
      }
      if (n === 'd3') Y.tag(ctx, S, 'WET BREAD', Y.shops[0], [1.5, 4.3, -0.8], S.at(0) + 1.4, '#d0643a');
      if (n === 'd7') Y.tag(ctx, S, 'NO SCHOOL', Y.shops[2], [0, 4.6, -0.8], S.at(0) + 2.2, '#3a78d8');
      if (n === 'd100') Y.tag(ctx, S, 'NEIGHBOUR', nb, [0, 2.4, 0], S.at(0) + 1.2, '#5aa04a');
      if (n === 'twist') Y.tag(ctx, S, 'SUN!', you, [0, 3.0, 0], S.at(0) + 1.0, '#e8a020');
      if (n === 'close') {
        const k = D.ease(S.seg(S.at(0) + 0.5, S.at(0) + 0.8)); ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = '#fff'; rr(80, 300, 560, 150, 22); ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = D.INK; ctx.stroke();
        ctx.textAlign = 'left'; ctx.fillStyle = '#7a7f8c'; ctx.font = `24px ${FONT}`; ctx.fillText('BOSS  ·  now', 110, 345); ctx.fillStyle = D.INK; ctx.font = `46px ${FONT}`; ctx.fillText('See you Monday :)', 110, 410); ctx.restore();
      }
      if (n === 'ask') {
        const k = D.ease(S.seg(S.a + 0.1, S.a + 0.4)); ctx.save(); ctx.globalAlpha = k; ctx.textAlign = 'center';
        ctx.font = `86px ${FONT}`; ctx.lineWidth = 12; ctx.lineJoin = 'round'; ctx.strokeStyle = D.INK; ctx.fillStyle = '#fff'; ctx.strokeText('WOULD YOU', 360, 250); ctx.fillText('WOULD YOU', 360, 250);
        ctx.fillStyle = '#ffd23f'; ctx.strokeText('STAY?', 360, 345); ctx.fillText('STAY?', 360, 345);
        [['YES', '#27b04a', 220], ['NO', '#e0303a', 500]].forEach(([s, c, cx], i) => { const kk = D.ease(S.seg(S.a + 0.4 + i * 0.2, S.a + 0.7 + i * 0.2)); ctx.globalAlpha = kk; ctx.fillStyle = c; rr(cx - 110, 400, 220, 90, 45); ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.fillStyle = '#fff'; ctx.font = `54px ${FONT}`; ctx.fillText(s, cx, 465); });
        ctx.restore();
      }
    },
    score(k, at) {
      k.play('whoosh', 0.05, { dur: 1.6, gain: 0.25 });
      ['d1', 'd3', 'd7', 'd30', 'd100', 'd365'].forEach((s) => { k.play('click', at(s) + 0.1, { gain: 0.4 }); k.play('whoosh', at(s) + 0.2, { dur: 1.0, gain: 0.22 }); });
      k.play('pop', at('d3') + 0.3, { gain: 0.4 }); k.play('thud', at('d7') + 0.4, { f: 55, gain: 0.5 }); k.play('slap', at('d100') + 1.0, { gain: 0.35 });
      k.play('ding', at('twist') + 0.9, { gain: 0.5 }); k.play('buzz', at('close') + 0.6, { gain: 0.35 }); k.play('error', at('close') + 1.6, { gain: 0.4 });
      k.play('pop', at('ask') + 0.4, { gain: 0.45 }); k.play('pop', at('ask') + 0.6, { gain: 0.45 });
    },
  });
})();
