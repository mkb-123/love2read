import { useEffect, useRef, useState } from 'react';
import { awardSticker, type Sticker } from '../lib/stickers';

/** Awards one sticker each time `done` flips to true (e.g. session complete). */
export function useSessionSticker(done: boolean): Sticker | null {
  const [sticker, setSticker] = useState<Sticker | null>(null);
  const awarded = useRef(false);

  useEffect(() => {
    if (done && !awarded.current) {
      awarded.current = true;
      setSticker(awardSticker());
    } else if (!done && awarded.current) {
      awarded.current = false;
      setSticker(null);
    }
  }, [done]);

  return sticker;
}
