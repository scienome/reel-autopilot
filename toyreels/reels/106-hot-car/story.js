  // ==================== "Let's fix that" chain: 106-hot-car ====================
  makeComedy({
    badge: 'LET\'S FIX THAT', badgeCol: '#c2412c',
    captions: { keys: { "oven": "r", "fix": "g", "sunshade": "y", "cooks": "r", "tree": "g", "birds": "r", "roof": "y", "sides": "r", "walls": "y", "garage": "y", "hotter": "r", "conditioner": "b", "cold": "b", "keys": "r", "locked": "r" } },
    beats: ({ V }) => {
      const bx = (S, x, y, z, hx, hy, hz, c, rot = 0) => S.box((p) => add(rotY(p, rot), [x, y, z]), hx, hy, hz, c, { bevel: 0.25 });
      const RED = [210, 50, 45];
      const car = (S, x, z, o = {}) => { const frost = o.frost || 0, col = frost ? [H.lerp(210, 200, frost), H.lerp(50, 225, frost), H.lerp(45, 250, frost)] : RED;
        bx(S, x, 0.42, z, 0.85, 0.24, 0.42, col); bx(S, x - 0.08, 0.8, z, 0.5, 0.16, 0.38, col); bx(S, x + 0.43, 0.8, z, 0.02, 0.13, 0.33, [170, 215, 245]); for (const d of [-1, 1]) bx(S, x - 0.08, 0.8, z + d * 0.385, 0.42, 0.11, 0.005, [170, 215, 245]);
        for (const a of [-1, 1]) for (const d of [-1, 1]) S.cyl((p) => add(rotX(p, 1.5708), [x + a * 0.52, 0.18, z + d * 0.42]), 0.18, 0.06, [30, 30, 34], 14);
        bx(S, x + 0.86, 0.45, z, 0.01, 0.05, 0.3, [255, 240, 180]);
        if (o.shade) bx(S, x + 0.455, 0.8, z, 0.01, 0.12, 0.31, [210, 214, 222]);
        if (o.poop) { const r = H.rng(9); for (let i = 0; i < Math.round(30 * o.poop); i++) bx(S, x + r.range(-0.7, 0.7), r() > 0.5 ? 0.97 : 0.67, z + r.range(-0.35, 0.35), 0.04, 0.01, 0.04, [248, 248, 244]); }
        if (o.heat) for (let i = 0; i < 5; i++) { const k = ((o.t || 0) * 0.7 + i / 5) % 1; bx(S, x - 0.6 + i * 0.3 + Math.sin(k * 9) * 0.05, 1.0 + k * 0.9, z, 0.015, 0.12, 0.015, [255, 120 + 80 * k, 40]); }
        if (frost) for (let i = 0; i < 6; i++) bx(S, x - 0.75 + i * 0.3, 0.17, z + 0.43, 0.025, 0.05 * frost, 0.01, [220, 240, 255]); };
      const bird = (S, x, y, z, t, i) => { const f = Math.sin(t * 14 + i) * 0.4; bx(S, x, y, z, 0.07, 0.05, 0.05, [60, 60, 70]); bx(S, x + 0.08, y + 0.02, z, 0.02, 0.015, 0.015, [255, 180, 40]); for (const d of [-1, 1]) S.box((p) => add(rotX(p, d * f), [x, y + 0.03, z + d * 0.08]), 0.04, 0.01, 0.06, [80, 80, 90], { bevel: 0.3 }); };
      const bigTree = (S, x, z, t, birds = 0) => { bx(S, x, 0.9, z, 0.12, 0.9, 0.12, [110, 74, 44]); bx(S, x, 2.1, z, 1.1, 0.4, 0.8, [60, 130, 70]); bx(S, x, 2.6, z, 0.75, 0.3, 0.55, [70, 150, 80]);
        for (let i = 0; i < birds; i++) bird(S, x - 0.9 + (i % 6) * 0.36, 1.72 + Math.floor(i / 6) * 0.04, z + 0.3 + (i % 2) * 0.2, t, i); };
      const roof = (S, x, z, k = 1) => { for (const a of [-1, 1]) for (const d of [-1, 1]) bx(S, x + a * 1.05, 0.75 * k, z + d * 0.65, 0.05, 0.75 * k, 0.05, [150, 150, 158]); if (k >= 1) bx(S, x, 1.55, z, 1.2, 0.06, 0.8, [120, 120, 130]); };
      const walls = (S, x, z, k = 1) => { const h = 0.75 * k; bx(S, x, h, z - 0.7, 1.1, h, 0.04, [200, 190, 170]); bx(S, x - 1.1, h, z, 0.04, h, 0.7, [200, 190, 170]); bx(S, x + 1.1, h, z, 0.04, h, 0.7, [200, 190, 170]); };
      const ac = (S, x, y, z, t, on = 1) => { bx(S, x, y, z, 0.35, 0.25, 0.15, [236, 236, 240]); S.cyl((p) => add(rotZ(rotX(p, 1.5708), 0), [x, y, z + 0.16]), 0.18, 0.02, [60, 60, 70], 14); if (on) for (let i = 0; i < 3; i++) { const a = t * 18 + i * 2.09; S.box((p) => add(rotZ(p, a), [x, y, z + 0.18]), 0.16, 0.025, 0.01, [170, 175, 185], { bevel: 0.3 }); }
        if (on) for (let i = 0; i < 5; i++) { const k = (t * 0.9 + i / 5) % 1; bx(S, x - 0.3 + i * 0.15, y - 0.3 - k * 0.6, z + 0.25 + k * 0.3, 0.04, 0.04, 0.04, [200, 235, 255]); } };
      const YOU = (x, z, rot, o = {}) => [null, x, z, rot, Object.assign({ shirt: [70, 130, 220], pants: [40, 44, 56], hair: 'short', mouth: 'flat' }, o)];
      const CX = -0.3, CZ = -0.2;
      return {
        hook: { set: 'lawn', cam: 'mid', at: 0.0, cast: [YOU(0.85, 0.7, -0.5, { mouth: 'open' })], props: (S, t) => car(S, CX, CZ, { heat: 1, t }), tags: [[-0.3, 2.1, 0.0, '65°C', 0.05, 'red'], [-1.1, 1.5, 0.2, 'OVEN MODE', V('hook', 'oven'), 'orange']] },
        fix: { set: 'lawn', cam: 'close', at: 1.0, cast: [YOU(1.0, 0.6, 0, { mouth: 'grin' })], flash: [V('fix', 'fix')], sfx: [['pop', V('fix', 'fix'), { gain: 0.5 }]] },
        b1: { set: 'lawn', cam: 'mid', at: 0.1, cast: [YOU(0.95, 0.7, -0.8, { mouth: 'grin' })], props: (S, t) => car(S, CX, CZ, { shade: t > V('b1', 'sunshade') }), tags: [[0.3, 1.6, 0.2, 'SUNSHADE', V('b1', 'sunshade'), 'yellow']], sfx: [['pop', V('b1', 'windscreen'), { gain: 0.4 }]] },
        b2: { set: 'lawn', cam: 'pull', cast: [YOU(1.2, 0.5, -0.8, (t) => ({ mouth: t > V('b2', 'cooks') ? 'sad' : 'flat' }))], props: (S, t) => car(S, CX, CZ, { shade: 1, heat: t > V('b2', 'rest'), t }), tags: [[-1.2, 1.6, 0.3, 'STILL 60°C', V('b2', 'cooks'), 'red']] },
        b3: { set: 'lawn', cam: 'wide', cast: [YOU(1.4, 0.7, -0.6, { mouth: 'grin' })], props: (S, t, u) => { bigTree(S, -0.3, -0.6, t); car(S, H.lerp(-2.6, CX, H.ease.out(H.clamp(u * 1.6))), CZ, { shade: 1 }); goldTank(S, 2.6, -1.3, 0.8, -0.6, t); }, tags: [[1.5, 2.5, 0.2, 'SHADE', V('b3', 'tree'), 'green']] },
        b4: { set: 'lawn', cam: 'mid', at: -0.1, cast: [YOU(0.85, 0.8, -0.6, (t) => ({ mouth: t > V('b4', 'birds') ? 'open' : 'grin' }))], props: (S, t) => { const n = Math.round(H.clamp((t - V('b4', 'fifty')) * 2) * 18); bigTree(S, -0.3, -0.6, t, n); car(S, CX, CZ, { shade: 1, poop: H.clamp((t - V('b4', 'above')) * 1.2) }); }, tags: [[0.3, 2.5, 0.2, 'x50', V('b4', 'birds'), 'red']], sfx: [['pop', V('b4', 'birds'), { gain: 0.3 }]] },
        b5: { set: 'lawn', cam: 'wide', flash: [V('b5', 'roof')], cast: [YOU(1.6, 0.7, -0.6, { mouth: 'grin', arms: 'up' })], props: (S, t) => { roof(S, CX, CZ, H.clamp((t - V('b5', 'build')) * 1.5)); car(S, CX, CZ, { shade: 1 }); }, tags: [[CX, 2.0, 0.0, 'ROOF', V('b5', 'roof'), 'yellow']], sfx: [['impact', V('b5', 'roof'), { gain: 0.5 }]] },
        b6: { set: 'lawn', cam: 'mid', at: 0.0, cast: [YOU(0.95, 0.8, -0.6, (t) => ({ mouth: t > V('b6', 'sides') ? 'sad' : 'grin' }))], props: (S, t) => { roof(S, CX, CZ); car(S, CX, CZ, { shade: 1, heat: t > V('b6', 'sneaks'), t }); for (let i = 0; i < 4; i++) { const k = (t * 1.2 + i / 4) % 1; bx(S, -2.6 + k * 2.2, 0.5 + i * 0.22, CZ + 0.2, 0.3, 0.03, 0.03, [255, 220, 80]); } }, tags: [[-1.8, 1.9, 0.3, 'SUN 2.0', V('b6', 'sides'), 'orange']] },
        b7: { set: 'lawn', cam: 'wide', flash: [V('b7', 'garage')], cast: [YOU(1.6, 0.8, -0.6, { mouth: 'grin' })], props: (S, t) => { roof(S, CX, CZ); walls(S, CX, CZ, H.clamp((t - V('b7', 'walls')) * 1.5)); car(S, CX, CZ, { shade: 1 }); }, tags: [[CX, 2.0, 0.1, 'GARAGE', V('b7', 'garage'), 'yellow']], sfx: [['impact', V('b7', 'walls'), { gain: 0.5 }]] },
        b8: { set: 'lawn', cam: 'pull', at: -0.3, shake: V('b8', 'hotter'), cast: [YOU(1.4, 0.8, -0.6, (t) => ({ mouth: t > V('b8', 'hotter') ? 'open' : 'flat' }))], props: (S, t) => { roof(S, CX, CZ); walls(S, CX, CZ); car(S, CX, CZ, { shade: 1, heat: 1, t }); }, tags: [[CX, 2.1, 0.1, '80°C', V('b8', 'hotter'), 'red']] },
        b9: { set: 'lawn', cam: 'mid', at: 0.35, flash: [V('b9', 'conditioner')], cast: [YOU(1.45, 1.0, -0.5, { mouth: 'grin' })], props: (S, t) => { roof(S, CX, CZ); walls(S, CX, CZ); car(S, CX, CZ, { shade: 1 }); ac(S, CX + 1.16, 1.0, CZ, t, t > V('b9', 'conditioner')); }, tags: [[1.4, 2.2, 0.3, 'MAX COLD', V('b9', 'wall'), 'blue']], sfx: [['impact', V('b9', 'bolt'), { gain: 0.4 }]] },
        twist: { set: 'lawn', cam: 'mid', at: -0.2, cast: [YOU(1.5, 0.8, -0.6, { mouth: 'grin', arms: 'up' })], props: (S, t) => { roof(S, CX, CZ); walls(S, CX, CZ); car(S, CX, CZ, { shade: 1, frost: H.clamp((t - V('twist', 'cold')) * 1.5) }); ac(S, CX + 1.16, 1.0, CZ, t); }, tags: [[CX, 2.0, 0.1, '-2°C', V('twist', 'cold'), 'blue']] },
        close: { set: 'lawn', cam: 'mid', at: 0.2, cast: [YOU(0.95, 0.7, -0.4, (t) => ({ mouth: t > V('close', 'locked') ? 'sad' : 'flat' }))], props: (S, t) => { car(S, CX, CZ, { shade: 1, frost: 1 }); const k = Math.sin(t * 3) * 0.05; bx(S, -0.2, 0.62 + k, CZ + 0.39, 0.06, 0.03, 0.005, [255, 210, 60]); }, tags: [[-0.2, 1.3, 0.3, 'KEYS', V('close', 'keys'), 'red'], [0.4, 2.2, 0.3, 'LOCKED', V('close', 'locked'), 'red']] },
      };
    },
  });
