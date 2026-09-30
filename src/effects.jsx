import React, { useState, useEffect, useRef } from 'react';
import { Crown } from 'lucide-react';
import { prefersReducedMotion } from './lib';
import { sounds } from './sounds';

const confettiColors = ['#a78bfa', '#f0abfc', '#fb7185', '#fcd34d', '#34d399', '#22d3ee'];
const confettiPieces = Array.from({ length: 56 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  color: confettiColors[i % confettiColors.length],
  // seconda ondata dopo ~1.4s
  delay: `${(i % 14) * 0.09 + (i >= 28 ? 1.4 : 0)}s`,
  dx: `${((i * 53) % 200) - 100}px`,
  rot: `${((i * 97) % 900) - 450}deg`,
  round: i % 3 === 0,
}));

export function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden="true">
      {confettiPieces.map((p, i) => (
        <span
          key={i}
          className="confetti"
          style={{
            left: p.left,
            background: p.color,
            animationDelay: p.delay,
            '--dx': p.dx,
            '--rot': p.rot,
            ...(p.round && { width: 10, height: 10, borderRadius: 9999 }),
          }}
        />
      ))}
    </div>
  );
}


const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$?!';
const maskText = (text) => text.replace(/\S/g, '#');

// Effetto "decrittazione": le lettere girano a caso e si fissano da sinistra a destra
export function ScrambleText({ text, delay = 0, duration = 900 }) {
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? text : maskText(text)));

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame;
    let start;
    const tick = (now) => {
      start ??= now + delay;
      const progress = Math.max(0, Math.min(1, (now - start) / duration));
      const revealed = Math.floor(progress * text.length);
      setDisplay(text.split('').map((ch, i) => {
        if (i < revealed || ch === ' ') return ch;
        const r = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        return ch === ch.toLowerCase() ? r.toLowerCase() : r;
      }).join(''));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, delay, duration]);

  return <span aria-label={text}>{display}</span>;
}

// Numero che sale da 0 al valore finale
export function CountUp({ value, delay = 0, duration = 1200 }) {
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? value : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame;
    let start;
    const tick = (now) => {
      start ??= now + delay;
      const t = Math.max(0, Math.min(1, (now - start) / duration));
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, delay, duration]);

  return <>{shown}</>;
}

// Inclinazione 3D che segue il mouse, con riflesso di luce
export function Tilt({ children, className = '', glareClassName = '', max = 12 }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    if (e.pointerType !== 'mouse' || prefersReducedMotion()) return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - y) * max}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * max}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
    el.classList.add('is-tilting');
  };

  const handleLeave = () => {
    const el = ref.current;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
    el.classList.remove('is-tilting');
  };

  return (
    <div ref={ref} onPointerMove={handleMove} onPointerLeave={handleLeave} className={`tilt ${className}`}>
      {children}
      <div className={`tilt-glare ${glareClassName}`} aria-hidden="true" />
    </div>
  );
}


// Testo scritto lettera per lettera, con cursore lampeggiante
export function Typewriter({ text, delay = 0, speed = 45 }) {
  const [count, setCount] = useState(() => (prefersReducedMotion() ? text.length : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let interval;
    const timeout = setTimeout(() => {
      let typed = 0;
      interval = setInterval(() => {
        typed += 1;
        setCount(typed);
        if (typed >= text.length) clearInterval(interval);
      }, speed);
    }, delay);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [text, delay, speed]);

  return (
    <span aria-label={text}>
      {text.slice(0, count)}
      <span className="caret" aria-hidden="true" />
    </span>
  );
}

// Fuochi d'artificio: ogni scoppio è un anello di scintille che si allontanano dal centro
const fireworkColors = ['#fcd34d', '#f0abfc', '#67e8f9', '#fb7185', '#a78bfa', '#86efac'];
const fireworkBursts = [
  { x: '18%', y: '22%', delay: 0 },
  { x: '80%', y: '18%', delay: 0.5 },
  { x: '50%', y: '10%', delay: 1.0 },
  { x: '28%', y: '60%', delay: 1.4 },
  { x: '75%', y: '55%', delay: 0.8 },
];

export function Fireworks({ bursts = fireworkBursts, radius = 90 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {bursts.map((b, bi) => (
        <div key={bi} className="firework" style={{ left: b.x, top: b.y }}>
          {Array.from({ length: 14 }, (_, si) => (
            <span
              key={si}
              className="spark"
              style={{
                '--a': `${(360 / 14) * si}deg`,
                '--r': `${radius + (si % 3) * 18}px`,
                '--c': fireworkColors[(bi + si) % fireworkColors.length],
                '--d': `${b.delay}s`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const partyEmojis = ['👑', '🎉', '🥳', '🍾', '✨', '🎊', '💎', '🔥'];
const emojiDrops = Array.from({ length: 18 }, (_, i) => ({
  emoji: partyEmojis[i % partyEmojis.length],
  left: `${(i * 29 + 5) % 100}%`,
  delay: `${(i % 9) * 0.35}s`,
  size: `${1.6 + (i % 4) * 0.5}rem`,
}));

// Festa a schermo intero per l'arrivo del proprietario
export function OwnerParty({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md cursor-pointer overflow-hidden animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-label="È arrivato il proprietario"
    >
      <div className="rays" aria-hidden="true" />
      <Fireworks radius={120} />
      <Confetti />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {emojiDrops.map((d, i) => (
          <span key={i} className="emoji-float" style={{ left: d.left, animationDelay: d.delay, fontSize: d.size }}>
            {d.emoji}
          </span>
        ))}
      </div>

      <div className="relative text-center animate-bounce-in">
        <div className="animate-drop">
          <Crown size={120} strokeWidth={1.4} className="mx-auto text-amber-300 drop-shadow-[0_0_35px_rgba(252,211,77,0.9)] animate-floaty" />
        </div>
        <div className="font-mono text-xs sm:text-sm tracking-[0.35em] uppercase text-amber-200/80 mt-4">
          Attenzione, attenzione
        </div>
        <h2 className="font-display font-black leading-none mt-3 text-[clamp(2.4rem,12vw,6rem)] animate-blur-in" style={{ animationDelay: '0.25s' }}>
          <span className="text-gold">PISELLINO</span>
        </h2>
        <p className="font-display font-bold text-xl sm:text-3xl mt-5 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
          È arrivato il proprietario! 👑
        </p>
        <p className="text-white/45 mt-8 text-sm font-mono tracking-widest uppercase animate-pulse">Tocca per continuare</p>
      </div>
    </div>
  );
}

// Frammenti e crepe quando un giocatore viene eliminato
const deathShards = Array.from({ length: 18 }, (_, i) => ({
  angle: `${i * 20 + (i % 3) * 7}deg`,
  distance: `${60 + ((i * 23) % 70)}px`,
  size: 3 + (i % 4),
  color: ['#fb7185', '#e2e8f0', '#a78bfa', '#94a3b8'][i % 4],
  delay: `${(i % 5) * 0.03}s`,
}));

export function DeathBurst() {
  useEffect(() => {
    if (!prefersReducedMotion()) sounds.shatter();
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <svg className="crack absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
        <polyline points="8,0 14,12 11,20 19,31 16,40" />
        <polyline points="14,12 26,15 33,9" />
        <polyline points="11,20 3,26" />
        <polyline points="19,31 30,34" />
      </svg>
      <div className="absolute left-[10%] top-1/2">
        {deathShards.map((s, i) => (
          <span
            key={i}
            className="shard"
            style={{ '--a': s.angle, '--r': s.distance, width: s.size, height: s.size, background: s.color, animationDelay: s.delay }}
          />
        ))}
      </div>
    </div>
  );
}
