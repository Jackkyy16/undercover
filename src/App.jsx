
import './index.css'
import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Trash2, Eye, EyeOff, Play, Skull, Crown, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';

// --- DIZIONARIO PAROLE ---
const wordPairs = [
  ['Mela', 'Pera'],
  ['Gatto', 'Cane'],
  ['Oceano', 'Mare'],
  ['Treno', 'Aereo'],
  ['Pizza', 'Pasta'],
  ['Computer', 'Smartphone'],
  ['Sole', 'Luna'],
  ['Chitarra', 'Pianoforte'],
  ['Vino', 'Birra'],
  ['Montagna', 'Collina'],
  ['Bicicletta', 'Moto'],
  ['Zucchero', 'Sale'],
  ['Burro', 'Margarina'],
  ['Sci', 'Snowboard'],
  ['Orologio', 'Sveglia'],
  ['Piscina', 'Vasca'],
  ['Hotel', 'Ostello'],
  ['Libro', 'Giornale'],
  ['Zaino', 'Valigia'],
  ['Teatro', 'Cinema']
];

// --- FUNZIONI DI UTILITA' ---
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function App() {
  // Stati principali: 'setup', 'distribution', 'playing', 'gameover'
  const [gameState, setGameState] = useState('setup');
  
  // Setup state
  const [playersInput, setPlayersInput] = useState(['Alice', 'Bob', 'Charlie', 'Diana', 'Edoardo']);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [rolesCount, setRolesCount] = useState({ civili: 3, undercover: 1, mrWhite: 1 });
  
  // Game state
  const [players, setPlayers] = useState([]);
  const [civilianWord, setCivilianWord] = useState('');
  const [undercoverWord, setUndercoverWord] = useState('');
  
  // Distribution state
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isWordRevealed, setIsWordRevealed] = useState(false);
  
  // Game progress state
  const [winner, setWinner] = useState(null); // 'civili', 'undercover', 'mrWhite'
  const [eliminatedJustNow, setEliminatedJustNow] = useState(null);

  // --- LOGICA DI SETUP ---
  const addPlayer = (e) => {
    e.preventDefault();
    if (newPlayerName.trim() && !playersInput.includes(newPlayerName.trim())) {
      setPlayersInput([...playersInput, newPlayerName.trim()]);
      setRolesCount(prev => ({ ...prev, civili: prev.civili + 1 })); // Auto-incrementa civili
      setNewPlayerName('');
    }
  };

  const removePlayer = (indexToRemove) => {
    setPlayersInput(playersInput.filter((_, index) => index !== indexToRemove));
    // Aggiusta i ruoli per non superare il totale
    if (rolesCount.civili > 0) setRolesCount(prev => ({ ...prev, civili: prev.civili - 1 }));
  };

  const updateRoleCount = (role, delta) => {
    setRolesCount(prev => {
      const newVal = prev[role] + delta;
      if (newVal < 0) return prev;
      return { ...prev, [role]: newVal };
    });
  };

  const totalRoles = rolesCount.civili + rolesCount.undercover + rolesCount.mrWhite;
  const isSetupValid = totalRoles === playersInput.length && rolesCount.civili > 0 && playersInput.length >= 3;

  const startGame = () => {
    if (!isSetupValid) return;

    const randomPair = wordPairs[Math.floor(Math.random() * wordPairs.length)];
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

    const initializedPlayers = playersInput.map((name, index) => {
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
  };

  // --- LOGICA DI DISTRIBUZIONE ---
  const handleReveal = () => setIsWordRevealed(true);
  
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
    setPlayers(updatedPlayers);
    
    const eliminatedPlayer = updatedPlayers.find(p => p.id === id);
    setEliminatedJustNow(eliminatedPlayer);
  };

  const checkWinConditions = () => {
    const alivePlayers = players.filter(p => p.isAlive);
    const aliveCivilians = alivePlayers.filter(p => p.role === 'Civile').length;
    const aliveUndercovers = alivePlayers.filter(p => p.role === 'Undercover').length;
    const aliveMrWhites = alivePlayers.filter(p => p.role === 'Mr. White').length;

    if (aliveUndercovers === 0 && aliveMrWhites === 0) {
      setWinner('civili');
      setGameState('gameover');
      setEliminatedJustNow(null);
    } else if (aliveUndercovers >= aliveCivilians && aliveMrWhites === 0) {
      setWinner('undercover');
      setGameState('gameover');
      setEliminatedJustNow(null);
    } else if (aliveUndercovers + aliveCivilians === 1 && aliveMrWhites > 0) {
       setWinner('mrWhite');
       setGameState('gameover');
       setEliminatedJustNow(null);
    } else {
       setEliminatedJustNow(null);
    }
  };

  const mrWhiteGuessedWord = () => {
    setWinner('mrWhite');
    setGameState('gameover');
    setEliminatedJustNow(null);
  };

  const dismissEliminationMessage = () => {
    checkWinConditions();
  };

  const resetGame = () => {
    setGameState('setup');
    setWinner(null);
    setEliminatedJustNow(null);
  };

  // --- RENDERS ---
  const renderSetup = () => (
    <div className="flex flex-col gap-8 w-full p-8 sm:p-12 animate-fadeIn flex-1">
      <div className="text-center space-y-3 mb-6">
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-slate-800">UNDERCOVER</h1>
        <p className="text-slate-500 font-medium sm:text-xl">Trova l'impostore tra di voi!</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3 text-slate-700">
          <Users size={28} className="text-indigo-500"/> 
          Giocatori ({playersInput.length})
        </h2>
        
        <form onSubmit={addPlayer} className="flex gap-3">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Nome giocatore..."
            className="flex-1 px-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-xl"
          />
          <button type="submit" className="bg-indigo-500 text-white px-6 py-3 rounded-xl hover:bg-indigo-600 transition-colors">
            <UserPlus size={28} />
          </button>
        </form>

        <div className="flex flex-wrap gap-3 max-h-60 overflow-y-auto pt-2">
          {playersInput.map((p, i) => (
            <div key={i} className="flex items-center gap-3 bg-slate-100 px-5 py-3 rounded-xl text-base sm:text-lg font-medium text-slate-700">
              {p}
              <button onClick={() => removePlayer(i)} className="text-slate-400 hover:text-red-500 transition-colors ml-2">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-700">Distribuzione Ruoli</h2>
        
        <div className="space-y-6">
          {[
            { id: 'civili', label: 'Civili', desc: 'Hanno la parola segreta', color: 'text-emerald-500', bg: 'bg-emerald-100' },
            { id: 'undercover', label: 'Undercover', desc: 'Hanno una parola simile', color: 'text-rose-500', bg: 'bg-rose-100' },
            { id: 'mrWhite', label: 'Mr. White', desc: 'Non ha nessuna parola', color: 'text-slate-500', bg: 'bg-slate-200' }
          ].map(role => (
            <div key={role.id} className="flex items-center justify-between">
              <div>
                <div className={`font-semibold text-xl flex items-center gap-3`}>
                  <span className={`w-4 h-4 rounded-full ${role.bg}`}></span>
                  {role.label}
                </div>
                <div className="text-base text-slate-500 mt-1">{role.desc}</div>
              </div>
              <div className="flex items-center gap-5">
                <button 
                  onClick={() => updateRoleCount(role.id, -1)}
                  className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold hover:bg-slate-200 transition-colors text-2xl"
                >-</button>
                <span className="w-8 text-center font-bold text-2xl">{rolesCount[role.id]}</span>
                <button 
                  onClick={() => updateRoleCount(role.id, 1)}
                  className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold hover:bg-slate-200 transition-colors text-2xl"
                >+</button>
              </div>
            </div>
          ))}
        </div>

        {!isSetupValid && (
          <div className="p-5 bg-amber-50 rounded-xl flex items-start gap-4 text-base sm:text-lg text-amber-700 border border-amber-200 mt-6">
            <AlertCircle size={24} className="mt-0.5 shrink-0" />
            <p>I ruoli totali ({totalRoles}) devono essere uguali ai giocatori ({playersInput.length}). Servono almeno 3 giocatori e 1 Civile.</p>
          </div>
        )}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={startGame}
          disabled={!isSetupValid}
          className={`w-full py-6 rounded-2xl text-2xl font-bold flex items-center justify-center gap-4 transition-all ${
            isSetupValid ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Play size={32} /> INIZIA PARTITA
        </button>
      </div>
    </div>
  );

  const renderDistribution = () => {
    const player = players[currentPlayerIndex];
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full p-8 sm:p-12 text-center animate-fadeIn">
        <div className="mb-10 text-slate-500 font-medium text-lg sm:text-xl">
          Giocatore {currentPlayerIndex + 1} di {players.length}
        </div>
        
        <h2 className="text-5xl sm:text-6xl font-black text-slate-800 mb-12">
          Passa a <br/> <span className="text-indigo-600 mt-4 block">{player.name}</span>
        </h2>

        <div className="bg-white w-full max-w-sm sm:max-w-xl rounded-[3rem] p-10 sm:p-16 shadow-2xl border border-slate-100 min-h-[400px] flex flex-col items-center justify-center transition-all duration-300">
          {!isWordRevealed ? (
            <button
              onClick={handleReveal}
              className="group flex flex-col items-center gap-8 cursor-pointer"
            >
              <div className="w-32 h-32 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <Eye size={64} className="text-indigo-500" />
              </div>
              <span className="font-bold text-slate-600 text-2xl">Tocca per rivelare</span>
            </button>
          ) : (
            <div className="space-y-10 flex flex-col items-center animate-fadeIn w-full">
              <div className="text-base sm:text-lg font-bold uppercase tracking-widest text-slate-400">La tua parola</div>
              {player.role === 'Mr. White' ? (
                <div className="space-y-6">
                  <div className="text-4xl sm:text-5xl font-black text-slate-800">TU SEI MR. WHITE</div>
                  <p className="text-slate-500 text-lg sm:text-xl max-w-[300px] mx-auto">Non hai nessuna parola. Ascolta gli altri e fingi!</p>
                </div>
              ) : (
                <div className="text-6xl sm:text-7xl font-black text-indigo-600 break-words w-full px-4">{player.word}</div>
              )}
              
              <button
                onClick={handleNextPlayer}
                className="mt-12 bg-slate-800 text-white px-10 py-5 rounded-full font-bold text-xl flex items-center gap-4 hover:bg-slate-700 transition-colors w-full justify-center"
              >
                <EyeOff size={28} /> Nascondi e Prosegui
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPlaying = () => (
    <div className="flex flex-col w-full p-8 sm:p-12 flex-1 relative animate-fadeIn">
      {/* Modale Eliminazione */}
      {eliminatedJustNow && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6 sm:rounded-[3rem]">
          <div className="bg-white rounded-[2.5rem] p-10 sm:p-12 max-w-lg w-full text-center space-y-8 shadow-2xl animate-bounce-in">
            <Skull size={88} className="mx-auto text-slate-800" />
            <div>
              <h3 className="text-5xl font-black text-slate-800">{eliminatedJustNow.name}</h3>
              <p className="text-2xl text-slate-500 mt-3">è stato eliminato!</p>
            </div>
            
            <div className="p-8 bg-slate-100 rounded-[2rem]">
              <div className="text-base font-bold text-slate-400 uppercase mb-3">Il suo ruolo era</div>
              <div className={`text-4xl font-black ${
                eliminatedJustNow.role === 'Civile' ? 'text-emerald-500' : 
                eliminatedJustNow.role === 'Undercover' ? 'text-rose-500' : 'text-slate-600'
              }`}>
                {eliminatedJustNow.role}
              </div>
            </div>

            {eliminatedJustNow.role === 'Mr. White' ? (
              <div className="space-y-6 pt-4">
                <p className="text-lg font-bold text-amber-600">Mr. White, hai un'ultima possibilità! Indovina la parola dei Civili per vincere.</p>
                <div className="flex gap-4">
                  <button onClick={mrWhiteGuessedWord} className="flex-1 bg-amber-500 text-white py-5 rounded-2xl font-bold text-xl hover:bg-amber-600 transition-colors">Indovinato!</button>
                  <button onClick={dismissEliminationMessage} className="flex-1 bg-slate-200 text-slate-700 py-5 rounded-2xl font-bold text-xl hover:bg-slate-300 transition-colors">Sbagliato</button>
                </div>
              </div>
            ) : (
              <button 
                onClick={dismissEliminationMessage}
                className="w-full bg-indigo-600 text-white py-5 mt-6 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-colors"
              >
                Continua
              </button>
            )}
          </div>
        </div>
      )}

      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-800">Fase di Gioco</h2>
        <p className="text-slate-500 text-lg mt-3">Discutete tra di voi e votate chi eliminare.</p>
      </div>

      <div className="space-y-5 flex-1 overflow-y-auto pb-8">
        {players.map((player) => (
          <div 
            key={player.id} 
            className={`flex items-center justify-between p-6 sm:p-8 rounded-[1.5rem] border transition-all ${
              player.isAlive ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-60 grayscale'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl ${
                player.isAlive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-500'
              }`}>
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className={`font-bold text-xl sm:text-2xl ${player.isAlive ? 'text-slate-800' : 'text-slate-500 line-through'}`}>
                  {player.name}
                </div>
                {!player.isAlive && (
                  <div className="text-base font-semibold text-rose-500 mt-1">{player.role}</div>
                )}
              </div>
            </div>
            
            {player.isAlive && (
              <button 
                onClick={() => eliminatePlayer(player.id)}
                className="bg-rose-100 text-rose-600 px-6 py-3 rounded-xl text-base sm:text-lg font-bold hover:bg-rose-200 transition-colors"
              >
                Elimina
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-6 bg-indigo-50 rounded-[1.5rem] border border-indigo-100 text-center">
        <div className="text-base font-bold text-indigo-800 mb-3">Stato Partita</div>
        <div className="flex justify-center gap-8 text-base font-bold text-indigo-600">
          <span>{players.filter(p => p.role === 'Civile' && p.isAlive).length} Civili</span>
          <span>{players.filter(p => p.role === 'Undercover' && p.isAlive).length} Undercover</span>
          <span>{players.filter(p => p.role === 'Mr. White' && p.isAlive).length} Mr. White</span>
        </div>
      </div>
    </div>
  );

  const renderGameOver = () => {
    let winTitle = '';
    let winColor = '';
    let winDesc = '';

    if (winner === 'civili') {
      winTitle = 'I CIVILI VINCONO!';
      winColor = 'text-emerald-500 bg-emerald-50 border-emerald-100';
      winDesc = 'Hanno trovato tutti gli impostori.';
    } else if (winner === 'undercover') {
      winTitle = 'GLI UNDERCOVER VINCONO!';
      winColor = 'text-rose-500 bg-rose-50 border-rose-100';
      winDesc = 'Sono riusciti a mimetizzarsi perfettamente.';
    } else if (winner === 'mrWhite') {
      winTitle = 'MR. WHITE VINCE!';
      winColor = 'text-slate-800 bg-slate-100 border-slate-200';
      winDesc = 'Ha indovinato la parola o è sopravvissuto fino alla fine!';
    }

    return (
      <div className="flex flex-col w-full p-8 sm:p-12 flex-1 justify-center text-center animate-fadeIn space-y-10">
        <div className={`p-12 rounded-[3rem] ${winColor} border`}>
          <Crown size={96} className="mx-auto mb-8 opacity-80" />
          <h2 className="text-5xl sm:text-6xl font-black mb-6">{winTitle}</h2>
          <p className="font-medium text-xl sm:text-2xl opacity-80">{winDesc}</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 p-10 space-y-8">
          <h3 className="text-3xl font-bold text-slate-800">Riepilogo Parole</h3>
          <div className="grid grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
              <div className="text-base font-bold text-emerald-600 uppercase mb-3">Civili</div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-800 break-words">{civilianWord}</div>
            </div>
            <div className="bg-rose-50 p-8 rounded-[2rem] border border-rose-100">
              <div className="text-base font-bold text-rose-600 uppercase mb-3">Undercover</div>
              <div className="text-3xl sm:text-4xl font-black text-rose-800 break-words">{undercoverWord}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 p-10">
          <h3 className="text-3xl font-bold text-slate-800 mb-8">Ruoli finali</h3>
          <div className="space-y-4 text-left">
            {players.map(p => (
              <div key={p.id} className="flex justify-between items-center py-4 border-b border-slate-100 last:border-0 text-xl">
                <span className="font-bold text-slate-700">{p.name}</span>
                <span className={`font-bold ${
                  p.role === 'Civile' ? 'text-emerald-500' : 
                  p.role === 'Undercover' ? 'text-rose-500' : 'text-slate-500'
                }`}>
                  {p.role} {p.role !== 'Mr. White' && <span className="text-slate-300 font-normal ml-3">({p.word})</span>}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={resetGame}
          className="w-full bg-slate-800 text-white py-6 rounded-3xl font-bold text-2xl flex items-center justify-center gap-4 hover:bg-slate-700 transition-colors mt-6"
        >
          <RefreshCw size={28} /> Nuova Partita
        </button>
      </div>
    );
  };

  return (
    // Il contenitore root ora è "fixed inset-0" per coprire tutto lo schermo ed eliminare lo sfondo nero di default
    <div className="fixed inset-0 w-full h-full overflow-y-auto bg-[#e2e8f0] font-sans text-slate-900 selection:bg-indigo-100">
      <div className="min-h-full flex items-center justify-center sm:p-8">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes bounceIn { 
            0% { opacity: 0; transform: scale(0.9); } 
            50% { opacity: 1; transform: scale(1.05); } 
            100% { opacity: 1; transform: scale(1); } 
          }
          .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
          .animate-bounce-in { animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        `}} />
        
        {/* Contenitore Principale (Ora impostato a max-w-4xl, molto più largo) */}
        <div className="w-full max-w-4xl bg-slate-50 sm:bg-white sm:shadow-2xl sm:rounded-[3rem] sm:border border-slate-200 flex flex-col relative mx-auto sm:min-h-[85vh]">
          {gameState === 'setup' && renderSetup()}
          {gameState === 'distribution' && renderDistribution()}
          {gameState === 'playing' && renderPlaying()}
          {gameState === 'gameover' && renderGameOver()}
        </div>
      </div>
    </div>
  );
}