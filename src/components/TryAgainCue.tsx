import { AnimatePresence, motion } from 'framer-motion';

/**
 * A gentle, encouraging nudge shown after a wrong tap. The games don't
 * advance on a wrong answer — the child picks again — so this tells a
 * pre-reader, kindly, to have another go.
 */
export function TryAgainCue({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="try-again"
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 14 }}
          className="pointer-events-none fixed top-6 left-1/2 -translate-x-1/2 z-40"
        >
          <span className="block bg-white/95 text-amber-600 text-2xl md:text-3xl font-extrabold rounded-full px-8 py-3 shadow-xl">
            Try again! 💪
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
