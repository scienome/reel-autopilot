  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const ham = (S, t, x, y, z, o = {}) => { const s = o.s || 1, col = [230, 170, 100], P = (p) => add(mul(p, s), [x, y, z]); S.ball(P([0, 0.09, 0]), [0.11, 0.09, 0.12], col); S.ball(P([0, 0.07, 0.07]), [0.07, 0.05, 0.06], [250, 240, 225]);
    S.ball(P([0, 0.17, 0.08]), [0.08, 0.07, 0.07], col); for (const sd of [-1, 1]) { S.ball(P([sd * 0.06, 0.24, 0.06]), [0.025, 0.03, 0.015], [240, 150, 160]); S.ball(P([sd * 0.03, 0.19, 0.145]), 0.012 * s, [20, 18, 20], { gloss: 0.9 }); S.ball(P([sd * 0.04, 0.15, 0.13]), [0.025, 0.018, 0.015], [250, 230, 210]); }
    S.ball(P([0, 0.16, 0.155]), 0.008 * s, [240, 130, 150]); };
  const wheel = (S, t, spin) => { for (let i = 0; i < 16; i++) { const a = i / 16 * TAU + spin; S.ball([0.0 + Math.cos(a) * 0.28, 0.42 + Math.sin(a) * 0.28, -0.05], 0.018, [180, 190, 200]); } S.limb([0, 0.42, -0.1], [0, 0.0, -0.1], 0.015, 0.015, [150, 160, 170]); };
  const cage = (S, open) => { for (let i = 0; i < 9; i++) S.limb([-0.6 + i * 0.15, 0, -0.35], [-0.6 + i * 0.15, 0.8, -0.35], 0.006, 0.006, [200, 205, 210]); if (!open) for (let i = 0; i < 9; i++) S.limb([-0.6 + i * 0.15, 0, 0.35], [-0.6 + i * 0.15, 0.8, 0.35], 0.006, 0.006, [200, 205, 210]); };
  makeCouch({
    keys: ['hamster', 'run', 'running', 'four', 'thousand', 'miles', 'cage', 'loudly', 'cat', 'snack', 'open', 'freedom', 'scary', 'wheel', 'two'],
    shots: ({ V, first }) => ({
      hook: { set: 'bedroom', cam: [[0, 0.75, 1.3], [0, 0.4, 0], [0, 0.72, 1.1], [0, 0.4, 0]], he: NOONE, she: NOONE, props: (S, t) => { cage(S, false); wheel(S, t, t * 6); ham(S, t, 0, 0.14 + Math.abs(Math.sin(t * 14)) * 0.02, -0.05); },
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0, 0.5, -0.05], t < V('h1', 'Where') - 0.1 ? 'Run. Run.' : 'Where am I running to?', pu(t, first('h1'))) },
      h2: { set: 'bedroom', cam: [[0.1, 0.6, 0.9], [0, 0.35, -0.05], [0.1, 0.58, 0.8], [0, 0.35, -0.05]], he: NOONE, she: NOONE, props: (S, t) => { cage(S, false); wheel(S, t, t * 6); ham(S, t, 0, 0.14 + Math.abs(Math.sin(t * 14)) * 0.02, -0.05); },
        over: (ctx, W, H_, t, S) => { badge(ctx, S, [0.35, 0.7, -0.05], '4,000', 'MILES', pu(t, V('h2', 'four'))); thought(ctx, S, [0, 0.5, -0.05], t < V('h2', "I'm") - 0.1 ? "I've run 4,000 miles." : "I'm still in the cage.", pu(t, first('h2'))); } },
      n2: { set: 'bedroom', cam: [[0, 0.75, 1.3], [0, 0.4, 0], [0, 0.72, 1.1], [0, 0.4, 0]], he: NOONE, she: NOONE, shake: first('h3'), props: (S, t) => { cage(S, false); wheel(S, t, t * 12); ham(S, t, 0, 0.14 + Math.abs(Math.sin(t * 20)) * 0.03, -0.05); },
        over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); if (t < first('h3')) timeCard(ctx, t, first('n2') - 0.1, '3 A.M.'); thought(ctx, S, [0, 0.5, -0.05], t < V('h3', 'Loudly') - 0.1 ? 'Time to run.' : 'LOUDLY.', pu(t, first('h3'))); } },
      n3: { set: 'bedroom', cam: [[0.3, 0.8, 1.5], [0.2, 0.4, 0], [0.3, 0.78, 1.3], [0.2, 0.4, 0]], he: NOONE, she: NOONE, props: (S, t) => { cage(S, false); ham(S, t, -0.2, 0, 0.1, { s: 1.1 }); cat(S, { x: 0.65, y: 0, z: 0.55, s: 0.8, col: [92, 92, 100], mood: 'smug', look: [-1, 0], t }); },
        over: (ctx, W, H_, t, S) => thought(ctx, S, [-0.2, 0.45, 0.1], t < V('h4', "I'm") - 0.1 ? "Don't look at me like that." : "I'm not a snack.", pu(t, first('h4'))) },
      n4: { set: 'bedroom', cam: [[0, 0.75, 1.4], [0, 0.4, 0], [0, 0.72, 1.2], [0, 0.4, 0]], he: NOONE, she: NOONE, props: (S, t) => { const out = t > first('h5') && t < first('h6'); cage(S, true); wheel(S, t, 0); ham(S, t, out ? H.lerp(-0.1, 0.1, H.clamp((t - first('h5')) * 2)) : -0.1, 0, out ? H.lerp(0.1, 0.45, H.clamp((t - first('h5')) * 2)) : 0.1, { s: 1.1 }); },
        over: (ctx, W, H_, t, S) => thought(ctx, S, [0, 0.45, 0.2], t < first('h6') - 0.1 ? 'FREEDOM!' : t < V('h6', "I'm") - 0.1 ? 'Too scary.' : "I'm going back to my wheel.", pu(t, first('h5'))) },
      cta: { set: 'bedroom', cam: [[0, 0.75, 1.3], [0, 0.4, 0], [0, 0.75, 1.25], [0, 0.4, 0]], he: NOONE, she: NOONE, props: (S, t) => { cage(S, false); wheel(S, t, t * 6); ham(S, t, 0, 0.14, -0.05); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
    }),
  });
