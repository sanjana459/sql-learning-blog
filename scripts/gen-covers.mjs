import sharp from "sharp";
import { mkdirSync } from "fs";

const OUT = "public/images/posts";
mkdirSync(OUT, { recursive: true });

const W = 1200, H = 630;

// escape XML
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// wrap title into lines (<= maxChars)
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

// ---- motif generators (right side decorative graphic) ----
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
function motifTree(a) {
  const N = (x, y, o = 1) => `<circle cx="${x}" cy="${y}" r="26" fill="${a}" opacity="${o}"/>`;
  const L = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${a}" stroke-width="4" opacity="0.45"/>`;
  const root = [960, 150], l = [860, 300], r = [1060, 300], ll = [790, 450], lr = [930, 450];
  return [
    L(...root, ...l), L(...root, ...r), L(...l, ...ll), L(...l, ...lr),
    N(...root, 0.9), N(...l, 0.7), N(...r, 0.7), N(...ll, 0.5), N(...lr, 0.5),
  ].join("");
}
function motifGraph(a) {
  const pts = [[840, 170], [1050, 210], [960, 340], [800, 400], [1080, 430], [910, 500]];
  const edges = [[0, 1], [0, 2], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [1, 4]];
  let s = edges.map(([i, j]) => `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[j][0]}" y2="${pts[j][1]}" stroke="${a}" stroke-width="4" opacity="0.4"/>`).join("");
  s += pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="24" fill="${a}" opacity="${(0.5 + (i % 3) * 0.16).toFixed(2)}"/>`).join("");
  return s;
}
function motifChain(a) {
  let s = "";
  for (let i = 0; i < 5; i++) {
    const x = 780 + i * 82, y = 300 + (i % 2 === 0 ? -18 : 18);
    s += `<rect x="${x}" y="${y}" width="60" height="60" rx="14" fill="none" stroke="${a}" stroke-width="6" opacity="${(0.4 + (i % 3) * 0.18).toFixed(2)}"/>`;
    if (i < 4) s += `<line x1="${x + 60}" y1="${y + 30}" x2="${x + 82}" y2="${300 + ((i + 1) % 2 === 0 ? -18 : 18) + 30}" stroke="${a}" stroke-width="5" opacity="0.4"/>`;
  }
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
const MOTIFS = { dots: motifDots, bars: motifBars, tree: motifTree, graph: motifGraph, chain: motifChain, grid: motifGrid };

function cover({ slug, phase, week, title, a1, a2, shape }) {
  const lines = wrap(title, 20);
  const startY = 300 - (lines.length - 1) * 34;
  const titleSvg = lines.map((ln, i) =>
    `<text x="80" y="${startY + i * 74}" font-family="Helvetica, Arial, sans-serif" font-size="60" font-weight="800" fill="#f8fafc">${esc(ln)}</text>`
  ).join("");
  const motif = (MOTIFS[shape] || motifDots)(a2);
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
  <rect x="80" y="90" width="${(phase + " · " + week).length * 15 + 44}" height="46" rx="23" fill="url(#ac)" opacity="0.16"/>
  <text x="102" y="121" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="2" fill="${a2}">${esc((phase + " · " + week).toUpperCase())}</text>
  ${titleSvg}
  <text x="80" y="560" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700" fill="#94a3b8">For Loop &amp; Beyond</text>
  <text x="80" y="592" font-family="Helvetica, Arial, sans-serif" font-size="20" fill="#64748b">A 26-Week DSA Journey</text>
  <circle cx="1120" cy="575" r="6" fill="${a1}"/>
  <circle cx="1145" cy="575" r="6" fill="${a2}"/>
</svg>`;
  return sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toFile(`${OUT}/${slug}-cover.jpg`);
}

const covers = [
  // Phase 1
  { slug: "arrays-101", phase: "Phase 1", week: "Week 1", title: "Arrays 101: Foundations & Core Operations", a1: "#6366f1", a2: "#8b5cf6", shape: "dots" },
  { slug: "array-and-string", phase: "Phase 1", week: "Week 2", title: "Array & String Manipulation Patterns", a1: "#0ea5e9", a2: "#6366f1", shape: "dots" },
  { slug: "hash-table", phase: "Phase 1", week: "Week 3", title: "Hash Tables In Depth: Maps, Sets & Collisions", a1: "#14b8a6", a2: "#06b6d4", shape: "grid" },
  { slug: "queue-and-stack", phase: "Phase 1", week: "Week 4", title: "Queue & Stack: LIFO, FIFO & Monotonic Tricks", a1: "#f59e0b", a2: "#f97316", shape: "bars" },
  { slug: "heap-priority-queue", phase: "Phase 1", week: "Week 5", title: "Heaps & Priority Queues", a1: "#ec4899", a2: "#f43f5e", shape: "tree" },
  { slug: "binary-search", phase: "Phase 1", week: "Week 6", title: "Binary Search: Templates & Boundaries", a1: "#10b981", a2: "#14b8a6", shape: "bars" },
  { slug: "linked-list", phase: "Phase 1", week: "Week 7", title: "Linked Lists: Traversal, Reversal & Cycles", a1: "#8b5cf6", a2: "#6366f1", shape: "chain" },
  { slug: "recursion-i", phase: "Phase 1", week: "Week 8", title: "Recursion I: Base Cases & the Call Stack", a1: "#f43f5e", a2: "#ec4899", shape: "tree" },
  { slug: "recursion-ii", phase: "Phase 1", week: "Week 9", title: "Recursion II: Divide & Conquer, Memoization", a1: "#fb7185", a2: "#f43f5e", shape: "tree" },
  { slug: "binary-tree", phase: "Phase 1", week: "Week 10", title: "Binary Trees: Traversals & DFS / BFS", a1: "#22c55e", a2: "#10b981", shape: "tree" },
  { slug: "binary-search-tree", phase: "Phase 1", week: "Week 11", title: "Binary Search Trees: Order, Search & Balance", a1: "#16a34a", a2: "#22c55e", shape: "tree" },
  { slug: "trie", phase: "Phase 1", week: "Week 12", title: "Tries: Prefix Trees for Fast Lookups", a1: "#0d9488", a2: "#22c55e", shape: "tree" },
  { slug: "n-ary-tree", phase: "Phase 1", week: "Week 13", title: "N-ary Trees: Traversal & Encoding", a1: "#059669", a2: "#14b8a6", shape: "tree" },
  { slug: "graph-bfs-dfs", phase: "Phase 1", week: "Week 14", title: "Graphs 101: BFS & DFS Traversals", a1: "#3b82f6", a2: "#6366f1", shape: "graph" },
  { slug: "sorting-and-searching", phase: "Phase 1", week: "Week 15", title: "Sorting & Searching Essentials", a1: "#eab308", a2: "#f59e0b", shape: "bars" },
  { slug: "dynamic-programming-intro", phase: "Phase 1", week: "Week 16", title: "Dynamic Programming: An Intro", a1: "#a855f7", a2: "#6366f1", shape: "grid" },
  { slug: "backtracking-intro", phase: "Phase 1", week: "Week 17", title: "Backtracking: An Intro", a1: "#ef4444", a2: "#f97316", shape: "tree" },
  { slug: "phase-1-revision", phase: "Phase 1", week: "Week 18", title: "Phase 1 Revision & Buffer", a1: "#64748b", a2: "#475569", shape: "grid" },
  // Phase 2
  { slug: "two-pointers-sliding-window", phase: "Phase 2", week: "Week 19", title: "Two Pointers & Sliding Window (Advanced)", a1: "#06b6d4", a2: "#3b82f6", shape: "dots" },
  { slug: "hashing-prefix-sum", phase: "Phase 2", week: "Week 20", title: "Hashing & Prefix Sum Patterns", a1: "#0ea5e9", a2: "#14b8a6", shape: "grid" },
  { slug: "linked-list-stack-queue-advanced", phase: "Phase 2", week: "Week 21", title: "Advanced Linked List, Stack & Queue", a1: "#8b5cf6", a2: "#a855f7", shape: "chain" },
  { slug: "binary-tree-bst-advanced", phase: "Phase 2", week: "Week 22", title: "Advanced Binary Tree & BST", a1: "#22c55e", a2: "#16a34a", shape: "tree" },
  { slug: "heap-priority-queue-advanced", phase: "Phase 2", week: "Week 23", title: "Advanced Heap & Priority Queue", a1: "#ec4899", a2: "#f43f5e", shape: "bars" },
  { slug: "graphs-shortest-paths", phase: "Phase 2", week: "Week 24", title: "Graphs: Shortest Paths & Dijkstra", a1: "#3b82f6", a2: "#2563eb", shape: "graph" },
  { slug: "backtracking-advanced", phase: "Phase 2", week: "Week 25", title: "Backtracking: Permutations, Combinations & Pruning", a1: "#ef4444", a2: "#ec4899", shape: "tree" },
  { slug: "dynamic-programming-advanced", phase: "Phase 2", week: "Week 26", title: "Dynamic Programming: Patterns & Optimization", a1: "#a855f7", a2: "#7c3aed", shape: "grid" },
];

await Promise.all(covers.map(cover));
console.log("Generated", covers.length, "covers into", OUT);
