// Personaggi "spia" tra cui ogni giocatore sceglie il proprio avatar.
// Ogni personaggio è una combinazione di parti disegnate in SVG da SpyFace (avatars.jsx):
// niente immagini da caricare, tutto generato sul telefono.
import { createContext } from 'react';
import { isOwner } from './lib';

const SKIN = {
  chiara: '#f6d3b8',
  rosa: '#f1c3a4',
  media: '#dba27a',
  olivastra: '#c28a5e',
  scura: '#8d5a3b',
  molto_scura: '#5e3a26',
};

export const SPIES = [
  {
    id: 'agente', name: "L'Agente", bg: 'from-slate-500 to-slate-800',
    look: { skin: SKIN.rosa, hair: { style: 'short', color: '#2b2118' }, hat: { type: 'fedora', color: '#111827', band: '#374151' }, eyes: { type: 'shades' }, mouth: 'smirk', outfit: { coat: '#1f2937', accessory: { type: 'tie', color: '#dc2626' } } },
  },
  {
    id: 'detective', name: 'Il Detective', bg: 'from-amber-400 to-orange-700',
    look: { skin: SKIN.chiara, hair: { style: 'short', color: '#6b4226' }, hat: { type: 'fedora', color: '#78350f', band: '#451a03' }, eyes: { type: 'dots' }, mouth: 'flat', facial: { type: 'mustache', color: '#6b4226' }, outfit: { coat: '#b45309', accessory: { type: 'tie', color: '#1e3a8a' } } },
  },
  {
    id: 'contessa', name: 'La Contessa', bg: 'from-fuchsia-500 to-purple-800',
    look: { skin: SKIN.chiara, hair: { style: 'long', color: '#1c1917' }, eyes: { type: 'mask', color: '#7e22ce' }, mouth: 'lips', outfit: { coat: '#581c87', shirt: '#f5d0fe', accessory: { type: 'pearls' } } },
  },
  {
    id: 'hacker', name: "L'Hacker", bg: 'from-emerald-400 to-cyan-700',
    look: { skin: SKIN.media, hood: '#0f3d33', hair: { style: 'short', color: '#1c1917' }, eyes: { type: 'visor' }, mouth: 'smirk', outfit: { coat: '#134e4a', shirt: '#0f3d33' } },
  },
  {
    id: 'ninja', name: 'Il Ninja', bg: 'from-rose-500 to-slate-900',
    look: { skin: SKIN.olivastra, ninja: '#18181b', eyes: { type: 'fierce' }, mouth: 'none', outfit: { coat: '#18181b', shirt: '#27272a', accessory: { type: 'sash', color: '#e11d48' } } },
  },
  {
    id: 'mafioso', name: 'Il Boss di quartiere', bg: 'from-zinc-400 to-zinc-800',
    look: { skin: SKIN.olivastra, hair: { style: 'short', color: '#1c1917' }, hat: { type: 'fedora', color: '#e4e4e7', band: '#18181b' }, eyes: { type: 'shades' }, mouth: 'flat', facial: { type: 'mustache', color: '#1c1917' }, outfit: { coat: '#27272a', pinstripe: true, accessory: { type: 'tie', color: '#fafafa' } } },
  },
  {
    id: 'professore', name: 'Il Professore', bg: 'from-indigo-400 to-indigo-800',
    look: { skin: SKIN.chiara, hair: { style: 'bald', color: '#d4d4d8' }, eyes: { type: 'round' }, mouth: 'smile', facial: { type: 'beard', color: '#d4d4d8' }, outfit: { coat: '#78716c', accessory: { type: 'bowtie', color: '#dc2626' } } },
  },
  {
    id: 'pistolero', name: 'Il Pistolero', bg: 'from-orange-400 to-red-700',
    look: { skin: SKIN.media, hair: { style: 'short', color: '#7c2d12' }, hat: { type: 'cowboy', color: '#92400e', band: '#451a03' }, eyes: { type: 'squint' }, mouth: 'smirk', facial: { type: 'mustache', color: '#7c2d12' }, outfit: { coat: '#a16207', accessory: { type: 'scarf', color: '#dc2626' } } },
  },
  {
    id: 'pirata', name: 'La Piratessa', bg: 'from-rose-400 to-red-800',
    look: { skin: SKIN.olivastra, hair: { style: 'long', color: '#451a03' }, hat: { type: 'bandana', color: '#dc2626' }, eyes: { type: 'patch' }, mouth: 'grin', outfit: { coat: '#1c1917', shirt: '#fef3c7', accessory: { type: 'earring' } } },
  },
  {
    id: 'ladra', name: 'La Ladra', bg: 'from-violet-400 to-violet-900',
    look: { skin: SKIN.rosa, hair: { style: 'bob', color: '#1c1917' }, hat: { type: 'beanie', color: '#18181b', band: '#27272a', pompom: false }, eyes: { type: 'mask', color: '#0a0a0a' }, mouth: 'smirk', outfit: { coat: '#f8fafc', stripes: '#18181b', shirt: false } },
  },
  {
    id: 'barone', name: 'Il Barone', bg: 'from-purple-400 to-purple-900',
    look: { skin: SKIN.chiara, hair: { style: 'short', color: '#a8a29e' }, hat: { type: 'tophat', color: '#0c0a09', band: '#7e22ce' }, eyes: { type: 'monocle' }, mouth: 'flat', facial: { type: 'curly', color: '#a8a29e' }, outfit: { coat: '#0c0a09', accessory: { type: 'bowtie', color: '#f8fafc' } } },
  },
  {
    id: 'diva', name: 'La Diva', bg: 'from-pink-300 to-pink-600',
    look: { skin: SKIN.media, hair: { style: 'bun', color: '#facc15' }, eyes: { type: 'shades', color: '#db2777', frame: '#fdf2f8' }, mouth: 'lips', outfit: { coat: '#be185d', shirt: '#fbcfe8', accessory: { type: 'pearls' } } },
  },
  {
    id: 'spione', name: 'Lo Spione', bg: 'from-teal-400 to-teal-800',
    look: { skin: SKIN.chiara, hair: { style: 'short', color: '#44403c' }, hat: { type: 'bowler', color: '#1c1917', band: '#44403c' }, eyes: { type: 'round' }, mouth: 'o', facial: { type: 'thin', color: '#44403c' }, outfit: { coat: '#57534e', accessory: { type: 'tie', color: '#0d9488' } } },
  },
  {
    id: 'cadetto', name: 'Il Cadetto', bg: 'from-sky-400 to-blue-800',
    look: { skin: SKIN.scura, hair: { style: 'short', color: '#1c1917' }, hat: { type: 'cap', color: '#1d4ed8', band: '#1e3a8a' }, eyes: { type: 'dots' }, mouth: 'smile', outfit: { coat: '#1e3a8a', accessory: { type: 'earpiece' } } },
  },
  {
    id: 'artista', name: "L'Artista", bg: 'from-red-400 to-amber-600',
    look: { skin: SKIN.rosa, hair: { style: 'short', color: '#292524' }, hat: { type: 'beret', color: '#b91c1c' }, eyes: { type: 'dots' }, mouth: 'smile', facial: { type: 'curly', color: '#292524' }, outfit: { coat: '#1c1917', accessory: { type: 'scarf', color: '#facc15' } } },
  },
  {
    id: 'ribelle', name: 'Il Ribelle', bg: 'from-lime-300 to-green-700',
    look: { skin: SKIN.chiara, hair: { style: 'mohawk', color: '#ec4899' }, eyes: { type: 'shades' }, mouth: 'grin', outfit: { coat: '#18181b', shirt: '#dc2626', accessory: { type: 'spikes' } } },
  },
  {
    id: 'infiltrata', name: "L'Infiltrata", bg: 'from-cyan-300 to-sky-700',
    look: { skin: SKIN.molto_scura, hair: { style: 'afro', color: '#1c1917' }, eyes: { type: 'dots' }, mouth: 'smirk', outfit: { coat: '#0c4a6e', accessory: { type: 'earpiece' } } },
  },
  {
    id: 'maggiordomo', name: 'Il Maggiordomo', bg: 'from-stone-300 to-stone-600',
    look: { skin: SKIN.rosa, hair: { style: 'slick', color: '#57534e' }, eyes: { type: 'sleepy' }, mouth: 'flat', facial: { type: 'thin', color: '#57534e' }, outfit: { coat: '#0c0a09', accessory: { type: 'bowtie', color: '#0c0a09' }, gloves: true } },
  },
  {
    id: 'mimo', name: 'Il Mimo', bg: 'from-slate-200 to-slate-500',
    look: { skin: '#f8fafc', hair: { style: 'short', color: '#18181b' }, hat: { type: 'beret', color: '#18181b' }, eyes: { type: 'mime' }, mouth: 'lips', outfit: { coat: '#f8fafc', stripes: '#1e293b', shirt: false } },
  },
  {
    id: 'alieno', name: "L'Alieno", bg: 'from-lime-400 to-emerald-800',
    look: { skin: '#86efac', antennae: true, eyes: { type: 'alien' }, mouth: 'smile', outfit: { coat: '#6d28d9', shirt: '#a78bfa' } },
  },
];

// Riservato al proprietario del gioco
export const BOSS = {
  id: 'capo', name: 'Il Capo', bg: 'from-amber-200 via-yellow-400 to-amber-600',
  look: { skin: SKIN.rosa, hair: { style: 'slick', color: '#1c1917' }, hat: { type: 'crown' }, eyes: { type: 'shades', color: '#0c0a09', frame: '#fbbf24' }, mouth: 'grin', outfit: { coat: '#0c0a09', accessory: { type: 'goldchain' } } },
};

const byId = Object.fromEntries(SPIES.map(s => [s.id, s]));
export const isSpyId = (id) => typeof id === 'string' && id in byId;

// Personaggio di un giocatore: scelto da lui, oppure uno fisso ricavato dal nome
export const spyFor = (name, avatars = {}) => {
  if (isOwner(name)) return BOSS;
  const chosen = avatars[name];
  if (isSpyId(chosen)) return byId[chosen];
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
  return SPIES[Math.abs(hash) % SPIES.length];
};

// Avatar scelti ({ nome: id }) e funzione per aprire la scelta, disponibili in tutta l'app
export const AvatarContext = createContext({ avatars: {}, openPicker: null });
