import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { findDeck } from '../content';
import { Layout } from '../components/Layout';
import { BigEmoji } from '../components/BigEmoji';
import { Celebration } from '../components/Celebration';
import { useProgress } from '../hooks/useProgress';
import { useSessionSticker } from '../hooks/useSessionSticker';

export function ReadSentences() {
  const { levelId, deckId } = useParams<{ levelId: string; deckId: string }>();
  const nav = useNavigate();
  const { deck } = useMemo(
    () => findDeck(levelId ?? '', deckId ?? ''),
    [levelId, deckId],
  );
  const { seen } = useProgress();

  const [sentenceIdx, setSentenceIdx] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);

  const sentences = deck?.cards ?? [];
  const current = sentences[sentenceIdx];
  const words = useMemo(
    () => (current ? current.word.split(/\s+/).filter(Boolean) : []),
    [current],
  );
  const sentenceDone = current && wordIdx >= words.length;
  const done = sentences.length > 0 && sentenceIdx >= sentences.length;
  const sticker = useSessionSticker(done);

  if (!deck) {
    return (
      <Layout>
        <p className="p-6 text-2xl">Deck not found.</p>
      </Layout>
    );
  }

  const tapWord = () => {
    if (sentenceDone) return;
    const next = wordIdx + 1;
    setWordIdx(next);
    if (next >= words.length && current) seen(current.id);
  };

  const nextSentence = () => {
    setSentenceIdx((i) => i + 1);
    setWordIdx(0);
  };

  const restart = () => {
    setSentenceIdx(0);
    setWordIdx(0);
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center text-slate-600 text-xl md:text-2xl mb-4">
          <span>
            {Math.min(sentenceIdx + 1, sentences.length)} / {sentences.length}
          </span>
          <span className="text-slate-500 text-base md:text-lg">
            Tap each word as you read it
          </span>
        </div>
        {!done && current && (
          <div
            onClick={tapWord}
            className="flex-1 flex flex-col items-center justify-center gap-8 cursor-pointer"
          >
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full p-8 md:p-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 md:gap-x-6"
            >
              {words.map((w, i) => (
                <motion.span
                  key={`${current.id}-${i}`}
                  animate={
                    i === wordIdx
                      ? { scale: 1.15 }
                      : { scale: 1 }
                  }
                  className={`text-5xl md:text-7xl font-extrabold leading-tight rounded-2xl px-2 md:px-3 transition-colors ${
                    i < wordIdx
                      ? 'text-emerald-600'
                      : i === wordIdx
                        ? 'text-slate-800 bg-yellow-300'
                        : 'text-slate-400'
                  }`}
                >
                  {w}
                </motion.span>
              ))}
            </motion.div>
            <div className="h-48 md:h-64 flex items-center justify-center">
              {sentenceDone ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="flex flex-col items-center gap-4"
                >
                  <BigEmoji emoji={current.emoji ?? '🌟'} size="lg" />
                </motion.div>
              ) : (
                <p className="text-slate-500 text-xl md:text-2xl">
                  👆 Tap to move to the next word
                </p>
              )}
            </div>
          </div>
        )}
        {!done && sentenceDone && (
          <motion.button
            type="button"
            onClick={nextSentence}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[88px] rounded-3xl px-8 py-4 text-2xl md:text-3xl font-bold shadow-lg active:scale-95 transition-transform bg-emerald-500 text-white touch-manipulation mt-4"
          >
            {sentenceIdx + 1 >= sentences.length
              ? 'Finish! 🎉'
              : 'Next sentence →'}
          </motion.button>
        )}
        <Celebration
          show={done}
          message="Super reading"
          sticker={sticker}
          onAgain={restart}
          onHome={() => nav('/')}
        />
      </div>
    </Layout>
  );
}
