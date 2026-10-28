  // ==================== 0025 "Mom's lasagna." ====================
  const K2 = { set: 'kitchen' };
  const tray = (x, z, y = 0.98, col = [220, 120, 70]) => (S) => { S.rbox((p) => add(p, [x, y, z]), 0.22, 0.05, 0.15, [200, 200, 206], { bevel: 0.3 }); S.rbox((p) => add(p, [x, y + 0.04, z]), 0.2, 0.025, 0.13, col, { bevel: 0.4 }); };
  const MOM = (o = {}) => ({ who: 'mil', x: -0.62, z: -0.42, sit: false, yaw: 0.2, arms: 'clasp', ...o });
  makeCouch({
    keys: ['famous', 'lasagna', 'secret', 'thirty', 'ten', 'quite', 'italian', 'sunday', 'mine', 'usual', 'restaurant'],
    shots: ({ V }) => ({
      hook: { ...K2, cam: 'wide', he: { hide: true }, she: { hide: true }, extras: [MOM({ x: 0, z: -0.5, outfit: 'apron', face: { mouth: 'smile', lids: 0.4 } })], props: tray(0, -0.7),
        fx: [{ k: 'card', text: 'SECRET RECIPE · 30 YEARS', at: V('hook', 'Secret'), y: 990, fill: '#2a1a3a', px: 36 }] },
      try: { ...K2, cam: 'her', she: { outfit: 'apron', arms: 'hold', face: { mouth: 'frown', brows: 0.7 } }, he: { hide: true }, props: (S, t, u) => { for (let i = 0; i <= Math.floor(4 * u); i++) tray(0.2 + i * 0.12, -0.7, 0.98 + i * 0.03, [160, 90, 60])(S); },
        fx: [{ k: 'stamp', text: 'ATTEMPT 10', x: 360, y: 1000, at: V('try', 'Ten'), col: '#ff6a5a' }, { k: 'sweat', who: 'she', at: V('try', 'make') }] },
      mil: { ...K2, cam: 'on', on: [-0.62, 1.55, -0.42], he: { hide: true }, she: { hide: true }, extras: [MOM({ face: { mouth: 'flat', lids: 0.6, brows: -0.6 } })], fx: [{ k: 'bubble', text: 'Not quite, sweetie.', x: 330, y: 600, at: V('mil', 'Not'), side: -1 }] },
      order: { ...K2, cam: 'her', she: { arms: 'phone', face: { mouth: 'smile', lids: 0.5, brows: -0.6 } }, sheHold: 'food:pizza', he: { hide: true }, fx: [{ k: 'smug', who: 'she', at: V('order', 'orders') }] },
      dinner: { set: 'restaurant', opt: { table: true }, cam: 'wide', he: { arms: 'clasp', face: { mouth: 'smile' } }, she: { arms: 'clasp', face: { mouth: 'smile', lids: 0.4 } }, extras: [MOM({ x: 1.0, z: 0.6, sit: false, yaw: -0.5, arms: 'hold', face: { mouth: 'smile', lids: 0.4 } })], props: tray(0, 0.22, 0.75),
        fx: [{ k: 'stamp', text: 'SUNDAY DINNER', x: 360, y: 1000, at: V('dinner', 'Sunday'), col: '#ffd23f' }] },
      smile: { set: 'restaurant', cam: 'on', on: [0, 1.55, 0.85], he: { hide: true }, she: { hide: true }, extras: [MOM({ x: 0, z: 0.85, yaw: 0, arms: 'hug', face: { eyes: 'happy', mouth: 'smile', blush: 0.4 } })], fx: [{ k: 'hearts', at: V('smile', 'Finally'), n: 3, y: 600 }] },
      twist: { set: 'restaurant', cam: 'wide', he: { arms: 'clasp', face: { mouth: 'o', eyes: 'wide' } }, she: { arms: 'clasp', face: { mouth: 'o', eyes: 'wide' } }, extras: [MOM({ x: -1.0, z: 0.6, yaw: 0.5, arms: 'cheeks', face: { eyes: 'wide', mouth: 'o', blush: 0.8 } }), { who: 'delivery', x: 1.0, z: 0.6, sit: false, yaw: -0.6, arms: 'hold', face: { mouth: 'smile' } }],
        twist: V('twist', 'usual'), fx: [{ k: 'bubble', text: 'Your usual, Mrs Rossi?', x: 430, y: 600, at: V('twist', 'Your'), side: 1 }] },
      close: { set: 'restaurant', cam: 'on', on: [-0.2, 1.5, 0.4], he: { hide: true }, she: { hide: true }, extras: [MOM({ x: -0.2, z: 0.4, yaw: 0.2, arms: 'head', face: { eyes: 'closed', mouth: 'frown', brows: 0.8, blush: 0.6 } })],
        fx: [{ k: 'card', text: 'RECIPE: LUIGI\'S, SINCE 1995', at: V('close', 'restaurant'), y: 1000, fill: '#5a1020', px: 34 }] },
    }),
  });
