---
title: "Advanced Heap & Priority Queue"
meta_title: "Advanced Heaps - Two Heaps, Lazy Deletion & K-Way Merge"
description: "Week 23 notes: heaps at interview-hard level. The two-heap running median, k-way merge, greedy scheduling with a priority queue, and the lazy-deletion trick for removing stale entries."
date: 2025-12-29
image: "/images/posts/heap-priority-queue-advanced-cover.jpg"
categories: ["heaps"]
tags: ["heap", "priority queue", "two heaps", "k-way merge"]
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

Heaps were "find the k largest" back in Week 5. This week is the patterns that actually show up in harder problems: two heaps, k-way merge, greedy scheduling, and lazy deletion.

## ⚖️ Two heaps for a running median

Keep a max-heap for the smaller half and a min-heap for the larger half, balanced so their sizes differ by at most one. Then the median sits right at the tops:

```python
import heapq

class MedianFinder:
    def __init__(self):
        self.lo = []                 # max-heap, stored as negatives
        self.hi = []                 # min-heap

    def add(self, num):
        heapq.heappush(self.lo, -num)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))   # balance by value
        if len(self.hi) > len(self.lo):                    # balance by size
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def median(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2
```

Each insert is O(log n), median is O(1). The push-to-one-then-rebalance dance is the part to get right.

## 🔀 K-way merge

Merging k sorted lists with a heap of each list's current front is O(N log k), which beats concatenate-then-sort's O(N log N):

```python
import heapq

def merge_k(lists):
    heap = [(lst[0], i, 0) for i, lst in enumerate(lists) if lst]
    heapq.heapify(heap)
    out = []
    while heap:
        val, li, idx = heapq.heappop(heap)
        out.append(val)
        if idx + 1 < len(lists[li]):
            heapq.heappush(heap, (lists[li][idx + 1], li, idx + 1))
    return out
```

The `(value, list_index, elem_index)` tuple keeps the heap ordered while remembering where each item came from.

## 🗓️ Greedy scheduling with a priority queue

A lot of interval and scheduling problems are greedy plus a heap: sort by start, then use a min-heap of end times to track how many resources are busy. That's the Meeting Rooms II pattern, and the heap's size at any moment is just the number of overlapping intervals. Neat once you see it.

## 🧹 Lazy deletion

Heaps don't remove an arbitrary element efficiently, so the trick is to not even try. Mark it stale and skip it when it eventually floats to the top:

```python
while heap and is_stale(heap[0]):
    heapq.heappop(heap)              # drop outdated entries only when they surface
```

This keeps sliding-window and remove-by-key heap problems at O(log n) amortized, and it's cleaner than trying to fish something out of the middle.

## ⚠️ Things that bit me

- Letting the two heaps get unbalanced. Rebalance sizes after every insert.
- Tuples that aren't comparable, when two priorities tie and the payloads can't be compared. Add a tie-break index.
- Trying to delete from the middle of a heap. Use lazy deletion instead.

## 🏋️ Problems I did this week

- [Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/), Hard
- [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/), Hard
- [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/), Medium
- [Task Scheduler](https://leetcode.com/problems/task-scheduler/), Medium
- [Sliding Window Median](https://leetcode.com/problems/sliding-window-median/), Hard

## 📝 What I want to remember

Two heaps track a streaming median, and k-way merge beats a full sort when k is small. Priority queues drive greedy scheduling, where heap size equals active overlaps. And when you can't remove from the middle of a heap, lazy-delete stale entries at the top.

</div>
</div>
