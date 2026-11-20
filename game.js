const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const miniCanvas = document.getElementById('minimap-canvas');
const miniCtx = miniCanvas ? miniCanvas.getContext('2d') : null;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const TEAMS_2026 = [
  { id: 'mercedes', name: 'Mercedes-AMG Petronas', color: '#00d2be', accent: '#111', pace: 1.015, d1: { num: 12, name: 'Kimi Antonelli' }, d2: { num: 63, name: 'George Russell' } },
  { id: 'ferrari', name: 'Scuderia Ferrari HP', color: '#e10600', accent: '#fff200', pace: 1.008, d1: { num: 16, name: 'Charles Leclerc' }, d2: { num: 44, name: 'Lewis Hamilton' } },
  { id: 'redbull', name: 'Oracle Red Bull Racing', color: '#1e41ff', accent: '#ffcc00', pace: 1.006, d1: { num: 3, name: 'Max Verstappen' }, d2: { num: 6, name: 'Isack Hadjar' } },
  { id: 'mclaren', name: 'McLaren Mastercard', color: '#ff8700', accent: '#111', pace: 1.005, d1: { num: 1, name: 'Lando Norris' }, d2: { num: 81, name: 'Oscar Piastri' } },
  { id: 'racingbulls', name: 'Visa Cash App Racing Bulls', color: '#2b6cb0', accent: '#fff', pace: 0.985, d1: { num: 30, name: 'Liam Lawson' }, d2: { num: 41, name: 'Arvid Lindblad' } },
  { id: 'alpine', name: 'BWT Alpine F1 Team', color: '#ff69b4', accent: '#0090ff', pace: 0.980, d1: { num: 10, name: 'Pierre Gasly' }, d2: { num: 43, name: 'Franco Colapinto' } },
  { id: 'haas', name: 'TGR Haas F1 Team', color: '#e6e6e6', accent: '#e10600', pace: 0.972, d1: { num: 87, name: 'Oliver Bearman' }, d2: { num: 51, name: 'Rafael Câmara' } },
  { id: 'audi', name: 'Audi Revolut F1 Team', color: '#c0c0c0', accent: '#e10600', pace: 0.970, d1: { num: 5, name: 'Gabriel Bortoleto' }, d2: { num: 27, name: 'Nico Hülkenberg' } },
  { id: 'williams', name: 'Atlassian Williams', color: '#005aff', accent: '#64c4ff', pace: 0.965, d1: { num: 23, name: 'Alex Albon' }, d2: { num: 55, name: 'Carlos Sainz Jr.' } },
  { id: 'astonmartin', name: 'Aston Martin Aramco', color: '#006f62', accent: '#cedc00', pace: 0.960, d1: { num: 14, name: 'Fernando Alonso' }, d2: { num: 18, name: 'Lance Stroll' } },
  { id: 'cadillac', name: 'Cadillac Formula 1 Team', color: '#2c2f33', accent: '#d4af37', pace: 0.955, d1: { num: 11, name: 'Sergio Pérez' }, d2: { num: 77, name: 'Valtteri Bottas' } }
];

const CALENDAR_2026 = [
  { round: 1, gp: 'Australia - Albert Park', desert: false, cornerIntensity: 1.05, topSpeedScale: 1.02, seed: 11 },
  { round: 2, gp: 'China - Shanghai', desert: false, cornerIntensity: 1.12, topSpeedScale: 1.03, seed: 22 },
  { round: 3, gp: 'Japón - Suzuka', desert: false, cornerIntensity: 1.28, topSpeedScale: 1.02, seed: 33 },
  { round: 4, gp: 'Baréin - Sakhir', desert: true, cornerIntensity: 1.08, topSpeedScale: 1.01, seed: 44 },
  { round: 5, gp: 'Arabia Saudita - Yeda', desert: true, cornerIntensity: 1.16, topSpeedScale: 1.06, seed: 55 },
  { round: 6, gp: 'Miami - Miami Gardens', desert: false, cornerIntensity: 1.04, topSpeedScale: 1.03, seed: 66 },
  { round: 7, gp: 'Canadá - Montreal', desert: false, cornerIntensity: 1.10, topSpeedScale: 1.04, seed: 77 },
  { round: 8, gp: 'Mónaco - Montecarlo', desert: false, cornerIntensity: 1.38, topSpeedScale: 0.90, seed: 88 },
  { round: 9, gp: 'Barcelona-Cataluña - Montmeló', desert: false, cornerIntensity: 1.14, topSpeedScale: 1.01, seed: 99 },
  { round: 10, gp: 'Austria - Red Bull Ring', desert: false, cornerIntensity: 1.02, topSpeedScale: 1.04, seed: 105 },
  { round: 11, gp: 'Gran Bretaña - Silverstone', desert: false, cornerIntensity: 1.24, topSpeedScale: 1.04, seed: 116 },
  { round: 12, gp: 'Bélgica - Spa-Francorchamps', desert: false, cornerIntensity: 1.20, topSpeedScale: 1.06, seed: 127 },
  { round: 13, gp: 'Hungría - Hungaroring', desert: false, cornerIntensity: 1.26, topSpeedScale: 0.95, seed: 138 },
  { round: 14, gp: 'Países Bajos - Zandvoort', desert: false, cornerIntensity: 1.25, topSpeedScale: 0.97, seed: 149 },
  { round: 15, gp: 'Italia - Monza', desert: false, cornerIntensity: 0.92, topSpeedScale: 1.10, seed: 160 },
  { round: 16, gp: 'España - Madrid', desert: false, cornerIntensity: 1.15, topSpeedScale: 1.00, seed: 171 },
  { round: 17, gp: 'Azerbaiyán - Bakú', desert: false, cornerIntensity: 1.12, topSpeedScale: 1.07, seed: 182 },
  { round: 18, gp: 'Singapur - Marina Bay', desert: false, cornerIntensity: 1.34, topSpeedScale: 0.93, seed: 193 },
  { round: 19, gp: 'Estados Unidos - Austin', desert: false, cornerIntensity: 1.18, topSpeedScale: 1.02, seed: 204 },
  { round: 20, gp: 'México - Hermanos Rodríguez', desert: false, cornerIntensity: 1.16, topSpeedScale: 1.05, seed: 215 },
  { round: 21, gp: 'Brasil - Interlagos', desert: false, cornerIntensity: 1.22, topSpeedScale: 1.01, seed: 226 },
  { round: 22, gp: 'Las Vegas - Strip Circuit', desert: true, cornerIntensity: 0.98, topSpeedScale: 1.09, seed: 237 },
  { round: 23, gp: 'Catar - Lusail', desert: true, cornerIntensity: 1.23, topSpeedScale: 1.03, seed: 248 },
  { round: 24, gp: 'Abu Dabi - Yas Marina', desert: true, cornerIntensity: 1.06, topSpeedScale: 1.03, seed: 259 }
];

const TIRE_SPECS = {
  soft:   { label: 'BLANDO', color: '#ff2a2a', baseGrip: 1.06, baseSpeed: 1.03, baseWear: 0.017 },
  medium: { label: 'MEDIO',  color: '#ffd000', baseGrip: 1.00, baseSpeed: 1.00, baseWear: 0.014 },
  hard:   { label: 'DURO',   color: '#f2f2f2', baseGrip: 0.95, baseSpeed: 0.98, baseWear: 0.011 },
  inter:  { label: 'LLUVIA MEDIA', color: '#00c853', baseGrip: 0.96, baseSpeed: 0.95, baseWear: 0.015 },
  wet:    { label: 'LLUVIA EXT.',  color: '#0091ea', baseGrip: 0.92, baseSpeed: 0.90, baseWear: 0.015 }
};

const ENGINE_MAPS = {
  sunny:  { label: 'MAPA 1 SOLEADO', idealTire: 'soft',   power: 1.03, fuelBurn: 0.022 },
  cloudy: { label: 'MAPA 2 NUBOSO',  idealTire: 'medium', power: 1.00, fuelBurn: 0.019 },
  desert: { label: 'MAPA 3 DESIERTO', idealTire: 'hard',  power: 0.98, fuelBurn: 0.017 }
};

const teamSelect = document.getElementById('team-select');
const gpSelect = document.getElementById('gp-select');
const seat1Btn = document.getElementById('seat-1-btn');
const seat2Btn = document.getElementById('seat-2-btn');
const driverNameInput = document.getElementById('driver-name-input');
const tireSelect = document.getElementById('tire-select');
const mapSelect = document.getElementById('map-select');
const weatherPreview = document.getElementById('weather-preview');
const weatherHint = document.getElementById('weather-hint');

let selectedTeamIndex = 0, selectedSeat = 1, selectedGpIndex = 0, currentWeather = null;

function generateRandomWeather(gp) {
  const r = Math.random();
  if (gp.desert) {
    if (r < 0.80) return { type: 'desert', rainPct: 0, idealTire: 'hard', idealMap: 'desert', name: 'Desierto Seco (42°C · 0% lluvia)', hint: 'Ideal: Mapa 3 Desierto + Gomas Duras' };
    if (r < 0.95) return { type: 'cloudy', rainPct: 0, idealTire: 'medium', idealMap: 'cloudy', name: 'Nuboso Árido (0% lluvia)', hint: 'Ideal: Mapa 2 Nuboso + Gomas Medias' };
    const rainPct = Math.floor(Math.random() * 5) + 1;
    return { type: 'rain_light', rainPct, idealTire: 'inter', idealMap: 'cloudy', name: `Lluvia Ligera (${rainPct}% intensidad)`, hint: 'Ideal: Lluvia Media (1-5%) + Mapa 2 Nuboso' };
  } else {
    if (r < 0.34) return { type: 'sunny', rainPct: 0, idealTire: 'soft', idealMap: 'sunny', name: 'Soleado (0% lluvia)', hint: 'Ideal: Mapa 1 Soleado + Gomas Blandas' };
    if (r < 0.64) return { type: 'cloudy', rainPct: 0, idealTire: 'medium', idealMap: 'cloudy', name: 'Nuboso (0% lluvia)', hint: 'Ideal: Mapa 2 Nuboso + Gomas Medias' };
    if (r < 0.84) {
      const rainPct = Math.floor(Math.random() * 5) + 1;
      return { type: 'rain_light', rainPct, idealTire: 'inter', idealMap: 'cloudy', name: `Lluvia Ligera (${rainPct}% intensidad)`, hint: 'Ideal: Lluvia Media (1-5%) + Mapa 2 Nuboso' };
    } else {
      const rainPct = Math.floor(Math.random() * 5) + 6;
      return { type: 'rain_heavy', rainPct, idealTire: 'wet', idealMap: 'desert', name: `Lluvia Intensa (${rainPct}% intensidad)`, hint: 'Ideal: Lluvia Extrema (6-10%) + Mapa 3 Suave' };
    }
  }
}

function updateWeatherUI() {
  const gp = CALENDAR_2026[selectedGpIndex];
  currentWeather = generateRandomWeather(gp);
  weatherPreview.textContent = currentWeather.name;
  weatherHint.textContent = currentWeather.hint;
}

function populateMenus() {
  TEAMS_2026.forEach((t, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = `${t.name} (${t.d1.name} / ${t.d2.name})`;
    teamSelect.appendChild(opt);
  });
  CALENDAR_2026.forEach((c, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = `R${c.round}. ${c.gp}${c.desert ? ' [Desierto]' : ''}`;
    gpSelect.appendChild(opt);
  });
  syncSeatLabels();
  updateWeatherUI();
}

function syncSeatLabels() {
  const team = TEAMS_2026[selectedTeamIndex];
  seat1Btn.textContent = `#${team.d1.num} ${team.d1.name}`;
  seat2Btn.textContent = `#${team.d2.num} ${team.d2.name}`;
  seat1Btn.classList.toggle('selected', selectedSeat === 1);
  seat2Btn.classList.toggle('selected', selectedSeat === 2);
  driverNameInput.value = selectedSeat === 1 ? team.d1.name : team.d2.name;
}

teamSelect.addEventListener('change', (e) => { selectedTeamIndex = parseInt(e.target.value, 10); syncSeatLabels(); });
seat1Btn.addEventListener('click', () => { selectedSeat = 1; syncSeatLabels(); });
seat2Btn.addEventListener('click', () => { selectedSeat = 2; syncSeatLabels(); });
gpSelect.addEventListener('change', (e) => { selectedGpIndex = parseInt(e.target.value, 10); updateWeatherUI(); });
document.getElementById('reroll-weather-btn').addEventListener('click', updateWeatherUI);
populateMenus();
let audioCtx = null, osc = null, gainNode = null;
function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  osc = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.value = 65;
  gainNode.gain.value = 0.04;
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.start();
}
function updateEngineSound(speed, maxSpeed, isDrifting) {
  if (!audioCtx) return;
  const ratio = Math.min(1.2, Math.abs(speed) / maxSpeed);
  const driftPitch = isDrifting ? 22 : 0;
  osc.frequency.setTargetAtTime(60 + ratio * 185 + driftPitch, audioCtx.currentTime, 0.05);
  gainNode.gain.setTargetAtTime(0.03 + ratio * 0.06, audioCtx.currentTime, 0.05);
}

let trackPoints = [], cornerZoneFlags = [], skidMarks = [], rainDrops = [], particles = [], sceneryProps = [];
let asphaltPattern = null;
const TRACK_WIDTH = 174, TOTAL_LAPS = 3;

function createAsphaltPattern() {
  if (asphaltPattern) return asphaltPattern;
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 48; pCanvas.height = 48;
  const pCtx = pCanvas.getContext('2d');
  pCtx.fillStyle = '#2d2d32';
  pCtx.fillRect(0, 0, 48, 48);
  for (let i = 0; i < 420; i++) {
    const gx = (i * 19) % 48;
    const gy = (i * 37) % 48;
    pCtx.fillStyle = (i % 3 === 0) ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.14)';
    pCtx.fillRect(gx, gy, 2, 2);
  }
  asphaltPattern = ctx.createPattern(pCanvas, 'repeat');
  return asphaltPattern;
}

function buildSceneryProps(gp, weather) {
  sceneryProps = [];
  const isDesert = weather.type === 'desert';
  for (let i = 0; i < 36; i++) {
    const angle = (i / 36) * Math.PI * 2 + (gp.seed % 10) * 0.13;
    const ringFactor = 1.18 + ((i * 7) % 5) * 0.08;
    const px = Math.cos(angle) * 700 * ringFactor;
    const py = Math.sin(angle) * 480 * ringFactor;
    if (py < -40 && py > -190 && px > -150 && px < 790) continue;
    sceneryProps.push({
      x: px, y: py,
      radius: 14 + ((i * 11) % 12),
      kind: isDesert ? (i % 2 === 0 ? 'dune' : 'rock') : 'tree'
    });
  }
}

function buildCircuit(gp) {
  skidMarks = []; rainDrops = []; particles = [];
  const pts = [], count = 12, baseRx = 680, baseRy = 460;
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const wave1 = Math.sin(t * 2 + gp.seed * 0.1) * (85 * gp.cornerIntensity);
    const wave2 = Math.cos(t * 3 - gp.seed * 0.07) * (65 * gp.cornerIntensity);
    const flattenStart = (i === 0 || i === 1 || i === count - 1) ? 0.25 : 1;
    pts.push({
      x: Math.cos(t) * baseRx + Math.cos(t) * wave1 * flattenStart,
      y: Math.sin(t) * baseRy + Math.sin(t) * wave2 * flattenStart
    });
  }
  trackPoints = pts;
  cornerZoneFlags = pts.map((_, idx) => {
    const prev = pts[(idx - 1 + pts.length) % pts.length];
    const curr = pts[idx];
    const next = pts[(idx + 1) % pts.length];
    const a1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
    const a2 = Math.atan2(next.y - curr.y, next.x - curr.x);
    let diff = Math.abs(a2 - a1);
    if (diff > Math.PI) diff = Math.PI * 2 - diff;
    return diff > 0.42;
  });

  if (currentWeather.rainPct > 0) {
    const dropCount = currentWeather.rainPct * 18;
    for (let i = 0; i < dropCount; i++) {
      rainDrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        len: 8 + currentWeather.rainPct * 1.4,
        speed: 7 + currentWeather.rainPct * 0.9
      });
    }
  }
  buildSceneryProps(gp, currentWeather);
}

function spawnParticle(x, y, vx, vy, color, radius, life) {
  if (particles.length > 260) particles.shift();
  particles.push({ x, y, vx, vy, color, radius, life, maxLife: life });
}

function updateAndDrawParticles(ctx) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy; p.life--;
    if (p.life <= 0) { particles.splice(i, 1); continue; }
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * (1.2 - alpha * 0.4), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const keys = { left: false, right: false, gas: false, brake: false };
function bindTouch(id, key) {
  const el = document.getElementById(id);
  el.addEventListener('touchstart', (e) => { e.preventDefault(); keys[key] = true; el.classList.add('active'); });
  el.addEventListener('touchend', (e) => { e.preventDefault(); keys[key] = false; el.classList.remove('active'); });
  el.addEventListener('mousedown', () => { keys[key] = true; el.classList.add('active'); });
  el.addEventListener('mouseup', () => { keys[key] = false; el.classList.remove('active'); });
}
bindTouch('btn-left', 'left'); bindTouch('btn-right', 'right'); bindTouch('btn-gas', 'gas'); bindTouch('btn-brake', 'brake');

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
  if (e.key === 'ArrowUp' || e.key === 'w') keys.gas = true;
  if (e.key === 'ArrowDown' || e.key === 's') keys.brake = true;
});
window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
  if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
  if (e.key === 'ArrowUp' || e.key === 'w') keys.gas = false;
  if (e.key === 'ArrowDown' || e.key === 's') keys.brake = false;
});
 class Car {
  constructor(x, y, angle, driverData, teamData, isPlayer = false, tireType = 'medium', engineMap = 'cloudy') {
    this.x = x; this.y = y; this.angle = angle;
    this.vx = 0; this.vy = 0; this.speed = 0;
    this.driverName = driverData.name; this.num = driverData.num; this.teamName = teamData.name;
    this.color = teamData.color; this.accent = teamData.accent; this.pace = teamData.pace;
    this.isPlayer = isPlayer; this.tireType = tireType; this.engineMap = engineMap;
    this.baseMaxSpeed = 9.8; this.tire = 100; this.fuel = 100;
    this.lap = 1; this.currentWaypoint = 1; this.totalProgress = 0;
    this.finished = false; this.isDrifting = false; this.braking = false; this.slipFactor = 0;
  }

  getInCornerZone() {
    return cornerZoneFlags[this.currentWaypoint] || cornerZoneFlags[(this.currentWaypoint - 1 + cornerZoneFlags.length) % cornerZoneFlags.length];
  }

  evaluateSetup(weather) {
    const tireSpec = TIRE_SPECS[this.tireType];
    const mapSpec = ENGINE_MAPS[this.engineMap];
    const isIdealTire = (this.tireType === weather.idealTire);
    const isIdealMap = (this.engineMap === weather.idealMap);

    let gripMod = tireSpec.baseGrip;
    let speedMod = tireSpec.baseSpeed * mapSpec.power;
    let wearMultiplier = 1.0;

    if (!isIdealTire) { wearMultiplier *= 2.15; gripMod *= 0.85; speedMod *= 0.94; }
    if (weather.rainPct > 0 && (this.tireType === 'soft' || this.tireType === 'medium' || this.tireType === 'hard')) {
      gripMod *= (0.68 - weather.rainPct * 0.015); speedMod *= 0.82; wearMultiplier *= 1.5;
    } else if (weather.rainPct === 0 && (this.tireType === 'inter' || this.tireType === 'wet')) {
      wearMultiplier *= 2.8; speedMod *= 0.88;
    } else if (weather.rainPct >= 6 && this.tireType === 'inter') {
      gripMod *= 0.78; wearMultiplier *= 1.9;
    } else if (weather.rainPct >= 1 && weather.rainPct <= 5 && this.tireType === 'wet') {
      wearMultiplier *= 2.1; speedMod *= 0.91;
    }

    if (!isIdealMap) { wearMultiplier *= 1.35; gripMod *= 0.94; } else { gripMod *= 1.03; }

    return {
      gripMod, speedMod,
      wearRate: tireSpec.baseWear * wearMultiplier,
      fuelBurn: mapSpec.fuelBurn,
      isSuboptimal: (!isIdealTire || !isIdealMap)
    };
  }

  update(gp, weather) {
    if (this.finished) {
      this.vx *= 0.94; this.vy *= 0.94; this.x += this.vx; this.y += this.vy;
      this.speed = Math.hypot(this.vx, this.vy);
      return;
    }

    const setup = this.evaluateSetup(weather);
    const tireHealthFactor = 0.42 + (this.tire / 100) * 0.58;
    const fuelFactor = 1 - (this.fuel / 100) * 0.06;
    const inCornerZone = this.getInCornerZone();
    const zoneGripMultiplier = inCornerZone ? (0.76 / gp.cornerIntensity) : 1.0;
    const effectiveMaxSpeed = this.baseMaxSpeed * tireHealthFactor * fuelFactor * gp.topSpeedScale * this.pace * setup.speedMod;

    let steerInput = 0, throttleInput = 0, brakingInput = 0;

    if (this.isPlayer) {
      if (keys.left) steerInput -= 1;
      if (keys.right) steerInput += 1;
      if (keys.gas && this.fuel > 0) throttleInput = 1;
      if (keys.brake) brakingInput = 1;
    } else {
      const target = trackPoints[this.currentWaypoint];
      const targetAngle = Math.atan2(target.y - this.y, target.x - this.x);
      let diff = targetAngle - this.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      steerInput = Math.max(-1, Math.min(1, diff * 2.4));
      const cornerSlowdown = inCornerZone ? 0.72 : (Math.abs(diff) > 0.45 ? 0.78 : 1.0);
      if (this.speed < effectiveMaxSpeed * cornerSlowdown) throttleInput = 1;
      else if (this.speed > effectiveMaxSpeed * cornerSlowdown * 1.12) brakingInput = 0.6;
    }

    this.braking = brakingInput > 0.2;

    const forwardX = Math.cos(this.angle), forwardY = Math.sin(this.angle);
    const rightX = -forwardY, rightY = forwardX;
    let forwardVel = this.vx * forwardX + this.vy * forwardY;
    let lateralVel = this.vx * rightX + this.vy * rightY;

    if (throttleInput > 0) forwardVel += 0.19 * setup.gripMod * (inCornerZone ? 0.92 : 1.0);
    if (brakingInput > 0) forwardVel -= 0.28 * Math.min(1.05, setup.gripMod);
    if (throttleInput === 0 && brakingInput === 0) forwardVel *= 0.975;
    forwardVel = Math.max(-2.5, Math.min(effectiveMaxSpeed, forwardVel));

    if (Math.abs(forwardVel) > 0.35) {
      const speedRatio = Math.abs(forwardVel) / this.baseMaxSpeed;
      const turnRate = 0.048 * tireHealthFactor * Math.min(1.08, setup.gripMod) * (forwardVel >= 0 ? 1 : -1);
      this.angle += steerInput * turnRate;
      lateralVel += steerInput * speedRatio * (inCornerZone ? 0.46 * gp.cornerIntensity : 0.22);
      if (brakingInput > 0 && Math.abs(steerInput) > 0 && speedRatio > 0.55) lateralVel += steerInput * 0.28;
    }

    const lateralGrip = Math.max(0.74, Math.min(0.95, 0.91 * tireHealthFactor * setup.gripMod * zoneGripMultiplier));
    lateralVel *= lateralGrip;
    this.slipFactor = Math.abs(lateralVel);
    this.isDrifting = this.slipFactor > 1.32 && Math.abs(forwardVel) > 3.1;

    const nfx = Math.cos(this.angle), nfy = Math.sin(this.angle);
    const nrx = -nfy, nry = nfx;
    this.vx = nfx * forwardVel + nrx * lateralVel;
    this.vy = nfy * forwardVel + nry * lateralVel;
    this.x += this.vx; this.y += this.vy;
    this.speed = Math.hypot(this.vx, this.vy);

    if (this.isDrifting) {
      if (skidMarks.length < 480) {
        skidMarks.push({ x: this.x - nfx * 12, y: this.y - nfy * 12, angle: this.angle, alpha: Math.min(0.55, this.slipFactor * 0.14) });
      }
      spawnParticle(this.x - nfx * 14 + nrx * 8, this.y - nfy * 14 + nry * 8, -this.vx * 0.15, -this.vy * 0.15, 'rgba(220,220,220,0.45)', 3.2, 14);
    }

    if (weather.rainPct > 0 && this.speed > 2.5 && Math.random() < 0.65) {
      spawnParticle(
        this.x - nfx * 18 + (Math.random() - 0.5) * 14,
        this.y - nfy * 18 + (Math.random() - 0.5) * 14,
        -this.vx * 0.25 + (Math.random() - 0.5) * 1.2,
        -this.vy * 0.25 + (Math.random() - 0.5) * 1.2,
        'rgba(215, 238, 255, 0.65)',
        2.5 + weather.rainPct * 0.25,
        12
      );
    }

    if (this.speed > 1.2) {
      const driftPenalty = this.isDrifting ? 2.1 : 1.0;
      const zoneWear = inCornerZone ? 1.2 : 1.0;
      this.tire = Math.max(0, this.tire - setup.wearRate * driftPenalty * zoneWear);
      this.fuel = Math.max(0, this.fuel - setup.fuelBurn);
    }

    const p0 = trackPoints[0], p1 = trackPoints[1];
    const pitX = (p0.x + p1.x) * 0.5, pitY = (p0.y + p1.y) * 0.5 - 105;
    if (this.isPlayer) {
      const pitMsg = document.getElementById('pit-msg');
      if (Math.hypot(this.x - pitX, this.y - pitY) < 140 && this.speed < 4.0) {
        pitMsg.style.display = 'block';
        this.tireType = weather.idealTire;
        this.engineMap = weather.idealMap;
        this.tire = Math.min(100, this.tire + 1.0);
        this.fuel = Math.min(100, this.fuel + 1.1);
      } else {
        pitMsg.style.display = 'none';
      }
    }

    const wp = trackPoints[this.currentWaypoint];
    if (Math.hypot(wp.x - this.x, wp.y - this.y) < 195) {
      this.currentWaypoint = (this.currentWaypoint + 1) % trackPoints.length;
      this.totalProgress++;
      if (this.currentWaypoint === 1) {
        this.lap++;
        if (this.lap > TOTAL_LAPS) {
          this.finished = true;
          if (this.isPlayer) endRace();
        }
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Sombra aerodinámica
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(2, 3, 23, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Brazos de suspensión
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(10, 0); ctx.lineTo(11, -11);
    ctx.moveTo(10, 0); ctx.lineTo(11, 11);
    ctx.moveTo(-11, 0); ctx.lineTo(-12, -12);
    ctx.moveTo(-11, 0); ctx.lineTo(-12, 12);
    ctx.stroke();

    // 4 ruedas con banda del compuesto activo
    const tireColor = TIRE_SPECS[this.tireType].color;
    const wheels = [
      { x: -15, y: -13, w: 11, h: 5 },
      { x: -15, y: 8,   w: 11, h: 5 },
      { x: 8,   y: -12, w: 10, h: 4.5 },
      { x: 8,   y: 7.5, w: 10, h: 4.5 }
    ];
    wheels.forEach(wh => {
      ctx.fillStyle = '#121214';
      ctx.fillRect(wh.x, wh.y, wh.w, wh.h);
      ctx.fillStyle = tireColor;
      ctx.fillRect(wh.x + 3, wh.y, 4, 1.5);
      ctx.fillRect(wh.x + 3, wh.y + wh.h - 1.5, 4, 1.5);
    });

    // Suelo y pontones esculpidos con degradado
    const bodyGrad = ctx.createLinearGradient(0, -8, 0, 8);
    bodyGrad.addColorStop(0, this.color);
    bodyGrad.addColorStop(0.5, '#ffffff');
    bodyGrad.addColorStop(1, this.color);

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(23, 0);
    ctx.lineTo(12, -4);
    ctx.lineTo(3, -8.5);
    ctx.lineTo(-17, -7.5);
    ctx.lineTo(-17, 7.5);
    ctx.lineTo(3, 8.5);
    ctx.lineTo(12, 4);
    ctx.closePath();
    ctx.fill();

    // Franja central de escudería
    ctx.fillStyle = this.accent;
    ctx.fillRect(-10, -3.5, 16, 7);

    // Alerón delantero multi-plano y trasero
    ctx.fillStyle = '#1e2026';
    ctx.fillRect(19, -11, 4, 22);
    ctx.fillStyle = this.color;
    ctx.fillRect(21, -11, 2, 22);

    ctx.fillStyle = '#1e2026';
    ctx.fillRect(-20, -10, 4.5, 20);

    // Luz trasera LED de lluvia / frenada
    if (this.braking || currentWeather.rainPct > 0) {
      const blink = Math.floor(Date.now() / 120) % 2 === 0;
      ctx.fillStyle = blink ? '#ff1e1e' : '#7a0808';
      ctx.fillRect(-21.5, -2.5, 2, 5);
    }

    // Halo de seguridad y casco del piloto
    ctx.strokeStyle = '#2b2d34';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 5.2, -1.1, 1.1);
    ctx.stroke();

    ctx.fillStyle = this.isPlayer ? '#ffd000' : '#ffffff';
    ctx.beginPath();
    ctx.arc(-1, 0, 3.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Etiqueta limpia con dorsal y apellido
    ctx.save();
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0,0,0,0.68)';
    ctx.fillRect(this.x - 28, this.y - 28, 56, 13);
    ctx.fillStyle = this.isPlayer ? '#ffcc00' : '#fff';
    ctx.fillText(`${this.num} ${this.driverName.split(' ').pop()}`, this.x, this.y - 18);
    ctx.restore();
  }
}
  let cars = [], player = null, gameRunning = false, activeGp = CALENDAR_2026[0], cameraZoom = 1.0;

function buildFullGrid2026(customPlayerName) {
  const roster = [];
  TEAMS_2026.forEach((team, tIdx) => {
    const isP1 = (tIdx === selectedTeamIndex && selectedSeat === 1);
    const isP2 = (tIdx === selectedTeamIndex && selectedSeat === 2);
    roster.push({ driver: { num: team.d1.num, name: isP1 && customPlayerName ? customPlayerName : team.d1.name }, team, isPlayer: isP1 });
    roster.push({ driver: { num: team.d2.num, name: isP2 && customPlayerName ? customPlayerName : team.d2.name }, team, isPlayer: isP2 });
  });
  return roster;
}

function setupRace() {
  activeGp = CALENDAR_2026[selectedGpIndex];
  buildCircuit(activeGp);
  cameraZoom = 1.0;
  const customName = driverNameInput.value.trim();
  const chosenTire = tireSelect.value;
  const chosenMap = mapSelect.value;
  const roster = buildFullGrid2026(customName);

  const p0 = trackPoints[0], p1 = trackPoints[1];
  const startAngle = Math.atan2(p1.y - p0.y, p1.x - p0.x);

  cars = roster.map((entry, idx) => {
    const row = Math.floor(idx / 2);
    const side = (idx % 2 === 0) ? -1 : 1;
    const backOffset = 45 + row * 38;
    const laneOffset = side * 26;
    const bx = p0.x - Math.cos(startAngle) * backOffset - Math.sin(startAngle) * laneOffset;
    const by = p0.y - Math.sin(startAngle) * backOffset + Math.cos(startAngle) * laneOffset;
    return new Car(bx, by, startAngle, entry.driver, entry.team, entry.isPlayer, entry.isPlayer ? chosenTire : currentWeather.idealTire, entry.isPlayer ? chosenMap : currentWeather.idealMap);
  });

  player = cars.find(c => c.isPlayer) || cars[0];
  document.getElementById('hud-driver').innerText = `${player.num} · ${player.driverName}`;
  document.getElementById('hud-gp').innerText = `R${activeGp.round} ${activeGp.gp}`;
  document.getElementById('weather-hud').innerText = currentWeather.name;
}

function drawScenery(weather) {
  const isWet = weather.rainPct > 0;
  sceneryProps.forEach(prop => {
    ctx.save();
    ctx.translate(prop.x, prop.y);
    if (prop.kind === 'tree') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.beginPath(); ctx.arc(6, 7, prop.radius, 0, Math.PI * 2); ctx.fill();
      const grad = ctx.createRadialGradient(-4, -4, 2, 0, 0, prop.radius);
      grad.addColorStop(0, isWet ? '#2c5e28' : '#3d8234');
      grad.addColorStop(1, isWet ? '#142b12' : '#1b3d17');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(0, 0, prop.radius, 0, Math.PI * 2); ctx.fill();
    } else if (prop.kind === 'dune') {
      ctx.fillStyle = 'rgba(112, 82, 46, 0.55)';
      ctx.beginPath(); ctx.ellipse(0, 0, prop.radius * 1.6, prop.radius * 0.85, 0.2, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = '#6e5842';
      ctx.beginPath(); ctx.arc(0, 0, prop.radius * 0.75, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  });
}

function drawGrandstand(p0, p1, angle01) {
  ctx.save();
  ctx.translate((p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5 - 155);
  ctx.rotate(angle01);
  ctx.fillStyle = '#22252c'; ctx.fillRect(-190, -24, 380, 26);
  ctx.fillStyle = '#e10600'; ctx.fillRect(-190, -28, 380, 5);
  for (let row = 0; row < 3; row++) {
    for (let col = -180; col < 180; col += 12) {
      ctx.fillStyle = ((col + row) % 3 === 0) ? '#ffcc00' : '#d8dce6';
      ctx.fillRect(col, -19 + row * 6, 6, 4);
    }
  }
  ctx.restore();
}

function drawTrack() {
  ctx.fillStyle = currentWeather.type === 'desert' ? '#8c6d46' : (currentWeather.rainPct > 0 ? '#1b3819' : '#254d22');
  ctx.fillRect(-2200, -2200, 4600, 4600);

  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = currentWeather.type === 'desert' ? '#a68558' : '#4a4e54';
  ctx.lineWidth = TRACK_WIDTH + 44; drawTrackPath(); ctx.stroke();

  skidMarks.forEach(s => {
    ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(s.angle);
    ctx.fillStyle = `rgba(12, 12, 12, ${s.alpha})`;
    ctx.fillRect(-6, -11, 12, 4); ctx.fillRect(-6, 7, 12, 4);
    ctx.restore();
  });

  const p0 = trackPoints[0], p1 = trackPoints[1];
  const angle01 = Math.atan2(p1.y - p0.y, p1.x - p0.x);
  ctx.save();
  ctx.translate((p0.x + p1.x) * 0.5, (p0.y + p1.y) * 0.5 - 105);
  ctx.rotate(angle01);
  ctx.fillStyle = 'rgba(255, 204, 0, 0.32)'; ctx.fillRect(-160, -22, 320, 44);
  ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 2; ctx.strokeRect(-160, -22, 320, 44);
  ctx.restore();

  ctx.strokeStyle = '#f5f5f5'; ctx.lineWidth = TRACK_WIDTH + 18; drawTrackPath(); ctx.stroke();
  ctx.setLineDash([24, 24]); ctx.strokeStyle = '#e10600'; ctx.lineWidth = TRACK_WIDTH + 18; drawTrackPath(); ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = createAsphaltPattern() || '#323236';
  ctx.lineWidth = TRACK_WIDTH; drawTrackPath(); ctx.stroke();

  if (currentWeather.rainPct > 0) {
    ctx.strokeStyle = 'rgba(130, 185, 255, 0.14)';
    ctx.lineWidth = TRACK_WIDTH; drawTrackPath(); ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(10, 10, 12, 0.24)';
  ctx.lineWidth = TRACK_WIDTH * 0.36; drawTrackPath(); ctx.stroke();

  cornerZoneFlags.forEach((isHeavy, idx) => {
    if (!isHeavy) return;
    const pt = trackPoints[idx];
    ctx.beginPath(); ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 204, 0, 0.18)'; ctx.fill();
  });

  ctx.save();
  ctx.translate(p0.x + Math.cos(angle01) * 35, p0.y + Math.sin(angle01) * 35);
  ctx.rotate(angle01);
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#fff' : '#111';
    ctx.fillRect(-7, -TRACK_WIDTH / 2 + i * (TRACK_WIDTH / 8), 14, TRACK_WIDTH / 8);
  }
  ctx.restore();

  drawGrandstand(p0, p1, angle01);
  drawScenery(currentWeather);
}

function drawRainOverlay() {
  if (currentWeather.rainPct <= 0) return;
  ctx.save(); ctx.strokeStyle = 'rgba(170, 215, 255, 0.45)'; ctx.lineWidth = 1.4; ctx.beginPath();
  rainDrops.forEach(d => {
    ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 3, d.y + d.len);
    d.x -= 2; d.y += d.speed;
    if (d.y > canvas.height) { d.y = -10; d.x = Math.random() * canvas.width; }
    if (d.x < 0) d.x = canvas.width;
  });
  ctx.stroke(); ctx.restore();
}

function drawTrackPath() {
  ctx.beginPath(); ctx.moveTo(trackPoints[0].x, trackPoints[0].y);
  for (let i = 1; i < trackPoints.length; i++) ctx.lineTo(trackPoints[i].x, trackPoints[i].y);
  ctx.closePath();
}

function drawMinimap() {
  if (!miniCtx || trackPoints.length === 0) return;
  miniCtx.clearRect(0, 0, miniCanvas.width, miniCanvas.height);
  const scaleX = 0.042, scaleY = 0.042, ox = 44, oy = 34;

  miniCtx.strokeStyle = 'rgba(255,255,255,0.55)';
  miniCtx.lineWidth = 2.2;
  miniCtx.beginPath();
  trackPoints.forEach((pt, idx) => {
    const mx = ox + pt.x * scaleX;
    const my = oy + pt.y * scaleY;
    if (idx === 0) miniCtx.moveTo(mx, my); else miniCtx.lineTo(mx, my);
  });
  miniCtx.closePath();
  miniCtx.stroke();

  cars.forEach(c => {
    miniCtx.fillStyle = c.isPlayer ? '#ffcc00' : c.color;
    miniCtx.beginPath();
    miniCtx.arc(ox + c.x * scaleX, oy + c.y * scaleY, c.isPlayer ? 3.2 : 1.8, 0, Math.PI * 2);
    miniCtx.fill();
  });
}

function updateHUD() {
  const sorted = [...cars].sort((a, b) => {
    if (b.totalProgress !== a.totalProgress) return b.totalProgress - a.totalProgress;
    const wpA = trackPoints[a.currentWaypoint], wpB = trackPoints[b.currentWaypoint];
    return Math.hypot(wpA.x - a.x, wpA.y - a.y) - Math.hypot(wpB.x - b.x, wpB.y - b.y);
  });
  const rank = sorted.indexOf(player) + 1;

  const tireSpec = TIRE_SPECS[player.tireType];
  const mapSpec = ENGINE_MAPS[player.engineMap];
  const setupCheck = player.evaluateSetup(currentWeather);

  document.getElementById('pos-val').innerText = `${rank}/${cars.length}`;
  document.getElementById('lap-val').innerText = `${Math.min(player.lap, TOTAL_LAPS)}/${TOTAL_LAPS}`;
  document.getElementById('speed-val').innerText = Math.round(player.speed * 34);
  document.getElementById('hud-tire-type').innerText = tireSpec.label;
  document.getElementById('hud-tire-type').style.color = tireSpec.color;
  document.getElementById('tire-bar').style.width = `${player.tire}%`;
  document.getElementById('tire-bar').style.background = tireSpec.color;
  document.getElementById('hud-map-type').innerText = mapSpec.label;
  document.getElementById('fuel-bar').style.width = `${player.fuel}%`;

  const driftBadge = document.getElementById('drift-badge');
  if (player.isDrifting) driftBadge.innerText = 'DERRAPE · DESGASTE ALTO';
  else if (setupCheck.isSuboptimal) driftBadge.innerText = 'ALERTA: COMPUESTO/MAPA NO IDEAL';
  else driftBadge.innerText = player.getInCornerZone() ? 'ZONA DE CURVA / FRENADA' : '';

  drawMinimap();
  return rank;
}

function endRace() {
  gameRunning = false;
  const rank = updateHUD();
  if (gainNode) gainNode.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
  document.getElementById('hud').style.display = 'none';
  document.getElementById('controls').style.display = 'none';
  document.getElementById('setup-panel').style.display = 'none';
  document.getElementById('overlay-title').innerText = rank === 1 ? '¡VICTORIA!' : `POSICIÓN FINAL: #${rank}`;
  document.getElementById('overlay-desc').innerText = `${player.driverName} (${player.teamName}) completó el ${activeGp.gp} bajo clima ${currentWeather.name}.`;
  document.getElementById('start-btn').innerText = 'VOLVER AL MENÚ';
  document.getElementById('overlay').style.display = 'flex';
}

function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  cars.forEach(car => car.update(activeGp, currentWeather));
  updateEngineSound(player.speed, player.baseMaxSpeed, player.isDrifting);
  updateHUD();

  const targetZoom = 1.04 - Math.min(0.16, (player.speed / player.baseMaxSpeed) * 0.15);
  cameraZoom += (targetZoom - cameraZoom) * 0.08;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(cameraZoom, cameraZoom);
  ctx.translate(-player.x, -player.y);
  drawTrack();
  cars.forEach(car => car.draw(ctx));
  updateAndDrawParticles(ctx);
  ctx.restore();

  drawRainOverlay();
  requestAnimationFrame(gameLoop);
}

document.getElementById('start-btn').addEventListener('click', () => {
  const setupPanel = document.getElementById('setup-panel');
  if (setupPanel.style.display === 'none') {
    setupPanel.style.display = 'block';
    updateWeatherUI();
    document.getElementById('overlay-title').innerText = 'F1 PRO MAX';
    document.getElementById('overlay-desc').innerText = 'Si eliges un neumático o mapa motor que no coincide con el clima, sufrirás mayor desgaste de gomas y pérdida de agarre. En Boxes se monta automáticamente el compuesto ideal para el clima actual.';
    document.getElementById('start-btn').innerText = 'SALIR A PISTA';
    return;
  }
  initAudio();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  setupRace();
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('hud').style.display = 'flex';
  document.getElementById('controls').style.display = 'flex';
  gameRunning = true;
  gameLoop();
});
      
