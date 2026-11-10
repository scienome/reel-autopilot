  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);
  const DRAW = (S, t, mood) => { const c = mood === 'mad' ? [150, 80, 60] : [150, 104, 70]; S.rbox((p) => add(p, [0, 0.95, -0.9]), 0.45, 0.95, 0.05, c, { bevel: 0.2 }); S.rbox((p) => add(p, [0, 0.95, -0.92]), 0.54, 1.0, 0.03, [235, 232, 225], { bevel: 0.2 }); S.ball([0.34, 0.9, -0.82], 0.035, [240, 200, 70], { gloss: 0.9 }); };
  const OFACE = (ctx, S, mood, t) => objFace(ctx, S, [0, 1.2, -0.84], mood, t, 0.8);
  makeCouch({
    keys: ["door", "slam", "drum", "midnight", "nothing", "outside", "time", "anywhere", "welcome", "home"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook") + 0.0], M_hook = ["calm"];
      const T_d1 = [first("d1") + 0.0, first("d1") + 1.11, first("d1") + 2.22], M_d1 = ["mad", "mad", "mad"];
      const T_d2 = [first("d2") + 0.0, first("d2") + 2.96, first("d2") + 5.92], M_d2 = ["calm", "tired", "smug"];
      const T_n2 = [first("n2") + 0.0], M_n2 = ["calm"];
      const T_d3 = [first("d3") + 0.0, first("d3") + 2.22, first("d3") + 2.96], M_d3 = ["sad", "sad", "happy"];
      const T_n3 = [first("n3") + 0.0], M_n3 = ["happy"];
      const T_d4 = [first("d4") + 0.0, first("d4") + 0.74, first("d4") + 2.59], M_d4 = ["happy", "sad", "happy"];
      const T_cta = [first("cta") + 0.0, first("cta") + 2.59], M_cta = ["smug", "smug"];
      return {
      hook: { set: "living", cam: [[0, 1.15, 1.9], [0, 0.95, -0.7], [0, 1.13, 1.6], [0, 0.95, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)]); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_hook[idx(T_hook, t)], t); } },
      d1: { set: "living", cam: [[0, 1.05, 1.3], [0, 0.95, -0.7], [0, 1.03, 1.0], [0, 0.95, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_d1[idx(T_d1, t)]); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_d1[idx(T_d1, t)], t); thought(ctx, S, [0, 1.75, -0.9], ["Slam. Slam. Slam.", "Every single day.", "I'm not a drum."][idx(T_d1, t)], pu(t, first("d1"))); } },
      d2: { set: "living", cam: [[0, 1.05, 1.3], [0, 0.95, -0.7], [0, 1.03, 1.0], [0, 0.95, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_d2[idx(T_d2, t)]); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_d2[idx(T_d2, t)], t); thought(ctx, S, [0, 1.75, -0.9], ["You come home at seven. You say nothing.", "You come home at midnight. You say nothing.", "I know everything anyway."][idx(T_d2, t)], pu(t, first("d2"))); } },
      n2: { set: "living", cam: [[0, 1.15, 1.9], [0, 0.95, -0.7], [0, 1.13, 1.6], [0, 0.95, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)]); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_n2[idx(T_n2, t)], t); } },
      d3: { set: "living", cam: [[0, 1.05, 1.3], [0, 0.95, -0.7], [0, 1.03, 1.0], [0, 0.95, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_d3[idx(T_d3, t)]); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_d3[idx(T_d3, t)], t); thought(ctx, S, [0, 1.75, -0.9], ["You're not ready to come in.", "That's okay.", "Take your time. I'm not going anywhere."][idx(T_d3, t)], pu(t, first("d3"))); }, fx: [{ k: 'hearts', at: first("d3") + 1.0, n: 4, y: 560 }] },
      n3: { set: "living", cam: [[0, 1.15, 1.9], [0, 0.95, -0.7], [0, 1.13, 1.6], [0, 0.95, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)]); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_n3[idx(T_n3, t)], t); } },
      d4: { set: "living", cam: [[0, 1.05, 1.3], [0, 0.95, -0.7], [0, 1.03, 1.0], [0, 0.95, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_d4[idx(T_d4, t)]); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_d4[idx(T_d4, t)], t); thought(ctx, S, [0, 1.75, -0.9], ["Welcome home.", "I say it every day.", "Today, you heard me."][idx(T_d4, t)], pu(t, first("d4"))); }, fx: [{ k: 'hearts', at: first("d4") + 1.0, n: 4, y: 560 }] },
      cta: { set: "living", cam: [[0, 1.15, 1.9], [0, 0.95, -0.7], [0, 1.13, 1.6], [0, 0.95, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)]); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_cta[idx(T_cta, t)], t); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }] },
      };
    },
  });
