// One-off generator for public/images/og-default.png (1200x630).
// Uses sharp, which is already present as a transitive dependency of Astro
// (image optimization). If Astro ever drops it, run instead with:
//   npm exec --package=sharp -- node scripts/generate-og.mjs
//
// Usage: node scripts/generate-og.mjs

import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b0d12"/>
      <stop offset="55%" stop-color="#10141d"/>
      <stop offset="100%" stop-color="#0a1017"/>
    </linearGradient>
    <radialGradient id="glow-cyan" cx="0.82" cy="0.2" r="0.55">
      <stop offset="0%" stop-color="#64d2ff" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#64d2ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow-amber" cx="0.12" cy="0.88" r="0.5">
      <stop offset="0%" stop-color="#f4b84a" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#f4b84a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow-cyan)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow-amber)"/>
  <g stroke="#64d2ff" stroke-opacity="0.12" stroke-width="1">
    ${Array.from({ length: 12 }, (_, i) => `<line x1="${i * 110}" y1="0" x2="${i * 110 + 160}" y2="${HEIGHT}"/>`).join('\n    ')}
  </g>
  <circle cx="1010" cy="130" r="5" fill="#64d2ff" fill-opacity="0.85"/>
  <circle cx="1060" cy="180" r="3.5" fill="#64d2ff" fill-opacity="0.5"/>
  <circle cx="960" cy="200" r="2.5" fill="#f4b84a" fill-opacity="0.6"/>
  <rect x="96" y="238" width="64" height="6" rx="3" fill="#64d2ff" fill-opacity="0.9"/>
  <text x="96" y="330" font-family="Georgia, 'Times New Roman', serif" font-size="84" font-weight="bold" fill="#f5f7fa">Dewflow Lab</text>
  <text x="98" y="398" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="#9aa7b8">Personal Project Lab &amp; Technical Review Archive</text>
  <text x="98" y="560" font-family="Georgia, 'Times New Roman', serif" font-size="26" fill="#5d6b7d">lab.9710221.xyz</text>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile('public/images/og-default.png');
console.log('Wrote public/images/og-default.png');
