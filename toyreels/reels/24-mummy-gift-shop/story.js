  // ==================== History gone wrong: the mummy in the gift shop ====================
  makeComedy({
    badge: 'HISTORY GONE WRONG', badgeCol: '#2a4a9a',
    captions: { say: { 'three thousand': '3,000', 'eight ninety nine': '$8.99', 'four hundred percent': '400%' }, keys: { pharaoh: 'y', gift: 'o', shop: 'o', keyring: 'y', wife: 'y', towel: 'r', cursed: 'r', sales: 'g', sells: 'g', commission: 'r' } },
    beats: ({ V }) => {
      const M = (ex) => ['mummy', 0, 0.2, 0, Object.assign({ hat: 'crown', hatCol: [230, 190, 60] }, ex)];
      const shelf = (S) => { S.box((p) => add(p, [0, 0.9, -1.6]), 1.6, 0.04, 0.3, [150, 100, 60], { bevel: 0.3 }); S.box((p) => add(p, [0, 0.45, -1.6]), 1.6, 0.04, 0.3, [150, 100, 60], { bevel: 0.3 }); for (let i = 0; i < 7; i++) { S.box((p) => add(p, [-1.3 + i * 0.43, 1.05, -1.6]), 0.1, 0.12, 0.08, [[230, 190, 60], [60, 120, 200], [200, 60, 60]][i % 3], { bevel: 0.3 }); pyramid(S, -1.3 + i * 0.43, -1.6, 0.12, 0); } };
      return {
        hook: { set: 'museum', opt: { wall: '#8a6a3a' }, cam: 'mid', props: shelf,
          cast: [M({ arms: [1.5, 1.5], eyes: 'wide' })],
          tags: [[0, 2.45, -0.4, 'GIFT SHOP', V('hook', 'gift'), 'yellow']], sfx: [['riser', 0.1, { dur: 0.6, gain: 0.4 }]] },
        tomb: { set: 'museum', opt: { wall: '#8a6a3a' }, cam: 'close', props: (S) => { shelf(S); pyramid(S, 0.35, 0.4, 0.25, 1); },
          cast: [M({ x: -0.3, arms: [0.15, 1.0] })], tags: [[0.35, 0.95, 0.4, '$8.99', V('tomb', 'eight'), 'red']] },
        wife: { set: 'museum', opt: { wall: '#8a6a3a' }, cam: 'mid',
          props: (S) => plate(S, 0.6, 1.3, 0.2, 0.3, 0.4, (c, w, h) => { c.fillStyle = '#f4f0e0'; c.fillRect(0, 0, w, h); c.fillStyle = '#16161c'; c.fillRect(w * 0.3, h * 0.15, w * 0.4, h * 0.35); c.fillStyle = '#d8b088'; c.fillRect(w * 0.36, h * 0.3, w * 0.28, h * 0.25); c.fillStyle = '#e0b030'; c.fillRect(w * 0.25, h * 0.6, w * 0.5, h * 0.08); }, [240, 236, 220]),
          cast: [M({ x: -0.5, eyes: 'x', mouth: 'open', arms: [2.4, 2.4] })], tags: [[0.6, 0.35, 0.6, 'TEA TOWEL', V('wife', 'towel'), 'red']] },
        curse: { set: 'desert', cam: 'low', shake: V('curse', 'cursed'),
          cast: [M({ arms: [2.6, 2.6], eyes: 'angry', mouth: 'open' })],
          over: (ctx, W, H_, t) => { if (t > V('curse', 'cursed')) { ctx.fillStyle = `rgba(80,255,120,${0.15 + 0.1 * Math.sin(t * 20)})`; ctx.fillRect(0, 0, W, H_); } },
          tags: [[0, 0.35, 0.6, 'CURSED', V('curse', 'cursed'), 'green']], sfx: [['glitch', V('curse', 'cursed'), { gain: 0.6 }], ['riser', V('curse', 'cursed') - 0.4, { dur: 0.4, gain: 0.5 }]] },
        twist: { set: 'museum', opt: { wall: '#8a6a3a' }, cam: 'wide', props: shelf,
          cast: [-1.4, -0.5, 0.5, 1.4].map((x, i) => [null, x, 0.5, Math.PI, (t) => ({ shirt: [[200, 60, 90], [60, 120, 200], [240, 180, 40], [80, 170, 90]][i], hair: 'short', walk: t * 6 })]),
          tags: [[0, 2.45, -0.4, 'SALES +400%', V('twist', 'sales'), 'green']], sfx: [['coin', V('twist', 'sales'), { gain: 0.6 }], ['coin', V('twist', 'sales') + 0.2, { gain: 0.6 }]] },
        punch: { set: 'museum', opt: { wall: '#8a6a3a' }, cam: 'mid', props: shelf,
          cast: [M({ hat: 'cap', hatCol: [200, 40, 40], shirt: [200, 40, 40], arms: [0.15, 1.2], hold: 'phone', mouth: 'flat', eyes: 'sleepy' })],
          tags: [[0, 0.35, 0.6, 'COMMISSION ONLY', V('punch', 'commission'), 'red']] },
        cta: { set: 'desert', cam: 'mid', cast: [M({ arms: [1.2, 1.2], mouth: 'grin' })], props: (S) => pyramid(S, 0.7, 0.5, 0.25, 1), tags: [[0, 2.45, -0.4, 'BUY ONE?', V('cta', 'buy'), 'yellow']] },
      };
    },
  });
