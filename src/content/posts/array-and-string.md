---
title: "Array & String Manipulation Patterns"
meta_title: "Array & String Patterns - Reverse, Rotate, Parse"
description: "Week 2 notes: strings are basically immutable arrays of characters, and that one word (immutable) quietly changes how you write fast code."
date: 2025-08-04
image: "/images/posts/array-and-string-cover.jpg"
categories: ["arrays", "strings"]
tags: ["arrays", "strings", "in-place", "parsing"]
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

Week 2 stays on arrays but adds their close cousin, strings. A string is really just an array of characters. The catch is that in Python, Java, and JavaScript strings are **immutable**, and that fact caused me more hidden slowdowns than I'd like to admit.

## 🧵 Immutable means every edit is a new string

You can't change a string in place. So `s += c` doesn't tack a character on, it builds a brand new string and copies everything you already had. Do that in a loop and you've quietly written O(n²) code.

```python
# slow: each += copies the whole string so far, O(n^2)
result = ""
for c in chars:
    result += c

# fast: collect in a list, join once at the end, O(n)
result = "".join(chars)
```

This is the single mistake I now check for automatically. If I'm building a string piece by piece, it goes into a list and gets joined at the very end.

## 📊 String costs to keep in mind

| Operation | Time | Note |
|-----------|------|------|
| Access `s[i]` | O(1) | Random index is fine |
| Concatenate `a + b` | O(n+m) | Allocates a new string |
| Slice `s[i:j]` | O(j-i) | Copies the range |
| `in` / substring search | O(n·m) naive | O(n+m) with KMP |
| `split` / `join` | O(n) | Linear in total length |

Slicing being a copy is the sneaky one. A slice inside a loop can turn a "linear" solution into a quadratic one without you noticing.

## 🧩 The moves that keep coming up

**Reverse in place** (for a mutable list of chars), just two pointers walking toward the middle:

```python
def reverse(arr):
    i, j = 0, len(arr) - 1
    while i < j:
        arr[i], arr[j] = arr[j], arr[i]
        i += 1
        j -= 1
```

**Rotate by k.** This one felt like magic the first time. Rotating right by `k` is three reversals: reverse the whole thing, reverse the first `k`, reverse the rest.

```python
def rotate(nums, k):
    k %= len(nums)
    nums.reverse()
    nums[:k] = reversed(nums[:k])
    nums[k:] = reversed(nums[k:])
```

**Parse or tokenize.** Walk the string with an index and group characters into chunks (digits, words). This is the backbone of string-to-integer and word-reversal problems.

## ⚠️ Stuff I keep tripping on

- The `+=` quadratic trap. Build in a list, join once.
- Slicing copies, so watch for it inside loops.
- Case and whitespace edge cases. I normalize early with `.lower()` and `.strip()` so I'm not chasing weird failures later.

## 🏋️ Problems I did this week

- [Reverse String](https://leetcode.com/problems/reverse-string/), Easy
- [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/), Easy
- [Rotate Array](https://leetcode.com/problems/rotate-array/), Medium
- [Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/), Easy

## 📝 What I want to remember

Treat strings as read-only arrays: build results in a list, join at the end. And reversal is more useful than it looks, since rotating is just three reversals stacked together.

</div>
</div>
