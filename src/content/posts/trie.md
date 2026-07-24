---
title: "Tries: Prefix Trees for Fast Lookups"
meta_title: "Tries (Prefix Trees) - Insert, Search & Autocomplete"
description: "Week 12 notes: a trie stores strings by shared prefixes, so lookup and prefix search depend on word length, not how many words you've got. Where autocomplete comes from."
date: 2025-10-13
image: "/images/posts/trie-cover.jpg"
categories: ["trees"]
tags: ["trie", "prefix tree", "strings", "autocomplete"]
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

A trie (say it like "try," it comes from re**trie**val) is a tree built specifically for strings. It stores words along shared prefixes, so every operation depends on the length of the word, not on how many words are in the thing. That last part is the whole selling point.

## 🌲 The idea

Each node is a character, and a path from the root spells out a prefix. Words that share a prefix share the path, and a little flag marks where a full word ends.

```
root
 └─ c ─ a ─ t*        ("cat")
         └─ r*        ("car")
```

"cat" and "car" reuse the `c → a` path. That reuse is the entire point.

## 🧱 The node and the operations

```python
class TrieNode:
    def __init__(self):
        self.children = {}       # char -> TrieNode
        self.is_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            node = node.children.setdefault(ch, TrieNode())
        node.is_word = True

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_word

    def starts_with(self, prefix):
        return self._walk(prefix) is not None

    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node
```

| Operation | Time | Note |
|-----------|------|------|
| Insert | O(L) | L is the word length |
| Search | O(L) | Doesn't care how many words exist |
| Prefix search | O(L) | This is the one you can't get elsewhere |

Here's the honest comparison: a plain hash set also answers "is this exact word here?" in O(L). The reason to bother with a trie is the last row, "does any word start with this prefix?" A set can't do that efficiently, and a trie can.

## 🧩 Where it actually helps

- **Autocomplete**: walk to the prefix node, then DFS below it to collect every word that follows.
- **Spell-check / dictionary**: fast membership plus prefix queries.
- **Word games and board search**: bail out of a search path the second a prefix doesn't exist. This is a huge speedup in Word Search II.
- **IP routing and bitwise tries**: longest-prefix matching.

## ⚖️ The trade-off

Tries spend memory to save time. Every node carries a children map, which is costly for big alphabets or sparse data. So it's a reach-for-it-when-prefixes-matter tool, not a default.

## ⚠️ Things that bit me

- Forgetting `is_word`. Without the end-of-word flag, "car" would falsely match "ca".
- Confusing search and prefix. `search` needs `is_word` to be true, `starts_with` doesn't.
- Over-allocating children. A dict is leaner than a fixed 26-slot array when the trie is sparse.

## 🏋️ Problems I did this week

- [Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/), Medium
- [Design Add and Search Words](https://leetcode.com/problems/design-add-and-search-words-data-structure/), Medium
- [Word Search II](https://leetcode.com/problems/word-search-ii/), Hard
- [Replace Words](https://leetcode.com/problems/replace-words/), Medium

## 📝 What I want to remember

Insert, search, and prefix are all O(L), independent of how many words you store. The reason to use a trie over a set is prefix queries, which is exactly what autocomplete needs. It costs extra memory, so save it for prefix-heavy problems.

</div>
</div>
