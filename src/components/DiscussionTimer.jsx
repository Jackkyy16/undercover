import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { buzz } from '../lib';
import { sounds } from '../sounds';

const PRESETS = [30, 60, 90, 120];
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

// Conto alla rovescia per la discussione. Il genitore lo rimonta a ogni round con una key.
export default function DiscussionTimer({ duration, onDurationChange }) {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const endAt = useRef(0);
  const lastShown = useRef(duration);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      if (left === lastShown.current) return;
      lastShown.current = left;
      setRemaining(left);
      if (left === 0) {
        setRunning(false);
        sounds.alarm();
        buzz([300, 100, 300, 100, 300]);
      } else if (left <= 10) {
        sounds.tick();
      }
    }, 200);
    return () => clearInterval(interval);
  }, [running]);

  const start = () => {
    const from = remaining === 0 ? duration : remaining;
    endAt.current = Date.now() + from * 1000;
    lastShown.current = from;
    setRemaining(from);
    setRunning(true);
  };

  const reset = () => {
    setRunning(false);
    setRemaining(duration);
    lastShown.current = duration;
  };

  const choosePreset = (seconds) => {
    onDurationChange(seconds);
    setRemaining(seconds);
    lastShown.current = seconds;
  };

  const urgent = remaining <= 10 && remaining > 0 && running;
  const finished = remaining === 0;
  const progress = remaining / duration;

  return (
    <section className={`glass rounded-[2rem] p-4 sm:p-6 flex items-center gap-4 sm:gap-6 ${urgent ? 'animate-urgent' : ''} ${finished ? 'animate-shake border-rose-400/50' : ''}`}>
      <div className="relative shrink-0 w-28 h-28 sm:w-32 sm:h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <defs>
            <linearGradient id="timer-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#a78bfa" />
              <stop offset="1" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke={urgent || finished ? '#fb7185' : 'url(#timer-gradient)'}
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span key={remaining} className={`font-display font-black text-2xl sm:text-3xl ${urgent || finished ? 'text-rose-300' : ''} ${urgent ? 'animate-bounce-in' : ''}`}>
            {formatTime(remaining)}
          </span>
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        <div className="flex items-center gap-2 font-display font-bold text-base sm:text-xl">
          <Timer size={20} className="text-violet-300 shrink-0" />
          {finished ? <span className="text-rose-300">Tempo scaduto!</span> : 'Discussione'}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map(seconds => (
            <button
              key={seconds}
              type="button"
              disabled={running}
              onClick={() => choosePreset(seconds)}
              className={`px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold border transition-colors disabled:opacity-40 ${
                duration === seconds ? 'bg-violet-500/25 border-violet-400/50 text-violet-100' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              {seconds < 60 ? `${seconds}s` : formatTime(seconds)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={running ? () => setRunning(false) : start}
            className="btn-primary flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            {running ? <><Pause size={18} /> Pausa</> : <><Play size={18} fill="currentColor" /> {remaining === duration || finished ? 'Avvia' : 'Riprendi'}</>}
          </button>
          <button type="button" onClick={reset} aria-label="Azzera timer" className="btn-ghost w-11 rounded-xl flex items-center justify-center">
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
