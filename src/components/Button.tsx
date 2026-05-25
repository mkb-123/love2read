import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

export function Button({
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'min-h-[88px] min-w-[88px] rounded-3xl px-8 py-4',
        'text-2xl md:text-3xl font-bold',
        'shadow-lg active:scale-95 transition-transform',
        'focus:outline-none focus:ring-4 focus:ring-yellow-300',
        'touch-manipulation',
        className,
      )}
      {...rest}
    />
  );
}
