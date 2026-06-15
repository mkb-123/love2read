import { useState } from 'react';
import clsx from 'clsx';
import { emojiSvgUrl } from '../lib/emoji';

/**
 * Renders an emoji as a crisp SVG image (sized to 1em so existing font-size
 * classes still control its size). Falls back to the raw emoji glyph if the
 * image fails to load — e.g. offline before it has been cached.
 */
export function EmojiImage({
  emoji,
  className,
}: {
  emoji: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <span className={className}>{emoji}</span>;
  }

  return (
    <img
      src={emojiSvgUrl(emoji)}
      alt={emoji}
      draggable={false}
      onError={() => setFailed(true)}
      className={clsx('inline-block w-[1em] h-[1em] align-middle', className)}
    />
  );
}
