  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const DRAW = (S, t, mood) => { S.rbox((p) => add(p, [0, 0.9, -0.7]), 0.5, 0.3, 0.32, [225, 225, 230], { bevel: 0.3 }); S.rbox((p) => add(p, [-0.1, 0.9, -0.38]), 0.3, 0.22, 0.01, [30, 34, 44], { bevel: 0.2 }); S.rbox((p) => add(p, [0.34, 0.9, -0.38]), 0.1, 0.24, 0.01, [90, 95, 110], { bevel: 0.2 }); S.ball([0.34, 1.0, -0.36], 0.02, mood === 'mad' ? [240, 60, 60] : [90, 220, 120], { rim: false }); };
  const OFACE = (ctx, S, mood, t) => objFace(ctx, S, [-0.1, 0.9, -0.36], mood, t, 0.9);
  makeCouch({
    keys: ["microwave", "beep", "coffee", "midnight", "pasta", "warm", "here", "mad", "leftovers", "tuesday"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["c"];
      const T_m1 = [first("m1") + 0.0, first("m1") + 0.74, first("m1") + 1.48], M_m1 = ["calm", "calm", "mad"];
      const T_m2 = [first("m2") + 0.0, first("m2") + 3.7], M_m2 = ["mad", "smug"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["sad"];
      const T_m3 = [first("m3") + 0.0, first("m3") + 1.11, first("m3") + 2.59], M_m3 = ["sad", "sad", "happy"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["calm"];
      const T_m4 = [first("m4") + 0.0, first("m4") + 1.11, first("m4") + 2.22], M_m4 = ["calm", "happy", "happy"];
      const T_cta = [first("cta") + 0.0, first("cta") + 2.22], M_cta = ["smug", "smug"];
      return {
      hook: { set: "kitchen", cam: [[0, 0.95, 1.9], [0, 0.75, -0.7], [0, 0.93, 1.6], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)]); }, over: (ctx, W, H_, t, S) => {  OFACE(ctx, S, M_hook[idx(T_hook, t)], t); },  },
      m1: { set: "kitchen", cam: [[0, 0.85, 1.3], [0, 0.75, -0.7], [0, 0.83, 1.0], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_m1[idx(T_m1, t)]); }, over: (ctx, W, H_, t, S) => {  OFACE(ctx, S, M_m1[idx(T_m1, t)], t);thought(ctx, S, [0, 1.3, -0.7], ["Beep beep.", "Three minutes.", "You never take it out."][[0.0, 0.74, 1.48].filter((o) => t - first("m1") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 0.74, 1.48].filter((o) => t - first("m1") >= o - 0.05).length - 1], pu(t, first("m1"))); },  },
      m2: { set: "kitchen", cam: [[0, 0.85, 1.3], [0, 0.75, -0.7], [0, 0.83, 1.0], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_m2[idx(T_m2, t)]); }, over: (ctx, W, H_, t, S) => {  OFACE(ctx, S, M_m2[idx(T_m2, t)], t);thought(ctx, S, [0, 1.3, -0.7], ["Last Tuesday you left coffee in me for six hours.", "I am not a storage unit."][[0.0, 3.7].filter((o) => t - first("m2") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 3.7].filter((o) => t - first("m2") >= o - 0.05).length - 1], pu(t, first("m2"))); },  },
      n2: { set: "kitchen", cam: [[0, 0.95, 1.9], [0, 0.75, -0.7], [0, 0.93, 1.6], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)]); }, over: (ctx, W, H_, t, S) => {  OFACE(ctx, S, M_n2[idx(T_n2, t)], t);nightTint(ctx, W, H_); },  },
      m3: { set: "kitchen", cam: [[0, 0.85, 1.3], [0, 0.75, -0.7], [0, 0.83, 1.0], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_m3[idx(T_m3, t)]); }, over: (ctx, W, H_, t, S) => {  OFACE(ctx, S, M_m3[idx(T_m3, t)], t);nightTint(ctx, W, H_); thought(ctx, S, [0, 1.3, -0.7], ["I see you.", "Same pasta, three days.", "I'll make it warm. That's what I can do."][[0.0, 1.11, 2.59].filter((o) => t - first("m3") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.11, 2.59].filter((o) => t - first("m3") >= o - 0.05).length - 1], pu(t, first("m3"))); },  },
      n3: { set: "kitchen", cam: [[0, 0.95, 1.9], [0, 0.75, -0.7], [0, 0.93, 1.6], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)]); }, over: (ctx, W, H_, t, S) => {  OFACE(ctx, S, M_n3[idx(T_n3, t)], t);nightTint(ctx, W, H_); },  },
      m4: { set: "kitchen", cam: [[0, 0.85, 1.3], [0, 0.75, -0.7], [0, 0.83, 1.0], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_m4[idx(T_m4, t)]); }, over: (ctx, W, H_, t, S) => {  OFACE(ctx, S, M_m4[idx(T_m4, t)], t);nightTint(ctx, W, H_); thought(ctx, S, [0, 1.3, -0.7], ["Beep. Beep. Beep.", "I'm not mad.", "I just want you to know I'm here."][[0.0, 1.11, 2.22].filter((o) => t - first("m4") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.11, 2.22].filter((o) => t - first("m4") >= o - 0.05).length - 1], pu(t, first("m4"))); }, fx: [{ k: 'hearts', at: first("m4") + 1.0, n: 4, y: 560 }], },
      cta: { set: "kitchen", cam: [[0, 0.95, 1.9], [0, 0.75, -0.7], [0, 0.93, 1.6], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)]); }, over: (ctx, W, H_, t, S) => {  OFACE(ctx, S, M_cta[idx(T_cta, t)], t); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
