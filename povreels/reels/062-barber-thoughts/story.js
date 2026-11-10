  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const PERSON = (o) => Object.assign({ who: 'boss', x: 0, z: -0.75, yaw: 0, sit: false, arms: 'hold', shirt: [36, 40, 52], pants: [36, 36, 44], tie: [190, 40, 50], hair: [30, 24, 20] }, o);
  makeCouch({
    keys: ["barber", "last", "time", "photo", "star", "best", "talk", "slowly", "chair", "yours"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["calm"];
      const T_b1 = [first("b1") + 0.0, first("b1") + 1.85, first("b1") + 3.33], M_b1 = ["calm", "calm", "mad"];
      const T_b2 = [first("b2") + 0.0, first("b2") + 3.33, first("b2") + 5.92], M_b2 = ["wow", "smug", "happy"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["calm"];
      const T_b3 = [first("b3") + 0.0, first("b3") + 1.85, first("b3") + 4.07], M_b3 = ["calm", "sad", "happy"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["happy"];
      const T_b4 = [first("b4") + 0.0, first("b4") + 1.85, first("b4") + 3.33], M_b4 = ["happy", "happy", "happy"];
      const T_cta = [first("cta") + 0.0, first("cta") + 2.22], M_cta = ["smug", "smug"];
      return {
      hook: { set: "restaurant", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON({ face: FACE[M_hook[idx(T_hook, t)]] })], over: (ctx, W, H_, t, S) => { } },
      b1: { set: "restaurant", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON({ face: FACE[M_b1[idx(T_b1, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["How would you like it?", "Same as last time.", "I have no idea what last time was."][idx(T_b1, t)], pu(t, first("b1"))); } },
      b2: { set: "restaurant", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON({ face: FACE[M_b2[idx(T_b2, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["You showed me a photo of a movie star.", "Sir, you are not a movie star.", "I'll do my best."][idx(T_b2, t)], pu(t, first("b2"))); } },
      n2: { set: "restaurant", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON({ face: FACE[M_n2[idx(T_n2, t)]] })], over: (ctx, W, H_, t, S) => { } },
      b3: { set: "restaurant", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON({ face: FACE[M_b3[idx(T_b3, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["He doesn't need a haircut.", "He needs someone to talk to.", "So I cut very slowly."][idx(T_b3, t)], pu(t, first("b3"))); }, fx: [{ k: 'hearts', at: first("b3") + 1.0, n: 4, y: 560 }] },
      n3: { set: "restaurant", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON({ face: FACE[M_n3[idx(T_n3, t)]] })], over: (ctx, W, H_, t, S) => { } },
      b4: { set: "restaurant", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON({ face: FACE[M_b4[idx(T_b4, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Same time next week, sir.", "I'll save your chair.", "It's always yours."][idx(T_b4, t)], pu(t, first("b4"))); }, fx: [{ k: 'hearts', at: first("b4") + 1.0, n: 4, y: 560 }] },
      cta: { set: "restaurant", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON({ face: FACE[M_cta[idx(T_cta, t)]] })], over: (ctx, W, H_, t, S) => { }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
      };
    },
  });
