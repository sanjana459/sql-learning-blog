---
title: "Graphs: Shortest Paths & Dijkstra"
meta_title: "Shortest Paths - BFS, Dijkstra, Bellman-Ford & Topo Sort"
description: "Week 24 notes: once edges have weights, plain BFS isn't enough. Picking between BFS, 0-1 BFS, Dijkstra, and Bellman-Ford, plus topological sort for dependency ordering."
date: 2026-01-05
image: "/images/posts/graphs-shortest-paths-cover.jpg"
categories: ["graphs"]
tags: ["graphs", "dijkstra", "shortest path", "topological sort"]
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

Graphs get weights this week. Plain BFS finds shortest paths only when every edge costs the same, so once edges have different weights you need the right algorithm for the situation. Most of the skill is just picking correctly.

## 🧭 Which one do I use?

| Situation | Use | Time |
|-----------|-----|------|
| Unweighted (equal edges) | BFS | O(V + E) |
| Weights of 0 or 1 | 0-1 BFS (deque) | O(V + E) |
| Non-negative weights | Dijkstra | O(E log V) |
| Negative weights allowed | Bellman-Ford | O(V·E) |
| All pairs, small graph | Floyd-Warshall | O(V³) |

## ⭐ Dijkstra (non-negative weights)

It's a greedy BFS that always expands the closest unfinished node, using a min-heap keyed by distance:

```python
import heapq

def dijkstra(graph, src):             # graph: node -> [(nbr, weight)]
    dist = {src: 0}
    pq = [(0, src)]
    while pq:
        d, node = heapq.heappop(pq)
        if d > dist.get(node, float('inf')):
            continue                   # stale entry, skip it (lazy deletion again)
        for nbr, w in graph[node]:
            nd = d + w
            if nd < dist.get(nbr, float('inf')):
                dist[nbr] = nd
                heapq.heappush(pq, (nd, nbr))
    return dist
```

Big caveat: Dijkstra breaks with negative edges, because a cheap edge you find later could improve a node you already finalized. If negatives are possible, don't use it.

## ➖ Bellman-Ford (handles negatives)

Relax every edge `V - 1` times. If a further relaxation on pass `V` still improves something, you've got a negative cycle:

```python
def bellman_ford(edges, n, src):      # edges: (u, v, w)
    dist = [float('inf')] * n
    dist[src] = 0
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    return dist
```

## 🔃 0-1 BFS

When weights are only 0 or 1, you can skip the heap entirely: push 0-weight moves to the front of a deque and 1-weight moves to the back. That keeps the deque ordered by distance, so it's O(V + E). Great for grid problems where some moves are free.

## 🗂️ Topological sort

For a DAG, order the nodes so every edge points forward. It's the pattern behind Course Schedule and any build/dependency system. Kahn's algorithm keeps pulling off nodes with in-degree 0:

```python
from collections import deque

def topo_sort(graph, indeg):
    q = deque([n for n in graph if indeg[n] == 0])
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nbr in graph[node]:
            indeg[nbr] -= 1
            if indeg[nbr] == 0:
                q.append(nbr)
    return order if len(order) == len(graph) else []   # empty means a cycle
```

The nice bonus: if you can't order everything, there's a cycle. So topo sort doubles as cycle detection.

## ⚠️ Things that bit me

- Running Dijkstra on a graph with negative edges and getting wrong answers. Switch to Bellman-Ford.
- Not skipping stale heap entries, which is correct but slower. The `d > dist[node]` guard fixes it.
- Expecting a topological order on a graph that has a cycle. There isn't one, and the leftover nodes tell you.

## 🏋️ Problems I did this week

- [Network Delay Time](https://leetcode.com/problems/network-delay-time/), Medium (Dijkstra)
- [Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/), Medium (Bellman-Ford)
- [Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/), Medium
- [Course Schedule II](https://leetcode.com/problems/course-schedule-ii/), Medium (topo sort)
- [Word Ladder](https://leetcode.com/problems/word-ladder/), Hard (BFS)

## 📝 What I want to remember

Match the algorithm to the weights: BFS, 0-1 BFS, Dijkstra, or Bellman-Ford. Dijkstra is greedy plus a min-heap and assumes non-negative edges. Topological sort orders dependencies and catches cycles at the same time.

</div>
</div>
