// Lower Decks LCARS computer panel sound effects using Web Audio API
// Smoother, cooler-toned chirps inspired by the Lower Decks animated series

let audioCtx: AudioContext | null = null;
let muted = false;

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean) {
  muted = value;
}

function getCtx(): AudioContext | null {
  if (muted) return null;
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

/** Utility: play a quick tone */
function tone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  volume = 0.1,
  type: OscillatorType = "sine"
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.setValueAtTime(volume, startTime + duration * 0.7);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

/** LCARS panel activation — a smooth, liquid two-tone chirp.
 *  Lower Decks panels have a softer, rounder sound. */
export function playRollSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Softer chirp pair — rounder than TNG
  tone(ctx, 1320, now, 0.08, 0.08);          // E6
  tone(ctx, 990, now + 0.09, 0.08, 0.08);    // B5

  // Gentle processing ripple
  tone(ctx, 2640, now + 0.18, 0.04, 0.03);
  tone(ctx, 2200, now + 0.23, 0.04, 0.03);
  tone(ctx, 2640, now + 0.28, 0.04, 0.03);
}

/** Successful scan — warm confirmation beeps */
export function playSuccessSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  tone(ctx, 1100, now, 0.1, 0.09);
  tone(ctx, 1100, now + 0.14, 0.1, 0.09);
}

/** Critical success — smooth ascending trill */
export function playCriticalSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  tone(ctx, 880, now, 0.08, 0.09);         // A5
  tone(ctx, 1100, now + 0.09, 0.08, 0.09); // C#6
  tone(ctx, 1320, now + 0.18, 0.14, 0.09); // E6

  // Soft harmonic shimmer
  tone(ctx, 2640, now + 0.18, 0.16, 0.025);
}

/** Complication — descending warning, slightly warmer */
export function playComplicationSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "triangle";
  osc1.frequency.setValueAtTime(550, now);
  gain1.gain.setValueAtTime(0.11, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
  osc1.connect(gain1).connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.16);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(370, now + 0.2);
  gain2.gain.setValueAtTime(0.11, now + 0.2);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start(now + 0.2);
  osc2.stop(now + 0.42);
}
