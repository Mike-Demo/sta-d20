// LCARS computer panel sound effects using Web Audio API
// Inspired by the distinctive chirps, beeps, and tones heard on Star Trek bridge consoles

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

/** LCARS panel activation — the classic two-tone "bleep bloop" heard when 
 *  officers interact with a console. A quick high-low chirp pair. */
export function playRollSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Primary chirp pair (the iconic LCARS "di-dit")
  tone(ctx, 1760, now, 0.06, 0.09);          // A6 — sharp high ping
  tone(ctx, 1318, now + 0.07, 0.06, 0.09);   // E6 — resolving lower ping

  // Softer processing trill underneath (data being accessed)
  tone(ctx, 3520, now + 0.15, 0.03, 0.04);
  tone(ctx, 2960, now + 0.19, 0.03, 0.04);
  tone(ctx, 3520, now + 0.23, 0.03, 0.04);
}

/** Successful scan confirmation — the warm double-beep heard when the 
 *  computer confirms a positive result. Two identical tones. */
export function playSuccessSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Classic confirmation double-beep
  tone(ctx, 1480, now, 0.08, 0.1);
  tone(ctx, 1480, now + 0.12, 0.08, 0.1);
}

/** Critical success — the ascending "task complete" trill heard when 
 *  the computer finishes an important operation. Three quick ascending tones. */
export function playCriticalSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Ascending confirmation trill
  tone(ctx, 1175, now, 0.07, 0.1);        // D6
  tone(ctx, 1480, now + 0.08, 0.07, 0.1); // F#6
  tone(ctx, 1760, now + 0.16, 0.12, 0.1); // A6 — held slightly longer

  // Soft harmonic shimmer on top
  tone(ctx, 3520, now + 0.16, 0.15, 0.03);
}

/** Complication — the low-pitched alert tone heard for warnings (not full 
 *  red alert, more like a system caution). A descending two-note warning. */
export function playComplicationSound() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Warning tone pair — descending, slightly buzzy
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "triangle";
  osc1.frequency.setValueAtTime(660, now);
  gain1.gain.setValueAtTime(0.12, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  osc1.connect(gain1).connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.15);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(440, now + 0.18);
  gain2.gain.setValueAtTime(0.12, now + 0.18);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
  osc2.connect(gain2).connect(ctx.destination);
  osc2.start(now + 0.18);
  osc2.stop(now + 0.4);
}
