// Generates the PWA icons in public/ without any image dependencies:
// draws a rose heart on the app's amber background and encodes the
// pixels as PNG by hand (IHDR/IDAT/IEND + zlib). Run: node scripts/generate-icons.mjs
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../public');

const BG_TOP = [0xfd, 0xe6, 0x8a]; // amber-200
const BG_BOTTOM = [0xfe, 0xd7, 0xaa]; // orange-200
const HEART = [0xf4, 0x3f, 0x5e]; // rose-500

const crcTable = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Classic heart curve: (x² + y² − 1)³ − x²·y³ ≤ 0 (y pointing up).
function inHeart(x, y) {
  const a = x * x + y * y - 1;
  return a * a * a - x * x * y * y * y <= 0;
}

function drawIcon(size, heartScale) {
  const rgba = Buffer.alloc(size * size * 4);
  const samples = 4; // supersampling for smooth edges
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let hit = 0;
      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const u = (px + (sx + 0.5) / samples) / size;
          const v = (py + (sy + 0.5) / samples) / size;
          // Map to heart coordinates (~[-1.3, 1.3]), nudged up a touch.
          const x = ((u - 0.5) * 2.6) / heartScale;
          const y = ((0.45 - v) * 2.6) / heartScale + 0.1;
          if (inHeart(x, y)) hit++;
        }
      }
      const t = hit / (samples * samples);
      const g = (py + px) / (2 * size); // diagonal background gradient
      const i = (py * size + px) * 4;
      for (let c = 0; c < 3; c++) {
        const bg = BG_TOP[c] + (BG_BOTTOM[c] - BG_TOP[c]) * g;
        rgba[i + c] = Math.round(bg + (HEART[c] - bg) * t);
      }
      rgba[i + 3] = 255;
    }
  }
  return encodePng(size, size, rgba);
}

mkdirSync(OUT_DIR, { recursive: true });
const icons = [
  ['pwa-192x192.png', 192, 0.82],
  ['pwa-512x512.png', 512, 0.82],
  // Maskable: keep the heart inside the 80% safe zone.
  ['maskable-icon-512x512.png', 512, 0.62],
  ['apple-touch-icon.png', 180, 0.82],
];
for (const [name, size, scale] of icons) {
  writeFileSync(join(OUT_DIR, name), drawIcon(size, scale));
  console.log(`wrote public/${name}`);
}
