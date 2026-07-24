---
title: "Queue & Stack: LIFO, FIFO & Monotonic Tricks"
meta_title: "Stacks & Queues - LIFO, FIFO, Deques & Monotonic Stacks"
description: "Week 4 notes on two structures defined by how they restrict you: stacks (LIFO) and queues (FIFO), plus the monotonic stack that finally made 'next greater' problems easy."
date: 2025-08-18
image: "/images/posts/queue-and-stack-cover.jpg"
categories: ["stacks-queues"]
tags: ["stacks", "queues", "deque", "monotonic stack"]
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

Stacks and queues are funny because their whole point is a restriction. You can only touch one end. That sounds limiting, but the restriction is exactly what makes them useful.

## 📚 Stack: last in, first out

Picture a stack of plates. You add to the top, you take from the top. That's it.

```python
stack = []
stack.append(x)     # push, O(1)
top = stack.pop()   # pop, O(1)
peek = stack[-1]    # peek, O(1)
```

Where it shows up: matching brackets, undo history, the function call stack itself, DFS, evaluating expressions. Basically anytime "most recent thing" matters.

## 🎟️ Queue: first in, first out

Now picture a line at a counter. You join at the back, you get served from the front.

```python
from collections import deque
q = deque()
q.append(x)          # enqueue, O(1)
front = q.popleft()  # dequeue, O(1)
```

One thing I want to flag loudly, because I got burned by it: do **not** use a plain list as a queue. `list.pop(0)` is O(n) because every remaining element has to shift down one spot. Use `collections.deque`, which is O(1) on both ends.

Queues show up in BFS, level-order traversal, scheduling, anything streaming.

## 📊 Quick complexity

| Structure | Push / enqueue | Pop / dequeue | Peek |
|-----------|----------------|---------------|------|
| Stack (list) | O(1) | O(1) | O(1) |
| Queue (deque) | O(1) | O(1) | O(1) |

A deque is a double-ended queue, so it can act as a stack, a queue, or a sliding-window buffer depending on which ends you use.

## 🧩 Matching things with a stack

The classic. A stack naturally remembers the most recent unmatched opener, which is precisely what bracket matching needs:

```python
def is_valid(s):
    pairs = {')': '(', ']': '[', '}': '{'}
    stack = []
    for c in s:
        if c in pairs:
            if not stack or stack.pop() != pairs[c]:
                return False
        else:
            stack.append(c)
    return not stack
```

## 🚀 The monotonic stack

This one took me a couple of tries to really get, but it's worth it. A monotonic stack keeps its contents sorted (increasing or decreasing) as you go. That's what makes "next greater element" questions O(n) instead of O(n²):

```python
def next_greater(nums):
    res = [-1] * len(nums)
    stack = []                        # holds indices, values decreasing
    for i, n in enumerate(nums):
        while stack and nums[stack[-1]] < n:
            res[stack.pop()] = n
        stack.append(i)
    return res
```

The reason it's linear even with that inner `while`: each index gets pushed once and popped at most once. So across the whole run you do a linear amount of work total.

## ⚠️ Things that bit me

- `list.pop(0)` being O(n). The classic queue mistake.
- Popping or peeking an empty stack. Always guard with `if stack` first.
- Storing values when I needed indices. Monotonic stacks usually hold indices so you can compute distances later.

## 🏋️ Problems I did this week

- [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/), Easy
- [Min Stack](https://leetcode.com/problems/min-stack/), Medium
- [Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/), Easy
- [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/), Medium
- [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/), Easy

## 📝 What I want to remember

Stack is recency, queue is arrival order. Use a deque for queues, never `list.pop(0)`. And when a problem says "next greater" or "next smaller," that's my cue to try a monotonic stack.

</div>
</div>
