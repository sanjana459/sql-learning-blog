---
title: "Linked Lists: Traversal, Reversal & Cycles"
meta_title: "Linked Lists - Reversal, Fast/Slow Pointers & Cycles"
description: "Week 7 notes: linked lists trade O(1) indexing for O(1) splicing. The pointer-rewiring patterns I keep needing: reversal, fast/slow pointers, cycles, and the dummy head."
date: 2025-09-08
image: "/images/posts/linked-list-cover.jpg"
categories: ["linked-lists"]
tags: ["linked list", "two pointers", "fast slow", "reversal"]
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

This week was a bit of a mindset switch. Instead of indices into one solid block of memory, you follow pointers from node to node. The payoff is O(1) insert and delete, as long as you already have a pointer to the spot.

## 🔗 The node

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
```

| Operation | Array | Linked list |
|-----------|-------|-------------|
| Access by index | O(1) | O(n) |
| Insert/delete at a node | O(n) | O(1) |
| Search | O(n) | O(n) |

Linked lists win when you're inserting and deleting a lot and rarely need random access. If you're constantly jumping to `arr[i]`, an array is the better tool.

## 🧩 Reversal: rewire as you walk

This is the most-asked linked-list pattern, so I drilled it. Three pointers march down the list flipping each arrow:

```python
def reverse_list(head):
    prev, cur = None, head
    while cur:
        nxt = cur.next     # save what's next before you lose it
        cur.next = prev    # flip the arrow
        prev = cur         # move prev up
        cur = nxt          # move cur up
    return prev            # prev is the new head
```

I genuinely could not do this from memory until I drew it out once on paper. Highly recommend the paper.

## 🐢🐇 Fast and slow pointers

Move one pointer one step and another two steps. This finds the middle of a list and detects cycles, both in O(1) space:

```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False
```

If there's a loop, the fast pointer eventually laps the slow one and they land on the same node. That's Floyd's cycle detection, and it's a neat little result.

## 🎩 The dummy head

Whenever the head itself might change (deleting the first node, merging two lists), I add a dummy node in front so I don't have to special-case the head:

```python
def remove_elements(head, val):
    dummy = ListNode(0, head)
    cur = dummy
    while cur.next:
        if cur.next.val == val:
            cur.next = cur.next.next
        else:
            cur = cur.next
    return dummy.next
```

## ⚠️ Things that bit me

- Losing the rest of the list. Always save `next` before you overwrite a pointer.
- Null dereferences. Guard `fast and fast.next` before touching `.next.next`.
- Forgetting the dummy and then writing five lines of head edge-case handling.

## 🏋️ Problems I did this week

- [Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/), Easy
- [Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/), Easy
- [Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/), Easy
- [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/), Easy
- [Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/), Medium

## 📝 What I want to remember

It's all pointer rewiring. Save `next` before overwriting, use fast/slow for middles and cycles, and drop in a dummy head whenever the front of the list can change.

</div>
</div>
