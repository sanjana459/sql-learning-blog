---
title: "Heaps & Priority Queues"
meta_title: "Heaps & Priority Queues - Heapify, Top-K & Streaming"
description: "Week 5 notes on heaps: the structure that always keeps its most extreme element one pop away, and how that makes top-K and streaming problems easy."
date: 2025-08-25
image: "/images/posts/heap-priority-queue-cover.jpg"
categories: ["heaps"]
tags: ["heap", "priority queue", "top-k", "heapq"]
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

The mental hook for this week: a heap always keeps its most extreme element ready to grab. So whenever a problem says "k largest," "k closest," or "next by priority," a heap is usually the move.

## 🧠 What a heap is

A binary heap is a complete binary tree that follows one rule:

- **Min-heap**: every parent is smaller than or equal to its children, so the smallest value sits at the root.
- **Max-heap**: every parent is larger, so the largest value sits at the root.

Because it's a complete tree, it packs neatly into an array and the parent/child relationships are just index math:

```
parent(i) = (i - 1) // 2
left(i)   = 2*i + 1
right(i)  = 2*i + 2
```

## 📊 Costs

| Operation | Time | Note |
|-----------|------|------|
| Peek min/max | O(1) | It's just the root |
| Push | O(log n) | Bubble up |
| Pop min/max | O(log n) | Swap root down, bubble down |
| Build (heapify) | O(n) | Bottom-up, better than n log n |

The heapify one surprised me: building a heap from an existing array is O(n), not O(n log n). Good fact to have in your back pocket.

## 🐍 Python only gives you a min-heap

`heapq` is a min-heap, full stop. Want a max-heap? Push the negatives and flip the sign back when you read them.

```python
import heapq
h = []
heapq.heappush(h, 5)
heapq.heappush(h, 1)
smallest = heapq.heappop(h)   # 1

# max-heap by negating
heapq.heappush(h, -value)
largest = -heapq.heappop(h)
```

## 🧩 Top-K with a size-K heap

The idea that felt clever the first time: to find the k largest elements, keep a min-heap of size k. The smallest of your current top k sits at the top, so if a new number beats it, swap it in.

```python
import heapq

def k_largest(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)               # O(k)
    for n in nums[k:]:
        if n > heap[0]:
            heapq.heapreplace(heap, n)
    return heap
```

That's O(n log k), which beats sorting's O(n log n) whenever k is small. If you only want a few, don't sort everything.

## 🌊 The two-heap median

For a running median over a stream, keep two heaps: a max-heap for the lower half and a min-heap for the upper half, balanced in size. The median is then O(1) to read and each insert is O(log n). This is the template for Find Median from Data Stream, and I go deeper on it in the Phase 2 heap notes.

## ⚠️ Things that bit me

- Forgetting `heapq` is min-only and getting the wrong extreme.
- Pushing tuples like `(priority, item)` and having it blow up when two priorities tie and the items aren't comparable. Add a tie-break counter.
- Sorting the whole array when I only needed the top k.

## 🏋️ Problems I did this week

- [Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/), Medium
- [K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/), Medium
- [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/), Medium
- [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/), Hard
- [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/), Hard

## 📝 What I want to remember

Heap gives O(1) peek and O(log n) push/pop of the extreme element. Top-K means a size-k heap and O(n log k). Two balanced heaps track a stream's median.

</div>
</div>
