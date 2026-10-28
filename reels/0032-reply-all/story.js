  // ==================== 0032 "Reply all." ====================
  const chat = (lines) => (c, w, h) => { c.fillStyle = '#eef0f4'; c.fillRect(0, 0, w, h); c.fillStyle = '#1c1a22'; c.font = FONT(900, h * 0.05); c.textAlign = 'center'; c.fillText('FAMILY ❤ (6)', w / 2, h * 0.08);
    lines.forEach(([txt, me], i) => { const y = h * (0.18 + i * 0.17); c.fillStyle = me ? '#3d8bf2' : '#ffffff'; c.fillRect(me ? w * 0.3 : w * 0.06, y, w * 0.64, h * 0.12); c.fillStyle = me ? '#fff' : '#1c1a22'; c.font = FONT(800, h * 0.038); c.textAlign = 'left'; c.fillText(txt, (me ? w * 0.33 : w * 0.09), y + h * 0.075); }); };
  const MOM = (o = {}) => ({ who: 'mil', x: 0, z: -0.42, sit: true, yaw: 0, arms: 'phone', ...o });
  makeCouch({
    keys: ['best', 'friend', 'mom', 'help', 'sent', 'family', 'delete', 'six', 'types', 'dad', 'run', 'new'],
    shots: ({ V }) => ({
      hook: { cam: 'him', he: { arms: 'phone', face: { mouth: 'smile', lids: 0.5, brows: -0.5 } }, heHold: () => chat([['Her mom is here AGAIN. Send help', true]]), she: { hide: true },
        fx: [{ k: 'card', text: 'TO: BEST FRIEND (HE THINKS)', at: V('hook', 'best'), y: 990, fill: '#2a1a3a', px: 34 }] },
      sent: { cam: 'him', he: { arms: 'phone', face: { mouth: 'smile', eyes: 'happy' } }, heHold: () => chat([['Her mom is here AGAIN. Send help', true]]), she: { hide: true }, fx: [{ k: 'stamp', text: 'SENT', x: 360, y: 1000, at: V('sent', 'Sent'), col: '#3d8bf2' }] },
      wrong: { cam: 'him', he: { arms: 'phone', face: { eyes: 'wide', mouth: 'o', brows: 0.9 } }, heHold: () => chat([['Her mom is here AGAIN. Send help', true]]), she: { hide: true }, flash: [V('wrong', 'family')],
        fx: [{ k: 'card', text: 'FAMILY GROUP CHAT', at: V('wrong', 'family'), y: 1000, fill: '#c0182a', col: '#fff' }] },
      panic: { cam: 'him', he: { arms: 'head', face: { eyes: 'wide', mouth: 'open', brows: 0.9 } }, she: { hide: true }, fx: [{ k: 'sweat', who: 'he', at: V('panic', 'delete') }, { k: 'stamp', text: 'SEEN BY 6', x: 360, y: 1000, at: V('panic', 'Seen'), col: '#ff4a4a' }] },
      mom: { cam: 'on', on: [0, 1.5, -0.42], he: { hide: true }, she: { hide: true }, extras: [MOM({ face: { mouth: 'flat', lids: 0.5, brows: -0.9 } })], heHold: false, fx: [{ k: 'q', text: '...', x: 360, y: 600, at: V('mom', 'types') }] },
      twist: { cam: 'him', he: { arms: 'phone', face: { eyes: 'wide', mouth: 'o' } }, heHold: () => chat([['Her mom is here AGAIN. Send help', true], ['DAD: Run.', false]]), she: { hide: true }, twist: V('twist', 'Run'),
        fx: [{ k: 'stamp', text: 'RUN.', x: 360, y: 1010, at: V('twist', 'Run'), col: '#ffd23f', rot: -0.1 }] },
      close: { cam: 'wide', he: { arms: 'phone', face: { mouth: 'smile', eyes: 'happy' } }, heHold: () => chat([['DAD added you to', false], ['"ESCAPE PLAN"', false]]), she: { arms: 'clasp', face: { mouth: 'flat', lids: 0.6, brows: -0.8 } },
        fx: [{ k: 'card', text: 'NEW GROUP: ESCAPE PLAN', at: V('close', 'new'), y: 1000, fill: '#2a1a3a', px: 36 }] },
    }),
  });
