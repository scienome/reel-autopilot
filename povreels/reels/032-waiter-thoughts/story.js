  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const SUBJ = (o) => Object.assign({ who: 'waiter', x: 0, z: -0.75, yaw: 0, sit: false, arms: 'hold' }, o);
  makeCouch({
    keys: ["waiter", "thinks", "table", "still", "reading", "twenty", "minutes", "you'll", "order", "burger", "everyone", "orders", "salad", "respect", "jealous", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_w1 = [first("w1"), V("w1", "still", 1), V("w1", "for", 1)], M_w1 = ["calm", "tired", "mad"];
      const T_w2 = [first("w2"), V("w2", "everyone", 1)], M_w2 = ["smug", "smug"];
      const T_n2 = [first("n2")], M_n2 = ["wow"];
      const T_w3 = [first("w3"), V("w3", "you'll", 1)], M_w3 = ["wow", "smug"];
      const T_n3 = [first("n3")], M_n3 = ["wow"];
      const T_w4 = [first("w4"), V("w4", "nobody", 1), V("w4", "i'm", 1)], M_w4 = ["wow", "happy", "happy"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["happy", "happy"];
      return {
      hook: { set: 'restaurant', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_hook[idx(T_hook, t)]] })], },
      w1: { set: 'restaurant', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_w1[idx(T_w1, t)]], arms: 'hold' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Table six.", "Still reading the menu.", "For twenty minutes."][idx(T_w1, t)], pu(t, first("w1"))); }, },
      w2: { set: 'restaurant', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_w2[idx(T_w2, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["You'll order the burger.", "Everyone orders the burger."][idx(T_w2, t)], pu(t, first("w2"))); }, },
      n2: { set: 'restaurant', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n2[idx(T_n2, t)]] })], },
      w3: { set: 'restaurant', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_w3[idx(T_w3, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Respect.", "You'll be jealous of table four in ten minutes."][idx(T_w3, t)], pu(t, first("w3"))); }, },
      n3: { set: 'restaurant', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n3[idx(T_n3, t)]] })], },
      w4: { set: 'restaurant', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_w4[idx(T_w4, t)]], arms: 'shrug' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Wait.", "Nobody tips on a Monday.", "I'm telling my mum about you."][idx(T_w4, t)], pu(t, first("w4"))); }, fx: [{ k: 'hearts', at: V('w4', 'telling'), n: 4, y: 560 }], },
      cta: { set: 'restaurant', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_cta[idx(T_cta, t)]] })], fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
