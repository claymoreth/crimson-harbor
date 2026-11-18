// Crimson Harbor — all screens: HUD, main menu, city map, controls, settings,
// pause, game over, victory. Layout mirrors the reference structure (panels in the
// same places) with this game's own names, city and characters.
import { CHARACTERS, MISSIONS, RADIOS, WEAPONS, POLICE_DEPT, STORY_HOOK, LEGEND, POIS, districtAt, MARA } from './data.js';
import { panel, text, star, rr, drawPortrait, fmtMoney, fmtTime, clamp, dist } from './util.js';
import { drawMinimap } from './world.js';
import { respectLevelName } from './save.js';

const W = 1280, H = 720;
let hoverBtn = null;

function btn(ctx, x, y, w, h, label, sub, active, hovered) {
  const isHot = active || hovered;
  ctx.save();
  if (isHot) {
    ctx.fillStyle = 'rgba(255,210,75,0.95)';
    rr(ctx, x - 6, y - 6, w + 12, h + 12, 8); ctx.fill();
    ctx.fillStyle = '#14101c';
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
  }
  ctx.font = '900 30px Arial'; ctx.textAlign = 'left';
  ctx.fillText(label, x + 14, y + h / 2 + 10);
  if (sub) {
    ctx.font = '700 13px Arial';
    ctx.fillStyle = isHot ? '#5a4a1a' : '#7ddb8a';
    ctx.fillText(sub, x + 16, y + h + 16);
  }
  ctx.restore();
  return hovered;
}
export function menuButtonHit(mx, my, x, y, w, h) {
  return mx >= x - 6 && mx <= x + w + 6 && my >= y - 6 && my <= y + h + 6;
}

// ---- sunset city backdrop (menu) ----------------------------------------------
export function drawMenuScene(ctx, t, game) {
  // sky
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#2a1f4a'); sky.addColorStop(0.45, '#c95a6a'); sky.addColorStop(0.72, '#ff9a4b'); sky.addColorStop(1, '#ffd24b');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);
  // sun
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath(); ctx.arc(330, 300, 95, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,220,120,0.35)';
  ctx.beginPath(); ctx.arc(330, 300, 130, 0, Math.PI * 2); ctx.fill();
  // skyline
  const rnd = (i) => ((i * 2654435761) % 1000) / 1000;
  ctx.fillStyle = '#3a2a55';
  for (let i = 0; i < 14; i++) {
    const bw = 60 + rnd(i) * 70, bh = 120 + rnd(i + 30) * 240, bx = 60 + i * 90;
    ctx.fillRect(bx, 470 - bh, bw, bh);
    ctx.fillStyle = 'rgba(255,210,110,0.75)';
    for (let wy = 0; wy < 6; wy++) for (let wx = 0; wx < 3; wx++) {
      if (rnd(i * 7 + wy * 3 + wx) > 0.5) ctx.fillRect(bx + 10 + wx * 22, 480 - bh + 14 + wy * 30, 10, 12);
    }
    ctx.fillStyle = '#3a2a55';
  }
  // sea + beach
  ctx.fillStyle = '#2a6a8c'; ctx.fillRect(0, 560, W, 60);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  for (let i = 0; i < 10; i++) ctx.fillRect(40 + i * 130, 575 + Math.sin(t * 0.8 + i) * 4, 70, 3);
  ctx.fillStyle = '#d8c08a'; ctx.fillRect(0, 620, W, 100);
  // road
  ctx.fillStyle = '#2e3240'; ctx.fillRect(0, 640, W, 80);
  ctx.strokeStyle = '#ffd24b'; ctx.lineWidth = 4; ctx.setLineDash([26, 22]);
  ctx.beginPath(); ctx.moveTo(0, 680); ctx.lineTo(W, 680); ctx.stroke();
  ctx.setLineDash([]);
  // palms
  for (let i = 0; i < 8; i++) {
    const px = 60 + i * 170, py = 620;
    ctx.strokeStyle = '#4a2a18'; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 8, py - 90); ctx.stroke();
    ctx.fillStyle = '#1f5a2a';
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2 + 0.5;
      ctx.beginPath(); ctx.ellipse(px + 8 + Math.cos(a) * 34, py - 90 + Math.sin(a) * 16, 34, 9, a, 0, Math.PI * 2); ctx.fill();
    }
  }
  // car + character on the road (above the bottom bar)
  ctx.save();
  ctx.translate(560, 640); ctx.rotate(0.02);
  ctx.fillStyle = '#e84b6a'; ctx.fillRect(-58, -16, 116, 30);
  ctx.fillStyle = '#1c2433'; ctx.fillRect(-16, -12, 44, 22);
  ctx.fillStyle = '#d8e8f0'; ctx.fillRect(2, -12, 6, 22);
  ctx.fillStyle = '#111'; ctx.fillRect(-40, -20, 20, 7); ctx.fillRect(-40, 10, 20, 7); ctx.fillRect(28, -20, 20, 7); ctx.fillRect(28, 10, 20, 7);
  ctx.fillStyle = '#ffe9a8'; ctx.fillRect(56, -12, 4, 7); ctx.fillRect(56, 5, 4, 7);
  ctx.restore();
  // character (Leo)
  const c = CHARACTERS[game.save.charIndex || 0];
  ctx.save(); ctx.translate(700, 632);
  ctx.fillStyle = '#1c1c22'; ctx.fillRect(-13, -8, 26, 44);
  ctx.fillStyle = c.shirt; ctx.fillRect(-13, -8, 26, 26);
  ctx.fillStyle = '#e8b98a'; ctx.beginPath(); ctx.arc(0, -20, 11, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = c.hair; ctx.beginPath(); ctx.ellipse(0, -26, 11, 6, 0, Math.PI, 0); ctx.fill();
  ctx.restore();
}

// ---- main menu ------------------------------------------------------------------
export function drawMenu(ctx, game, mouse) {
  const t = game.time;
  drawMenuScene(ctx, t, game);
  ctx.fillStyle = 'rgba(10,8,20,0.30)'; ctx.fillRect(0, 0, W, H);
  // title
  const grad = ctx.createLinearGradient(120, 90, 120, 210);
  grad.addColorStop(0, '#ffe9a8'); grad.addColorStop(0.5, '#ff7a4b'); grad.addColorStop(1, '#e84b6a');
  ctx.font = '900 84px Arial'; ctx.textAlign = 'left';
  ctx.fillStyle = grad;
  ctx.fillText('CRIMSON', 110, 168);
  ctx.fillStyle = '#4be8ff';
  ctx.fillText('HARBOR', 110, 240);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '700 15px Arial';
  ctx.fillText('PORT VALEN  •  AN OPEN-WORLD CRIME GAME', 114, 268);
  // menu buttons
  const items = [
    { id: 'continue', label: 'CONTINUE', sub: game.save.hasSave ? 'Ch.' + game.save.chapter + ' ' + (MISSIONS[game.save.chapter - 1]?.title || '') + '  ·  ' + fmtMoney(game.save.cash) + '  ·  Day ' + game.save.day + ', ' + fmtTime(game.save.hour) : null, enabled: game.save.hasSave },
    { id: 'new', label: 'NEW GAME', sub: null, enabled: true },
    { id: 'controls', label: 'CONTROLS', sub: null, enabled: true },
    { id: 'settings', label: 'SETTINGS', sub: null, enabled: true },
  ];
  game.menuItems = [];
  items.forEach((it, i) => {
    const y = 320 + i * 62;
    const hovered = menuButtonHit(mouse.x, mouse.y, 110, y, 330, 44);
    if (!it.enabled) {
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.font = '900 30px Arial'; ctx.fillText(it.label, 124, y + 34);
      game.menuItems.push({ id: it.id, x: 110, y, w: 330, h: 44, enabled: false });
      return;
    }
    btn(ctx, 110, y, 330, 44, it.label, it.sub, game.menuSel === i, hovered);
    game.menuItems.push({ id: it.id, x: 110, y, w: 330, h: 44, enabled: true });
  });
  // HOW TO PLAY panel (right)
  panel(ctx, 880, 60, 340, 330);
  text(ctx, 'HOW TO PLAY', 900, 92, 17, '#4be8ff', 900);
  const rows = [
    ['WASD', 'Walk / drive'], ['Mouse', 'Aim · Click to shoot'], ['Shift', 'Sprint'],
    ['Space', 'Handbrake drift'], ['F', 'Enter / steal a vehicle'], ['E', 'Interact · next station'],
    ['Q', 'Previous radio station'], ['R', 'Reload · fists, weapons'], ['M  Esc', 'City map · pause'],
  ];
  rows.forEach((r, i) => {
    const y = 122 + i * 26;
    ctx.fillStyle = 'rgba(255,210,75,0.16)';
    rr(ctx, 900, y - 15, 62, 20, 5); ctx.fill();
    text(ctx, r[0], 906, y, 12, '#ffd24b', 800);
    text(ctx, r[1], 972, y, 13, '#fff', 600);
  });
  // character roster (bottom-right)
  text(ctx, 'CHOOSE YOUR DRIVER', 880, 420, 13, 'rgba(255,255,255,0.75)', 800);
  game.charSlots = [];
  CHARACTERS.forEach((c, i) => {
    const x = 880 + i * 58, y = 432;
    const sel = game.charSel === i;
    if (sel) { ctx.fillStyle = '#ffd24b'; rr(ctx, x - 3, y - 3, 56, 56, 8); ctx.fill(); }
    drawPortrait(ctx, x, y, 50, c);
    game.charSlots.push({ x, y, w: 50, h: 50, i });
  });
  ctx.font = '700 12px Arial'; ctx.textAlign = 'left';
  ctx.fillStyle = '#fff';
  ctx.fillText(CHARACTERS[game.charSel].name + '  ·  ' + CHARACTERS[game.charSel].role, 880, 510);
  text(ctx, CHARACTERS[game.charSel].blurb, 880, 528, 12, 'rgba(255,255,255,0.7)', 600);
  // story hook (wrapped, bottom-left) + hint (bottom-right)
  ctx.fillStyle = 'rgba(8,8,16,0.55)'; ctx.fillRect(0, 664, W, 56);
  wrapText(ctx, STORY_HOOK, 110, 686, 740, 13, '#fff', 2);
  text(ctx, 'Enter to select  ·  arrows to move', 1240, 700, 13, 'rgba(255,255,255,0.7)', 600, 'right');
}

// ---- HUD -------------------------------------------------------------------------
export function drawHUD(ctx, game) {
  const p = game.player;
  const m = game.missions.current;
  // mission panel (top-left)
  panel(ctx, 16, 14, 372, 138);
  if (m) {
    ctx.fillStyle = '#ffd24b'; rr(ctx, 30, 26, 52, 22, 6); ctx.fill();
    text(ctx, 'CH ' + m.ch, 38, 42, 13, '#14101c', 900, 'left');
    text(ctx, m.title, 92, 42, 16, '#ffd24b', 900);
    if (game.stageTimer > 0) text(ctx, '◷ ' + Math.ceil(game.stageTimer) + 's', 356, 42, 15, '#fff', 800, 'right');
    const s = game.missions.stage;
    wrapText(ctx, s.text, 30, 70, 344, 17, '#fff', 2);
    const hint = game.missions.stage && game.missions.stage.type === 'shoot' ? (game.missions.kills + ' / ' + game.missions.killsNeed + ' down') : (s.type === 'escape' && game.wanted > 0 ? 'They can see you — break line of sight' : '');
    if (hint) text(ctx, hint, 30, 108, 13, s.type === 'escape' ? '#4be8ff' : '#7ddb8a', 700);
    text(ctx, 'STAGE ' + game.missions.stageNum + '/' + game.missions.stageTotal, 30, 128, 12, '#ffd24b', 800);
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; rr(ctx, 118, 118, 150, 8, 4); ctx.fill();
    ctx.fillStyle = '#ffd24b'; rr(ctx, 118, 118, 150 * (game.missions.stageNum / game.missions.stageTotal), 8, 4); ctx.fill();
    text(ctx, 'NEXT   ' + (s.next || '—'), 30, 146, 12, 'rgba(255,255,255,0.75)', 700);
  } else {
    text(ctx, 'FREE ROAM', 30, 42, 16, '#ffd24b', 900);
    wrapText(ctx, 'No active job. Visit Mara in Harbor View (M for map) to take the next job.', 30, 70, 344, 15, '#fff', 2);
    text(ctx, 'NEXT   Take a job from Mara', 30, 146, 12, 'rgba(255,255,255,0.75)', 700);
  }
  // police panel (below mission panel)
  if (game.wanted > 0 && game.police.length) {
    const rows = game.police.slice(0, 5);
    const ph = 34 + rows.length * 24 + 24;
    panel(ctx, 16, 162, 372, ph);
    text(ctx, '●  ' + POLICE_DEPT, 30, 186, 13, '#fff', 900);
    text(ctx, game.police.length + ' UNITS  ·  CODE ' + game.wanted, 374, 186, 12, 'rgba(255,255,255,0.7)', 700, 'right');
    rows.forEach((u, i) => {
      const y = 210 + i * 24;
      text(ctx, '▸', 30, y, 12, '#4ba8ff', 800);
      text(ctx, u.name, 46, y, 13, '#fff', 700);
      text(ctx, Math.round(u.dist || 0) + ' m', 250, y, 13, 'rgba(255,255,255,0.8)', 700);
      const pill = u.mode === 'RAMMING' ? '#ff2a2a' : u.mode === 'PURSUIT' ? '#ff7a2a' : '#ffd24b';
      ctx.fillStyle = pill; rr(ctx, 300, y - 15, 76, 18, 9); ctx.fill();
      text(ctx, u.mode, 338, y - 1, 10, '#14101c', 900, 'center');
    });
    text(ctx, game.police.length > 5 ? 'more units in the search zone' : 'all units in the search zone', 30, 162 + ph - 8, 11, 'rgba(255,255,255,0.55)', 600);
  }
  // top-right: day/time, cash, wanted stars, sight badge
  text(ctx, 'DAY ' + game.day, 1150, 34, 14, 'rgba(255,255,255,0.85)', 800, 'right');
  text(ctx, fmtTime(game.hour), 1264, 34, 16, '#fff', 900, 'right');
  text(ctx, fmtMoney(game.cash), 1264, 66, 30, '#7ddb8a', 900, 'right');
  for (let i = 0; i < 5; i++) star(ctx, 1150 + i * 26, 92, 11, i < game.wanted, '#ffd24b');
  if (game.wanted > 0) {
    text(ctx, 'search zone follows you', 1080, 92, 11, 'rgba(255,255,255,0.6)', 600, 'right');
    const seen = game.inSight;
    ctx.fillStyle = seen ? '#ff2a2a' : '#2a7d4b';
    rr(ctx, 1180, 104, 84, 20, 10); ctx.fill();
    text(ctx, seen ? 'IN SIGHT' : 'HIDDEN ' + Math.ceil(game.hiddenT) + 's', 1222, 118, 11, '#fff', 900, 'center');
  }
  // weapon slots (top-right, below stars)
  const owned = game.save.weapons;
  WEAPONS.forEach((w, i) => {
    const x = 1010 + i * 54, y = 132;
    const active = p.weapon === i;
    ctx.fillStyle = active ? 'rgba(255,210,75,0.9)' : 'rgba(12,14,24,0.8)';
    rr(ctx, x, y, 48, 48, 8); ctx.fill();
    ctx.strokeStyle = active ? '#ffd24b' : 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
    rr(ctx, x, y, 48, 48, 8); ctx.stroke();
    text(ctx, String(i), x + 5, y + 13, 10, active ? '#14101c' : 'rgba(255,255,255,0.6)', 800);
    if (!owned[i]) {
      text(ctx, 'LOCKED', x + 24, y + 30, 8, 'rgba(255,255,255,0.55)', 800, 'center');
    } else {
      drawWeaponIcon(ctx, w.icon, x + 24, y + 24, active ? '#14101c' : '#fff');
      if (w.ammo !== Infinity) text(ctx, (p.ammo[i] ?? 0) + '/' + (p.reserve[i] ?? 0), x + 24, y + 44, 9, active ? '#14101c' : '#fff', 800, 'center');
      else text(ctx, '∞', x + 24, y + 44, 10, active ? '#14101c' : '#fff', 800, 'center');
    }
  });
  text(ctx, WEAPONS[p.weapon].name, 1264, 192, 11, 'rgba(255,255,255,0.85)', 800, 'right');
  // minimap (bottom-left)
  drawMinimap(ctx, 104, 600, 78, game, { label: districtAt(p.x, p.y).name });
  // respect bar
  panel(ctx, 16, 686, 180, 22, 'rgba(12,14,24,0.85)');
  text(ctx, '+', 24, 702, 13, '#7ddb8a', 900);
  ctx.fillStyle = 'rgba(255,255,255,0.2)'; rr(ctx, 40, 693, 100, 8, 4); ctx.fill();
  ctx.fillStyle = '#7ddb8a'; rr(ctx, 40, 693, 100 * clamp(game.respect % 300 / 300, 0, 1), 8, 4); ctx.fill();
  text(ctx, 'RESPECT  ' + respectLevelName(game.respectLevel) + '  ' + (game.respect % 300) + ' / 300', 146, 702, 11, '#fff', 800);
  // radio + car panel (bottom-right)
  const radio = RADIOS[game.radio];
  panel(ctx, 1010, 520, 254, 52);
  text(ctx, '♪  ' + radio.name + '  ·  ' + radio.show, 1022, 540, 12, '#ff7ad8', 800);
  text(ctx, radio.song, 1022, 560, 12, '#fff', 700);
  const eq = [6, 14, 9, 16, 8];
  eq.forEach((h, i) => { ctx.fillStyle = '#ff7ad8'; ctx.fillRect(1228 + i * 5, 556 - h, 3, h); });
  if (p.inCar && p.car) {
    panel(ctx, 1010, 580, 254, 104);
    text(ctx, p.car.def.name, 1022, 600, 13, '#fff', 900);
    text(ctx, 'CONDITION', 1022, 618, 10, 'rgba(255,255,255,0.6)', 700);
    ctx.fillStyle = 'rgba(255,255,255,0.2)'; rr(ctx, 1090, 610, 100, 8, 4); ctx.fill();
    ctx.fillStyle = p.car.cond > 50 ? '#7ddb8a' : p.car.cond > 25 ? '#ffd24b' : '#ff5a4b';
    rr(ctx, 1090, 610, 100 * (p.car.cond / 100), 8, 4); ctx.fill();
    text(ctx, Math.round(p.car.cond) + '%', 1200, 618, 11, '#fff', 800);
    const kmh = Math.round(Math.abs(p.car.speed) * 0.36);
    text(ctx, String(kmh), 1150, 676, 52, '#fff', 900, 'center');
    text(ctx, 'KM/H', 1210, 676, 13, 'rgba(255,255,255,0.7)', 800);
    text(ctx, 'G' + (kmh < 1 ? 'N' : kmh < 60 ? '1' : kmh < 110 ? '2' : kmh < 160 ? '3' : '4'), 1246, 668, 12, '#ffd24b', 800, 'right');
    const barW = 200;
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; rr(ctx, 1022, 684 - 4, barW, 5, 2); ctx.fill();
    ctx.fillStyle = '#4be8ff'; rr(ctx, 1022, 684 - 4, barW * clamp(Math.abs(p.car.speed) / 520, 0, 1), 5, 2); ctx.fill();
  } else {
    panel(ctx, 1010, 580, 254, 104);
    text(ctx, 'ON FOOT', 1022, 600, 13, '#fff', 900);
    text(ctx, WEAPONS[p.weapon].name, 1022, 624, 12, '#ffd24b', 800);
    text(ctx, 'HP  ' + Math.round(p.hp), 1022, 646, 13, p.hp > 40 ? '#7ddb8a' : '#ff5a4b', 800);
    ctx.fillStyle = 'rgba(255,255,255,0.2)'; rr(ctx, 1022, 656, 200, 8, 4); ctx.fill();
    ctx.fillStyle = p.hp > 40 ? '#7ddb8a' : '#ff5a4b'; rr(ctx, 1022, 656, 200 * (p.hp / p.maxHp), 8, 4); ctx.fill();
    text(ctx, 'Press F near a car to drive', 1022, 678, 11, 'rgba(255,255,255,0.6)', 600);
  }
  // dialog box (bottom-center)
  if (game.dialog) drawDialog(ctx, game.dialog);
  // crosshair (on foot)
  if (!p.inCar && !game.dialog) {
    const mx = game.mouseX, my = game.mouseY;
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(mx, my, 11, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mx - 17, my); ctx.lineTo(mx - 6, my); ctx.moveTo(mx + 6, my); ctx.lineTo(mx + 17, my);
    ctx.moveTo(mx, my - 17); ctx.lineTo(mx, my - 6); ctx.moveTo(mx, my + 6); ctx.lineTo(mx, my + 17);
    ctx.stroke();
    ctx.fillStyle = '#ff2a2a'; ctx.beginPath(); ctx.arc(mx, my, 2, 0, Math.PI * 2); ctx.fill();
  }
  // interact prompt
  if (game.interactHint) {
    const s = game.interactHint;
    ctx.fillStyle = 'rgba(12,14,24,0.85)';
    const w = ctx.measureText(s).width + 34;
    rr(ctx, W / 2 - w / 2, 560, w, 30, 15); ctx.fill();
    ctx.fillStyle = '#ffd24b'; rr(ctx, W / 2 - w / 2 + 8, 567, 22, 16, 4); ctx.fill();
    text(ctx, 'E', W / 2 - w / 2 + 19, 579, 11, '#14101c', 900, 'center');
    text(ctx, s, W / 2 - w / 2 + 38, 579, 13, '#fff', 700);
  }
  // mission complete flash
  if (game.missionCompleteFlash > 0) {
    ctx.fillStyle = 'rgba(255,210,75,' + Math.min(0.9, game.missionCompleteFlash) + ')';
    ctx.font = '900 44px Arial'; ctx.textAlign = 'center';
    ctx.fillText('JOB COMPLETE', W / 2, 300);
  }
}
export function drawDialog(ctx, d) {
  const w = 520, x = (W - w) / 2, y = 592;
  panel(ctx, x, y, w, 100);
  drawPortrait(ctx, x + 10, y + 12, 76, d.portrait);
  text(ctx, d.name, x + 100, y + 32, 15, d.nameColor || '#ff7ad8', 900);
  text(ctx, d.role, x + 100 + ctx.measureText(d.name).width + 90, y + 32, 11, 'rgba(255,255,255,0.6)', 700);
  wrapText(ctx, d.line, x + 100, y + 58, w - 118, 13, '#fff', 2);
}
export function wrapText(ctx, s, x, y, maxW, size, color, maxLines) {
  ctx.font = '700 ' + size + 'px Arial'; ctx.textAlign = 'left'; ctx.fillStyle = color;
  const words = s.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  const n = Math.min(lines.length, maxLines);
  for (let i = 0; i < n; i++) ctx.fillText(lines[i], x, y + i * (size + 3));
}
function drawWeaponIcon(ctx, icon, x, y, color) {
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.5;
  ctx.save(); ctx.translate(x, y);
  if (icon === 'fist') { ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(-4, -3, 2, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(4, -3, 2, 0, Math.PI * 2); ctx.fill(); }
  else if (icon === 'pistol') { ctx.fillRect(-9, -3, 16, 5); ctx.fillRect(-3, 2, 5, 8); }
  else if (icon === 'smg') { ctx.fillRect(-11, -3, 20, 5); ctx.fillRect(-2, 2, 5, 8); ctx.fillRect(9, -2, 6, 3); }
  else if (icon === 'shotgun') { ctx.fillRect(-12, -3, 24, 5); ctx.fillRect(-6, 2, 5, 9); }
  else if (icon === 'rifle') { ctx.fillRect(-13, -2, 26, 4); ctx.beginPath(); ctx.arc(10, 0, 5, 0, Math.PI * 2); ctx.stroke(); ctx.fillRect(-8, 2, 5, 8); }
  ctx.restore();
}

// ---- city map (M) -------------------------------------------------------------------
export function drawMap(ctx, game) {
  ctx.fillStyle = 'rgba(8,8,16,0.94)'; ctx.fillRect(0, 0, W, H);
  const grad = ctx.createLinearGradient(40, 30, 40, 70);
  grad.addColorStop(0, '#ff7a4b'); grad.addColorStop(1, '#e84b6a');
  ctx.font = '900 30px Arial'; ctx.textAlign = 'left'; ctx.fillStyle = grad;
  ctx.fillText('CRIMSON HARBOR', 40, 62);
  ctx.fillStyle = '#fff'; ctx.font = '900 22px Arial';
  ctx.fillText('CITY MAP', 330, 62);
  text(ctx, 'M / Esc close', 1240, 56, 13, 'rgba(255,255,255,0.7)', 700, 'right');
  // left: STORY jobs
  panel(ctx, 40, 84, 250, 400);
  text(ctx, 'STORY', 56, 110, 16, '#ffd24b', 900);
  const done = MISSIONS.filter((m) => m.id < game.save.chapter).length;
  text(ctx, done + '/7 jobs', 274, 110, 12, 'rgba(255,255,255,0.7)', 700, 'right');
  MISSIONS.forEach((m, i) => {
    const y = 128 + i * 48;
    const status = m.id < game.save.chapter ? 'Complete' : m.id === game.save.chapter ? 'In progress' : 'Locked';
    const cur = m.id === game.save.chapter;
    if (cur) { ctx.fillStyle = 'rgba(255,210,75,0.14)'; rr(ctx, 48, y - 4, 234, 42, 8); ctx.fill(); }
    ctx.fillStyle = status === 'Locked' ? 'rgba(255,255,255,0.25)' : '#fff';
    ctx.font = '800 14px Arial'; ctx.textAlign = 'left';
    ctx.fillText((i + 1) + '. ' + m.title, 56, y + 14);
    ctx.fillStyle = status === 'Complete' ? '#7ddb8a' : status === 'In progress' ? '#ffd24b' : 'rgba(255,255,255,0.4)';
    ctx.font = '700 11px Arial';
    ctx.fillText(status, 56, y + 31);
    ctx.fillStyle = '#7ddb8a'; ctx.font = '800 13px Arial'; ctx.textAlign = 'right';
    ctx.fillText('$' + m.reward.toLocaleString('en-US'), 274, y + 14);
  });
  // current job panel
  const cur = MISSIONS[game.save.chapter - 1];
  panel(ctx, 40, 496, 250, 130);
  text(ctx, 'CURRENT JOB', 56, 520, 13, '#ff5a4b', 900);
  text(ctx, 'CH ' + cur.ch, 274, 520, 12, 'rgba(255,255,255,0.7)', 700, 'right');
  text(ctx, cur.title, 56, 544, 16, '#fff', 900);
  wrapText(ctx, game.missions.current ? game.missions.stage.text : cur.brief, 56, 566, 218, 12, 'rgba(255,255,255,0.85)', 2);
  if (game.missions.current) {
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; rr(ctx, 56, 596, 150, 8, 4); ctx.fill();
    ctx.fillStyle = '#ffd24b'; rr(ctx, 56, 596, 150 * (game.missions.stageNum / game.missions.stageTotal), 8, 4); ctx.fill();
    text(ctx, 'STAGE ' + game.missions.stageNum + '/' + game.missions.stageTotal, 56, 616, 11, '#ffd24b', 800);
    const gps = game.objective ? Math.round(dist(game.player.x, game.player.y, game.objective.x, game.objective.y)) : 0;
    text(ctx, 'GPS  ' + gps + ' m', 274, 616, 11, '#fff', 800, 'right');
  }
  // center: map
  const mx = 310, my = 84, mw = 660, mh = 542;
  panel(ctx, mx, my, mw, mh, 'rgba(20,28,44,0.95)');
  const sc = Math.min(mw / 3600, mh / 2700);
  const ox = mx + (mw - 3600 * sc) / 2, oy = my + (mh - 2700 * sc) / 2;
  // water + land
  ctx.fillStyle = '#1f5a7d'; ctx.fillRect(ox, oy, 3600 * sc, 2700 * sc);
  ctx.fillStyle = '#4a5a44'; ctx.fillRect(ox, oy, 3300 * sc, 2400 * sc);
  // districts
  for (const d of [{ name: 'OLD PIER', x: 0, y: 0 }, { name: 'MARINA BAY', x: 1200, y: 0 }, { name: 'PALM COURT', x: 2400, y: 0 }, { name: 'FOUNDRY ROW', x: 0, y: 900 }, { name: 'HARBOR VIEW', x: 1200, y: 900 }, { name: 'CORAL ROW', x: 2400, y: 900 }, { name: 'THE SHALLOWS', x: 0, y: 1800 }, { name: 'SUNSET STRIP', x: 1200, y: 1800 }, { name: 'PORTSIDE', x: 2400, y: 1800 }]) {
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fillRect(ox + d.x * sc, oy + d.y * sc, 1200 * sc, 900 * sc);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = '800 11px Arial'; ctx.textAlign = 'center';
    ctx.fillText(d.name, ox + (d.x + 600) * sc, oy + (d.y + 450) * sc);
  }
  // roads
  ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineWidth = 1.5;
  for (let k = 0; k <= 11; k++) { ctx.beginPath(); ctx.moveTo(ox + (150 + k * 300) * sc, oy); ctx.lineTo(ox + (150 + k * 300) * sc, oy + 2400 * sc); ctx.stroke(); }
  for (let k = 0; k <= 8; k++) { ctx.beginPath(); ctx.moveTo(ox, oy + (150 + k * 300) * sc); ctx.lineTo(ox + 3300 * sc, oy + (150 + k * 300) * sc); ctx.stroke(); }
  // POI markers
  for (const poi of POIS) {
    const px = ox + poi.x * sc, py = oy + poi.y * sc;
    ctx.fillStyle = poi.type === 'safehouse' ? '#4be8ff' : poi.type === 'weapons' ? '#ff7ad8' : poi.type === 'respray' ? '#7ddb8a' : poi.type === 'hospital' ? '#ff5a4b' : poi.type === 'race' ? '#ffd24b' : poi.type === 'property' ? '#c98ae8' : '#fff';
    ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.stroke();
  }
  // GPS route (yellow line from player to objective)
  if (game.objective) {
    ctx.strokeStyle = '#ffd24b'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(ox + game.player.x * sc, oy + game.player.y * sc);
    ctx.lineTo(ox + game.objective.x * sc, oy + game.objective.y * sc);
    ctx.stroke();
    ctx.fillStyle = '#ffd24b';
    ctx.beginPath(); ctx.arc(ox + game.objective.x * sc, oy + game.objective.y * sc, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#14101c'; ctx.font = '900 10px Arial'; ctx.textAlign = 'center';
    ctx.fillText('!', ox + game.objective.x * sc, oy + game.objective.y * sc + 3);
  }
  // player marker
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(ox + game.player.x * sc, oy + game.player.y * sc, 6, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#ffd24b'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ox + game.player.x * sc, oy + game.player.y * sc, 9, 0, Math.PI * 2); ctx.stroke();
  // right: LEGEND + stats
  panel(ctx, 990, 84, 250, 330);
  text(ctx, 'LEGEND', 1006, 110, 16, '#4be8ff', 900);
  LEGEND.forEach((l, i) => {
    const y = 132 + i * 24;
    drawLegendIcon(ctx, l.icon, 1016, y - 6);
    text(ctx, l.label, 1034, y + 2, 12, '#fff', 600);
  });
  panel(ctx, 990, 428, 250, 198);
  text(ctx, 'Cash  ' + fmtMoney(game.cash), 1006, 456, 15, '#7ddb8a', 900);
  text(ctx, 'Respect level ' + game.respectLevel + ' (' + respectLevelName(game.respectLevel) + ')', 1006, 480, 13, '#fff', 700);
  text(ctx, 'Collectible  ' + game.save.collectibles.length + ' / 20', 1006, 504, 13, '#fff', 700);
  text(ctx, 'Properties  ' + game.save.properties.length + ' / 2', 1006, 528, 13, '#fff', 700);
  text(ctx, 'Day ' + game.day + '  ·  ' + fmtTime(game.hour), 1006, 552, 13, 'rgba(255,255,255,0.7)', 700);
  text(ctx, 'Wanted  ' + '★'.repeat(game.wanted) + '☆'.repeat(5 - game.wanted), 1006, 576, 13, '#ffd24b', 800);
  // bottom stats strip
  panel(ctx, 310, 638, 660, 56, 'rgba(12,14,24,0.9)');
  text(ctx, 'CASH  ' + fmtMoney(game.cash), 330, 664, 13, '#7ddb8a', 900);
  text(ctx, 'RESPECT  ' + respectLevelName(game.respectLevel), 500, 664, 13, '#fff', 800);
  text(ctx, 'COLLECTIBLE  ' + game.save.collectibles.length + '/20', 665, 664, 13, '#fff', 800);
  text(ctx, 'PROPERTIES  ' + game.save.properties.length + '/2', 950, 664, 13, '#fff', 800, 'right');
  text(ctx, 'M / Esc close', 330, 686, 11, 'rgba(255,255,255,0.55)', 600);
}
function drawLegendIcon(ctx, icon, x, y) {
  ctx.save(); ctx.translate(x, y);
  const c = { you: '#fff', contact: '#ffd24b', objective: '#ffd24b', safehouse: '#4be8ff', weapons: '#ff7ad8', respray: '#7ddb8a', race: '#ffd24b', property: '#c98ae8', hospital: '#ff5a4b', police: '#4ba8ff', collectible: '#ff9a4b' }[icon] || '#fff';
  ctx.fillStyle = c;
  if (icon === 'you') { ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(0, 14); ctx.lineTo(16, 14); ctx.closePath(); ctx.fill(); }
  else if (icon === 'objective') { ctx.beginPath(); ctx.arc(8, 8, 7, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#14101c'; ctx.font = '900 10px Arial'; ctx.textAlign = 'center'; ctx.fillText('!', 8, 12); }
  else { ctx.beginPath(); ctx.arc(8, 8, 6, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}

// ---- overlays ---------------------------------------------------------------------
export function drawPause(ctx, game) {
  ctx.fillStyle = 'rgba(8,8,16,0.7)'; ctx.fillRect(0, 0, W, H);
  panel(ctx, 440, 220, 400, 280);
  text(ctx, 'PAUSED', 640, 270, 34, '#fff', 900, 'center');
  const items = ['RESUME', 'RESTART MISSION', 'QUIT TO MENU'];
  game.pauseItems = [];
  items.forEach((label, i) => {
    const y = 310 + i * 56;
    const hovered = menuButtonHit(game.mouseX, game.mouseY, 480, y, 320, 40);
    btn(ctx, 480, y, 320, 40, label, null, game.pauseSel === i, hovered);
    game.pauseItems.push({ id: label, x: 480, y, w: 320, h: 40 });
  });
}
export function drawControls(ctx) {
  ctx.fillStyle = 'rgba(8,8,16,0.92)'; ctx.fillRect(0, 0, W, H);
  text(ctx, 'CONTROLS', 640, 90, 40, '#fff', 900, 'center');
  const rows = [
    ['W A S D', 'Walk / drive'], ['Mouse', 'Aim — click to shoot'], ['Shift', 'Sprint'],
    ['Space', 'Handbrake drift'], ['F', 'Enter / steal a vehicle'], ['E', 'Interact'],
    ['Q', 'Previous radio station'], ['R', 'Reload weapon'], ['1 – 5', 'Switch weapon'],
    ['M', 'City map'], ['Esc / P', 'Pause'], ['Enter', 'Select'],
  ];
  rows.forEach((r, i) => {
    const y = 150 + i * 40;
    ctx.fillStyle = 'rgba(255,210,75,0.16)'; rr(ctx, 420, y - 18, 130, 26, 6); ctx.fill();
    text(ctx, r[0], 430, y, 15, '#ffd24b', 800);
    text(ctx, r[1], 570, y, 16, '#fff', 700);
  });
  text(ctx, 'Esc / click to go back', 640, 660, 14, 'rgba(255,255,255,0.6)', 700, 'center');
}
export function drawSettings(ctx, game) {
  ctx.fillStyle = 'rgba(8,8,16,0.92)'; ctx.fillRect(0, 0, W, H);
  text(ctx, 'SETTINGS', 640, 90, 40, '#fff', 900, 'center');
  const s = game.save.settings;
  const rows = [
    { label: 'Sound effects', value: s.sfx ? 'ON' : 'OFF', key: 'sfx' },
    { label: 'Screen shake', value: s.shake ? 'ON' : 'OFF', key: 'shake' },
    { label: 'Show FPS', value: s.showFps ? 'ON' : 'OFF', key: 'showFps' },
  ];
  game.settingsRows = [];
  rows.forEach((r, i) => {
    const y = 170 + i * 60;
    text(ctx, r.label, 420, y, 18, '#fff', 800);
    const on = r.value === 'ON';
    ctx.fillStyle = on ? '#7ddb8a' : 'rgba(255,255,255,0.25)';
    rr(ctx, 700, y - 20, 120, 30, 15); ctx.fill();
    text(ctx, r.value, 760, y + 2, 15, '#14101c', 900, 'center');
    game.settingsRows.push({ key: r.key, x: 700, y: y - 20, w: 120, h: 30 });
  });
  text(ctx, 'Click a toggle to change it. Esc / click to go back.', 640, 420, 14, 'rgba(255,255,255,0.6)', 700, 'center');
}
export function drawWasted(ctx, game) {
  ctx.fillStyle = 'rgba(20,4,4,0.75)'; ctx.fillRect(0, 0, W, H);
  text(ctx, game.endTitle, 640, 300, 64, '#ff5a4b', 900, 'center');
  text(ctx, game.endSub, 640, 350, 18, '#fff', 700, 'center');
  text(ctx, 'Press Enter to continue', 640, 420, 15, 'rgba(255,255,255,0.7)', 700, 'center');
}
export function drawVictory(ctx, game) {
  ctx.fillStyle = 'rgba(8,20,10,0.8)'; ctx.fillRect(0, 0, W, H);
  text(ctx, 'PORT VALEN IS YOURS', 640, 280, 48, '#ffd24b', 900, 'center');
  text(ctx, 'Leo settled every score. All 7 jobs complete — free roam unlocked.', 640, 330, 18, '#fff', 700, 'center');
  text(ctx, 'Cash ' + fmtMoney(game.cash) + '   ·   Respect ' + respectLevelName(game.respectLevel), 640, 370, 16, '#7ddb8a', 800, 'center');
  text(ctx, 'Press Enter to keep playing', 640, 430, 15, 'rgba(255,255,255,0.7)', 700, 'center');
}
