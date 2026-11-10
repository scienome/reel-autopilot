  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const BABY = (o) => Object.assign({ who: 'kid', s: 0.55, sit: true, x: 0, z: -0.3, shirt: [250, 235, 240], pants: [250, 235, 240], hair: [90, 60, 40] }, o);
  const crib = (S) => { S.rbox((p) => add(p, [0, 0.45, -0.3]), 0.5, 0.05, 0.4, [190, 205, 235], { bevel: 0.4 }); S.rbox((p) => add(p, [0, 0.35, -0.3]), 0.5, 0.04, 0.4, [150, 120, 90], { bevel: 0.4 }); for (let i = -5; i <= 5; i++) S.rbox((p) => add(p, [i * 0.09, 0.65, -0.62]), 0.012, 0.28, 0.012, [250, 250, 252], { bevel: 0.3 }); S.rbox((p) => add(p, [0, 0.95, -0.62]), 0.5, 0.02, 0.02, [250, 250, 252], { bevel: 0.3 }); };
  makeCouch({
    keys: ["newborn", "bright", "outside", "cry", "sorry", "smell", "home", "heartbeat", "song", "stayed"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["calm"];
      const T_w1 = [first("w1") + 0.0, first("w1") + 2.59, first("w1") + 4.44], M_w1 = ["wow", "mad", "sad"];
      const T_w2 = [first("w2") + 0.0, first("w2") + 2.22, first("w2") + 3.33], M_w2 = ["sad", "sad", "happy"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["calm"];
      const T_w3 = [first("w3") + 0.0, first("w3") + 1.48, first("w3") + 4.81], M_w3 = ["happy", "happy", "sad"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["tired"];
      const T_w4 = [first("w4") + 0.0, first("w4") + 2.22, first("w4") + 3.33], M_w4 = ["calm", "happy", "happy"];
      const T_cta = [first("cta") + 0.0, first("cta") + 1.85], M_cta = ["smug", "smug"];
      return {
      hook: { set: "bedroom", cam: [[0, 1.45, 1.9], [0, 1.15, -0.3], [0, 1.4, 1.6], [0, 1.15, -0.3]], he: NOONE, she: NOONE, props: (S, t) => { crib(S); }, extras: (t) => [BABY({ face: FACE[M_hook[idx(T_hook, t)]] })], over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); } },
      w1: { set: "bedroom", cam: [[0, 1.35, 1.4], [0, 1.2, -0.3], [0, 1.3, 1.15], [0, 1.2, -0.3]], he: NOONE, she: NOONE, props: (S, t) => { crib(S); }, extras: (t) => [BABY({ face: FACE[M_w1[idx(T_w1, t)]] })], over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0, 1.55, -0.3], ["Hello. Who is the big tired one?", "Why is it so bright?", "Why am I outside?"][idx(T_w1, t)], pu(t, first("w1"))); } },
      w2: { set: "bedroom", cam: [[0, 1.35, 1.4], [0, 1.2, -0.3], [0, 1.3, 1.15], [0, 1.2, -0.3]], he: NOONE, she: NOONE, props: (S, t) => { crib(S); }, extras: (t) => [BABY({ face: FACE[M_w2[idx(T_w2, t)]] })], over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0, 1.55, -0.3], ["I can't walk. I can't talk.", "So I cry.", "Sorry. It's all I have."][idx(T_w2, t)], pu(t, first("w2"))); } },
      n2: { set: "bedroom", cam: [[0, 1.45, 1.9], [0, 1.15, -0.3], [0, 1.4, 1.6], [0, 1.15, -0.3]], he: NOONE, she: NOONE, props: (S, t) => { crib(S); }, extras: (t) => [BABY({ face: FACE[M_n2[idx(T_n2, t)]] })], over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); } },
      w3: { set: "bedroom", cam: [[0, 1.35, 1.4], [0, 1.2, -0.3], [0, 1.3, 1.15], [0, 1.2, -0.3]], he: NOONE, she: NOONE, props: (S, t) => { crib(S); }, extras: (t) => [BABY({ face: FACE[M_w3[idx(T_w3, t)]] })], over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0, 1.55, -0.3], ["You smell like home.", "Your heartbeat is the first song I ever heard.", "Don't put me down."][idx(T_w3, t)], pu(t, first("w3"))); }, fx: [{ k: 'hearts', at: first("w3") + 1.0, n: 4, y: 560 }] },
      n3: { set: "bedroom", cam: [[0, 1.45, 1.9], [0, 1.15, -0.3], [0, 1.4, 1.6], [0, 1.15, -0.3]], he: NOONE, she: NOONE, props: (S, t) => { crib(S); }, extras: (t) => [BABY({ face: FACE[M_n3[idx(T_n3, t)]] })], over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); } },
      w4: { set: "bedroom", cam: [[0, 1.35, 1.4], [0, 1.2, -0.3], [0, 1.3, 1.15], [0, 1.2, -0.3]], he: NOONE, she: NOONE, props: (S, t) => { crib(S); }, extras: (t) => [BABY({ face: FACE[M_w4[idx(T_w4, t)]] })], over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0, 1.55, -0.3], ["I won't remember any of this.", "But you will.", "Thanks for staying up."][idx(T_w4, t)], pu(t, first("w4"))); }, fx: [{ k: 'hearts', at: first("w4") + 1.0, n: 4, y: 560 }] },
      cta: { set: "bedroom", cam: [[0, 1.45, 1.9], [0, 1.15, -0.3], [0, 1.4, 1.6], [0, 1.15, -0.3]], he: NOONE, she: NOONE, props: (S, t) => { crib(S); }, extras: (t) => [BABY({ face: FACE[M_cta[idx(T_cta, t)]] })], over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
      };
    },
  });
