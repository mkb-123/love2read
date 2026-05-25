import { AnimatePresence, motion } from 'framer-motion';
import { useChildName } from '../hooks/useChildName';
import { StarBurst } from './StarBurst';
import { Button } from './Button';

export function Celebration({
  show,
  message = 'Well done',
  onAgain,
  onHome,
}: {
  show: boolean;
  message?: string;
  onAgain?: () => void;
  onHome?: () => void;
}) {
  const { displayName } = useChildName();
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
