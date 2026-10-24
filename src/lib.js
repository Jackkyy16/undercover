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

// Parole lunghe = font più piccolo, così stanno nella carta anche su mobile
export const wordSize = (word) => {
  if (word.length <= 6) return 'text-5xl sm:text-7xl';
  if (word.length <= 10) return 'text-4xl sm:text-6xl';
  return 'text-3xl sm:text-5xl';
};

// Da vincitore ('civili' | 'undercover' | 'mrWhite' | 'impostori') ai ruoli che vincono.
// 'impostori': i Civili sono finiti e restano sia Undercover sia Mr. White → vincono entrambi
export const winnerRoles = {
  civili: ['Civile'],
  undercover: ['Undercover'],
  mrWhite: ['Mr. White'],
  impostori: ['Undercover', 'Mr. White'],
};

// Punti a ogni giocatore del ruolo vincitore (anche se eliminato prima)
export const rolePoints = { 'Civile': 2, 'Undercover': 10, 'Mr. White': 6 };
