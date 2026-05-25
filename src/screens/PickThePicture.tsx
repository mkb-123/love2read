import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { findDeck, getAllLevels } from '../content';
import { selectSession } from '../lib/progress';
import { Layout } from '../components/Layout';
import { Celebration } from '../components/Celebration';
import { useProgress } from '../hooks/useProgress';
import { shuffle } from '../lib/random';
import type { Card } from '../lib/types';

function buildRounds(cards: Card[]): Card[] {
  return shuffle(cards.filter((c) => !!c.emoji));
}

function buildChoices(target: Card, deck: { cards: Card[] }): Card[] {
  const usedWords = new Set<string>([target.word]);
  const picked: Card[] = [];

  for (const c of shuffle(deck.cards)) {
    if (picked.length >= 2) break;
    if (c.emoji && !usedWords.has(c.word)) {
      picked.push(c);
      usedWords.add(c.word);
    }
  }
  if (picked.length < 2) {
    const all = getAllLevels().flatMap((l) => l.decks.flatMap((d) => d.cards));
    for (const c of shuffle(all)) {
      if (picked.length >= 2) break;
      if (c.emoji && !usedWords.has(c.word)) {
        picked.push(c);
        usedWords.add(c.word);
      }
    }
  }
  return shuffle([target, ...picked]);
}

export function PickThePicture() {
  const { levelId, deckId } = useParams<{ levelId: string; deckId: string }>();
  const nav = useNavigate();
  const { deck } = findDeck(levelId ?? '', deckId ?? '');
  const { progress, correct, wrong } = useProgress();
  const [seed, setSeed] = useState(0);

  const rounds = useMemo(() => {
    if (!deck) return [];
    const ids = selectSession(
      deck.cards.map((c) => c.id),
      progress,
      { sessionSize: deck.cards.length, newPerSession: deck.cards.length },
    );
    const idSet = new Set(ids);
    const eligible = deck.cards.filter((c) => idSet.has(c.id) && !!c.emoji);
    return buildRounds(eligible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, seed]);

  const [roundIdx, setRoundIdx] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const shownAt = useRef<number>(Date.now());

  const current = rounds[roundIdx];
  const choices = useMemo(
    () => (current && deck ? buildChoices(current, deck) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, deck, seed],
  );

  useEffect(() => {
    shownAt.current = Date.now();
  }, [roundIdx]);

  useEffect(() => {
    if (wrongId) {
      const t = window.setTimeout(() => setWrongId(null), 600);
      return () => window.clearTimeout(t);
    }
  }, [wrongId]);

  if (!deck) {
    return (
      <Layout>
        <p className="p-6 text-2xl">Deck not found.</p>
      </Layout>
    );
  }

  if (rounds.length === 0) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-3xl text-slate-700">
            Need more cards with pictures for this game.
          </p>
        </div>
      </Layout>
    );
  }

  const handlePick = (c: Card) => {
    if (!current) return;
    const elapsedMs = Date.now() - shownAt.current;
    if (c.id === current.id) {
      correct(current.id, { elapsedMs });
      setStreak((s) => s + 1);
      setRoundIdx((i) => i + 1);
    } else {
      wrong(current.id, { elapsedMs });
      setStreak(0);
      setWrongId(c.id);
    }
  };

  const done = roundIdx >= rounds.length;

  const restart = () => {
    setSeed((s) => s + 1);
    setRoundIdx(0);
    setStreak(0);
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full relative">
        <div className="flex justify-between items-center text-slate-600 text-xl md:text-2xl mb-4">
          <span>
            {Math.min(roundIdx + 1, rounds.length)} / {rounds.length}
          </span>
          <span className="font-bold text-orange-600">🔥 {streak}</span>
        </div>
        {!done && current && (
          <>
            <div className="flex-1 flex items-center justify-center relative">
              <motion.div
                key={current.id}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[2rem] shadow-2xl px-12 py-10 md:px-20 md:py-14"
              >
                <div className="text-7xl md:text-9xl font-extrabold text-slate-800 leading-none tracking-wide">
                  {current.word}
                </div>
              </motion.div>
            </div>
            <div className="grid grid-cols-3 gap-3 md:gap-4 mt-8">
              {choices.map((c) => (
                <motion.button
                  key={c.id}
                  onClick={() => handlePick(c)}
                  animate={wrongId === c.id ? { x: [0, -16, 16, -10, 10, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`aspect-square rounded-3xl shadow-lg bg-white text-6xl md:text-8xl flex items-center justify-center active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-yellow-300 touch-manipulation ${
                    wrongId === c.id ? 'bg-amber-100' : ''
                  }`}
                  aria-label={c.word}
                >
                  {c.emoji}
                </motion.button>
              ))}
            </div>
          </>
        )}
        <Celebration
          show={done}
          message="Brilliant reading"
          onAgain={restart}
          onHome={() => nav('/')}
        />
      </div>
    </Layout>
  );
}
