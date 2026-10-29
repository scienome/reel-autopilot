  // ==================== The Illuminati files: the remote ====================
  makeComedy({
    badge: 'THE ILLUMINATI FILES', badgeCol: '#a8841a',
    captions: { say: { 'two thousand sixteen': '2016' }, keys: { illuminati: 'y', lost: 'r', remote: 'o', world: 'y', pyramid: 'y', vault: 'o', lizard: 'g', snowed: 'b', desert: 'y', moon: 'y', sideways: 'r', prices: 'r', mondays: 'r', found: 'g', cat: 'o', everything: 'r', wrong: 'r' } },
    beats: ({ V }) => {
      const I = (x, z, rot, ex) => ['illuminati', x, z, rot, Object.assign({ mouth: 'o', eyes: 'wide', sweat: true }, ex)];
      const cat = (S, x, z, t) => { const c = [230, 140, 50]; S.box((p) => add(p, [x, 0.22, z]), 0.32, 0.2, 0.2, c, { bevel: 0.6 }); S.box((p) => add(p, [x + 0.28, 0.48, z]), 0.17, 0.16, 0.16, c, { bevel: 0.6 }); for (const s of [-1, 1]) S.box((p) => add(p, [x + 0.28, 0.68, z + s * 0.09]), 0.04, 0.06, 0.03, c, { bevel: 0.2 }); S.box((p) => add(rotZ(p, 0.6 + Math.sin(t * 3) * 0.3), [x - 0.38, 0.45, z]), 0.04, 0.22, 0.04, c, { bevel: 0.4 }); };
      const remote = (S, x, y, z) => { S.box((p) => add(p, [x, y, z]), 0.08, 0.02, 0.2, [30, 30, 36], { bevel: 0.3 }); S.box((p) => add(p, [x, y + 0.025, z - 0.12]), 0.025, 0.01, 0.025, [220, 40, 40], { bevel: 0.3 }); };
      const sofa = (S) => { S.box((p) => add(p, [0, 0.25, -0.2]), 1.1, 0.25, 0.45, [120, 60, 70], { bevel: 0.2 }); S.box((p) => add(p, [0, 0.65, -0.6]), 1.1, 0.4, 0.1, [110, 55, 64], { bevel: 0.2 }); };
      return {
        hook: { set: 'lair', cam: 'wide', flash: [V('hook', 'lost')], cast: [I(-1.3, -0.6, 0.4), I(1.3, -0.6, -0.4, { arms: [2.6, 2.6] }), ['reptilian', 0, -1.2, 0, { mouth: 'open', eyes: 'wide', suit: true }]],
          tags: [[0, 2.5, -0.6, 'LOST', V('hook', 'lost'), 'red'], [0, 0.35, 1.0, 'THE WORLD REMOTE', V('hook', 'remote'), 'orange', 1.2]] },
        search: { set: 'desert', cam: 'mid', props: (S) => pyramid(S, 0, -2.2, 0.9, 1), cast: [I(-0.8, 0.2, 0.3, { arms: [0.4, 2.4] }), ['reptilian', 0.8, 0.2, -0.3, { suit: true, mouth: 'frown', arms: [1.2, 1.2] }]],
          tags: [[-1.2, 2.5, -0.5, 'PYRAMID ✗', V('search', 'pyramid'), 'red'], [0, 2.5, -0.5, 'VAULT ✗', V('search', 'vault'), 'red'], [1.2, 2.5, -0.5, 'POCKETS ✗', V('search', 'pockets'), 'red']] },
        chaos: { set: 'desert', cam: 'wide', props: (S, t) => { const r = H.rng(3); for (let i = 0; i < 40; i++) { const x = -3 + r() * 6, y = 3.2 - ((t * 0.6 + r() * 3.2) % 3.2), z = -2 + r() * 3; S.box((p) => add(p, [x, y, z]), 0.025, 0.025, 0.025, [250, 250, 255], { bevel: 0.5 }); } },
          over: (ctx, W, H_, t) => { if (t < V('chaos', 'moon')) return; ctx.save(); ctx.translate(W * 0.75, H_ * 0.33); ctx.rotate(Math.PI / 2 + t); ctx.fillStyle = '#f4f0d8'; ctx.beginPath(); ctx.arc(0, 0, 50, 0.3, Math.PI * 2 - 0.3); ctx.fill(); ctx.restore(); },
          cast: [['caveman', 0, 0.3, 0, { sweat: false, mouth: 'o', eyes: 'wide', arms: [2.0, 2.0] }]], tags: [[0, 0.35, 0.9, 'SNOW ❄', V('chaos', 'snowed'), 'blue'], [0, 2.5, -0.6, 'MOON: SIDEWAYS', V('chaos', 'sideways'), 'red', 1.1]] },
        worse: { set: 'street', opt: { signs: ['PRICES ↑↑↑', 'MONDAY', 'MONDAY', 'MONDAY'] }, cam: 'mid', cast: [[null, -0.5, 0.2, 0.3, { mouth: 'frown', hold: 'bag', eyes: 'sleepy' }], [null, 0.6, 0.2, -0.3, { mouth: 'open', eyes: 'wide', hair: 'bob', hold: 'phone', arms: [0.15, 1.6] }]],
          tags: [[0, 2.5, -0.6, 'PRICES ↑', V('worse', 'prices'), 'red'], [0, 0.35, 0.9, 'MONDAY x3', V('worse', 'mondays'), 'orange']], sfx: [['coin', V('worse', 'prices'), { gain: 0.5 }]] },
        twist: { set: 'office', opt: { desk: false }, cam: 'mid', props: (S, t) => { sofa(S); remote(S, 0.1, 0.52, -0.2); cat(S, 0.1, -0.2 + 0.0, t); },
          cast: [I(-1.2, 0.5, 0.5, { sweat: false, mouth: 'open', arms: [0.4, 2.0] }), ['reptilian', 1.2, 0.5, -0.5, { suit: true, mouth: 'o', eyes: 'wide' }]], tags: [[0.1, 1.2, 0.1, 'UNDER THE CAT', V('twist', 'cat'), 'orange', 1.1]] },
        punch: { set: 'office', opt: { desk: false }, cam: 'close', props: (S, t) => { sofa(S); remote(S, 0.1, 0.52, -0.2); cat(S, 0.1, -0.2, t); }, cast: [], tags: [[0.1, 1.15, 0.2, 'SINCE 2016', V('punch', 'two'), 'red'], [0.1, 0.35, 0.6, 'EXPLAINS EVERYTHING', V('punch', 'everything'), 'yellow', 1.1]] },
        cta: { set: 'lair', cam: 'mid', props: (S, t) => cat(S, 0.4, 0.3, t), cast: [I(-0.5, 0, 0.3, { sweat: false, mouth: 'grin', hold: 'remote', arms: [0.15, 1.6] })], tags: [[0, 0.35, 0.9, 'WRONG ANSWERS ONLY', V('cta', 'wrong'), 'red', 1.1]] },
      };
    },
  });
