---
title: "Sliding Window Algorithm - Fixed & Variable Length"
meta_title: "Sliding Window Pattern for Subarrays & Substrings"
description: "Week 0 notes on the sliding window: when to use it, fixed vs variable windows, and how it turns a lot of subarray and substring problems from O(n^2) into O(n)."
date: 2025-07-23
image: "/images/posts/sliding-window-cover.jpg"
categories: ["patterns"]
tags: ["sliding window", "arrays", "substrings", "subarrays", "techniques"]
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

First real pattern of the journey. The sliding window is the one I reach for on subarray and substring problems, and the payoff is big: it usually takes an O(n^2) brute force down to O(n).

## 📌 When I reach for it

If the problem is asking for:

- the longest or shortest subarray that satisfies some condition,
- a fixed-length sum or subarray,
- a substring based on characters or their frequency,

and the constraints mention contiguous ranges, positive integers, or lowercase letters, that's my cue.

The keyword clue is "subarray" or "substring." The mental move is two pointers: expand the window, then shrink it.

## 🪟 Two flavors

| Type | Example use case | Window behavior |
|------|------------------|-----------------|
| Fixed length | Max sum of k elements | Always slide the right pointer by k |
| Variable length | Longest substring with at most 2 distinct chars | Expand, then shrink based on a rule |

## 🔒 Fixed-length window

Use this when you're handed a window size `k` and need to compute something over every window of that size. The trick is that sliding is O(1): add the new element, drop the one that fell off.

```python
def max_sum_k(nums, k):
    window = sum(nums[:k])
    best = window
    for i in range(k, len(nums)):
        window += nums[i] - nums[i - k]   # add new, remove old
        best = max(best, window)
    return best
```

## 🔓 Variable-length window

Here you don't know the size up front, so you use two pointers (`start` and `end`) and grow or shrink based on a condition. It fits problems phrased like "at most K characters," "longest subarray with sum ≤ target," or "substring with K distinct characters."

```python
def longest_at_most_k_distinct(s, k):
    from collections import defaultdict
    count = defaultdict(int)
    start = best = 0
    for end, ch in enumerate(s):
        count[ch] += 1
        while len(count) > k:            # shrink until the rule holds again
            count[s[start]] -= 1
            if count[s[start]] == 0:
                del count[s[start]]
            start += 1
        best = max(best, end - start + 1)
    return best
```

## 💡 The signal

When I see "subarray" or "substring," together with words like sum, max, min, count, a length `k`, or "at most" / "exactly," I stop and think sliding window before writing any nested loops.

## 🏋️ Good problems to practice on

- [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/), Easy (fixed)
- [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/), Medium (variable)
- [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/), Medium
- [Permutation in String](https://leetcode.com/problems/permutation-in-string/), Medium

## 📝 What I want to remember

Fixed window: slide by one, add the new element and remove the old one, O(1) per step. Variable window: expand the right, shrink the left whenever the condition breaks. Both stay O(n) because each element enters and leaves the window at most once.

</div>
</div>
