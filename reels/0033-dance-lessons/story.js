  // ==================== 0033 "Dance lessons." ====================
  const GAR = { set: 'party' };
  const lock = (S) => { S.rbox((p) => add(p, [0, 1.1, -1.18]), 0.9, 1.1, 0.04, [120, 110, 100], { bevel: 0.1, bg: true }); S.rbox((p) => add(p, [0.3, 1.1, -1.12]), 0.06, 0.08, 0.03, [240, 200, 60], { bevel: 0.3 }); };
  const TEACH = (o = {}) => ({ who: 'exgirl', x: 0.62, z: -0.3, sit: false, yaw: -0.4, arms: 'cheer', outfit: 'party', ...o });
  makeCouch({
    keys: ['garage', 'night', 'hours', 'suspicious', 'peeks', 'dance', 'wedding', 'melts', 'shoes', 'teacher', 'ex', 'badly'],
    shots: ({ V }) => ({
      hook: { set: 'street', cam: 'wide', he: { x: 0, z: 0.2, arms: 'hold', face: { mouth: 'smile', lids: 0.4, look: [0.5, 0] } }, she: { hide: true }, props: lock,
        fx: [{ k: 'card', text: 'GARAGE: LOCKED · 2 HRS', at: V('hook', 'locks'), y: 990, fill: '#2a1a3a', px: 36 }] },
      sus: { cam: 'her', he: { hide: true }, she: { arms: 'clasp', face: { mouth: 'flat', lids: 0.6, brows: -0.9 } }, fx: [{ k: 'q', who: 'she', at: V('sus', 'suspicious') }, { k: 'q', text: '??', who: 'she', at: V('sus', 'Very'), dx: -120 }] },
      peek: { set: 'street', cam: 'her', he: { hide: true }, she: { arms: 'reach', face: { eyes: 'wide', mouth: 'o' } }, props: lock, fx: [{ k: 'sparkle', who: 'she', at: V('peek', 'peeks') }] },
      dance: { ...GAR, cam: 'him', he: (t) => ({ outfit: 'suit', arms: [[2.2 + Math.sin(t * 6) * 0.4, -0.4, 0.4], [2.2 - Math.sin(t * 6) * 0.4, -0.4, 0.4]], face: { eyes: 'happy', mouth: 'open' } }), she: { hide: true },
        fx: [{ k: 'stamp', text: 'FOR THE WEDDING', x: 360, y: 1000, at: V('dance', 'wedding'), col: '#ffd23f' }] },
      aww: { cam: 'her', he: { hide: true }, she: { arms: 'cheeks', face: { eyes: 'happy', mouth: 'smile', blush: 0.8 } }, fx: [{ k: 'hearts', at: V('aww', 'melts'), n: 5, y: 600 }] },
      twist: { ...GAR, cam: 'wide', he: { outfit: 'suit', arms: 'hug', face: { mouth: 'smile', eyes: 'happy' } }, she: { hide: true }, extras: [TEACH({ face: { mouth: 'smile', lids: 0.4 } })], twist: V('twist', 'ex'),
        fx: [{ k: 'stamp', text: 'HIS EX', x: 360, y: 1000, at: V('twist', 'ex'), col: '#ff4a4a', rot: -0.1 }] },
      close: { ...GAR, cam: 'wide', he: { outfit: 'suit', arms: 'head', face: { eyes: 'closed', mouth: 'frown', brows: 0.8 } }, she: (t) => ({ outfit: 'party', arms: [[2.4 + Math.sin(t * 8) * 0.5, -0.5, 0.3], [2.4 - Math.sin(t * 8) * 0.5, -0.5, 0.3]], face: { mouth: 'smile', lids: 0.5, brows: -0.7 } }),
        fx: [{ k: 'card', text: 'NEW TEACHER. ON PURPOSE.', at: V('close', 'Badly'), y: 1000, fill: '#5a1020', px: 36 }, { k: 'sweat', who: 'he', at: V('close', 'purpose') }] },
    }),
  });
