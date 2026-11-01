  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

const SUBJ = (o) => Object.assign({ who: 'dad', x: 0, z: -0.75, yaw: 0, sit: false, arms: 'hold' }, o);
  makeCouch({
    keys: ["fine", "tired", "directions", "wrong", "forty", "minutes", "scenic", "job", "proud", "jacket", "cry", "hugs", "tyres", "love", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_d1 = [first("d1"), V("d1", "i'm", 2), V("d1", "i", 1)], M_d1 = ["calm", "tired", "mad"];
      const T_d2 = [first("d2"), V("d2", "it's", 1), V("d2", "i'm", 1)], M_d2 = ["mad", "mad", "smug"];
      const T_n2 = [first("n2")], M_n2 = ["calm"];
      const T_d3 = [first("d3"), V("d3", "be", 1), V("d3", "wear", 1), V("d3", "i", 1)], M_d3 = ["calm", "calm", "calm", "happy"];
      const T_n3 = [first("n3")], M_n3 = ["calm"];
      const T_d4 = [first("d4"), V("d4", "don't", 2), V("d4", "dads", 1)], M_d4 = ["sad", "sad", "sad"];
      const T_n4 = [first("n4")], M_n4 = ["happy"];
      const T_d5 = [first("d5"), V("d5", "let's", 1)], M_d5 = ["calm", "smug"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["happy", "happy"];
      return {
      hook: { set: 'kitchen', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0.0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_hook[idx(T_hook, t)]] })], },
      d1: { set: 'kitchen', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_d1[idx(T_d1, t)]], arms: 'shrug' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["I'm fine.", "I'm not tired.", "I don't need directions."][idx(T_d1, t)], pu(t, first("d1"))); }, },
      d2: { set: 'street', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0.0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_d2[idx(T_d2, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["The sat nav is wrong.", "It's been wrong for forty minutes.", "I'm going the scenic way."][idx(T_d2, t)], pu(t, first("d2"))); }, },
      n2: { set: 'kitchen', cam: [[0, 1.8499999999999999, 2.35], [0, 2.17, -0.75], [0.0, 1.8599999999999999, 2.0500000000000003], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n2[idx(T_n2, t)]] })], },
      d3: { set: 'kitchen', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_d3[idx(T_d3, t)]] })], over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0, 2.0, -0.75], ["Great.", "Be careful.", "Wear a jacket.", "I am so proud I could cry."][idx(T_d3, t)], pu(t, first("d3"))); }, },
      n3: { set: 'kitchen', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0.0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n3[idx(T_n3, t)]] })], },
      d4: { set: 'kitchen', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_d4[idx(T_d4, t)]] })], over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0, 2.0, -0.75], ["Don't cry.", "Don't cry.", "Dads don't cry."][idx(T_d4, t)], pu(t, first("d4"))); }, },
      n4: { set: 'kitchen', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0.0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n4[idx(T_n4, t)]] })], fx: [{ k: 'hearts', at: V('n4', 'hugs'), n: 3, y: 560 }], },
      d5: { set: 'kitchen', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_d5[idx(T_d5, t)]], arms: 'shrug' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["That's enough.", "Let's go check the tyres."][idx(T_d5, t)], pu(t, first("d5"))); }, },
      cta: { set: 'kitchen', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0.0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_cta[idx(T_cta, t)]] })], fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
