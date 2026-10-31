// Riddle reel with a big cast: kisan, sher, bakri, ghaas and one small boat. Hinglish. Times are estimates until a voice exists.
(function () {
  const F = window.FLAT, { P, SET, cam, camAt, person, tag, stat, caption, say, runShots, finish, critter, grassBundle, boat, croc, fish, bubble, parrot, confetti, tree, endCard } = F;
  const clamp = H.clamp, E = H.ease, pop = (u, at, d = 0.3) => clamp((u - at) / d);
  const NEAR = { lion: 145, goat: 335, grass: 500, kisan: 628 }, FAR = { lion: 205, goat: 322, grass: 438, kisan: 548 };
  const TRIPS = ['goat', null, 'lion', 'goat', 'grass', null, 'goat'];
  // who stands where before trip i
  function sides(i) { const s = { lion: 0, goat: 0, grass: 0, kisan: 0 }; for (let n = 0; n < i; n++) { if (TRIPS[n]) s[TRIPS[n]] = 1 - s[TRIPS[n]]; s.kisan = 1 - s.kisan; } return s; }
  const kisan = (c, x, y, s, t, o = {}) => person(c, x, y, s, t, Object.assign({ look_as: 'kisan', mood: 'ok', hat: F.turban }, o));
  const drawItem = (c, id, x, y, s, t, m) => id === 'grass' ? grassBundle(c, x, y, s * 1.05, t) : id === 'kisan' ? kisan(c, x, y, s * 0.78, t, m) : critter(c, id === 'lion' ? 'lion' : 'goat', x, y, s, t, Object.assign({ seed: id === 'lion' ? 1 : 2 }, m));

  function world(c, t, o = {}) {
    SET.river(c, t);
    const sd = o.sides || { lion: 0, goat: 0, grass: 0, kisan: 0 }, m = o.moods || {}, skip = o.skip || [];
    for (const id of ['lion', 'goat', 'grass', 'kisan']) if (sd[id] === 1 && !skip.includes(id)) drawItem(c, id, FAR[id], 480, 0.38, t, m[id] || { noShadow: false });
    croc(c, 150 + Math.sin(t * 0.3) * 54, 690, 0.72, t); const jump = (t * 0.55) % 1; if (jump < 0.32) fish(c, 560 + jump * 170, 830 - Math.sin((jump / 0.32) * Math.PI) * 92, 0.85, -0.7 + (jump / 0.32) * 1.4);
    const p = o.boatP == null ? 0 : o.boatP, by = H.lerp(922, 522, p), bs = H.lerp(0.86, 0.42, p), bx = 360 + Math.sin(p * Math.PI) * 34;
    boat(c, bx, by, bs, t, (q) => { if (skip.includes('kisan')) kisan(q, 112, 0, 0.52, t, { noShadow: true, pose: 'hold', mood: o.kMood || 'ok' }); if (o.cargo) { if (o.cargo === 'grass') grassBundle(q, -82, -12, 0.9, t); else critter(q, o.cargo, -82, 2, 0.62, t, { noShadow: true, mood: 'ok', seed: 3 }); } });
    for (const id of ['grass', 'goat', 'lion', 'kisan']) if (sd[id] === 0 && !skip.includes(id)) { const q = o.pop && o.pop[id] != null ? E.back(clamp(o.pop[id])) : 1; if (q > 0) drawItem(c, id, NEAR[id], 1040, 0.82 * q, t, m[id] || {}); }
    tree(c, 720, 1000, 0.92, t, '#17855f', 4); critter(c, 'monkey', 642, 760, 0.42, t, { noShadow: true, mood: o.monkey || 'sly', look: [-1, 0.5], arms: o.monkey === 'happy' ? 'up' : null }); parrot(c, 42, 880, 0.82, t, 2);
  }
  const hook = (c, u, t) => {
    const [x, y, z] = camAt([[0, 360, 690, 1], [6.5, 360, 700, 1.05]], u);
    cam(c, x, y, z, () => world(c, t, { pop: { kisan: u / 0.35, lion: (u - 1.6) / 0.35, goat: (u - 2.5) / 0.35, grass: (u - 3.4) / 0.35 } }));
    caption(c, say('Ek kisan. Ek *sher.* Ek *bakri.* Aur *ghaas.*', 0.1, 3.8), u, { y: 150, size: 48 });
    tag(c, 145, 1190, 'Sher', P.orange, pop(u, 1.7)); tag(c, 335, 1190, 'Bakri', P.teal, pop(u, 2.6)); tag(c, 500, 1190, 'Ghaas', P.violet, pop(u, 3.5));
    caption(c, say('Sabko *nadi paar* karni hai.', 4.4, 5.8), u, { y: 280, size: 42, hot: P.yellow });
  };
  const boatRule = (c, u, t) => {
    const [x, y, z] = camAt([[0, 360, 820, 1.2], [4, 360, 860, 1.42]], u);
    cam(c, x, y, z, () => world(c, t, { skip: ['kisan'], boatP: 0, cargo: u > 1.4 ? 'goat' : null, moods: { lion: { mood: 'think', look: [0.8, -0.7] }, goat: {} } }));
    if (u > 1.4) tag(c, 240, 540, 'Sirf 1 saathi', P.pink, pop(u, 1.5), { size: 40 });
    caption(c, say('Boat chhoti hai. Kisan aur *sirf ek.*', 0.2, 2.4), u, { y: 170, size: 48 });
  };
  const rule1 = (c, u, t) => {
    const [x, y, z] = camAt([[0, 240, 890, 1.55], [5, 240, 900, 1.72]], u);
    cam(c, x, y, z, () => world(c, t, { skip: ['kisan'], moods: { lion: { mood: 'hungry', look: [1, 0.2] }, goat: { mood: 'scared', look: [-1, 0] } } }));
    bubble(c, 170, 470, 'Kisan gaya...|ab mazaa aayega!', 170, 560, pop(u, 1), { size: 30 });
    caption(c, say('Sher ke saath *bakri* chhodi? Gayi!', 0.2, 2.2), u, { y: 170, size: 46, hot: P.rose });
  };
  const rule2 = (c, u, t) => {
    const [x, y, z] = camAt([[0, 420, 900, 1.7], [4.5, 420, 910, 1.84]], u);
    cam(c, x, y, z, () => world(c, t, { skip: ['kisan', 'lion'], moods: { goat: { mood: 'hungry', look: [1, 0.6], flip: false } } }));
    bubble(c, 300, 500, 'Yum yum!', 305, 575, pop(u, 0.8), { size: 36 });
    caption(c, say('Bakri ke saath *ghaas* chhodi? Khatam!', 0.2, 2.2), u, { y: 170, size: 46, hot: P.mint });
  };
  const question = (c, u, t) => {
    const [x, y, z] = camAt([[0, 360, 700, 1.02], [4, 360, 680, 0.99]], u);
    cam(c, x, y, z, () => world(c, t, { moods: { kisan: { mood: 'shock', pose: 'head' }, lion: { mood: 'sly' }, goat: { mood: 'scared' } }, monkey: 'sly' }));
    caption(c, say('Teeno ko *safe* paar kaise le jaoge?', 0.2, 2.5), u, { y: 170, size: 50, hot: P.yellow });
  };
  const think = (c, u, t) => {
    cam(c, 360, 700, 1, () => world(c, t, { moods: { kisan: { mood: 'ok', pose: 'chin', look: [1, -0.5] }, lion: { mood: 'think', look: [1, -0.6] }, goat: { mood: 'think', look: [-1, -0.6] } }, monkey: 'think' }));
    c.fillStyle = 'rgba(22,13,63,.42)'; c.fillRect(0, 0, 720, 1280);
    caption(c, say('*Socho...*', 0.1, 0.3), u, { y: 170, size: 92, hot: P.yellow }); stat(c, 360, 350, String(Math.max(1, 5 - Math.floor(u))), 'sec', 1, { size: 112 }); tag(c, 360, 1160, 'Pause karo, comment karo', P.pink, pop(u, 0.4), { size: 34 });
  };
  const LINES = [['Pehle *bakri* le jao.', 1], ['Khaali wapas aao.', 2], ['Ab *sher* le jao.', 3], ['TWIST! *Bakri* wapas lao!', 4], ['Bakri chhodo, *ghaas* le jao.', 5], ['Khaali wapas aao.', 6], ['Aakhir mein *bakri.* Done!', 7]];
  const solution = (c, u, t) => {
    const T = 3.1, i = Math.min(6, Math.floor(u / T)), v = u - i * T, sd = sides(i), id = TRIPS[i], going = sd.kisan === 0, q = E.inOut(clamp((v - 0.45) / 2.1)), p = going ? q : 1 - q, s2 = Object.assign({}, sd), after = v > 2.55;
    if (id) s2[id] = 1 - sd[id];
    const danger = i === 3 && v < 1.0;
    const skip = ['kisan']; if (id && !after) skip.push(id);
    cam(c, 360, 690, 1, () => world(c, t, { sides: after ? Object.assign(s2, { kisan: 1 - sd.kisan }) : sd, skip, boatP: p, cargo: after ? null : id, moods: { goat: { mood: 'ok' }, lion: { mood: i >= 2 ? 'think' : 'ok' } }, monkey: i === 3 ? 'happy' : 'sly' }));
    stat(c, 110, 300, `${i + 1}/7`, '', pop(v, 0, 0.2), { size: 44, bg: P.pink });
    caption(c, say(LINES[i][0], 0.08, 0.9), v, { y: 170, size: i === 3 ? 50 : 52, hot: i === 3 ? P.yellow : P.rose });
    if (i === 3 && !danger) tag(c, 360, 1160, 'Yahi hai asli trick', P.pink, pop(v, 1.2), { size: 36 });
  };
  const win = (c, u, t) => {
    const all = { lion: 1, goat: 1, grass: 1, kisan: 1 };
    const [x, y, z] = camAt([[0, 360, 640, 1], [1.8, 360, 470, 2.05]], u);
    cam(c, x, y, z, () => world(c, t, { sides: all, boatP: 1, moods: { lion: { mood: 'happy', hop: true, seed: 1 }, goat: { mood: 'happy', hop: true, seed: 2 }, kisan: { mood: 'happy', pose: 'cheer' } } }));
    confetti(c, t, u); caption(c, say('Sab *safe!* Kisi ne kisi ko nahi khaya!', 0.2, 2.2), u, { y: 170, size: 46, hot: P.yellow });
  };
  const close = (c, u, t) => endCard(c, t, u, 'Socha tha?', 'kitne try lage? comment karo', () => { critter(c, 'lion', 245, 960, 0.9, t, { mood: 'happy' }); critter(c, 'goat', 475, 960, 0.9, t, { mood: 'happy', seed: 2 }); });

  const shots = [
    { t0: 0, t1: 6.5, draw: hook, in: 'cut' }, { t0: 6.5, t1: 10.5, draw: boatRule, in: 'zoom' }, { t0: 10.5, t1: 15.5, draw: rule1, in: 'wipe' }, { t0: 15.5, t1: 20, draw: rule2, in: 'zoom' }, { t0: 20, t1: 24, draw: question, in: 'zoom' }, { t0: 24, t1: 29, draw: think, in: 'cut' },
    { t0: 29, t1: 50.7, draw: solution, in: 'flash' }, { t0: 50.7, t1: 55, draw: win, in: 'zoom' }, { t0: 55, t1: 58, draw: close, in: 'zoom' },
  ];
  window.LESSON = { BEATS: shots, DURATION: 58, explainer: (c, W, H_, t) => { runShots(c, shots, t); finish(c); } };
  window.scoreSound = function (k) {
    shots.slice(1).forEach((s) => { if (s.in !== 'cut') k.play(s.in === 'flash' ? 'shutter' : 'whoosh', s.t0, s.in === 'flash' ? {} : { dur: 0.4 }); });
    [0.1, 1.6, 2.5, 3.4, 8, 11.5, 16.3].forEach((x) => k.play('pop', x, { minor: true }));
    for (let i = 0; i < 5; i++) k.play('tock', 24 + i, {});
    for (let i = 0; i < 7; i++) { k.play('swish', 29 + i * 3.1 + 0.45, { dur: 0.5, gain: 0.4, minor: true }); k.play('pop', 29 + i * 3.1 + 2.55, { minor: true }); }
    k.play('impact', 38.3); k.play('ding', 38.5); k.play('success', 50.9); k.play('sparkle', 51.4); k.play('sparkle', 55.4);
  };
})();
var scoreSound = window.scoreSound, LESSON = window.LESSON;
