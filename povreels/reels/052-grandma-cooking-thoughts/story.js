  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const PERSON = (mood, t) => ({ who: 'mil', x: 0, z: -0.75, yaw: 0, sit: false, arms: 'hold', hair: [225, 225, 230], face: FACE[mood] });
  makeCouch({
    keys: ["grandma", "eat", "thin", "three", "hours", "chair", "house", "quiet", "back", "seconds"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["c"];
      const T_g1 = [first("g1") + 0.0, first("g1") + 0.74, first("g1") + 1.85], M_g1 = ["calm", "sad", "smug"];
      const T_g2 = [first("g2") + 0.0, first("g2") + 1.85, first("g2") + 4.07], M_g2 = ["smug", "smug", "happy"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["calm"];
      const T_g3 = [first("g3") + 0.0, first("g3") + 1.85, first("g3") + 3.7], M_g3 = ["sad", "sad", "sad"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["calm"];
      const T_g4 = [first("g4") + 0.0, first("g4") + 0.37, first("g4") + 1.11], M_g4 = ["wow", "happy", "happy"];
      const T_cta = [first("cta") + 0.0, first("cta") + 2.59], M_cta = ["smug", "smug"];
      return {
      hook: { set: "kitchen", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_hook[idx(T_hook, t)], t)], over: (ctx, W, H_, t, S) => {  },  },
      g1: { set: "kitchen", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_g1[idx(T_g1, t)], t)], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Eat more.", "You look thin.", "You look thin every time."][[0.0, 0.74, 1.85].filter((o) => t - first("g1") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 0.74, 1.85].filter((o) => t - first("g1") >= o - 0.05).length - 1], pu(t, first("g1"))); },  },
      g2: { set: "kitchen", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_g2[idx(T_g2, t)], t)], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["I cooked for three hours.", "You'll eat it in three minutes.", "Worth it."][[0.0, 1.85, 4.07].filter((o) => t - first("g2") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.85, 4.07].filter((o) => t - first("g2") >= o - 0.05).length - 1], pu(t, first("g2"))); },  },
      n2: { set: "kitchen", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_n2[idx(T_n2, t)], t)], over: (ctx, W, H_, t, S) => {  },  },
      g3: { set: "kitchen", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_g3[idx(T_g3, t)], t)], over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0, 2.0, -0.75], ["Your grandpa's chair is empty.", "The house is so quiet.", "So I cook enough for everyone."][[0.0, 1.85, 3.7].filter((o) => t - first("g3") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.85, 3.7].filter((o) => t - first("g3") >= o - 0.05).length - 1], pu(t, first("g3"))); },  },
      n3: { set: "kitchen", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_n3[idx(T_n3, t)], t)], over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); },  },
      g4: { set: "kitchen", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_g4[idx(T_g4, t)], t)], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Oh.", "Eat, eat.", "Have seconds. Have thirds."][[0.0, 0.37, 1.11].filter((o) => t - first("g4") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 0.37, 1.11].filter((o) => t - first("g4") >= o - 0.05).length - 1], pu(t, first("g4"))); }, fx: [{ k: 'hearts', at: first("g4") + 1.0, n: 4, y: 560 }], },
      cta: { set: "kitchen", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_cta[idx(T_cta, t)], t)], over: (ctx, W, H_, t, S) => {  }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
