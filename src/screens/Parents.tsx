import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { useChildName } from '../hooks/useChildName';
import { useProgress } from '../hooks/useProgress';

export function Parents() {
  const { name, save } = useChildName();
  const [input, setInput] = useState(name);
  const { reset } = useProgress();
  const [savedFlash, setSavedFlash] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const onSave = () => {
    save(input);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1500);
  };

  return (
    <Layout>
      <div className="flex-1 flex flex-col p-6 md:p-10 max-w-2xl mx-auto w-full gap-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">
          For Parents
        </h1>

        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">
            Child's name
          </h2>
          <p className="text-slate-600 mb-4">
            Used in celebration messages (e.g. "Well done, [name]!")
          </p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a name"
            className="w-full text-2xl p-4 rounded-2xl border-2 border-slate-300 focus:border-sky-500 focus:outline-none"
          />
          <div className="flex items-center gap-4 mt-4">
            <Button onClick={onSave} className="bg-emerald-500 text-white">
              Save
            </Button>
            {savedFlash && (
              <span className="text-emerald-700 text-xl">✓ Saved</span>
            )}
          </div>
        </section>

        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-800">
            Reset progress
          </h2>
          <p className="text-slate-600 mb-4">
            Clear all "known" markers. Starts fresh on every deck.
          </p>
          {!confirmReset ? (
            <Button
              onClick={() => setConfirmReset(true)}
              className="bg-amber-500 text-white"
            >
              Reset all progress
            </Button>
          ) : (
            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={() => {
                  reset();
                  setConfirmReset(false);
                }}
                className="bg-red-500 text-white"
              >
                Yes, reset
              </Button>
              <Button
                onClick={() => setConfirmReset(false)}
                className="bg-slate-300 text-slate-800"
              >
                Cancel
              </Button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
