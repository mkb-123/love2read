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
    lg: 'text-9xl md:text-[10rem]',
    xl: 'text-[8rem] md:text-[12rem]',
  };
  return (
    <div
      className={clsx('leading-none select-none', sizes[size], className)}
      aria-hidden
    >
      {emoji}
    </div>
  );
}
