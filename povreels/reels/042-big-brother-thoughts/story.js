  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

  const SUBJ = (o) => Object.assign({ who: 'bro', x: 0, z: -0.75, yaw: 0, sit: false, arms: 'hold' }, o);
  makeCouch({
    keys: ["brother", "thinks", "small", "human", "chips", "stopped", "broke", "believes", "favourite", "fight", "carries", "don't", "anyone", "reputation", "still", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_b1 = [first("b1"), V("b1", "small", 2)], M_b1 = ["mad", "smug"];
      const T_b2 = [first("b2"), V("b2", "mum", 2), V("b2", "i'm", 1)], M_b2 = ["smug", "smug", "happy"];
      const T_n2 = [first("n2")], M_n2 = ["wow"];
      const T_b3 = [first("b3"), V("b3", "who", 1), V("b3", "i'll", 1)], M_b3 = ["wow", "mad", "mad"];
      const T_n3 = [first("n3")], M_n3 = ["calm"];
      const T_b4 = [first("b4"), V("b4", "i", 2), V("b4", "you", 1)], M_b4 = ["smug", "smug", "happy"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["happy", "happy"];
      return {
      hook: { set: 'bedroom', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_hook[idx(T_hook, t)]] })], },
      b1: { set: 'bedroom', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_b1[idx(T_b1, t)]], arms: 'cross' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Small human ate my chips.", "Small human must be stopped."][idx(T_b1, t)], pu(t, first("b1"))); }, },
      b2: { set: 'bedroom', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_b2[idx(T_b2, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["I'll tell Mum you broke it.", "Mum believes me.", "I'm the favourite."][idx(T_b2, t)], pu(t, first("b2"))); }, },
      n2: { set: 'bedroom', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n2[idx(T_n2, t)]] })], },
      b3: { set: 'bedroom', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, shake: V('b3', 'fight'), props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_b3[idx(T_b3, t)]], arms: 'cross' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Hey.", "Who did this.", "I'll fight the bike."][idx(T_b3, t)], pu(t, first("b3"))); }, },
      n3: { set: 'bedroom', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n3[idx(T_n3, t)]] })], over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); }, },
      b4: { set: 'bedroom', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_b4[idx(T_b4, t)]], arms: 'shrug' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Don't tell anyone I was nice.", "I have a reputation.", "You still owe me chips."][idx(T_b4, t)], pu(t, first("b4"))); }, },
      cta: { set: 'bedroom', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_cta[idx(T_cta, t)]] })], fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
