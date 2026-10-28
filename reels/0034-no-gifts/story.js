  // ==================== 0034 "No gifts this year." ====================
  const box = (s, y = 0.5) => (S) => { S.rbox((p) => add(p, [0, y + 0.3 * s, 0.35]), 0.35 * s, 0.3 * s, 0.3 * s, [240, 60, 90], { bevel: 0.1 }); S.rbox((p) => add(p, [0, y + 0.3 * s, 0.35]), 0.05 * s, 0.31 * s, 0.31 * s, [255, 210, 60], { bevel: 0.2 }); };
  const paper = (S, t, u) => { const r = H.rng(3); for (let i = 0; i < 8 * u; i++) S.ball([r.range(-1, 1), 0.08, 0.4 + r.range(-0.3, 0.5)], [0.08, 0.04, 0.07], [240, 60, 90]); };
  makeCouch({
    keys: ['anniversary', 'no', 'gifts', 'word', 'nothing', 'giant', 'box', 'panics', 'paper', 'hoodie', 'stole', 'technically'],
    shots: ({ V }) => ({
      hook: { cam: 'wide', he: { arms: 'reach', face: { mouth: 'smile' } }, she: { arms: 'reach', face: { mouth: 'smile' } }, fx: [{ k: 'card', text: 'DEAL: NO GIFTS', at: V('hook', 'agree'), y: 990, fill: '#2a1a3a' }, { k: 'hearts', at: V('hook', 'Anniversary'), n: 3, y: 600 }] },
      him: { cam: 'him', he: { arms: 'shrug', face: { mouth: 'smile', eyes: 'happy' } }, fx: [{ k: 'ring', who: 'he', at: V('him', 'Nothing'), mark: 'tick' }] },
      her: { cam: 'wide', he: { arms: 'rest', face: { mouth: 'o', eyes: 'wide' } }, she: { sit: false, x: 0.3, z: 0.6, arms: 'hold', face: { mouth: 'smile', lids: 0.4 } }, props: box(1.4, 0.25), fx: [{ k: 'stamp', text: 'GIANT BOX', x: 360, y: 1000, at: V('her', 'giant'), col: '#ffd23f' }] },
      guilt: { cam: 'him', he: { arms: 'head', face: { eyes: 'wide', mouth: 'open', brows: 0.9 } }, fx: [{ k: 'sweat', who: 'he', at: V('guilt', 'panics') }, { k: 'bubble', text: 'You said no gifts!', x: 330, y: 820, at: V('guilt', 'You'), side: -1 }] },
      open: { cam: 'two', he: { arms: 'reach', face: { mouth: 'o', eyes: 'wide' } }, she: { arms: 'clasp', face: { mouth: 'smile', lids: 0.5 } }, props: (S, t, u) => { box(1.2)(S); paper(S, t, u); }, fx: [{ k: 'q', text: '...', x: 360, y: 640, at: V('open', 'More') }] },
      twist: { cam: 'him', he: { arms: 'hold', face: { eyes: 'wide', mouth: 'open', brows: 0.8 } }, props: (S, t, u, he) => { if (!he) return; const m = midHands(he); S.rbox((p) => add(p, [m[0], m[1], m[2] + 0.06]), 0.2, 0.15, 0.04, [120, 120, 130], { bevel: 0.4 }); }, twist: V('twist', 'stole'),
        fx: [{ k: 'card', text: 'HIS OWN HOODIE (WASHED)', at: V('twist', 'hoodie'), y: 1000, fill: '#5a1020', px: 36 }] },
      close: { cam: 'her', she: { arms: 'clasp', face: { mouth: 'smile', lids: 0.5, brows: -0.7 } }, fx: [{ k: 'smug', who: 'she', at: V('close', 'Technically') }, { k: 'stamp', text: '0 GIFTS', x: 360, y: 1000, at: V('close', 'Technically'), col: '#9aff6a' }] },
    }),
  });
