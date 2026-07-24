---
title: "Backtracking: Permutations, Combinations & Pruning"
meta_title: "Advanced Backtracking - Permutations, Combinations, Pruning"
description: "Week 25 notes: turning the Week 17 template into a toolkit. The three shapes (subsets, combinations, permutations), handling duplicates without dupes, and the pruning that keeps it feasible."
date: 2026-01-12
image: "/images/posts/backtracking-advanced-cover.jpg"
categories: ["backtracking"]
tags: ["backtracking", "permutations", "combinations", "pruning"]
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

The Week 17 template was the skeleton. This week is the toolkit. Almost every "generate all…" problem turns out to be one of three shapes: subsets, combinations, or permutations, plus rules for duplicates and pruning.

## 🧩 The three shapes

They all share choose, explore, un-choose. They differ only in how the loop advances.

**Subsets**, include each element or don't:

```python
def subsets(nums):
    res = []
    def bt(start, path):
        res.append(path[:])
        for i in range(start, len(nums)):
            path.append(nums[i])
            bt(i + 1, path)              # i+1 so we don't reuse earlier items
            path.pop()
    bt(0, [])
    return res
```

**Combinations**, choose k of n. Same as subsets but only record paths of length k, and prune when there aren't enough elements left to finish:

```python
def combine(n, k):
    res = []
    def bt(start, path):
        if len(path) == k:
            res.append(path[:]); return
        # need k - len(path) more, only n - i + 1 remain, so cut the loop short
        for i in range(start, n - (k - len(path)) + 2):
            path.append(i)
            bt(i + 1, path)
            path.pop()
    bt(1, [])
    return res
```

**Permutations**, order matters, use every element:

```python
def permute(nums):
    res = []
    def bt(path, used):
        if len(path) == len(nums):
            res.append(path[:]); return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            bt(path, used)
            path.pop()
            used[i] = False
    bt([], [False] * len(nums))
    return res
```

The tell for which shape: combinations track a `start` index, permutations track a `used` array. That distinction is what I always mix up under pressure.

## ♻️ Handling duplicates

With repeated input values you'll churn out duplicate results. The fix is to sort first, then skip an equal sibling at the same level of the tree:

```python
nums.sort()
# inside the loop:
if i > start and nums[i] == nums[i - 1]:
    continue                            # skip a duplicate at this level
```

For permutations with duplicates, the same-level skip uses the `used` array: `if used[i-1] is False and nums[i] == nums[i-1]: continue`. This one is fiddly and I always double-check it against a tiny example.

## ✂️ Pruning is still the whole game

The search space is exponential, so pruning (cutting branches that can't possibly succeed) is what makes it practical:

- **Combination Sum**: stop the moment the remaining target goes negative, and sort so you can break early.
- **N-Queens**: track attacked columns and diagonals in sets and skip immediately.
- **Word Search**: abandon a path the instant the next cell doesn't match.

A good prune routinely takes a solution from timing out to instant.

## ⚠️ Things that bit me

- Duplicate results. Sort plus the same-level skip. Don't just dedupe with a set at the end, it's too slow.
- Reaching for `start` when I needed `used`, or vice versa.
- Forgetting to copy the path. Append `path[:]`, not `path`.

## 🏋️ Problems I did this week

- [Subsets II](https://leetcode.com/problems/subsets-ii/), Medium
- [Combination Sum](https://leetcode.com/problems/combination-sum/), Medium
- [Permutations II](https://leetcode.com/problems/permutations-ii/), Medium
- [Palindrome Partitioning](https://leetcode.com/problems/palindrome-partitioning/), Medium
- [N-Queens](https://leetcode.com/problems/n-queens/), Hard

## 📝 What I want to remember

Learn the three shapes as one template with a different loop. Sort and skip equal siblings to handle duplicates cleanly. And pruning decides whether an exponential search actually finishes in time.

</div>
</div>
