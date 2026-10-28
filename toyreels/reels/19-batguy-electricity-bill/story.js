  // ==================== Superhero problems: Bat-Guy's electricity bill ====================
  makeComedy({
    badge: 'SUPERHERO PROBLEMS', badgeCol: '#2a2a3a',
    captions: { say: { 'four point two million dollars': '$4,200,000', twenty: '20' }, keys: { villain: 'r', electricity: 'y', bill: 'r', signal: 'y', million: 'r', car: 'o', cape: 'o', butler: 'r', robbed: 'r', nobody: 'r', afford: 'r' } },
    beats: ({ V }) => {
      const BG = (ex) => ['batGuy', 0, 0.2, 0, ex];
      const sig = (ctx, W, H_, t) => { const g = ctx.createRadialGradient(W * 0.5, H_ * 0.3, 10, W * 0.5, H_ * 0.3, W * 0.35); g.addColorStop(0, 'rgba(255,240,150,0.55)'); g.addColorStop(1, 'rgba(255,240,150,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H_); ctx.fillStyle = 'rgba(20,20,30,0.8)'; ctx.beginPath(); ctx.ellipse(W * 0.5, H_ * 0.3, W * 0.12, W * 0.05, 0, 0, TAU); ctx.fill(); };
      return {
        hook: { set: 'city', opt: { night: 1 }, cam: 'low',
          cast: [BG((t) => ({ cape: [30, 30, 36], capeFlap: Math.sin(t * 3) * 0.1, arms: [0.3, 0.3], mouth: t > V('hook', 'electricity') ? 'o' : 'frown', eyes: t > V('hook', 'electricity') ? 'wide' : 'open' }))],
          tags: [[0, 0.35, 0.6, 'ELECTRICITY BILL', V('hook', 'electricity'), 'yellow', 1.0]], flash: [V('hook', 'bill')] },
        signal: { set: 'city', opt: { night: 1 }, cam: 'wide', over: sig,
          tags: [[0, 0.35, 0.6, '20 YEARS', V('signal', 'twenty'), 'orange']] },
        bill: { set: 'office', opt: { desk: true }, cam: 'mid', shake: V('bill', 'million'),
          props: (S) => plate(S, 0.5, 1.3, 0.2, 0.25, 0.35, (c, w, h) => { c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); c.fillStyle = '#c82020'; c.font = FONT(800, h * 0.12); c.textAlign = 'center'; c.fillText('PAY NOW', w / 2, h * 0.2); c.fillStyle = '#16161c'; c.font = FONT(800, h * 0.09); c.fillText('$4,200,000', w / 2, h * 0.6); }),
          cast: [BG((t) => ({ arms: [0.15, 1.2], eyes: t > V('bill', 'million') ? 'x' : 'wide', mouth: 'open', sweat: true }))],
          tags: [[0, 2.45, -0.4, '$4,200,000', V('bill', 'four'), 'red']], sfx: [['error', V('bill', 'million'), { gain: 0.6 }]] },
        broke: { set: 'street', opt: { signs: ['PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN'] }, cam: 'mid',
          cast: [BG((t) => ({ cape: t > V('broke', 'cape') ? null : [30, 30, 36], mouth: 'frown', brows: 'worried', arms: [0.15, 0.15] })),
                 [null, 1.1, 0.0, -0.4, (t) => ({ hide: t < V('broke', 'butler'), suit: true, hair: 'thin', hairCol: [220, 220, 220], mustache: 'big', hairCol: [220, 220, 220], mouth: 'o', eyes: 'wide' })]],
          tags: [[-0.9, 2.45, -0.3, 'CAR: SOLD', V('broke', 'car'), 'orange'], [0, 0.35, 0.6, 'CAPE: SOLD', V('broke', 'cape'), 'orange'], [1.0, 2.45, -0.3, 'BUTLER: SOLD', V('broke', 'butler'), 'red']] },
        twist: { set: 'bank', cam: 'mid', shake: V('twist', 'robbed'),
          cast: [BG({ hold: 'bag', arms: [0.15, 1.0], mouth: 'grin', balaclava: [30, 30, 36] })],
          tags: [[0, 0.35, 0.6, 'ROBBED A BANK', V('twist', 'robbed'), 'red']], sfx: [['bell', V('twist', 'robbed'), { gain: 0.5 }]] },
        caught: { set: 'city', opt: { night: 1 }, cam: 'wide',
          cast: [BG((t) => ({ x: H.lerp(-1.5, 2.5, H.clamp((t - V('caught', 'nobody')) / 3)), walk: t * 8, hold: 'bag', mouth: 'grin', cape: null }))],
          tags: [[0, 2.45, -0.4, 'CAUGHT BY: NOBODY', V('caught', 'nobody'), 'dark', 1.1], [0, 0.35, 0.6, 'SIGNAL: OFF', V('caught', 'afford'), 'red']] },
        cta: { set: 'stage', opt: { banner: 'WORST BILL?' }, cam: 'mid', cast: [BG({ arms: [2.2, 2.2], mouth: 'grin', cape: null, hold: 'bag' })] },
      };
    },
  });
