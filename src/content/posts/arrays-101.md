---
title: "Arrays 101: Foundations & Core Operations"
meta_title: "Arrays 101 - Core Operations, Big-O & Patterns"
description: "My Week 1 notes on arrays: how they sit in memory, the Big-O of every core operation, the in-place write-pointer trick, and the patterns that keep showing up."
date: 2025-07-28
image: "/images/posts/arrays-101-cover.jpg"
categories: ["arrays"]
tags: ["arrays", "big-o", "in-place", "foundations"]
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

Week 1, and I'm starting with arrays on purpose. Almost everything later (strings, stacks, heaps, hashing, even DP tables) is really just an array wearing a costume, so it's worth getting the basics rock solid before moving on.

## 🧠 What an array actually is

An array is a contiguous block of memory holding elements of the same type. Because it's contiguous, the address of element `i` is just `base + i * size`. That's the whole reason indexing is O(1): the computer does one bit of arithmetic and jumps straight there. No searching.

Two flavors worth keeping straight:

- **Static array**: fixed size, allocated once. Think C, or `int[]` in Java.
- **Dynamic array**: grows on its own by reallocating and copying. Python's `list`, Java's `ArrayList`, C++'s `vector`.

The bit that confused me at first: how can `append` be O(1) if a dynamic array sometimes has to copy everything to a bigger block? The answer is that it doubles its capacity when it fills up, so those expensive copies are rare and spread out over tons of cheap appends. Averaged out, each append is O(1). That average-it-out idea has a name: **amortized**.

## 📊 Core operations at a glance

| Operation | Time | Why |
|-----------|------|-----|
| Access `arr[i]` | O(1) | Address math |
| Update `arr[i] = x` | O(1) | Direct write |
| Append at the end | O(1)* | Amortized, resize is rare |
| Insert at front / middle | O(n) | Everything after it shifts right |
| Delete at front / middle | O(n) | Everything after it shifts left |
| Search (unsorted) | O(n) | You have to look at each one |
| Search (sorted) | O(log n) | Binary search |

\*amortized

The one people forget in interviews: inserting at the front is O(n), not O(1). Feels cheap, isn't.

## 🧩 Patterns that lean on arrays

These come back constantly, so I'm just naming them here and giving each its own week later:

1. **Linear scan**: one pass, keep a running answer (max, min, sum, count).
2. **Two pointers**: one from each end, or a slow/fast pair.
3. **Sliding window**: a moving range for subarray questions.
4. **Prefix sums**: precompute cumulative sums so range queries are O(1).
5. **In-place editing**: reuse the input array so you stay at O(1) extra space.

## ✍️ The write-pointer trick

So many "remove or move these elements" problems come down to one idea: keep a slow **write** pointer for where the next kept value goes, and a fast **read** pointer scanning ahead. Here's moving all zeros to the end while keeping the order of everything else:

```python
def move_zeroes(nums):
    write = 0
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write], nums[read] = nums[read], nums[write]
            write += 1
    return nums
```

One pass, no second array. The way I think about `write`: it always points at "the next slot that should hold a value I'm keeping." Once that clicked, Remove Duplicates and Remove Element stopped feeling like separate problems.

## ⚠️ Things that bit me

- Off-by-one on the last index. It's `len(arr) - 1`, and I still double-check it.
- Deleting from a list while looping over it. The indices shift under you and you skip elements. Loop over a copy, or use the write pointer above.
- Assuming insert is cheap. Front insert is O(n).

## 🏋️ Problems I did this week

- [Two Sum](https://leetcode.com/problems/two-sum/), Easy
- [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/), Easy
- [Move Zeroes](https://leetcode.com/problems/move-zeroes/), Easy
- [Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/), Easy

## 📝 What I want to remember

Arrays give you O(1) access but pay O(n) for inserting or deleting in the middle. That trade-off is the thing that decides which structure I reach for later. And the write-pointer idiom turns a surprising number of problems into one clean pass.

</div>
</div>
