---
title: "Recursion II: Divide & Conquer, Memoization"
meta_title: "Recursion II - Divide & Conquer and Memoization"
description: "Week 9 notes: two ideas that take recursion from cute to actually powerful. Splitting problems in half, and caching subproblems so you never redo work."
date: 2025-09-22
image: "/images/posts/recursion-ii-cover.jpg"
categories: ["recursion"]
tags: ["recursion", "divide and conquer", "memoization", "merge sort"]
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

Building on last week, here are the two ideas that make recursion genuinely powerful: divide and conquer (split, solve, combine) and memoization (never solve the same subproblem twice). Fair warning, memoization is basically DP in disguise, and I only realized that halfway through the week.

## ⚔️ Divide and conquer

The recipe is three steps:

1. **Divide** the input into smaller pieces.
2. **Conquer** each piece recursively.
3. **Combine** the sub-answers into the final answer.

Merge sort is the textbook example, and it's worth writing out at least once:

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])       # divide + conquer
    right = merge_sort(arr[mid:])
    return merge(left, right)          # combine

def merge(a, b):
    res, i, j = [], 0, 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            res.append(a[i]); i += 1
        else:
            res.append(b[j]); j += 1
    res.extend(a[i:]); res.extend(b[j:])
    return res
```

That's `T(n) = 2·T(n/2) + O(n)`, which works out to O(n log n). Stable and predictable. The same shape shows up in quick sort, binary search, and a bunch of "count something while you sort" problems.

## 🧠 Memoization: just remember your answers

Remember naive Fibonacci from last week being O(2ⁿ) because it kept recomputing the same values? Memoization fixes that by caching each answer the first time you compute it:

```python
from functools import cache

@cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
```

Now each `fib(k)` runs exactly once, so it's O(n) time and O(n) space. That's it. A `@cache` decorator or a plain dict is all it takes. The real skill is spotting that the same subproblem gets solved over and over, because that's when caching pays off.

Here's the thing nobody told me clearly: this **is** top-down dynamic programming. When I get to Week 16 and everyone's scared of "DP," it turns out I've already been doing it.

## 🌳 The recursion tree lens

Draw the tree of calls and look at it:

- If every branch is unique, it's plain divide and conquer, and the cost is the sum over the whole tree.
- If nodes repeat, memoize, and the tree collapses into a much smaller set of distinct subproblems.

Count the distinct subproblems, multiply by the work per subproblem, and that's your memoized complexity.

## ⚠️ Things that bit me

- `@cache` needs hashable arguments, so no lists as parameters. Convert to tuples.
- Accidentally sharing a mutable accumulator across branches.
- Memoizing something with no overlap. If the subproblems are all unique, a cache buys you nothing.

## 🏋️ Problems I did this week

- [Sort an Array](https://leetcode.com/problems/sort-an-array/), Medium (merge or quick sort)
- [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/), Easy (memoize it)
- [Unique Paths](https://leetcode.com/problems/unique-paths/), Medium
- [Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses/), Medium

## 📝 What I want to remember

Divide and conquer is split, solve, combine, with merge sort as the model. Memoization turns exponential recursion into linear by caching overlapping subproblems, and it's literally DP with a different name.

</div>
</div>
