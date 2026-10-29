  // ==================== The higher powers: Zeus has to subscribe to lightning ====================
  // an app-style overlay card in the lower band: title line + big line (+ progress bar for the ad countdown)
  const appCard = (ctx, W, H_, a, top, big, col = '#ffffff', bar) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(16,18,30,0.82)'; ctx.beginPath(); ctx.roundRect(W * 0.1, H_ * 0.71, W * 0.8, H_ * 0.13, 22); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.font = FONT(700, 24); ctx.textAlign = 'center'; ctx.fillText(top, W / 2, H_ * 0.745); ctx.fillStyle = col; let px = 50; ctx.font = FONT(800, px); while (ctx.measureText(big).width > W * 0.72 && px > 26) ctx.font = FONT(800, (px -= 2)); ctx.fillText(big, W / 2, H_ * 0.8);
    if (bar != null) { ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fillRect(W * 0.16, H_ * 0.818, W * 0.68, 8); ctx.fillStyle = '#ffd23f'; ctx.fillRect(W * 0.16, H_ * 0.818, W * 0.68 * bar, 8); } ctx.restore(); };
  const spinner = (ctx, x, y, t) => { ctx.save(); ctx.lineWidth = 12; ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(x, y, 40, 0, TAU); ctx.stroke(); ctx.strokeStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(x, y, 40, t * 6, t * 6 + 1.6); ctx.stroke(); ctx.restore(); };
  makeComedy({
    badge: 'THE HIGHER POWERS', badgeCol: '#4a2a7a',
    captions: { say: {}, keys: { zeus: 'y', subscription: 'o', lightning: 'y', free: 'g', bolt: 'y', ads: 'r', strike: 'y', thirty: 'r', 'mid-battle': 'r', servers: 'r', buffers: 'r', pro: 'o', nine: 'y', thunder: 'o', extra: 'r', declined: 'r', hades: 'r', family: 'g' } },
    beats: ({ V }) => {
      const zeus = (ex) => ['zeus', 0.55, 0.1, -0.3, (t, u) => (typeof ex === 'function' ? ex(t, u) : ex)];
      return {
        hook: { set: 'heaven', cam: 'mid', shake: V('hook', 'lightning'), flash: [V('hook', 'lightning')], cast: [zeus((t) => ({ arms: [0.15, t > V('hook', 'pay') ? 2.4 : 0.6], mouth: t > V('hook', 'monthly') ? 'open' : 'grin' }))],
          over: (ctx, W, H_, t) => appCard(ctx, W, H_, ramp(t, V('hook', 'subscription') - 0.1, 0.25), 'LIGHTNING+', 'SUBSCRIBE TO STRIKE', '#ffd23f') },
        free: { set: 'heaven', cam: 'mid', cast: [zeus({ arms: [0.15, 0.6], mouth: 'flat', brows: 'angry' })],
          over: (ctx, W, H_, t) => appCard(ctx, W, H_, 1, 'FREE PLAN', '1 BOLT / WEEK', '#7ee07a'), tags: [[0.55, 2.45, -0.4, 'WITH ADS', V('free', 'ads'), 'red']] },
        ad: { set: 'heaven', cam: 'wide', at: 0.3, cast: [zeus({ arms: [0.6, 0.6], mouth: 'frown', brows: 'angry' }), ['devil', -0.9, 0.3, 0.4, (t) => ({ arms: [2.3, 0.3], mouth: 'grin', bob: Math.abs(Math.sin(t * 8)) * 0.06 })]],
          over: (ctx, W, H_, t) => { const t0 = V('ad', 'watch'), k = H.clamp((t - t0) / 3); appCard(ctx, W, H_, ramp(t, t0 - 0.15, 0.2), 'AD · STRIKE IN', `0:${String(30 - Math.floor(k * 3)).padStart(2, '0')}`, '#ffffff', k * 0.1); },
          tags: [[-0.9, 2.45, -0.4, 'MID-BATTLE', V('ad', 'Mid-battle'), 'red']] },
        outage: { set: 'heaven', cam: 'mid', cast: [zeus((t) => ({ arms: [0.15, t > V('outage', 'throws') ? 2.4 : 0.6], mouth: t > V('outage', 'buffers') ? 'o' : 'flat', eyes: t > V('outage', 'buffers') ? 'wide' : undefined }))],
          over: (ctx, W, H_, t) => { if (t > V('outage', 'buffers') - 0.1) spinner(ctx, W * 0.72, H_ * 0.33, t); appCard(ctx, W, H_, ramp(t, V('outage', 'servers') - 0.1, 0.2), 'LIGHTNING+', 'SERVERS DOWN', '#ff6a5a'); } },
        upgrade: { set: 'heaven', cam: 'mid', cast: [zeus({ arms: [0.15, 0.6], hold: 'phone', mouth: 'o', eyes: 'wide' })],
          over: (ctx, W, H_, t) => appCard(ctx, W, H_, ramp(t, V('upgrade', 'Pro') - 0.1, 0.2), 'LIGHTNING PRO', t > V('upgrade', 'Thunder') - 0.05 ? '+ THUNDER $4.99' : '$9.99 / MONTH', t > V('upgrade', 'Thunder') - 0.05 ? '#ff6a5a' : '#ffd23f') },
        twist: { set: 'hell', cam: 'mid', cast: [['devil', 0.55, 0.1, -0.3, { hold: 'phone', arms: [0.15, 1.7], mouth: 'evil' }]], flash: [V('twist', 'Hades')],
          over: (ctx, W, H_, t) => t < V('twist', 'Hades') - 0.1 ? appCard(ctx, W, H_, 1, 'PAYMENT', 'CARD DECLINED', '#ff4a4a') : appCard(ctx, W, H_, 1, 'HADES', 'FAMILY PLAN ✓', '#7ee07a') },
        cta: { set: 'heaven', cam: 'mid', cast: [zeus({ arms: [1.2, 1.2], mouth: 'frown' })], tags: [[0.55, 2.45, -0.4, 'PAY FOR THUNDER?', V('cta', 'thunder'), 'yellow', 1.2]] },
      };
    },
  });
