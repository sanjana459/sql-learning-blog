---
title: "Binary Trees: Traversals & DFS / BFS"
meta_title: "Binary Trees - DFS Traversals, BFS Levels & Recursion"
description: "Week 10 notes: binary trees are basically recursion you can draw. The three DFS orders, level-order BFS, and the one move that solves most tree problems."
date: 2025-09-29
image: "/images/posts/binary-tree-cover.jpg"
categories: ["trees"]
tags: ["binary tree", "dfs", "bfs", "traversal"]
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

This is where the recursion weeks pay off. A binary tree is just a node with up to two children, and honestly most tree problems reduce to the same move: do a little work at the node, then recurse on the children.

## 🌳 The node and the vocab

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

Words I had to keep straight: root, leaf (no children), height (longest path down to a leaf), depth (distance from the root), and balanced (subtree heights differ by at most one).

## 🔎 DFS and the three orders

DFS goes deep before wide. The only thing that changes between the three orders is **when** you visit the node relative to its children:

```python
def inorder(node):      # Left, Node, Right   -> sorted order in a BST
    if not node: return
    inorder(node.left)
    visit(node.val)
    inorder(node.right)

def preorder(node):     # Node, Left, Right   -> copy or serialize
    if not node: return
    visit(node.val)
    preorder(node.left)
    preorder(node.right)

def postorder(node):    # Left, Right, Node   -> compute from children up
    if not node: return
    postorder(node.left)
    postorder(node.right)
    visit(node.val)
```

How I remember which is which: inorder gives you sorted values in a BST, preorder is for copying or serializing, and postorder is for anything where the parent needs its children's results first (height, deletion).

## 🌊 BFS: level by level

BFS uses a queue and walks the tree one level at a time. It's the pattern for "do something per level" and for shortest paths in an unweighted tree:

```python
from collections import deque

def level_order(root):
    if not root: return []
    q, levels = deque([root]), []
    while q:
        level = []
        for _ in range(len(q)):        # process exactly one level
            node = q.popleft()
            level.append(node.val)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
        levels.append(level)
    return levels
```

That `for _ in range(len(q))` line is the whole trick. It snapshots the current level's size so you cleanly separate one level from the next. I memorized this one because I kept fumbling it.

## 🧩 The move that solves most tree problems

Compute the node's answer from its children's answers. Max depth is the tiny example:

```python
def max_depth(node):
    if not node:
        return 0
    return 1 + max(max_depth(node.left), max_depth(node.right))
```

Height, node count, "is it balanced," path sums, diameter, they're all variations of "combine the children, then account for this node."

## ⚠️ Things that bit me

- Forgetting the null base case and crashing on an empty child.
- Mixing up height and depth. Height counts down to the leaves, depth counts from the root.
- Reaching for DFS on a "minimum depth" or "by level" question when BFS is the natural fit.

## 🏋️ Problems I did this week

- [Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/), Easy
- [Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/), Easy
- [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/), Medium
- [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/), Easy
- [Balanced Binary Tree](https://leetcode.com/problems/balanced-binary-tree/), Easy

## 📝 What I want to remember

DFS with recursion for structure, BFS with a queue for levels. The three DFS orders only differ in when you visit the node. And when in doubt, solve for the node using the children's results.

</div>
</div>
