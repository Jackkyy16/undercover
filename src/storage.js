// Salvataggio automatico nel browser: giocatori, impostazioni e partita in corso
// sopravvivono a chiusura e ricarica della pagina.
// Punti, statistiche e storico NON stanno qui: sono su Firebase (vedi cloudStats.js).

const STORAGE_KEY = 'undercover-save-v1';

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const isStringArray = (v) => Array.isArray(v) && v.every(x => typeof x === 'string');
const ROLES = ['Civile', 'Undercover', 'Mr. White'];

const isValidPlayer = (p) =>
  isObject(p) && typeof p.id === 'number' && typeof p.name === 'string' &&
  ROLES.includes(p.role) && typeof p.word === 'string' && typeof p.isAlive === 'boolean';

// Legge il salvataggio scartando tutto ciò che non ha la forma attesa,
// così un dato rovinato non blocca mai il gioco.
export const loadSave = () => {
  let raw;
  try {
    raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return {};
  }
  if (!isObject(raw)) return {};

  const save = {};
  if (isStringArray(raw.playersInput)) save.playersInput = raw.playersInput;
  if (isObject(raw.rolesCount) && ['civili', 'undercover', 'mrWhite'].every(k => Number.isInteger(raw.rolesCount[k]) && raw.rolesCount[k] >= 0)) {
    save.rolesCount = raw.rolesCount;
  }
  if (typeof raw.groupCode === 'string') save.groupCode = raw.groupCode;
  if (isObject(raw.avatars) && Object.values(raw.avatars).every(v => typeof v === 'string')) save.avatars = raw.avatars;
  if (isStringArray(raw.usedPairs)) save.usedPairs = raw.usedPairs;
  if (typeof raw.category === 'string') save.category = raw.category;
  if (typeof raw.muted === 'boolean') save.muted = raw.muted;
  if (Number.isInteger(raw.timerDuration) && raw.timerDuration > 0) save.timerDuration = raw.timerDuration;

  // Partita in corso: la riprendiamo solo se è coerente
  const g = raw.game;
  if (
    isObject(g) &&
    ['distribution', 'playing', 'gameover'].includes(g.gameState) &&
    Array.isArray(g.players) && g.players.length >= 3 && g.players.every(isValidPlayer) &&
    typeof g.civilianWord === 'string' && typeof g.undercoverWord === 'string'
  ) {
    save.game = {
      gameState: g.gameState,
      players: g.players,
      civilianWord: g.civilianWord,
      undercoverWord: g.undercoverWord,
      currentPlayerIndex: Number.isInteger(g.currentPlayerIndex) && g.currentPlayerIndex < g.players.length ? g.currentPlayerIndex : 0,
      winner: ['civili', 'undercover', 'mrWhite'].includes(g.winner) ? g.winner : null,
      eliminatedJustNow: isValidPlayer(g.eliminatedJustNow) ? g.eliminatedJustNow : null,
      eliminationOrder: Array.isArray(g.eliminationOrder) ? g.eliminationOrder.filter(Number.isInteger) : [],
      categoryLabel: typeof g.categoryLabel === 'string' ? g.categoryLabel : '',
    };
    if (save.game.gameState === 'gameover' && !save.game.winner) delete save.game;
  }
  return save;
};

export const writeSave = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // spazio pieno o storage bloccato: il gioco funziona lo stesso, solo senza salvataggio
  }
};
