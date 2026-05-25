import clsx from 'clsx';
import type { Card } from '../lib/types';
import { BigEmoji } from './BigEmoji';

export function CardFace({
  card,
  mode = 'both',
  className,
}: {
  card: Card;
  mode?: 'word' | 'emoji' | 'both';
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-4 p-8',
        className,
      )}
    >
      {mode !== 'word' && card.emoji && <BigEmoji emoji={card.emoji} />}
      {mode !== 'emoji' && (
        <div className="text-7xl md:text-9xl font-extrabold text-slate-800 tracking-wide leading-none">
          {card.word}
        </div>
      )}
    </div>
  );
}
