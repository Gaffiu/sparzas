let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function tone(freq, type, duration, vol = 0.12) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(); osc.stop(ctx.currentTime + duration);
}
export function useSound() {
  return {
    playClick: () => tone(700, 'square', 0.06, 0.08),
    playLike: () => { tone(880, 'sine', 0.12); setTimeout(() => tone(1100, 'sine', 0.1), 80); },
    playUpload: () => { tone(400, 'triangle', 0.2); setTimeout(() => tone(600, 'triangle', 0.25), 120); },
  };
}
