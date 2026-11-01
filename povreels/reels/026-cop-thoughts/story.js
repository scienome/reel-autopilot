  const NOONE = { hide: true }; const pu = (t, at) => popU(t, at, 0.3);
  const nightTint = (ctx, W, H_) => { ctx.save(); ctx.fillStyle = 'rgba(12,16,48,0.5)'; ctx.fillRect(0, 0, W, H_); ctx.restore(); };
  const timeCard = (ctx, t, at, txt) => { const u = pu(t, at); if (u <= 0) return; ctx.save(); ctx.translate(360, 640); ctx.scale(u, u); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.roundRect(-260, -54, 520, 108, 20); ctx.fill(); ctx.fillStyle = '#1c1a22'; ctx.font = FONT(900, 46); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 4); ctx.restore(); };
  const FACE = { calm: { mouth: 'flat' }, happy: { mouth: 'smile', eyes: 'happy' }, mad: { mouth: 'frown', brows: 'angry' }, sad: { mouth: 'frown', eyes: 'half' }, wow: { mouth: 'o', eyes: 'wide' }, smug: { mouth: 'smirk', eyes: 'half' }, tired: { mouth: 'flat', eyes: 'half' } };
  const idx = (T, t) => Math.max(0, T.filter((x) => t >= x - 0.1).length - 1);

const SUBJ = (o) => Object.assign({ who: 'cop', x: 0, z: -0.75, yaw: 0, sit: false, arms: 'hold' }, o);
  makeCouch({
    keys: ["friday", "sorry", "home", "wow", "nobody", "best", "day", "year", "drive", "safe", "waiting", "siren", "button", "tell", "argue", "two"],
    shots: ({ V, first }) => {

      const T_hook = [first("hook")], M_hook = ["calm"];
      const T_c1 = [first("c1"), V("c1", "it's", 1)], M_c1 = ["tired", "tired"];
      const T_c2 = [first("c2"), V("c2", "please", 2), V("c2", "i", 1)], M_c2 = ["calm", "sad", "sad"];
      const T_n2 = [first("n2")], M_n2 = ["wow"];
      const T_c3 = [first("c3"), V("c3", "nobody", 1), V("c3", "it's", 1)], M_c3 = ["wow", "happy", "happy"];
      const T_n3 = [first("n3")], M_n3 = ["happy"];
      const T_c4 = [first("c4"), V("c4", "someone", 1), V("c4", "someone", 2)], M_c4 = ["calm", "happy", "sad"];
      const T_n4 = [first("n4")], M_n4 = ["wow"];
      const T_c5 = [first("c5"), V("c5", "wrong", 1), V("c5", "don't", 1)], M_c5 = ["wow", "smug", "smug"];
      const T_cta = [first("cta"), V("cta", "part", 1)], M_cta = ["smug", "smug"];
      return {
      hook: { set: 'street', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0.0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_hook[idx(T_hook, t)]] })], },
      c1: { set: 'street', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_c1[idx(T_c1, t)]], arms: 'shrug' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Do I look like I want to do this?", "It's Friday."][idx(T_c1, t)], pu(t, first("c1"))); }, },
      c2: { set: 'street', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_c2[idx(T_c2, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Please say sorry.", "Please just say sorry.", "I want to go home."][idx(T_c2, t)], pu(t, first("c2"))); }, },
      n2: { set: 'street', cam: [[0, 1.8499999999999999, 2.35], [0, 2.17, -0.75], [0.0, 1.8599999999999999, 2.0500000000000003], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n2[idx(T_n2, t)]] })], },
      c3: { set: 'street', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_c3[idx(T_c3, t)]] })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Wow.", "Nobody says sorry.", "It's my best day this year."][idx(T_c3, t)], pu(t, first("c3"))); }, fx: [{ k: 'sparkle', at: V('c3', 'It\'s'), who: 'cop' }], },
      n3: { set: 'street', cam: [[0, 1.8499999999999999, 2.35], [0, 2.17, -0.75], [0.0, 1.8599999999999999, 2.0500000000000003], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n3[idx(T_n3, t)]] })], },
      c4: { set: 'street', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_c4[idx(T_c4, t)]] })], over: (ctx, W, H_, t, S) => { ctx.save(); ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb070'; ctx.fillRect(0, 0, W, H_); ctx.restore(); thought(ctx, S, [0, 2.0, -0.75], ["Drive safe.", "Someone is waiting for you.", "Someone is always waiting."][idx(T_c4, t)], pu(t, first("c4"))); }, },
      n4: { set: 'street', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0.0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, shake: first("n4"), props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_n4[idx(T_n4, t)]] })], },
      c5: { set: 'street', cam: [[0, 1.8, 1.35], [0, 2.17, -0.75], [0.0, 1.815, 1.05], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_c5[idx(T_c5, t)]], arms: 'cheer' })], over: (ctx, W, H_, t, S) => { thought(ctx, S, [0, 2.0, -0.75], ["Oops.", "Wrong button.", "Don't tell anyone."][idx(T_c5, t)], pu(t, first("c5"))); }, },
      cta: { set: 'street', cam: [[0, 1.8, 1.75], [0, 2.17, -0.75], [0.0, 1.815, 1.45], [0, 2.17, -0.75]], he: NOONE, she: NOONE, props: (S, t) => {  }, extras: (t) => [SUBJ({ face: FACE[M_cta[idx(T_cta, t)]] })], fx: [{ k: 'card', text: 'PART 2?', at: V('cta', 'Part'), y: 1110, fill: '#c0182a', col: '#fff', px: 52 }], },
      };
    },
  });
