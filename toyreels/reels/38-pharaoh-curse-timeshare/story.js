  // ==================== The curse files: the timeshare ====================
  makeComedy({
    badge: 'MONSTER PROBLEMS', badgeCol: '#6a1a2a',
    captions: { say: { ninety: '90', 'three thousand': '3,000' }, keys: { cursed: 'r', curse: 'r', timeshare: 'y', ninety: 'o', exits: 'r', laser: 'r', pie: 'y', snacks: 'o', three: 'r', signed: 'r', all: 'r', still: 'r', paying: 'o', pyramid: 'y' } },
    beats: ({ V }) => {
      const arc = (x, z, rot, ex) => ['cowboy', x, z, rot, Object.assign({ hat: 'cowboy', hold: null, mustache: null, shirt: [200, 170, 110], pants: [140, 110, 70], mouth: 'o', eyes: 'wide' }, ex)];
      const team = (ex = {}) => [arc(-1.2, 0.5, 0.3, ex), arc(0, 0.7, 0, Object.assign({ hair: 'bob', hat: null }, ex)), arc(1.2, 0.5, -0.3, Object.assign({ mustache: 'big' }, ex))];
      const M = (ex) => ['mummy', 0, -0.9, 0, ex];
      const chart = (S) => plate(S, -1.2, 1.7, -1.4, 0.9, 0.7, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); const cx = w / 2, cy = h * 0.55, r = h * 0.36; [['#c82020', 0, 4.4], ['#3a6ad0', 4.4, 5.6], ['#ffd23f', 5.6, TAU]].forEach(([col, a, b]) => { c.fillStyle = col; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, r, a, b); c.fill(); }); c.fillStyle = '#222'; c.font = FONT(900, h * 0.12); c.textAlign = 'center'; c.fillText('YOUR MONEY', w / 2, h * 0.14); });
      return {
        hook: { set: 'desert', cam: 'wide', props: (S) => pyramid(S, 0, -2.4, 1.0, 0), cast: [...team(), M((t) => ({ hide: t < V('hook', 'timeshare') - 0.2, hold: 'briefcase', mouth: 'grin', arms: [0.15, 1.0] }))],
          flash: [V('hook', 'timeshare')], tags: [[0, 2.5, -0.9, 'CURSED', V('hook', 'cursed'), 'red'], [0, 0.35, 1.1, 'TIMESHARE', V('hook', 'timeshare'), 'yellow']] },
        b1: { set: 'stage', opt: { banner: 'PYRAMID RESORTS', audience: false }, cam: 'wide', cast: [...team({ eyes: 'sleepy', mouth: 'flat' }), M({ arms: [2.2, 0.15], mouth: 'grin' })],
          tags: [[0, 2.5, -0.9, '90 MIN', V('b1', 'ninety'), 'orange'], [0, 0.35, 1.1, 'EXITS: 0', V('b1', 'exits'), 'red']], sfx: [['slap', V('b1', 'exits'), { gain: 0.5 }]] },
        b2: { set: 'stage', opt: { banner: 'PYRAMID RESORTS', audience: false }, cam: 'mid', props: chart, over: (ctx, W, H_, t) => { if (t < V('b2', 'laser')) return; ctx.fillStyle = 'rgba(255,40,40,0.9)'; ctx.beginPath(); ctx.arc(W * 0.3 + Math.sin(t * 7) * 60, H_ * 0.42 + Math.cos(t * 5) * 40, 12, 0, TAU); ctx.fill(); },
          cast: [M({ x: 0.7, rot: -0.4, hold: 'remote', arms: [0.15, 2.0], mouth: 'grin' })], tags: [[0.7, 0.35, 0.6, 'PIE CHART', V('b2', 'pie'), 'yellow']], sfx: [['blip', V('b2', 'laser'), { gain: 0.4 }]] },
        b3: { set: 'stage', opt: { banner: 'FREE SNACKS', audience: false }, cam: 'mid', props: (S) => { S.cyl((p) => add(p, [0, 0.45, 0.4]), 0.35, 0.04, [230, 230, 236], 18); for (let i = 0; i < 5; i++) S.box((p) => add(p, [-0.2 + i * 0.1, 0.52, 0.4]), 0.04, 0.03, 0.04, [90, 110, 60], { bevel: 0.3 }); },
          cast: [arc(-0.6, 0.6, 0.3, { mouth: 'frown', eyes: 'x' }), M({ x: 0.7, z: 0, mouth: 'grin', arms: [0.15, 1.3] })], tags: [[0, 0.35, 1.0, '3,000 YEARS OLD', V('b3', 'three'), 'red', 1.1]] },
        twist: { set: 'office', cam: 'mid', props: (S) => plate(S, 0, 0.86, -1.3, 0.5, 0.36, (c, w, h) => { c.fillStyle = '#f2e6c0'; c.fillRect(0, 0, w, h); c.strokeStyle = '#333'; c.lineWidth = 2; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(w * 0.1, h * (0.15 + i * 0.13)); c.lineTo(w * 0.9, h * (0.15 + i * 0.13)); c.stroke(); } }, [242, 230, 192], -Math.PI / 2),
          cast: [...team({ mouth: 'grin', eyes: 'happy', hold: 'phone' }), M({ z: -1.6, mouth: 'grin', arms: [2.4, 2.4] })], tags: [[0, 2.5, -1.3, 'SIGNED', V('twist', 'signed'), 'red'], [0, 0.35, 1.1, 'ALL OF THEM', V('twist', 'all'), 'orange']], sfx: [['stamp', V('twist', 'signed'), { gain: 0.6 }]] },
        punch: { set: 'desert', cam: 'wide', props: (S) => pyramid(S, 0, -2.0, 1.2, 1), cast: [arc(-1.0, 0.6, 0.3, { eyes: 'sleepy', mouth: 'frown', hair: 'wild', hairCol: [240, 240, 240] }), arc(0.2, 0.8, 0, { scale: 0.7, mouth: 'frown' }), arc(1.1, 0.6, -0.3, { scale: 0.6, mouth: 'frown' })],
          tags: [[0, 2.5, -1.0, 'STILL PAYING', V('punch', 'still'), 'red'], [0, 0.35, 1.1, '2 WEEKS A YEAR', V('punch', 'two'), 'yellow']] },
        cta: { set: 'stage', opt: { banner: 'SIGN HERE', audience: false }, cam: 'mid', cast: [M({ z: 0, mouth: 'grin', hold: 'briefcase', arms: [0.15, 1.0] })], tags: [[0, 0.35, 0.8, 'BE HONEST', V('cta', 'honest'), 'yellow']] },
      };
    },
  });
