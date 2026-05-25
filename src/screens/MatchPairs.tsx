import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { findDeck } from '../content';
import { selectSession } from '../lib/progress';
import { Layout } from '../components/Layout';
import { Celebration } from '../components/Celebration';
import { useProgress } from '../hooks/useProgress';
import { shuffle } from '../lib/random';
import type { Card } from '../lib/types';

interface Tile {
  key: string;
  cardId: string;
  word: string;
  emoji?: string;
  face: 'word' | 'emoji';
}

const PAIR_COUNT = 6;

function buildTiles(cards: Card[]): Tile[] {
  const withEmoji = cards.filter((c) => !!c.emoji);
  const chosen = shuffle(withEmoji).slice(0, Math.min(PAIR_COUNT, withEmoji.length));
  const tiles: Tile[] = chosen.flatMap((c) => [
    { key: `${c.id}-w`, cardId: c.id, word: c.word, emoji: c.emoji, face: 'word' },
    { key: `${c.id}-e`, cardId: c.id, word: c.word, emoji: c.emoji, face: 'emoji' },
  ]);
  return shuffle(tiles);
}

export function MatchPairs() {
  const { levelId, deckId } = useParams<{ levelId: string; deckId: string }>();
  const nav = useNavigate();
  const { deck } = findDeck(levelId ?? '', deckId ?? '');
  const { progress, correct } = useProgress();
  const [seed, setSeed] = useState(0);

  const tiles = useMemo(() => {
    if (!deck) return [];
    const ids = selectSession(
      deck.cards.map((c) => c.id),
      progress,
      { sessionSize: PAIR_COUNT, newPerSession: deck.cards.length },
    );
    const idSet = new Set(ids);
    return buildTiles(deck.cards.filter((c) => idSet.has(c.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, seed]);

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (flipped.length !== 2) return;
    const [aKey, bKey] = flipped;
    const a = tiles.find((t) => t.key === aKey);
    const b = tiles.find((t) => t.key === bKey);
    if (a && b && a.cardId === b.cardId && a.face !== b.face) {
      correct(a.cardId);
      setMatched((m) => new Set(m).add(a.cardId));
      setFlipped([]);
    } else {
      const t = window.setTimeout(() => setFlipped([]), 900);
      return () => window.clearTimeout(t);
    }
  }, [flipped, tiles, correct]);

  if (!deck) {
    return (
      <Layout>
        <p className="p-6 text-2xl">Deck not found.</p>
      </Layout>
    );
  }

  const pairsTotal = tiles.length / 2;
  const done = pairsTotal > 0 && matched.size === pairsTotal;

  const restart = () => {
    setSeed((s) => s + 1);
    setFlipped([]);
    setMatched(new Set());
  };

  const onTap = (t: Tile) => {
    if (matched.has(t.cardId)) return;
    if (flipped.includes(t.key)) return;
    if (flipped.length >= 2) return;
    setFlipped((f) => [...f, t.key]);
  };

  if (tiles.length === 0) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-3xl text-slate-700">
            This deck doesn't have pictures yet. Try a different game!
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full relative">
        <div className="flex justify-between items-center text-slate-600 text-xl md:text-2xl mb-4">
          <span>
            {matched.size} / {pairsTotal} pairs
          </span>
        </div>
        <div className="flex-1 grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 relative">
          {tiles.map((t) => {
            const isMatched = matched.has(t.cardId);
            const isFlipped = flipped.includes(t.key) || isMatched;
            return (
              <button
                key={t.key}
                onClick={() => onTap(t)}
                disabled={isMatched}
                className="aspect-square rounded-3xl active:scale-95 transition-transform touch-manipulation focus:outline-none focus:ring-4 focus:ring-yellow-300"
                style={{ perspective: '800px' }}
                aria-label={isFlipped ? t.word : 'hidden card'}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                    className="rounded-3xl shadow-lg bg-sky-400 flex items-center justify-center"
                  >
                    <span className="text-5xl md:text-7xl text-white opacity-70">?</span>
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                    className={`rounded-3xl shadow-lg flex items-center justify-center ${
                      isMatched ? 'bg-emerald-200' : 'bg-white'
                    }`}
                  >
                    <span
                      className={
                        t.face === 'emoji'
                          ? 'text-6xl md:text-8xl leading-none'
                          : 'text-4xl md:text-6xl font-extrabold text-slate-800 leading-none'
                      }
                    >
                      {t.face === 'emoji' ? t.emoji : t.word}
                    </span>
                  </div>
                </motion.div>
              </button>
            );
          })}
        </div>
        <Celebration
          show={done}
          message="You found them all"
          onAgain={restart}
          onHome={() => nav('/')}
        />
      </div>
    </Layout>
  );
}
