  // ==================== The higher powers: Elvis and the aliens ====================
  makeComedy({
    badge: 'CONSPIRACY FILES', badgeCol: '#1a7a6a',
    captions: { say: { forty: '40', 'twelve thousand': '12,000' }, keys: { elvis: 'y', "didn't": 'r', die: 'r', aliens: 'g', one: 'y', song: 'o', forty: 'r', encore: 'o', twelve: 'r', thousand: 'r', back: 'g', tired: 'b', were: 'r', burger: 'o', requests: 'y', kidnap: 'r' } },
    beats: ({ V }) => {
      const E = (ex) => ['elvis', 0, 0.2, 0, Object.assign({ hold: 'remote', arms: [0.15, 2.0] }, ex)];
      const AL = (x, z, rot, ex) => ['alien', x, z, rot, ex];
      const ufo = (S, y) => { S.cyl((p) => add(p, [0, y, -0.4]), 0.9, 0.12, [190, 196, 206], 24); S.cyl((p) => add(p, [0, y + 0.16, -0.4]), 0.4, 0.15, [140, 220, 240], 18); };
      const beam = (ctx, W, H_, t) => { ctx.save(); ctx.fillStyle = 'rgba(160,255,190,0.25)'; ctx.beginPath(); ctx.moveTo(W * 0.4, H_ * 0.25); ctx.lineTo(W * 0.6, H_ * 0.25); ctx.lineTo(W * 0.75, H_ * 0.8); ctx.lineTo(W * 0.25, H_ * 0.8); ctx.fill(); ctx.restore(); };
      return {
        hook: { set: 'desert', cam: 'wide', props: (S) => ufo(S, 2.8), over: (ctx, W, H_, t) => { if (t > V('hook', 'aliens') - 0.2) beam(ctx, W, H_, t); }, cast: [E((t) => ({ bob: Math.max(0, t - V('hook', 'took')) * 0.8, eyes: 'wide', mouth: 'o', arms: [2.4, 2.4] }))],
          tags: [[0, 0.35, 1.0, "DIDN'T DIE", V('hook', "didn't"), 'red']] },
        one: { set: 'space', cam: 'mid', cast: [AL(-1.0, -0.4, 0.4, { arms: [0.15, 2.4] }), AL(1.0, -0.4, -0.4, {}), E({ mouth: 'grin' })], tags: [[0, 0.35, 0.9, '1 SONG', V('one', 'one'), 'yellow']] },
        years: { set: 'stage', opt: { banner: 'LIVE ON MARS' }, cam: 'wide', cast: [E((t) => ({ arms: [1.5 + Math.sin(t * 8), 1.5 - Math.sin(t * 8)], bob: Math.abs(Math.sin(t * 8)) * 0.1, hair: 'pompadour', hairCol: [200, 200, 200], sweat: true })), AL(-1.5, 0.6, 0.6, { arms: [2.6, 2.6] }), AL(1.5, 0.6, -0.6, { arms: [2.6, 2.6] })],
          tags: [[0, 2.6, -0.6, '40 YEARS', V('years', 'forty'), 'red'], [0, 0.35, 1.0, 'ENCORE!', V('years', 'encore'), 'orange']] },
        count: { set: 'stage', opt: { banner: 'ENCORE #12,000' }, cam: 'close', cast: [E({ hair: 'pompadour', hairCol: [230, 230, 230], eyes: 'sleepy', mouth: 'open', sweat: true })], tags: [[0, 0.5, 0.6, '12,000', V('count', 'twelve'), 'red']] },
        twist: { set: 'space', cam: 'wide', cast: [AL(-1.0, -0.2, 0.4, { eyes: 'closed', mouth: 'o' }), AL(0, -0.6, 0, { eyes: 'closed', mouth: 'o' }), AL(1.0, -0.2, -0.4, { eyes: 'closed', mouth: 'o' }), E({ z: 0.8, hair: 'pompadour', hairCol: [230, 230, 230], mouth: 'grin' })],
          tags: [[0, 0.35, 1.2, 'ALIENS: TIRED', V('twist', 'were'), 'blue', 1.1]] },
        punch: { set: 'street', opt: { signs: ['BURGERS', 'DRIVE-THRU', 'BURGERS', 'PAWN'] }, cam: 'mid', cast: [E({ hair: 'pompadour', hairCol: [230, 230, 230], hat: 'cap', hold: 'phone', mouth: 'grin', arms: [0.15, 1.6] })],
          tags: [[0, 2.5, -0.4, 'DRIVE-THROUGH', V('punch', 'drive-through'), 'orange', 1.1], [0, 0.35, 0.9, 'TAKING REQUESTS', V('punch', 'requests'), 'yellow', 1.2]] },
        cta: { set: 'desert', cam: 'wide', props: (S) => ufo(S, 2.8), over: beam, cast: [], tags: [[0, 0.35, 1.0, 'ONE NAME', V('cta', 'name'), 'red']] },
      };
    },
  });
