  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const DRAW = (S, t, mood, o) => { S.rbox((p) => add(p, [0.2, 1.02, -0.2]), 0.5, 0.05, 0.4, [235, 245, 252], { bevel: 0.5 }); bird(S, Object.assign({ x: 0.2, y: 1.07, z: -0.2, s: 1.7, col: [30, 32, 44], belly: [245, 245, 248], wing: [30, 32, 44], beak: [250, 160, 40], t, mood }, o)); };
  makeCouch({
    keys: ["penguin", "fell", "cute", "pebble", "six", "days", "forever", "love", "perfect", "you"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["c"];
      const T_p1 = [first("p1") + 0.0, first("p1") + 1.48, first("p1") + 3.7], M_p1 = ["smug", "sad", "mad"];
      const T_p2 = [first("p2") + 0.0, first("p2") + 3.33, first("p2") + 4.44], M_p2 = ["smug", "sad", "sad"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["calm"];
      const T_p3 = [first("p3") + 0.0, first("p3") + 1.85, first("p3") + 3.7], M_p3 = ["calm", "happy", "happy"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["happy"];
      const T_p4 = [first("p4") + 0.0, first("p4") + 0.37, first("p4") + 1.85], M_p4 = ["happy", "happy", "sad"];
      const T_cta = [first("cta") + 0.0, first("cta") + 2.59], M_cta = ["smug", "smug"];
      return {
      hook: { set: "street", cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, over: (ctx, W, H_, t, S) => {  },  },
      p1: { set: "street", cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_p1[idx(T_p1, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 2.25, -0.2], ["You think I'm cute.", "I fell over four times today.", "Nobody filmed the good ones."][[0.0, 1.48, 3.7].filter((o) => t - first("p1") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.48, 3.7].filter((o) => t - first("p1") >= o - 0.05).length - 1], pu(t, first("p1"))); },  },
      p2: { set: "street", cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_p2[idx(T_p2, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 2.25, -0.2], ["Everyone says I look like I'm wearing a tuxedo.", "I'm not fancy.", "I'm just cold."][[0.0, 3.33, 4.44].filter((o) => t - first("p2") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 3.33, 4.44].filter((o) => t - first("p2") >= o - 0.05).length - 1], pu(t, first("p2"))); },  },
      n2: { set: "street", cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, over: (ctx, W, H_, t, S) => {  },  },
      p3: { set: "street", cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_p3[idx(T_p3, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 2.25, -0.2], ["I need one perfect pebble.", "It took me six days.", "It's for someone I'll love forever."][[0.0, 1.85, 3.7].filter((o) => t - first("p3") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 1.85, 3.7].filter((o) => t - first("p3") >= o - 0.05).length - 1], pu(t, first("p3"))); }, fx: [{ k: 'hearts', at: first("p3") + 1.0, n: 4, y: 560 }], },
      n3: { set: "street", cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => {  },  },
      p4: { set: "street", cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_p4[idx(T_p4, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 2.25, -0.2], ["Here.", "It's the best pebble.", "Please don't lose it."][[0.0, 0.37, 1.85].filter((o) => t - first("p4") >= o - 0.05).length - 1 < 0 ? 0 : [0.0, 0.37, 1.85].filter((o) => t - first("p4") >= o - 0.05).length - 1], pu(t, first("p4"))); }, fx: [{ k: 'hearts', at: first("p4") + 1.0, n: 4, y: 560 }], },
      cta: { set: "street", cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, over: (ctx, W, H_, t, S) => {  }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
