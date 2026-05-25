import { motion } from 'framer-motion';

export function StarBurst({
  count = 10,
  emoji = '⭐',
}: {
  count?: number;
  emoji?: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const distance = 180 + Math.random() * 120;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
            animate={{
              x: dx,
              y: dy,
              opacity: 0,
              scale: 1.6,
              rotate: 180 + Math.random() * 360,
            }}
            transition={{ duration: 0.9 + Math.random() * 0.3, ease: 'easeOut' }}
            className="absolute text-5xl md:text-6xl"
          >
            {emoji}
          </motion.span>
        );
      })}
    </div>
  );
}
