  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const DRAW = (S, t, mood) => { const c = mood === 'mad' ? [190, 70, 80] : [120, 90, 170]; S.rbox((p) => add(p, [0, 0.32, -0.7]), 0.6, 0.16, 0.3, c, { bevel: 0.4 }); S.rbox((p) => add(p, [0, 0.7, -0.92]), 0.6, 0.28, 0.08, c, { bevel: 0.4 }); for (const x of [-0.62, 0.62]) S.rbox((p) => add(p, [x, 0.5, -0.7]), 0.08, 0.28, 0.3, c, { bevel: 0.4 }); for (let i = 0; i < 3; i++) S.cyl((p) => add(p, [-0.2 + i * 0.2, 0.49, -0.55]), 0.03, 0.005, [240, 200, 60], 10); };
  const OFACE = (ctx, S, mood, t) => objFace(ctx, S, [0, 0.74, -0.82], mood, t, 0.9);
  makeCouch({
    keys: ["thinks", "coins", "forty", "remotes", "three", "chips", "count", "you'd", "minutes", "hours", "softer", "nobody", "holds", "what's", "hiding", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_s1 = [first("s1"), V("s1", "remotes", 1), V("s1", "chips", 1)], M_s1 = ["smug", "smug", "tired"];
      const T_s2 = [first("s2"), V("s2", "that", 1)], M_s2 = ["smug", "tired"];
      const T_n2 = [first("n2")], M_n2 = ["wow"];
      const T_s3 = [first("s3"), V("s3", "who", 1), V("s3", "is", 2)], M_s3 = ["wow", "mad", "sad"];
      const T_n3 = [first("n3")], M_n3 = ["happy"];
      const T_s4 = [first("s4"), V("s4", "nobody", 1), V("s4", "your", 1)], M_s4 = ["smug", "happy", "happy"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["smug", "smug"];
      return {
      hook: { set: 'living', cam: [[0, 0.95, 1.9], [0, 0.75, -0.7], [0, 0.93, 1.6], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_hook[idx(T_hook, t)], t); }, },
      s1: { set: 'living', cam: [[0, 0.85, 1.3], [0, 0.75, -0.7], [0, 0.83, 1.0], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_s1[idx(T_s1, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_s1[idx(T_s1, t)], t); thought(ctx, S, [0, 1.3, -0.7], ["Coins: forty two.", "Remotes: three.", "Chips: too many to count."][idx(T_s1, t)], pu(t, first("s1"))); }, },
      s2: { set: 'living', cam: [[0, 0.85, 1.3], [0, 0.75, -0.7], [0, 0.83, 1.0], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_s2[idx(T_s2, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_s2[idx(T_s2, t)], t); thought(ctx, S, [0, 1.3, -0.7], ["You said you'd only sit for five minutes.", "That was four hours ago."][idx(T_s2, t)], pu(t, first("s2"))); }, },
      n2: { set: 'living', cam: [[0, 0.95, 1.9], [0, 0.75, -0.7], [0, 0.93, 1.6], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_n2[idx(T_n2, t)], t); }, },
      s3: { set: 'living', cam: [[0, 0.85, 1.3], [0, 0.75, -0.7], [0, 0.83, 1.0], [0, 0.75, -0.7]], he: NOONE, she: NOONE, shake: V('s3', 'softer'), props: (S, t) => { DRAW(S, t, M_s3[idx(T_s3, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_s3[idx(T_s3, t)], t); thought(ctx, S, [0, 1.3, -0.7], ["What.", "Who is that.", "Is she softer than me?"][idx(T_s3, t)], pu(t, first("s3"))); }, },
      n3: { set: 'living', cam: [[0, 0.95, 1.9], [0, 0.75, -0.7], [0, 0.93, 1.6], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_n3[idx(T_n3, t)], t); }, },
      s4: { set: 'living', cam: [[0, 0.85, 1.3], [0, 0.75, -0.7], [0, 0.83, 1.0], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_s4[idx(T_s4, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_s4[idx(T_s4, t)], t); thought(ctx, S, [0, 1.3, -0.7], ["I knew it.", "Nobody holds you like I do.", "Your coins are safe with me."][idx(T_s4, t)], pu(t, first("s4"))); }, fx: [{ k: 'hearts', at: V('s4', 'holds'), n: 4, y: 560 }], },
      cta: { set: 'living', cam: [[0, 0.95, 1.9], [0, 0.75, -0.7], [0, 0.93, 1.6], [0, 0.75, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_cta[idx(T_cta, t)], t); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
