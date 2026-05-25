import { Link, useNavigate, useParams } from 'react-router-dom';
import { findDeck } from '../content';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';

export function DeckDetail() {
  const { levelId, deckId } = useParams<{ levelId: string; deckId: string }>();
  const nav = useNavigate();
  const { level, deck } = findDeck(levelId ?? '', deckId ?? '');

  if (!level || !deck) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-8xl mb-4">🤔</div>
          <p className="text-3xl text-slate-700 mb-6">Deck not found</p>
          <Link
            to="/"
            className="text-2xl text-sky-600 underline"
          >
            Go home
          </Link>
        </div>
      </Layout>
    );
  }

  const base = `/deck/${level.id}/${deck.id}`;

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center gap-8 p-6 md:p-10 max-w-3xl mx-auto w-full">
        <div className="text-8xl md:text-9xl">{deck.emoji}</div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 text-center">
          {deck.title}
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 text-center">
          {deck.description} · {deck.cards.length} cards
        </p>
        <div className="flex flex-col gap-5 w-full md:max-w-md">
          <Button
            onClick={() => nav(`${base}/flashcards`)}
            className="bg-rose-500 text-white"
          >
            📖 Read together
          </Button>
          <p className="text-slate-500 text-center text-base md:text-lg -mt-2">
            Tests below — these update her progress
          </p>
          <Button
            onClick={() => nav(`${base}/pick`)}
            className="bg-amber-500 text-white"
          >
            🎯 Pick the Word
          </Button>
          <Button
            onClick={() => nav(`${base}/match`)}
            className="bg-emerald-500 text-white"
          >
            🃏 Match Pairs
          </Button>
        </div>
      </div>
    </Layout>
  );
}
