  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const BR = [168, 112, 70];
  const DRAW = (S, t, mood) => { S.rbox((p) => add(p, [0, 0.05, 0]), 0.5, 0.05, 0.4, [120, 130, 180], { bevel: 0.5 }); S.ball([0, 0.35, 0], [0.22, 0.26, 0.18], BR); S.ball([0, 0.33, 0.12], [0.14, 0.17, 0.08], [214, 170, 120]);
    for (const sd of [-1, 1]) { S.limb([sd * 0.2, 0.42, 0.02], [sd * 0.3, 0.3, 0.12], 0.06, 0.05, BR); S.ball([sd * 0.15, 0.1, 0.1], [0.08, 0.07, 0.1], BR); S.ball([sd * 0.13, 0.78, -0.02], 0.07, BR); S.ball([sd * 0.13, 0.78, 0.0], 0.04, [214, 170, 120]); }
    S.ball([0, 0.7, 0.02], [0.2, 0.18, 0.18], BR); S.ball([0, 0.66, 0.17], [0.09, 0.07, 0.06], [214, 170, 120]); S.ball([0, 0.68, 0.22], 0.025, [30, 24, 24], { rim: false }); };
  const OFACE = (ctx, S, mood, t) => objFace(ctx, S, [0, 0.73, 0.18], mood, t, 0.45);
  makeCouch({
    keys: ["teddy", "best", "friend", "shelf", "door", "came", "back", "warm", "listener", "toy"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["calm"];
      const T_b1 = [first("b1") + 0.0, first("b1") + 3.33, first("b1") + 5.55], M_b1 = ["happy", "sad", "sad"];
      const T_b2 = [first("b2") + 0.0, first("b2") + 1.48, first("b2") + 4.44], M_b2 = ["calm", "sad", "happy"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["calm"];
      const T_b3 = [first("b3") + 0.0, first("b3") + 1.11, first("b3") + 2.96], M_b3 = ["wow", "happy", "happy"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["happy"];
      const T_b4 = [first("b4") + 0.0, first("b4") + 2.59, first("b4") + 3.7], M_b4 = ["happy", "smug", "happy"];
      const T_cta = [first("cta") + 0.0, first("cta") + 2.59], M_cta = ["smug", "smug"];
      return {
      hook: { set: "bedroom", cam: [[0, 0.6, 2.5], [0, 0.45, 0], [0, 0.58, 2.2], [0, 0.45, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)]); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); OFACE(ctx, S, M_hook[idx(T_hook, t)], t); } },
      b1: { set: "bedroom", cam: [[0, 0.55, 1.9], [0, 0.5, 0], [0, 0.53, 1.6], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_b1[idx(T_b1, t)]); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); OFACE(ctx, S, M_b1[idx(T_b1, t)], t); thought(ctx, S, [0, 1.0, 0], ["Day one: you said I was your best friend.", "Day four thousand: you're at university.", "I'm still on the shelf, facing the door."][idx(T_b1, t)], pu(t, first("b1"))); } },
      b2: { set: "bedroom", cam: [[0, 0.55, 1.9], [0, 0.5, 0], [0, 0.53, 1.6], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_b2[idx(T_b2, t)]); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); OFACE(ctx, S, M_b2[idx(T_b2, t)], t); thought(ctx, S, [0, 1.0, 0], ["I know you're busy.", "I lost an eye in two thousand nine.", "You cried for a week."][idx(T_b2, t)], pu(t, first("b2"))); } },
      n2: { set: "bedroom", cam: [[0, 0.6, 2.5], [0, 0.45, 0], [0, 0.58, 2.2], [0, 0.45, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)]); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); OFACE(ctx, S, M_n2[idx(T_n2, t)], t); } },
      b3: { set: "bedroom", cam: [[0, 0.55, 1.9], [0, 0.5, 0], [0, 0.53, 1.6], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_b3[idx(T_b3, t)]); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); OFACE(ctx, S, M_b3[idx(T_b3, t)], t); thought(ctx, S, [0, 1.0, 0], ["You came back.", "I kept your spot warm.", "Twenty years. It's still warm."][idx(T_b3, t)], pu(t, first("b3"))); }, fx: [{ k: 'hearts', at: first("b3") + 1.0, n: 4, y: 560 }] },
      n3: { set: "bedroom", cam: [[0, 0.6, 2.5], [0, 0.45, 0], [0, 0.58, 2.2], [0, 0.45, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)]); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); OFACE(ctx, S, M_n3[idx(T_n3, t)], t); } },
      b4: { set: "bedroom", cam: [[0, 0.55, 1.9], [0, 0.5, 0], [0, 0.53, 1.6], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_b4[idx(T_b4, t)]); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); OFACE(ctx, S, M_b4[idx(T_b4, t)], t); thought(ctx, S, [0, 1.0, 0], ["Tell your kids I'm a good listener.", "I've heard everything.", "I never told anyone."][idx(T_b4, t)], pu(t, first("b4"))); }, fx: [{ k: 'hearts', at: first("b4") + 1.0, n: 4, y: 560 }] },
      cta: { set: "bedroom", cam: [[0, 0.6, 2.5], [0, 0.45, 0], [0, 0.58, 2.2], [0, 0.45, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)]); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); OFACE(ctx, S, M_cta[idx(T_cta, t)], t); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
      };
    },
  });
