// 3D toy reel 134-forgotten-keys-3d: a "Let's fix that" chain. Slot 0 is the problem, slots 1..N are the fixes, each built piece by piece beside you.
(() => {
  const SPEC = {"shirt": "#3a78d8", "hook": [["b", 1.5, 2.2, 0.2, "#7a4a2a", 0, 1.1, 0], ["s", 0.1, "#f2c230", 0.5, 1.1, 0.15], ["b", 0.3, 0.15, 0.04, "#f2c230", -0.4, 1.0, 0.5]], "hookT": "LOCKED OUT!", "hookCol": "#d8423a", "steps": [{"parts": [["b", 0.4, 0.1, 0.4, "#8a5a34", 0, 1.25, 0], ["b", 0.05, 0.3, 0.05, "#9aa0aa", 0, 1.0, 0.0], ["b", 0.15, 0.25, 0.04, "#f2c230", 0, 0.85, 0.0]], "fix": "KEY HOOK", "prob": "IGNORED", "tilt": 0.1}, {"parts": [["b", 3.2, 0.05, 0.05, "#d8c898", 0, 0.7, 0], ["b", 0.05, 0.05, 3.0, "#d8c898", 1.5, 0.7, 0], ["b", 0.3, 0.15, 0.04, "#f2c230", -1.6, 0.7, 0]], "fix": "LONG ROPE", "prob": "SNAGGED!", "tilt": 0.9}, {"parts": [["b", 0.8, 0.6, 0.5, "#d8423a", 0, 0.3, 0], ["s", 0.3, "#f2c230", 0, 0.9, 0], ["b", 0.6, 0.05, 0.05, "#f2c230", 0, 0.9, 0]], "fix": "DOOR ALARM", "prob": "WAKES STREET", "tilt": 0.3}, {"parts": [["b", 1.2, 1.6, 0.4, "#9aa0aa", 0, 0.8, 0], ["b", 0.7, 0.9, 0.05, "#bfe3ff", 0, 1.1, 0.22], ["s", 0.2, "#4fa84a", 0.0, 0.6, 0.25]], "fix": "FINGER LOCK", "prob": "JAMMY!", "tilt": 0.2}, {"parts": [["b", 0.7, 0.5, 0.5, "#34343c", 0, 0.25, 0], ["b", 0.5, 0.9, 0.4, "#2b2f3a", 0, 0.95, 0], ["s", 0.25, "#e0b890", 0, 1.6, 0], ["b", 0.8, 0.2, 0.3, "#34343c", 0, 1.8, 0]], "fix": "DOORMAN", "prob": "FAST ASLEEP", "tilt": 0.1}, {"parts": [["b", 0.2, 2.2, 0.2, "#7a4a2a", -0.8, 0, 0], ["b", 0.2, 2.2, 0.2, "#7a4a2a", 0.8, 0, 0], ["b", 1.8, 0.2, 0.2, "#7a4a2a", 0, 2.2, 0]], "fix": "NO DOOR", "prob": "NO PRIVACY", "tilt": 0.5}], "tagClose": "OPEN"}, N = 6;
  const Y = D.toy.world({ flats: false, shops: [["BAKERY", "#f0c870", "#d0643a"], ["LOCKS", "#bfc8d0", "#556070"], ["GROCERY", "#9fd0a0", "#2f8f4a"]], tank: [0, -1.5, 0.3] }), T = D.THREE, lerp = D.lerp, tank = Y.tank;
  const you = Y.person({ shirt: SPEC.shirt });
  const X = (i) => -9 + i * 3.0, PZ = 0.2;
  const bits = Y.debris(12, Y.ITEM, 0.22, { round: true });
  const mk = (parts, x) => { const g = Y.grp(null, x, 0.12, PZ);
    g.parts = parts.map((p) => { let o;
      if (p[0] === 'b') o = Y.box(g, p[1], p[2], p[3], p[4], p[5], p[6], p[7]);
      else if (p[0] === 'c') { o = Y.mesh(g, new T.CylinderGeometry(p[1], p[1], p[2], 14), p[3], p[4], p[5], p[6]); o.rotation.x = p[7]; o.rotation.z = p[8]; }
      else o = Y.mesh(g, new T.SphereGeometry(p[1], 14, 10), p[2], p[3], p[4], p[5]);
      o.home = o.position.clone(); return o; });
    return g; };
  const slots = [mk(SPEC.hook, X(0))].concat(SPEC.steps.map((s, i) => mk(s.parts, X(i + 1))));
  const tilt = (i) => (i === 0 ? 0 : SPEC.steps[i - 1].tilt);
  const tankPark = () => { tank.position.set(X(N) + 1.4, 0, -1.5); tank.rotation.y = 0.3; };
  // show slots 0..upto fully built (and tilted if their problem happened); returns nothing
  const settle = (upto) => slots.forEach((g, i) => { g.visible = i <= upto; g.parts.forEach((o) => o.position.copy(o.home)); g.rotation.z = i < upto ? tilt(i) * 0.7 : 0; });
  const you_at = (i, ph) => { you.position.set(X(i) - 1.7, 0.12, PZ + 0.1); you.rotation.y = Math.PI / 2; you.walk(ph, 0); };
  const drop = (g, S, t0) => { g.visible = true; g.parts.forEach((o, j) => { const s = t0 + j * 0.15, k = S.E(S.seg(s, s + 0.4)); o.visible = S.t > s; o.position.y = o.home.y + (1 - k) * 3.2; }); };
  const probT = (S) => S.at(1) + 0.25;
  const hit = (S, g, i, pt) => { const k = S.E(S.seg(pt, pt + 0.8)); g.rotation.z = tilt(i) * k; Y.fly(bits, [g.position.x, 1.2, g.position.z + 0.3], S.t - pt, 0.9, 0.24); return S.t > pt ? 1 - S.seg(pt, pt + 0.9) : 0; };

  const SH = {};
  D.toy.reel({
    order: ['hook', 'fix', ...Array.from({ length: N }, (_, i) => 'b' + (i + 1)), 'twist', 'close'],
    reset(S) { slots.forEach((g) => { g.visible = false; g.rotation.set(0, 0, 0); }); Y.fly(bits, [0, 0, 0], 0); tankPark(); },
    shots: SH,
    overlays(ctx, S) { const n = S.n, i = parseInt(n.slice(1), 10);
      if (n === 'hook') Y.tag(ctx, S, SPEC.hookT, slots[0], [0, 2.9, 0], S.line('hook', 1) + 0.3, SPEC.hookCol);
      if (n[0] === 'b') { const st = SPEC.steps[i - 1]; Y.tag(ctx, S, st.fix, slots[i], [0, 3.5, 0], S.a + 0.9, '#e8a020'); Y.tag(ctx, S, st.prob, slots[i], [0, 4.7, 0], probT(S) + 0.1, '#d8423a'); }
      if (n === 'twist') Y.tag(ctx, S, 'YES!', you, [0, 2.7, 0], S.a + 0.2, '#4fa84a');
      if (n === 'close') Y.tag(ctx, S, SPEC.tagClose, you, [0, 2.9, 0], S.at(Math.min(1, 1)) + 0.1, '#3a78d8'); },
    score(k, at) { k.play('slap', at('hook', 1) + 0.3, { gain: 0.5 }); k.play('pop', at('fix'), { gain: 0.5 });
      for (let i = 1; i <= N; i++) { k.play('click', at('b' + i) + 0.6, { gain: 0.35 }); k.play('click', at('b' + i) + 0.9, { gain: 0.35 }); k.play('impact', at('b' + i, 1) + 0.25, { gain: 0.6 }); }
      k.play('ding', at('twist'), { gain: 0.4 }); k.play('error', at('close', 1) + 0.2, { gain: 0.45 }); },
  });
  // step shots are added here so they can reuse helpers
  SH.hook = (S) => { settle(0); const pt = S.line('hook', 1) + 0.3, hx = X(0) - 1.7, x = lerp(hx - 3.2, hx, S.E(S.seg(S.a, S.a + 1.6)));
        const sh = hit(S, slots[0], 0, pt); you.position.set(x, 0.12, PZ + 0.1); you.rotation.y = Math.PI / 2; you.walk(x * 3.4, S.t < S.a + 1.6 ? 1 : 0); you.arms(S.t > pt ? -2.5 : 0.1, S.t > pt ? -2.5 : 0.1, 0.3); you.setMood(S.t > pt ? 'shock' : 'calm');
        tank.position.set(lerp(X(0) - 7, X(0) + 5, S.p), 0, 3.5); tank.rotation.y = 0;
        return { pos: [lerp(X(0) - 2.4, X(0) - 1.0, S.e), 2.8, 12.5], look: [X(0) - 1.0, 1.3, 0.4], fov: 38, focus: [0.4, 0.85], blur: 5, shake: sh * 0.5 }; };
  SH.fix = (S) => { settle(0); you.position.set(X(0) - 1.7, 0.12, PZ + 0.1); you.rotation.y = 0.35; you.arms(0, -1.1 * S.E(S.seg(S.a, S.a + 0.4)), 0.2); you.setMood('calm');
        tank.position.set(lerp(X(0) - 5, X(0) + 3, S.p), 0, 3.4); tank.rotation.y = 0;
        return { pos: [X(0) - 1.0, 2.2, lerp(8.5, 7.0, S.e)], look: [X(0) - 1.2, 1.6, 0.5], fov: 34, focus: [0.25, 0.75] }; };

  for (let i = 1; i <= N; i++) {
    const sg = (S) => {
      settle(i - 1); const g = slots[i], pt = probT(S), r = (i % 2 ? -1 : 1) * lerp(-0.55, 0.55, S.e);
      const walk = S.E(S.seg(S.a, S.a + 0.9)), x = lerp(X(i - 1) - 1.7, X(i) - 1.7, walk);
      drop(g, S, S.a + 0.5); const sh = hit(S, g, i, pt);
      you.position.set(x, 0.12, PZ + 0.1); you.rotation.y = Math.PI / 2; you.walk(x * 3.4, walk > 0 && walk < 1 ? 1 : 0);
      const pointing = S.E(S.seg(S.a + 0.9, S.a + 1.3)); const hurt = S.t > pt;
      you.arms(hurt ? -2.6 : -1.5 * pointing, hurt ? -2.6 : -0.2, hurt ? 0.4 : 0.12); you.setMood(hurt ? 'shock' : 'calm');
      const cx = x + 0.8;
      return { pos: [cx + Math.sin(r * 0.7) * 11.5, 2.8 + (i % 3) * 0.35, PZ + Math.cos(r * 0.7) * 11.5], look: [cx, 1.5, PZ], fov: 40, focus: [0.4, 0.85], blur: 4, shake: sh * (tilt(i) > 0.5 ? 0.8 : 0.4) };
    };
    SH['b' + i] = sg;
  }
  SH.twist = (S) => { settle(N + 1); const hop = Math.abs(Math.sin(S.t * 6)) * 0.25; you.position.set(X(N) - 1.7, 0.12 + hop, PZ + 0.1); you.rotation.y = 0.6; you.arms(-2.8, -2.8, 0.5); you.setMood('calm');
    return { pos: [lerp(X(N) - 1.8, X(N) - 0.5, S.e), 2.8, 12.5], look: [X(N) - 0.5, 1.5, PZ], fov: 42, focus: [0.3, 0.8] }; };
  SH.close = (S) => { settle(N + 1); const sad = S.t > S.at(1); you.position.set(X(N) - 1.7, 0.12, PZ + 0.1); you.rotation.y = 0.3; you.arms(0, 0, 0.3); you.setMood(sad ? 'down' : 'calm'); you.userData.head.rotation.x = sad ? 0.35 : 0;
    return { pos: [X(N) - 0.5, 2.8, lerp(13, 11, S.e)], look: [X(N) - 0.5, 1.5, PZ], fov: 42, focus: [0.3, 0.8] }; };
})();
