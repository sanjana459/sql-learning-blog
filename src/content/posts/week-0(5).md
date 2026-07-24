---
title: "Two Pointers Algorithm - Intuition & Patterns"
meta_title: "DSA Pattern: Two Pointers (Squeeze Technique)"
description: "Week 0 notes on the two pointers technique: the 'squeeze' idea that kills a lot of nested loops, the two movement styles, and when to actually use it."
date: 2025-07-25
image: "/images/posts/two-pointers-cover.jpg"
categories: ["patterns"]
tags: ["two pointers", "arrays", "strings", "techniques"]
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

Second pattern, and it's a close cousin of the sliding window. Two pointers uses two indices moving through the data to find answers faster than nested loops would.

## 🧠 What it is

Two pointers means two indices that move toward each other, or in the same direction, to scan an array or string. I like to think of it as the **squeeze**: the pointers close in on the answer from both ends until the condition is met. That mental picture is what makes it stick for me.

```python
def is_palindrome(s):
    i, j = 0, len(s) - 1
    while i < j:
        if s[i] != s[j]:
            return False
        i += 1
        j -= 1
    return True
```

## 🔍 Where it shows up

- Sorted arrays, especially "find a pair that sums to X."
- Strings or arrays with symmetry, like palindromes or reversals.
- Finding or optimizing subarrays and subsequences.
- Anywhere I'd otherwise write a nested loop comparing two positions.

## 🧩 The two movement styles

**Same direction** (a slow and a fast pointer). Good for merging sorted arrays or the runner-style problems.

**Opposite direction** (one at the start, one at the end). Ideal for sum-based and palindrome problems, where you nudge whichever pointer moves you toward the target.

## 🪄 Why it works

- It often drops the time from O(n^2) to O(n).
- It plays really well with sorted data, or any problem where left/right symmetry helps.
- It's simple to write but surprisingly powerful once you spot the right pairing.

## 💡 The signal

If my brute-force idea is a nested loop comparing two values at a time, I stop and ask whether those comparisons could be done by moving two pointers instead. Usually the answer is yes, and it's cleaner and lighter on space.

## 🏋️ Good problems to practice on

- [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/), Easy
- [Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/), Medium
- [Container With Most Water](https://leetcode.com/problems/container-with-most-water/), Medium
- [3Sum](https://leetcode.com/problems/3sum/), Medium

## 📝 What I want to remember

Two indices, squeezing toward the answer. Same direction for merging and runners, opposite direction for sums and palindromes. Whenever I catch myself about to nest two loops on the same array, that's the moment to try two pointers.

</div>
</div>
