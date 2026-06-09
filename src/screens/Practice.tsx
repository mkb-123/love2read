import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllLevels } from '../content';
import { selectSession } from '../lib/progress';
import { Layout } from '../components/Layout';
import { BigEmoji } from '../components/BigEmoji';
import { CardFace } from '../components/CardFace';
import { Celebration } from '../components/Celebration';
import { Button } from '../components/Button';
import { useProgress } from '../hooks/useProgress';
import { useSessionSticker } from '../hooks/useSessionSticker';
import { shuffle } from '../lib/random';
import type { Card } from '../lib/types';

const SESSION_SIZE = 10;
const NEW_PER_SESSION = 3;

export function allPracticeCards(): Card[] {
  return getAllLevels().flatMap((l) =>
    l.decks
      .filter((d) => d.kind !== 'sentences')
      .flatMap((d) => d.cards),
  );
}

function buildChoices(target: Card, pool: Card[]): Card[] {
  const usedWords = new Set<string>([target.word]);
  const picked: Card[] = [];
  for (const c of shuffle(pool)) {
    if (picked.length >= 2) break;
    if (!usedWords.has(c.word)) {
      picked.push(c);
      usedWords.add(c.word);
    }
  }
  return shuffle([target, ...picked]);
}

export function Practice() {
  const nav = useNavigate();
  const { progress, correct, wrong } = useProgress();
  const [seed, setSeed] = useState(0);

  const allCards = useMemo(() => allPracticeCards(), []);

  // Session picked once from the spaced-repetition queue; answering
  // updates progress but must not reshuffle the running session.
  const rounds = useMemo(() => {
    const byId = new Map(allCards.map((c) => [c.id, c]));
    const ids = selectSession(
      allCards.map((c) => c.id),
      progress,
      { sessionSize: SESSION_SIZE, newPerSession: NEW_PER_SESSION },
    );
    return ids
      .map((id) => byId.get(id))
      .filter((c): c is Card => !!c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCards, seed]);

  const [roundIdx, setRoundIdx] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const shownAt = useRef<number>(Date.now());

  const current = rounds[roundIdx];
  const isQuiz = !!current?.emoji;
  const choices = useMemo(
    () => (current && isQuiz ? buildChoices(current, allCards) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current, seed],
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

  const done = rounds.length > 0 && roundIdx >= rounds.length;
  const sticker = useSessionSticker(done);

  if (rounds.length === 0) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-8xl mb-4">🌈</div>
          <p className="text-3xl text-slate-700">No words to practise yet.</p>
          <p className="text-slate-500 mt-2">
            Add some words from the Parents page first.
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

  const handleReadIt = (gotIt: boolean) => {
    if (!current) return;
    if (gotIt) {
      correct(current.id);
      setStreak((s) => s + 1);
    } else {
      wrong(current.id);
      setStreak(0);
    }
    setRoundIdx((i) => i + 1);
  };

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
        {!done && current && isQuiz && (
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
        {!done && current && !isQuiz && (
          <>
            <div className="flex-1 flex items-center justify-center relative">
              <motion.div
                key={current.id}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl"
              >
                <CardFace card={current} mode="word" />
              </motion.div>
            </div>
            <p className="text-center text-slate-500 text-lg md:text-xl mt-6">
              Read it out loud, then a grown-up taps:
            </p>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <Button
                onClick={() => handleReadIt(false)}
                className="bg-amber-400 text-amber-950"
              >
                Tricky 🤔
              </Button>
              <Button
                onClick={() => handleReadIt(true)}
                className="bg-emerald-500 text-white"
              >
                Read it! ⭐
              </Button>
            </div>
          </>
        )}
        <Celebration
          show={done}
          message="Practice done"
          sticker={sticker}
          onAgain={restart}
          onHome={() => nav('/')}
        />
      </div>
    </Layout>
  );
}
