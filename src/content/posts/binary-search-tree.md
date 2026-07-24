---
title: "Binary Search Trees: Order, Search & Balance"
meta_title: "Binary Search Trees - Search, Insert, Delete & Balance"
description: "Week 11 notes: a BST keeps values ordered so search, insert, and delete are O(h). The invariant, why inorder comes out sorted, and why balance is everything."
date: 2025-10-06
image: "/images/posts/binary-search-tree-cover.jpg"
categories: ["trees"]
tags: ["bst", "binary search tree", "inorder", "balance"]
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

Take last week's binary tree and add an ordering rule, and you get a BST. That one rule is what makes search, insert, and delete fast.

## 🧠 The invariant

For every node, not just the root:

- everything in the left subtree is smaller,
- everything in the right subtree is larger.

And it holds recursively, all the way down. That recursive part is the bit I underestimated at first, and it's exactly what trips people up in the validation problem below.

## 🔎 Search and insert in O(h)

At each node you compare and go left or right, halving the space like binary search:

```python
def search(node, target):
    while node:
        if target == node.val:
            return node
        node = node.left if target < node.val else node.right
    return None
```

| Operation | Balanced | Degenerate (a "stick") |
|-----------|----------|------------------------|
| Search | O(log n) | O(n) |
| Insert | O(log n) | O(n) |
| Delete | O(log n) | O(n) |

Big caveat: a BST is only fast if it's balanced. If you insert already-sorted data into a plain BST, it degenerates into a linked list and everything becomes O(n). Self-balancing trees (AVL, red-black) exist to guarantee O(log n), and that's why they exist.

## 📥 Inorder comes out sorted

Because left < node < right everywhere, an inorder traversal visits values in ascending order:

```python
def inorder(node, out):
    if not node: return
    inorder(node.left, out)
    out.append(node.val)
    inorder(node.right, out)
```

This one fact is the key to validate-BST, kth-smallest, and convert-BST-to-sorted-list. Whenever a BST problem mentions order, I think inorder first.

## ✅ Validating a BST (the range trick)

The bug I made, and I think everyone makes, is checking only against the direct children. That's not enough. You have to carry down the allowed range:

```python
def is_valid_bst(node, lo=float('-inf'), hi=float('inf')):
    if not node:
        return True
    if not (lo < node.val < hi):
        return False
    return (is_valid_bst(node.left, lo, node.val) and
            is_valid_bst(node.right, node.val, hi))
```

## 🧩 Deletion has three cases

1. **Leaf**: just remove it.
2. **One child**: replace the node with its child.
3. **Two children**: replace it with its inorder successor (the smallest value in the right subtree), then delete that successor.

The two-children case is the fiddly one, so I keep the "inorder successor" phrase in my head as the recipe.

## ⚠️ Things that bit me

- Validating with only local `left < node < right` checks and missing violations deeper down. Use the range.
- Assuming the tree is balanced when the input is sorted.
- Reaching for a full sort on kth-smallest when inorder with an early stop is cleaner.

## 🏋️ Problems I did this week

- [Search in a Binary Search Tree](https://leetcode.com/problems/search-in-a-binary-search-tree/), Easy
- [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/), Medium
- [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/), Medium
- [Lowest Common Ancestor of a BST](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/), Medium
- [Insert into a Binary Search Tree](https://leetcode.com/problems/insert-into-a-binary-search-tree/), Medium

## 📝 What I want to remember

The invariant holds recursively, which is what makes O(h) possible. Inorder gives you sorted output for free. And everything hinges on balance, so validate with a propagated range, not local checks.

</div>
</div>
