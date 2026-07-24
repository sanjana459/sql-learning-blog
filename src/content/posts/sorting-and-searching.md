---
title: "Sorting & Searching Essentials"
meta_title: "Sorting & Searching - Algorithms, Trade-offs & When to Sort"
description: "Week 15 notes: I rarely write a sort from scratch in an interview, but knowing the trade-offs and the 'sort first, then the problem gets easy' instinct is the real skill."
date: 2025-11-03
image: "/images/posts/sorting-and-searching-cover.jpg"
categories: ["sorting"]
tags: ["sorting", "searching", "merge sort", "quick sort"]
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

I'll be honest, I almost never implement a sort from scratch in an actual problem. `sorted()` exists. But knowing the trade-offs, and more importantly noticing when sorting makes a problem trivial, is the part that matters.

## 📊 The comparison sorts

| Algorithm | Average | Worst | Space | Stable |
|-----------|---------|-------|-------|--------|
| Merge sort | O(n log n) | O(n log n) | O(n) | yes |
| Quick sort | O(n log n) | O(n²) | O(log n) | no |
| Heap sort | O(n log n) | O(n log n) | O(1) | no |
| Insertion | O(n²) | O(n²) | O(1) | yes |

Quick summary of when each matters:

- **Merge sort**: predictable O(n log n), stable, but needs O(n) extra space.
- **Quick sort**: fast in practice and in-place, but O(n²) on a bad pivot, which randomizing the pivot mostly fixes.
- **Heap sort**: O(1) space and O(n log n) worst case, but not stable.

One thing worth knowing: comparison sorts can't beat O(n log n). That's a proven lower bound, not just "nobody's found a faster one." To go faster you have to stop comparing.

## ⚡ Beating n log n with counting sort

If your keys are integers in a small known range, counting sort runs in O(n + k) by tallying occurrences instead of comparing anything:

```python
def counting_sort(nums, k):          # values in [0, k]
    count = [0] * (k + 1)
    for n in nums:
        count[n] += 1
    out = []
    for value, c in enumerate(count):
        out.extend([value] * c)
    return out
```

Radix and bucket sort are extensions of this same tallying idea.

## 🧠 Stability, and why it matters

A stable sort keeps the relative order of equal keys. It matters when you sort by one field and want the previous order preserved among ties, like sorting by score but keeping names alphabetical within the same score. Python's `sorted` (Timsort) is stable, which is handy.

## 🧩 The real instinct: sort first

A shocking number of problems get easy once the data is sorted:

- **Find duplicates or pairs**: neighbors become comparable.
- **Interval problems**: sort by start, then sweep left to right.
- **Greedy**: sort by whatever the greedy criterion is, then take in order.
- **Two pointers**: sorting is the setup for the squeeze.

The cost is O(n log n), so if the rest of your solution is at least that expensive anyway, sorting is basically free.

## ⚠️ Things that bit me

- Sorting the whole array when I only needed the top k. A heap gives top-K in O(n log k).
- Assuming quicksort is always fast. Adversarial input is O(n²), so randomize the pivot.
- Losing tie order. Use a stable sort or an explicit tie-break key.

## 🏋️ Problems I did this week

- [Sort Colors](https://leetcode.com/problems/sort-colors/), Medium (counting / Dutch flag)
- [Merge Intervals](https://leetcode.com/problems/merge-intervals/), Medium
- [Largest Number](https://leetcode.com/problems/largest-number/), Medium (custom comparator)
- [Sort an Array](https://leetcode.com/problems/sort-an-array/), Medium
- [Kth Largest Element](https://leetcode.com/problems/kth-largest-element-in-an-array/), Medium

## 📝 What I want to remember

Comparison sorts bottom out at O(n log n), counting and radix beat it for small integer ranges. Know stability and space so I can name the right sort. And the reflex to sort first unlocks intervals, greedy, two-pointer, and dedupe problems.

</div>
</div>
