// Render emoji as crisp SVG images instead of the OS bitmap emoji font, which
// pixelates badly when scaled up to the large sizes this app uses. We use the
// (maintained) Twemoji SVG asset set served from jsDelivr; the service worker
// caches them so they keep working offline after first view, and callers fall
// back to the raw emoji glyph if the image can't load.

const TWEMOJI_BASE =
  'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/';

const U200D = String.fromCharCode(0x200d);
const UFE0F = String.fromCharCode(0xfe0f);
const UFE0Fg = new RegExp(UFE0F, 'g');

/** Convert a string of unicode surrogate pairs to dash-joined hex code points. */
function toCodePoint(emoji: string): string {
  const points: string[] = [];
  let high = 0;
  for (let i = 0; i < emoji.length; i++) {
    const c = emoji.charCodeAt(i);
    if (high) {
      points.push((0x10000 + ((high - 0xd800) << 10) + (c - 0xdc00)).toString(16));
      high = 0;
    } else if (c >= 0xd800 && c <= 0xdbff) {
      high = c;
    } else {
      points.push(c.toString(16));
    }
  }
  return points.join('-');
}

/**
 * Twemoji filename for an emoji. The variation selector U+FE0F is stripped
 * unless the sequence is a ZWJ sequence (e.g. the pirate flag), matching
 * Twemoji's own asset-naming rules.
 */
export function emojiCodePoint(emoji: string): string {
  const cleaned = emoji.indexOf(U200D) < 0 ? emoji.replace(UFE0Fg, '') : emoji;
  return toCodePoint(cleaned);
}

export function emojiSvgUrl(emoji: string): string {
  return `${TWEMOJI_BASE}${emojiCodePoint(emoji)}.svg`;
}
