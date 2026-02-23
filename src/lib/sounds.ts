// Star Trek-style sound effects using Web Audio API

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

/** LCARS scanning/rolling sound — rising chirps */
export function playRollSound() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  for (let i = 0; i < 4; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800 + i * 200, now + i * 0.15);
    osc.frequency.exponentialRampToValueAtTime(1200 + i * 300, now + i * 0.15 + 0.1);
    gain.gain.setValueAtTime(0.08, now + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.12);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 0.12);
  }
}

/** Triumphant ascending chime for critical success */
export function playCriticalSound() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + i * 0.1);
    gain.gain.setValueAtTime(0.12, now + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.3);
  });
}

/** Success confirmation beep */
export function playSuccessSound() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.setValueAtTime(1100, now + 0.08);
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.2);
}

/** Red alert-style descending buzz for complications */
export function playComplicationSound() {
  const ctx = getCtx();
  const now = ctx.currentTime;

  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(400 - i * 60, now + i * 0.18);
    osc.frequency.exponentialRampToValueAtTime(200 - i * 30, now + i * 0.18 + 0.15);
    gain.gain.setValueAtTime(0.06, now + i * 0.18);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.15);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.18);
    osc.stop(now + i * 0.18 + 0.15);
  }
}
