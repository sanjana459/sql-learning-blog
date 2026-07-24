---
title: "Two Pointers & Sliding Window (Advanced)"
meta_title: "Advanced Two Pointers & Sliding Window Patterns"
description: "Week 19 notes: Phase 2 kicks off by pushing the two most reused array patterns to medium/hard. Variable windows with a shrink rule, the at-most/exactly counting trick, and multi-pointer partitioning."
date: 2025-12-01
image: "/images/posts/two-pointers-sliding-window-cover.jpg"
categories: ["patterns"]
tags: ["two pointers", "sliding window", "subarrays", "substrings"]
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

Phase 2 is all about depth. Same patterns as Phase 1, but pushed to the harder versions. Starting with the two I use most: two pointers and the sliding window.

## 🪟 The variable-size window

Fixed windows are the easy case. The one that actually takes practice is the variable window: grow the right edge greedily, and shrink from the left the moment the window breaks a constraint.

```python
def longest_valid_window(s):
    left = 0
    best = 0
    state = {}                       # whatever bookkeeping the window needs
    for right, ch in enumerate(s):
        state[ch] = state.get(ch, 0) + 1
        while is_invalid(state):     # shrink until it's valid again
            state[s[left]] -= 1
            if state[s[left]] == 0:
                del state[s[left]]
            left += 1
        best = max(best, right - left + 1)
    return best
```

The reason this is O(n) despite the nested `while`: every element enters the window once (via right) and leaves at most once (via left). The window only shrinks when it has to, which is what keeps the total work linear instead of quadratic.

## 🔢 The "at most K" to "exactly K" trick

Counting subarrays with *exactly* K of something is annoying to do directly. But there's a clean identity:

```
exactly(K) = atMost(K) - atMost(K - 1)
```

`atMost(K)` is a nice tidy sliding-window count, so you just run it twice. This is how Subarrays with K Different Integers and Binary Subarrays With Sum become manageable.

```python
def subarrays_with_k_distinct(nums, k):
    def at_most(k):
        count = {}
        left = res = 0
        for right, n in enumerate(nums):
            count[n] = count.get(n, 0) + 1
            while len(count) > k:
                count[nums[left]] -= 1
                if count[nums[left]] == 0:
                    del count[nums[left]]
                left += 1
            res += right - left + 1          # windows ending at right
        return res
    return at_most(k) - at_most(k - 1)
```

## 🎯 More than two pointers

Two pointers isn't always a left/right pair. Dutch National Flag uses three pointers to sort 0/1/2 in one pass, and 3Sum fixes one index and squeezes the other two:

```python
def three_sum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue                          # skip a duplicate anchor
        lo, hi = i + 1, len(nums) - 1
        while lo < hi:
            s = nums[i] + nums[lo] + nums[hi]
            if s < 0: lo += 1
            elif s > 0: hi -= 1
            else:
                res.append([nums[i], nums[lo], nums[hi]])
                lo += 1; hi -= 1
                while lo < hi and nums[lo] == nums[lo - 1]: lo += 1
    return res
```

The duplicate-skipping is the part I always forget, and it's the part that makes 3Sum actually correct.

## ⚠️ Things that bit me

- Shrinking with `if` when I needed `while`. Sometimes you have to shrink several times in a row.
- Duplicate results in 3Sum, from not skipping equal values at every pointer.
- The window size formula. A window `[left, right]` holds `right - left + 1` elements, and I've gotten that off by one more than once.

## 🏋️ Problems I did this week

- [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/), Medium
- [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/), Hard
- [3Sum](https://leetcode.com/problems/3sum/), Medium
- [Subarrays with K Different Integers](https://leetcode.com/problems/subarrays-with-k-different-integers/), Hard
- [Sort Colors](https://leetcode.com/problems/sort-colors/), Medium

## 📝 What I want to remember

The variable window grows greedily and shrinks only when invalid, which is why it stays O(n). exactly(K) = atMost(K) minus atMost(K-1) turns hard counting into two easy windows. And two pointers happily becomes three or more for partitioning and k-sum.

</div>
</div>
