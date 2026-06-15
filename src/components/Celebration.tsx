import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useChildName } from '../hooks/useChildName';
import type { Sticker } from '../lib/stickers';
import { StarBurst } from './StarBurst';
import { EmojiImage } from './EmojiImage';
import { Button } from './Button';

export function Celebration({
  show,
  message = 'Well done',
  sticker,
  onAgain,
  onHome,
}: {
  show: boolean;
  message?: string;
  sticker?: Sticker | null;
  onAgain?: () => void;
  onHome?: () => void;
}) {
  const { displayName } = useChildName();
  const nav = useNavigate();
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-pink-300/95 via-yellow-200/95 to-emerald-300/95"
        >
          <StarBurst count={24} />
          <motion.div
            initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="text-9xl md:text-[14rem] mb-6"
          >
            🎉
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-slate-800 text-center px-6">
            {message}, {displayName}!
          </h2>
          {sticker && (
            <motion.button
              type="button"
              onClick={() => nav('/stickers')}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10, delay: 0.4 }}
              className={`mt-8 bg-white rounded-3xl shadow-2xl px-8 py-5 flex items-center gap-4 active:scale-95 transition-transform touch-manipulation ${
                sticker.special ? 'ring-4 ring-amber-400' : ''
              }`}
            >
              <span className="text-7xl md:text-8xl">
                <EmojiImage emoji={sticker.emoji} />
              </span>
              <span className="text-left">
                <span className="block text-lg md:text-xl text-slate-500 font-bold uppercase tracking-wide">
                  {sticker.special ? '🏆 Achievement!' : 'New sticker!'}
                </span>
                <span className="block text-3xl md:text-4xl font-extrabold text-slate-800">
                  {sticker.name}
                </span>
              </span>
            </motion.button>
          )}
          <div className="flex flex-wrap gap-4 mt-12 px-6 justify-center">
            {onAgain && (
              <Button onClick={onAgain} className="bg-emerald-500 text-white">
                Again! 🔁
              </Button>
            )}
            {onHome && (
              <Button onClick={onHome} className="bg-sky-500 text-white">
                Home 🏠
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
