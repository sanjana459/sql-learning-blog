---
title: "Advanced Binary Tree & BST"
meta_title: "Advanced Trees - LCA, Path Sum, Serialize & Return-Tuple DFS"
description: "Week 22 notes: the harder tree problems, where a node has to report several facts to its parent at once. The return-tuple DFS pattern, lowest common ancestor, path sums, and serialize/deserialize."
date: 2025-12-22
image: "/images/posts/binary-tree-bst-advanced-cover.jpg"
categories: ["trees"]
tags: ["binary tree", "bst", "lca", "dfs"]
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

The basic tree traversals were Week 10. This week is the harder stuff, and once I spotted the common thread it got a lot less intimidating: most hard tree problems are one DFS where each node returns a small bundle of facts that its parent needs.

## 🎒 The return-tuple DFS

Instead of returning a single number, return a tuple so the parent can combine children cleanly. Diameter is the small example: each node returns its height while quietly updating a global best.

```python
def diameter(root):
    best = 0
    def height(node):
        nonlocal best
        if not node:
            return 0
        lh = height(node.left)
        rh = height(node.right)
        best = max(best, lh + rh)      # longest path passing through this node
        return 1 + max(lh, rh)         # height reported back to the parent
    height(root)
    return best
```

The same shape solves is-balanced (return height and a balanced flag), max path sum (return the best downward path), and longest univalue path. Once I started asking "what does this node need to tell its parent, and what does it track globally," these stopped feeling like separate problems.

## 🌿 Lowest common ancestor

For a general binary tree, DFS and let each node report whether it saw `p` or `q`:

```python
def lca(root, p, q):
    if not root or root is p or root is q:
        return root
    left = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right:                 # p and q split here, so this is the LCA
        return root
    return left or right               # both on one side, or neither
```

In a BST it's even easier: walk down, and the first node that sits between `p` and `q` (or equals one) is the LCA, in O(h).

## 🧮 Path sum variations

- **Root-to-leaf target**: DFS subtracting the value, check at the leaves.
- **Any path summing to K**: prefix sums, but on the tree. Carry a running sum and a hash map, exactly like subarray-sum-equals-K from Week 20. That connection was a nice moment.

## 💾 Serialize and deserialize

Encode a tree to a string and rebuild it, another favorite design question. Preorder with explicit null markers is the cleanest way I found:

```python
def serialize(root):
    out = []
    def dfs(node):
        if not node:
            out.append("#")            # null marker, this part is important
            return
        out.append(str(node.val))
        dfs(node.left)
        dfs(node.right)
    dfs(root)
    return ",".join(out)
```

Deserialize by consuming the same preorder stream and rebuilding null-terminated subtrees.

## ⚠️ Things that bit me

- Returning too little. If the parent needs both height and validity, return both, don't recompute.
- LCA identity versus value. Compare node identity (`is`), not values, unless values are unique.
- Skipping the null markers in serialization. Without them the structure can't be rebuilt uniquely.

## 🏋️ Problems I did this week

- [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/), Medium
- [Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/), Hard
- [Path Sum III](https://leetcode.com/problems/path-sum-iii/), Medium
- [Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/), Hard
- [Construct Binary Tree from Preorder and Inorder](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/), Medium

## 📝 What I want to remember

The return-tuple DFS, plus a `nonlocal` best, handles most "hard" tree problems. LCA collapses to "left and right both found something, so this is it." Serialize with null markers, and tree path-sum reuses the subarray-sum-equals-K hash trick.

</div>
</div>
