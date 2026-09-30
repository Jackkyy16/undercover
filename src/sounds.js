// Effetti sonori sintetizzati con Web Audio: nessun file da scaricare.
// Il contesto audio si crea al primo suono, che parte sempre da un tocco dell'utente.

let ctx = null;
let muted = false;

export const setMuted = (value) => { muted = value; };

const audio = () => {
  if (muted) return null;
  try {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
};

// Una nota con attacco rapido e coda morbida
const tone = ({ freq, type = 'sine', duration = 0.15, volume = 0.15, delay = 0, slideTo }) => {
  const ac = audio();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
};

// Rumore filtrato: fruscii, colpi, rullo di tamburo
const noise = ({ duration = 0.2, volume = 0.2, delay = 0, freq = 1000, q = 1, type = 'bandpass' }) => {
  const ac = audio();
  if (!ac) return;
  const start = ac.currentTime + delay;
  const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * duration), ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  src.connect(filter).connect(gain).connect(ac.destination);
  src.start(start);
};

const arpeggio = (notes, { step = 0.09, type = 'triangle', duration = 0.3, volume = 0.12 } = {}) =>
  notes.forEach((freq, i) => tone({ freq, type, duration, volume, delay: i * step }));

export const sounds = {
  click: () => tone({ freq: 720, type: 'triangle', duration: 0.05, volume: 0.05 }),
  pop: () => tone({ freq: 440, slideTo: 880, type: 'sine', duration: 0.12, volume: 0.12 }),
  remove: () => tone({ freq: 500, slideTo: 220, type: 'sine', duration: 0.15, volume: 0.1 }),
  whoosh: () => noise({ duration: 0.35, volume: 0.25, freq: 1800, q: 0.7 }),
  reveal: () => arpeggio([659, 880, 1175, 1568], { step: 0.07, duration: 0.35, volume: 0.08 }),
  stamp: () => {
    tone({ freq: 140, slideTo: 45, type: 'sine', duration: 0.35, volume: 0.35 });
    noise({ duration: 0.12, volume: 0.3, freq: 400, q: 0.5, type: 'lowpass' });
  },
  tick: () => tone({ freq: 1200, type: 'square', duration: 0.03, volume: 0.04 }),
  ding: () => {
    tone({ freq: 1320, type: 'sine', duration: 0.6, volume: 0.15 });
    tone({ freq: 1980, type: 'sine', duration: 0.5, volume: 0.06, delay: 0.02 });
  },
  alarm: () => [0, 0.25, 0.5].forEach(d => {
    tone({ freq: 880, type: 'square', duration: 0.15, volume: 0.08, delay: d });
    tone({ freq: 660, type: 'square', duration: 0.1, volume: 0.06, delay: d + 0.15 });
  }),
  drumroll: (seconds = 1) => {
    const hits = Math.floor(seconds / 0.045);
    for (let i = 0; i < hits; i++) noise({ duration: 0.05, volume: 0.05 + (i / hits) * 0.12, freq: 220, q: 0.8, delay: i * 0.045 });
  },
  vote: () => arpeggio([523, 784], { step: 0.08, duration: 0.2, volume: 0.1 }),
  fanfare: () => {
    arpeggio([523, 659, 784], { step: 0.12, type: 'sawtooth', duration: 0.25, volume: 0.06 });
    [523, 659, 784, 1047].forEach(f => tone({ freq: f, type: 'triangle', duration: 1.1, volume: 0.07, delay: 0.4 }));
  },
  sneaky: () => arpeggio([392, 370, 349, 330, 523], { step: 0.14, type: 'triangle', duration: 0.25, volume: 0.1 }),
  ghost: () => {
    tone({ freq: 300, slideTo: 900, type: 'sine', duration: 1.2, volume: 0.1 });
    tone({ freq: 450, slideTo: 1350, type: 'sine', duration: 1.2, volume: 0.05, delay: 0.1 });
  },
  party: () => {
    arpeggio([523, 659, 784, 1047, 784, 1047, 1319], { step: 0.1, type: 'square', duration: 0.18, volume: 0.05 });
    [0.8, 1.1, 1.4].forEach(d => noise({ duration: 0.3, volume: 0.15, freq: 3000, q: 0.4, delay: d }));
  },
  shatter: () => {
    noise({ duration: 0.5, volume: 0.25, freq: 4000, q: 0.3, type: 'highpass' });
    arpeggio([1800, 1400, 2200, 1100], { step: 0.04, type: 'triangle', duration: 0.12, volume: 0.05 });
  },
};
