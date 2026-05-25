import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import clsx from 'clsx';

export function Layout({
  children,
  showBack = true,
  onBack,
  className,
}: {
  children: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
}) {
  const nav = useNavigate();
  const back = onBack ?? (() => nav('/'));
  return (
    <div className={clsx('min-h-dvh flex flex-col', className)}>
      {showBack && (
        <header className="p-4 md:p-6">
          <button
            type="button"
            onClick={back}
            aria-label="Back to home"
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/70 hover:bg-white shadow-lg flex items-center justify-center text-4xl active:scale-95 transition-transform touch-manipulation"
          >
            ←
          </button>
        </header>
      )}
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
