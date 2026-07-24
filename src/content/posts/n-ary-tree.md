---
title: "N-ary Trees: Traversal & Encoding"
meta_title: "N-ary Trees - Traversal, BFS and Serialization"
description: "Week 13 notes: once a node can have any number of children, the binary-tree patterns still work, you just loop over children. Plus encoding an N-ary tree as a binary one."
date: 2025-10-20
image: "/images/posts/n-ary-tree-cover.jpg"
categories: ["trees"]
tags: ["n-ary tree", "traversal", "dfs", "bfs"]
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

Drop the "only two children" rule and you've got an N-ary tree: a node can have any number of children. File systems, org charts, the DOM, category menus, they're all this. The nice surprise is that every binary-tree pattern still works. You just swap `left` and `right` for a loop over the children list.

## 🌳 The node

```python
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children or []
```

## 🔎 DFS is the same, minus the two hardcoded children

Preorder and postorder carry straight over. The only change is iterating over the children:

```python
def preorder(node, out):
    if not node: return
    out.append(node.val)           # visit the node
    for child in node.children:    # then every child
        preorder(child, out)
    return out
```

For postorder, just move the `out.append(node.val)` to after the loop. There's no single "inorder" here, because with many children there's no obvious middle to visit between them.

## 🌊 BFS is the same too

```python
from collections import deque

def level_order(root):
    if not root: return []
    q, levels = deque([root]), []
    while q:
        level = []
        for _ in range(len(q)):
            node = q.popleft()
            level.append(node.val)
            q.extend(node.children)   # enqueue all the children
        levels.append(level)
    return levels
```

Same level-snapshot trick (`for _ in range(len(q))`) as the binary version.

## 🔗 Encoding it as a binary tree

Here's a neat classic. Any N-ary tree maps onto a binary tree using "left child, right sibling":

- the **left** pointer becomes the node's first child,
- the **right** pointer becomes the node's next sibling.

So you can reuse all your binary-tree machinery for N-ary structures, which is the idea behind Encode N-ary Tree to Binary Tree. First time I saw it, it felt like a cheat code.

## 📊 Cost

Every traversal visits each node once and follows each edge once, so O(n) time, with O(h) stack for DFS or O(width) queue for BFS.

## ⚠️ Things that bit me

- A null children list. Default to `[]` so the loop never blows up.
- Expecting an inorder traversal. It isn't really defined for N-ary trees.
- Forgetting that DFS depth is bounded by height while BFS memory is bounded by the widest level.

## 🏋️ Problems I did this week

- [N-ary Tree Preorder Traversal](https://leetcode.com/problems/n-ary-tree-preorder-traversal/), Easy
- [N-ary Tree Level Order Traversal](https://leetcode.com/problems/n-ary-tree-level-order-traversal/), Medium
- [Maximum Depth of N-ary Tree](https://leetcode.com/problems/maximum-depth-of-n-ary-tree/), Easy
- [Encode N-ary Tree to Binary Tree](https://leetcode.com/problems/encode-n-ary-tree-to-binary-tree/), Hard

## 📝 What I want to remember

N-ary trees are just binary-tree patterns with `for child in node.children` instead of left and right. No inorder, but pre/postorder and BFS all carry over. And left-child/right-sibling is the bridge back to binary trees.

</div>
</div>
