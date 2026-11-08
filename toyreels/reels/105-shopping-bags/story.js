  // ==================== "Let's fix that" chain: 105-shopping-bags ====================
  makeComedy({
    badge: 'LET\'S FIX THAT', badgeCol: '#c2412c',
    captions: { keys: { "rip": "r", "fix": "g", "two": "y", "arms": "r", "trolley": "y", "wheels": "y", "stairs": "r", "tracks": "y", "apart": "r", "crane": "y", "wind": "r", "window": "r", "furious": "r", "groceries": "g", "milk": "b" } },
    beats: ({ V }) => {
      const bx = (S, x, y, z, hx, hy, hz, c, rot = 0) => S.box((p) => add(rotY(p, rot), [x, y, z]), hx, hy, hz, c, { bevel: 0.25 });
      const BAG = [236, 228, 210], BAG2 = [180, 220, 170];
      const items = (S, x, y, z, s = 1) => { bx(S, x - 0.06 * s, y + 0.2 * s, z, 0.05 * s, 0.05 * s, 0.05 * s, [220, 50, 50]); bx(S, x + 0.06 * s, y + 0.24 * s, z, 0.03 * s, 0.12 * s, 0.03 * s, [240, 200, 60]); bx(S, x, y + 0.22 * s, z - 0.05 * s, 0.04 * s, 0.06 * s, 0.04 * s, [90, 170, 70]); };
      const bag = (S, x, y, z, s = 1, col = BAG, double = 0) => { if (double) bx(S, x, y, z, 0.17 * s, 0.2 * s, 0.11 * s, BAG2); bx(S, x, y, z, 0.15 * s, 0.19 * s, 0.1 * s, col); bx(S, x, y + 0.24 * s, z, 0.08 * s, 0.015 * s, 0.015 * s, col); items(S, x, y, z, s); };
      const falling = (S, x, z, t, t0) => { const k = Math.max(0, t - t0); if (!k) return; const r = H.rng(5); for (let i = 0; i < 6; i++) { const vx = r.range(-0.6, 0.6), y = Math.max(0.05, 0.9 + 1.2 * k - 6 * k * k); bx(S, x + vx * k, y, z + r.range(0, 0.3), 0.05, 0.05, 0.05, [[220, 50, 50], [240, 200, 60], [90, 170, 70], [250, 250, 250]][i % 4], k * 5 + i); } };
      const trolley = (S, x, y, z, t, tracks = 0, rot = 0) => { const B = (dx, dy, dz, hx, hy, hz, c) => S.box((p) => add(rotY(add(p, [dx, dy, dz]), rot), [x, y, z]), hx, hy, hz, c, { bevel: 0.25 });
        B(0, 0.55, 0, 0.45, 0.22, 0.3, [70, 120, 200]); B(-0.5, 0.95, 0, 0.03, 0.25, 0.25, [60, 60, 66]); for (const a of [-0.25, 0, 0.25]) bag(S, x + a * Math.cos(rot), y + 0.95, z - a * Math.sin(rot), 0.9, BAG, 1);
        if (tracks) { for (const d of [-1, 1]) { B(0, 0.17, d * 0.3, 0.5, 0.15, 0.07, [50, 50, 58]); for (let i = -2; i <= 2; i++) B(i * 0.2 + ((t * 0.6) % 0.2), 0.17, d * 0.37, 0.06, 0.06, 0.02, [255, 200, 40]); } }
        else for (const a of [-1, 1]) for (const d of [-1, 1]) S.cyl((p) => add(rotY(add(rotX(p, 1.5708), [a * 0.35, 0.12, d * 0.28]), rot), [x, y, z]), 0.12, 0.05, [30, 30, 34], 12); };
      const STEP = 0.22, NST = 9; // stairs rise to the first-floor door
      const flats = (S, broken = 0, t = 0, glass = 1) => { bx(S, -1.2, 2.2, -1.3, 1.1, 2.2, 0.7, [214, 150, 110]);
        for (let f = 0; f < 3; f++) for (let w = -1; w <= 1; w += 2) { if (f === 1 && w === -1 && !glass) continue; bx(S, -1.2 + w * 0.5, 0.9 + f * 1.3, -0.59, 0.25, 0.3, 0.01, f === 1 && w === -1 ? [190, 230, 255] : [255, 236, 170]); }
        bx(S, -0.7, 2.25, -0.4, 0.45, 0.04, 0.22, [150, 150, 158]); bx(S, -0.7, 2.45, -0.2, 0.45, 0.18, 0.02, [120, 120, 128]); // balcony
        for (let i = 0; i < NST; i++) { const fall = broken ? H.clamp((t - broken) * 1.5 - i * 0.05) : 0; bx(S, 0.1 + i * 0.16, 0.1 + i * STEP - fall * (i * STEP + 0.05), -0.25, 0.1, 0.06, 0.3, [160, 160, 168], fall * (i % 2 ? 1 : -1)); } };
      const crane = (S, t, swing = 0) => { bx(S, -0.4, 3.2, -0.3, 0.05, 0.9, 0.05, [255, 200, 40]); const a = swing, ex = -0.4 + Math.cos(a) * 1.35, ez = -0.3 + Math.sin(a) * 1.35; S.box((p) => add(rotY(p, -a), [(-0.4 + ex) / 2, 4.1, (-0.3 + ez) / 2]), 0.675, 0.04, 0.04, [255, 200, 40], { bevel: 0.3 }); return [ex, ez]; };
      const hook = (S, x, y, z) => { bx(S, x, y + 0.6, z, 0.01, 0.6, 0.01, [40, 40, 44]); bx(S, x, y, z, 0.25, 0.04, 0.2, [120, 90, 60]); for (const a of [-0.12, 0.12]) bag(S, x + a, y + 0.22, z, 0.9, BAG, 1); };
      const YOU = (x, z, rot, o = {}) => [null, x, z, rot, Object.assign({ shirt: [70, 130, 220], pants: [40, 44, 56], hair: 'short', mouth: 'flat' }, o)];
      const NB = (x, z, rot, o = {}) => [null, x, z, rot, Object.assign({ shirt: [120, 170, 90], pants: [60, 50, 40], hair: 'combover', mouth: 'open' }, o)];
      const hands = (S, x, z, y = 0.85, s = 1, col = BAG, dbl = 0) => { for (const a of [-1, 1]) bag(S, x + a * 0.5, y, z + 0.05, s, col, dbl); };
      return {
        hook: { set: 'street', cam: 'mid', opt: { signs: ['GROCERY', 'DONUTS', 'BANK', 'SHOES', 'GROCERY', 'TOYS'] }, cast: [YOU(0.2, 0.2, 0, { mouth: 'sad' })],
          props: (S, t) => { bag(S, 0.7, 0.85, 0.25); if (t < V('hook', 'rip')) bag(S, -0.3, 0.85, 0.25); falling(S, -0.3, 0.25, t, V('hook', 'rip')); },
          tags: [[-0.9, 1.9, 0.3, 'RIIIP', V('hook', 'rip'), 'red']], sfx: [['slap', V('hook', 'rip'), { gain: 0.5 }]] },
        fix: { set: 'street', cam: 'close', cast: [YOU(0.1, 0.2, 0, { mouth: 'grin' })], flash: [V('fix', 'fix')], sfx: [['pop', V('fix', 'fix'), { gain: 0.5 }]] },
        b1: { set: 'street', cam: 'mid', cast: [YOU(0.1, 0.2, 0, { mouth: 'grin' })], props: (S) => hands(S, 0.1, 0.2, 0.85, 1, BAG, 1), tags: [[-0.8, 2.1, 0.3, 'BAG x2', V('b1', 'two'), 'yellow']] },
        b2: { set: 'street', cam: 'low', shake: V('b2', 'arms'), cast: [YOU(0.1, 0.2, 0, (t) => ({ mouth: t > V('b2', 'arms') ? 'sad' : 'grin', bob: t > V('b2', 'arms') ? -0.12 : 0 }))], props: (S, t) => { const dn = t > V('b2', 'arms') ? 0.35 : 0; for (const a of [-1, 1]) for (let k = 0; k < 3; k++) bag(S, 0.1 + a * (0.5 + k * 0.12), 0.85 - dn + k * 0.05, 0.25 - k * 0.12, 1, BAG, 1); },
          tags: [[1.0, 2.1, 0.3, '18 KG', V('b2', 'everything'), 'red']], sfx: [['thud', V('b2', 'arms'), { f: 70, gain: 0.6 }]] },
        b3: { set: 'street', cam: 'wide', at: [-0.4, 0.5], cast: [YOU(0, 0.4, 1.57, (t, u) => ({ x: -1.8 + u * 2.2, walk: t * 8, mouth: 'grin' }))], props: (S, t, u) => { trolley(S, -1.0 + u * 2.2, 0, 0.4, t, 0, 0); goldTank(S, 2.6, -1.3, 0.8, -0.6, t); }, tags: [[0.2, 2.2, 0.3, 'NO ARMS NEEDED', V('b3', 'wheels'), 'green']] },
        b4: { set: 'lawn', cam: 'wide', at: 0.3, cast: [YOU(1.7, 0.6, -1.2, { mouth: 'sad' })], props: (S, t) => { flats(S); trolley(S, 1.1, 0, 0.3, t, 0, 3.14); }, tags: [[0.6, 2.6, 0.2, '4TH FLOOR', V('b4', 'flat'), 'red']] },
        b5: { set: 'lawn', cam: 'mid', at: 1.1, flash: [V('b5', 'tracks')], cast: [YOU(1.75, 0.7, -1.2, { mouth: 'grin' })], props: (S, t) => { trolley(S, 1.0, 0, 0.3, t, t > V('b5', 'tracks'), 3.14); },
          tags: [[1.0, 1.8, 0.3, 'TRACKS', V('b5', 'tracks'), 'yellow']], sfx: [['impact', V('b5', 'tracks'), { gain: 0.5 }]] },
        b6: { set: 'lawn', cam: 'wide', at: 0.3, shake: V('b6', 'apart'), cast: [YOU(1.75, 0.7, -1.2, (t) => ({ mouth: t > V('b6', 'apart') ? 'open' : 'grin', arms: 'up' }))],
          props: (S, t, u) => { flats(S, V('b6', 'apart'), t); const k = H.clamp((t - V('b6', 'climbs')) / Math.max(0.5, V('b6', 'apart') - V('b6', 'climbs'))), fall = H.clamp((t - V('b6', 'apart')) * 1.5); const sx = 1.6 - k * 1.2; trolley(S, sx, Math.max(0, (1.6 - sx) / 0.16 * STEP - 0.2) * (1 - fall), -0.25, t, 1, 3.14 + 0.25 * (1 - fall)); },
          booms: [[0.8, 0.6, -0.2, V('b6', 'apart'), 1.4]] },
        b7: { set: 'lawn', cam: 'wide', cast: [YOU(1.2, 0.7, -0.5, { mouth: 'grin', arms: 'up' })], props: (S, t, u) => { flats(S, 0.01, 99); const [ex, ez] = crane(S, t, 0.67); hook(S, ex, 0.4 + H.ease.inOut(H.clamp((t - V('b7', 'crane')) * 0.6)) * 1.9, ez); },
          tags: [[1.1, 1.6, 0.3, 'CRANE', V('b7', 'crane'), 'yellow']], sfx: [['impact', V('b7', 'Bolt'), { gain: 0.4 }]] },
        b8: { set: 'lawn', cam: 'wide', shake: V('b8', 'window'), cast: [YOU(1.2, 0.7, -0.5, (t) => ({ mouth: t > V('b8', 'window') ? 'open' : 'grin', arms: t > V('b8', 'window') ? 'up' : null }))], props: (S, t, u) => { const sw = 0.67 + H.ease.inOut(H.clamp((t - V('b8', 'wind')) / Math.max(0.5, V('b8', 'window') - V('b8', 'wind') + 0.1))) * 2.62; const smash = t > V('b8', 'window') + 0.1; flats(S, 0.01, 99, !smash); const [ex, ez] = crane(S, t, sw); hook(S, ex, 2.0, ez); for (let i = 0; i < 4; i++) { const k = (t * 1.4 + i / 4) % 1; bx(S, 2.5 - k * 5, 1.6 + i * 0.3, 0.3, 0.25, 0.015, 0.015, [255, 255, 255]); } },
          booms: [[-1.7, 2.2, -0.5, V('b8', 'window') + 0.1, 0.9]], tags: [[1.2, 2.5, 0.3, 'WHOOSH', V('b8', 'wind'), 'blue']] },
        twist: { set: 'lawn', cam: 'mid', at: -0.7, cast: [YOU(-1.3, 0.3, 0.4, { mouth: 'grin' }), NB(-0.2, 0.3, -0.4, (t) => ({ arms: Math.sin(t * 8) > 0 ? 'up' : null, mouth: 'open' }))], props: (S, t) => { hands(S, -1.3, 0.3, 0.85, 1, BAG, 1); for (let i = 0; i < 6; i++) bx(S, -0.6 + i * 0.12, 0.03, 0.6, 0.06, 0.01, 0.04, [190, 230, 255], i); },
          tags: [[-0.2, 2.4, 0.3, '!!!', V('twist', 'furious'), 'red'], [-1.3, 2.4, 0.3, '100%', V('twist', 'groceries'), 'green']] },
        close: { set: 'lawn', cam: 'close', at: -1.3, cast: [YOU(-1.3, 0.3, 0, (t) => ({ mouth: t > V('close', 'milk') ? 'sad' : 'flat' }))], props: (S, t) => hands(S, -1.3, 0.3, 0.85, 1, BAG, 1),
          tags: [[-1.85, 2.3, 0.4, 'NO MILK', V('close', 'milk'), 'blue']] },
      };
    },
  });
