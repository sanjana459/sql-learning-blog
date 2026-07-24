---
title: "Hash Tables & Sets - Time & Space Complexity"
meta_title: "Hash Maps & Sets in Python - Big-O Operations"
description: "Week 0 notes on how Python dicts and sets work under the hood, the Big-O of their operations, and when to use them over a list."
date: 2025-07-21
image: "/images/posts/hash-tables-cover.jpg"
categories: ["basics"]
tags: ["hash tables", "dictionaries", "sets"]
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

Last of the Week 0 fundamentals, and probably the most useful one for speeding up solutions: hash tables. Dicts and sets are the tools that turn "search the list again" into "just look it up," so I wanted to understand what's actually happening underneath.

## 🧠 Hash table basics

- A **hash table** stores key-value pairs. A hash function computes an array index from the key, which is what gives you fast access (O(1) on average).
- A **hash function** turns a key into a fixed-size integer (a hash code) that maps to an index in the underlying array.
- **Collisions** happen when different keys hash to the same index. Two common ways to handle them:
  - **Chaining**: a little linked list at each index.
  - **Open addressing**: probe for the next open slot (linear, quadratic, etc.).
- Hash tables power efficient lookups, inserts, and deletes, which is why they show up in frequency counting, caching, and indexing.
- A Python `set` is an unordered collection of unique, hashable items, backed by a hash table for O(1) operations.
- A Python `dict` stores key-value pairs, also in a hash table. Keys must be hashable (immutable), and values can be anything.
- Hashable (valid keys): `str`, `int`, tuples of hashable elements.
- Unhashable (invalid keys): `list`, `dict`, `set`, all mutable, so they can't be keys or set elements.

## 🧪 Dictionary cheat sheet

| Operation | Time | Space | Example |
|-----------|------|-------|---------|
| `d[k]` (get/set) | O(1) | O(1) | `val = d[key]` or `d[k] = v` |
| `del d[k]` | O(1) | O(1) | `del d[key]` |
| `k in d` | O(1) | O(1) | `if k in d:` |
| `d.keys()` / `d.values()` | O(n) | O(n) | All keys or values |
| `len(d)` | O(1) | O(1) | Number of items |
| `for k in d:` | O(n) | O(1) | Iteration |
| `copy = d.copy()` | O(n) | O(n) | Shallow copy |
| `d.clear()` | O(1) | O(1) | Empties the dict |
| `d.update(...)` | O(m) | O(m) | Merge another dict of size `m` |

## 🧪 Set cheat sheet

| Operation | Time | Space | Example |
|-----------|------|-------|---------|
| `x in s` | O(1) | O(1) | `if x in s:` |
| `s.add(x)` | O(1) | O(1) | Add an element |
| `s.remove(x)` | O(1) | O(1) | Remove (errors if missing) |
| `s.discard(x)` | O(1) | O(1) | Safe remove (no error) |
| `s.pop()` | O(1) | O(1) | Remove and return an item |
| `len(s)` | O(1) | O(1) | Count elements |
| `copy = s.copy()` | O(n) | O(n) | Shallow copy |
| Iteration | O(n) | O(1) | `for x in s:` |
| Set operations | O(n) | O(n) | Union, intersection, difference |

## 🔍 Hash map vs list: when to use which

| Use case | dict or set | list |
|----------|-------------|------|
| Lookup by key | fast | slow, O(n) |
| Ordered sequence | not guaranteed | yes |
| Index-based access | no | yes |
| Duplicate values | allowed (dict) | allowed |
| Enforce uniqueness | use a set | must filter yourself |
| Insert/remove lots | fast (amortized) | slower |

Rule of thumb: if I'm accessing values by a key, I reach for a dict or set over a list every time.

## 🗂️ Dictionary quick reference

**Create**: `d = {}`, `d = {'a': 1}`, `d = dict(x=10)`, or `d = dict([('a', 1)])`.

**Insert/update**: `d[key] = value`.

**Access**: `d[key]` raises `KeyError` if missing, so `d.get(key, default)` is the safe version.

**Membership**: `if 'key' in d:`.

**Delete**: `del d[key]`, or `d.pop(key)` to get the value back, or `d.clear()` to wipe it.

**Iterate**: `for key in d`, `for value in d.values()`, `for key, value in d.items()`.

**From a sequence**: `dict.fromkeys(['a', 'b'], 0)` gives `{'a': 0, 'b': 0}`.

**Key rules**: keys must be hashable and immutable. `str`, `int`, `tuple` are fine, `list`, `set`, `dict` are not.

## 💡 Interview notes to self

- Always mention average vs worst-case time for dict and set. Average is O(1), but collisions make the worst case O(n).
- Collisions are rare but real, so avoid weird custom key types unless they're properly hashable.
- Python dicts keep insertion order since 3.7, which is handy when order actually matters.

## 📝 What I want to remember

Dicts and sets give O(1) average lookup, insert, and delete, at the cost of extra memory. That trade is almost always worth it when I'm asking "have I seen this key before." When order or index access matters, that's when a list wins.

</div>
</div>
