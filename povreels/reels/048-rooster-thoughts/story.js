  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const branch = (S) => { S.limb([-0.4, 1.05, -0.2], [0.8, 1.1, -0.2], 0.04, 0.03, [100, 70, 45]); };
  const DRAW = (S, t, mood, o) => { branch(S); bird(S, Object.assign({ x: 0.2, y: 1.1, z: -0.2, s: 1.7, col: [200, 90, 40], belly: [230, 160, 70], wing: [150, 60, 30], beak: [240, 190, 60], t, mood, flap: mood === 'mad' }, o)); };
  makeCouch({
    keys: ["rooster", "four", "scream", "sunrise", "noon", "alarm", "welcome", "three", "nobody", "late"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["c"];
      const T_r1 = [first("r1") + 0.0, first("r1") + 0.74, first("r1") + 1.85], M_r1 = ["smug", "mad", "smug"];
      const T_r2 = [first("r2") + 0.0, first("r2") + 1.11, first("r2") + 4.07], M_r2 = ["sad", "smug", "smug"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["tired"];
      const T_r3 = [first("r3") + 0.0, first("r3") + 1.85, first("r3") + 3.7], M_r3 = ["wow", "wow", "sad"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["calm"];
      const T_r4 = [first("r4") + 0.0, first("r4") + 2.22, first("r4") + 2.59], M_r4 = ["sad", "mad", "mad"];
      const T_cta = [first("cta") + 0.0, first("cta") + 2.96], M_cta = ["smug", "smug"];
      return {
      hook: { set: "street", cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); },  },
      r1: { set: "street", cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_r1[idx(T_r1, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0.2, 2.25, -0.2], ["Four a.m.", "Time to scream.", "Nobody asked. Doesn't matter."][[0.0, 0.74, 1.85].filter((o) => t - first("r1") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 0.74, 1.85].filter((o) => t - first("r1") >= o - 0.05).length - 1], pu(t, first("r1"))); },  },
      r2: { set: "street", cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_r2[idx(T_r2, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0.2, 2.25, -0.2], ["Everyone hates me.", "But I'm the only reason you wake up.", "You're welcome."][[0.0, 1.11, 4.07].filter((o) => t - first("r2") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.11, 4.07].filter((o) => t - first("r2") >= o - 0.05).length - 1], pu(t, first("r2"))); },  },
      n2: { set: "street", cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, over: (ctx, W, H_, t, S) => {  },  },
      r3: { set: "street", cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_r3[idx(T_r3, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 2.25, -0.2], ["Wait. What time is it?", "Why is it so quiet?", "Did I skip the sunrise?"][[0.0, 1.85, 3.7].filter((o) => t - first("r3") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.85, 3.7].filter((o) => t - first("r3") >= o - 0.05).length - 1], pu(t, first("r3"))); },  },
      n3: { set: "street", cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => {  },  },
      r4: { set: "street", cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_r4[idx(T_r4, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 2.25, -0.2], ["Nobody is coming to thank me.", "Fine.", "Tomorrow I'm screaming at three."][[0.0, 2.22, 2.59].filter((o) => t - first("r4") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 2.22, 2.59].filter((o) => t - first("r4") >= o - 0.05).length - 1], pu(t, first("r4"))); },  },
      cta: { set: "street", cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, over: (ctx, W, H_, t, S) => {  }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
