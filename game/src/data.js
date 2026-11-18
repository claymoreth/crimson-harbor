// Crimson Harbor — all game data: city districts, characters, gangs, missions,
// radio, weapons, cars, dialog. Every name here is original to this game.
export const WORLD_W = 3600, WORLD_H = 2700;
export const ROAD_STEP = 300, ROAD_W = 64;

// 3x3 districts of Port Valen (each 1200 x 900).
export const DISTRICTS = [
  { name: 'OLD PIER', x: 0, y: 0, w: 1200, h: 900, tint: '#7a6a58', desc: 'Docks & warehouses' },
  { name: 'MARINA BAY', x: 1200, y: 0, w: 1200, h: 900, tint: '#4f7d8c', desc: 'Boats & boardwalk' },
  { name: 'PALM COURT', x: 2400, y: 0, w: 1200, h: 900, tint: '#7d8c5a', desc: 'Quiet avenues' },
  { name: 'FOUNDRY ROW', x: 0, y: 900, w: 1200, h: 900, tint: '#8a6f5c', desc: 'Factories & yards' },
  { name: 'HARBOR VIEW', x: 1200, y: 900, w: 1200, h: 900, tint: '#5c6a8c', desc: 'Downtown towers' },
  { name: 'CORAL ROW', x: 2400, y: 900, w: 1200, h: 900, tint: '#a06a7d', desc: 'Shops & neon' },
  { name: 'THE SHALLOWS', x: 0, y: 1800, w: 1200, h: 900, tint: '#c2a05e', desc: 'Beach & surf' },
  { name: 'SUNSET STRIP', x: 1200, y: 1800, w: 1200, h: 900, tint: '#c27a4e', desc: 'Clubs & lights' },
  { name: 'PORTSIDE', x: 2400, y: 1800, w: 1200, h: 900, tint: '#6a8a7d', desc: 'Harbor & cranes' },
];
export function districtAt(x, y) {
  for (const d of DISTRICTS) if (x >= d.x && x < d.x + d.w && y >= d.y && y < d.y + d.h) return d;
  return DISTRICTS[4];
}

// Six selectable drivers. Leo Marlow is the story lead (default).
export const CHARACTERS = [
  { name: 'LEO MARLOW', role: 'GETAWAY DRIVER', top: 1.00, accel: 1.00, hp: 100, sprint: 1.00, aim: 1.00, color: '#e8b04b', bg: '#3a2f5e', shirt: '#c94f43', skin: '#e8b98a', hair: '#2b2118', shades: false, hat: null, blurb: 'Four years inside. Back to find who set him up.' },
  { name: 'DANA COLE', role: 'WHEELWOMAN', top: 1.10, accel: 1.08, hp: 90, sprint: 1.00, aim: 1.00, color: '#e86aa8', bg: '#123a4a', shirt: '#2f7d8c', skin: '#c98a5e', hair: '#14100c', shades: false, hat: null, blurb: 'Drove the fastest crew on the coast. Never caught.' },
  { name: 'MARCUS REED', role: 'ENFORCER', top: 0.94, accel: 0.95, hp: 140, sprint: 0.95, aim: 0.95, color: '#8a9aa8', bg: '#3a1f1f', shirt: '#4a4a55', skin: '#8a5a3a', hair: '#0c0a08', shades: true, hat: null, blurb: 'Built like a dock crane. Nobody pushes him around.' },
  { name: 'ANA SOLANO', role: 'RUNNER', top: 1.00, accel: 1.00, hp: 90, sprint: 1.22, aim: 1.05, color: '#7ddb8a', bg: '#1f3a2a', shirt: '#d8c94b', skin: '#e8c49a', hair: '#3a2410', shades: false, hat: null, blurb: 'On foot she outruns every siren in Port Valen.' },
  { name: 'TOMMY VALE', role: 'JOYRIDER', top: 1.06, accel: 1.12, hp: 85, sprint: 1.05, aim: 0.95, color: '#5aa8e8', bg: '#2a2a4a', shirt: '#e8e8e8', skin: '#f0c8a0', hair: '#c9a23a', shades: false, hat: '#c94f43', blurb: 'Young, reckless, and quicker than the cops.' },
  { name: 'PRIYA NAIR', role: 'SHARPSHOOTER', top: 1.00, accel: 1.00, hp: 95, sprint: 1.00, aim: 1.25, color: '#c98ae8', bg: '#3a1f3a', shirt: '#5e3a7d', skin: '#a06a3a', hair: '#0c0a08', shades: false, hat: null, blurb: 'Never misses. The Harbor Kings learned that twice.' },
];

export const GANGS = {
  vipers: { name: 'THE VIPERS', color: '#c94f43', desc: 'Rival street crew' },
  kings: { name: 'HARBOR KINGS', color: '#e8b04b', desc: 'The port runs through them' },
  docksiders: { name: 'THE DOCKSIDERS', color: '#5aa8e8', desc: 'Dockyard muscle' },
};

export const WEAPONS = [
  { name: 'FISTS', ammo: Infinity, reserve: Infinity, dmg: 12, rate: 0.32, spread: 0, auto: false, icon: 'fist' },
  { name: 'PISTOL', ammo: 12, reserve: 60, dmg: 26, rate: 0.22, spread: 0.05, auto: false, icon: 'pistol' },
  { name: 'STING SMG', ammo: 30, reserve: 150, dmg: 15, rate: 0.09, spread: 0.10, auto: true, icon: 'smg' },
  { name: 'DOCKSHOT', ammo: 6, reserve: 30, dmg: 20, rate: 0.7, spread: 0.16, auto: false, icon: 'shotgun', pellets: 5 },
  { name: 'LONGSHOT', ammo: 8, reserve: 40, dmg: 70, rate: 0.9, spread: 0.01, auto: false, icon: 'rifle' },
];

export const CARS = [
  { name: 'FALCON GT', color: '#e84b6a', top: 1.00 },
  { name: 'HARBOR CRUISER', color: '#4b7de8', top: 0.92 },
  { name: 'SUNSET COUPE', color: '#e8a24b', top: 1.05 },
  { name: 'DOCK RUNNER', color: '#5aa87d', top: 0.95 },
  { name: 'MARINA SPORT', color: '#a84be8', top: 1.02 },
];
export const POLICE_NAMES = ['ANCHOR-12', 'TIDE-07', 'BUOY-23', 'PIER-09', 'GULL-31', 'REEF-18', 'SQUALL-44'];
export const POLICE_DEPT = 'PVPD RESPONSE'; // Port Valen Police Department

export const RADIOS = [
  { name: 'CRIMSON 88.1', show: 'Neon Drive', song: 'Midnight Harbor — The Breaklights' },
  { name: 'SUNSET ROCK 94.5', show: 'Tail Lights', song: 'Velvet Static — Tail Lights' },
  { name: 'PORTSIDE TALK 101.3', show: 'The Harbor Desk', song: 'Live from the pier' },
  { name: 'PALM FM 102.7', show: 'Salt Air', song: 'Coral Club — Salt Air' },
];

// 7 story jobs. Stages: drive | pickup | shoot | boss | escape | deliver | talk.
// A stage is done when its goal is met; the mission ends after its last stage.
export const MISSIONS = [
  {
    id: 1, ch: 1, title: 'FIRST LIGHT', reward: 800,
    brief: 'Mara needs a driver tonight. Pick up her package, then bring it home.',
    stages: [
      { type: 'drive', x: 1050, y: 450, text: 'Drive to Mara\'s pickup on Marina Bay', next: 'Pick up the package' },
      { type: 'pickup', x: 1050, y: 450, text: 'Press E to take the package', next: 'Cops are coming — run' },
      { type: 'escape', x: 2550, y: 1950, text: 'Lose the cops, then reach the safehouse', next: 'Break line of sight' },
      { type: 'escape', x: 2550, y: 1950, text: 'Reach the safehouse on Sunset Strip', next: 'Job done' },
    ],
  },
  {
    id: 2, ch: 2, title: 'DOCKSIDE DEBT', reward: 1200,
    brief: 'The Vipers owe Mara money. Collect it — loudly, on foot.',
    stages: [
      { type: 'drive', x: 450, y: 1650, text: 'Drive to the docks in Old Pier', next: 'Get out and settle it' },
      { type: 'shoot', x: 450, y: 1650, count: 6, gang: 'vipers', text: 'Take out the Vipers crew', next: 'Lose any heat' },
      { type: 'escape', x: 2550, y: 1950, text: 'Lose the heat, then reach the safehouse', next: 'Report back' },
      { type: 'talk', x: 1650, y: 1050, text: 'Report back to Mara in Harbor View', next: 'Job done' },
    ],
  },
  {
    id: 3, ch: 3, title: 'KING OF THE HARBOR', reward: 2000,
    brief: 'Big Ray Calloway runs the Harbor Kings. End his run tonight.',
    stages: [
      { type: 'drive', x: 2850, y: 1950, text: 'Drive to the Kings warehouse in Portside', next: 'Face Big Ray' },
      { type: 'boss', x: 2850, y: 1950, text: 'Take down Big Ray Calloway', next: 'Lose any heat' },
      { type: 'escape', x: 2550, y: 1950, text: 'Lose the heat, then reach the safehouse', next: 'Report back' },
      { type: 'talk', x: 1650, y: 1050, text: 'Report back to Mara in Harbor View', next: 'Job done' },
    ],
  },
  {
    id: 4, ch: 4, title: 'THE LONG HAUL', reward: 1500,
    brief: 'A truck full of cargo has to cross the city before dawn. Fast.',
    stages: [
      { type: 'drive', x: 450, y: 450, text: 'Drive to the truck in Old Pier', next: 'Take the wheel' },
      { type: 'deliver', x: 2850, y: 450, text: 'Haul the cargo to Palm Court — keep it moving', next: 'Drop it off' },
      { type: 'deliver', x: 2850, y: 1950, text: 'Deliver the cargo to Portside', next: 'Lose any heat' },
      { type: 'escape', x: 2550, y: 1950, text: 'Lose the heat, then reach the safehouse', next: 'Job done' },
    ],
  },
  {
    id: 5, ch: 5, title: 'SAFEHOUSE RUN', reward: 1800,
    brief: 'Mara\'s runner is exposed. Drive him home while the Vipers chase you.',
    stages: [
      { type: 'drive', x: 1650, y: 450, text: 'Drive to the runner in Marina Bay', next: 'Pick him up' },
      { type: 'pickup', x: 1650, y: 450, text: 'Press E to pick up the runner', next: 'Drive — they are coming' },
      { type: 'escape', x: 2550, y: 1950, text: 'Outrun the Vipers to the safehouse', next: 'Lose any heat' },
      { type: 'escape', x: 2550, y: 1950, text: 'Reach the safehouse on Sunset Strip', next: 'Job done' },
    ],
  },
  {
    id: 6, ch: 6, title: 'HARBOR HEIST', reward: 2500,
    brief: 'The Docksiders guard a shipment at the port. Take it. All of it.',
    stages: [
      { type: 'drive', x: 2850, y: 1650, text: 'Drive to the port in Portside', next: 'Clear the dock' },
      { type: 'shoot', x: 2850, y: 1650, count: 8, gang: 'docksiders', text: 'Take out the Docksiders crew', next: 'Grab the shipment' },
      { type: 'pickup', x: 2850, y: 1650, text: 'Press E to grab the shipment', next: 'Run — cops are coming' },
      { type: 'escape', x: 2550, y: 1950, text: 'Escape to the safehouse on Sunset Strip', next: 'Job done' },
    ],
  },
  {
    id: 7, ch: 7, title: 'THE RECKONING', reward: 4000,
    brief: 'Dario Venn set Leo up four years ago. Tonight Leo collects.',
    stages: [
      { type: 'drive', x: 1650, y: 1350, text: 'Drive to Venn\'s tower in Harbor View', next: 'Go in loud' },
      { type: 'boss', x: 1650, y: 1350, text: 'Take down Dario Venn and his crew', next: 'Lose any heat' },
      { type: 'escape', x: 2550, y: 1950, text: 'Lose the heat, then reach the safehouse', next: 'Finish it' },
      { type: 'talk', x: 1650, y: 1050, text: 'Meet Mara one last time', next: 'Job done' },
    ],
  },
];

export const BOSSES = {
  3: { name: 'BIG RAY CALLOWAY', role: 'HARBOR KINGS BOSS', line: 'You picked the wrong harbor, kid. Boys — wash him out.', color: '#e8b04b', bg: '#6a5a30', shirt: '#8a6a2a', skin: '#d8a06a', hair: '#4a2a10', shades: false, hat: null, hp: 420, guards: 4 },
  7: { name: 'DARIO VENN', role: 'THE MAN WHO SET LEO UP', line: 'Four years, and you still come crawling back. Finish him.', color: '#c94f43', bg: '#1f2a3a', shirt: '#2a3a55', skin: '#c98a5e', hair: '#e8e8e8', shades: false, hat: null, hp: 520, guards: 6 },
};

export const MARA = { name: 'MARA VOSS', role: 'FIXER', color: '#e86aa8', bg: '#2a1f3a', shirt: '#7d2a5e', skin: '#e8c49a', hair: '#14100c', shades: false, hat: null };
export const STORY_HOOK = 'Four years inside for a job that went sideways. Leo Marlow is back in Port Valen — and the man who set him up still owns the tide.';

export const LEGEND = [
  { icon: 'you', label: 'You are here' },
  { icon: 'contact', label: 'Story contact' },
  { icon: 'objective', label: 'Job objective' },
  { icon: 'safehouse', label: 'Safehouse' },
  { icon: 'weapons', label: 'Weapons' },
  { icon: 'respray', label: 'Respray (clears heat)' },
  { icon: 'race', label: 'Street race' },
  { icon: 'property', label: 'Property' },
  { icon: 'hospital', label: 'Hospital' },
  { icon: 'police', label: 'Police' },
  { icon: 'collectible', label: 'Collectible' },
];

// Fixed points of interest on the map.
export const POIS = [
  { type: 'safehouse', x: 2550, y: 1950, name: 'Safehouse' },
  { type: 'safehouse', x: 450, y: 450, name: 'Old Pier Safehouse' },
  { type: 'weapons', x: 1950, y: 750, name: 'Harbor Arms' },
  { type: 'respray', x: 2250, y: 1650, name: 'Crimson Respray' },
  { type: 'hospital', x: 1350, y: 1650, name: 'St. Marina Hospital' },
  { type: 'race', x: 750, y: 2250, name: 'Strip Race' },
  { type: 'property', x: 2850, y: 750, name: 'Palm Court Flat', price: 5000 },
  { type: 'property', x: 750, y: 1050, name: 'Foundry Loft', price: 8000 },
  { type: 'contact', x: 1650, y: 1050, name: 'Mara Voss' },
];
export const SAVE_KEY = 'crimson-harbor-save-v1';
