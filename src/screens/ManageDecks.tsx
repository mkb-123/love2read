import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { useLevels } from '../hooks/useLevels';
import { DECK_COLORS } from '../data/seedLevels';
import type { Card, Deck, Level } from '../lib/types';

function CardRow({
  card,
  onUpdate,
  onRemove,
}: {
  card: Card;
  onUpdate: (patch: Partial<Pick<Card, 'word' | 'emoji'>>) => void;
  onRemove: () => void;
}) {
  const [word, setWord] = useState(card.word);
  const [emoji, setEmoji] = useState(card.emoji ?? '');
  const [confirm, setConfirm] = useState(false);

  const commit = () => {
    if (word !== card.word || emoji !== (card.emoji ?? '')) {
      onUpdate({ word, emoji });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-2 border-b border-slate-100">
      <input
        type="text"
        value={emoji}
        onChange={(e) => setEmoji(e.target.value)}
        onBlur={commit}
        placeholder="🦘"
        maxLength={4}
        className="w-14 text-2xl p-2 rounded-xl border border-slate-300 text-center"
        aria-label="emoji"
      />
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        onBlur={commit}
        className="flex-1 min-w-[140px] text-lg p-2 rounded-xl border border-slate-300"
        aria-label="word"
      />
      {!confirm ? (
        <button
          type="button"
          onClick={() => setConfirm(true)}
          className="text-sm px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          Delete
        </button>
      ) : (
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onRemove}
            className="text-sm px-3 py-1 rounded-lg bg-red-500 text-white"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setConfirm(false)}
            className="text-sm px-3 py-1 rounded-lg bg-slate-200 text-slate-700"
          >
            No
          </button>
        </div>
      )}
    </div>
  );
}

function AddCardRow({
  onAdd,
}: {
  onAdd: (data: { word: string; emoji?: string }) => void;
}) {
  const [word, setWord] = useState('');
  const [emoji, setEmoji] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim()) return;
    onAdd({ word, emoji });
    setWord('');
    setEmoji('');
  };

  return (
    <form onSubmit={submit} className="flex flex-wrap items-center gap-2 pt-3">
      <input
        type="text"
        value={emoji}
        onChange={(e) => setEmoji(e.target.value)}
        placeholder="🦘"
        maxLength={4}
        className="w-14 text-2xl p-2 rounded-xl border border-slate-300 text-center"
        aria-label="new emoji"
      />
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="New word"
        className="flex-1 min-w-[140px] text-lg p-2 rounded-xl border border-slate-300"
        aria-label="new word"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-xl bg-sky-500 text-white font-bold"
      >
        + Add
      </button>
    </form>
  );
}

function DeckEditor({
  level,
  deck,
  hooks,
}: {
  level: Level;
  deck: Deck;
  hooks: ReturnType<typeof useLevels>;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(deck.title);
  const [emoji, setEmoji] = useState(deck.emoji);
  const [color, setColor] = useState(deck.color);
  const [description, setDescription] = useState(deck.description);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const commitMeta = () => {
    if (
      title !== deck.title ||
      emoji !== deck.emoji ||
      color !== deck.color ||
      description !== deck.description
    ) {
      hooks.updateDeck(level.id, deck.id, { title, emoji, color, description });
    }
  };

  return (
    <section className="bg-white rounded-3xl p-4 md:p-6 shadow-lg">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl md:text-4xl">{deck.emoji}</span>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-slate-800">
              {deck.title}
            </h3>
            <p className="text-slate-500 text-sm">{deck.cards.length} cards</p>
          </div>
        </div>
        <span className="text-2xl text-slate-400">{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              onBlur={commitMeta}
              placeholder="📚"
              maxLength={4}
              className="text-2xl p-2 rounded-xl border border-slate-300 text-center"
              aria-label="deck emoji"
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={commitMeta}
              placeholder="Deck title"
              className="text-lg p-2 rounded-xl border border-slate-300 md:col-span-2"
              aria-label="deck title"
            />
          </div>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={commitMeta}
            placeholder="Short description (optional)"
            className="w-full text-base p-2 rounded-xl border border-slate-300"
            aria-label="deck description"
          />
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-slate-600">Colour:</span>
            {DECK_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setColor(c);
                  hooks.updateDeck(level.id, deck.id, { color: c });
                }}
                aria-label={`use ${c}`}
                className={`w-8 h-8 rounded-full ${c} ${
                  color === c
                    ? 'ring-4 ring-offset-2 ring-slate-800'
                    : 'ring-2 ring-white'
                }`}
              />
            ))}
          </div>

          <div className="mt-3">
            <h4 className="text-base font-bold text-slate-700 mb-1">Words</h4>
            {deck.cards.length === 0 && (
              <p className="text-slate-500 text-sm italic">
                No words yet. Add one below.
              </p>
            )}
            {deck.cards.map((c) => (
              <CardRow
                key={c.id}
                card={c}
                onUpdate={(patch) =>
                  hooks.updateCard(level.id, deck.id, c.id, patch)
                }
                onRemove={() => hooks.removeCard(level.id, deck.id, c.id)}
              />
            ))}
            <AddCardRow
              onAdd={(data) => hooks.addCard(level.id, deck.id, data)}
            />
          </div>

          <div className="border-t border-slate-200 pt-3 mt-3">
            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-sm px-3 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700"
              >
                Delete this deck
              </button>
            ) : (
              <div className="flex gap-2 items-center">
                <span className="text-sm text-slate-700">Delete deck "{deck.title}"?</span>
                <button
                  type="button"
                  onClick={() => hooks.removeDeck(level.id, deck.id)}
                  className="text-sm px-3 py-1 rounded-lg bg-red-500 text-white"
                >
                  Yes, delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-sm px-3 py-1 rounded-lg bg-slate-200 text-slate-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function AddDeckForm({
  level,
  onAdd,
}: {
  level: Level;
  onAdd: (levelId: string, data: { title: string; emoji?: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(level.id, { title, emoji });
    setTitle('');
    setEmoji('');
    setOpen(false);
  };

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="bg-sky-500 text-white w-full"
      >
        + New deck in {level.label}
      </Button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-3xl p-4 shadow-lg flex flex-wrap gap-2 items-center"
    >
      <input
        type="text"
        value={emoji}
        onChange={(e) => setEmoji(e.target.value)}
        placeholder="📚"
        maxLength={4}
        className="w-14 text-2xl p-2 rounded-xl border border-slate-300 text-center"
        aria-label="new deck emoji"
      />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Deck title"
        autoFocus
        className="flex-1 min-w-[160px] text-lg p-2 rounded-xl border border-slate-300"
        aria-label="new deck title"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold"
      >
        Create
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700"
      >
        Cancel
      </button>
    </form>
  );
}

export function ManageDecks() {
  const hooks = useLevels();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <Layout>
      <div className="flex-1 flex flex-col p-6 md:p-10 max-w-3xl mx-auto w-full gap-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">
          Manage decks
        </h1>
        <p className="text-slate-600">
          Add or edit her words here. Changes save automatically to this device.
        </p>

        {hooks.levels.map((level) => (
          <div key={level.id} className="space-y-3">
            <h2 className={`text-2xl md:text-3xl font-bold ${level.color}`}>
              {level.label}
            </h2>
            {level.decks.map((deck) => (
              <DeckEditor key={deck.id} level={level} deck={deck} hooks={hooks} />
            ))}
            <AddDeckForm level={level} onAdd={hooks.addDeck} />
          </div>
        ))}

        <section className="bg-white rounded-3xl p-4 md:p-6 shadow-lg mt-6">
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            Reset all decks
          </h3>
          <p className="text-slate-600 text-sm mb-3">
            Restore the original starter decks. Does not affect her progress.
          </p>
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="text-sm px-3 py-1 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200"
            >
              Reset decks
            </button>
          ) : (
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-sm text-slate-700">
                Replace all decks with the starter set?
              </span>
              <button
                type="button"
                onClick={() => {
                  hooks.reset();
                  setConfirmReset(false);
                }}
                className="text-sm px-3 py-1 rounded-lg bg-red-500 text-white"
              >
                Yes, reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="text-sm px-3 py-1 rounded-lg bg-slate-200 text-slate-700"
              >
                Cancel
              </button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
