import { useContext } from 'react';
import { Check, X } from 'lucide-react';
import { AvatarContext, SPIES, spyFor } from './avatarData';

const INK = '#1c1917';

// --- PARTI DEL PERSONAGGIO (viewBox 64x64, testa centrata in 32,30) ---

function HairBack({ hair }) {
  if (!hair) return null;
  if (hair.style === 'long') {
    return <path d="M17 30 Q16 13 32 13 Q48 13 47 30 L49 50 Q43 48 41 40 L23 40 Q21 48 15 50 Z" fill={hair.color} />;
  }
  if (hair.style === 'afro') {
    return (
      <g fill={hair.color}>
        <circle cx="32" cy="22" r="15" />
        <circle cx="19" cy="28" r="7" />
        <circle cx="45" cy="28" r="7" />
        <circle cx="22" cy="15" r="7" />
        <circle cx="42" cy="15" r="7" />
      </g>
    );
  }
  if (hair.style === 'bun') return <circle cx="32" cy="13" r="5.5" fill={hair.color} />;
  return null;
}

function HairFront({ hair }) {
  if (!hair) return null;
  const { style, color } = hair;
  if (style === 'bald') {
    return <path d="M19 32 Q19 27 21 25 L21 31Z M45 32 Q45 27 43 25 L43 31Z" fill={color} />;
  }
  if (style === 'afro') return null;
  if (style === 'mohawk') {
    return <path d="M27 21 L27.5 9 L30.5 18 L32 6 L33.5 18 L36.5 9 L37 21 Q32 19 27 21Z" fill={color} />;
  }
  if (style === 'slick') {
    return <path d="M19 29 Q18 16 32 16 Q46 16 45 29 Q44 23 38 21 Q30 19 26 22 Q21 24 19 29Z" fill={color} />;
  }
  if (style === 'bob') {
    return <path d="M18 38 Q17 16 32 16 Q47 16 46 38 Q43 37 42.5 30 Q41 22 32 21.5 Q23 22 21.5 30 Q21 37 18 38Z" fill={color} />;
  }
  // short, long, bun: frangia sopra la fronte
  return <path d="M19 29 Q18 16 32 16 Q46 16 45 29 Q43 22 32 21.5 Q21 22 19 29Z" fill={color} />;
}

function Eyes({ eyes = { type: 'dots' } }) {
  const { type, color, frame } = eyes;
  const pupils = (
    <g fill={INK}>
      <circle cx="27" cy="30" r="1.8" />
      <circle cx="37" cy="30" r="1.8" />
    </g>
  );
  switch (type) {
    case 'shades':
      return (
        <g>
          <rect x="19.5" y="26.5" width="11" height="7" rx="3" fill={color ?? '#0c0a09'} stroke={frame} strokeWidth={frame ? 1.2 : 0} />
          <rect x="33.5" y="26.5" width="11" height="7" rx="3" fill={color ?? '#0c0a09'} stroke={frame} strokeWidth={frame ? 1.2 : 0} />
          <rect x="30" y="28.2" width="4" height="1.6" fill={frame ?? '#0c0a09'} />
          <rect x="21.5" y="27.8" width="3.5" height="1.4" rx="0.7" fill="#fff" opacity="0.45" />
          <rect x="35.5" y="27.8" width="3.5" height="1.4" rx="0.7" fill="#fff" opacity="0.45" />
        </g>
      );
    case 'round':
      return (
        <g>
          <g fill="rgba(255,255,255,0.3)" stroke={INK} strokeWidth="1.3">
            <circle cx="27" cy="30" r="4.3" />
            <circle cx="37" cy="30" r="4.3" />
          </g>
          <path d="M31.3 30 L32.7 30" stroke={INK} strokeWidth="1.3" />
          {pupils}
        </g>
      );
    case 'mask':
      return (
        <g>
          <path d="M17.5 27.5 Q32 23 46.5 27.5 L45.5 33.5 Q32 30.5 18.5 33.5 Z" fill={color ?? INK} />
          <ellipse cx="27" cy="30" rx="2.8" ry="2.1" fill="#fff" />
          <ellipse cx="37" cy="30" rx="2.8" ry="2.1" fill="#fff" />
          <circle cx="27.4" cy="30.2" r="1.3" fill={INK} />
          <circle cx="37.4" cy="30.2" r="1.3" fill={INK} />
        </g>
      );
    case 'monocle':
      return (
        <g>
          {pupils}
          <circle cx="37" cy="30" r="4.2" fill="rgba(255,255,255,0.25)" stroke="#eab308" strokeWidth="1.4" />
          <path d="M41 31.5 Q44.5 39 40.5 46" stroke="#eab308" strokeWidth="0.9" fill="none" />
          <path d="M23.5 27 L30 27.5" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
        </g>
      );
    case 'patch':
      return (
        <g>
          <circle cx="37" cy="30" r="1.8" fill={INK} />
          <path d="M18.5 23.5 L45.5 33" stroke={INK} strokeWidth="1.2" />
          <ellipse cx="27" cy="30" rx="3.9" ry="3.4" fill={INK} />
        </g>
      );
    case 'visor':
      return (
        <g>
          <rect x="17.5" y="26" width="29" height="7" rx="3.5" fill="#22d3ee" />
          <rect x="17.5" y="26" width="29" height="7" rx="3.5" fill="none" stroke="#0e7490" strokeWidth="1" />
          <rect x="20" y="27.3" width="10" height="1.6" rx="0.8" fill="#fff" opacity="0.7" />
        </g>
      );
    case 'fierce':
      return (
        <g>
          {pupils}
          <path d="M23 26.5 L30 28.5 M41 26.5 L34 28.5" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );
    case 'squint':
      return (
        <path d="M24.5 30 L29.5 30 M34.5 30 L39.5 30 M24 27 L29.5 28 M40 27 L34.5 28" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
      );
    case 'sleepy':
      return (
        <path d="M24.5 30 Q27 32 29.5 30 M34.5 30 Q37 32 39.5 30" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      );
    case 'mime':
      return (
        <g>
          {pupils}
          <path d="M27 24 L27 27 M27 33 L27 36 M37 24 L37 27 M37 33 L37 36" stroke={INK} strokeWidth="1" strokeLinecap="round" />
        </g>
      );
    case 'alien':
      return (
        <g>
          <ellipse cx="26" cy="30" rx="4.2" ry="5.6" transform="rotate(-18 26 30)" fill="#0c0a09" />
          <ellipse cx="38" cy="30" rx="4.2" ry="5.6" transform="rotate(18 38 30)" fill="#0c0a09" />
          <circle cx="24.8" cy="27.8" r="1.2" fill="#fff" />
          <circle cx="36.8" cy="27.8" r="1.2" fill="#fff" />
        </g>
      );
    default:
      return pupils;
  }
}

function Mouth({ mouth }) {
  const stroke = { stroke: INK, strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round' };
  switch (mouth) {
    case 'none': return null;
    case 'smirk': return <path d="M28 37.5 Q33 38.8 36.5 35.5" {...stroke} />;
    case 'flat': return <path d="M28.5 37 L35.5 37" {...stroke} />;
    case 'o': return <ellipse cx="32" cy="37.3" rx="1.6" ry="1.9" fill={INK} />;
    case 'lips': return <path d="M27.5 36.4 Q30 35 32 36 Q34 35 36.5 36.4 Q32 40.5 27.5 36.4Z" fill="#e11d48" />;
    case 'grin': return <path d="M27 35.5 Q32 41.5 37 35.5Z" fill="#fff" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />;
    default: return <path d="M27.5 36 Q32 40 36.5 36" {...stroke} />;
  }
}

function Facial({ facial }) {
  if (!facial) return null;
  const { type, color } = facial;
  if (type === 'beard') {
    return (
      <g fill={color}>
        <path d="M19 31 Q19 45.5 32 45.5 Q45 45.5 45 31 Q43 39 32 40 Q21 39 19 31Z" />
        <path d="M25 35.2 Q28.5 32.6 32 34.4 Q35.5 32.6 39 35.2 Q35.5 36.4 32 35.4 Q28.5 36.4 25 35.2Z" />
      </g>
    );
  }
  if (type === 'thin') return <path d="M27 34.6 Q32 33.2 37 34.6" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />;
  if (type === 'curly') {
    return <path d="M32 34.5 Q28 32.5 25.5 34.5 Q23.5 36 24.5 33.5 Q27 31.5 32 33.6 Q37 31.5 39.5 33.5 Q40.5 36 38.5 34.5 Q36 32.5 32 34.5Z" fill={color} />;
  }
  return <path d="M25 35.2 Q28.5 32.6 32 34.4 Q35.5 32.6 39 35.2 Q35.5 36.4 32 35.4 Q28.5 36.4 25 35.2Z" fill={color} />;
}

function Hat({ hat }) {
  if (!hat) return null;
  const { type, color, band } = hat;
  switch (type) {
    case 'fedora':
      return (
        <g>
          <path d="M10 22 Q32 15 54 22 Q32 27.5 10 22Z" fill={color} />
          <path d="M20 21 Q19 8 32 8 Q45 8 44 21 Q32 18 20 21Z" fill={color} />
          <path d="M20.3 18 Q32 15 43.7 18 L44 21 Q32 18 20 21Z" fill={band} />
          <path d="M28 10 Q32 13 36 10" stroke="rgba(0,0,0,0.3)" strokeWidth="1" fill="none" />
        </g>
      );
    case 'tophat':
      return (
        <g>
          <rect x="22" y="2" width="20" height="17.5" rx="1.5" fill={color} />
          <rect x="22" y="14.5" width="20" height="3.5" fill={band} />
          <ellipse cx="32" cy="19.5" rx="17" ry="3.3" fill={color} />
        </g>
      );
    case 'bowler':
      return (
        <g>
          <path d="M20 20.5 Q20 7 32 7 Q44 7 44 20.5Z" fill={color} />
          <rect x="20" y="17" width="24" height="3" fill={band} />
          <ellipse cx="32" cy="20.5" rx="15.5" ry="2.8" fill={color} />
        </g>
      );
    case 'beret':
      return (
        <g fill={color}>
          <ellipse cx="29" cy="17" rx="16.5" ry="6.5" transform="rotate(-8 29 17)" />
          <rect x="29.5" y="8.5" width="2.2" height="3.5" rx="1" />
        </g>
      );
    case 'cap':
      return (
        <g>
          <path d="M19 22 Q19 9 32 9 Q45 9 45 22Z" fill={color} />
          <path d="M31 21.2 Q48 18.5 55 22.5 Q45 25 31 23.2Z" fill={band} />
          <circle cx="32" cy="9.6" r="1.4" fill={band} />
        </g>
      );
    case 'beanie':
      return (
        <g>
          <path d="M18.5 24 Q18 8 32 8 Q46 8 45.5 24Z" fill={color} />
          <rect x="18" y="19.5" width="28" height="5.5" rx="2.5" fill={band} />
          {hat.pompom !== false && <circle cx="32" cy="6.5" r="3.5" fill={band} />}
        </g>
      );
    case 'cowboy':
      return (
        <g fill={color}>
          <path d="M20 23 Q18 8 26 8.5 Q32 12 38 8.5 Q46 8 44 23Z" />
          <path d="M5 20 Q12 25 32 24 Q52 25 59 20 Q55 28 32 28.5 Q9 28 5 20Z" />
          <path d="M20.5 20 Q32 18 43.5 20 L43.8 22.8 Q32 21 20.2 22.8Z" fill={band} />
        </g>
      );
    case 'bandana':
      return (
        <g>
          <path d="M18.5 25 Q18 11 32 11 Q46 11 45.5 25 Q32 20.5 18.5 25Z" fill={color} />
          <path d="M44 21 L53 17.5 L51 25 Z M44.5 22.5 L52 26 L47 28Z" fill={color} />
          <g fill="#fff" opacity="0.8">
            <circle cx="26" cy="16" r="1" />
            <circle cx="32" cy="14" r="1" />
            <circle cx="38" cy="16" r="1" />
            <circle cx="29" cy="20" r="1" />
            <circle cx="35" cy="20" r="1" />
          </g>
        </g>
      );
    case 'crown':
      return (
        <g>
          <path d="M19 21 L18 7 L25 13.5 L32 4 L39 13.5 L46 7 L45 21 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="1.2" strokeLinejoin="round" />
          <circle cx="32" cy="16" r="1.8" fill="#e11d48" />
          <circle cx="24.5" cy="17" r="1.3" fill="#2563eb" />
          <circle cx="39.5" cy="17" r="1.3" fill="#16a34a" />
        </g>
      );
    default:
      return null;
  }
}

function Accessory({ accessory }) {
  if (!accessory) return null;
  const { type, color } = accessory;
  switch (type) {
    case 'tie':
      return (
        <g fill={color}>
          <path d="M30.6 47 L33.4 47 L34.4 49.4 L32 50.6 L29.6 49.4 Z" />
          <path d="M31 50 L33 50 L34.8 59 L32 62.5 L29.2 59 Z" />
        </g>
      );
    case 'bowtie':
      return (
        <g fill={color}>
          <path d="M25.5 47.5 L31 50 L25.5 52.5 Z M38.5 47.5 L33 50 L38.5 52.5 Z" />
          <circle cx="32" cy="50" r="1.8" />
        </g>
      );
    case 'scarf':
      return (
        <g fill={color}>
          <path d="M23.5 43.5 Q32 49 40.5 43.5 L41.5 48 Q32 53.5 22.5 48 Z" />
          <path d="M35.5 48.5 L39.5 60 L35 59 L33 50 Z" />
        </g>
      );
    case 'earpiece':
      return (
        <g>
          <path d="M45 31 Q48.5 35.5 46.5 40.5 Q44.5 45 42 48" stroke="#e2e8f0" strokeWidth="1.2" fill="none" />
          <circle cx="45" cy="31" r="1.7" fill="#e2e8f0" />
        </g>
      );
    case 'pearls':
      return (
        <g fill="#fdf4ff" stroke="#e9d5ff" strokeWidth="0.4">
          {[24, 26.7, 29.4, 32, 34.6, 37.3, 40].map((x, i) => (
            <circle key={x} cx={x} cy={46.5 + Math.sin((i / 6) * Math.PI) * 3} r="1.35" />
          ))}
        </g>
      );
    case 'sash':
      return <path d="M14 56 L50 48 L51 52 L15 60 Z" fill={color} />;
    case 'earring':
      return <circle cx="19.5" cy="35.5" r="1.8" fill="none" stroke="#facc15" strokeWidth="1.1" />;
    case 'spikes':
      return (
        <g fill="#d4d4d8">
          <path d="M22 49 L23.5 45.5 L25 49Z M27 47.5 L28.5 44 L30 47.5Z M34 47.5 L35.5 44 L37 47.5Z M39 49 L40.5 45.5 L42 49Z" />
        </g>
      );
    case 'goldchain':
      return (
        <g>
          <path d="M23 46 Q32 56 41 46" stroke="#fbbf24" strokeWidth="2" fill="none" />
          <circle cx="32" cy="52.5" r="2.6" fill="#fbbf24" stroke="#b45309" strokeWidth="0.8" />
        </g>
      );
    default:
      return null;
  }
}

// Il personaggio completo
export function SpyFace({ look, className = '' }) {
  const { skin, hair, hat, eyes, mouth, facial, outfit = {}, hood, ninja, antennae } = look;
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      {hood && <path d="M11 64 L13 33 Q13 7 32 7 Q51 7 51 33 L53 64 Z" fill={hood} />}
      <HairBack hair={hair} />

      {/* busto */}
      <path d="M8 64 Q9 48 32 46 Q55 48 56 64 Z" fill={outfit.coat ?? '#334155'} />
      {outfit.stripes && (
        <g fill={outfit.stripes}>
          <rect x="13" y="50.5" width="38" height="2.6" />
          <rect x="10.5" y="55.5" width="43" height="2.6" />
          <rect x="8.5" y="60.5" width="47" height="2.6" />
        </g>
      )}
      {outfit.pinstripe && (
        <g stroke="rgba(255,255,255,0.25)" strokeWidth="0.6">
          <path d="M16 64 L18 50 M22 64 L23 48 M42 64 L41 48 M48 64 L46 50" />
        </g>
      )}
      {outfit.shirt !== false && <path d="M26 46.6 L32 57 L38 46.6 Q32 45.5 26 46.6 Z" fill={outfit.shirt ?? '#f8fafc'} />}
      <Accessory accessory={outfit.accessory?.type === 'earpiece' || outfit.accessory?.type === 'earring' ? null : outfit.accessory} />

      {/* collo, orecchie, testa */}
      <rect x="28" y="38" width="8" height="9" rx="3" fill={skin} />
      <circle cx="19.5" cy="31" r="2.6" fill={ninja ?? skin} />
      <circle cx="44.5" cy="31" r="2.6" fill={ninja ?? skin} />
      {antennae && (
        <g stroke={skin} strokeWidth="1.6" fill={skin}>
          <path d="M25 19 L20 8 M39 19 L44 8" />
          <circle cx="20" cy="8" r="2.4" stroke="none" />
          <circle cx="44" cy="8" r="2.4" stroke="none" />
        </g>
      )}
      <circle cx="32" cy="30" r="13" fill={ninja ?? skin} />
      {ninja && <rect x="19.5" y="25" width="25" height="9.5" rx="4.5" fill={skin} />}
      {ninja && <path d="M44 27 L53 23 L51 30 Z" fill={ninja} />}

      <HairFront hair={hair} />
      {/* guance */}
      {!ninja && (
        <g fill="#fb7185" opacity="0.28">
          <circle cx="23.5" cy="34.5" r="2" />
          <circle cx="40.5" cy="34.5" r="2" />
        </g>
      )}
      <Facial facial={facial?.type === 'beard' ? facial : null} />
      <Mouth mouth={mouth} />
      <Facial facial={facial?.type === 'beard' ? null : facial} />
      <Eyes eyes={eyes} />
      <Hat hat={hat} />
      {(outfit.accessory?.type === 'earpiece' || outfit.accessory?.type === 'earring') && <Accessory accessory={outfit.accessory} />}
    </svg>
  );
}

// Avatar di un giocatore, ovunque nell'app
export function PlayerAvatar({ name, className = 'w-12 h-12', rounded = 'rounded-xl', dead = false }) {
  const { avatars } = useContext(AvatarContext);
  const spy = spyFor(name, avatars);
  return (
    <span
      className={`relative shrink-0 inline-flex overflow-hidden bg-linear-to-br ${spy.bg} ${rounded} ${className} ${dead ? 'grayscale opacity-40' : ''}`}
      title={spy.name}
    >
      <SpyFace look={spy.look} className="w-full h-full" />
    </span>
  );
}

// Finestra per scegliere il proprio agente
export function AvatarPicker({ name, onChoose, onClose }) {
  const { avatars } = useContext(AvatarContext);
  const current = spyFor(name, avatars);

  return (
    <div className="fixed inset-0 z-[55] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div
        className="glass bg-[#120e24]/95 w-full sm:max-w-lg max-h-[88vh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] p-5 sm:p-6 animate-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Scegli l'avatar di ${name}`}
      >
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 min-w-0">
            <span key={current.id} className="animate-bounce-in">
              <PlayerAvatar name={name} className="w-14 h-14" rounded="rounded-2xl" />
            </span>
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-violet-300/70">Scegli il tuo agente</div>
              <div className="font-display font-black text-xl truncate">{name}</div>
              <div className="text-sm text-white/50 truncate">{current.name}</div>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Chiudi" className="btn-ghost w-10 h-10 rounded-full flex items-center justify-center shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
          {SPIES.map((spy, i) => {
            const selected = spy.id === current.id;
            return (
              <button
                key={spy.id}
                type="button"
                onClick={() => onChoose(spy.id)}
                style={{ animationDelay: `${i * 0.02}s` }}
                className={`group flex flex-col items-center gap-1.5 p-1.5 rounded-2xl border transition-all active:scale-95 animate-bounce-in ${
                  selected ? 'bg-violet-500/20 border-violet-400/60' : 'bg-white/[0.03] border-white/5 hover:bg-white/10'
                }`}
              >
                <span className={`relative w-full aspect-square rounded-xl overflow-hidden bg-linear-to-br ${spy.bg} transition-transform group-hover:scale-105`}>
                  <SpyFace look={spy.look} className="w-full h-full" />
                  {selected && (
                    <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                      <Check size={13} strokeWidth={3} />
                    </span>
                  )}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-white/70 leading-tight text-center line-clamp-2">{spy.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
