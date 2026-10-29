  // ==================== 0040 "What if his beard grew one inch every day?" (one-off special, 29 Oct) ====================
  const BEARD = [72, 50, 36];
  // the beard: a tuft on the chin, then a strand that follows `route` for `inches`. Returns the tip.
  const lapRoute = (c) => [add(c, [0.02, -0.14, 0.12]), [c[0] + 0.03, 0.8, -0.08], [c[0] + 0.05, 0.72, 0.16], [c[0] + 0.1, 0.03, 0.34],
    ...Array.from({ length: 4 }, (_, r) => [[r % 2 ? 1.9 : -1.9, 0.03, 0.5 + r * 0.38], [r % 2 ? -1.9 : 1.9, 0.03, 0.69 + r * 0.38]]).flat()];
  const beard = (S, d, inches, route = lapRoute) => {
    if (!d) return null; const c = add(d.head, d.Rh([0, -0.31, 0.15])), k = H.clamp(inches / 7);
    if (k > 0) for (let i = -6; i <= 6; i++) { const e = Math.abs(i) / 6; S.ball(add(d.head, d.Rh([i * 0.037, -0.2 - 0.08 * (1 - e) * k, 0.2 - 0.1 * e * e])), 0.04 + 0.04 * k * (1 - 0.4 * e), BEARD, { gloss: 0.15 }); }
    let left = inches * 0.0254 - 0.18, pts = [c, ...route(c)], tip = c;
    for (let i = 1; i < pts.length && left > 0; i++) { const a = pts[i - 1], seg = sub(pts[i], a), L = Math.hypot(...seg), f = Math.min(1, left / L), b = add(a, mul(seg, f));
      S.limb(a, b, 0.09, 0.09, BEARD, { bias: b[1] < 0.1 ? -0.2 : 0 }); tip = b; left -= L; }
    return tip;
  };
  const day = (n, len) => ({ k: 'card', text: `DAY ${n} · ${len}`, at: 0, y: 1000, fill: '#1c1a2a', px: 38 });
  makeCouch({
    keys: ['beard', 'inch', 'seven', 'rugged', 'thirty', 'soup', 'ninety', 'vacuum', 'year', 'feet', 'cat', 'chair', 'progress', 'shave', 'save'],
    shots: ({ V }) => ({
      hook: { cam: 'him', he: { arms: 'rest', face: { mouth: 'smile', eyes: 'happy' } }, she: { hide: true },
        props: (S, t, u, he) => beard(S, he, u * 1.5),
        fx: [{ k: 'card', text: '+1 INCH EVERY DAY', at: V('hook', 'inch'), y: 1000, fill: '#c0182a', col: '#fff', px: 40 }] },
      week: { cam: 'two', he: { arms: 'rest', face: { mouth: 'smile' } }, she: { arms: 'cheeks', face: { mouth: 'smile', eyes: 'happy', blush: 1 } },
        props: (S, t, u, he) => beard(S, he, 7), fx: [{ ...day(7, '7 INCHES'), at: V('week', 'seven') }, { k: 'heart', who: 'she', at: V('week', 'rugged') }] },
      month: { cam: 'him', he: { arms: 'hold', face: { mouth: 'o', eyes: 'wide', brows: 0.8 } }, she: { hide: true },
        props: (S, t, u, he) => { const w = add(mul(add(he.hands[0].p, he.hands[1].p), 0.5), [0, 0.02, 0.06]); S.cyl((p) => add(p, w), 0.13, 0.08, [246, 244, 238], 18, { top: 1.3 }); S.cyl((p) => add(p, add(w, [0, 0.075, 0])), 0.155, 0.005, [220, 140, 60], 18);
          beard(S, he, 30, (c) => [add(c, [0, -0.1, 0.06]), add(w, [0, 0.07, 0]), add(w, [0.02, 0.02, 0.06]), [c[0] + 0.05, 0.72, 0.16], [c[0] + 0.1, 0.03, 0.34]]); },
        fx: [{ ...day(30, '2.5 FT'), at: V('month', 'thirty') }, { k: 'stamp', text: 'IN THE SOUP', x: 360, y: 860, at: V('month', 'soup'), col: '#ffd23f' }] },
      ninety: { room: { table: false }, cam: [[0.2, 2.5, 4.4], [0, 0.55, 0.3], [0.15, 2.4, 4.0], [0, 0.6, 0.3]], he: { arms: 'slump', face: { mouth: 'flat' } }, she: { arms: 'clasp', face: { mouth: 'flat', lids: 0.6, brows: -0.8 } },
        props: (S, t, u, he) => { const tip = beard(S, he, 90); if (!tip) return; const j = t > V('ninety', 'gives') ? 0 : Math.sin(t * 30) * 0.02; S.cyl((p) => add(p, [tip[0] + 0.15 + j, 0.0, tip[2] + 0.05]), 0.18, 0.07, [60, 62, 70], 20); S.ball([tip[0] + 0.15 + j, 0.09, tip[2] + 0.2], 0.025, t > V('ninety', 'gives') ? [255, 60, 50] : [80, 230, 120], { glow: true }); },
        fx: [{ ...day(90, '7.5 FT'), at: V('ninety', 'ninety') }, { k: 'stamp', text: 'VACUUM: ERROR', x: 360, y: 860, at: V('ninety', 'gives'), col: '#ff4a4a' }] },
      year: { room: { table: false }, cam: [[0.2, 2.5, 4.4], [0, 0.55, 0.3], [0.15, 2.4, 4.0], [0, 0.6, 0.3]], he: { arms: 'cheeks', face: { mouth: 'smile', lids: 0.4 } }, she: { arms: 'head', face: { eyes: 'wide', mouth: 'o', brows: 0.9 } },
        props: (S, t, u, he) => beard(S, he, 365), pets: [{ kind: 'cat', x: 0.5, z: 0.9, yaw: 0.6 }],
        fx: [{ ...day(365, '30 FT'), at: V('year', 'One') }, { k: 'q', who: 'she', at: V('year', 'cat') }] },
      date: { set: 'restaurant', cam: [[-0.35, 2.1, 4.1], [-0.3, 0.75, 0], [-0.3, 2.0, 3.7], [-0.3, 0.8, 0]], he: { arms: 'rest', face: { mouth: 'smile' } }, she: { arms: 'clasp', face: { mouth: 'flat', lids: 0.6 } },
        extras: [{ who: 'waiter', x: 0.95, z: 0.75, yaw: -0.5, sit: false, face: { mouth: 'o', eyes: 'wide' } }],
        props: (S, t, u, he) => { S.rbox((p) => add(p, [-1.25, 0.42, 0.75]), 0.36, 0.05, 0.34, [60, 30, 26], { bevel: 0.3 }); S.rbox((p) => add(p, [-1.25, 0.75, 0.58]), 0.36, 0.32, 0.05, [60, 30, 26], { bevel: 0.3 });
          beard(S, he, 160, (c) => [add(c, [0.02, -0.14, 0.12]), [c[0], 0.8, -0.1], [c[0] - 0.2, 0.03, 0.0], [-1.15, 0.03, 0.75], [-1.25, 0.5, 0.75], ...Array.from({ length: 10 }, (_, i) => [-1.25 + 0.1 * Math.cos(i * 2.2), 0.52 + i * 0.05, 0.75 + 0.1 * Math.sin(i * 2.2)])]); },
        fx: [{ k: 'card', text: 'TABLE FOR THREE', at: V('date', 'chair'), y: 1000, fill: '#1c1a2a', px: 38 }] },
      twist: { cam: 'her', he: { hide: true }, she: { arms: 'shrug', face: { mouth: 'smile', lids: 0.5, brows: -0.6 } }, twist: V('twist', 'progress'),
        fx: [{ k: 'smug', who: 'she', at: V('twist', 'progress') }] },
      close: { room: { table: false }, cam: [[0.2, 2.5, 4.4], [0, 0.55, 0.3], [0.15, 2.4, 4.0], [0, 0.6, 0.3]], he: { arms: 'cheeks', face: { mouth: 'smile', eyes: 'happy' } }, she: { arms: 'clasp', face: { mouth: 'flat', lids: 0.6 } },
        props: (S, t, u, he) => beard(S, he, 365),
        fx: [{ k: 'card', text: 'SHAVE IT or SAVE IT?', at: V('close', 'Shave'), y: 1000, fill: '#c0182a', col: '#fff', px: 40 }] },
    }),
  });
