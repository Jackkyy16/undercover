
import './index.css'
import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, Eye, EyeOff, Play, Skull, Crown, AlertCircle, RefreshCw, Shield, VenetianMask, Ghost, Fingerprint, Sparkles, Trophy, Minus, Plus, HatGlasses, Vote, ChartBar, Volume2, VolumeX, WandSparkles, Layers, Cloud, CloudOff, Pencil } from 'lucide-react';

import logoImage from '/matteo.png';
import { wordCategories } from './words';
import { shuffleArray, isOwner, roleStyles, prefersReducedMotion, buzz } from './lib';
import { AvatarContext } from './avatarData';
import { PlayerAvatar, AvatarPicker } from './avatars';
import { Confetti, ScrambleText, CountUp, Tilt, Typewriter, Fireworks, OwnerParty, DeathBurst } from './effects';
import { sounds, setMuted as setSoundMuted } from './sounds';
import { loadSave, writeSave } from './storage';
import { useGroupStats, recordGameOnline, resetGroupOnline, setAvatarOnline, normalizeGroupCode, isValidGroupCode } from './cloudStats';
import SpeakingOrder from './components/SpeakingOrder';
import DiscussionTimer from './components/DiscussionTimer';
import SecretVote from './components/SecretVote';
import StatsView from './components/StatsView';
import RoleReveal from './components/RoleReveal';


const roleOptions = [
  { id: 'civili', label: 'Civili', desc: 'Hanno la parola segreta', icon: Shield, accent: 'text-emerald-300', chip: 'bg-emerald-400/15 border-emerald-400/30' },
  { id: 'undercover', label: 'Undercover', desc: 'Hanno una parola simile', icon: VenetianMask, accent: 'text-rose-300', chip: 'bg-rose-500/15 border-rose-400/30' },
  { id: 'mrWhite', label: 'Mr. White', desc: 'Non ha nessuna parola', icon: Ghost, accent: 'text-white', chip: 'bg-white/10 border-white/25' },
];

const winThemes = {
  civili: {
    title: 'I CIVILI VINCONO!',
    desc: 'Hanno trovato tutti gli impostori.',
    gradient: 'from-emerald-300 via-teal-200 to-cyan-300',
    glow: 'rgba(52,211,153,0.45)',
    ring: 'border-emerald-400/30',
    spin: '#6ee7b7',
  },
  undercover: {
    title: 'GLI UNDERCOVER VINCONO!',
    desc: 'Sono riusciti a mimetizzarsi perfettamente.',
    gradient: 'from-rose-400 via-fuchsia-400 to-orange-300',
    glow: 'rgba(244,63,94,0.45)',
    ring: 'border-rose-400/30',
    spin: '#fb7185',
  },
  mrWhite: {
    title: 'MR. WHITE VINCE!',
    desc: 'Ha indovinato la parola o è sopravvissuto fino alla fine!',
    gradient: 'from-white via-slate-200 to-violet-300',
    glow: 'rgba(255,255,255,0.35)',
    ring: 'border-white/30',
    spin: '#ffffff',
  },
};

const medalStyles = [
  'bg-linear-to-br from-amber-200 to-yellow-500 text-amber-950 shadow-[0_0_25px_-5px_rgba(252,211,77,0.8)]',
  'bg-linear-to-br from-slate-100 to-slate-400 text-slate-900',
  'bg-linear-to-br from-orange-300 to-amber-700 text-orange-950',
];

// Parole lunghe = font più piccolo, così stanno nella carta anche su mobile
const wordSize = (word) => {
  if (word.length <= 6) return 'text-5xl sm:text-7xl';
  if (word.length <= 10) return 'text-4xl sm:text-6xl';
  return 'text-3xl sm:text-5xl';
};

const particles = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 41 + 7) % 100}%`,
  size: 2 + (i % 3),
  duration: `${14 + (i * 7) % 16}s`,
  delay: `${-((i * 3.7) % 20)}s`,
  color: ['#c4b5fd', '#f9a8d4', '#67e8f9', '#ffffff'][i % 4],
}));

// Salvataggio letto una volta all'avvio
const saved = loadSave();
const savedGame = saved.game ?? {};

const allPairs = wordCategories.flatMap(c => c.pairs);
const pairKey = (pair) => pair.join('|');
const pairsFor = (categoryId) => wordCategories.find(c => c.id === categoryId)?.pairs ?? allPairs;
const categoryLabelFor = (categoryId) => wordCategories.find(c => c.id === categoryId)?.label ?? 'Tutte le categorie';

export default function App() {
  // Punti della sessione, usati solo quando non è collegato un gruppo online
  const [sessionScores, setSessionScores] = useState({});

  // Stati principali: 'setup', 'distribution', 'playing', 'gameover'
  const [gameState, setGameState] = useState(savedGame.gameState ?? 'setup');

  // Setup state
  const [playersInput, setPlayersInput] = useState(saved.playersInput ?? []);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [rolesCount, setRolesCount] = useState(saved.rolesCount ?? { civili: 0, undercover: 0, mrWhite: 0 });
  const [category, setCategory] = useState(saved.category ?? 'all');
  const [usedPairs, setUsedPairs] = useState(saved.usedPairs ?? []);

  // Game state
  const [players, setPlayers] = useState(savedGame.players ?? []);
  const [civilianWord, setCivilianWord] = useState(savedGame.civilianWord ?? '');
  const [undercoverWord, setUndercoverWord] = useState(savedGame.undercoverWord ?? '');
  const [categoryLabel, setCategoryLabel] = useState(savedGame.categoryLabel ?? '');

  // Distribution state
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(savedGame.currentPlayerIndex ?? 0);
  const [isWordRevealed, setIsWordRevealed] = useState(false);

  // Game progress state
  const [winner, setWinner] = useState(savedGame.winner ?? null); // 'civili', 'undercover', 'mrWhite'
  const [eliminatedJustNow, setEliminatedJustNow] = useState(savedGame.eliminatedJustNow ?? null);
  const [mrWhiteGuess, setMrWhiteGuess] = useState('');
  const [eliminationOrder, setEliminationOrder] = useState(savedGame.eliminationOrder ?? []); // id in ordine di eliminazione
  const [isVoting, setIsVoting] = useState(false);
  const [spunRound, setSpunRound] = useState(0);
  const [timerDuration, setTimerDuration] = useState(saved.timerDuration ?? 60);

  const [showStats, setShowStats] = useState(false);
  const [muted, setMutedState] = useState(saved.muted ?? false);

  // Statistiche online (Firebase), condivise da chi usa lo stesso codice gruppo
  const [groupCode, setGroupCode] = useState(() => {
    const code = normalizeGroupCode(saved.groupCode ?? '');
    return isValidGroupCode(code) ? code : '';
  });
  const cloud = useGroupStats(groupCode);
  const [cloudSaveError, setCloudSaveError] = useState(null);
  const scores = groupCode ? cloud.scores : sessionScores;

  // Avatar scelti: sul telefono e, se c'è un gruppo, anche online (così li vedono tutti)
  const [localAvatars, setLocalAvatars] = useState(saved.avatars ?? {});
  const [pickingAvatarFor, setPickingAvatarFor] = useState(null);
  const avatars = groupCode ? { ...localAvatars, ...cloud.avatars } : localAvatars;
  const chooseAvatar = (name, id) => {
    setLocalAvatars(prev => ({ ...prev, [name]: id }));
    if (groupCode) setAvatarOnline(groupCode, name, id).catch(() => { /* resta comunque salvato sul telefono */ });
    sounds.pop();
    buzz(20);
  };

  // Salvataggio automatico a ogni cambiamento
  useEffect(() => {
    writeSave({
      playersInput, rolesCount, usedPairs, category, muted, timerDuration, groupCode, avatars: localAvatars,
      game: gameState === 'setup' ? null : {
        gameState, players, civilianWord, undercoverWord, currentPlayerIndex,
        winner, eliminatedJustNow, eliminationOrder, categoryLabel,
      },
    });
  }, [playersInput, rolesCount, usedPairs, category, muted, timerDuration, groupCode, localAvatars,
    gameState, players, civilianWord, undercoverWord, currentPlayerIndex, winner, eliminatedJustNow, eliminationOrder, categoryLabel]);

  useEffect(() => {
    setSoundMuted(muted);
  }, [muted]);

  // Onda di luce (e click) su ogni pulsante quando lo tocchi
  useEffect(() => {
    const handlePointerDown = (e) => {
      const btn = e.target.closest('button');
      if (!btn || btn.disabled) return;
      sounds.click();
      if (prefersReducedMotion()) return;
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2.2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - r.left - size / 2}px`;
      ripple.style.top = `${e.clientY - r.top - size / 2}px`;
      if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  // Luce di sfondo che segue il mouse (solo desktop)
  useEffect(() => {
    let frame;
    const handleMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--sx', `${e.clientX}px`);
        document.documentElement.style.setProperty('--sy', `${e.clientY}px`);
      });
    };
    window.addEventListener('pointermove', handleMove);
    return () => { window.removeEventListener('pointermove', handleMove); cancelAnimationFrame(frame); };
  }, []);

  // Festa del proprietario: il numero cambia a ogni arrivo, così l'animazione riparte
  const [ownerParty, setOwnerParty] = useState(0);
  const celebrateOwner = () => {
    buzz([100, 50, 100, 50, 300]);
    sounds.party();
    setOwnerParty(n => n + 1);
  };

  useEffect(() => {
    if (!ownerParty) return;
    const timeout = setTimeout(() => setOwnerParty(0), 6000);
    return () => clearTimeout(timeout);
  }, [ownerParty]);

  // --- LOGICA DI SETUP ---
  const addPlayer = (e) => {
    e.preventDefault();
    if (newPlayerName.trim() && !playersInput.includes(newPlayerName.trim())) {
      setPlayersInput([...playersInput, newPlayerName.trim()]);
      setRolesCount(prev => ({ ...prev, civili: prev.civili + 1 })); // Auto-incrementa civili
      setNewPlayerName('');
      sounds.pop();
      if (isOwner(newPlayerName)) celebrateOwner();
    }
  };

  const removePlayer = (indexToRemove) => {
    setPlayersInput(playersInput.filter((_, index) => index !== indexToRemove));
    // Aggiusta i ruoli per non superare il totale
    if (rolesCount.civili > 0) setRolesCount(prev => ({ ...prev, civili: prev.civili - 1 }));
    sounds.remove();
  };

  const updateRoleCount = (role, delta) => {
    setRolesCount(prev => {
      const newVal = prev[role] + delta;
      if (newVal < 0) return prev;
      return { ...prev, [role]: newVal };
    });
  };

  // Ruoli consigliati in base al numero di giocatori
  const suggestRoles = () => {
    const n = playersInput.length;
    if (n < 3) return;
    const mrWhite = n >= 5 ? 1 : 0;
    const undercover = n <= 6 ? 1 : n <= 8 ? 2 : Math.floor(n / 3);
    setRolesCount({ civili: n - undercover - mrWhite, undercover, mrWhite });
    sounds.reveal();
  };

  const totalRoles = rolesCount.civili + rolesCount.undercover + rolesCount.mrWhite;
  const isSetupValid = totalRoles === playersInput.length && rolesCount.civili > 0 && playersInput.length >= 3;

  const usedSet = new Set(usedPairs);
  const categoryPool = pairsFor(category);
  const freshPairsLeft = categoryPool.filter(p => !usedSet.has(pairKey(p))).length;

const startGame = () => {
    if (!isSetupValid) return;

    // Coppia mai uscita dalla categoria scelta; finite tutte, la categoria riparte da capo
    const pool = pairsFor(category);
    let freshPairs = pool.filter(p => !usedSet.has(pairKey(p)));
    let keptUsed = usedPairs;
    if (freshPairs.length === 0) {
      const poolKeys = new Set(pool.map(pairKey));
      keptUsed = usedPairs.filter(k => !poolKeys.has(k));
      freshPairs = pool;
    }
    const randomPair = freshPairs[Math.floor(Math.random() * freshPairs.length)];
    setUsedPairs([...keptUsed, pairKey(randomPair)]);
    setCategoryLabel(categoryLabelFor(category));

    const isFirstCiv = Math.random() > 0.5;
    const civWord = isFirstCiv ? randomPair[0] : randomPair[1];
    const undWord = isFirstCiv ? randomPair[1] : randomPair[0];

    setCivilianWord(civWord);
    setUndercoverWord(undWord);

    let rolesArray = [];
    for (let i = 0; i < rolesCount.civili; i++) rolesArray.push('Civile');
    for (let i = 0; i < rolesCount.undercover; i++) rolesArray.push('Undercover');
    for (let i = 0; i < rolesCount.mrWhite; i++) rolesArray.push('Mr. White');

    rolesArray = shuffleArray(rolesArray);

    // --- NUOVA LOGICA: MR. WHITE AL PRIMO POSTO AL 10% ---
    if (rolesArray[0] === 'Mr. White') {
      // Math.random() genera un numero tra 0 e 1.
      // Se è maggiore di 0.10 (cioè il 90% delle volte), spostiamo Mr. White.
      if (Math.random() > 0.10) {
        // Cerchiamo il primo ruolo nella lista che NON è Mr. White
        const swapIndex = rolesArray.findIndex(role => role !== 'Mr. White');
        if (swapIndex !== -1) {
          // Scambiamo i ruoli: Mr. White va in mezzo, l'altro va al primo posto
          rolesArray[0] = rolesArray[swapIndex];
          rolesArray[swapIndex] = 'Mr. White';
        }
      }
    }
    // ---------------------------------------------------

    const shuffledPlayersInput = shuffleArray(playersInput);

    const initializedPlayers = shuffledPlayersInput.map((name, index) => {
      const role = rolesArray[index];
      let word = '';
      if (role === 'Civile') word = civWord;
      else if (role === 'Undercover') word = undWord;
      else word = '???';

      return {
        id: index,
        name,
        role,
        word,
        isAlive: true
      };
    });

    setPlayers(initializedPlayers);
    setGameState('distribution');
    setCurrentPlayerIndex(0);
    setIsWordRevealed(false);
    setWinner(null);
    setEliminatedJustNow(null);
    setEliminationOrder([]);
    setIsVoting(false);
    setSpunRound(0);
  };

  // --- LOGICA DI DISTRIBUZIONE ---
  const handleReveal = () => {
    setIsWordRevealed(true);
    sounds.whoosh();
    sounds.reveal();
  };

  const handleNextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setIsWordRevealed(false);
    } else {
      setGameState('playing');
    }
  };

  // --- LOGICA DI GIOCO ---

  const eliminatePlayer = (id) => {
    const updatedPlayers = players.map(p => p.id === id ? { ...p, isAlive: false } : p);

    // Separa vivi e morti
    const alive = updatedPlayers.filter(p => p.isAlive);
    const dead = updatedPlayers.filter(p => !p.isAlive);

    // Mescola i vivi casualmente
    const shuffledAlive = shuffleArray(alive);

    // Ricomponi: prima i vivi mescolati, poi i morti
    const reordeindigoPlayers = [...shuffledAlive, ...dead];

    setPlayers(reordeindigoPlayers);
    const eliminatedPlayer = reordeindigoPlayers.find(p => p.id === id);
    setEliminatedJustNow(eliminatedPlayer);
    setEliminationOrder(prev => [...prev, id]);
    };

  // Eliminazione dal pulsante o dalla votazione: effetti + logica
  const handleEliminate = (id) => {
    buzz([60, 40, 120]);
    sounds.stamp();
    setIsVoting(false);
    eliminatePlayer(id);
  };

  // NUOVO: Funzione per aggiornare i punteggi a fine partita
  const updateScores = (winningRole) => {
    const points = {};
    players.forEach(player => {
      let pointsToAdd = 0;
      // Assegnazione punti in base alle regole
      if (winningRole === 'civili' && player.role === 'Civile') pointsToAdd = 2;
      if (winningRole === 'undercover' && player.role === 'Undercover') pointsToAdd = 10;
      if (winningRole === 'mrWhite' && player.role === 'Mr. White') pointsToAdd = 6;
      if (pointsToAdd > 0) points[player.name] = pointsToAdd;
    });

    // Con un gruppo online i punti vanno su Firebase insieme alle statistiche (vedi recordGame)
    if (!groupCode) {
      setSessionScores(prevScores => {
        const newScores = { ...prevScores };
        // Somma ai punti precedenti (o 0 se è la prima partita)
        Object.entries(points).forEach(([name, p]) => { newScores[name] = (newScores[name] || 0) + p; });
        return newScores;
      });
    }
    return points;
  };

  // Statistiche per giocatore + voce nello storico, salvate sul gruppo online
  const recordGame = (winningRole, mrWhiteGuessed, points) => {
    if (!groupCode) return;
    setCloudSaveError(null);
    recordGameOnline(groupCode, {
      players,
      winningRole,
      points,
      firstOutId: eliminationOrder[0],
      guesserName: mrWhiteGuessed ? eliminatedJustNow?.name : null,
      entry: {
        date: Date.now(),
        winner: winningRole,
        civilianWord,
        undercoverWord,
        category: categoryLabel,
        mrWhiteGuessed,
        players: players.map(p => ({ name: p.name, role: p.role, alive: p.isAlive })),
      },
    }).catch(err => setCloudSaveError(err?.code ?? 'sconosciuto'));
  };


  // Fine partita: vincitore, punti, statistiche, suono
  const endGame = (winningRole, { mrWhiteGuessed = false } = {}) => {
    setWinner(winningRole);
    const points = updateScores(winningRole); // Assegna punti
    recordGame(winningRole, mrWhiteGuessed, points);
    setGameState('gameover');
    setEliminatedJustNow(null);
    if (winningRole === 'civili') sounds.fanfare();
    else if (winningRole === 'undercover') sounds.sneaky();
    else sounds.ghost();
  };

// NUOVO: Controlla se la parola inserita da Mr. White è corretta
  const handleMrWhiteGuessSubmit = (e) => {
    e.preventDefault();
    if (!mrWhiteGuess.trim()) return;

    // Rende il controllo case-insensitive e toglie spazi extra
    const guess = mrWhiteGuess.trim().toLowerCase();
    const target = civilianWord.trim().toLowerCase();

    if (guess === target) {
      mrWhiteGuessedWord(); // Ha indovinato!
    } else {
      dismissEliminationMessage(); // Ha sbagliato, il gioco procede e lui è eliminato
    }
    setMrWhiteGuess(''); // Resetta il campo
  };


  const checkWinConditions = () => {
    const alivePlayers = players.filter(p => p.isAlive);
    const aliveCivilians = alivePlayers.filter(p => p.role === 'Civile').length;
    const aliveUndercovers = alivePlayers.filter(p => p.role === 'Undercover').length;
    const aliveMrWhites = alivePlayers.filter(p => p.role === 'Mr. White').length;

    if (aliveUndercovers === 0 && aliveMrWhites === 0) {
      endGame('civili');
    } else if (aliveUndercovers >= aliveCivilians && aliveMrWhites === 0) {
      endGame('undercover');
    } else if (aliveUndercovers + aliveCivilians === 1 && aliveMrWhites > 0) {
      endGame('mrWhite');
    } else {
      setEliminatedJustNow(null);
    }
  };


  const mrWhiteGuessedWord = () => {
    endGame('mrWhite', { mrWhiteGuessed: true }); // Assegna punti se indovina
  };


  const dismissEliminationMessage = () => {
    checkWinConditions();
  };

  const resetGame = () => {
    setGameState('setup');
    setWinner(null);
    setEliminatedJustNow(null);
    setMrWhiteGuess('');
    setEliminationOrder([]);
    setIsVoting(false);
  };

  const resetStats = () => {
    setSessionScores({});
    if (groupCode) return resetGroupOnline(groupCode);
  };

  const toggleMuted = () => {
    setMutedState(m => !m);
  };

  // --- RENDERS ---
  const renderSetup = () => (
    <div className="flex flex-col gap-6 sm:gap-8 w-full flex-1">
      <header className="text-center pt-2 animate-fadeIn">
        <div className="glass inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-[11px] sm:text-xs tracking-[0.25em] text-violet-200/80 uppercase mb-6">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          Missione classificata
        </div>
        <h1 className="font-display font-black tracking-tight leading-none text-[clamp(1.9rem,9.5vw,5.5rem)] animate-tracking-in">
          <span className="glitch" data-text="UNDERCOVER">
            <span className="text-gradient">UNDERCOVER</span>
          </span>
        </h1>
        <p className="mt-4 text-white/60 font-medium text-base sm:text-xl min-h-[1.5rem] sm:min-h-[1.75rem]">
          <Typewriter text="Trova l'impostore tra di voi!" delay={900} />
        </p>
        <button
          type="button"
          onClick={() => setShowStats(true)}
          className="btn-ghost mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
        >
          <ChartBar size={16} className="text-violet-300" /> Statistiche
          {groupCode
            ? <span className="flex items-center gap-1 text-white/45"><Cloud size={14} /> {groupCode}</span>
            : <span className="text-white/35">· solo sessione</span>}
        </button>
      </header>

      <div className="flex justify-center py-4 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        <Tilt glareClassName="hidden">
        <div className="relative polaroid w-64 sm:w-80">
          <div className="tape" />
          <img
            src={logoImage}
            alt="Logo Undercover"
            className="w-full aspect-[4/3] object-cover rounded-sm"
          />
          <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between font-mono text-[11px] sm:text-xs font-bold text-stone-600 tracking-widest">
            <span>SOGGETTO: MATTEO</span>
            <span>#007</span>
          </div>
          <div className="stamp absolute top-6 right-5 text-rose-600 bg-rose-50/85 text-xs sm:text-sm animate-stamp">
            Sospettato
          </div>
        </div>
        </Tilt>
      </div>

      <section className="glass rounded-[2rem] p-4 sm:p-8 space-y-5 animate-fadeIn" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display font-bold text-lg sm:text-2xl flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center">
              <Users size={20} className="text-violet-300" />
            </span>
            Giocatori
          </h2>
          <span className="font-mono text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
            {playersInput.length}
          </span>
        </div>

        <form onSubmit={addPlayer} className="flex gap-3">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Nome giocatore..."
            className="field flex-1 min-w-0 px-5 py-4 rounded-2xl text-lg"
          />
          <button type="submit" aria-label="Aggiungi giocatore" className="btn-primary px-5 sm:px-6 rounded-2xl">
            <UserPlus size={26} />
          </button>
        </form>

        {playersInput.length === 0 ? (
          <p className="text-center text-white/35 text-sm sm:text-base py-3 font-mono">
            Nessun agente reclutato… ancora.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2.5 max-h-64 overflow-y-auto pt-1">
            {playersInput.map((p, i) => (
              <div
                key={p}
                className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full text-base sm:text-lg font-semibold ${isOwner(p) ? 'owner-chip' : 'bg-white/5 border border-white/10 animate-bounce-in'}`}
              >
                <button
                  type="button"
                  onClick={() => !isOwner(p) && setPickingAvatarFor(p)}
                  aria-label={isOwner(p) ? 'Il Capo' : `Scegli l'avatar di ${p}`}
                  className={`relative rounded-full transition-transform ${isOwner(p) ? 'cursor-default' : 'hover:scale-110 active:scale-95'}`}
                >
                  <PlayerAvatar name={p} className="w-9 h-9" rounded="rounded-full" />
                  {!isOwner(p) && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-violet-500 border-2 border-[#1a1530] flex items-center justify-center">
                      <Pencil size={7} strokeWidth={3} />
                    </span>
                  )}
                </button>
                {p}
                <button
                  onClick={() => removePlayer(i)}
                  aria-label={`Rimuovi ${p}`}
                  className="text-white/30 hover:text-rose-400 transition-colors ml-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
        {playersInput.length > 0 && (
          <p className="text-xs sm:text-sm text-white/40 flex items-center gap-1.5">
            <Pencil size={12} /> Tocca un avatar per scegliere il tuo agente
          </p>
        )}
      </section>

      <section className="glass rounded-[2rem] p-4 sm:p-8 space-y-5 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display font-bold text-lg sm:text-2xl flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-fuchsia-500/20 border border-fuchsia-400/30 flex items-center justify-center">
              <HatGlasses size={20} className="text-fuchsia-300" />
            </span>
            Ruoli
          </h2>
          <button
            type="button"
            onClick={suggestRoles}
            disabled={playersInput.length < 3}
            className="btn-ghost ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold disabled:opacity-40"
          >
            <WandSparkles size={16} className="text-fuchsia-300" /> Auto
          </button>
          <span className={`font-mono text-sm px-3 py-1 rounded-full border ${
            isSetupValid
              ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-300'
              : 'bg-amber-400/10 border-amber-400/30 text-amber-300'
          }`}>
            {totalRoles}/{playersInput.length}
          </span>
        </div>

        <div className="space-y-3">
          {roleOptions.map(role => {
            const Icon = role.icon;
            return (
              <div key={role.id} className="flex items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <span className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center ${role.chip}`}>
                    <Icon size={22} className={role.accent} />
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-base sm:text-xl">{role.label}</div>
                    <div className="text-xs sm:text-base text-white/45">{role.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                  <button
                    onClick={() => updateRoleCount(role.id, -1)}
                    aria-label={`Meno ${role.label}`}
                    className="btn-ghost w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                  >
                    <Minus size={20} />
                  </button>
                  <span
                    key={rolesCount[role.id]}
                    className={`w-8 text-center font-display font-black text-2xl ${role.accent} animate-bounce-in`}
                  >
                    {rolesCount[role.id]}
                  </span>
                  <button
                    onClick={() => updateRoleCount(role.id, 1)}
                    aria-label={`Più ${role.label}`}
                    className="btn-ghost w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {!isSetupValid && (
          <div className="p-4 sm:p-5 bg-amber-400/[0.07] rounded-2xl flex items-start gap-3 text-sm sm:text-base text-amber-200/90 border border-amber-400/25">
            <AlertCircle size={22} className="mt-0.5 shrink-0 text-amber-300" />
            <p>I ruoli totali ({totalRoles}) devono essere uguali ai giocatori ({playersInput.length}). Servono almeno 3 giocatori e 1 Civile.</p>
          </div>
        )}
      </section>

      <section className="glass rounded-[2rem] p-4 sm:p-8 space-y-5 animate-fadeIn" style={{ animationDelay: '0.25s' }}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display font-bold text-lg sm:text-2xl flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
              <Layers size={20} className="text-cyan-300" />
            </span>
            Parole
          </h2>
          <span className="font-mono text-xs sm:text-sm px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
            {freshPairsLeft} nuove
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[{ id: 'all', label: 'Tutte', emoji: '🎯', pairs: allPairs }, ...wordCategories].map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm sm:text-base font-semibold transition-all active:scale-95 ${
                category === c.id
                  ? 'bg-cyan-400/20 border-cyan-300/60 text-white shadow-[0_0_20px_-6px_rgba(34,211,238,0.8)]'
                  : 'bg-white/5 border-white/10 text-white/65 hover:bg-white/10'
              }`}
            >
              <span>{c.emoji}</span>
              {c.label}
              <span className="font-mono text-xs opacity-50">{c.pairs.length}</span>
            </button>
          ))}
        </div>

        <p className="text-xs sm:text-sm text-white/45">
          {freshPairsLeft === 0
            ? 'Avete giocato tutte le coppie di questa categoria: dalla prossima partita si ricomincia da capo.'
            : 'Le coppie già uscite non tornano finché non le avete giocate tutte.'}
          {usedPairs.length > 0 && (
            <button type="button" onClick={() => setUsedPairs([])} className="ml-1.5 underline underline-offset-2 text-cyan-300/80 hover:text-cyan-200">
              Rimetti tutte in gioco
            </button>
          )}
        </p>
      </section>

      <div className="sticky bottom-4 z-20 mt-auto pt-2">
        <button
          onClick={startGame}
          disabled={!isSetupValid}
          className={`btn-primary w-full py-5 sm:py-6 rounded-2xl font-display font-bold text-lg sm:text-2xl tracking-wide flex items-center justify-center gap-3 ${isSetupValid ? 'animate-glow' : ''}`}
        >
          <Play size={28} fill="currentColor" /> INIZIA PARTITA
        </button>
      </div>
    </div>
  );

  const renderDistribution = () => {
    const player = players[currentPlayerIndex];
    const isMrWhite = player.role === 'Mr. White';
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full text-center">
        <div className="flex flex-col items-center gap-3 mb-8 animate-fadeIn">
          <div className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase text-white/50">
            Giocatore {currentPlayerIndex + 1} di {players.length}
          </div>
          <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
            {players.map((p, i) => (
              <span
                key={p.id}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i < currentPlayerIndex ? 'w-4 bg-violet-400'
                  : i === currentPlayerIndex ? 'w-10 bg-linear-to-r from-violet-400 to-fuchsia-400'
                  : 'w-4 bg-white/15'
                }`}
              />
            ))}
          </div>
        </div>

        {/* key: ogni giocatore riparte con la carta coperta, senza animazione di ritorno */}
        <div key={currentPlayerIndex} className="w-full flex flex-col items-center animate-fadeIn">
          <div className="mb-4 animate-bounce-in">
            <PlayerAvatar name={player.name} className="w-20 h-20 sm:w-24 sm:h-24 shadow-2xl" rounded="rounded-3xl" />
          </div>
          <p className="text-white/50 text-lg sm:text-xl font-medium">Passa il telefono a</p>
          <h2 className="font-display font-black text-4xl sm:text-6xl mt-2 mb-10 break-words max-w-full animate-blur-in">
            <span className={isOwner(player.name) ? 'text-gold' : 'text-gradient'}>{player.name}</span>
            {isOwner(player.name) && ' 👑'}
          </h2>

          <Tilt className="w-full max-w-sm sm:max-w-md" glareClassName="rounded-[2.5rem]" max={10}>
          <div className="flip w-full h-[440px] sm:h-[480px]">
            <div className={`flip-inner w-full h-full ${isWordRevealed ? 'is-flipped' : ''}`}>
              <button
                type="button"
                onClick={() => { buzz(25); handleReveal(); }}
                disabled={isWordRevealed}
                className="flip-face card-pattern group rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-center justify-center gap-8 p-8 cursor-pointer overflow-hidden"
              >
                <div className="absolute top-6 left-7 right-7 flex justify-between font-mono text-[10px] sm:text-xs tracking-[0.25em] text-white/40 uppercase">
                  <span>Top Secret</span>
                  <span>#{String(currentPlayerIndex + 1).padStart(3, '0')}</span>
                </div>
                <div className="relative w-32 h-32 sm:w-36 sm:h-36">
                  <span className="pulse-ring" />
                  <span className="pulse-ring" style={{ animationDelay: '1.2s' }} />
                  <div className="relative w-full h-full rounded-full bg-violet-500/15 border border-violet-400/40 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:bg-violet-500/25">
                    <Fingerprint size={72} strokeWidth={1.4} className="text-violet-200" />
                    <span className="scan-bar" />
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-xl sm:text-2xl">Tocca per rivelare</div>
                  <div className="text-white/45 text-sm sm:text-base mt-2">Assicurati che nessuno stia guardando</div>
                </div>
                <div className="absolute bottom-6 font-mono text-[10px] sm:text-xs tracking-[0.3em] text-white/25 uppercase">
                  Solo per i tuoi occhi
                </div>
              </button>

              <div className={`flip-face flip-back rounded-[2.5rem] border flex flex-col items-center justify-center p-7 sm:p-10 overflow-hidden ${
                isMrWhite
                  ? 'bg-linear-to-br from-white to-slate-300 text-slate-900 border-white shadow-[0_0_80px_-20px_rgba(255,255,255,0.6)]'
                  : 'card-pattern border-violet-400/30 shadow-[0_0_80px_-20px_rgba(167,139,250,0.7)]'
              }`}>
                {isWordRevealed && <span className="holo-sweep" aria-hidden="true" />}
                {isWordRevealed && (
                  <div className="flex flex-col items-center w-full gap-8 animate-fadeIn">
                    <div className={`font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.3em] ${isMrWhite ? 'text-slate-500' : 'text-violet-300/70'}`}>
                      {isMrWhite ? 'La tua identità' : 'La tua parola'}
                    </div>
                    {isMrWhite ? (
                      <div className="space-y-4">
                        <Ghost size={60} className="mx-auto animate-floaty" />
                        <div className="font-display font-black text-3xl sm:text-4xl leading-tight">TU SEI<br />MR. WHITE</div>
                        <p className="text-slate-600 text-base sm:text-lg max-w-[280px] mx-auto">Non hai nessuna parola. Ascolta gli altri e fingi!</p>
                      </div>
                    ) : (
                      <div className={`font-display font-black ${wordSize(player.word)} leading-tight break-words hyphens-auto w-full text-white drop-shadow-[0_0_30px_rgba(167,139,250,0.65)]`}>
                        <ScrambleText text={player.word} delay={300} />
                      </div>
                    )}
                    <button
                      onClick={handleNextPlayer}
                      className={`mt-2 w-full px-6 py-4 sm:py-5 rounded-full font-bold text-lg sm:text-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
                        isMrWhite ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 hover:bg-violet-100'
                      }`}
                    >
                      <EyeOff size={24} /> Nascondi e Prosegui
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          </Tilt>
        </div>
      </div>
    );
  };

  const renderPlaying = () => {
    const alivePlayers = players.filter(p => p.isAlive);
    const round = eliminationOrder.length + 1;
    const lastOutId = eliminationOrder[eliminationOrder.length - 1];
    // Timer, votazione e lista compaiono solo quando la roulette si è fermata
    const orderDone = spunRound >= round || prefersReducedMotion();
    const aliveCounts = [
      { label: 'Civili', icon: Shield, accent: 'text-emerald-300', count: players.filter(p => p.role === 'Civile' && p.isAlive).length },
      { label: 'Undercover', icon: VenetianMask, accent: 'text-rose-300', count: players.filter(p => p.role === 'Undercover' && p.isAlive).length },
      { label: 'Mr. White', icon: Ghost, accent: 'text-white', count: players.filter(p => p.role === 'Mr. White' && p.isAlive).length },
    ];

    return (
      // Niente animazioni su questo contenitore: un transform romperebbe il "fixed" della modale
      <div className="flex flex-col gap-5 sm:gap-6 w-full flex-1">
        {isVoting && !eliminatedJustNow && (
          <SecretVote voters={alivePlayers} onEliminate={handleEliminate} onClose={() => setIsVoting(false)} />
        )}

        {/* Modale Eliminazione */}
        {eliminatedJustNow && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md animate-fadeIn">
            <div className="fixed inset-0 bg-rose-600 pointer-events-none animate-flash" />
            <div className="min-h-full flex items-center justify-center p-4 sm:p-6 animate-shake">
              <div className="relative glass bg-[#120e24]/90 rounded-[2.5rem] p-7 sm:p-12 max-w-lg w-full text-center space-y-7 overflow-hidden animate-bounce-in">
                <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-rose-600/30 blur-3xl pointer-events-none" />

                <div className="relative mx-auto w-24 h-24 rounded-full bg-rose-500/15 border border-rose-400/40 flex items-center justify-center shadow-[0_0_60px_-5px_rgba(244,63,94,0.7)]">
                  <Skull size={52} className="text-rose-300" />
                </div>

                <div className="relative">
                  <h3 className="font-display font-black text-4xl sm:text-5xl break-words">{eliminatedJustNow.name}</h3>
                  <p className="text-xl sm:text-2xl text-white/55 mt-3">è stato eliminato!</p>
                </div>

                <div className={`relative p-6 sm:p-8 rounded-[1.75rem] bg-black/30 border border-white/10 ${roleStyles[eliminatedJustNow.role].glow}`}>
                  <div className="font-mono text-xs sm:text-sm font-bold text-white/40 uppercase tracking-[0.3em] mb-4">Il suo ruolo era</div>
                  <div className={`font-display font-black text-3xl sm:text-4xl ${roleStyles[eliminatedJustNow.role].text} animate-stamp`}>
                    <ScrambleText text={eliminatedJustNow.role} delay={350} duration={700} />
                  </div>
                </div>

                {eliminatedJustNow.role === 'Mr. White' ? (
                  <form onSubmit={handleMrWhiteGuessSubmit} className="relative space-y-5 pt-2">
                    <p className="text-base sm:text-lg font-bold text-amber-300">
                      Mr. White, hai un'ultima possibilità! Scrivi la parola dei Civili per vincere.
                    </p>
                    <input
                      type="text"
                      value={mrWhiteGuess}
                      onChange={(e) => setMrWhiteGuess(e.target.value)}
                      placeholder="Inserisci la parola segreta..."
                      className="field w-full px-5 py-4 rounded-2xl text-xl text-center font-bold focus:!border-amber-400/70 focus:!shadow-[0_0_0_4px_rgba(251,191,36,0.2)]"
                      autoFocus
                    />
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={!mrWhiteGuess.trim()}
                        className="flex-1 bg-linear-to-r from-amber-400 to-orange-500 text-amber-950 disabled:opacity-40 disabled:cursor-not-allowed py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl transition-all hover:brightness-110 active:scale-95 shadow-[0_10px_30px_-10px_rgba(251,191,36,0.7)]"
                      >
                        Conferma
                      </button>
                      <button
                        type="button"
                        onClick={() => { setMrWhiteGuess(''); dismissEliminationMessage(); }}
                        className="btn-ghost flex-1 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl"
                      >
                        Non lo so
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={dismissEliminationMessage}
                    className="btn-primary relative w-full py-5 rounded-2xl font-bold text-xl"
                  >
                    Continua
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <header className="text-center animate-fadeIn">
          <div key={round} className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.3em] uppercase text-rose-300/80 mb-3 animate-bounce-in">
            <Vote size={14} /> Round {round}
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl">Fase di Gioco</h2>
          <p className="text-white/55 text-base sm:text-lg mt-3">Discutete tra di voi e votate chi eliminare.</p>
        </header>

        <div className="animate-fadeIn" style={{ animationDelay: '0.05s' }}>
          <SpeakingOrder key={`order-${round}`} players={alivePlayers} onDone={() => setSpunRound(round)} />
        </div>

        {orderDone && (<>
        <div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <DiscussionTimer key={`timer-${round}`} duration={timerDuration} onDurationChange={setTimerDuration} />
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 animate-fadeIn" style={{ animationDelay: '0.15s' }}>
          {aliveCounts.map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass rounded-2xl p-3 sm:p-5 text-center">
                <Icon size={20} className={`mx-auto mb-1.5 ${stat.accent}`} />
                <div key={stat.count} className={`font-display font-black text-2xl sm:text-4xl ${stat.accent} animate-bounce-in`}>{stat.count}</div>
                <div className="text-[10px] sm:text-sm font-semibold text-white/50 uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <button
            type="button"
            onClick={() => setIsVoting(true)}
            className="w-full py-5 rounded-2xl font-display font-bold text-lg sm:text-xl flex items-center justify-center gap-3 bg-linear-to-r from-rose-500 via-fuchsia-600 to-violet-600 shadow-[0_14px_40px_-12px_rgba(244,63,94,0.8)] transition-all hover:brightness-110 active:scale-[0.98]"
          >
            <Vote size={24} /> Votazione segreta
          </button>
          <p className="text-center text-white/40 text-xs sm:text-sm mt-2">oppure eliminate direttamente dalla lista</p>
        </div>

        <div className="space-y-3 flex-1">
          {players.map((player, i) => {
            const isDying = !player.isAlive && player.id === lastOutId && !eliminatedJustNow;
            return (
            <div
              key={player.id}
              style={{ animationDelay: `${0.25 + i * 0.05}s` }}
              className={`relative flex items-center justify-between gap-3 p-3 sm:p-5 rounded-2xl border transition-all duration-500 ${
                isDying ? 'animate-die' : 'animate-fadeIn'
              } ${
                player.isAlive ? 'glass hover:border-white/20' : 'bg-white/[0.02] border-white/5'
              }`}
            >
              {isDying && <DeathBurst key={player.id} />}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="relative shrink-0">
                  <PlayerAvatar name={player.name} className="w-12 h-12 sm:w-14 sm:h-14 shadow-lg" rounded="rounded-2xl" dead={!player.isAlive} />
                  {!player.isAlive && (
                    <span className="absolute inset-0 flex items-center justify-center text-white/85">
                      <Skull size={22} />
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className={`font-bold text-lg sm:text-2xl truncate ${player.isAlive ? '' : 'line-through text-white/40'}`}>
                    {player.name}
                  </div>
                  {!player.isAlive && (
                    <span className={`inline-block mt-1 text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-full border ${roleStyles[player.role].badge}`}>
                      {player.role}
                    </span>
                  )}
                </div>
              </div>

              {player.isAlive && (
                <button
                  onClick={() => handleEliminate(player.id)}
                  className="shrink-0 flex items-center gap-2 bg-rose-500/15 text-rose-300 border border-rose-500/30 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold transition-all hover:bg-rose-500 hover:text-white hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.8)] active:scale-95"
                >
                  <Skull size={18} /> Elimina
                </button>
              )}
            </div>
            );
          })}
        </div>
        </>)}
      </div>
    );
  };

  const renderGameOver = () => {
    const theme = winThemes[winner] ?? winThemes.civili;
    const ranking = playersInput
      .map(name => ({ name, score: scores[name] || 0 }))
      .sort((a, b) => b.score - a.score);
    const maxScore = Math.max(1, ...ranking.map(r => r.score));
    const isMrWhiteWin = winner === 'mrWhite';

    return (
      <div className="relative flex flex-col w-full flex-1 justify-center text-center space-y-6 sm:space-y-8">
        <Confetti />

        <section
          className={`relative overflow-hidden glass spin-border rounded-[2.5rem] px-6 py-12 sm:p-14 border ${theme.ring} animate-bounce-in`}
          style={{ boxShadow: `0 0 120px -30px ${theme.glow}`, '--spin-color': theme.spin }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 0%, ${theme.glow}, transparent 65%)` }}
          />
          <Fireworks radius={70} />
          <div className="relative">
            <div className="relative inline-block mb-6 animate-drop"><div className="rays rays-sm" aria-hidden="true" /><div className="relative animate-floaty">
              {isMrWhiteWin
                ? <Ghost size={88} strokeWidth={1.5} className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]" />
                : <Crown size={88} strokeWidth={1.5} className="text-amber-300 drop-shadow-[0_0_25px_rgba(252,211,77,0.7)]" />}
              <Sparkles size={28} className="absolute -top-2 -right-6 text-amber-200 animate-pulse" />
            </div></div>
            <div className="font-mono text-xs sm:text-sm tracking-[0.35em] uppercase text-white/50 mb-4">Partita conclusa</div>
            <h2 className={`font-display font-black text-[clamp(1.75rem,8vw,3.75rem)] leading-[1.05] bg-linear-to-r ${theme.gradient} bg-clip-text text-transparent ${isMrWhiteWin ? 'animate-erase' : 'animate-blur-in'}`} style={{ animationDelay: isMrWhiteWin ? '1.2s' : '0.3s' }}>
              {theme.title}
            </h2>
            <p className="font-medium text-lg sm:text-2xl text-white/65 mt-5">{theme.desc}</p>
          </div>
        </section>

        <RoleReveal players={players} />

        <section className="glass rounded-[2rem] p-4 sm:p-10 space-y-5 text-left animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-display font-bold text-xl sm:text-3xl flex items-center gap-3">
            <Trophy size={28} className="text-amber-300" /> Classifica Punti
          </h3>
          {!groupCode ? (
            <button
              type="button"
              onClick={() => setShowStats(true)}
              className="w-full flex items-center gap-2 text-left text-sm text-amber-200/90 bg-amber-400/[0.07] border border-amber-400/25 rounded-xl px-3 py-2.5 hover:bg-amber-400/[0.12] transition-colors"
            >
              <CloudOff size={16} className="shrink-0" />
              <span>Punti validi solo per questa sessione. <span className="underline underline-offset-2">Collega un gruppo</span> per salvarli online.</span>
            </button>
          ) : cloudSaveError ? (
            <div className="flex items-center gap-2 text-sm text-rose-200 bg-rose-500/10 border border-rose-400/30 rounded-xl px-3 py-2.5">
              <CloudOff size={16} className="shrink-0" /> Salvataggio online non riuscito ({cloudSaveError}).
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Cloud size={16} className={cloud.status === 'online' ? 'text-emerald-300' : 'text-amber-300'} />
              {cloud.status === 'online'
                ? <>Salvato nel gruppo <span className="font-mono text-white/70">{groupCode}</span></>
                : 'Salvato sul telefono: si sincronizza appena torna la rete'}
            </div>
          )}
          <div className="space-y-3">
            {ranking.map(({ name, score }, i) => (
              <div
                key={name}
                style={{ animationDelay: `${0.3 + i * 0.08}s` }}
                className={`relative overflow-hidden flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border animate-slide-in ${
                  i === 0 && score > 0 ? 'border-amber-300/40 bg-amber-300/[0.06]' : 'border-white/5 bg-white/[0.03]'
                }`}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-linear-to-r from-violet-500/25 to-fuchsia-500/5 animate-grow"
                  style={{ width: `${(score / maxScore) * 100}%`, animationDelay: `${0.4 + i * 0.08}s` }}
                />
                <span className={`relative shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-display font-black ${
                  medalStyles[i] ?? 'bg-white/5 text-white/50'
                }`}>
                  {i + 1}
                </span>
                <PlayerAvatar name={name} className="w-9 h-9 sm:w-10 sm:h-10" rounded="rounded-lg" />
                <span className="relative flex-1 min-w-0 font-bold text-lg sm:text-xl truncate">{isOwner(name) && '👑 '}{name}</span>
                <span className="relative font-display font-black text-xl sm:text-2xl text-violet-200">
                  <CountUp value={score} delay={400 + i * 80} /><span className="text-sm text-white/40 ml-1">pt</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-[2rem] p-4 sm:p-10 space-y-5 text-left animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-display font-bold text-xl sm:text-3xl flex items-center gap-3">
            <Eye size={28} className="text-violet-300" /> Riepilogo Parole
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative overflow-hidden p-6 sm:p-8 rounded-[1.5rem] bg-emerald-400/[0.07] border border-emerald-400/25">
              <Shield size={120} className="absolute -right-5 -bottom-5 text-emerald-400/10" />
              <div className="font-mono text-xs sm:text-sm font-bold text-emerald-300/80 uppercase tracking-[0.25em] mb-2">Civili</div>
              <div className="relative font-display font-black text-2xl sm:text-4xl text-emerald-200 break-words">{civilianWord}</div>
            </div>
            <div className="relative overflow-hidden p-6 sm:p-8 rounded-[1.5rem] bg-rose-500/[0.07] border border-rose-400/25">
              <VenetianMask size={120} className="absolute -right-5 -bottom-5 text-rose-400/10" />
              <div className="font-mono text-xs sm:text-sm font-bold text-rose-300/80 uppercase tracking-[0.25em] mb-2">Undercover</div>
              <div className="relative font-display font-black text-2xl sm:text-4xl text-rose-200 break-words">{undercoverWord}</div>
            </div>
          </div>
        </section>

        <button
          onClick={resetGame}
          className="btn-primary group w-full py-6 sm:py-7 rounded-[2rem] font-display font-bold text-xl sm:text-2xl flex items-center justify-center gap-4 animate-fadeIn"
          style={{ animationDelay: '0.4s' }}
        >
          <RefreshCw size={28} className="transition-transform duration-500 group-hover:rotate-180" />
          Nuova Partita
        </button>

        <button
          type="button"
          onClick={() => setShowStats(true)}
          className="btn-ghost w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 animate-fadeIn"
          style={{ animationDelay: '0.5s' }}
        >
          <ChartBar size={20} className="text-violet-300" /> Statistiche
        </button>
      </div>
    );
  };


  return (
    <AvatarContext.Provider value={{ avatars }}>
    {/* Sfondo principale che copre tutto e permette lo scroll */}
    <div className="fixed inset-0 w-full h-full overflow-y-auto overflow-x-hidden font-sans text-white selection:bg-fuchsia-500/40">
      <div className="scene" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />
        <div className="scanline" />
        {particles.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={{ left: p.left, width: p.size, height: p.size, background: p.color, animationDuration: p.duration, animationDelay: p.delay }}
          />
        ))}
        <div className="spotlight" />
        <div className="grain" />
      </div>

      <div className="relative z-10 min-h-full w-full flex flex-col items-center py-8 sm:py-12 px-4 sm:px-8">
        {/* CONTENITORE GIOCO */}
        {/* Lampo di transizione a ogni cambio di fase */}
        <div key={`${gameState}-${showStats}`} className="phase-wipe" aria-hidden="true" />

        {/* Nascosto sopra le finestre a schermo intero, che hanno i loro pulsanti in alto */}
        {!(gameState === 'playing' && (isVoting || eliminatedJustNow)) && (
        <button
          type="button"
          onClick={toggleMuted}
          aria-label={muted ? 'Attiva i suoni' : 'Disattiva i suoni'}
          className="glass fixed top-3 right-3 sm:top-5 sm:right-5 z-30 w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        >
          {muted ? <VolumeX size={20} className="text-white/50" /> : <Volume2 size={20} className="text-violet-200" />}
        </button>
        )}
        {ownerParty > 0 && <OwnerParty key={ownerParty} onClose={() => setOwnerParty(0)} />}
        {pickingAvatarFor && (
          <AvatarPicker
            name={pickingAvatarFor}
            onChoose={(id) => { chooseAvatar(pickingAvatarFor, id); setPickingAvatarFor(null); }}
            onClose={() => setPickingAvatarFor(null)}
          />
        )}
        {/* Mr. White "cancella" lo schermo prima di mostrarsi */}
        {gameState === 'gameover' && winner === 'mrWhite' && !showStats && <div className="whiteout" aria-hidden="true" />}

        <main className="w-full max-w-2xl flex flex-col flex-1 isolate">
          {showStats ? (
            <StatsView
              stats={cloud.stats}
              history={cloud.history}
              scores={scores}
              groupCode={groupCode}
              cloudStatus={cloud.status}
              cloudError={cloud.error}
              onConnect={setGroupCode}
              onDisconnect={() => setGroupCode('')}
              onBack={() => setShowStats(false)}
              onReset={resetStats}
            />
          ) : (
            <>
              {gameState === 'setup' && renderSetup()}
              {gameState === 'distribution' && renderDistribution()}
              {gameState === 'playing' && renderPlaying()}
              {gameState === 'gameover' && renderGameOver()}
            </>
          )}
        </main>

        <footer className="mt-12 mb-2 text-white/40 font-semibold text-base sm:text-lg text-center">
          Made by{' '}
          <button type="button" onClick={celebrateOwner} className="font-bold text-gradient inline-block transition-transform hover:scale-110 hover:-rotate-3 cursor-pointer">Pisellino</button>
          {' '}with Love <span className="animate-heartbeat">❤️</span>
        </footer>
      </div>
    </div>
    </AvatarContext.Provider>
  );
}
