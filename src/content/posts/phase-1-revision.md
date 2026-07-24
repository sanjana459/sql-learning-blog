---
title: "Phase 1 Revision & Buffer"
meta_title: "Phase 1 Revision - Consolidating 18 Weeks of DSA"
description: "Week 18 is a breather. A topic-by-topic recap of Phase 1, a keyword-to-pattern cheat sheet, and the spaced-repetition plan I use for the problems that didn't stick."
date: 2025-11-24
image: "/images/posts/phase-1-revision-cover.jpg"
categories: ["revision"]
tags: ["revision", "spaced repetition", "cheat sheet", "foundations"]
draft: false
---

<div class="max-w-none prose-tight">
  <style>
    hr {
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
    }
  </style>

<div class="prose prose-tight max-w-none">

Week 18 is on purpose a light one. No new topic, just a buffer to let eighteen weeks of foundations settle before Phase 2. I used to skip review and it always came back to bite me, so this time it's built into the plan.

## 🗺️ Phase 1 in one table

| Weeks | Theme | Main tool |
|-------|-------|-----------|
| 0 to 2 | Arrays and strings | Two pointers, in-place write pointer |
| 3 | Hash tables | O(1) lookup, complement trick, counting |
| 4 | Stacks and queues | LIFO/FIFO, monotonic stack |
| 5 | Heaps | Top-K, streaming median |
| 6 | Binary search | Boundary template, search-on-answer |
| 7 | Linked lists | Reversal, fast/slow pointers |
| 8 to 9 | Recursion | Base case, divide and conquer, memoization |
| 10 to 13 | Trees | DFS orders, BFS levels, BST, trie, N-ary |
| 14 | Graphs | BFS/DFS with a visited set, grids as graphs |
| 15 | Sorting | The n log n floor, the "sort first" instinct |
| 16 | DP intro | State, recurrence, memo or table |
| 17 | Backtracking | Choose, explore, un-choose, plus pruning |

## 🔍 Keyword to pattern cheat sheet

Most of interviewing is reading the prompt and mapping words to techniques. This little table is the thing I actually review the most:

| When the prompt says | I reach for |
|----------------------|-------------|
| "sorted array", "pair that sums to" | Two pointers or binary search |
| "subarray / substring", "window" | Sliding window |
| "have I seen this?", "count of" | Hash map or set |
| "next greater / smaller" | Monotonic stack |
| "k largest / closest / smallest" | Heap |
| "shortest path", "by level" | BFS |
| "all combinations / permutations / subsets" | Backtracking |
| "max/min ways", "optimal + overlapping" | Dynamic programming |
| "minimize the max / maximize the min" | Binary search on the answer |

Getting this mapping into muscle memory is worth more than memorizing any single solution.

## 🔁 My spaced-repetition setup

This is the same layered system from the [26-week plan](/plan):

- Any problem I struggle with goes into **Revision Block 1**, and I revisit it every weekly review.
- If I can solve it confidently, it moves up to **Block 2**. If not, it stays in Block 1 for another round.
- At the end of the month I take on **Block 2**. Clearing one there means it's genuinely learned, and it leaves the list for good.

The whole point is to keep the hardest problems in rotation until they actually stick, instead of solving something once and quietly forgetting it a week later.

## ✅ My self-check before Phase 2

- [ ] I can write DFS and BFS from memory, with a visited set.
- [ ] I can reverse a linked list and use fast/slow pointers.
- [ ] I can write a bug-free binary search with one boundary template.
- [ ] I can define a DP state and write its recurrence.
- [ ] I can write the backtracking template without looking it up.

Anything I can't tick off is exactly what this buffer week is for.

## 📝 What I want to remember

Review isn't optional, it's where the foundations turn into instincts. Practice mapping keywords to patterns rather than memorizing solutions. Then walk into Phase 2 fluent in the basics, because the advanced weeks are mostly these same tools combined.

</div>
</div>
