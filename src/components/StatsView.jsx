import { useState } from 'react';
import { ArrowLeft, ChartBar, Cloud, CloudOff, Crown, Ghost, History, LogOut, Shield, Skull, Trash2, Trophy, VenetianMask } from 'lucide-react';
import { roleStyles } from '../lib';
import { PlayerAvatar } from '../avatars';
import { isValidGroupCode, normalizeGroupCode } from '../cloudStats';

const ROLE_ICONS = { 'Civile': Shield, 'Undercover': VenetianMask, 'Mr. White': Ghost };
const WINNER_LABELS = {
  civili: { label: 'Vincono i Civili', className: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30' },
  undercover: { label: 'Vincono gli Undercover', className: 'bg-rose-500/15 text-rose-300 border-rose-400/30' },
  mrWhite: { label: 'Vince Mr. White', className: 'bg-white/10 text-white border-white/30' },
};

const num = (v) => (Number.isFinite(v) ? v : 0);
const plural = (n, one, many) => (n === 1 ? one : many);
const roleStat = (s, role) => ({ played: num(s?.roles?.[role]?.played), won: num(s?.roles?.[role]?.won) });

// Chi ha il valore più alto (solo se maggiore di zero)
const leaderBy = (entries, getValue) => {
  let best = null;
  for (const e of entries) {
    const value = getValue(e);
    if (value > 0 && (!best || value > best.value)) best = { name: e.name, value };
  }
  return best;
};

const formatDate = (ts) => {
  try {
    return new Date(ts).toLocaleString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};

const STATUS_TEXT = {
  connecting: { text: 'Connessione…', className: 'text-white/50' },
  online: { text: 'Sincronizzato', className: 'text-emerald-300' },
  offline: { text: 'Offline: si sincronizza appena torna la rete', className: 'text-amber-300' },
};

const errorText = (code) => {
  if (code === 'permission-denied') return 'Accesso negato: le regole del database non sono impostate';
  if (typeof code === 'string' && code.startsWith('auth/')) return 'Accesso anonimo non riuscito: controlla la connessione';
  return `Errore di connessione (${code})`;
};

// Collega il telefono a un gruppo: stesso codice = stesse statistiche
function GroupPanel({ groupCode, status, error, onConnect, onDisconnect }) {
  const [draft, setDraft] = useState('');
  const code = normalizeGroupCode(draft);
  const valid = isValidGroupCode(code);

  if (!groupCode) {
    return (
      <section className="glass rounded-2xl p-4 sm:p-5 space-y-3 animate-fadeIn">
        <div className="flex items-center gap-2 font-display font-bold text-lg">
          <Cloud size={20} className="text-cyan-300" /> Statistiche online
        </div>
        <p className="text-sm text-white/55">
          Scegliete un codice segreto per il vostro gruppo. Tutti i telefoni con lo stesso codice condividono punti, statistiche e storico.
        </p>
        <form onSubmit={(e) => { e.preventDefault(); if (valid) onConnect(code); }} className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="es. amici-di-pisellino"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="field flex-1 min-w-0 px-4 py-3 rounded-xl"
          />
          <button type="submit" disabled={!valid} className="btn-primary px-5 rounded-xl font-bold">
            Collega
          </button>
        </form>
        {draft && (
          <p className="text-xs font-mono text-white/40">
            {valid ? `Codice: ${code}` : 'Almeno 4 caratteri: lettere, numeri o trattini'}
          </p>
        )}
      </section>
    );
  }

  const info = status === 'error'
    ? { text: errorText(error), className: 'text-rose-300' }
    : STATUS_TEXT[status] ?? STATUS_TEXT.connecting;
  const StatusIcon = status === 'error' || status === 'offline' ? CloudOff : Cloud;

  return (
    <section className="glass rounded-2xl p-4 flex items-center gap-3 animate-fadeIn">
      <span className="shrink-0 w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center">
        <StatusIcon size={20} className={info.className} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Gruppo</div>
        <div className="font-display font-bold truncate">{groupCode}</div>
        <div className={`text-xs ${info.className}`}>{info.text}</div>
      </div>
      <button type="button" onClick={onDisconnect} className="btn-ghost shrink-0 px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5">
        <LogOut size={16} /> Esci
      </button>
    </section>
  );
}

export default function StatsView({ stats, history, scores, groupCode, cloudStatus, cloudError, onConnect, onDisconnect, onBack, onReset }) {
  const [tab, setTab] = useState('players');
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetError, setResetError] = useState(null);

  const handleReset = () => {
    setConfirmReset(false);
    setResetError(null);
    Promise.resolve(onReset()).catch(err => setResetError(err?.code ?? 'sconosciuto'));
  };

  const names = [...new Set([...Object.keys(stats), ...Object.keys(scores)])];
  const entries = names
    .map(name => ({ name, s: stats[name] ?? {}, points: num(scores[name]) }))
    .sort((a, b) => b.points - a.points || num(b.s.wins) - num(a.s.wins));

  const titles = [
    { icon: Trophy, color: 'text-amber-300', title: 'Campione', unit: () => 'pt', best: leaderBy(entries, e => e.points) },
    { icon: VenetianMask, color: 'text-rose-300', title: 'Miglior bugiardo', unit: v => `${plural(v, 'vittoria', 'vittorie')} da Undercover`, best: leaderBy(entries, e => roleStat(e.s, 'Undercover').won) },
    { icon: Ghost, color: 'text-white', title: 'Mr. White indovino', unit: v => plural(v, 'parola indovinata', 'parole indovinate'), best: leaderBy(entries, e => num(e.s.mrWhiteGuesses)) },
    { icon: Shield, color: 'text-emerald-300', title: 'Civile modello', unit: v => `${plural(v, 'vittoria', 'vittorie')} da Civile`, best: leaderBy(entries, e => roleStat(e.s, 'Civile').won) },
  ];

  return (
    <div className="flex flex-col gap-6 w-full flex-1">
      <header className="flex items-center gap-3 animate-fadeIn">
        <button type="button" onClick={onBack} aria-label="Indietro" className="btn-ghost w-11 h-11 rounded-full flex items-center justify-center shrink-0">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-display font-black text-3xl sm:text-4xl">Statistiche</h2>
      </header>

      <GroupPanel
        key={groupCode}
        groupCode={groupCode}
        status={cloudStatus}
        error={cloudError}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      />

      {!groupCode ? (
        <p className="text-center text-white/40 text-sm px-4">
          Senza un gruppo i punti valgono solo per questa sessione e le statistiche non vengono salvate.
        </p>
      ) : (<>

      <div className="grid grid-cols-2 gap-3 animate-fadeIn" style={{ animationDelay: '0.05s' }}>
        {titles.map(({ icon, color, title, unit, best }) => {
          const Icon = icon;
          return (
          <div key={title} className="glass rounded-2xl p-4">
            <Icon size={22} className={color} />
            <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/45 mt-2">{title}</div>
            <div className="font-display font-black text-lg sm:text-xl truncate mt-1">{best ? best.name : '—'}</div>
            <div className="text-xs sm:text-sm text-white/45">{best ? `${best.value} ${unit(best.value)}` : 'ancora nessuno'}</div>
          </div>
          );
        })}
      </div>

      <div className="glass rounded-full p-1 flex animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        {[['players', 'Giocatori', ChartBar], ['history', 'Storico', History]].map(([id, label, icon]) => {
          const Icon = icon;
          return (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex-1 py-2.5 rounded-full font-bold flex items-center justify-center gap-2 transition-colors ${
              tab === id ? 'bg-white text-slate-900' : 'text-white/60 hover:text-white'
            }`}
          >
            <Icon size={18} /> {label}
          </button>
          );
        })}
      </div>

      {tab === 'players' && (
        <div className="space-y-3">
          {entries.length === 0 && <p className="text-center text-white/40 font-mono py-8">Nessuna partita giocata… ancora.</p>}
          {entries.map(({ name, s, points }, i) => {
            const games = num(s.games);
            const wins = num(s.wins);
            return (
              <div key={name} className="glass rounded-2xl p-4 animate-slide-in" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
                <div className="flex items-center gap-3">
                  <PlayerAvatar name={name} className="w-12 h-12" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg truncate">{name}</div>
                    <div className="text-sm text-white/50">
                      {games} {plural(games, 'partita', 'partite')} · {wins} {plural(wins, 'vinta', 'vinte')}{games > 0 && ` (${Math.round((wins / games) * 100)}%)`}
                    </div>
                  </div>
                  <div className="font-display font-black text-2xl text-violet-200">{points}<span className="text-sm text-white/40 ml-1">pt</span></div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {Object.entries(ROLE_ICONS).map(([role, icon]) => {
                    const Icon = icon;
                    const { played, won } = roleStat(s, role);
                    return (
                      <div key={role} className="rounded-xl bg-white/[0.04] border border-white/5 px-2 py-2 text-center">
                        <Icon size={16} className={`mx-auto ${roleStyles[role].text}`} />
                        <div className="text-sm font-bold mt-1">{won}/{played}</div>
                        <div className="text-[10px] uppercase tracking-wider text-white/40 truncate">{role}</div>
                      </div>
                    );
                  })}
                </div>
                {(num(s.firstOut) > 0 || num(s.mrWhiteGuesses) > 0) && (
                  <div className="flex flex-wrap gap-2 mt-3 text-xs sm:text-sm text-white/55">
                    {num(s.firstOut) > 0 && <span className="flex items-center gap-1"><Skull size={14} /> primo eliminato {s.firstOut} {plural(s.firstOut, 'volta', 'volte')}</span>}
                    {num(s.mrWhiteGuesses) > 0 && <span className="flex items-center gap-1"><Ghost size={14} /> ha indovinato {s.mrWhiteGuesses} {plural(s.mrWhiteGuesses, 'parola', 'parole')}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-3">
          {history.length === 0 && <p className="text-center text-white/40 font-mono py-8">Lo storico è vuoto.</p>}
          {history.map((game, i) => {
            const winner = WINNER_LABELS[game.winner] ?? WINNER_LABELS.civili;
            return (
              <div key={`${game.date}-${i}`} className="glass rounded-2xl p-4 space-y-3 animate-slide-in" style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs sm:text-sm font-bold px-2.5 py-1 rounded-full border ${winner.className}`}>{winner.label}</span>
                  <span className="font-mono text-xs text-white/40">{formatDate(game.date)}</span>
                </div>
                <div className="font-display font-bold text-lg">
                  <span className="text-emerald-300">{game.civilianWord}</span>
                  <span className="text-white/30 mx-2">vs</span>
                  <span className="text-rose-300">{game.undercoverWord}</span>
                </div>
                {game.category && <div className="text-xs text-white/40 font-mono uppercase tracking-widest">{game.category}</div>}
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(game.players) ? game.players : []).map(p => (
                    <span
                      key={p.name}
                      className={`text-xs sm:text-sm font-semibold px-2 py-0.5 rounded-full border ${roleStyles[p.role]?.badge ?? 'border-white/10'} ${p.alive ? '' : 'opacity-50 line-through'}`}
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="pt-2">
        {confirmReset ? (
          <div className="glass rounded-2xl p-4 text-center space-y-3 animate-bounce-in">
            <p className="font-semibold">Cancellare punteggi, statistiche e storico per tutto il gruppo <span className="font-mono">{groupCode}</span>?</p>
            <div className="flex gap-2">
              <button type="button" onClick={handleReset} className="flex-1 py-3 rounded-xl font-bold bg-rose-500 hover:bg-rose-600 transition-colors">
                Sì, cancella
              </button>
              <button type="button" onClick={() => setConfirmReset(false)} className="btn-ghost flex-1 py-3 rounded-xl font-bold">
                No
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmReset(true)} className="w-full py-3 rounded-2xl text-white/45 hover:text-rose-300 font-semibold flex items-center justify-center gap-2 transition-colors">
            <Trash2 size={16} /> Azzera statistiche del gruppo
          </button>
        )}
        {resetError && <p className="text-center text-sm text-rose-300 mt-2">Azzeramento non riuscito ({resetError}).</p>}
      </div>
      </>)}
    </div>
  );
}
