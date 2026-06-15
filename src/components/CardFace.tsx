import clsx from 'clsx';
import type { Card } from '../lib/types';
import { levelColorForCardId } from '../content';
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
        <div
          className={clsx(
            'text-7xl md:text-9xl font-extrabold tracking-wide leading-none',
            levelColorForCardId(card.id),
          )}
        >
          {card.word}
        </div>
      )}
    </div>
  );
}
