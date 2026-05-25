import clsx from 'clsx';

export function BigEmoji({
  emoji,
  size = 'lg',
  className,
}: {
  emoji?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  if (!emoji) return null;
  const sizes = {
    sm: 'text-6xl',
    md: 'text-8xl',
    lg: 'text-[8rem] md:text-[12rem]',
    xl: 'text-[10rem] md:text-[16rem]',
  };
  return (
    <div
      className={clsx(
        'leading-none select-none',
        sizes[size],
        className,
      )}
      aria-hidden
    >
      {emoji}
    </div>
  );
}
