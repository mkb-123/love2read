import { useMemo, useState } from 'react';
import { LEVELS } from '../content';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { useChildName } from '../hooks/useChildName';
import { useProgress } from '../hooks/useProgress';
import { avgResponseTime, currentStreak, isDue } from '../lib/progress';
import type { Box, Card, CardProgress, Deck } from '../lib/types';

function classify(p: CardProgress | undefined): 'new' | 'learning' | 'mastered' {
  if (!p || p.box === 0) return 'new';
  if (p.box >= 5) return 'mastered';
  return 'learning';
}

function timeLabel(ms: number | null): string {
  if (ms === null) return '—';
  return `${(ms / 1000).toFixed(1)}s`;
}

function whenDue(p: CardProgress | undefined): string {
  if (!p || !p.nextDue) return 'now';
  const ms = new Date(p.nextDue).getTime() - Date.now();
  if (ms <= 0) return 'now';
  const days = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return days === 1 ? 'tomorrow' : `in ${days} days`;
}

function DeckStats({
  deck,
  progress,
  onSetBox,
}: {
  deck: Deck;
  progress: Record<string, CardProgress>;
  onSetBox: (id: string, box: Box) => void;
}) {
  const [open, setOpen] = useState(false);
  const stats = useMemo(() => {
    const groups = { new: 0, learning: 0, mastered: 0 };
    deck.cards.forEach((c) => {
      groups[classify(progress[c.id])] += 1;
    });
    return groups;
  }, [deck, progress]);

  const sortedCards = useMemo(() => {
    return [...deck.cards].sort((a, b) => {
      const ap = progress[a.id];
      const bp = progress[b.id];
      const ac = ap?.correct ?? 0;
      const bc = bp?.correct ?? 0;
      const aRate = ap && ap.seen > 0 ? ac / ap.seen : -1;
      const bRate = bp && bp.seen > 0 ? bc / bp.seen : -1;
      return aRate - bRate;
    });
  }, [deck, progress]);

  return (
    <section className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 text-left"
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl md:text-5xl">{deck.emoji}</span>
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-slate-800">
              {deck.title}
            </h3>
            <p className="text-slate-500 text-sm md:text-base">
              {deck.cards.length} cards · {stats.mastered} mastered ·{' '}
              {stats.learning} learning · {stats.new} new
            </p>
          </div>
        </div>
        <span className="text-2xl text-slate-400">{open ? '▾' : '▸'}</span>
      </button>
      {open && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-sm border-b border-slate-200">
                <th className="py-2 pr-4">Word</th>
                <th className="py-2 pr-4">Box</th>
                <th className="py-2 pr-4">Correct</th>
                <th className="py-2 pr-4">Avg time</th>
                <th className="py-2 pr-4">Next due</th>
                <th className="py-2 pr-4">Mark</th>
              </tr>
            </thead>
            <tbody>
              {sortedCards.map((c: Card) => {
                const p = progress[c.id];
                const status = classify(p);
                const due = p ? isDue(progress, c.id) : true;
                return (
                  <tr key={c.id} className="border-b border-slate-100">
                    <td className="py-2 pr-4 text-lg font-bold text-slate-800">
                      {c.word}
                    </td>
                    <td className="py-2 pr-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                          status === 'mastered'
                            ? 'bg-emerald-100 text-emerald-700'
                            : status === 'learning'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p?.box ?? 0}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-slate-700">
                      {p ? `${p.correct} / ${p.seen}` : '—'}
                    </td>
                    <td className="py-2 pr-4 text-slate-700">
                      {timeLabel(avgResponseTime(p))}
                    </td>
                    <td className="py-2 pr-4 text-slate-700">
                      {due ? <span className="text-rose-600">now</span> : whenDue(p)}
                    </td>
                    <td className="py-2 pr-4">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          aria-label="mark new"
                          onClick={() => onSetBox(c.id, 0)}
                          className="px-2 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          New
                        </button>
                        <button
                          type="button"
                          aria-label="mark practising"
                          onClick={() => onSetBox(c.id, 2)}
                          className="px-2 py-1 text-xs rounded bg-amber-100 hover:bg-amber-200 text-amber-800"
                        >
                          Practising
                        </button>
                        <button
                          type="button"
                          aria-label="mark known"
                          onClick={() => onSetBox(c.id, 6)}
                          className="px-2 py-1 text-xs rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                        >
                          Knows
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function Parents() {
  const { name, save } = useChildName();
  const { progress, reset, setManual } = useProgress();
  const [input, setInput] = useState(name);
  const [savedFlash, setSavedFlash] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const streak = currentStreak();

  const totals = useMemo(() => {
    let seen = 0;
    let correct = 0;
    let mastered = 0;
    let learning = 0;
    let fresh = 0;
    let totalCards = 0;
    for (const level of LEVELS) {
      for (const deck of level.decks) {
        for (const card of deck.cards) {
          totalCards += 1;
          const p = progress[card.id];
          if (p) {
            seen += p.seen;
            correct += p.correct;
          }
          const cls = classify(p);
          if (cls === 'mastered') mastered += 1;
          else if (cls === 'learning') learning += 1;
          else fresh += 1;
        }
      }
    }
    return { seen, correct, mastered, learning, fresh, totalCards };
  }, [progress]);

  const onSave = () => {
    save(input);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1500);
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col p-6 md:p-10 max-w-4xl mx-auto w-full gap-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">
          For Parents
        </h1>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
            <div className="text-3xl md:text-4xl font-extrabold text-emerald-600">
              {totals.mastered}
            </div>
            <div className="text-slate-600 text-sm md:text-base">mastered</div>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
            <div className="text-3xl md:text-4xl font-extrabold text-amber-600">
              {totals.learning}
            </div>
            <div className="text-slate-600 text-sm md:text-base">learning</div>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
            <div className="text-3xl md:text-4xl font-extrabold text-slate-600">
              {totals.fresh}
            </div>
            <div className="text-slate-600 text-sm md:text-base">new</div>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg">
            <div className="text-3xl md:text-4xl font-extrabold text-rose-600">
              🔥 {streak}
            </div>
            <div className="text-slate-600 text-sm md:text-base">
              day{streak === 1 ? '' : 's'} streak
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">
            All time
          </h2>
          <p className="text-slate-700 text-lg">
            {totals.correct} correct out of {totals.seen} attempts across{' '}
            {totals.totalCards} cards.
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Spaced repetition: each correct answer pushes a card into a higher
            box (0–6). Higher boxes mean longer gaps before she sees that word
            again. Fast correct answers (under 3s) count double.
          </p>
        </section>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-2">
          Decks
        </h2>
        {LEVELS.flatMap((l) => l.decks).map((deck) => (
          <DeckStats
            key={deck.id}
            deck={deck}
            progress={progress}
            onSetBox={(id, box) => setManual(id, box)}
          />
        ))}

        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">
            Child's name
          </h2>
          <p className="text-slate-600 mb-4">
            Used in celebration messages ("Well done, [name]!").
          </p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a name"
            className="w-full text-2xl p-4 rounded-2xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
          />
          <div className="flex items-center gap-4 mt-4">
            <Button onClick={onSave} className="bg-emerald-500 text-white">
              Save
            </Button>
            {savedFlash && <span className="text-emerald-700 text-xl">✓ Saved</span>}
          </div>
        </section>

        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">
            Reset progress
          </h2>
          <p className="text-slate-600 mb-4">
            Clears everything — boxes, streak, history.
          </p>
          {!confirmReset ? (
            <Button
              onClick={() => setConfirmReset(true)}
              className="bg-amber-500 text-white"
            >
              Reset all progress
            </Button>
          ) : (
            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={() => {
                  reset();
                  setConfirmReset(false);
                }}
                className="bg-red-500 text-white"
              >
                Yes, reset
              </Button>
              <Button
                onClick={() => setConfirmReset(false)}
                className="bg-slate-300 text-slate-800"
              >
                Cancel
              </Button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
