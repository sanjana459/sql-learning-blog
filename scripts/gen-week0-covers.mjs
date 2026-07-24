import sharp from "sharp";
import { mkdirSync } from "fs";

// Regenerates the Week 0 post covers in the same branded style as the rest,
// writing to their EXISTING filenames so no frontmatter needs to change.

const OUT = "public/images/posts";
mkdirSync(OUT, { recursive: true });

const W = 1200, H = 630;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function wrap(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length <= maxChars) cur = (cur + " " + w).trim();
    else { if (cur) lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

function motifDots(a) {
  let s = "";
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 6; c++) {
      const x = 780 + c * 62, y = 150 + r * 62;
      const op = 0.20 + ((r + c) % 5) * 0.13;
      s += `<rect x="${x}" y="${y}" width="46" height="46" rx="9" fill="${a}" opacity="${op.toFixed(2)}"/>`;
    }
  return s;
}
function motifBars(a) {
  const hs = [120, 210, 165, 255, 190, 140, 230];
  let s = "";
  hs.forEach((h, i) => {
    s += `<rect x="${770 + i * 56}" y="${470 - h}" width="40" height="${h}" rx="8" fill="${a}" opacity="${(0.3 + (i % 3) * 0.22).toFixed(2)}"/>`;
  });
  return s;
}
function motifGrid(a) {
  let s = "";
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 5; c++) {
      const fill = (r + c) % 2 === 0 ? a : "none";
      s += `<rect x="${800 + c * 60}" y="${150 + r * 60}" width="56" height="56" rx="8" fill="${fill}" stroke="${a}" stroke-width="3" opacity="${fill === "none" ? 0.35 : (0.25 + ((r * c) % 4) * 0.14).toFixed(2)}"/>`;
    }
  return s;
}
const MOTIFS = { dots: motifDots, bars: motifBars, grid: motifGrid };

function cover({ out, phase, week, title, a1, a2, shape }) {
  const lines = wrap(title, 20);
  const startY = 300 - (lines.length - 1) * 34;
  const titleSvg = lines.map((ln, i) =>
    `<text x="80" y="${startY + i * 74}" font-family="Helvetica, Arial, sans-serif" font-size="60" font-weight="800" fill="#f8fafc">${esc(ln)}</text>`
  ).join("");
  const motif = (MOTIFS[shape] || motifDots)(a2);
  const label = (phase + " · " + week).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1120"/>
      <stop offset="1" stop-color="#111827"/>
    </linearGradient>
    <linearGradient id="ac" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${a1}"/>
      <stop offset="1" stop-color="${a2}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="10" fill="url(#ac)"/>
  <g>${motif}</g>
  <rect x="80" y="90" width="${label.length * 15 + 44}" height="46" rx="23" fill="url(#ac)" opacity="0.16"/>
  <text x="102" y="121" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="2" fill="${a2}">${esc(label)}</text>
  ${titleSvg}
  <text x="80" y="560" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700" fill="#94a3b8">For Loop &amp; Beyond</text>
  <text x="80" y="592" font-family="Helvetica, Arial, sans-serif" font-size="20" fill="#64748b">A 26-Week DSA Journey</text>
  <circle cx="1120" cy="575" r="6" fill="${a1}"/>
  <circle cx="1145" cy="575" r="6" fill="${a2}"/>
</svg>`;
  return sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile(`${OUT}/${out}`);
}

const covers = [
  { out: "week-0(1).jpg",              phase: "Phase 1", week: "Week 0", title: "Time & Space Complexity", a1: "#64748b", a2: "#6366f1", shape: "bars" },
  { out: "lists-strings-big-o-cover.jpg", phase: "Phase 1", week: "Week 0", title: "Lists, Arrays & Strings", a1: "#0ea5e9", a2: "#6366f1", shape: "dots" },
  { out: "hash-tables-cover.jpg",      phase: "Phase 1", week: "Week 0", title: "Hash Tables & Sets", a1: "#14b8a6", a2: "#06b6d4", shape: "grid" },
  { out: "sliding-window-cover.jpg",   phase: "Phase 1", week: "Week 0", title: "Sliding Window", a1: "#06b6d4", a2: "#3b82f6", shape: "dots" },
  { out: "two-pointers-cover.jpg",     phase: "Phase 1", week: "Week 0", title: "Two Pointers", a1: "#0ea5e9", a2: "#14b8a6", shape: "dots" },
];

await Promise.all(covers.map(cover));
console.log("Regenerated", covers.length, "Week 0 covers into", OUT);
