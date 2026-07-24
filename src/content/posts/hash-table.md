---
title: "Hash Tables In Depth: Maps, Sets & Collisions"
meta_title: "Hash Tables - Maps, Sets, Collisions & O(1) Lookups"
description: "Week 3 notes on hashing: how buckets and collisions actually work, when that lovely O(1) quietly turns into O(n), and the counting and lookup tricks it buys you."
date: 2025-08-11
image: "/images/posts/hash-table-cover.jpg"
categories: ["hash-tables"]
tags: ["hash tables", "dictionaries", "sets", "counting"]
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

This is the week my solutions got noticeably faster. The hash table is the thing that turns "scan the whole array again" (O(n)) into "just look it up" (O(1)). Once I got comfortable reaching for it, a lot of brute-force solutions collapsed into something clean.

## 🧠 How it works under the hood

1. A hash function turns your key into an integer.
2. That integer gets reduced (modulo the capacity) into a bucket index.
3. The key and value get stored in that bucket.

Steps 1 and 2 are constant time, which is why lookups, inserts, and deletes are O(1) on average.

## 💥 Collisions, and why O(1) isn't a promise

Two different keys can land in the same bucket. That's a collision, and there are two usual ways to deal with it:

- **Chaining**: each bucket holds a little list of entries.
- **Open addressing**: if a slot's taken, probe for the next open one.

Here's the honest part: if a lot of keys pile into the same bucket (bad hash function, or someone feeding you adversarial input), that bucket grows and operations drift toward O(n). In normal life, good hashing plus resizing keeps things at O(1) on average, but "average" is the key word.

| Operation | Average | Worst |
|-----------|---------|-------|
| Insert | O(1) | O(n) |
| Lookup | O(1) | O(n) |
| Delete | O(1) | O(n) |

## 🔑 Keys have to be hashable

Keys need to be immutable: `str`, `int`, a `tuple` of hashable things. You can't use a `list`, `dict`, or `set` as a key because their contents (and therefore their hash) could change out from under the table. I learned this the moment I tried to key on a list and Python yelled at me.

## 🧩 The patterns worth memorizing

**Have I seen this before?** A set answers that instantly:

```python
def contains_duplicate(nums):
    seen = set()
    for n in nums:
        if n in seen:
            return True
        seen.add(n)
    return False
```

**Counting frequencies.** `Counter` does the tallying for you:

```python
from collections import Counter
counts = Counter("banana")   # {'a': 3, 'n': 2, 'b': 1}
```

**The complement trick** (this is the one that made Two Sum click). Instead of checking every pair, store what you've seen and ask whether the number you still need is already there:

```python
def two_sum(nums, target):
    seen = {}                      # value -> index
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
```

One pass, O(n), instead of the O(n²) double loop.

**Grouping.** Pick a canonical key (a sorted string, or a tuple of character counts) and map it to a list of everything that shares it. That's how anagram grouping works.

## ⚠️ Things to stay honest about

- You're trading memory for speed. A hash table costs O(n) space, and it's worth saying that out loud in an interview.
- Unhashable keys will bite you. Convert lists to tuples.
- Don't lean on dict ordering for your logic. Python keeps insertion order, but not every language does.

## 🏋️ Problems I did this week

- [Two Sum](https://leetcode.com/problems/two-sum/), Easy
- [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/), Easy
- [Valid Anagram](https://leetcode.com/problems/valid-anagram/), Easy
- [Group Anagrams](https://leetcode.com/problems/group-anagrams/), Medium
- [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/), Medium

## 📝 What I want to remember

Whenever I catch myself about to scan the array a second time asking "is this thing here?", that's the signal to reach for a set or dict. The complement trick and frequency counting alone knock a whole class of O(n²) solutions down to O(n).

</div>
</div>
