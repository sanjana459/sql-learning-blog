---
title: "Hashing & Prefix Sum Patterns"
meta_title: "Prefix Sums & Hashing - O(1) Range Queries & Subarray Sums"
description: "Week 20 notes: prefix sums plus a hash map is one of the combos I use most. O(1) range queries, counting subarrays with a target sum in one pass, 2-D prefix sums, and the difference array."
date: 2025-12-08
image: "/images/posts/hashing-prefix-sum-cover.jpg"
categories: ["patterns"]
tags: ["prefix sum", "hashing", "subarrays", "range queries"]
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

This week combines two Phase 1 tools, hashing and prefix sums, into a combo I now reach for constantly. Prefix sums answer "what's the sum of this range?" instantly, and adding a hash map turns "count subarrays that sum to K" into a single pass.

## ➕ Prefix sums give O(1) range queries

Precompute the cumulative sums once, and then any range sum is just a subtraction:

```python
def build_prefix(nums):
    prefix = [0] * (len(nums) + 1)
    for i, n in enumerate(nums):
        prefix[i + 1] = prefix[i] + n
    return prefix                     # sum(nums[l:r]) == prefix[r] - prefix[l]
```

O(n) to build, then every range-sum query is O(1). That's the whole foundation for Range Sum Query problems.

## 🔑 Prefix sum plus hash map: subarray sum equals K

This is the star of the week, and it took me a couple of reads to really get. A subarray `(l, r]` sums to `k` exactly when `prefix[r] - prefix[l] == k`, which rearranges to `prefix[l] == prefix[r] - k`. So as you sweep, you just count how many earlier prefixes equal `current - k`:

```python
def subarray_sum(nums, k):
    count = 0
    seen = {0: 1}                     # the empty prefix, seen once
    running = 0
    for n in nums:
        running += n
        count += seen.get(running - k, 0)
        seen[running] = seen.get(running, 0) + 1
    return count
```

O(n) time, O(n) space. This one idea covers Subarray Sum Equals K, Contiguous Array (treat 0 as -1 to balance), and Subarray Sums Divisible by K (store `running % k` instead).

The line I always forget: seed the map with `{0: 1}`. That's what accounts for subarrays that start at index 0. Leave it out and you'll be off by exactly those cases.

## 🟦 2-D prefix sums

For grids, precompute a 2-D cumulative table so any rectangle sum is O(1):

```
sum(r1..r2, c1..c2) =
    P[r2+1][c2+1] - P[r1][c2+1] - P[r2+1][c1] + P[r1][c1]
```

It's inclusion-exclusion, and it's the basis of Range Sum Query 2D. Drawing the four rectangles is the only way I keep the signs straight.

## 🔧 The difference array (the reverse trick)

If you need to apply a bunch of range updates and only read the result at the end, a difference array makes each update O(1): add at the start, subtract just past the end, then take one prefix sum at the very end. It's the tool behind Corporate Flight Bookings and similar range-increment problems.

## ⚠️ Things that bit me

- Forgetting `{0: 1}` and missing the subarrays that begin at index 0.
- Off-by-one in prefix indexing. The `len + 1` padding is what keeps `prefix[r] - prefix[l]` clean.
- Recomputing sums inside a loop, which is the exact O(n²) mistake prefix sums exist to prevent.

## 🏋️ Problems I did this week

- [Range Sum Query - Immutable](https://leetcode.com/problems/range-sum-query-immutable/), Easy
- [Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/), Medium
- [Contiguous Array](https://leetcode.com/problems/contiguous-array/), Medium
- [Subarray Sums Divisible by K](https://leetcode.com/problems/subarray-sums-divisible-by-k/), Medium
- [Range Sum Query 2D - Immutable](https://leetcode.com/problems/range-sum-query-2d-immutable/), Medium

## 📝 What I want to remember

Prefix sums turn repeated range-sum work into O(1) lookups after an O(n) build. Prefix plus hash map counts subarrays with a target sum in one pass, and the `{0:1}` seed is non-negotiable. Difference arrays are the flip side for lots of cheap range updates.

</div>
</div>
