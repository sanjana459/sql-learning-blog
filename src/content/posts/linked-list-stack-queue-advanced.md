---
title: "Advanced Linked List, Stack & Queue"
meta_title: "Advanced Linked Lists, Stacks & Queues - LRU, Deque Tricks"
description: "Week 21 notes: the harder linear-structure problems, where the trick is usually combining two structures. Reversing in k-groups, monotonic deques for sliding-window max, and the LRU cache."
date: 2025-12-15
image: "/images/posts/linked-list-stack-queue-advanced-cover.jpg"
categories: ["patterns"]
tags: ["linked list", "stack", "deque", "lru cache"]
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

Back to linked lists, stacks, and queues, but at the interview-hard level. The pattern I noticed this week: the tough ones almost always come down to combining two structures to hit a tight time and space bound.

## 🔁 Reverse in k-groups

Reversing a whole list was Week 7. Reversing every consecutive `k` nodes is the meaner cousin. Check that k nodes are actually left, reverse that block, then continue on the rest:

```python
def reverse_k_group(head, k):
    node = head
    for _ in range(k):                 # are there enough nodes left?
        if not node:
            return head                # fewer than k, leave it alone
        node = node.next
    prev, cur = None, head
    for _ in range(k):                 # reverse the first k
        nxt = cur.next
        cur.next = prev
        prev = cur
        cur = nxt
    head.next = reverse_k_group(cur, k)  # head is now this block's tail
    return prev
```

The "count before you reverse" step is the part I kept skipping, and it corrupts a partial tail if you do.

## 🦌 The monotonic deque: sliding window maximum

A deque of indices kept in decreasing value order gives the window's maximum in O(n), since each index is pushed and popped once:

```python
from collections import deque

def max_sliding_window(nums, k):
    dq, res = deque(), []
    for i, n in enumerate(nums):
        while dq and nums[dq[-1]] <= n:   # pop smaller-or-equal off the back
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:                 # drop indices that left the window
            dq.popleft()
        if i >= k - 1:
            res.append(nums[dq[0]])        # front is always the max
    return res
```

This is basically the monotonic stack from Week 4, extended to a moving window. Front holds the answer, back stays sorted.

## 🗄️ The LRU cache: hash map plus doubly linked list

The classic design question. You need O(1) `get` and `put`, and you evict the least recently used key when you're full. The combo:

- a **hash map** from key to node, for O(1) lookup,
- a **doubly linked list** ordering nodes by recency: touch a node and move it to the front, evict from the back.

The Python shortcut uses `OrderedDict`:

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)        # now it's the most recent
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)  # evict the least recent
```

In an interview I'd be ready to build the doubly-linked-list version by hand, since that's really what they're checking.

## ⚠️ Things that bit me

- The k-group boundary. Verify k nodes exist before reversing, or you'll wreck a partial tail.
- Storing values instead of indices in the deque. You need indices to expire out-of-window elements.
- LRU pointer bugs. Updating both neighbors on every move and evict is where the hand-rolled version breaks.

## 🏋️ Problems I did this week

- [Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/), Hard
- [Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/), Hard
- [LRU Cache](https://leetcode.com/problems/lru-cache/), Medium
- [Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/), Hard
- [Design Circular Queue](https://leetcode.com/problems/design-circular-queue/), Medium

## 📝 What I want to remember

Hard linear-structure problems usually combine structures, like a map with a list, or a deque with a window. The monotonic deque handles sliding-window maximum. And LRU is a hash map plus a doubly linked list, which I want to know cold because it comes up a lot.

</div>
</div>
