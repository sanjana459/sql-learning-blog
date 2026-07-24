---
title: "Graphs 101: BFS & DFS Traversals"
meta_title: "Graphs 101 - Representation, BFS, DFS & Visited Sets"
description: "Week 14 notes: a tree is just a graph without cycles. Graph representations, DFS and BFS with a visited set, shortest paths on unweighted graphs, and grids as graphs."
date: 2025-10-27
image: "/images/posts/graph-bfs-dfs-cover.jpg"
categories: ["graphs"]
tags: ["graphs", "bfs", "dfs", "visited set"]
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

Graphs are trees with the training wheels off: nodes connected by edges, and now cycles are allowed. The good news is that once traversal clicks, a huge pile of problems opens up (mazes, networks, dependencies, islands). The bad news is the cycles, which is exactly where the one new rule comes in.

## 🗺️ How to represent one

```python
# adjacency list, the usual choice, O(V + E) space
graph = {0: [1, 2], 1: [2], 2: [0, 3], 3: []}

# adjacency matrix, O(V^2) space, O(1) to check an edge
matrix = [[0, 1, 1, 0], ...]
```

Graphs can be directed or undirected, weighted or unweighted. I default to the adjacency list unless the graph is dense.

## 🔑 The one rule: track visited

This is the thing trees let you skip and graphs do not. Because graphs have cycles, without a visited set you'll loop forever.

## 🌊 BFS gives shortest paths on unweighted graphs

BFS explores in rings of increasing distance, so the first time it reaches a node, it got there by a shortest path (counting edges):

```python
from collections import deque

def bfs(graph, start):
    visited = {start}
    q = deque([start])
    while q:
        node = q.popleft()
        for nbr in graph[node]:
            if nbr not in visited:
                visited.add(nbr)      # mark when you enqueue, not when you pop
                q.append(nbr)
    return visited
```

Mark a node visited **when you enqueue it**, not when you pop it. I got this wrong once and the same node ended up in the queue several times. Small line, big difference.

## 🔎 DFS goes deep

```python
def dfs(graph, node, visited):
    if node in visited:
        return
    visited.add(node)
    for nbr in graph[node]:
        dfs(graph, nbr, visited)
```

DFS is my pick for connectivity, cycle detection, and topological ordering. BFS is for shortest paths and anything level by level.

## 🧩 Grids are graphs in disguise

This reframe made a lot of problems easier. A 2-D grid is an implicit graph where each cell connects to its 4 (or 8) neighbors. Number of Islands is the poster child:

```python
def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    count = 0
    def sink(r, c):
        if 0 <= r < rows and 0 <= c < cols and grid[r][c] == '1':
            grid[r][c] = '0'                      # mark visited
            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                sink(r + dr, c + dc)
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                sink(r, c)
    return count
```

## 📊 Cost

Both BFS and DFS are O(V + E). You visit every vertex and cross every edge once.

## ⚠️ Things that bit me

- No visited set, so infinite loops the moment there's a cycle.
- Marking visited too late in BFS, which duplicates nodes in the queue.
- Deep recursion on a big graph blowing the stack. For large inputs I go iterative with an explicit stack or use BFS.

## 🏋️ Problems I did this week

- [Number of Islands](https://leetcode.com/problems/number-of-islands/), Medium
- [Flood Fill](https://leetcode.com/problems/flood-fill/), Easy
- [Clone Graph](https://leetcode.com/problems/clone-graph/), Medium
- [Rotting Oranges](https://leetcode.com/problems/rotting-oranges/), Medium
- [Course Schedule](https://leetcode.com/problems/course-schedule/), Medium

## 📝 What I want to remember

Always track visited, since that's the one thing graphs add over trees. BFS for shortest unweighted paths, DFS for connectivity and ordering. And grids are graphs, so flood fill solves a whole island of them.

</div>
</div>
