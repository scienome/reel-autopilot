  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const PERSON = (mood, t) => ({ who: 'boss', x: 0, z: -0.75, yaw: 0, sit: false, arms: 'hold', shirt: [238, 244, 250], pants: [150, 205, 220], tie: [80, 170, 200], hair: [60, 45, 35], face: FACE[mood] });
  makeCouch({
    keys: ["dentist", "wider", "floss", "gums", "yesterday", "scared", "chair", "hand", "champ", "dad"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["c"];
      const T_t1 = [first("t1") + 0.0, first("t1") + 0.74], M_t1 = ["calm", "mad"];
      const T_t2 = [first("t2") + 0.0, first("t2") + 1.11, first("t2") + 1.85], M_t2 = ["calm", "smug", "smug"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["calm"];
      const T_t3 = [first("t3") + 0.0, first("t3") + 2.59, first("t3") + 4.81], M_t3 = ["sad", "happy", "happy"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["happy"];
      const T_t4 = [first("t4") + 0.0, first("t4") + 1.11], M_t4 = ["happy", "smug"];
      const T_cta = [first("cta") + 0.0, first("cta") + 2.22], M_cta = ["smug", "smug"];
      return {
      hook: { set: "restaurant", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_hook[idx(T_hook, t)], t)], over: (ctx, W, H_, t, S) => {  },  },
      t1: { set: "restaurant", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_t1[idx(T_t1, t)], t)], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Open wider.", "Please stop biting my fingers."][[0.0, 0.74].filter((o) => t - first("t1") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 0.74].filter((o) => t - first("t1") >= o - 0.05).length - 1], pu(t, first("t1"))); },  },
      t2: { set: "restaurant", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_t2[idx(T_t2, t)], t)], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Do you floss?", "'Every day.'", "Your gums say once. Yesterday."][[0.0, 1.11, 1.85].filter((o) => t - first("t2") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.11, 1.85].filter((o) => t - first("t2") >= o - 0.05).length - 1], pu(t, first("t2"))); },  },
      n2: { set: "restaurant", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_n2[idx(T_n2, t)], t)], over: (ctx, W, H_, t, S) => {  },  },
      t3: { set: "restaurant", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_t3[idx(T_t3, t)], t)], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["I was scared of this chair too.", "That's why I became a dentist.", "Squeeze my hand."][[0.0, 2.59, 4.81].filter((o) => t - first("t3") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 2.59, 4.81].filter((o) => t - first("t3") >= o - 0.05).length - 1], pu(t, first("t3"))); }, fx: [{ k: 'hearts', at: first("t3") + 1.0, n: 4, y: 560 }], },
      n3: { set: "restaurant", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_n3[idx(T_n3, t)], t)], over: (ctx, W, H_, t, S) => {  },  },
      t4: { set: "restaurant", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_t4[idx(T_t4, t)], t)], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Great job, champ.", "Now tell your dad to floss."][[0.0, 1.11].filter((o) => t - first("t4") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.11].filter((o) => t - first("t4") >= o - 0.05).length - 1], pu(t, first("t4"))); },  },
      cta: { set: "restaurant", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON(M_cta[idx(T_cta, t)], t)], over: (ctx, W, H_, t, S) => {  }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
