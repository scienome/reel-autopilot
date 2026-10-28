  // ==================== The higher powers: heaven's Wi-Fi ====================
  makeComedy({
    badge: 'THE HIGHER POWERS', badgeCol: '#4a2a7a',
    captions: { say: { five: '5', 'wi-fi': 'Wi-Fi' }, keys: { zeus: 'y', 'wi-fi': 'o', lightning: 'y', chaos: 'r', screaming: 'r', prayers: 'y', loading: 'r', hell: 'r', perfect: 'g', bars: 'g', downstairs: 'r' } },
    beats: ({ V }) => {
      const router = (S, x, z, on) => { S.box((p) => add(p, [x, 0.12, z]), 0.25, 0.08, 0.15, [240, 240, 244], { bevel: 0.3, paint: (c, w, h) => { c.fillStyle = on ? '#30d060' : '#e03030'; for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(w * (0.2 + i * 0.2), h / 2, h * 0.15, 0, TAU); c.fill(); } } }); for (const sx of [-0.15, 0.15]) S.box((p) => add(p, [x + sx, 0.35, z]), 0.015, 0.18, 0.015, [240, 240, 244], { bevel: 0.3 }); };
      return {
        hook: { set: 'heaven', cam: 'mid', shake: V('hook', 'lightning'),
          props: (S, t) => router(S, 0.8, 0.2, t < V('hook', 'unplugged')),
          cast: [['zeus', -0.2, 0, 0.3, (t) => ({ arms: [0.15, t > V('hook', 'charge') ? 2.3 : 0.6], mouth: 'grin' })]],
          tags: [[0.8, 0.35, 0.6, 'WI-FI: OFF', V('hook', 'unplugged'), 'red'], [-0.2, 2.45, -0.4, '⚡ 100%', V('hook', 'bolt'), 'yellow']], sfx: [['buzz', V('hook', 'lightning'), { gain: 0.5 }]] },
        panic: { set: 'heaven', cam: 'wide', shake: V('panic', 'chaos'),
          cast: [-1.3, 0, 1.3].map((x, i) => ['angel', x, 0.1 + (i % 2) * 0.3, -0.3 * (i - 1), (t) => ({ arms: [2.4, 2.4], mouth: 'open', eyes: 'wide', bob: Math.abs(Math.sin(t * 12 + i)) * 0.12, hat: Math.sin(t * 20 + i) > 0 ? 'halo' : null })]),
          tags: [[0, 2.45, -0.4, 'CHAOS', V('panic', 'chaos'), 'red']], sfx: [['glitch', V('panic', 'halos'), { gain: 0.6 }]] },
        prayers: { set: 'heaven', cam: 'mid',
          cast: [['angel', 0, 0, 0, { hold: 'phone', arms: [0.15, 1.7], mouth: 'flat', eyes: 'sleepy' }]],
          over: (ctx, W, H_, t) => { const cx = W * 0.5, cy = H_ * 0.62, r = 46; ctx.lineWidth = 12; ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke(); ctx.strokeStyle = '#3a7ad8'; ctx.beginPath(); ctx.arc(cx, cy, r, t * 6, t * 6 + 1.6); ctx.stroke(); },
          tags: [[0, 2.45, -0.4, '8,000,000,000 UNREAD', V('prayers', 'billions'), 'blue', 1.2]] },
        hell: { set: 'hell', cam: 'mid',
          props: (S) => router(S, 0.9, 0.3, true),
          cast: [['devil', -0.2, 0, 0.2, { hold: 'phone', arms: [0.15, 1.7], mouth: 'grin', shades: true }]],
          tags: [[0, 2.45, -0.4, '📶 5 BARS', V('hell', 'five'), 'green']], sfx: [['success', V('hell', 'perfect'), { f: 'C6', gain: 0.5 }]] },
        twist: { set: 'hell', cam: 'wide',
          cast: [['devil', 0, -0.8, 0, { arms: [2.3, 2.3], mouth: 'grin' }], ...[-1.3, -0.4, 0.5, 1.4].map((x, i) => ['angel', x, 0.4 + (i % 2) * 0.3, -0.2 * (x), { hold: 'phone', arms: [0.15, 1.7], mouth: 'grin', shades: i % 2 === 0 }])],
          tags: [[0, 0.35, 0.9, 'MOVED DOWNSTAIRS', V('twist', 'downstairs'), 'red', 1.1]] },
        cta: { set: 'stage', opt: { banner: 'HEAVEN OR HELL?' }, cam: 'wide',
          cast: [['angel', -0.7, 0, 0.2, { mouth: 'frown' }], ['devil', 0.7, 0, -0.2, { hold: 'phone', arms: [0.15, 1.7], mouth: 'grin', shades: true }]] },
      };
    },
  });
