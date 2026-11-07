  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const DRAW = (S, t, mood) => { S.rbox((p) => add(p, [0, 0.9, -0.7]), 0.5, 0.55, 0.12, [190, 195, 205], { bevel: 0.2 }); S.rbox((p) => add(p, [-0.12, 0.9, -0.57]), 0.1, 0.5, 0.01, [150, 156, 170], { bevel: 0.2 }); S.rbox((p) => add(p, [0.12, 0.9, -0.57]), 0.1, 0.5, 0.01, [150, 156, 170], { bevel: 0.2 }); S.ball([0.38, 0.9, -0.58], 0.025, mood === 'mad' ? [240, 60, 60] : [255, 210, 60], { rim: false }); };
  const OFACE = (ctx, S, mood, t) => objFace(ctx, S, [0, 1.0, -0.56], mood, t, 0.9);
  makeCouch({
    keys: ["elevator", "close", "button", "nothing", "comfort", "crying", "slow", "floor", "everyone", "door"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["c"];
      const T_e1 = [first("e1") + 0.0, first("e1") + 0.74, first("e1") + 1.48], M_e1 = ["smug", "smug", "smug"];
      const T_e2 = [first("e2") + 0.0, first("e2") + 2.59, first("e2") + 4.44], M_e2 = ["smug", "calm", "happy"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["calm"];
      const T_e3 = [first("e3") + 0.0, first("e3") + 1.48, first("e3") + 2.22], M_e3 = ["sad", "calm", "happy"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["calm"];
      const T_e4 = [first("e4") + 0.0, first("e4") + 1.11, first("e4") + 1.85], M_e4 = ["happy", "happy", "happy"];
      const T_cta = [first("cta") + 0.0, first("cta") + 2.59], M_cta = ["smug", "smug"];
      return {
      hook: { set: "mall", cam: [[0, 0.95, 1.9], [0, 0.75, -0.7], [0, 0.93, 1.6], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)]); }, over: (ctx, W, H_, t, S) => {  OFACE(ctx, S, M_hook[idx(T_hook, t)], t); },  },
      e1: { set: "mall", cam: [[0, 0.85, 1.3], [0, 0.75, -0.7], [0, 0.83, 1.0], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_e1[idx(T_e1, t)]); }, over: (ctx, W, H_, t, S) => {  OFACE(ctx, S, M_e1[idx(T_e1, t)], t);thought(ctx, S, [0, 1.3, -0.7], ["Close-door button?", "Does nothing.", "It never did."][[0.0, 0.74, 1.48].filter((o) => t - first("e1") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 0.74, 1.48].filter((o) => t - first("e1") >= o - 0.05).length - 1], pu(t, first("e1"))); },  },
      e2: { set: "mall", cam: [[0, 0.85, 1.3], [0, 0.75, -0.7], [0, 0.83, 1.0], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_e2[idx(T_e2, t)]); }, over: (ctx, W, H_, t, S) => {  OFACE(ctx, S, M_e2[idx(T_e2, t)], t);thought(ctx, S, [0, 1.3, -0.7], ["I let you press it for comfort.", "Thirty times a day. Nothing.", "Keep going. It helps."][[0.0, 2.59, 4.44].filter((o) => t - first("e2") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 2.59, 4.44].filter((o) => t - first("e2") >= o - 0.05).length - 1], pu(t, first("e2"))); },  },
      n2: { set: "mall", cam: [[0, 0.95, 1.9], [0, 0.75, -0.7], [0, 0.93, 1.6], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)]); }, over: (ctx, W, H_, t, S) => {  OFACE(ctx, S, M_n2[idx(T_n2, t)], t);nightTint(ctx, W, H_); },  },
      e3: { set: "mall", cam: [[0, 0.85, 1.3], [0, 0.75, -0.7], [0, 0.83, 1.0], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_e3[idx(T_e3, t)]); }, over: (ctx, W, H_, t, S) => {  OFACE(ctx, S, M_e3[idx(T_e3, t)], t);nightTint(ctx, W, H_); thought(ctx, S, [0, 1.3, -0.7], ["I won't say anything.", "Fifteen floors.", "I'll go extra slow."][[0.0, 1.48, 2.22].filter((o) => t - first("e3") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.48, 2.22].filter((o) => t - first("e3") >= o - 0.05).length - 1], pu(t, first("e3"))); },  },
      n3: { set: "mall", cam: [[0, 0.95, 1.9], [0, 0.75, -0.7], [0, 0.93, 1.6], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)]); }, over: (ctx, W, H_, t, S) => {  OFACE(ctx, S, M_n3[idx(T_n3, t)], t);nightTint(ctx, W, H_); },  },
      e4: { set: "mall", cam: [[0, 0.85, 1.3], [0, 0.75, -0.7], [0, 0.83, 1.0], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_e4[idx(T_e4, t)]); }, over: (ctx, W, H_, t, S) => {  OFACE(ctx, S, M_e4[idx(T_e4, t)], t);thought(ctx, S, [0, 1.3, -0.7], ["Take your time.", "Nobody's waiting.", "This floor is yours."][[0.0, 1.11, 1.85].filter((o) => t - first("e4") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.11, 1.85].filter((o) => t - first("e4") >= o - 0.05).length - 1], pu(t, first("e4"))); }, fx: [{ k: 'hearts', at: first("e4") + 1.0, n: 4, y: 560 }], },
      cta: { set: "mall", cam: [[0, 0.95, 1.9], [0, 0.75, -0.7], [0, 0.93, 1.6], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)]); }, over: (ctx, W, H_, t, S) => {  OFACE(ctx, S, M_cta[idx(T_cta, t)], t); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
