import { useEffect, useState } from 'react';
import { Check, Lock, Skull, Vote, X } from 'lucide-react';
import { buzz, prefersReducedMotion } from '../lib';
import { PlayerAvatar } from '../avatars';
import { sounds } from '../sounds';

function Avatar({ name, size = 'w-12 h-12' }) {
  return <PlayerAvatar name={name} className={size} />;
}

// Votazione segreta: il telefono passa di mano, ognuno vota di nascosto,
// poi i voti vengono rivelati uno alla volta.
// stage: 'pass' → 'choose' → (prossimo votante) … → 'ready' → 'reveal' → 'result'
export default function SecretVote({ voters, onEliminate, onClose }) {
  const [candidateIds, setCandidateIds] = useState(() => voters.map(p => p.id));
  const [ballots, setBallots] = useState([]); // [{ voterId, targetId }] in ordine di voto
  const [voterIndex, setVoterIndex] = useState(0);
  const [stage, setStage] = useState('pass');
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(0);
  const [isRevote, setIsRevote] = useState(false);

  const byId = (id) => voters.find(p => p.id === id);
  const voter = voters[voterIndex];
  const candidates = candidateIds.map(byId);

  // Rivelazione: un voto alla volta, con rullo di tamburi
  useEffect(() => {
    if (stage !== 'reveal') return;
    const fast = prefersReducedMotion();
    if (revealed >= ballots.length) {
      const timeout = setTimeout(() => setStage('result'), fast ? 0 : 700);
      return () => clearTimeout(timeout);
    }
    if (!fast) sounds.drumroll(0.8);
    const timeout = setTimeout(() => {
      setRevealed(r => r + 1);
      sounds.vote();
    }, fast ? 0 : 1000);
    return () => clearTimeout(timeout);
  }, [stage, revealed, ballots.length]);

  const confirmVote = () => {
    if (selected === null) return;
    sounds.vote();
    buzz(30);
    setBallots(b => [...b, { voterId: voter.id, targetId: selected }]);
    setSelected(null);
    if (voterIndex + 1 < voters.length) {
      setVoterIndex(voterIndex + 1);
      setStage('pass');
    } else {
      setStage('ready');
    }
  };

  const tally = candidateIds.map(id => ({
    player: byId(id),
    votes: ballots.slice(0, revealed).filter(b => b.targetId === id).length,
  }));
  const maxVotes = Math.max(0, ...tally.map(t => t.votes));
  const leaders = tally.filter(t => t.votes === maxVotes && maxVotes > 0).map(t => t.player);

  const revoteBetween = (players) => {
    setCandidateIds(players.map(p => p.id));
    setBallots([]);
    setVoterIndex(0);
    setRevealed(0);
    setSelected(null);
    setIsRevote(true);
    setStage('pass');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#07060f]/95 backdrop-blur-xl animate-fadeIn">
      <div className="min-h-full flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="font-mono text-xs tracking-[0.3em] uppercase text-rose-300/80 flex items-center gap-2">
              <Vote size={14} /> {isRevote ? 'Ballottaggio' : 'Votazione segreta'}
            </div>
            <button type="button" onClick={onClose} className="btn-ghost rounded-full px-3 py-1.5 text-sm font-semibold flex items-center gap-1.5">
              <X size={16} /> Annulla
            </button>
          </div>

          {(stage === 'pass' || stage === 'choose') && (
            <div className="flex justify-center gap-1.5 mb-8">
              {voters.map((p, i) => (
                <span key={p.id} className={`h-1.5 rounded-full transition-all duration-500 ${
                  i < voterIndex ? 'w-4 bg-rose-400' : i === voterIndex ? 'w-10 bg-linear-to-r from-rose-400 to-fuchsia-400' : 'w-4 bg-white/15'
                }`} />
              ))}
            </div>
          )}

          {stage === 'pass' && (
            <div key={`pass-${voterIndex}`} className="text-center space-y-8 animate-fadeIn">
              <div className="relative mx-auto w-24 h-24">
                <PlayerAvatar name={voter.name} className="w-24 h-24 shadow-[0_0_60px_-10px_rgba(244,63,94,0.7)]" rounded="rounded-3xl" />
                <span className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-rose-500 border-4 border-[#07060f] flex items-center justify-center">
                  <Lock size={16} />
                </span>
              </div>
              <div>
                <p className="text-white/50 text-lg">Passa il telefono a</p>
                <h2 className="font-display font-black text-4xl sm:text-5xl mt-2 break-words animate-blur-in">
                  <span className="text-gradient">{voter.name}</span>
                </h2>
                <p className="text-white/40 text-sm mt-3">Gli altri non guardano!</p>
              </div>
              <button type="button" onClick={() => setStage('choose')} className="btn-primary w-full py-5 rounded-2xl font-display font-bold text-lg">
                Sono {voter.name}, voglio votare
              </button>
            </div>
          )}

          {stage === 'choose' && (
            <div key={`choose-${voterIndex}`} className="space-y-5 animate-fadeIn">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-center">
                {voter.name}, chi vuoi eliminare?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {candidates.filter(p => p.id !== voter.id).map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelected(p.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all active:scale-95 ${
                      selected === p.id
                        ? 'bg-rose-500/20 border-rose-400/60 shadow-[0_0_30px_-8px_rgba(244,63,94,0.8)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <Avatar name={p.name} />
                    <span className="flex-1 min-w-0 font-bold text-lg truncate">{p.name}</span>
                    {selected === p.id && <Check size={22} className="text-rose-300 animate-bounce-in" />}
                  </button>
                ))}
              </div>
              <button
                type="button"
                disabled={selected === null}
                onClick={confirmVote}
                className="btn-primary w-full py-5 rounded-2xl font-display font-bold text-lg"
              >
                Conferma voto
              </button>
            </div>
          )}

          {stage === 'ready' && (
            <div className="text-center space-y-8 animate-bounce-in">
              <div className="text-6xl">🤫</div>
              <div>
                <h2 className="font-display font-black text-3xl sm:text-4xl">Tutti hanno votato</h2>
                <p className="text-white/55 mt-3 text-lg">Rimettete il telefono al centro del tavolo.</p>
              </div>
              <button type="button" onClick={() => setStage('reveal')} className="btn-primary animate-glow w-full py-5 rounded-2xl font-display font-bold text-lg">
                Rivela i voti
              </button>
            </div>
          )}

          {(stage === 'reveal' || stage === 'result') && (
            <div className="space-y-5">
              <div className="space-y-2">
                {ballots.slice(0, revealed).map((b, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-2xl border animate-slide-in ${
                      i === revealed - 1 && stage === 'reveal' ? 'bg-rose-500/15 border-rose-400/40' : 'bg-white/[0.04] border-white/10'
                    }`}
                  >
                    <span className="flex-1 min-w-0 font-semibold truncate text-right">{byId(b.voterId).name}</span>
                    <span className="text-rose-300 font-mono text-sm shrink-0">vota →</span>
                    <span className="flex-1 min-w-0 font-display font-bold truncate">{byId(b.targetId).name}</span>
                  </div>
                ))}
                {stage === 'reveal' && revealed < ballots.length && (
                  <div className="p-3 rounded-2xl border border-dashed border-white/15 text-center text-white/40 font-mono text-sm animate-pulse">
                    Voto {revealed + 1} di {ballots.length}…
                  </div>
                )}
              </div>

              <div className="glass rounded-2xl p-4 space-y-2.5">
                {tally.map(({ player, votes }) => (
                  <div key={player.id} className="flex items-center gap-3">
                    <Avatar name={player.name} size="w-8 h-8" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-sm font-semibold mb-1">
                        <span className="truncate">{player.name}</span>
                        <span className="font-mono text-rose-200">{votes}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-rose-500 to-fuchsia-500 transition-all duration-700"
                          style={{ width: `${ballots.length ? (votes / ballots.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {stage === 'result' && (
                <div className="text-center space-y-4 animate-bounce-in">
                  {leaders.length === 1 ? (
                    <>
                      <h2 className="font-display font-black text-3xl sm:text-4xl">
                        <span className="text-gradient">{leaders[0].name}</span> è il più votato!
                      </h2>
                      <button
                        type="button"
                        onClick={() => onEliminate(leaders[0].id)}
                        className="w-full py-5 rounded-2xl font-display font-bold text-lg flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 transition-colors shadow-[0_14px_40px_-12px_rgba(244,63,94,0.9)]"
                      >
                        <Skull size={22} /> Elimina {leaders[0].name}
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="font-display font-black text-3xl sm:text-4xl">Pareggio!</h2>
                      <p className="text-white/55">{leaders.map(p => p.name).join(' e ')} hanno gli stessi voti.</p>
                      <button type="button" onClick={() => revoteBetween(leaders)} className="btn-primary w-full py-4 rounded-2xl font-bold text-lg">
                        Ballottaggio tra loro
                      </button>
                      <div className="text-white/40 text-sm font-mono uppercase tracking-widest pt-2">oppure decidete voi</div>
                      <div className="grid grid-cols-2 gap-2">
                        {leaders.map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => onEliminate(p.id)}
                            className="py-3 rounded-xl font-bold bg-rose-500/15 text-rose-200 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-colors truncate px-2"
                          >
                            Elimina {p.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
