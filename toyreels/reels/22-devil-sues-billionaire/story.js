  // ==================== The higher powers: the devil v. a billionaire ====================
  makeComedy({
    badge: 'THE HIGHER POWERS', badgeCol: '#a81a1a',
    captions: { say: { 'ninety thousand': '90,000', 'eighty four': '84', 'two thousand nine': '2009', 'fourteen ninety nine': '$14.99' }, keys: { devil: 'r', billionaire: 'y', stealing: 'r', never: 'r', read: 'r', exhibit: 'o', eighty: 'y', agree: 'r', lost: 'r', forever: 'r' } },
    beats: ({ V }) => {
      const D = (x, z, rot, ex) => ['devil', x, z, rot, ex], BZ = (x, z, rot, ex) => ['bezos', x, z, rot, ex];
      const doc = (S, x, y, z, txt) => plate(S, x, y, z, 0.3, 0.42, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#16161c'; c.font = FONT(800, h * 0.09); c.textAlign = 'center'; c.fillText(txt, w / 2, h * 0.14); c.fillStyle = '#9aa0aa'; for (let i = 0; i < 12; i++) c.fillRect(w * 0.1, h * (0.24 + i * 0.055), w * 0.8, h * 0.02); }, [240, 240, 240]);
      return {
        hook: { set: 'court', cam: 'wide',
          cast: [D(-0.9, 0.3, 0.5, { hold: 'pitchfork', mouth: 'evil', eyes: 'angry', arms: [0.15, 1.2] }), BZ(0.9, 0.3, -0.5, (t) => ({ mouth: t > V('hook', 'stealing') ? 'evil' : 'smile', shades: true }))],
          tags: [[0, 2.45, -0.5, 'DEVIL v. BILLIONAIRE', V('hook', 'sued'), 'red', 1.15]], sfx: [['stamp', V('hook', 'sued'), { gain: 0.6 }]] },
        claim: { set: 'court', cam: 'mid',
          cast: [D(0, 0.2, 0, (t) => ({ arms: [0.15, 2.0], mouth: 'open', eyes: 'angry', hold: 'pitchfork' }))],
          props: (S) => doc(S, 0.7, 1.4, 0.3, 'CONTRACT'),
          tags: [[0, 2.45, -0.4, 'MY IDEA!', V('claim', 'invented'), 'red']] },
        evidence: { set: 'court', cam: 'mid',
          props: (S, t) => { for (let i = 0; i < Math.min(18, Math.floor((t - V('evidence', 'terms')) * 10)); i++) doc(S, -0.4 + (i % 3) * 0.4, 0.3 + Math.floor(i / 3) * 0.12, 0.2, 'T&C'); },
          cast: [D(-1.1, 0.0, 0.5, { arms: [0.15, 1.4], mouth: 'evil' })],
          tags: [[0.2, 2.45, -0.4, '90,000 WORDS', V('evidence', 'ninety'), 'orange']], sfx: [['paper', V('evidence', 'terms'), { gain: 0.6 }]] },
        defense: { set: 'court', cam: 'mid',
          props: (S) => doc(S, 0.1, 1.5, 0.4, 'PAGE 84'),
          cast: [[null, -0.6, 0.2, 0.3, { suit: true, shirt: [70, 70, 80], pants: [70, 70, 80], tie: [200, 160, 40], hair: 'side', hairCol: [30, 30, 30], facePaint: (c, w, h) => { c.strokeStyle = '#2a2a33'; c.lineWidth = w * 0.025; for (const x of [0.34, 0.66]) { c.beginPath(); c.arc(w * x, h * 0.45, w * 0.11, 0, TAU); c.stroke(); } }, mouth: 'evil', arms: [0.15, 1.6] }], BZ(0.8, 0.2, -0.4, { shades: true, mouth: 'evil' })],
          tags: [[0, 2.45, -0.4, 'PAGE 84', V('defense', 'eighty'), 'yellow']], sfx: [['paper', V('defense', 'page'), { gain: 0.5 }]] },
        twist: { set: 'hell', cam: 'mid',
          cast: [D(0, 0.2, 0, (t) => ({ hold: 'phone', arms: [0.15, 1.8], mouth: t > V('twist', 'agree') ? 'o' : 'grin', eyes: t > V('twist', 'agree') ? 'wide' : 'open', sweat: t > V('twist', 'agree') }))],
          tags: [[0, 2.45, -0.4, '2009', V('twist', 'two'), 'dark'], [0, 0.35, 0.6, '☑ I AGREE', V('twist', 'agree'), 'green']], sfx: [['click', V('twist', 'clicked'), { gain: 0.6 }]] },
        verdict: { set: 'court', cam: 'mid', shake: V('verdict', 'forever'),
          cast: [['judge', 0, -1.2, 0, { hold: 'gavel', arms: [0.15, 1.7] }], D(-0.8, 0.4, 0.4, { mouth: 'frown', eyes: 'x', hold: 'pitchfork' }), BZ(0.8, 0.4, -0.4, { mouth: 'grin', shades: true, hold: 'bag' })],
          tags: [[0, 0.35, 0.8, '$14.99 / MONTH', V('verdict', 'fourteen'), 'red'], [0, 2.45, -0.6, 'FOREVER', V('verdict', 'forever'), 'dark']], sfx: [['stamp', V('verdict', 'lost'), { gain: 0.6 }], ['coin', V('verdict', 'fourteen'), { gain: 0.5 }]] },
        cta: { set: 'hell', cam: 'mid', cast: [D(0, 0, 0, { hold: 'phone', arms: [0.15, 1.8], mouth: 'frown', brows: 'worried' })], tags: [[0, 0.35, 0.6, "DON'T LIE", V('cta', 'lie'), 'red']] },
      };
    },
  });
