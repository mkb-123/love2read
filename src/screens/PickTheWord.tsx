import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { findDeck, getAllLevels } from '../content';
import { selectSession } from '../lib/progress';
import { Layout } from '../components/Layout';
import { BigEmoji } from '../components/BigEmoji';
import { StarBurst } from '../components/StarBurst';
import { Celebration } from '../components/Celebration';
import { useProgress } from '../hooks/useProgress';
import { shuffle, sample } from '../lib/random';
import type { Card } from '../lib/types';

const ROUNDS = 8;

function buildRounds(cards: Card[]): Card[] {
  const withEmoji = cards.filter((c) => !!c.emoji);
  return shuffle(withEmoji).slice(0, Math.min(ROUNDS, withEmoji.length));
}

function buildChoices(target: Card, deck: { cards: Card[] }): Card[] {
  const distractorPool = deck.cards.filter((c) => c.id !== target.id);
  let distractors = sample(distractorPool, 2);
  if (distractors.length < 2) {
    const others = getAllLevels().flatMap((l) => l.decks.flatMap((d) => d.cards)).filter(
      (c) => c.id !== target.id && !distractors.some((d) => d.id === c.id),
    );
    distractors = [...distractors, ...sample(others, 2 - distractors.length)];
  }
  return shuffle([target, ...distractors]);
}

export function PickTheWord() {
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
    );
    const idSet = new Set(ids);
    const eligible = deck.cards.filter((c) => idSet.has(c.id));
    return buildRounds(eligible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, seed]);

  const [roundIdx, setRoundIdx] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [burst, setBurst] = useState(false);
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
          <p className="text-slate-500 mt-2">
            Abstract words like 'the' and 'and' can be marked from the Parents page.
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
      setBurst(true);
      window.setTimeout(() => {
        setBurst(false);
        setRoundIdx((i) => i + 1);
      }, 700);
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
                className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-12"
              >
                <BigEmoji emoji={current.emoji} size="xl" />
              </motion.div>
              {burst && <StarBurst />}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {choices.map((c) => (
                <motion.button
                  key={c.id}
                  onClick={() => handlePick(c)}
                  animate={wrongId === c.id ? { x: [0, -16, 16, -10, 10, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                  className={`min-h-[88px] py-6 px-4 rounded-3xl bg-white shadow-lg text-5xl md:text-6xl font-extrabold text-slate-800 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-yellow-300 touch-manipulation ${
                    wrongId === c.id ? 'bg-amber-100' : ''
                  }`}
                >
                  {c.word}
                </motion.button>
              ))}
            </div>
          </>
        )}
        <Celebration
          show={done}
          message="Awesome work"
          onAgain={restart}
          onHome={() => nav('/')}
        />
      </div>
    </Layout>
  );
}
