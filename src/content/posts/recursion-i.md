---
title: "Recursion I: Base Cases & the Call Stack"
meta_title: "Recursion I - Base Cases, the Call Stack & Recurrences"
description: "Week 8 notes: recursion felt like magic until I actually pictured the call stack. Writing correct base cases, trusting the recursive call, and reading recurrences."
date: 2025-09-15
image: "/images/posts/recursion-i-cover.jpg"
categories: ["recursion"]
tags: ["recursion", "call stack", "base case", "recurrence"]
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

Recursion is the idea that unlocks trees, graphs, backtracking, and divide and conquer, so I wanted to actually understand it this week rather than just pattern-match. A recursive function solves a problem by calling itself on a smaller version of the same problem.

## 🧠 Every recursion has two parts

1. **Base case**: the smallest input you can answer directly, no recursion needed. This is what stops it.
2. **Recursive case**: shrink the problem, call yourself, combine the result.

```python
def factorial(n):
    if n <= 1:                        # base case
        return 1
    return n * factorial(n - 1)       # recursive case
```

The thing that finally made recursion feel less scary: the leap of faith. You assume the recursive call already gives you the right answer for the smaller input. Your only two jobs are getting the base case right and combining the sub-answers correctly. You don't have to trace the whole thing in your head.

## 📚 The call stack

Each call gets its own frame with its own local variables. Frames pile up until a base case returns, then they unwind one by one:

```
factorial(3)
└─ 3 * factorial(2)
      └─ 2 * factorial(1)
            └─ returns 1
```

This is also why deep recursion can blow the stack: every pending call sits in memory waiting. Recursion of depth `d` uses O(d) space even if it returns nothing.

## ⏱️ Reading the time with recurrences

Write the cost as a recurrence and solve it:

- `T(n) = T(n-1) + O(1)` gives O(n), like factorial.
- `T(n) = 2·T(n/2) + O(n)` gives O(n log n), like merge sort.
- `T(n) = 2·T(n-1) + O(1)` gives O(2ⁿ), which is the warning sign.

Naive Fibonacci is the cautionary tale here:

```python
def fib(n):                 # this is O(2^n), it recomputes the same values
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
```

Next week I fix that explosion with memoization.

## 🔁 Recursion vs iteration

Any recursion can be rewritten with an explicit stack, and any loop can be written recursively. I go recursive when it makes the structure clearer (trees, nested data), and iterative when the depth is large or I want O(1) space.

## ⚠️ Things that bit me

- A missing or wrong base case, which means infinite recursion and a stack overflow.
- Not actually shrinking the input, so the recursive call never moves toward the base case.
- Slicing a fresh copy of the data on every call, which quietly adds O(n) work per level.

## 🏋️ Problems I did this week

- [Fibonacci Number](https://leetcode.com/problems/fibonacci-number/), Easy
- [Reverse String](https://leetcode.com/problems/reverse-string/), Easy (try the recursive version)
- [Pow(x, n)](https://leetcode.com/problems/powx-n/), Medium
- [Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/), Easy (recursive version)

## 📝 What I want to remember

Base case, smaller recursive call, combine. Take the leap of faith and trust the recursive call instead of tracing every frame. And keep an eye out for exponential recurrences, because that's usually where memoization comes in.

</div>
</div>
