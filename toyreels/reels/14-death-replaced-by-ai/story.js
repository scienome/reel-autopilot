  // ==================== The higher powers: Death is replaced by AI ====================
  makeComedy({
    badge: 'THE HIGHER POWERS', badgeCol: '#4a2a7a',
    captions: { say: { 'nine thousand': '9,000', 'two hundred year old': '200-year-old', deathgpt: 'DeathGPT' }, keys: { fired: 'r', ai: 'g', died: 'r', hr: 'o', deathgpt: 'g', bug: 'r', cancelled: 'r', bankrupt: 'r', refund: 'y', rehired: 'g', consultant: 'y', double: 'g' } },
    beats: ({ V }) => {
      const bot = (ex = {}) => [null, 0, 0, 0, (t) => Object.assign({ shirt: [200, 204, 214], pants: [170, 174, 184], sleeve: [150, 154, 164], hat: 'helmet', hatCol: [40, 44, 56], emblem: { shape: 'circle', bg: [80, 220, 255], txt: 'AI', col: [20, 40, 60] } }, typeof ex === 'function' ? ex(t) : ex)];
      return {
        hook: { set: 'graveyard', cam: 'mid', shake: V('hook', 'fired'),
          cast: [['death', -0.6, 0, 0.3, (t) => ({ hold: 'scythe', arms: [0.15, 0.3], sweat: t > V('hook', 'fired') })], (() => { const b = bot((t) => ({ x: 0.8, rot: -0.3, hide: t < V('hook', 'ai'), s: 0.9 * popU(t, V('hook', 'ai'), 0.4) })); return b; })()],
          tags: [[-0.6, 2.45, -0.3, 'FIRED', V('hook', 'fired'), 'red'], [0, 0.35, 0.6, '0 DEATHS', V('hook', 'nobody'), 'green']], sfx: [['stamp', V('hook', 'fired'), { gain: 0.6 }], ['powerup', V('hook', 'ai'), { gain: 0.4 }]] },
        fired: { set: 'office', cam: 'mid',
          cast: [['death', -0.7, 0.2, 0.4, { hold: 'scythe', mouth: 'flat' }], ['zuckerberg', 0.2, -1.1, -0.2, (t) => ({ arms: [0.15, t > V('fired', 'hr') ? 1.4 : 0.15], mouth: 'flat', eyes: 'wide' })]],
          tags: [[-0.7, 2.45, -0.3, '9,000 YEARS', V('fired', 'nine'), 'dark'], [0.4, 2.45, -1.0, 'HR', V('fired', 'hr'), 'orange']] },
        ai: { set: 'stage', opt: { banner: 'DeathGPT' }, cam: 'wide',
          cast: [bot((t) => ({ arms: [2.4, 2.4], bob: Math.abs(Math.sin(t * 6)) * 0.05 }))],
          tags: [[-0.8, 0.35, 0.2, 'FASTER', V('ai', 'faster'), 'green'], [0.8, 0.35, 0.2, 'CHEAPER', V('ai', 'cheaper'), 'yellow']], flash: [V('ai', 'deathgpt')] },
        bug: { set: 'bunker', opt: { alarm: 1 }, cam: 'mid', shake: V('bug', 'cancelled'),
          cast: [bot((t) => ({ arms: [0.6, 0.6], eyes: 'x', bob: t > V('bug', 'bug') ? Math.sin(t * 40) * 0.03 : 0 }))],
          tags: [[0, 2.45, -0.4, 'ERROR 404: DEATH', V('bug', 'bug'), 'red', 1.0], [0, 0.35, 0.6, 'ALL DEATHS CANCELLED', V('bug', 'cancelled'), 'orange', 1.15]], sfx: [['error', V('bug', 'bug'), { gain: 0.5 }], ['glitch', V('bug', 'cancelled'), { gain: 0.6 }]] },
        chaos: { set: 'heaven', cam: 'wide', at: [0, 0.3],
          cast: [['angel', -1.0, 0, 0.3, { mouth: 'flat', eyes: 'sleepy', arms: [0.1, 0.1] }], ['devil', 0.2, 0.3, 0, (t) => ({ hide: t < V('chaos', 'hell'), hold: 'bag', mouth: 'frown', brows: 'worried' })],
                 [null, 1.2, 0.1, -0.3, (t) => ({ hide: t < V('chaos', 'man'), shirt: [180, 170, 150], hair: 'wild', hairCol: [250, 250, 250], mustache: 'beard', hairCol: [250, 250, 250], arms: [0.15, 1.8], mouth: 'open' })]],
          tags: [[-1.0, 2.45, -0.3, 'QUIET', V('chaos', 'quiet'), 'white'], [0.2, 2.45, 0, 'BANKRUPT', V('chaos', 'bankrupt'), 'red'], [1.0, 0.35, 0.6, 'REFUND?', V('chaos', 'refund'), 'yellow']] },
        twist: { set: 'graveyard', cam: 'low',
          cast: [['death', 0, 0, 0, (t) => ({ hold: t > V('twist', 'consultant') ? 'briefcase' : 'scythe', shades: t > V('twist', 'consultant'), arms: [0.15, 0.3] })]],
          tags: [[-0.8, 2.45, -0.3, 'REHIRED', V('twist', 'rehired'), 'green'], [0, 0.35, 0.6, '$$ × 2', V('twist', 'double'), 'yellow']], sfx: [['coin', V('twist', 'double'), { gain: 0.6 }]] },
        cta: { set: 'graveyard', cam: 'mid',
          cast: [['death', 0, 0, 0, { shades: true, hold: 'briefcase' }]],
          tags: [[0, 0.35, 0.6, 'AI OR DEATH?', V('cta', 'trust'), 'red']] },
      };
    },
  });
