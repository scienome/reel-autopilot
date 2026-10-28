  // ==================== 0017 "The sick day." ====================
  const tissues = (S) => { S.rbox((p) => add(p, [-0.15, 0.5, 0.25]), 0.12, 0.07, 0.08, [120, 190, 230], { bevel: 0.3 }); S.ball([-0.15, 0.6, 0.25], [0.05, 0.05, 0.04], [255, 255, 255]); };
  const pizzaBox = (S) => { S.rbox((p) => add(p, [0.05, 0.52, 0.22]), 0.3, 0.02, 0.3, [214, 180, 130], { bevel: 0.2 }); };
  const SICK = { outfit: 'pajamas', arms: 'slump', face: { eyes: 'closed', mouth: 'open', brows: 0.7 } };
  makeCouch({
    keys: ['sick', 'party', 'dying', 'rest', 'freedom', 'announcement', 'doorbell', 'friends', 'soup', 'camera', 'live', 'pizza', 'champ'],
    shots: ({ V }) => ({
      hook: { cam: 'wide', he: SICK, she: { outfit: 'party', arms: 'clasp', face: { mouth: 'flat', lids: 0.35 } }, props: tissues,
        fx: [{ k: 'card', text: 'HER FRIEND\'S PARTY: 8PM', at: V('hook', 'to'), y: 990, fill: '#2a1a3a', px: 36 }] },
      cough: { cam: 'him', he: { ...SICK, arms: 'clasp' }, fx: [{ k: 'sweat', who: 'he', at: V('cough', 'He') }, { k: 'q', text: '*cough*', who: 'he', at: V('cough', 'coughs'), dx: -150 }] },
      she: { cam: 'her', she: { outfit: 'party', arms: 'hug', face: { mouth: 'smile', lids: 0.45, brows: -0.4 } }, fx: [{ k: 'smug', who: 'she', at: V('she', 'Rest') }] },
      free: { cam: 'two', he: { outfit: 'pajamas', arms: 'cheer', face: { eyes: 'happy', mouth: 'open' } }, she: { hide: true }, props: pizzaBox,
        fx: [{ k: 'stamp', text: 'FREEDOM', x: 360, y: 1000, at: V('free', 'Freedom'), col: '#9aff6a' }] },
      party: { set: 'party', cam: 'her', she: { outfit: 'party', arms: 'phone', face: { mouth: 'smile', lids: 0.5, brows: -0.5 } }, he: { hide: true }, sheHold: true,
        extras: [{ who: 'bff', x: 1.5, z: -0.2, yaw: -0.6, face: { mouth: 'o' } }], fx: [{ k: 'bubble', text: 'Who wants soup?', who: 'she', dx: -20, dy: 260, at: V('party', 'she') }] },
      bell: { cam: 'him', he: { outfit: 'pajamas', arms: 'phone', face: { mouth: 'o', eyes: 'wide', look: [0.6, 0] } }, heHold: true, flash: [V('bell', 'Doorbell')],
        fx: [{ k: 'q', text: '!', who: 'he', at: V('bell', 'Doorbell') }] },
      friends: { set: 'living', cam: 'wide', he: { outfit: 'pajamas', arms: 'phone', face: { eyes: 'wide', mouth: 'o', brows: 0.8 } }, heHold: true, she: { hide: true }, props: pizzaBox,
        extras: [{ who: 'bff', x: 0.4, z: 0.55, sit: false, arms: 'hold', face: { mouth: 'smile' } }, { who: 'exgirl', x: 1.05, z: 0.3, sit: false, yaw: -0.4, arms: 'phone', face: { mouth: 'smile', lids: 0.3 } }],
        fx: [{ k: 'stamp', text: 'SOUP', x: 260, y: 1000, at: V('friends', 'With'), col: '#ffd23f' }, { k: 'stamp', text: 'REC', x: 500, y: 1050, at: V('friends', 'And'), col: '#ff4a4a', rot: -0.1 }] },
      live: { cam: 'him', he: { outfit: 'pajamas', arms: 'hold', face: { eyes: 'wide', mouth: 'open', brows: 0.9 } }, heHold: 'food:pizza', twist: V('live', 'He\'s'),
        fx: [{ k: 'card', text: 'LIVE: 2.4K WATCHING', at: V('live', 'Streaming'), y: 990, fill: '#c0182a', px: 36 }, { k: 'sweat', who: 'he', at: V('live', 'controller') }] },
      close: { cam: 'two', he: { outfit: 'pajamas', arms: 'head', face: { eyes: 'closed', mouth: 'frown', brows: 0.8 } }, she: { outfit: 'party', sit: true, arms: 'phone', face: { mouth: 'smile', lids: 0.5 } }, sheHold: true,
        fx: [{ k: 'smug', who: 'she', at: V('close', 'Get') }, { k: 'card', text: 'GET WELL SOON', at: V('close', 'champ'), y: 1000, fill: '#2a1a3a' }] },
    }),
  });
