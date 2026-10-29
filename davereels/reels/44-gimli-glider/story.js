  // Dave reel 44: the Gimli Glider (Air Canada 143, 23 July 1983). Fuel worked out in pounds instead of kilograms, both
  // engines out at 41,000 ft, a forward slip onto a decommissioned base hosting a race day. Dave holds the flag. R.I.P. #43.
  const GW = [236, 238, 242], GG = [150, 156, 166], GT = [200, 40, 46], GD = [60, 64, 72];
  // a twin-engine airliner along +x (nose at +x); o.pitch tips the nose, o.roll banks it, o.rat drops the little
  // propeller out of the belly, o.gear 0..1 lowers the main gear, o.nose = false folds the nose wheel
  const gjet = (S, c, o = {}) => { const s = o.s || 1, T = (p) => add(rotY(rotX(rotZ(mul(p, s), o.pitch || 0), o.roll || 0), o.yaw || 0), c);
    S.cyl((p) => T(add(rotZ(p, -Math.PI / 2), [-3.0, 0.9, 0])), 0.45, 6.2, GW, 16);
    S.cyl((p) => T(add(rotZ(p, -Math.PI / 2), [3.2, 0.9, 0])), 0.45, 0.8, GW, 16, { top: 0.15 });
    S.cyl((p) => T(add(rotZ(p, Math.PI / 2), [-3.0, 0.9, 0])), 0.45, 1.0, GW, 16, { top: 0.2 });
    S.box((p) => T(add(p, [3.3, 1.12, 0])), 0.2, 0.08, 0.3, GD, { bevel: 0.3 });
    S.box((p) => T(add(p, [0.3, 0.72, 0])), 0.55, 0.04, 3.7, GG, { bevel: 0.2 });
    S.box((p) => T(add(p, [-3.5, 1.05, 0])), 0.3, 0.03, 1.3, GG, { bevel: 0.2 });
    S.quad([T([-3.0, 1.3, 0]), T([-3.6, 2.6, 0]), T([-4.1, 2.6, 0]), T([-3.95, 1.2, 0])], GT);
    for (const z of [-1.5, 1.5]) S.cyl((p) => T(add(rotZ(p, -Math.PI / 2), [0.4, 0.42, z])), 0.24, 0.95, GG, 12, { top: 0.85 });
    if (o.rat) S.box((p) => T(add(rotX(p, (o.t || 0) * 25), [-0.8, 0.35, 0])), 0.02, 0.18 * o.rat, 0.03, GD, { bevel: 0.1 });
    if (o.gear) for (const z of [-0.5, 0.5]) { S.rod(T([0.2, 0.55, z]), T([0.2, 0.55 - 0.45 * o.gear, z]), 0.04, GD, 6); S.cyl((p) => T(add(rotX(p, Math.PI / 2), [0.2, 0.1 + 0.45 * (1 - o.gear), z - 0.06])), 0.1, 0.12, [30, 30, 34], 12); }
    if (o.nose) S.rod(T([2.6, 0.5, 0]), T([2.6, 0.1, 0]), 0.04, GD, 6); };
  const gtruck = (S, x, z) => { S.box((p) => add(p, [x, 0.5, z]), 1.0, 0.4, 0.4, [230, 230, 236], { bevel: 0.2 }); S.box((p) => add(p, [x + 1.25, 0.45, z]), 0.3, 0.35, 0.38, [60, 120, 200], { bevel: 0.2 });
    for (const a of [-0.6, 0.6, 1.3]) for (const b of [-0.4, 0.4]) S.cyl((p) => add(rotX(p, Math.PI / 2), [x + a, 0.16, z + b - 0.06]), 0.16, 0.12, [30, 30, 34], 12); };
  const gcar = (S, x, z, col) => { S.box((p) => add(p, [x, 0.22, z]), 0.45, 0.12, 0.22, col, { bevel: 0.3 }); S.box((p) => add(p, [x - 0.05, 0.38, z]), 0.2, 0.07, 0.18, shade(col, 0.8), { bevel: 0.4 }); };
  const gflag = (S, p, t) => { S.rod(p, add(p, [0, 0.55, 0]), 0.015, [60, 60, 66], 6); for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) S.quad([add(p, [0.08 * i, 0.55 - 0.08 * j + 0.02 * Math.sin(t * 8 + i), 0]), add(p, [0.08 * i + 0.08, 0.55 - 0.08 * j + 0.02 * Math.sin(t * 8 + i + 1), 0]), add(p, [0.08 * i + 0.08, 0.47 - 0.08 * j + 0.02 * Math.sin(t * 8 + i + 1), 0]), add(p, [0.08 * i, 0.47 - 0.08 * j + 0.02 * Math.sin(t * 8 + i), 0])], (i + j) % 2 ? [20, 20, 24] : [246, 246, 246]); };
  const gsparks = (ctx, S, at, t, t0) => { if (t < t0) return; const p = S.proj(at); ctx.save(); for (let i = 0; i < 16; i++) { const k = ((t * 3 + i / 16) % 1); ctx.globalAlpha = 1 - k; ctx.fillStyle = i % 2 ? '#ffd24a' : '#ff8a3a'; ctx.fillRect(p[0] - k * 260 + Math.sin(i * 7) * 30, p[1] - Math.sin(k * Math.PI) * 90 * (0.5 + (i % 3) * 0.3), 8, 8); } ctx.restore(); };
  const GAIR = { bg: sunsetSky, dof: 0, shadows: false };
  makeDave({
    rip: { n: 43, cause: 'cause of death:\nunit conversion' },
    shots: ({ V, BEAT0 }) => ({
      hook: { set: 'sky', render: GAIR, cam: { orbit: [[0, 1, 0], 19, 16, 3.0, 2.2, 1.0, 0.75, [0.3, 1, 0]] },
        build: (S, t) => gjet(S, [0, Math.sin(t * 0.8) * 0.1, 0], { pitch: 0.02 }),
        tags: [['1983 · AIR CANADA 143', 0.2, 0.15], ['41,000 FT', V('hook', 'thousand'), 0.22, { col: '#ffd24a' }], ['OUT OF FUEL', V('hook', 'fuel'), 0.29, { col: '#ff6a5a' }]] },
      // the ramp: the jet parked, a fuel truck, a dummy with the sum on a clipboard
      units: { set: 'road', cam: { orbit: [[0, 0, 0], 17, 15, 3.4, 2.8, -0.9, -0.7, [0, 1.0, 0]] },
        build: (S) => { gjet(S, [0, 0.0, -1.5], { gear: 1, nose: true }); gtruck(S, -1.5, 1.6); },
        crew: [{ who: 'engineer', pos: [1.6, 0, 1.8], pose: 'point', yaw: -0.6 }],
        tags: [['NEEDED: 22,300 kg', V('units', 'pounds') - 0.6, 0.15], ['LOADED: 22,300 lb', V('units', 'kilograms'), 0.22, { col: '#ffd24a' }], ['= ~10,100 kg', V('units', 'half'), 0.29, { col: '#ff6a5a', px: 46 }]] },
      // both engines out: the nose tips down, the screens go dark, the little propeller drops out of the belly
      glide: { set: 'sky', render: GAIR, cam: { orbit: [[0, 1, 0], 16, 14, 0.4, 0.2, -1.0, -0.8, [0, 0.8, 0]] },
        build: (S, t) => gjet(S, [0, 0, 0], { pitch: -0.08, rat: H.clamp((t - V('glide', 'propeller') + 0.2) / 0.4), t }),
        over: (ctx, W, H_, t) => { const a = ramp(t, V('glide', 'dark') - 0.2, 0.2) * (1 - ramp(t, V('glide', 'propeller') - 0.2, 0.4)); if (a > 0) { ctx.save(); ctx.globalAlpha = a * 0.55; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H_); ctx.restore(); } },
        tags: [['BOTH ENGINES: OFF', V('glide', 'stopped'), 0.15, { col: '#ff6a5a' }], ['SCREENS: DARK', V('glide', 'dark'), 0.22], ['RAM AIR TURBINE', V('glide', 'propeller'), 0.29, { col: '#7ee07a' }]] },
      // Gimli: the old runway is a race strip; little race cars and a crowd, the jet coming in from the far end
      gimli: { set: 'road', cam: { orbit: [[0, 0, 0], 15, 14, 2.4, 2.0, 0.6, 0.45, [1.5, 1.4, 0]] },
        build: (S, t) => { const k = H.clamp((t - BEAT0('gimli')) / 6); gjet(S, [9 - 7 * k, 3.2 - 2.4 * k, -0.6], { s: 0.6, pitch: -0.15, roll: 0.25, gear: 1, t }); [[-3, 0.6], [-1.8, -0.5], [-0.6, 0.6]].forEach(([x, z], i) => gcar(S, x + 0.4 * Math.sin(t + i), z, [[220, 60, 50], [60, 120, 220], [250, 200, 60]][i])); },
        crew: [{ who: 'intern', pos: [-4, 0, 2.6], pose: 'wave', yaw: 0.6 }, { who: 'engineer', pos: [-3.2, 0, 3.0], pose: 'point', yaw: 0.5 }],
        tags: [['GLIDER PILOT', V('gimli', 'glider'), 0.15, { col: '#7ee07a' }], ['GIMLI · OLD AIR FORCE BASE', V('gimli', 'Gimli'), 0.22], ['RACE DAY', V('gimli', 'race'), 0.29, { col: '#ffd24a' }]] },
      // the sideslip, the nose wheel folding, the scrape and the sparks
      land: { set: 'road', cam: { orbit: [[0, 0, 0], 17, 15, 2.6, 2.2, 0.75, 0.55, [0, 0.8, 0]] },
        build: (S, t) => { const b = V('land', 'collapsed'), k = H.clamp((t - BEAT0('land')) / (b - BEAT0('land'))), x = 6 - 6 * k - 1.5 * H.clamp((t - b) / 2); gjet(S, [x, 0.45 * (1 - k), 0], { yaw: 0.35 * (1 - k), pitch: t > b ? -0.12 : 0.04, gear: 1, nose: t < b, t }); },
        over: (ctx, W, H_, t, u, S) => { const b = V('land', 'collapsed'), x = -1.5 * H.clamp((t - b) / 2); gsparks(ctx, S, [x + 2.9, 0.05, 0], t, b); },
        tags: [['SIDESLIP', V('land', 'sideways'), 0.15], ['NOSE GEAR COLLAPSED', V('land', 'collapsed'), 0.22, { col: '#ff6a5a' }], ['NO SERIOUS INJURIES', V('land', 'Nobody'), 0.29, { col: '#7ee07a' }]] },
      // Dave on the strip with the chequered flag; the jet scrapes into frame and carries him off
      end: { set: 'road', cam: { orbit: [[0, 0, 0], 11, 10, 1.8, 1.6, 0.7, 0.55, [0.5, 1.0, 0]] },
        build: (S, t) => { const go = V('end', 'flag'), x = 8 - 5.5 * H.clamp((t - go + 0.6) / 1.1); gjet(S, [x, 0.3, 0], { pitch: -0.12, gear: 1, t }); if (t < go + 0.45) gflag(S, [-0.5, 1.6, 0.25], t); },
        dave: (t) => { const hit = V('end', 'flag') + 0.45, u = H.clamp((t - hit) / 1.2); return { pos: [-0.8, 0, 0], pose: 'wave', yaw: 0.6, t, death: u > 0 ? 'launch' : undefined, u, to: [-4, 2.5, -3], arc: 1.5, mouth: u > 0 ? 1 : 0, xeyes: u > 0.3 }; },
        over: (ctx, W, H_, t, u, S) => gsparks(ctx, S, [8 - 5.5 * H.clamp((t - V('end', 'flag') + 0.6) / 1.1) + 2.9, 0.05, 0], t, V('end', 'flag') - 0.6),
        flash: [V('end', 'flag') + 0.45], shake: V('end', 'flag') + 0.45 },
    }),
    sound: (k, { V, BEAT0 }) => {
      k.play('error', V('units', 'half'), { gain: 0.3 }); k.play('stamp', V('land', 'Nobody'), { gain: 0.35 });
      k.play('impact', V('end', 'flag') + 0.45, { gain: 0.7 });
    },
  });
