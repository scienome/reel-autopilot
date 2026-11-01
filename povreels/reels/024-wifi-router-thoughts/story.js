  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const shelf = (S) => { S.rbox((p) => add(p, [0, 0.9, -0.7]), 0.55, 0.03, 0.25, [170, 120, 80], { bevel: 0.2 }); };
  const DRAW = (S, t, mood) => { shelf(S); S.rbox((p) => add(p, [0, 1.0, -0.7]), 0.32, 0.07, 0.18, [232, 236, 242], { bevel: 0.3 }); for (const x of [-0.25, 0, 0.25]) S.limb([x, 1.06, -0.8], [x * 1.25, 1.45, -0.82], 0.014, 0.014, [40, 42, 52]);
    for (let i = 0; i < 4; i++) S.ball([-0.18 + i * 0.12, 1.075, -0.52], 0.012, mood === 'mad' ? [250, 70, 70] : [80, 240, 120], { rim: false }); };
  const OFACE = (ctx, S, mood, t) => objFace(ctx, S, [0, 1.02, -0.52], mood, t, 0.9);
  makeCouch({
    keys: ["eleven", "devices", "router", "thank", "searched", "word", "friday", "video", "calls", "games", "cat", "power", "sorry", "trying", "turn", "off", "on", "button", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_r1 = [first("r1"), V("r1", "one", 1), V("r1", "nobody", 1)], M_r1 = ["tired", "tired", "sad"];
      const T_r2 = [first("r2"), V("r2", "i'm", 1)], M_r2 = ["mad", "calm"];
      const T_n2 = [first("n2")], M_n2 = ["calm"];
      const T_r3 = [first("r3"), V("r3", "three", 1), V("r3", "one", 1)], M_r3 = ["mad", "mad", "tired"];
      const T_n3 = [first("n3")], M_n3 = ["sad"];
      const T_r4 = [first("r4"), V("r4", "i'm", 2), V("r4", "please", 1), V("r4", "it's", 1)], M_r4 = ["sad", "sad", "sad", "tired"];
      const T_n4 = [first("n4")], M_n4 = ["tired"];
      const T_r5 = [first("r5"), V("r5", "that", 1), V("r5", "thank", 1)], M_r5 = ["wow", "happy", "happy"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["happy", "happy"];
      return {
      hook: { set: 'living', cam: [[0, 1.1500000000000001, 1.1], [0, 1.17, -0.7], [0.0, 1.1400000000000001, 0.8], [0, 1.17, -0.7]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_hook[idx(T_hook, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_hook[idx(T_hook, t)], t); }, },
      r1: { set: 'living', cam: [[0, 1.1, 0.6500000000000001], [0, 1.17, -0.7], [0.0, 1.095, 0.35000000000000014], [0, 1.17, -0.7]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_r1[idx(T_r1, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_r1[idx(T_r1, t)], t); thought(ctx, S, [0, 1.5, -0.7], ["Eleven devices.", "One router.", "Nobody says thank you."][idx(T_r1, t)], pu(t, first("r1"))); }, },
      r2: { set: 'living', cam: [[0, 1.1, 0.6500000000000001], [0, 1.17, -0.7], [0.0, 1.095, 0.35000000000000014], [0, 1.17, -0.7]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_r2[idx(T_r2, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_r2[idx(T_r2, t)], t); thought(ctx, S, [0, 1.5, -0.7], ["I know everything you searched.", "I'm not saying a word."][idx(T_r2, t)], pu(t, first("r2"))); }, },
      n2: { set: 'living', cam: [[0, 1.1500000000000001, 1.1], [0, 1.17, -0.7], [0.0, 1.1400000000000001, 0.8], [0, 1.17, -0.7]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_n2[idx(T_n2, t)], {}); }, over: (ctx, W, H_, t, S) => { timeCard(ctx, t, first("n2") - 0.1, "FRIDAY NIGHT"); OFACE(ctx, S, M_n2[idx(T_n2, t)], t); }, },
      r3: { set: 'living', cam: [[0, 1.1, 0.6500000000000001], [0, 1.17, -0.7], [0.0, 1.095, 0.35000000000000014], [0, 1.17, -0.7]], he: NOONE, she: NOONE, shake: first("r3"), props: (S, t) => {  DRAW(S, t, M_r3[idx(T_r3, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_r3[idx(T_r3, t)], t); thought(ctx, S, [0, 1.5, -0.7], ["Four video calls.", "Three games.", "One man streaming a cat."][idx(T_r3, t)], pu(t, first("r3"))); }, },
      n3: { set: 'living', cam: [[0, 1.2, 1.7], [0, 1.17, -0.7], [0.0, 1.185, 1.4], [0, 1.17, -0.7]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_n3[idx(T_n3, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); OFACE(ctx, S, M_n3[idx(T_n3, t)], t); }, },
      r4: { set: 'living', cam: [[0, 1.1, 0.6500000000000001], [0, 1.17, -0.7], [0.0, 1.095, 0.35000000000000014], [0, 1.17, -0.7]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_r4[idx(T_r4, t)], {}); }, over: (ctx, W, H_, t, S) => { nightTint(ctx, W, H_); OFACE(ctx, S, M_r4[idx(T_r4, t)], t); thought(ctx, S, [0, 1.5, -0.7], ["I'm so sorry.", "I'm trying.", "Please turn me off and on again.", "It's the only thing that helps."][idx(T_r4, t)], pu(t, first("r4"))); }, },
      n4: { set: 'living', cam: [[0, 1.2, 1.7], [0, 1.17, -0.7], [0.0, 1.185, 1.4], [0, 1.17, -0.7]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_n4[idx(T_n4, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_n4[idx(T_n4, t)], t); }, },
      r5: { set: 'living', cam: [[0, 1.1, 0.6500000000000001], [0, 1.17, -0.7], [0.0, 1.095, 0.35000000000000014], [0, 1.17, -0.7]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_r5[idx(T_r5, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_r5[idx(T_r5, t)], t); thought(ctx, S, [0, 1.5, -0.7], ["Oh.", "That feels so good.", "Thank you."][idx(T_r5, t)], pu(t, first("r5"))); }, fx: [{ k: 'hearts', at: V('r5', 'Thank'), n: 3, y: 560 }], },
      cta: { set: 'living', cam: [[0, 1.1500000000000001, 1.1], [0, 1.17, -0.7], [0.0, 1.1400000000000001, 0.8], [0, 1.17, -0.7]], he: NOONE, she: NOONE, props: (S, t) => {  DRAW(S, t, M_cta[idx(T_cta, t)], {}); }, over: (ctx, W, H_, t, S) => { OFACE(ctx, S, M_cta[idx(T_cta, t)], t); }, fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
