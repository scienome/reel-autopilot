  // ==================== 0026 "The plus one." ====================
  const WED = { set: 'wedding' };
  const BRIDE = (o = {}) => ({ who: 'exgirl', x: 0, z: -0.3, sit: false, outfit: 'bride', dress: [252, 252, 252], shirt: [250, 250, 250], pants: [250, 250, 250], face: { mouth: 'smile', lids: 0.3 }, arms: 'clasp', ...o });
  const GROOM = (o = {}) => ({ who: 'ex', x: 0.45, z: -0.3, sit: false, outfit: 'wedding', face: { mouth: 'smile', lids: 0.4 }, arms: 'clasp', ...o });
  makeCouch({
    keys: ['ex', 'wedding', 'fine', 'stunning', 'staring', 'bored', 'groom', 'freezes', 'winks', 'silent', 'radio', 'year'],
    shots: ({ V }) => ({
      hook: { set: 'car', cam: 'wide', he: { outfit: 'suit', arms: [[1.2, 0.05, 0.4], [1.2, 0.05, 0.4]], face: { mouth: 'smile', lids: 0.2 } }, she: { outfit: 'dress', arms: 'clasp', face: { mouth: 'flat', lids: 0.6, brows: -0.7 } },
        fx: [{ k: 'bubble', text: "It'll be fine.", who: 'he', at: V('hook', 'fine'), side: -1 }, { k: 'card', text: "HIS EX'S WEDDING", at: V('hook', 'wedding'), y: 990, fill: '#2a1a3a' }] },
      ex: { ...WED, cam: 'on', on: [0, 1.75, -0.3], he: { hide: true }, she: { hide: true }, extras: [BRIDE()], fx: [{ k: 'sparkle', x: 360, y: 640, at: V('ex', 'stunning') }] },
      her: { ...WED, cam: 'wide', he: { outfit: 'suit', x: -1.0, z: 0.6, yaw: 0.6, arms: 'clasp', face: { mouth: 'o', eyes: 'happy', blush: 0.4 } }, she: { outfit: 'dress', x: 1.0, z: 0.6, yaw: -0.6, arms: 'phone', face: { mouth: 'flat', lids: 0.7 } }, sheHold: true,
        extras: [BRIDE()], fx: [{ k: 'zzz', who: 'she', at: V('her', 'bored') }] },
      groom: { ...WED, cam: 'her', she: { outfit: 'dress', arms: 'clasp', face: { eyes: 'wide', mouth: 'o', brows: 0.9 } }, he: { hide: true }, fx: [{ k: 'q', text: '!', who: 'she', at: V('groom', 'freezes') }], flash: [V('groom', 'freezes')] },
      twist: { ...WED, cam: 'on', on: [0.45, 1.75, -0.3], he: { hide: true }, she: { hide: true }, extras: [GROOM({ face: { eyes: 'happy', mouth: 'smile', lids: 0.5 } })], twist: V('twist', 'ex'),
        fx: [{ k: 'stamp', text: 'HER EX', x: 360, y: 1000, at: V('twist', 'ex'), col: '#ff4a4a', rot: -0.1 }, { k: 'heart', x: 470, y: 560, at: V('twist', 'winks') }] },
      vows: { ...WED, cam: 'wide', he: { outfit: 'suit', x: -1.0, z: 0.6, yaw: 0.6, arms: 'clasp', face: { mouth: 'frown', brows: -0.8 } }, she: { outfit: 'dress', x: 1.0, z: 0.6, yaw: -0.6, arms: 'clasp', face: { mouth: 'smile', eyes: 'happy', blush: 0.4 } },
        extras: [BRIDE({ x: -0.4 }), GROOM()], fx: [{ k: 'sweat', who: 'he', at: V('vows', 'staring') }] },
      car: { set: 'car', cam: 'wide', he: { outfit: 'suit', arms: [[1.2, 0.05, 0.4], [1.2, 0.05, 0.4]], face: { mouth: 'flat', lids: 0.6, brows: -0.8 } }, she: { outfit: 'dress', arms: 'clasp', yaw: -0.7, face: { mouth: 'flat', lids: 0.6 } }, fx: [{ k: 'zzz', x: 360, y: 640, at: V('car', 'Silent') }] },
      close: { set: 'car', cam: 'her', she: { outfit: 'dress', arms: 'clasp', face: { mouth: 'smile', lids: 0.5, brows: -0.6 } }, fx: [{ k: 'bubble', text: 'Same time next year?', x: 380, y: 820, at: V('close', 'Same'), side: 1 }, { k: 'smug', who: 'she', at: V('close', 'year') }] },
    }),
  });
