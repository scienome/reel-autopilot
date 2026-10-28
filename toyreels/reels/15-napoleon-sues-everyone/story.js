  // ==================== History gone wrong: Napoleon sues everyone ====================
  makeComedy({
    badge: 'HISTORY GONE WRONG', badgeCol: '#2a4a9a',
    captions: { say: { 'two hundred': '200', 'four foot nine': "4'9\"" }, keys: { napoleon: 'y', dead: 'r', short: 'r', furious: 'r', internet: 'o', memes: 'g', judge: 'y', nine: 'r', dismissed: 'r', tall: 'g', embarrassment: 'r', kings: 'y' } },
    beats: ({ V }) => {
      const N = (ex) => ['napoleon', 0, 0, 0, ex];
      return {
        hook: { set: 'court', cam: 'mid',
          cast: [N((t) => ({ arms: [0.2, t > V('hook', 'sue') ? 1.8 : 0.4], eyes: 'angry', mouth: t > V('hook', 'short') ? 'open' : 'frown', hold: 'sword' }))],
          tags: [[0, 2.45, -0.4, 'I AM NOT SHORT', V('hook', 'short'), 'red']], sfx: [['slap', V('hook', 'sue'), { gain: 0.5 }]] },
        rise: { set: 'graveyard', cam: 'mid',
          cast: [N((t) => ({ s: 0.9 * popU(t, V('rise', 'climbed'), 0.5), hide: t < V('rise', 'climbed'), eyes: 'angry', mouth: t > V('rise', 'furious') ? 'open' : 'frown', bob: t > V('rise', 'furious') ? Math.abs(Math.sin(t * 14)) * 0.05 : 0 }))],
          tags: [[0, 0.35, 0.6, 'FURIOUS', V('rise', 'furious'), 'red']], shake: V('rise', 'furious'), sfx: [['thud', V('rise', 'climbed'), { f: 80, gain: 0.6 }]] },
        court: { set: 'court', cam: 'wide',
          cast: [N({ x: -1.0, z: 0.3, rot: 0.5, eyes: 'angry', arms: [0.2, 1.5] }),
                 [null, 0.6, 0.2, -0.4, { shirt: [60, 60, 70], hair: 'short', hold: 'phone', arms: [0.15, 1.7], mouth: 'grin' }], [null, 1.3, 0.4, -0.4, { shirt: [200, 90, 140], hair: 'bob', hairCol: [200, 60, 40], hold: 'phone', arms: [0.15, 1.7], mouth: 'grin' }]],
          tags: [[1.0, 2.45, 0, 'THE INTERNET', V('court', 'internet'), 'orange']] },
        evidence: { set: 'court', cam: 'mid',
          props: (S, t) => plate(S, 0, 1.45, -1.4, 0.6, 0.45, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#16161c'; c.font = FONT(800, h * 0.14); c.textAlign = 'center'; c.fillText('SMOL EMPEROR', w / 2, h * 0.2); c.fillText('5 FT OF RAGE', w / 2, h * 0.92); c.fillStyle = '#304a9a'; c.fillRect(w * 0.42, h * 0.32, w * 0.16, h * 0.45); }),
          cast: [N({ x: -0.9, z: 0.4, rot: 0.6, eyes: 'angry', mouth: 'open', arms: [0.2, 1.3] })],
          tags: [[0.8, 0.35, 0.5, '200 YEARS OF MEMES', V('evidence', 'memes'), 'green']], sfx: [['shutter', V('evidence', 'exhibit'), { gain: 0.5 }]] },
        twist: { set: 'court', cam: 'mid',
          cast: [['judge', 0, -1.3, 0, (t) => ({ s: t > V('twist', 'four') ? 0.55 : 0.9, hide: false })], N({ x: -1.0, z: 0.5, rot: 0.6, eyes: 'wide', mouth: 'o' })],
          tags: [[0.7, 2.45, -1.0, "4'9\"", V('twist', 'four'), 'yellow']], sfx: [['tock', V('twist', 'four'), { f: 300, gain: 0.5 }], ['tock', V('twist', 'nine'), { f: 200, gain: 0.5 }]] },
        verdict: { set: 'court', cam: 'mid',
          cast: [['judge', 0.6, -1.3, -0.2, { s: 0.55, hold: 'gavel', arms: [0.15, 1.6] }], N((t) => ({ x: -0.6, z: 0.3, rot: 0.3, eyes: t > V('verdict', 'died') ? 'x' : 'wide', mouth: 'open', hide: t > V('verdict', 'embarrassment') + 0.4 }))],
          booms: [[-0.6, 1.0, 0.3, V('verdict', 'embarrassment') + 0.4, 1.0]],
          tags: [[0, 2.45, -0.5, 'DISMISSED', V('verdict', 'dismissed'), 'red'], [0, 0.35, 0.6, 'R.I.P. AGAIN', V('verdict', 'died'), 'dark']], sfx: [['stamp', V('verdict', 'dismissed'), { gain: 0.6 }]] },
        cta: { set: 'palace', cam: 'mid',
          cast: [N({ arms: [2.3, 2.3], mouth: 'grin', hold: 'sword' })], tags: [[0, 0.35, 0.6, 'TAG A SHORT KING', V('cta', 'tag'), 'yellow']] },
      };
    },
  });
