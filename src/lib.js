// Funzioni e stili condivisi tra i componenti del gioco

// --- FUNZIONI DI UTILITA' ---
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- STILE ---
// Il proprietario del gioco: "pisellino", senza badare a spazi e maiuscole
export const isOwner = (name) => name.trim().toLowerCase() === 'pisellino';

export const roleStyles = {
  'Civile': {
    text: 'text-emerald-300',
    badge: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
    glow: 'shadow-[0_0_60px_-10px_rgba(52,211,153,0.55)]',
  },
  'Undercover': {
    text: 'text-rose-400',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
    glow: 'shadow-[0_0_60px_-10px_rgba(244,63,94,0.6)]',
  },
  'Mr. White': {
    text: 'text-white',
    badge: 'bg-white/10 text-white border-white/30',
    glow: 'shadow-[0_0_60px_-10px_rgba(255,255,255,0.45)]',
  },
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Vibrazione sui telefoni che la supportano
export const buzz = (pattern) => {
  try { navigator.vibrate?.(pattern); } catch { /* non supportata */ }
};

// Da vincitore ('civili' | 'undercover' | 'mrWhite') al ruolo dei giocatori
export const winnerRole = { civili: 'Civile', undercover: 'Undercover', mrWhite: 'Mr. White' };
