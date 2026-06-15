import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useProgress } from '../hooks/useProgress';
import { useChildName } from '../hooks/useChildName';
import { useLevels } from '../hooks/useLevels';
import { earnedCount, loadStickers, STICKERS } from '../lib/stickers';

// Vivid gradient for each level's "all words" game button.
const LEVEL_GRADIENT: Record<string, string> = {
  red: 'from-red-500 to-rose-500',
  blue: 'from-sky-500 to-blue-600',
};

export function Home() {
  const { progress } = useProgress();
  const { displayName } = useChildName();
  const { levels } = useLevels();

  const stickers = useMemo(() => earnedCount(loadStickers()), []);

  // Levels that have at least one word (non-sentence) card to play with.
  const wordGames = useMemo(
    () =>
      levels
        .map((level) => {
          const ids = new Set<string>();
          for (const deck of level.decks) {
            if (deck.kind === 'sentences') continue;
            for (const c of deck.cards) ids.add(c.id);
          }
          const cardIds = [...ids];
          const mastered = cardIds.filter(
            (id) => (progress[id]?.box ?? 0) >= 5,
          ).length;
          return { level, total: cardIds.length, mastered };
        })
        .filter((g) => g.total > 0),
    [levels, progress],
  );

  return (
    <div className="min-h-dvh p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-extrabold text-slate-800 text-center mb-2">
        love2read 💖
      </h1>
      <p className="text-center text-2xl md:text-3xl text-slate-600 mb-10">
        Hello, {displayName}! What shall we play?
      </p>

      {wordGames.length > 0 && (
        <section className="mb-14">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-6">
            Word Games 🎮
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wordGames.map(({ level, total, mastered }) => {
              const pct = total === 0 ? 0 : Math.round((mastered / total) * 100);
              const grad =
                LEVEL_GRADIENT[level.id] ?? 'from-violet-500 to-fuchsia-500';
              return (
                <Link
                  key={level.id}
                  to={`/play/${level.id}`}
                  className={`block rounded-3xl bg-gradient-to-br ${grad} p-8 shadow-xl active:scale-95 transition-transform text-white focus:outline-none focus:ring-4 focus:ring-yellow-300 touch-manipulation`}
                >
                  <div className="text-6xl md:text-7xl mb-2">🎮</div>
                  <div className="text-3xl md:text-4xl font-extrabold capitalize">
                    {level.label} words
                  </div>
                  <div className="text-lg md:text-xl opacity-90 mb-4">
                    Every word in {level.label} in one game
                  </div>
                  <div className="bg-white/30 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-white h-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-base md:text-lg mt-2 opacity-90">
                    {mastered} of {total} mastered
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-6">
          More Games 📚
        </h2>
        <div className="space-y-12">
          {levels.map((level) => (
            <div key={level.id}>
              <h3
                className={`text-2xl md:text-4xl font-extrabold mb-5 ${level.color}`}
              >
                {level.label}
              </h3>
              {level.decks.length === 0 ? (
                <p className="text-2xl md:text-3xl text-slate-500 italic">
                  Coming soon! ✨
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {level.decks.map((deck) => {
                    const isSentences = deck.kind === 'sentences';
                    const mastered = deck.cards.filter((c) =>
                      isSentences
                        ? (progress[c.id]?.seen ?? 0) > 0
                        : (progress[c.id]?.box ?? 0) >= 5,
                    ).length;
                    const learning = deck.cards.filter((c) => {
                      if (isSentences) return false;
                      const b = progress[c.id]?.box ?? 0;
                      return b >= 1 && b < 5;
                    }).length;
                    const total = deck.cards.length;
                    const pct =
                      total === 0 ? 0 : Math.round((mastered / total) * 100);
                    return (
                      <Link
                        key={deck.id}
                        to={`/deck/${level.id}/${deck.id}`}
                        className={`block rounded-3xl ${deck.color} p-8 shadow-xl active:scale-95 transition-transform text-white focus:outline-none focus:ring-4 focus:ring-yellow-300 touch-manipulation`}
                      >
                        <div className="text-6xl md:text-7xl mb-2">
                          {deck.emoji}
                        </div>
                        <div className="text-3xl md:text-4xl font-extrabold">
                          {deck.title}
                        </div>
                        <div className="text-lg md:text-xl opacity-90 mb-4">
                          {deck.description}
                        </div>
                        <div className="bg-white/30 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-white h-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-base md:text-lg mt-2 opacity-90">
                          {isSentences
                            ? `${mastered} of ${total} read`
                            : `${mastered} mastered · ${learning} learning · ${total} total`}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="mt-14 max-w-md mx-auto">
        <Link
          to="/stickers"
          className="block rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-8 shadow-xl active:scale-95 transition-transform text-white focus:outline-none focus:ring-4 focus:ring-yellow-300 touch-manipulation"
        >
          <div className="text-6xl md:text-7xl mb-2">📒</div>
          <div className="text-3xl md:text-4xl font-extrabold">My Stickers</div>
          <div className="text-lg md:text-xl opacity-90">
            {stickers} of {STICKERS.length} collected
          </div>
        </Link>
      </div>

      <div className="text-center mt-16 pb-6">
        <Link
          to="/parents"
          className="text-slate-500 hover:text-slate-700 underline text-lg"
        >
          For Parents
        </Link>
      </div>
    </div>
  );
}
