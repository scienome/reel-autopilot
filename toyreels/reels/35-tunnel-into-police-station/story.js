  // ==================== Heists gone wrong: the tunnel ====================
  makeComedy({
    badge: 'HEISTS GONE WRONG', badgeCol: '#c8781a',
    captions: { say: { 'three hundred and sixty five': '365' }, keys: { tunnel: 'o', year: 'y', wrong: 'r', perfect: 'g', map: 'y', upside: 'r', digging: 'o', police: 'r', christmas: 'g', arrested: 'r', impressed: 'y', free: 'r', forever: 'r' } },
    beats: ({ V }) => {
      const R1 = (ex) => ['robber', -0.6, 0.2, 0.3, Object.assign({ hold: 'hammer' }, ex)], R2 = (ex) => ['robber', 0.6, 0.2, -0.3, Object.assign({ balaclava: [60, 30, 30], hold: 'bag' }, ex)];
      const hole = (S, x, z, r = 0.45) => S.cyl((p) => add(p, [x, 0.005, z]), r, 0.01, [20, 14, 10], 20);
      const dirt = (S, n) => { for (let i = 0; i < n; i++) S.box((p) => add(p, [-1.6 + (i % 4) * 0.35, 0.08 + Math.floor(i / 4) * 0.16, -0.9]), 0.15, 0.08, 0.15, [110, 80, 50], { bevel: 0.3 }); };
      const map = (S, flip) => plate(S, 0, 1.3, 0.3, 0.5, 0.36, (c, w, h) => { c.fillStyle = '#f2e6c0'; c.fillRect(0, 0, w, h); c.save(); if (flip) { c.translate(w, h); c.rotate(Math.PI); } c.fillStyle = '#c82020'; c.font = FONT(900, h * 0.2); c.textAlign = 'center'; c.fillText('BANK →', w / 2, h * 0.35); c.strokeStyle = '#3a6ad0'; c.lineWidth = w * 0.02; c.beginPath(); c.moveTo(w * 0.1, h * 0.8); c.lineTo(w * 0.9, h * 0.6); c.stroke(); c.restore(); });
      const cop = (x, ex) => ['cop', x, -0.5, 0, (t) => Object.assign({ hat: t > V('twist', 'christmas') ? 'santa' : 'police' }, ex)];
      return {
        hook: { set: 'street', opt: { night: 1, signs: ['BANK', 'POLICE', 'DONUTS', 'PAWN'] }, cam: 'wide', shake: V('hook', 'wrong'), props: (S) => hole(S, 0, 0.3),
          cast: [R1({ hold: 'hammer', arms: [2.4, 0.4], eyes: 'wide' }), R2({ mouth: 'grin' })], booms: [[0, 0.4, 0.3, V('hook', 'wrong'), 0.7]],
          tags: [[0, 2.45, -0.5, '1 YEAR', V('hook', 'year'), 'yellow'], [0, 0.35, 0.9, 'WRONG BUILDING', V('hook', 'wrong'), 'red', 1.1]] },
        plan: { set: 'bank', opt: { sign: 'BANK' }, cam: 'mid', props: (S, t) => map(S, t > V('plan', 'upside')),
          cast: [R1({ arms: [1.2, 1.0], mouth: 'grin' }), R2({ arms: [0.15, 1.0], mouth: 'grin' })],
          tags: [[-0.8, 2.45, -0.4, 'SHOVELS ✓', V('plan', 'shovels'), 'green'], [0.8, 2.45, -0.4, 'MAP ✓', V('plan', 'map'), 'green'], [0, 0.35, 0.8, 'UPSIDE DOWN', V('plan', 'upside'), 'red']], sfx: [['paper', V('plan', 'map'), { gain: 0.5 }]] },
        dig: { set: 'graveyard', cam: 'low', props: (S, t, u) => dirt(S, Math.floor(u * 16)),
          cast: [['robber', -0.6, 0.2, 0.3, (t) => ({ hold: 'hammer', arms: [1.2 + Math.sin(t * 12), 0.4], bob: Math.abs(Math.sin(t * 12)) * 0.05, sweat: true })], ['robber', 0.6, 0.2, -0.3, (t) => ({ balaclava: [60, 30, 30], hold: 'hammer', arms: [1.2 + Math.cos(t * 12), 0.4], sweat: true })]],
          tags: [[0, 2.45, -0.5, 'DAY 365', V('dig', 'digging'), 'orange'], [0, 0.35, 0.8, 'DAYS OFF: 0', V('dig', 'off'), 'red']], sfx: [['count', V('dig', 'three'), { gain: 0.4 }]] },
        twist: { set: 'office', opt: { desk: false }, cam: 'wide', shake: V('twist', 'police') - 0.2, props: (S) => hole(S, 0, 0.5),
          cast: [cop(-1.4, { arms: [2.6, 2.6], mouth: 'open', eyes: 'wide' }), cop(1.4, { arms: [0.15, 1.6], hold: 'phone', mouth: 'o' }), ['robber', 0, 0.5, 0, (t) => ({ bob: H.lerp(-1.4, 0, H.clamp((t - V('twist', 'police') + 0.3) * 3)), eyes: 'wide', mouth: 'o', hold: 'hammer' })]],
          booms: [[0, 0.5, 0.5, V('twist', 'police') - 0.2, 0.6]],
          tags: [[0, 2.5, -0.6, 'POLICE STATION', V('twist', 'police'), 'red', 1.1], [0, 0.35, 1.0, '🎄 PARTY', V('twist', 'christmas'), 'green']], sfx: [['bell', V('twist', 'christmas'), { gain: 0.4 }]] },
        punch: { set: 'street', opt: { signs: ['POLICE', 'CAR PARK', 'DONUTS'] }, cam: 'mid', props: (S) => { hole(S, -0.5, 0.4, 0.35); hole(S, 0.6, 0.4, 0.3); },
          cast: [R1({ hat: 'police', hold: 'hammer', arms: [1.6, 0.4], sweat: true, mouth: 'frown' }), R2({ hat: 'police', hold: 'hammer', arms: [1.6, 0.4], sweat: true, mouth: 'frown' }), ['cop', 0, -1.1, 0, { mouth: 'grin', arms: [0.15, 1.6], hold: 'phone' }]],
          tags: [[0, 2.45, -1.0, 'IMPRESSED', V('punch', 'impressed'), 'yellow'], [0, 0.35, 0.8, 'FOREVER', V('punch', 'forever'), 'red']] },
        cta: { set: 'bank', opt: { sign: 'BANK' }, cam: 'mid', props: (S) => map(S, true), cast: [R1({ arms: [1.2, 1.0], mouth: 'grin' })], tags: [[0, 0.35, 0.8, 'CHECK THE MAP', V('cta', 'map'), 'yellow']] },
      };
    },
  });
