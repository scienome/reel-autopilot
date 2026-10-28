  // Short: "A melted chocolate bar invented the microwave" (9:16), standalone
  makeMech({
    end: { text: 'BEST INVENTION OR KITCHEN CRIME?', at: BEAT0('twist') + 4.6 },
    shots: ({ V, BEAT0 }) => {
      const close = [[0.45, 1.2, 1.2], [0.1, 0.97, 0.05], [0.35, 1.15, 0.95], [0.12, 0.97, 0.05]];
      const bench = (S) => { S.box((p) => add(p, [0, 0.45, 0]), 0.6, 0.45, 0.3, [230, 230, 236], { bevel: 0.05 }); S.box((p) => add(p, [0, 0.92, 0]), 0.62, 0.03, 0.32, [40, 44, 52], { bevel: 0.2 }); };
      const magnetron = (S, x, glow) => { S.cyl((p) => add(p, [x, 0.95, -0.05]), 0.14, 0.24, [200, 120, 70], 16, { glow }); for (let i = 0; i < 5; i++) S.box((p) => add(p, [x, 1.0 + i * 0.04, -0.05]), 0.2, 0.006, 0.2, [215, 140, 90], { bevel: 0 }); };
      const choc = (S, x, m) => { S.box((p) => add(p, [x, 0.955 + 0.022 * (1 - m), 0.12]), 0.14 + 0.08 * m, 0.022 * (1 - m * 0.8) + 0.003, 0.07 + 0.06 * m, [92, 52, 32], { bevel: 0.4 }); };
      const water = (S, c, ang, s = 1) => { const O = c, h1 = add(c, mul(rotZ([0.13, -0.09, 0], ang), s)), h2 = add(c, mul(rotZ([-0.13, -0.09, 0], ang), s)); S.ico(O, 0.1 * s, [220, 60, 60]); S.ico(h1, 0.06 * s, [244, 244, 248]); S.ico(h2, 0.06 * s, [244, 244, 248]); S.rod(O, h1, 0.02 * s, [200, 200, 210]); S.rod(O, h2, 0.02 * s, [200, 200, 210]); };
      return {
        hook: { set: 'lab', cam: close, build: (S, t) => { bench(S); magnetron(S, -0.3, true); choc(S, 0.25, ramp(t, 0.6, 1.4)); }, tags: [['1945', V('hook', 'MICROWAVE')]] },
        lab: { set: 'lab', cam: [[0.9, 1.6, 4.0], [0, 1.0, 0], [0.7, 1.5, 3.4], [0, 1.05, 0]], build: (S) => { bench(S); magnetron(S, -0.3, true); },
          crew: [{ who: 'engineer', pos: [0.75, 0, 0.1], yaw: -0.5, pose: 'point' }], tags: [['PERCY SPENCER', V('lab', 'PERCY')], ['MAGNETRON', V('lab', 'MAGNETRON'), 0.24]] },
        melt: { set: 'lab', cam: close, build: (S, t) => { bench(S); magnetron(S, -0.3, true); choc(S, 0.25, ramp(t, V('melt', 'MELTS'), 0.8)); }, tags: [['NOBODY TOUCHED IT', V('melt', 'NOTHING')]], sfx: [['glitch', V('melt', 'MELTS'), { gain: 0.4 }]] },
        test: { set: 'lab', cam: [[0.6, 1.7, 4.6], [0, 1.0, 0], [0.5, 1.6, 4.0], [0, 1.05, 0]],
          build: (S, t) => { bench(S); magnetron(S, -0.3, true); const p0 = V('test', 'POPS'); for (let i = 0; i < 8; i++) { const u = t - p0 - i * 0.07; if (u > 0) S.ico([0.1 + Math.cos(i * 2.4) * 0.1 * u * 3, 0.98 + 2.2 * u - 4.9 * u * u * 0.6, 0.05 + Math.sin(i * 2.4) * 0.08], 0.03, [250, 246, 220]); }
            const e = V('test', 'EXPLODES'); if (t < e) S.ico([0.15, 1.0, 0.1], 0.07, [246, 236, 214]); else for (let i = 0; i < 10; i++) { const u = t - e; S.ico([0.15 + Math.cos(i) * u * 1.5, 1.0 + Math.sin(i * 1.7) * u * 1.2, 0.1 + u], 0.025, i % 3 ? [250, 220, 90] : [250, 250, 245]); } },
          crew: [{ who: 'engineer', pos: [-0.85, 0, 0.1], yaw: 0.6, pose: 'point' }, { who: 'intern', pos: [0.85, 0, 0.25], yaw: -0.6, pose: 'stand', xeyes: false }],
          tags: [['POP!', V('test', 'POPS')], ['SPLAT', V('test', 'EXPLODES'), 0.24, { bg: 'rgba(214,50,40,0.95)', col: '#fff' }]], flash: [V('test', 'EXPLODES')], shake: V('test', 'EXPLODES') },
        how: { set: 'none', render: { bg: '#121a2c', dof: 0 }, cam: [[0, 0.4, 3.0], [0, 0.3, 0], [0, 0.4, 2.6], [0, 0.3, 0]],
          build: (S, t) => { const f = t > V('how', 'FLIP') ? Math.sin(t * 28) * 0.9 : 0; [[-0.6, 0.8], [0.55, 0.65], [0, 0.0], [-0.55, -0.4], [0.6, -0.5]].forEach(([x, y], i) => water(S, [x, y, 0], f * (i % 2 ? 1 : -1), 1.4)); },
          tags: [['2.45 BILLION / SECOND', V('how', 'BILLION'), 0.18], ['SHAKING = HEAT', V('how', 'HEAT'), 0.26, { bg: 'rgba(214,90,40,0.95)', col: '#fff' }]] },
        first: { set: 'garage-empty', cam: [[1.0, 1.6, 4.4], [0, 1.0, 0], [0.8, 1.5, 3.8], [0, 1.05, 0]],
          build: (S) => S.box((p) => add(p, [-0.45, 0.95, -0.2]), 0.42, 0.95, 0.35, [196, 198, 204], { bevel: 0.05, paint: (c, w, h) => { c.fillStyle = '#1c2230'; c.fillRect(w * 0.12, h * 0.2, w * 0.76, h * 0.28); c.fillStyle = '#d83a34'; c.fillRect(w * 0.7, h * 0.56, w * 0.12, h * 0.05); } }),
          crew: [{ who: 'engineer', pos: [0.55, 0, 0.1], yaw: -0.4, pose: 'point' }], tags: [['1.8 m TALL', V('first', 'TALLER')], ['340 kg', V('first', 'KILOS'), 0.24]] },
        twist: { set: 'lab', cam: [[0, 1.6, 1.2], [0, 0.95, 0], [0, 1.45, 0.95], [0, 0.95, 0]],
          build: (S) => { bench(S); S.cyl((p) => add(p, [0, 0.95, 0]), 0.24, 0.015, [246, 246, 246], 24); S.cyl((p) => add(p, [0, 0.965, 0]), 0.18, 0.05, [236, 120, 50], 24); S.cyl((p) => add(p, [0, 0.968, 0]), 0.08, 0.05, [140, 200, 255], 20, { glow: true }); },
          tags: [['HOT EDGES', V('twist', 'CENTIMETRES'), 0.18, { bg: 'rgba(214,90,40,0.95)', col: '#fff' }], ['FROZEN MIDDLE', V('twist', 'FROZEN'), 0.26, { bg: 'rgba(60,130,220,0.95)', col: '#fff' }]] },
      };
    },
  });
