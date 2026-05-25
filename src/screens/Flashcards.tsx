import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { findDeck } from '../content';
import { Layout } from '../components/Layout';
import { CardFace } from '../components/CardFace';
import { Button } from '../components/Button';
import { StarBurst } from '../components/StarBurst';
import { Celebration } from '../components/Celebration';
import { useProgress } from '../hooks/useProgress';
import { useShuffle } from '../hooks/useShuffle';

export function Flashcards() {
  const { levelId, deckId } = useParams<{ levelId: string; deckId: string }>();
  const nav = useNavigate();
  const { deck } = findDeck(levelId ?? '', deckId ?? '');
  const [seed, setSeed] = useState(0);
  const order = useShuffle(deck?.cards ?? [], seed);
  const [index, setIndex] = useState(0);
  const [burst, setBurst] = useState(false);
  const { progress, seen, known } = useProgress();

  const current = order[index];
  const done = index >= order.length;

  const learnedCount = useMemo(
    () =>
      (deck?.cards ?? []).filter((c) => (progress[c.id]?.known ?? 0) > 0).length,
    [deck, progress],
  );

  if (!deck) {
    return (
      <Layout>
        <p className="p-6 text-2xl">Deck not found.</p>
      </Layout>
    );
  }

  const handleKnow = () => {
    if (!current) return;
    known(current.id);
    setBurst(true);
    window.setTimeout(() => setBurst(false), 900);
    setIndex((i) => i + 1);
  };

  const handleTryAgain = () => {
    if (!current) return;
    seen(current.id);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setSeed((s) => s + 1);
    setIndex(0);
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full relative">
        <div className="flex justify-between items-center text-slate-600 text-xl md:text-2xl mb-4">
          <span>
            {Math.min(index + 1, order.length)} / {order.length}
          </span>
          <span className="font-bold text-emerald-600">
            ⭐ {learnedCount}
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center relative">
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
          {burst && <StarBurst />}
        </div>
        {!done && (
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Button
              onClick={handleTryAgain}
              className="bg-amber-400 text-slate-900"
            >
              🔁 Try again
            </Button>
            <Button onClick={handleKnow} className="bg-emerald-500 text-white">
              ✅ Know it!
            </Button>
          </div>
        )}
        <Celebration
          show={done}
          message="All done"
          onAgain={restart}
          onHome={() => nav('/')}
        />
      </div>
    </Layout>
  );
}
