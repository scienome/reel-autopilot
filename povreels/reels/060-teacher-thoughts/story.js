  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const PERSON = (o) => Object.assign({ who: 'boss', x: 0, z: -0.75, yaw: 0, sit: false, arms: 'hold', shirt: [214, 120, 150], pants: [70, 70, 104], tie: [214, 120, 150], hair: [110, 66, 40] }, o);
  makeCouch({
    keys: ["teacher", "talking", "chapter", "answer", "right", "allergies", "angry", "thirty", "love", "tell"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["calm"];
      const T_t1 = [first("t1") + 0.0, first("t1") + 1.48, first("t1") + 2.96], M_t1 = ["calm", "calm", "mad"];
      const T_t2 = [first("t2") + 0.0, first("t2") + 1.48, first("t2") + 3.7], M_t2 = ["mad", "smug", "smug"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["calm"];
      const T_t3 = [first("t3") + 0.0, first("t3") + 2.59, first("t3") + 5.92], M_t3 = ["wow", "happy", "happy"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["happy"];
      const T_t4 = [first("t4") + 0.0, first("t4") + 1.85, first("t4") + 4.07], M_t4 = ["smug", "happy", "smug"];
      const T_cta = [first("cta") + 0.0, first("cta") + 1.85], M_cta = ["smug", "smug"];
      return {
      hook: { set: "restaurant", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON({ face: FACE[M_hook[idx(T_hook, t)]] })], over: (ctx, W, H_, t, S) => { } },
      t1: { set: "restaurant", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON({ face: FACE[M_t1[idx(T_t1, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Please don't be talking.", "Please don't be talking.", "You're talking."][idx(T_t1, t)], pu(t, first("t1"))); } },
      t2: { set: "restaurant", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON({ face: FACE[M_t2[idx(T_t2, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Nobody read the chapter.", "I can tell by your faces.", "Also, the chapter was great."][idx(T_t2, t)], pu(t, first("t2"))); } },
      n2: { set: "restaurant", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON({ face: FACE[M_n2[idx(T_n2, t)]] })], over: (ctx, W, H_, t, S) => { } },
      t3: { set: "restaurant", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON({ face: FACE[M_t3[idx(T_t3, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["He said the answer. He was right.", "He's been too scared to talk for a year.", "I'm not crying. It's allergies."][idx(T_t3, t)], pu(t, first("t3"))); }, fx: [{ k: 'hearts', at: first("t3") + 1.0, n: 4, y: 560 }] },
      n3: { set: "restaurant", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON({ face: FACE[M_n3[idx(T_n3, t)]] })], over: (ctx, W, H_, t, S) => { } },
      t4: { set: "restaurant", cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON({ face: FACE[M_t4[idx(T_t4, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Tomorrow I'll act angry again.", "Thirty kids. I love every one.", "Don't tell them."][idx(T_t4, t)], pu(t, first("t4"))); }, fx: [{ k: 'hearts', at: first("t4") + 1.0, n: 4, y: 560 }] },
      cta: { set: "restaurant", cam: [[0, 1.8, 2.35], [0, 2.17, -0.75], [0, 1.86, 2.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, extras: (t) => [PERSON({ face: FACE[M_cta[idx(T_cta, t)]] })], over: (ctx, W, H_, t, S) => { }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
      };
    },
  });
