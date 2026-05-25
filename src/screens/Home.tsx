import { Link } from 'react-router-dom';
import { LEVELS } from '../content';
import { useProgress } from '../hooks/useProgress';
import { useChildName } from '../hooks/useChildName';

export function Home() {
  const { progress } = useProgress();
  const { displayName } = useChildName();
  return (
    <div className="min-h-dvh p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-extrabold text-slate-800 text-center mb-2">
        love2read 💖
      </h1>
      <p className="text-center text-2xl md:text-3xl text-slate-600 mb-10">
        Hello, {displayName}! Pick a deck.
      </p>
      <div className="space-y-12">
        {LEVELS.map((level) => (
          <section key={level.id}>
            <h2
              className={`text-3xl md:text-5xl font-extrabold mb-6 ${level.color}`}
            >
              {level.label}
            </h2>
            {level.decks.length === 0 ? (
              <p className="text-2xl md:text-3xl text-slate-500 italic">
                Coming soon! ✨
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {level.decks.map((deck) => {
                  const mastered = deck.cards.filter(
                    (c) => (progress[c.id]?.box ?? 0) >= 5,
                  ).length;
                  const learning = deck.cards.filter((c) => {
                    const b = progress[c.id]?.box ?? 0;
                    return b >= 1 && b < 5;
                  }).length;
                  const total = deck.cards.length;
                  const pct = total === 0 ? 0 : Math.round((mastered / total) * 100);
                  return (
                    <Link
                      key={deck.id}
                      to={`/deck/${level.id}/${deck.id}`}
                      className={`block rounded-3xl ${deck.color} p-8 shadow-xl active:scale-95 transition-transform text-white focus:outline-none focus:ring-4 focus:ring-yellow-300 touch-manipulation`}
                    >
                      <div className="text-6xl md:text-7xl mb-2">{deck.emoji}</div>
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
                        {mastered} mastered · {learning} learning · {total} total
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        ))}
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
