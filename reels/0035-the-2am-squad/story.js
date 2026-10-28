  // ==================== 0035 "The 2am squad." ====================
  const pad = (S, t, u, d) => { if (!d) return; const m = midHands(d); S.rbox((p) => add(p, [m[0], m[1] + 0.02, m[2] + 0.04]), 0.09, 0.025, 0.05, [30, 30, 36], { bevel: 0.5 }); };
  const head = (S, d, col = [40, 200, 120]) => { if (!d) return; S.ball(add(d.head, [0, 0.2, 0]), [0.2, 0.05, 0.2], col); };
  const PADS = (S, t, u, he, she) => { pad(S, t, u, he); pad(S, t, u, she); head(S, he); head(S, she, [240, 80, 160]); };
  const TV = { cam: 'wide', room: { table: true } };
  makeCouch({
    keys: ['two', 'squad', 'sleep', 'controller', 'game', 'first', 'carries', 'love', 'tomorrow', 'kick', 'couch'],
    shots: ({ V }) => ({
      hook: { ...TV, he: { outfit: 'pajamas', arms: 'phone', face: { mouth: 'open', brows: -0.8 } }, she: { outfit: 'pajamas', arms: 'clasp', face: { eyes: 'closed', mouth: 'flat', brows: 0.6 } }, props: (S, t, u, he) => { pad(S, t, u, he); head(S, he); },
        fx: [{ k: 'card', text: '2:00 AM', at: V('hook', 'Two'), y: 990, fill: '#2a1a3a' }, { k: 'q', text: '!!', who: 'he', at: V('hook', 'shouting') }] },
      her: { cam: 'her', she: { outfit: 'pajamas', arms: 'phone', face: { mouth: 'flat', lids: 0.6, brows: -0.8 } }, props: (S, t, u, he, she) => pad(S, t, u, she), fx: [{ k: 'smug', who: 'she', at: V('her', 'grabs') }] },
      join: { ...TV, he: { outfit: 'pajamas', arms: 'phone', face: { mouth: 'o', eyes: 'wide', look: [0.6, 0] } }, she: { outfit: 'pajamas', arms: 'phone', face: { mouth: 'smile', lids: 0.5 } }, props: PADS, fx: [{ k: 'card', text: 'PLAYER 2 HAS JOINED', at: V('join', 'joins'), y: 990, fill: '#1c1a2a', px: 36 }] },
      wins: { cam: 'her', she: { outfit: 'pajamas', arms: 'cheer', face: { eyes: 'happy', mouth: 'open' } }, fx: [{ k: 'stamp', text: 'MVP', x: 360, y: 1000, at: V('wins', 'carries'), col: '#ffd23f' }, { k: 'sparkle', who: 'she', at: V('wins', 'carries') }] },
      squad: { cam: 'him', he: { outfit: 'pajamas', arms: 'phone', face: { mouth: 'flat', lids: 0.5 } }, props: (S, t, u, he) => { pad(S, t, u, he); head(S, he); }, fx: [{ k: 'bubble', text: 'SQUAD: bring her back', x: 360, y: 840, at: V('squad', 'love'), side: 1 }, { k: 'hearts', at: V('squad', 'love'), n: 3, y: 600 }] },
      twist: { cam: 'him', he: { outfit: 'pajamas', arms: 'phone', face: { eyes: 'wide', mouth: 'open', brows: 0.9 } }, props: (S, t, u, he) => pad(S, t, u, he), twist: V('twist', 'kick'),
        fx: [{ k: 'card', text: 'YOU WERE KICKED FROM THE SQUAD', at: V('twist', 'kick'), y: 1000, fill: '#c0182a', col: '#fff', px: 32 }] },
      close: { ...TV, he: { outfit: 'pajamas', sit: true, x: -0.9, arms: 'slump', face: { eyes: 'closed', mouth: 'frown' } }, she: { outfit: 'pajamas', arms: 'phone', face: { mouth: 'smile', lids: 0.4, brows: -0.6 } }, props: (S, t, u, he, she) => { pad(S, t, u, she); head(S, she, [240, 80, 160]); },
        fx: [{ k: 'zzz', who: 'he', at: V('close', 'sleeps') }] },
    }),
  });
