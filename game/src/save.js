// Crimson Harbor — save / load (localStorage). One save slot.
import { SAVE_KEY, CHARACTERS } from './data.js';

export function defaultSave() {
  return {
    hasSave: false, chapter: 1, cash: 500, day: 1, hour: 18.0,
    respect: 0, respectLevel: 1, collectibles: [], properties: [],
    charIndex: 0, weapons: [true, true, false, false, false],
    carIndex: 0, settings: { sfx: true, shake: true, showFps: false },
  };
}
export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultSave();
    const s = JSON.parse(raw);
    return Object.assign(defaultSave(), s, { hasSave: true });
  } catch (e) { return defaultSave(); }
}
export function writeSave(s) {
  try {
    const copy = Object.assign({}, s, { hasSave: true });
    localStorage.setItem(SAVE_KEY, JSON.stringify(copy));
  } catch (e) {}
}
export function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
}
export function respectLevelName(lvl) {
  return ['STREET', 'KNOWN', 'FEARED', 'LEGEND', 'KINGPIN'][Math.min(lvl - 1, 4)];
}
