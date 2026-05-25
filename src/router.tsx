import { HashRouter, Route, Routes } from 'react-router-dom';
import { Home } from './screens/Home';
import { DeckDetail } from './screens/DeckDetail';
import { Flashcards } from './screens/Flashcards';
import { PickTheWord } from './screens/PickTheWord';
import { PickThePicture } from './screens/PickThePicture';
import { MatchPairs } from './screens/MatchPairs';
import { Parents } from './screens/Parents';
import { ManageDecks } from './screens/ManageDecks';

export function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deck/:levelId/:deckId" element={<DeckDetail />} />
        <Route
          path="/deck/:levelId/:deckId/flashcards"
          element={<Flashcards />}
        />
        <Route path="/deck/:levelId/:deckId/pick" element={<PickTheWord />} />
        <Route
          path="/deck/:levelId/:deckId/pick-picture"
          element={<PickThePicture />}
        />
        <Route path="/deck/:levelId/:deckId/match" element={<MatchPairs />} />
        <Route path="/parents" element={<Parents />} />
        <Route path="/manage" element={<ManageDecks />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}
