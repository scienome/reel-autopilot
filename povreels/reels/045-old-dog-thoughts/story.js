  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const DRAW = (S, t, mood, o) => { S.rbox((p) => add(p, [0, 0.05, 0]), 0.55, 0.05, 0.4, [150, 120, 90], { bevel: 0.5 }); dog(S, Object.assign({ x: 0, y: 0.1, z: 0, s: 0.62, col: [205, 175, 135], belly: [235, 225, 210], ears: 'big', mood: mood === 'happy' ? 'calm' : mood === 'wow' ? 'calm' : mood, tongue: mood === 'happy', t }, o)); };
  makeCouch({
    keys: ["thinks", "don't", "anymore", "still", "cheese", "remember", "small", "under", "table", "sleeps", "sleeping", "guarding", "closed", "floor", "favourite", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_g1 = [first("g1"), V("g1", "but", 1)], M_g1 = ["tired", "happy"];
      const T_g2 = [first("g2"), V("g2", "you", 2), V("g2", "i", 2)], M_g2 = ["calm", "smug", "happy"];
      const T_n2 = [first("n2")], M_n2 = ["tired"];
      const T_g3 = [first("g3"), V("g3", "i'm", 2), V("g3", "with", 1)], M_g3 = ["tired", "smug", "tired"];
      const T_n3 = [first("n3")], M_n3 = ["calm"];
      const T_g4 = [first("g4"), V("g4", "this", 2), V("g4", "you", 1)], M_g4 = ["happy", "happy", "happy"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["happy", "happy"];
      return {
      hook: { set: 'living', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, },
      g1: { set: 'living', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_g1[idx(T_g1, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.9, 0], ["I don't run anymore.", "But I still hear you open the cheese."][idx(T_g1, t)], pu(t, first("g1"))); }, },
      g2: { set: 'living', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_g2[idx(T_g2, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.9, 0], ["I remember when you were small.", "You hid peas under the table.", "I ate them. For you."][idx(T_g2, t)], pu(t, first("g2"))); }, },
      n2: { set: 'living', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, },
      g3: { set: 'living', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_g3[idx(T_g3, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.9, 0], ["I'm not sleeping.", "I'm guarding.", "With my eyes closed."][idx(T_g3, t)], pu(t, first("g3"))); }, },
      n3: { set: 'living', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); }, },
      g4: { set: 'living', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0, 0.4, 1.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_g4[idx(T_g4, t)], {}); }, over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0, 0.9, 0], ["This.", "This is my favourite thing.", "You. Here."][idx(T_g4, t)], pu(t, first("g4"))); }, fx: [{ k: 'hearts', at: V('g4', 'favourite'), n: 4, y: 560 }], },
      cta: { set: 'living', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0, 0.49, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => { DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
