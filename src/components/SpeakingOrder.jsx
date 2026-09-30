import { useEffect, useRef, useState } from 'react';
import { Mic } from 'lucide-react';
import { prefersReducedMotion } from '../lib';
import { PlayerAvatar } from '../avatars';
import { sounds } from '../sounds';

// Roulette che gira sui nomi e si ferma su chi parla per primo (il primo della lista),
// poi mostra il giro completo e chiama onDone. Il genitore la rimonta a ogni round con una key.
export default function SpeakingOrder({ players, onDone }) {
  const count = players.length;
  const [spinStep, setSpinStep] = useState(() => (prefersReducedMotion() ? null : 0));
  const done = spinStep === null;

  // Sempre l'ultima versione di onDone, senza far ripartire la roulette
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    if (prefersReducedMotion() || count === 0) return;
    // Un multiplo esatto del numero di giocatori: la roulette si ferma sempre sul primo
    const totalSteps = count * Math.max(3, Math.ceil(22 / count));
    let step = 0;
    let timeout;
    const spin = () => {
      step += 1;
      if (step >= totalSteps) {
        setSpinStep(null);
        sounds.ding();
        onDoneRef.current?.();
        return;
      }
      setSpinStep(step);
      sounds.tick();
      // Rallenta verso la fine, come una ruota vera
      timeout = setTimeout(spin, 45 + Math.pow(step / totalSteps, 3) * 380);
    };
    timeout = setTimeout(spin, 350);
    return () => clearTimeout(timeout);
  }, [count]);

  if (count === 0) return null;
  const shown = players[done ? 0 : spinStep % count];

  return (
    <section className="glass rounded-[2rem] p-5 sm:p-6 text-center">
      <div className="font-mono text-[11px] sm:text-xs tracking-[0.3em] uppercase text-violet-300/80 flex items-center justify-center gap-2">
        <Mic size={14} /> Chi inizia a parlare
      </div>

      <div className={`slot-window relative my-4 h-20 sm:h-24 overflow-hidden rounded-2xl border flex items-center justify-center transition-colors duration-500 ${
        done ? 'bg-violet-500/15 border-violet-400/40 shadow-[0_0_40px_-10px_rgba(167,139,250,0.7)]' : 'bg-black/30 border-white/10'
      }`}>
        <div
          key={done ? 'done' : spinStep}
          className={`flex items-center gap-3 px-4 max-w-full ${done ? 'animate-bounce-in' : 'animate-slot'}`}
        >
          <PlayerAvatar name={shown.name} className="w-12 h-12 sm:w-14 sm:h-14" />
          <span className="font-display font-black text-2xl sm:text-3xl truncate">{shown.name}</span>
        </div>
      </div>

      {done && (
        <ol className="flex flex-wrap justify-center gap-2 animate-fadeIn">
          {players.map((p, i) => (
            <li
              key={p.id}
              className={`flex items-center gap-2 text-sm sm:text-base font-semibold px-3 py-1.5 rounded-full border ${
                i === 0 ? 'bg-violet-500/20 border-violet-400/40' : 'bg-white/5 border-white/10 text-white/75'
              }`}
            >
              <span className="font-mono text-xs text-violet-300">{i + 1}</span>
              {p.name}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
