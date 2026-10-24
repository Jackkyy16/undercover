import { useState } from 'react';
import { Eye, EyeOff, Fingerprint, Ghost, X } from 'lucide-react';
import { buzz, wordSize } from '../lib';
import { PlayerAvatar } from '../avatars';
import { sounds } from '../sounds';

// Durante la partita un giocatore ancora in gioco può rivedere di nascosto la sua parola.
// Come nella distribuzione non si vede il ruolo: l'Undercover vede solo la sua parola,
// Mr. White scopre di nuovo di non averne una.
// stage: 'pick' → 'pass' → 'show'
export default function WordCheck({ players, onClose }) {
  const [playerId, setPlayerId] = useState(null);
  const [stage, setStage] = useState('pick');

  const player = players.find(p => p.id === playerId);
  const isMrWhite = player?.role === 'Mr. White';

  const pick = (id) => {
    setPlayerId(id);
    setStage('pass');
  };

  const reveal = () => {
    buzz(25);
    sounds.whoosh();
    sounds.reveal();
    setStage('show');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#07060f]/95 backdrop-blur-xl animate-fadeIn">
      <div className="min-h-full flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="font-mono text-xs tracking-[0.3em] uppercase text-violet-300/80 flex items-center gap-2">
              <Eye size={14} /> Rivedi la parola
            </div>
            <button type="button" onClick={onClose} className="btn-ghost rounded-full px-3 py-1.5 text-sm font-semibold flex items-center gap-1.5">
              <X size={16} /> Chiudi
            </button>
          </div>

          {stage === 'pick' && (
            <div className="space-y-5 animate-fadeIn">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-center">Chi vuole rivedere la sua parola?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {players.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => pick(p.id)}
                    className="flex items-center gap-3 p-3 rounded-2xl border text-left transition-all active:scale-95 bg-white/5 border-white/10 hover:bg-white/10"
                  >
                    <PlayerAvatar name={p.name} className="w-12 h-12" />
                    <span className="flex-1 min-w-0 font-bold text-lg truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {stage === 'pass' && (
            <div className="text-center space-y-8 animate-fadeIn">
              <PlayerAvatar name={player.name} className="mx-auto w-24 h-24 shadow-[0_0_60px_-10px_rgba(167,139,250,0.7)]" rounded="rounded-3xl" />
              <div>
                <p className="text-white/50 text-lg">Passa il telefono a</p>
                <h2 className="font-display font-black text-4xl sm:text-5xl mt-2 break-words animate-blur-in">
                  <span className="text-gradient">{player.name}</span>
                </h2>
                <p className="text-white/40 text-sm mt-3">Gli altri non guardano!</p>
              </div>
              <button type="button" onClick={reveal} className="btn-primary w-full py-5 rounded-2xl font-display font-bold text-lg flex items-center justify-center gap-3">
                <Fingerprint size={24} /> Sono {player.name}, mostra
              </button>
            </div>
          )}

          {stage === 'show' && (
            <div className={`relative rounded-[2.5rem] border flex flex-col items-center justify-center gap-8 p-7 sm:p-10 min-h-[360px] text-center overflow-hidden animate-bounce-in ${
              isMrWhite
                ? 'bg-linear-to-br from-white to-slate-300 text-slate-900 border-white shadow-[0_0_80px_-20px_rgba(255,255,255,0.6)]'
                : 'card-pattern border-violet-400/30 shadow-[0_0_80px_-20px_rgba(167,139,250,0.7)]'
            }`}>
              <span className="holo-sweep" aria-hidden="true" />
              <div className={`font-mono text-xs sm:text-sm font-bold uppercase tracking-[0.3em] ${isMrWhite ? 'text-slate-500' : 'text-violet-300/70'}`}>
                {isMrWhite ? 'La tua identità' : 'La tua parola'}
              </div>
              {isMrWhite ? (
                <div className="space-y-4">
                  <Ghost size={60} className="mx-auto animate-floaty" />
                  <div className="font-display font-black text-3xl sm:text-4xl leading-tight">TU SEI<br />MR. WHITE</div>
                  <p className="text-slate-600 text-base sm:text-lg max-w-[280px] mx-auto">Non hai nessuna parola. Continua a fingere!</p>
                </div>
              ) : (
                <div className={`font-display font-black ${wordSize(player.word)} leading-tight break-words hyphens-auto w-full text-white drop-shadow-[0_0_30px_rgba(167,139,250,0.65)]`}>
                  {player.word}
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                className={`w-full px-6 py-4 sm:py-5 rounded-full font-bold text-lg sm:text-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
                  isMrWhite ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-900 hover:bg-violet-100'
                }`}
              >
                <EyeOff size={24} /> Nascondi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
