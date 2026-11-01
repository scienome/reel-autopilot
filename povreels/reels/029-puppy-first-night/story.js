  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const pbed = (S) => { S.rbox((p) => add(p, [0, 0.06, 0]), 0.55, 0.06, 0.4, [120, 130, 180], { bevel: 0.5 }); };
  const DRAW = (S, t, mood, o) => { pbed(S); dog(S, Object.assign({ x: 0, y: 0.1, z: 0, s: 0.55, col: [225, 185, 120], ears: 'big', mood: mood === 'happy' ? 'calm' : mood, tongue: mood === 'happy', t }, o)); };
  makeCouch({
    keys: ["where", "mum", "bed", "bigger", "nobody", "cry", "love", "home", "live", "leaving", "shoe", "sofa", "remember", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["sad"];
      const T_p1 = [first("p1"), V("p1", "who", 1), V("p1", "where", 2)], M_p1 = ["sad", "sad", "sad"];
      const T_p2 = [first("p2"), V("p2", "it", 1)], M_p2 = ["sad", "sad"];
      const T_n2 = [first("n2")], M_n2 = ["sad"];
      const T_p3 = [first("p3"), V("p3", "not", 1), V("p3", "because", 2)], M_p3 = ["mad", "smug", "sad"];
      const T_n3 = [first("n3")], M_n3 = ["calm"];
      const T_p4 = [first("p4"), V("p4", "i", 1), V("p4", "i'm", 1)], M_p4 = ["happy", "happy", "happy"];
      const T_n4 = [first("n4")], M_n4 = ["smug"];
      const T_p5 = [first("p5"), V("p5", "your", 2), V("p5", "and", 1), V("p5", "still", 1)], M_p5 = ["smug", "smug", "smug", "happy"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["happy", "happy"];
      return {
      hook: { set: 'bedroom', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0.0, 0.49000000000000005, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); }, },
      p1: { set: 'bedroom', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0.0, 0.4, 1.0999999999999999], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_p1[idx(T_p1, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0, 0.9, 0], ["Where am I?", "Who are you?", "Where is my mum?"][idx(T_p1, t)], pu(t, first("p1"))); }, },
      p2: { set: 'bedroom', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0.0, 0.4, 1.0999999999999999], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_p2[idx(T_p2, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0, 0.9, 0], ["This bed is too big.", "It smells like nobody."][idx(T_p2, t)], pu(t, first("p2"))); }, },
      n2: { set: 'bedroom', cam: [[0, 0.6000000000000001, 2.4], [0, 0.5, 0], [0.0, 0.5800000000000001, 2.1], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); timeCard(ctx, t, first("n2") - 0.1, "2 A.M."); }, },
      p3: { set: 'bedroom', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0.0, 0.4, 1.0999999999999999], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_p3[idx(T_p3, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); thought(ctx, S, [0, 0.9, 0], ["I will cry.", "Not because I'm sad.", "Because I'm checking if you love me."][idx(T_p3, t)], pu(t, first("p3"))); }, },
      n3: { set: 'bedroom', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0.0, 0.49000000000000005, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); }, },
      p4: { set: 'bedroom', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0.0, 0.4, 1.0999999999999999], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_p4[idx(T_p4, t)], {}); }, over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0, 0.9, 0], ["You smell like home.", "I live here now.", "I'm never leaving."][idx(T_p4, t)], pu(t, first("p4"))); }, fx: [{ k: 'hearts', at: V('p4', 'I'), n: 4, y: 560 }], },
      n4: { set: 'bedroom', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0.0, 0.49000000000000005, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_n4[idx(T_n4, t)], {}); }, over: (ctx, W, H_, t, S) => { timeCard(ctx, t, first("n4") - 0.1, "6 MONTHS LATER"); }, },
      p5: { set: 'bedroom', cam: [[0, 0.4, 1.4], [0, 0.5, 0], [0.0, 0.4, 1.0999999999999999], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_p5[idx(T_p5, t)], {}); }, over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 0.9, 0], ["I ate your shoe.", "Your other shoe.", "And the sofa.", "Still love you."][idx(T_p5, t)], pu(t, first("p5"))); }, },
      cta: { set: 'bedroom', cam: [[0, 0.5, 1.8], [0, 0.5, 0], [0.0, 0.49000000000000005, 1.5], [0, 0.5, 0]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
