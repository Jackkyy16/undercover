import { useEffect } from 'react';
import { Ghost, HelpCircle, Shield, VenetianMask } from 'lucide-react';
import { prefersReducedMotion, roleStyles } from '../lib';
import { PlayerAvatar } from '../avatars';
import { sounds } from '../sounds';

const ROLE_ICONS = { 'Civile': Shield, 'Undercover': VenetianMask, 'Mr. White': Ghost };
const ROLE_BACKS = {
  'Civile': 'bg-emerald-950/80 border-emerald-400/40',
  'Undercover': 'bg-rose-950/80 border-rose-400/40',
  'Mr. White': 'bg-slate-100 border-white text-slate-900',
};
const FIRST_FLIP = 0.8;
const FLIP_GAP = 0.3;

// A fine partita le carte di tutti si girano una alla volta
export default function RoleReveal({ players }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timeouts = players.map((_, i) =>
      setTimeout(() => sounds.whoosh(), (FIRST_FLIP + i * FLIP_GAP) * 1000));
    return () => timeouts.forEach(clearTimeout);
  }, [players]);

  return (
    <section className="glass rounded-[2rem] p-4 sm:p-8 space-y-5 text-left animate-fadeIn" style={{ animationDelay: '0.15s' }}>
      <h3 className="font-display font-bold text-xl sm:text-3xl">Chi era chi</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {players.map((p, i) => {
          const Icon = ROLE_ICONS[p.role];
          return (
            <div key={p.id} className="flip reveal-flip h-36 sm:h-40">
              <div className="flip-inner w-full h-full" style={{ animationDelay: `${FIRST_FLIP + i * FLIP_GAP}s` }}>
                <div className="flip-face card-pattern rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-2 p-3">
                  <PlayerAvatar name={p.name} className="w-12 h-12" />
                  <span className="font-bold truncate max-w-full">{p.name}</span>
                  <HelpCircle size={18} className="text-white/30" />
                </div>
                <div className={`flip-face flip-back rounded-2xl border flex flex-col items-center justify-center gap-1 p-3 text-center ${ROLE_BACKS[p.role]}`}>
                  <Icon size={26} className={p.role === 'Mr. White' ? 'text-slate-700' : roleStyles[p.role].text} />
                  <span className={`font-bold truncate max-w-full ${p.isAlive ? '' : 'line-through opacity-60'}`}>{p.name}</span>
                  <span className={`font-display font-black text-sm ${p.role === 'Mr. White' ? '' : roleStyles[p.role].text}`}>{p.role}</span>
                  <span className={`text-xs truncate max-w-full ${p.role === 'Mr. White' ? 'text-slate-500' : 'text-white/55'}`}>
                    {p.role === 'Mr. White' ? 'nessuna parola' : p.word}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
