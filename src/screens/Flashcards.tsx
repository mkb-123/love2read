import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { findDeck } from '../content';
import { Layout } from '../components/Layout';
import { CardFace } from '../components/CardFace';
import { Button } from '../components/Button';
import { useProgress } from '../hooks/useProgress';
import { shuffle } from '../lib/random';

export function Flashcards() {
  const { levelId, deckId } = useParams<{ levelId: string; deckId: string }>();
  const nav = useNavigate();
  const { deck } = findDeck(levelId ?? '', deckId ?? '');
  const { seen } = useProgress();
  const [seed, setSeed] = useState(0);

  const order = useMemo(() => {
    if (!deck) return [];
    return shuffle(deck.cards);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, seed]);

  const [index, setIndex] = useState(0);

  if (!deck) {
    return (
      <Layout>
        <p className="p-6 text-2xl">Deck not found.</p>
      </Layout>
    );
  }

  const current = order[index];
  const done = index >= order.length;

  const advance = () => {
    if (current) seen(current.id);
    setIndex((i) => i + 1);
  };

  const goBack = () => {
    setIndex((i) => Math.max(0, i - 1));
  };

  const restart = () => {
    setSeed((s) => s + 1);
    setIndex(0);
  };

  const base = `/deck/${levelId}/${deckId}`;

  return (
    <Layout>
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full relative">
        <div className="flex justify-between items-center text-slate-600 text-xl md:text-2xl mb-4">
          <span>
            {Math.min(index + 1, order.length)} / {order.length}
          </span>
          <span className="text-slate-500 text-base md:text-lg">
            Read together
          </span>
        </div>
        <div
          onClick={advance}
          className="flex-1 flex items-center justify-center relative cursor-pointer"
        >
          <AnimatePresence mode="wait">
            {!done && current && (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 80, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -80, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl"
              >
                <CardFace card={current} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {!done && (
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button
              onClick={goBack}
              disabled={index === 0}
              className="bg-slate-200 text-slate-700 disabled:opacity-40"
            >
              ← Back
            </Button>
            <Button onClick={advance} className="bg-sky-500 text-white">
              Next →
            </Button>
          </div>
        )}
        {done && (
          <div className="flex flex-col items-center gap-6 mt-6 pb-2">
            <p className="text-3xl md:text-4xl text-slate-700 text-center">
              Want to test it? 🎯
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full md:max-w-xl">
              <Button
                onClick={() => nav(`${base}/pick`)}
                className="bg-amber-500 text-white"
              >
                👉 Pick the Word
              </Button>
              <Button
                onClick={() => nav(`${base}/match`)}
                className="bg-emerald-500 text-white"
              >
                🃏 Match Pairs
              </Button>
              <Button onClick={restart} className="bg-sky-500 text-white">
                🔁 Read again
              </Button>
              <Button
                onClick={() => nav('/')}
                className="bg-slate-500 text-white"
              >
                🏠 Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
