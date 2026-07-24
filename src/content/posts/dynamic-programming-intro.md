---
title: "Dynamic Programming: An Intro"
meta_title: "Dynamic Programming Intro - Memoization vs Tabulation"
description: "Week 16 notes: DP is just recursion that never repeats work, and it's way less scary than its reputation. Spotting a DP problem, defining a state, and going top-down or bottom-up."
date: 2025-11-10
image: "/images/posts/dynamic-programming-intro-cover.jpg"
categories: ["dynamic-programming"]
tags: ["dynamic programming", "memoization", "tabulation", "recurrence"]
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

DP had a reputation in my head as the scary topic, and it really shouldn't. It's just recursion where you cache the subproblems you've already solved. If memoization made sense back in Week 9, you already get the core of DP. The rest is mostly practice recognizing it.

## 🧠 Two signals that a problem is DP

1. **Optimal substructure**: the best answer is built from the best answers to smaller subproblems.
2. **Overlapping subproblems**: the same subproblem shows up over and over, so caching pays off.

If both are true, it's DP. If the subproblems don't repeat, it's just divide and conquer and a cache does nothing for you.

## 🪜 The recipe I follow

1. **Define the state.** What parameters uniquely describe a subproblem? For example, `dp[i]` = the best answer using the first `i` items.
2. **Write the recurrence.** How does a state depend on smaller states?
3. **Set the base cases.**
4. **Pick a direction.** Top-down (memoized recursion) or bottom-up (fill a table).
5. Optionally, squeeze the space.

Honestly, step 1 is 80% of the battle. If I can't say clearly what `dp[i]` means, the recurrence never comes.

## ⬇️ Top-down (memoization)

Write the natural recursion, then slap a cache on it:

```python
from functools import cache

def climb(n):                 # ways to climb n stairs, 1 or 2 at a time
    @cache
    def go(i):
        if i <= 1:
            return 1
        return go(i - 1) + go(i - 2)
    return go(n)
```

## ⬆️ Bottom-up (tabulation)

Same recurrence, filled in iteratively, no recursion depth to worry about:

```python
def climb(n):
    dp = [0] * (n + 1)
    dp[0] = dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]
```

Notice `dp[i]` only ever looks at the last two values, so you can throw away the array and keep two variables for O(1) space. That "keep only what you need" move is the most common DP optimization, and it comes up constantly.

## 📊 Cost

DP cost is (number of distinct states) times (work per state). For 1-D problems that's usually O(n). For 2-D (grids, two strings) it's O(n·m).

## 🧩 The starter families

- **1-D sequences**: Climbing Stairs, House Robber, Fibonacci.
- **Grid paths**: Unique Paths, Min Path Sum.
- **Knapsack**: Coin Change, Subset Sum.
- **Strings**: Longest Common Subsequence, Edit Distance.

## ⚠️ Things that bit me

- A fuzzy state definition. If I can't state exactly what `dp[i]` means, nothing else works.
- Wrong iteration order in bottom-up. You have to fill dependencies before the states that use them.
- Missing base cases, since the whole table is built on top of them.

## 🏋️ Problems I did this week

- [Climbing Stairs](https://leetcode.com/problems/climbing-stairs/), Easy
- [House Robber](https://leetcode.com/problems/house-robber/), Medium
- [Coin Change](https://leetcode.com/problems/coin-change/), Medium
- [Unique Paths](https://leetcode.com/problems/unique-paths/), Medium
- [Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/), Medium

## 📝 What I want to remember

DP is recursion plus memory. Look for optimal substructure and overlapping subproblems. Nail the state definition first and the recurrence follows. Top-down and bottom-up are the same recurrence, and bottom-up often lets you drop to O(1) space.

</div>
</div>
