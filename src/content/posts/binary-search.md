---
title: "Binary Search: Templates & Boundaries"
meta_title: "Binary Search - Templates, Boundaries & Search-on-Answer"
description: "Week 6 notes: binary search is way more than 'find in a sorted array.' The boundary template that stopped my off-by-one bugs, plus searching on the answer itself."
date: 2025-09-01
image: "/images/posts/binary-search-cover.jpg"
categories: ["binary-search"]
tags: ["binary search", "sorted", "boundaries", "search on answer"]
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

Binary search has the best effort-to-payoff ratio of anything I've learned so far. It turns O(n) into O(log n) by throwing away half the search space every step. And it works on a lot more than sorted arrays, which took me a while to appreciate.

## 🧠 The core idea

If your space is monotonic (sorted, or has a clean true-then-false boundary), every comparison lets you discard half of it.

```python
def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2      # avoids overflow in other languages
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
```

Thirty steps searches a billion elements. Still feels a little magical.

## 🎯 The boundary template (this fixed my bugs)

For the longest time my binary searches had random off-by-one bugs. What fixed it was giving up on "find the exact match" and instead always searching for the **first index that satisfies a condition**:

```python
def lower_bound(nums, target):
    lo, hi = 0, len(nums)             # half-open, hi = len
    while lo < hi:
        mid = (lo + hi) // 2
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid
    return lo                         # first index where nums[i] >= target
```

The trick is to just pick one template and use it every single time. I use this half-open `[lo, hi)` version with `lo < hi` for anything "first thing that's true," and I stopped guessing at bounds.

## 🚀 Searching on the answer

This is the part that changed how I see binary search. When the answer is a number in some range, and "is X good enough?" is monotonic, you can binary-search the answer itself.

Koko eating bananas is the one that made it click. Faster eating speed means fewer hours needed, which is monotonic, so binary-search the speed and check feasibility:

```python
def min_speed(piles, H):
    def hours(k):
        return sum((p + k - 1) // k for p in piles)
    lo, hi = 1, max(piles)
    while lo < hi:
        mid = (lo + hi) // 2
        if hours(mid) <= H:
            hi = mid
        else:
            lo = mid + 1
    return lo
```

Same shape solves Split Array, Ship Packages in D Days, and a lot of "minimize the maximum" or "maximize the minimum" problems. Once you see it you can't unsee it.

## ⚠️ Things to watch

- `mid` overflow in fixed-width languages. Use `lo + (hi - lo) // 2`.
- Infinite loops. Make sure the range strictly shrinks each iteration.
- Mixing up whether `hi` is inclusive (`len-1`) or exclusive (`len`). Decide upfront and be consistent.
- Forgetting that the predicate has to be monotonic. No monotonicity, no binary search.

## 🏋️ Problems I did this week

- [Binary Search](https://leetcode.com/problems/binary-search/), Easy
- [Search Insert Position](https://leetcode.com/problems/search-insert-position/), Easy
- [Find First and Last Position](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/), Medium
- [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/), Medium
- [Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/), Medium

## 📝 What I want to remember

Commit to one boundary template and stop reinventing the loop. Ask "is this predicate monotonic?" If yes, binary search is on the table, even without a sorted array in sight.

</div>
</div>
