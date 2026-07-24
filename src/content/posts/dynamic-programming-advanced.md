---
title: "Dynamic Programming: Patterns & Optimization"
meta_title: "Advanced DP - Knapsack, LCS, Intervals & Space Optimization"
description: "Week 26, the finale. A tour of the DP families that cover most interview questions (knapsack, subsequences, grids, intervals), plus rolling-array space optimization."
date: 2026-01-19
image: "/images/posts/dynamic-programming-advanced-cover.jpg"
categories: ["dynamic-programming"]
tags: ["dynamic programming", "knapsack", "lcs", "optimization"]
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

Last week of the whole thing. Instead of grinding through dozens of DP problems as if each were unique, the thing that helped me most was realizing they fall into a handful of families. Recognize the family and the recurrence mostly writes itself.

## 🎒 1. Knapsack (choose items under a budget)

0/1 knapsack, each item used at most once. At each item you either take it or skip it:

```python
def knapsack(weights, values, cap):
    dp = [0] * (cap + 1)
    for w, v in zip(weights, values):
        for c in range(cap, w - 1, -1):      # iterate DOWN for 0/1
            dp[c] = max(dp[c], dp[c - w] + v)
    return dp[cap]
```

Here's the one detail that trips everyone up, including me: 0/1 iterates capacity **downward** (each item once), and unbounded iterates **upward** (reuse allowed). That single loop-direction flip is the whole difference, and it's what separates Coin Change from Partition Equal Subset Sum.

## 🔤 2. Subsequence DP (two strings or sequences)

`dp[i][j]` is the answer for the first `i` of one sequence and the first `j` of the other. Longest Common Subsequence:

```python
def lcs(a, b):
    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[len(a)][len(b)]
```

The same grid solves Edit Distance, Longest Palindromic Subsequence, and Distinct Subsequences. Two sequences almost always means a 2-D table.

## 🟦 3. Grid DP

`dp[r][c]` built from the neighbors above and to the left. Min Path Sum, Unique Paths, Maximal Square. Usually O(n·m) time, and you can often drop it to O(m) space with a single rolling row.

## 📏 4. Interval DP

`dp[i][j]` is the answer for the subarray `i..j`, built by picking a split point `k` inside it. This covers Burst Balloons, Matrix Chain, and Palindrome Partitioning II, and it's usually O(n³). This is the family I find hardest, so I flagged it for extra revision.

## 🗜️ Space optimization: rolling arrays

If `dp[i]` only depends on `dp[i-1]`, you don't need the whole table, just a row or two:

```python
# LCS in O(min(n, m)) space
prev = [0] * (len(b) + 1)
for i in range(1, len(a) + 1):
    cur = [0] * (len(b) + 1)
    for j in range(1, len(b) + 1):
        cur[j] = prev[j - 1] + 1 if a[i-1] == b[j-1] else max(prev[j], cur[j-1])
    prev = cur
```

Loads of 2-D DPs collapse to 1-D like this. It's a common follow-up once you've got the O(n·m) version working, so it's worth having ready.

## 🧭 How I attack a DP problem now

1. Guess the state. What parameters define a subproblem?
2. Write the recurrence. How do states combine, and what's the choice at each step?
3. Base cases, then fill top-down (memo) or bottom-up (table).
4. Optimize space if only the last row or two are ever needed.

## ⚠️ Things that bit me

- The 0/1 versus unbounded loop direction. It silently changes the meaning.
- Wrong number of dimensions. One string means 1-D, two strings means 2-D.
- Optimizing space too early. Get it right in 2-D first, then roll it up.

## 🏋️ Problems I did this week

- [Coin Change](https://leetcode.com/problems/coin-change/), Medium
- [Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/), Medium
- [Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/), Medium
- [Edit Distance](https://leetcode.com/problems/edit-distance/), Medium
- [Burst Balloons](https://leetcode.com/problems/burst-balloons/), Hard

## 🎉 That's the whole journey

Twenty-six weeks, from `arr[0]` all the way to interval DP. If you followed along, you've basically built a map: when a new problem shows up, you can place it in a family and pull up the template instead of starting from zero. Thanks for building this alongside me on For Loop & Beyond. The learning definitely doesn't stop here, but the foundation is set, and that was the goal.

## 📝 What I want to remember

DP is a small set of families (knapsack, subsequence, grid, interval), not endless special cases. Recognize the family and the state and recurrence follow. Get it right in full dimensions first, then roll up the array for space.

</div>
</div>
