  // ==================== 0038 "The best man's speech." ====================
  const WD = { set: 'wedding' };
  const mic = (S, t, u, d) => { if (!d) return; const m = d.hands[1].p; S.cyl((p) => add(rotX(p, -0.4), [m[0], m[1] + 0.02, m[2] + 0.04]), 0.025, 0.14, [40, 40, 48], 8); S.ball([m[0], m[1] + 0.16, m[2] + 0.1], 0.04, [80, 80, 90]); };
  const BRO = (o = {}) => ({ who: 'bro', x: 0, z: 0.2, sit: false, outfit: 'suit', arms: [[0.8, 0.05, 1.5], [0.35, 0.18, 0.7]], face: { mouth: 'open', eyes: 'happy' }, ...o });
  makeCouch({
    keys: ['speech', 'best', 'man', 'mic', 'cried', 'cooking', 'ikea', 'six', 'laughing', 'groom', 'bride', 'husband', 'cake'],
    shots: ({ V }) => ({
      hook: { ...WD, cam: 'wide', he: { outfit: 'wedding', arms: 'clasp', face: { mouth: 'smile' } }, she: { outfit: 'bride', arms: 'clasp', face: { mouth: 'smile' } }, extras: [BRO({ x: 0, z: 0.5 })], props: (S, t, u, he, she, ppl) => {},
        fx: [{ k: 'card', text: 'BEST MAN SPEECH', at: V('hook', 'best'), y: 990, fill: '#2a1a3a' }] },
      story: { ...WD, cam: 'on', on: [0, 1.75, 0.5], he: { hide: true }, she: { hide: true }, extras: [BRO({ z: 0.5 })], fx: [{ k: 'card', text: 'CRIED AT A COOKING SHOW', at: V('story', 'cried'), y: 1000, fill: '#5a1020', px: 36 }] },
      more: { ...WD, cam: 'on', on: [0, 1.75, 0.5], he: { hide: true }, she: { hide: true }, extras: [BRO({ z: 0.5, arms: 'cheer' })], fx: [{ k: 'stamp', text: 'IKEA: 6 HOURS', x: 360, y: 1000, at: V('more', 'six'), col: '#ffd23f' }] },
      laugh: { ...WD, cam: 'him', he: { outfit: 'wedding', arms: 'clasp', face: { mouth: 'flat', lids: 0.6, brows: -0.9, blush: 0.6 } }, she: { hide: true }, fx: [{ k: 'sweat', who: 'he', at: V('laugh', 'Except') }] },
      her: { ...WD, cam: 'her', he: { hide: true }, she: { outfit: 'bride', arms: [[0.8, 0.05, 1.5], [0.35, 0.18, 0.7]], face: { mouth: 'smile', lids: 0.5, brows: -0.6 } }, fx: [{ k: 'smug', who: 'she', at: V('her', 'bride') }] },
      twist: { ...WD, cam: 'wide', he: { outfit: 'wedding', arms: 'head', face: { eyes: 'wide', mouth: 'open', brows: 0.9, blush: 0.8 } }, she: { outfit: 'bride', arms: 'cheer', face: { mouth: 'open', eyes: 'happy' } }, extras: [BRO({ x: 0, z: 0.5, arms: 'cheeks', face: { eyes: 'wide', mouth: 'o', blush: 0.8 } })], twist: V('twist', 'hands'),
        fx: [{ k: 'card', text: 'SAME SHOW. HOLDING HANDS.', at: V('twist', 'Holding'), y: 1000, fill: '#5a1020', px: 36 }] },
      close: { ...WD, cam: 'her', he: { hide: true }, she: { outfit: 'bride', arms: 'clasp', face: { mouth: 'smile', eyes: 'happy' } }, fx: [{ k: 'bubble', text: 'Cake, anyone?', x: 360, y: 840, at: V('close', 'Cake'), side: 1 }, { k: 'hearts', at: V('close', 'Cake'), n: 3, y: 600 }] },
    }),
  });
