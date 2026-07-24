---
title: "Lists, Arrays & Strings: Big-O Overview"
meta_title: "Python Lists & Strings - Time & Space Complexity"
description: "Week 0 notes on Python lists and strings through a Big-O lens: static vs dynamic arrays, the cost of every common operation, and the cheat sheets I check before writing loops."
date: 2025-07-20
image: "/images/posts/lists-strings-big-o-cover.jpg"
categories: ["basics"]
tags: ["arrays", "lists", "strings", "linear scan"]
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

Still in Week 0. Now that I can read complexity, I want the actual costs of the operations I use every day. Python hides a lot behind clean syntax, and some innocent-looking lines are secretly O(n), so this is my reference sheet for lists and strings.

## 🧠 Static arrays, dynamic arrays, and strings

- The last element of a list lives at index `len(arr) - 1`.
- Python lists are **mutable**: you can change, append, or remove elements.
- A **static array** has a fixed size and can't grow or shrink. Python doesn't really use these, but low-level languages like C do, and it's basically a fixed chunk of memory.
- Python lists are **dynamic arrays** that resize themselves when needed.
- When a list fills up, Python grows it by roughly doubling the capacity.
- Because of that doubling, **amortized** time stays low: most appends are cheap, and the occasional expensive resize gets spread out.

The practical takeaway: understanding how lists resize helps you avoid surprise costs in tight loops.

## 🐍 Python list cheat sheet

| Operation | Time | Space | Notes |
|-----------|------|-------|-------|
| `arr[i]` | O(1) | O(1) | Random index access |
| `arr[i] = x` | O(1) | O(1) | Update a value |
| `arr.append(x)` | O(1) amortized | O(1) | Append at the end |
| `arr.insert(0,x)` | O(n) | O(n) | Insert at the front |
| `arr.insert(i,x)` | O(n) | O(n) | Insert in the middle |
| `arr.pop()` | O(1) | O(1) | Remove the last element |
| `arr.pop(i)` | O(n) | O(n) | Remove from index `i` |
| `arr.remove(x)` | O(n) | O(1) | Find and remove first `x` |
| `x in arr` | O(n) | O(1) | Membership test |
| `arr.index(x)` | O(n) | O(1) | Index of first occurrence |
| `arr.count(x)` | O(n) | O(1) | Count occurrences |
| `del arr[i]` | O(n) | O(n) | Delete by index |
| `arr.sort()` / `sorted(arr)` | O(n log n) | O(n) Timsort | Stable sort |
| `arr.reverse()` | O(n) | O(1) | In-place reverse |
| `arr.copy()` | O(n) | O(n) | Shallow copy |
| `len(arr)` | O(1) | O(1) | Length is stored, not counted |
| Iteration | O(n) | O(1) | `for x in arr` |
| `arr + arr2` | O(n + m) | O(n + m) | Concatenation |
| `arr * k` | O(nk) | O(nk) | Repeat the list `k` times |

## ✅ Methods that return a value

| Method | Returns | Example |
|--------|---------|---------|
| `arr.copy()` | New shallow copy | `copy_arr = arr.copy()` |
| `arr.pop()` | Last element | `last = arr.pop()` |
| `arr.index(x)` | First occurrence index | `i = arr.index(3)` |
| `arr.count(x)` | Count of `x` | `c = arr.count(4)` |
| `x in arr` | `True` or `False` | `found = x in arr` |
| `sorted(arr)` | New sorted list | `s = sorted(arr)` |
| `arr + arr2` | Concatenated list | `combined = arr + arr2` |

Small habit that saves headaches: always assign the return value of these, otherwise the result just vanishes.

## 🚫 Methods that modify in place

| Method | In-place? | Correct usage |
|--------|-----------|---------------|
| `arr.append(x)` | yes | `arr.append(x)` |
| `arr.sort()` | yes | `arr.sort()` |
| `arr.reverse()` | yes | `arr.reverse()` |
| `del arr[i]` | yes | `del arr[2]` |
| `arr.clear()` | yes | `arr.clear()` |
| `arr.insert(i,x)` | yes | `arr.insert(1, 42)` |
| `arr.remove(x)` | yes | `arr.remove(5)` |

The classic mistake: don't assign `arr.sort()` or `arr.reverse()` to a variable. They return `None` and you'll lose your list.

## 🧵 String cheat sheet

Python strings are **immutable**, so any "modification" actually builds a new string.

| Operation | Time | Space | Example |
|-----------|------|-------|---------|
| `s[i]` | O(1) | O(1) | `char = s[2]` |
| `s1 + s2` | O(n+m) | O(n+m) | `res = s1 + s2` |
| `s.lower()` | O(n) | O(n) | `s = s.lower()` |
| `s.replace(a, b)` | O(n) | O(n) | `new = s.replace(...)` |
| `s.find(x)` / `s.index(x)` | O(n) | O(1) | `i = s.find("a")` |
| `s.split()` / `s.join()` | O(n) | O(n) | `words = s.split()` |
| `'x' in s` | O(n) | O(1) | `'cat' in s` |

### String methods that return a value

| Method | Returns | Example |
|--------|---------|---------|
| `s.lower()`, `s.upper()` | new `str` | `low = s.lower()` |
| `s.replace(a, b)` | new `str` | `new = s.replace(...)` |
| `s.strip()` | trimmed `str` | `s = s.strip()` |
| `s.find()`, `s.count()` | `int` | `count = s.count("a")` |
| `'x' in s` | `bool` | `if 'a' in s:` |
| `s.split()` | `list` | `words = s.split()` |

### Strings can't be modified in place

Because strings are immutable, you have to reassign:

```python
s = " Hello "
s.strip()      # does nothing on its own
print(s)       # " Hello "

s = s.strip()  # now it's actually trimmed
print(s)       # "Hello"
```

## ✅ Problems I solved this week

<!-- Row 1 -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="/problems/find-closest-number-to-zero" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">Find Closest Number to Zero</div>
    <div class="text-xs text-gray-500">LeetCode Easy</div>
  </a>

  <a href="/problems/merge-strings-alternately" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">Merge Strings Alternately</div>
    <div class="text-xs text-gray-500">LeetCode Easy</div>
  </a>

  <a href="/problems/roman-to-integer" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">Roman to Integer</div>
    <div class="text-xs text-gray-500">LeetCode Easy</div>
  </a>
</div>

<!-- Row 2 -->
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center mt-4">
  <a href="/problems/is-subsequence" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">Is Subsequence</div>
    <div class="text-xs text-gray-500">LeetCode Easy</div>
  </a>
</div>

## 📝 What I want to remember

Indexing and appending are cheap, but inserting or deleting anywhere but the end is O(n). Strings are immutable, so build them in a list and join once. And I need to actually reassign the return value of anything that isn't in-place.

</div>
</div>
