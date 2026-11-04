  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const wall = (S) => { S.rbox((p) => add(p, [0.2, 0.55, -0.2]), 0.45, 0.55, 0.25, [190, 182, 170], { bevel: 0.1 }); };
  const DRAW = (S, t, mood, o) => { wall(S); bird(S, Object.assign({ x: 0.2, y: 1.1, z: -0.2, s: 1.5, col: [40, 42, 50], belly: [60, 62, 72], wing: [28, 30, 38], beak: [50, 50, 56], t, mood }, o)); };
  makeCouch({
    keys: ["crows", "think", "remember", "faces", "march", "family", "forty", "about", "every", "morning", "watch", "bring", "chips", "nobody", "kidding", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook"), V("hook", "and", 1)], M_hook = ["calm", "calm"];
      const T_k1 = [first("k1"), V("k1", "you", 2)], M_k1 = ["smug", "happy"];
      const T_k2 = [first("k2"), V("k2", "now", 1)], M_k2 = ["smug", "happy"];
      const T_n2 = [first("n2")], M_n2 = ["wow"];
      const T_k3 = [first("k3"), V("k3", "oh", 2), V("k3", "i'll", 1)], M_k3 = ["wow", "mad", "smug"];
      const T_n3 = [first("n3")], M_n3 = ["mad"];
      const T_k4 = [first("k4"), V("k4", "and", 1), V("k4", "just", 1), V("k4", "bring", 2)], M_k4 = ["smug", "mad", "happy", "smug"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["smug", "smug"];
      return {
      hook: { set: 'street', cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, },
      k1: { set: 'street', cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_k1[idx(T_k1, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 1.85, -0.2], ["I know you.", "You gave me a chip in March."][idx(T_k1, t)], pu(t, first("k1"))); }, },
      k2: { set: 'street', cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_k2[idx(T_k2, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 1.85, -0.2], ["I told my family.", "Now all forty of us love you."][idx(T_k2, t)], pu(t, first("k2"))); }, },
      n2: { set: 'street', cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, },
      k3: { set: 'street', cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, shake: V('k3', 'see'), props: (S, t) => { DRAW(S, t, M_k3[idx(T_k3, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 1.85, -0.2], ["Oh.", "Oh, I see.", "I'll tell my family about that too."][idx(T_k3, t)], pu(t, first("k3"))); }, },
      n3: { set: 'street', cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); }, },
      k4: { set: 'street', cam: [[0.2, 1.6, 1.4], [0.2, 1.45, -0.2], [0.2, 1.59, 1.1], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_k4[idx(T_k4, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0.2, 1.85, -0.2], ["Bring chips.", "And nobody gets hurt.", "Just kidding.", "Bring chips."][idx(T_k4, t)], pu(t, first("k4"))); }, },
      cta: { set: 'street', cam: [[0.2, 1.6, 2.2], [0.2, 1.45, -0.2], [0.2, 1.59, 1.9], [0.2, 1.45, -0.2]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
