---
title: "Backtracking: An Intro"
meta_title: "Backtracking Intro - Choose, Explore, Un-choose"
description: "Week 17 notes: backtracking explores every candidate by building it up step by step and undoing dead ends. The choose/explore/un-choose template, and why pruning is everything."
date: 2025-11-17
image: "/images/posts/backtracking-intro-cover.jpg"
categories: ["backtracking"]
tags: ["backtracking", "recursion", "pruning", "combinatorics"]
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

Backtracking is how you explore all the possibilities (subsets, permutations, board placements) without writing a nested mess of loops. You build a candidate one decision at a time and undo any choice that leads nowhere. Last technique of Phase 1, and it leans heavily on the recursion weeks.

## 🧠 The core idea

Backtracking is really just DFS over a tree of decisions. At each step you:

1. **Choose** an option and record it.
2. **Explore** further with a recursive call.
3. **Un-choose**, undoing the choice so you can try the next one.

That third step, restoring the state, is literally what "backtracking" means. It's also the step I forgot most often when I started.

## 🧩 The template

```python
def backtrack(path, choices):
    if is_solution(path):
        results.append(path[:])     # copy, because path keeps mutating
        return
    for choice in choices:
        if not is_valid(choice, path):
            continue                # prune the branches that can't work
        path.append(choice)         # choose
        backtrack(path, next_choices(choice))  # explore
        path.pop()                  # un-choose
```

Note the `path[:]` copy. This one cost me an embarrassing amount of time: the same `path` list mutates the whole way through, so if you store a reference, every result ends up pointing at the same (final) list. Copy it.

## 🔢 Example: all subsets

```python
def subsets(nums):
    res = []
    def backtrack(start, path):
        res.append(path[:])                 # every node is a valid subset
        for i in range(start, len(nums)):
            path.append(nums[i])            # choose
            backtrack(i + 1, path)          # explore, i+1 avoids reuse
            path.pop()                      # un-choose
    backtrack(0, [])
    return res
```

The `start` index is what stops you from revisiting earlier elements, so each subset shows up exactly once.

## ✂️ Pruning is the whole game

The search space is exponential (2ⁿ subsets, n! permutations), so without pruning you'll time out. Pruning just means cutting branches that clearly can't succeed. In N-Queens you skip a column the moment it's attacked. In word search you stop the second the prefix leaves the board. Good pruning routinely turns a solution that times out into one that finishes instantly.

## 📊 Cost

Backtracking is exponential in the worst case, and that's just the nature of it:

- **Subsets**: O(2ⁿ), each element in or out.
- **Permutations**: O(n!), every ordering.
- **Combinations**: O(C(n, k)).

Pruning cuts the constant and often the real-world runtime a lot, but it doesn't change the worst-case class.

## ⚠️ Things that bit me

- Forgetting to un-choose, so state leaks into sibling branches.
- Storing a reference instead of a copy, so all my results came out identical.
- No pruning, giving a correct but hopelessly slow solution.

## 🏋️ Problems I did this week

- [Subsets](https://leetcode.com/problems/subsets/), Medium
- [Permutations](https://leetcode.com/problems/permutations/), Medium
- [Combination Sum](https://leetcode.com/problems/combination-sum/), Medium
- [Generate Parentheses](https://leetcode.com/problems/generate-parentheses/), Medium
- [N-Queens](https://leetcode.com/problems/n-queens/), Hard

## 📝 What I want to remember

Choose, explore, un-choose, over a tree of decisions. Always store a copy of the path and always undo the choice. And pruning is what decides whether an exponential search actually finishes.

</div>
</div>
