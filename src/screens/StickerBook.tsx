import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { EmojiImage } from '../components/EmojiImage';
import { STICKERS, earnedCount, loadStickers } from '../lib/stickers';

export function StickerBook() {
  const counts = useMemo(() => loadStickers(), []);
  const earned = earnedCount(counts);

  return (
    <Layout>
      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 text-center mb-2">
          My Stickers 📒
        </h1>
        <p className="text-center text-xl md:text-2xl text-slate-600 mb-8">
          {earned === 0
            ? 'Finish a game to win your first sticker!'
            : `${earned} of ${STICKERS.length} collected`}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 pb-8">
          {STICKERS.map((s, i) => {
            const count = counts[s.id] ?? 0;
            const got = count > 0;
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.03, 1), type: 'spring', damping: 14 }}
                className={`relative aspect-square rounded-3xl flex flex-col items-center justify-center gap-1 shadow-lg ${
                  got ? 'bg-white' : 'bg-white/40'
                } ${got && s.special ? 'ring-4 ring-amber-400' : ''}`}
              >
                {got ? (
                  <>
                    <span className="text-5xl md:text-6xl leading-none">
                      <EmojiImage emoji={s.emoji} />
                    </span>
                    <span className="text-xs md:text-sm font-bold text-slate-600 text-center px-1">
                      {s.name}
                    </span>
                    {count > 1 && (
                      <span className="absolute top-1.5 right-1.5 bg-amber-400 text-amber-900 text-xs font-extrabold rounded-full px-2 py-0.5 shadow">
                        ×{count}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-4xl md:text-5xl text-slate-400/70 font-extrabold select-none">
                    ?
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
