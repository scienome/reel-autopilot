  // ==================== 0018 "The usual." ====================
  const R = { set: 'restaurant' };
  const EX = { who: 'ex', x: 1.95, z: -0.15, sit: true, yaw: -0.7 };
  const WAITER = (o = {}) => ({ who: 'waiter', x: 0, z: 0.75, sit: false, yaw: 0, arms: 'hold', ...o });
  makeCouch({
    keys: ['anniversary', 'next', 'ex', 'waving', 'usual', 'never', 'friday', 'sir', 'blonde', 'one', 'each'],
    shots: ({ V }) => ({
      hook: { ...R, cam: 'wide', he: { outfit: 'suit', arms: 'clasp', face: { eyes: 'happy', mouth: 'smile' } }, she: { outfit: 'dress', arms: 'clasp', face: { mouth: 'smile' } },
        fx: [{ k: 'hearts', at: V('hook', 'Anniversary'), n: 4, y: 600 }, { k: 'q', x: 600, y: 760, at: V('hook', 'next') }] },
      ex: { ...R, cam: [[1.55, 1.5, 1.7], [1.95, 1.1, -0.15], [1.6, 1.5, 1.45], [1.95, 1.12, -0.15]], extras: [{ ...EX, arms: 'cheer', face: { mouth: 'smile', lids: 0.3 } }], fx: [{ k: 'stamp', text: 'THE EX', x: 360, y: 1000, at: V('ex', 'Her'), col: '#f47aa6' }] },
      waiter: { ...R, cam: 'wide', he: { outfit: 'suit', arms: 'rest', face: { mouth: 'flat' } }, she: { outfit: 'dress', arms: 'rest', face: { mouth: 'o', eyes: 'wide' } }, extras: [WAITER({ x: 0.15, face: { mouth: 'smile' } })],
        fx: [{ k: 'bubble', text: 'The usual?', at: V('waiter', 'The', 2), side: 1, x: 470, y: 640 }] },
      him: { ...R, cam: 'him', he: { outfit: 'suit', arms: 'rest', face: { lids: 0.4, mouth: 'flat', brows: -0.7, look: [0.6, 0] } }, fx: [{ k: 'q', who: 'he', at: V('him', 'usual') }] },
      she: { ...R, cam: 'her', she: { outfit: 'dress', arms: 'shrug', face: { eyes: 'wide', mouth: 'smile', brows: 0.6 } }, fx: [{ k: 'sweat', who: 'she', at: V('she', 'never') }] },
      same: { ...R, cam: [[0.25, 1.8, 2.8], [0.15, 1.45, 0.75], [0.22, 1.8, 2.5], [0.15, 1.48, 0.75]], extras: [WAITER({ x: 0.15, face: { mouth: 'smile', eyes: 'happy' } })], nope: V('same', 'Friday'),
        fx: [{ k: 'card', text: 'TABLE 7, FRIDAY', at: V('same', 'Same'), y: 1000, fill: '#1c1a2a' }] },
      twist: { ...R, cam: 'him', he: { outfit: 'suit', arms: 'clasp', face: { eyes: 'wide', mouth: 'o', brows: 0.9 } }, twist: V('twist', 'with'),
        fx: [{ k: 'sweat', who: 'he', at: V('twist', 'And') }, { k: 'stamp', text: 'BUSTED', x: 360, y: 1010, at: V('twist', 'with'), col: '#ff4a4a', rot: -0.1 }] },
      close: { ...R, cam: 'wide', opt: { table: false }, he: { outfit: 'suit', sit: true, x: -1.0, arms: 'slump', face: { mouth: 'frown' } }, she: { outfit: 'dress', sit: true, x: 1.0, arms: 'clasp', yaw: -0.5, face: { mouth: 'flat', lids: 0.5 } },
        extras: [WAITER({ x: 0, z: -0.75, arms: 'shrug', face: { mouth: 'o' } })], fx: [{ k: 'card', text: 'TABLE FOR ONE. EACH.', at: V('close', 'Table'), y: 1000, fill: '#5a1020' }] },
    }),
  });
