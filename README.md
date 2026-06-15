# love2read

A flashcard reading app for 4-year-olds learning to read. Built for the UK
Oxford Reading Tree levels — starts with red (Stage 2) and grows from there.

Deployed at: **https://mkb-123.github.io/love2read/**

## What's in v1

- **Red level decks**: phonics (single letter sounds), tricky words, Biff/Chip
  & Kipper character names, picture words (cat, dog, sun, …)
- **Words coloured by level** so red-level words read in red and blue-level
  words in blue
- **Play modes per deck**:
  - Flashcards — read together, tap to advance
  - Pick the Word — see a picture, choose the matching word
  - Pick the Picture — see a word, choose the matching picture
  - Read Sentences — sentence decks show short sentences read word by word
    with a tap-along highlight
- **Sticker book**: finishing a game wins a random sticker, or a special
  **milestone sticker** for an achievement (first word mastered, a deck
  completed, day streaks, a hot in-game streak); collect all 48 in My
  Stickers
- **Rewards**: star bursts, streak counter, full-screen celebration on
  completion (with the child's name)
- **Progress** persisted in `localStorage` (per device)
- **Parents page**: set the child's name, per-word stats, reset progress
- **Installable PWA**: works offline and can be added to a tablet home
  screen like a real app (icons live in `public/`, regenerate with
  `node scripts/generate-icons.mjs`)

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:5173/love2read/>.

## Tests

```bash
npm test
```

## Build

```bash
npm run build
npm run preview
```

## Deployment

`.github/workflows/deploy.yml` builds and deploys to GitHub Pages on every
push to `main`.

**One-time setup** in the GitHub repo settings:

1. Settings → Pages → Source: **GitHub Actions**
2. Push to `main` — the workflow does the rest.

The base path is set to `/love2read/` in `vite.config.ts`. Routing uses
`HashRouter` so deep links survive page refreshes on Pages.

## Adding a new level

The data model is the only thing to touch:

1. Open `src/content/levels/blue.ts` (or create a new level file).
2. Populate the `decks` array with `Deck` objects (each containing `Card`
   objects).
3. Make sure the level is exported from `src/content/index.ts` (already done
   for red and blue).

No screen or routing changes are needed — the Home grid will pick up the new
decks automatically.

## Tech

React 18 · TypeScript · Vite 6 · Tailwind CSS 4 · React Router (HashRouter)
· Framer Motion · Vitest
