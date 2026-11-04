  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const DRAW = (S, t, mood) => { S.rbox((p) => add(p, [0, 0.42, -0.75]), 0.32, 0.42, 0.3, [235, 238, 242], { bevel: 0.2 }); S.cyl((p) => add(p, [0, 0.42, -0.45]), 0.2, 0.02, [60, 70, 90], 22); S.cyl((p) => add(p, [0, 0.42, -0.44]), 0.16, 0.01, mood === 'happy' || mood === 'smug' ? [240, 150, 190] : [120, 170, 220], 22); };
  const OFACE = (ctx, S, mood, t) => objFace(ctx, S, [0, 0.74, -0.44], mood, t, 0.85);
  makeCouch({
    keys: ["washing", "machine", "thinks", "forty", "socks", "thirty", "you'll", "never", "collection", "hundred", "children", "shirt", "whites", "everything", "forget", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_w1 = [first("w1"), V("w1", "thirty", 1), V("w1", "you'll", 1)], M_w1 = ["calm", "smug", "smug"];
      const T_w2 = [first("w2"), V("w2", "two", 1), V("w2", "i", 2)], M_w2 = ["smug", "happy", "happy"];
      const T_n2 = [first("n2")], M_n2 = ["wow"];
      const T_w3 = [first("w3"), V("w3", "oh", 2), V("w3", "everything", 1)], M_w3 = ["wow", "smug", "happy"];
      const T_n3 = [first("n3")], M_n3 = ["mad"];
      const T_w4 = [first("w4"), V("w4", "i've", 1), V("w4", "i", 1)], M_w4 = ["sad", "sad", "tired"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["smug", "smug"];
      return {
      hook: { set: 'kitchen', cam: [[0, 0.75, 1.7], [0, 0.7200000000000001, -0.7], [0, 0.7350000000000001, 1.4], [0, 0.7200000000000001, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_hook[idx(T_hook, t)], t); }, },
      w1: { set: 'kitchen', cam: [[0, 0.7000000000000001, 1.1], [0, 0.7200000000000001, -0.7], [0, 0.6900000000000001, 0.8], [0, 0.7200000000000001, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_w1[idx(T_w1, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_w1[idx(T_w1, t)], t); thought(ctx, S, [0, 1.25, -0.7], ["Forty socks went in.", "Thirty nine came out.", "You'll never know why."][idx(T_w1, t)], pu(t, first("w1"))); }, },
      w2: { set: 'kitchen', cam: [[0, 0.7000000000000001, 1.1], [0, 0.7200000000000001, -0.7], [0, 0.6900000000000001, 0.8], [0, 0.7200000000000001, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_w2[idx(T_w2, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_w2[idx(T_w2, t)], t); thought(ctx, S, [0, 1.25, -0.7], ["I have a collection.", "Two hundred socks.", "I call them my children."][idx(T_w2, t)], pu(t, first("w2"))); }, },
      n2: { set: 'kitchen', cam: [[0, 0.75, 1.7], [0, 0.7200000000000001, -0.7], [0, 0.7350000000000001, 1.4], [0, 0.7200000000000001, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_n2[idx(T_n2, t)], t); }, },
      w3: { set: 'kitchen', cam: [[0, 0.7000000000000001, 1.1], [0, 0.7200000000000001, -0.7], [0, 0.6900000000000001, 0.8], [0, 0.7200000000000001, -0.7]], he: NOONE, she: NOONE, shake: V('w3', 'pink'), props: (S, t) => { DRAW(S, t, M_w3[idx(T_w3, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_w3[idx(T_w3, t)], t); thought(ctx, S, [0, 1.25, -0.7], ["Oh no.", "Oh, this is my art.", "Everything is pink now."][idx(T_w3, t)], pu(t, first("w3"))); }, },
      n3: { set: 'kitchen', cam: [[0, 0.75, 1.7], [0, 0.7200000000000001, -0.7], [0, 0.7350000000000001, 1.4], [0, 0.7200000000000001, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_n3[idx(T_n3, t)], t); }, },
      w4: { set: 'kitchen', cam: [[0, 0.7000000000000001, 1.1], [0, 0.7200000000000001, -0.7], [0, 0.6900000000000001, 0.8], [0, 0.7200000000000001, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_w4[idx(T_w4, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_w4[idx(T_w4, t)], t); thought(ctx, S, [0, 1.25, -0.7], ["The smell.", "I've seen things.", "I need a holiday."][idx(T_w4, t)], pu(t, first("w4"))); }, },
      cta: { set: 'kitchen', cam: [[0, 0.75, 1.7], [0, 0.7200000000000001, -0.7], [0, 0.7350000000000001, 1.4], [0, 0.7200000000000001, -0.7]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_cta[idx(T_cta, t)], t); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
