  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const DRAW = (S, t, mood) => { S.rbox((p) => add(p, [0, 0.95, -0.7]), 0.55, 0.05, 0.3, [226, 214, 196], { bevel: 0.4 }); S.limb([0, 1.0, -0.7], [0, 1.75, -0.7], 0.15, 0.12, [70, 150, 220]); S.rbox((p) => add(p, [0, 1.88, -0.7]), 0.1, 0.12, 0.04, [250, 250, 252], { bevel: 0.4 }); for (let i = 0; i < 4; i++) S.limb([-0.06 + i * 0.04, 1.95, -0.68], [-0.06 + i * 0.04, 2.05, -0.68], 0.012, 0.01, [120, 220, 200]); };
  const OFACE = (ctx, S, mood, t) => objFace(ctx, S, [0, 1.4, -0.56], mood, t, 0.75);
  makeCouch({
    keys: ["toothbrush", "mouth", "secrets", "garlic", "months", "tired", "sink", "patient", "minutes", "replace"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["calm"];
      const T_g1 = [first("g1") + 0.0, first("g1") + 2.96, first("g1") + 4.81], M_g1 = ["calm", "smug", "mad"];
      const T_g2 = [first("g2") + 0.0, first("g2") + 1.85, first("g2") + 3.33], M_g2 = ["happy", "mad", "tired"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["calm"];
      const T_g3 = [first("g3") + 0.0, first("g3") + 1.85, first("g3") + 3.7], M_g3 = ["sad", "happy", "happy"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["happy"];
      const T_g4 = [first("g4") + 0.0, first("g4") + 0.74, first("g4") + 2.22], M_g4 = ["wow", "happy", "sad"];
      const T_cta = [first("cta") + 0.0, first("cta") + 2.22], M_cta = ["smug", "smug"];
      return {
      hook: { set: "kitchen", cam: [[0, 1.7, 1.9], [0, 1.5, -0.7], [0, 1.68, 1.6], [0, 1.5, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)]); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_hook[idx(T_hook, t)], t); } },
      g1: { set: "kitchen", cam: [[0, 1.6, 1.3], [0, 1.5, -0.7], [0, 1.58, 1.0], [0, 1.5, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_g1[idx(T_g1, t)]); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_g1[idx(T_g1, t)], t); thought(ctx, S, [0, 2.0, -0.7], ["Twice a day, I go in your mouth.", "I know all your secrets.", "You had garlic for lunch."][idx(T_g1, t)], pu(t, first("g1"))); } },
      g2: { set: "kitchen", cam: [[0, 1.6, 1.3], [0, 1.5, -0.7], [0, 1.58, 1.0], [0, 1.5, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_g2[idx(T_g2, t)]); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_g2[idx(T_g2, t)], t); thought(ctx, S, [0, 2.0, -0.7], ["We've been together eleven months.", "The packet says three.", "I'm so tired."][idx(T_g2, t)], pu(t, first("g2"))); } },
      n2: { set: "kitchen", cam: [[0, 1.7, 1.9], [0, 1.5, -0.7], [0, 1.68, 1.6], [0, 1.5, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)]); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_n2[idx(T_n2, t)], t); } },
      g3: { set: "kitchen", cam: [[0, 1.6, 1.3], [0, 1.5, -0.7], [0, 1.58, 1.0], [0, 1.5, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_g3[idx(T_g3, t)]); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_g3[idx(T_g3, t)], t); thought(ctx, S, [0, 2.0, -0.7], ["It's okay. I get it.", "I'll wait on the sink.", "I'm very patient."][idx(T_g3, t)], pu(t, first("g3"))); }, fx: [{ k: 'hearts', at: first("g3") + 1.0, n: 4, y: 560 }] },
      n3: { set: "kitchen", cam: [[0, 1.7, 1.9], [0, 1.5, -0.7], [0, 1.68, 1.6], [0, 1.5, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)]); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_n3[idx(T_n3, t)], t); } },
      g4: { set: "kitchen", cam: [[0, 1.6, 1.3], [0, 1.5, -0.7], [0, 1.58, 1.0], [0, 1.5, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_g4[idx(T_g4, t)]); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_g4[idx(T_g4, t)], t); thought(ctx, S, [0, 2.0, -0.7], ["Two minutes?", "You're my favourite human.", "Please don't replace me. Okay, replace me."][idx(T_g4, t)], pu(t, first("g4"))); } },
      cta: { set: "kitchen", cam: [[0, 1.7, 1.9], [0, 1.5, -0.7], [0, 1.68, 1.6], [0, 1.5, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)]); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_cta[idx(T_cta, t)], t); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
      };
    },
  });
