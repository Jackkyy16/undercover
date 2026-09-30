// Statistiche condivise su Firestore, divise per "codice gruppo".
//
//   groups/{codice}              → { scores: { nome: punti }, stats: { nome: {...} }, avatars: { nome: id }, updatedAt }
//   groups/{codice}/games/{id}   → una partita dello storico
//
// Chi conosce il codice vede e aggiorna le statistiche di quel gruppo.
import { useEffect, useState } from 'react';
import {
  collection, doc, getDocs, increment, limit, onSnapshot, orderBy, query, serverTimestamp, writeBatch,
} from 'firebase/firestore';
import { db, ensureSignedIn } from './firebase';
import { winnerRole } from './lib';

const HISTORY_SIZE = 30;

// "Amici di Pisellino!" → "amici-di-pisellino"
export const normalizeGroupCode = (raw) => raw
  .trim()
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/\s+/g, '-')
  .replace(/[^a-z0-9-]/g, '')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 40);

export const isValidGroupCode = (code) => code.length >= 4 && code.length <= 40;

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const groupRef = (code) => doc(db, 'groups', code);
const gamesRef = (code) => collection(db, 'groups', code, 'games');

const EMPTY = { scores: {}, stats: {}, avatars: {}, history: [], error: null };

// Legge in tempo reale punti, statistiche e storico del gruppo.
// status: 'off' (nessun gruppo) | 'connecting' | 'online' | 'offline' (copia locale, si sincronizza dopo) | 'error'
export function useGroupStats(groupCode) {
  const [data, setData] = useState({ code: null, status: 'connecting', ...EMPTY });

  useEffect(() => {
    if (!groupCode) return;
    let active = true;
    const unsubscribes = [];
    const update = (patch) => {
      if (!active) return;
      setData(prev => ({ ...(prev.code === groupCode ? prev : { status: 'connecting', ...EMPTY }), code: groupCode, ...patch }));
    };
    const fail = (err) => update({ status: 'error', error: err?.code ?? 'sconosciuto' });

    ensureSignedIn().then(() => {
      if (!active) return;
      unsubscribes.push(onSnapshot(groupRef(groupCode), { includeMetadataChanges: true }, (snap) => {
        const d = snap.data() ?? {};
        update({
          scores: isObject(d.scores) ? d.scores : {},
          stats: isObject(d.stats) ? d.stats : {},
          avatars: isObject(d.avatars) ? d.avatars : {},
          status: snap.metadata.fromCache ? 'offline' : 'online',
          error: null,
        });
      }, fail));
      unsubscribes.push(onSnapshot(query(gamesRef(groupCode), orderBy('date', 'desc'), limit(HISTORY_SIZE)), (snap) => {
        update({ history: snap.docs.map(d => d.data()) });
      }, fail));
    }, fail);

    return () => {
      active = false;
      unsubscribes.forEach(u => u());
    };
  }, [groupCode]);

  if (!groupCode) return { status: 'off', ...EMPTY };
  if (data.code !== groupCode) return { status: 'connecting', ...EMPTY };
  return data;
}

// Salva una partita finita: punti e statistiche con incrementi atomici
// (due telefoni che salvano insieme non si sovrascrivono) + voce nello storico.
export async function recordGameOnline(groupCode, { players, winningRole, points, firstOutId, guesserName, entry }) {
  const winningPlayerRole = winnerRole[winningRole];
  const scores = {};
  const stats = {};
  players.forEach(p => {
    const won = p.role === winningPlayerRole;
    const s = {
      games: increment(1),
      roles: { [p.role]: { played: increment(1), ...(won && { won: increment(1) }) } },
    };
    if (won) s.wins = increment(1);
    if (p.id === firstOutId) s.firstOut = increment(1);
    if (p.name === guesserName) s.mrWhiteGuesses = increment(1);
    stats[p.name] = s;
    if (points[p.name]) scores[p.name] = increment(points[p.name]);
  });

  await ensureSignedIn();
  const batch = writeBatch(db);
  batch.set(groupRef(groupCode), {
    ...(Object.keys(scores).length > 0 && { scores }),
    stats,
    updatedAt: serverTimestamp(),
  }, { merge: true });
  batch.set(doc(gamesRef(groupCode)), entry);
  return batch.commit();
}

// Avatar scelto da un giocatore, visibile a tutto il gruppo
export async function setAvatarOnline(groupCode, name, avatarId) {
  await ensureSignedIn();
  const batch = writeBatch(db);
  batch.set(groupRef(groupCode), { avatars: { [name]: avatarId }, updatedAt: serverTimestamp() }, { merge: true });
  return batch.commit();
}

// Azzera punti, statistiche e storico del gruppo (gli avatar restano)
export async function resetGroupOnline(groupCode) {
  await ensureSignedIn();
  const games = await getDocs(gamesRef(groupCode));
  const refs = games.docs.map(d => d.ref);
  // Un batch accetta al massimo 500 operazioni
  for (let i = 0; i < refs.length; i += 400) {
    const batch = writeBatch(db);
    refs.slice(i, i + 400).forEach(ref => batch.delete(ref));
    await batch.commit();
  }
  const batch = writeBatch(db);
  batch.set(groupRef(groupCode), { scores: {}, stats: {}, updatedAt: serverTimestamp() }, { mergeFields: ['scores', 'stats', 'updatedAt'] });
  return batch.commit();
}
