---
title: "Recursive CTEs - Hierarchical and Sequential Data"
meta_title: "SQL Day 12 - Recursive CTEs, Org Charts, Date Series"
description: "Learning to query trees, hierarchies, and sequences with SQL. Recursive CTEs, walking org charts to any depth, generating number and date series, and using date series to fill gaps in time-series data."
date: 2025-08-12
image: "/images/posts/day-12.jpg"
categories: ["subqueries"]
tags: ["CTE", "recursive CTE", "hierarchy", "date series"]
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

## 🎯 Goal: Query trees, hierarchies, and sequences with SQL

---

## 🔁 What Makes a CTE Recursive?

A recursive CTE is one that references itself. This is how I query hierarchical data like org charts, category trees, or file systems. Data where each row can have a parent that is also in the same table.

> 🔑 **KEY CONCEPT**: A recursive CTE has two parts joined by UNION ALL:
> 1. **Anchor member** - the starting point (base case). Runs once.
> 2. **Recursive member** - references the CTE itself. Runs repeatedly until no more rows match.
>
> Most databases have a recursion limit (default around 100 levels) to prevent infinite loops.

```sql
-- The structure of a recursive CTE
WITH RECURSIVE cte_name AS (
  -- Part 1: Anchor (starting rows)
  SELECT ...
  FROM table
  WHERE starting_condition

  UNION ALL

  -- Part 2: Recursive step (joins CTE to itself)
  SELECT ...
  FROM table
  JOIN cte_name ON linking_condition
)

SELECT * FROM cte_name;
```

---

## 🔁 Walking an Org Chart

Using the staff table from Day 8. Finding all reports under CEO Dana at any depth.

```sql
-- staff: id, name, manager_id

WITH RECURSIVE org_tree AS (
  -- Anchor: start with the CEO (no manager)
  SELECT id, name, manager_id, 0 AS depth, name AS path
  FROM staff
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive: find each person's direct reports
  SELECT s.id, s.name, s.manager_id,
    ot.depth + 1,
    ot.path || ' > ' || s.name
  FROM staff s
  JOIN org_tree ot ON s.manager_id = ot.id
)

SELECT depth, name, path
FROM org_tree
ORDER BY depth, name;
```

This is really cool. The query keeps joining until there are no more reports to find at any level.

---

## 🔁 Generating a Number Series

Recursive CTEs are also used to generate sequences of numbers or dates. This is very useful in Data Engineering.

```sql
-- Generate numbers 1 to 10
WITH RECURSIVE nums AS (
  SELECT 1 AS n               -- anchor: start at 1
  UNION ALL
  SELECT n + 1                -- recursive: add 1 each time
  FROM nums
  WHERE n < 10                -- stop condition
)

SELECT n FROM nums;
```

```sql
-- Generate a date series for January 2024
WITH RECURSIVE date_series AS (
  SELECT DATE('2024-01-01') AS dt
  UNION ALL
  SELECT DATE(dt, '+1 day')
  FROM date_series
  WHERE dt < DATE('2024-01-31')
)

SELECT dt FROM date_series;
```

> 💡 **TIP**: The date series pattern is extremely useful in DE work. When I need to show "sales for every day in January" but some days have no sales, I generate all dates with a recursive CTE then LEFT JOIN my sales data to it. Days with no sales show 0 instead of being missing entirely. In PostgreSQL there is a built-in `generate_series()` that does the same thing.

---

## 🔁 Showing Full Paths with Indentation

```sql
WITH RECURSIVE org_tree AS (
  SELECT
    id, name, manager_id,
    0 AS level,
    CAST(name AS TEXT) AS chain
  FROM staff WHERE manager_id IS NULL

  UNION ALL

  SELECT
    s.id, s.name, s.manager_id,
    ot.level + 1,
    ot.chain || ' -> ' || s.name
  FROM staff s
  INNER JOIN org_tree ot ON s.manager_id = ot.id
  WHERE ot.level < 10   -- safety limit to prevent infinite recursion
)

SELECT
  SUBSTR('          ', 1, level * 3) || name AS org_chart,
  level,
  chain
FROM org_tree
ORDER BY chain;
```

The `WHERE ot.level < 10` is a safety stop condition. Always include one to prevent infinite recursion if there is bad data.

---

## ✏️ Practice Exercises

1. Add 2 more levels to the staff table, then show the full org tree with depth
2. Generate a series of dates for the entire month of March 2024
3. Using the date series, LEFT JOIN to a sales table to show daily sales including days with zero sales
4. Find all employees at depth level 2 (grandchildren of the CEO) in the org tree

---

## ✅ What I Learned Today

- ✔ How recursive CTEs work: anchor + UNION ALL + recursive step
- ✔ How to walk a hierarchy (org chart) to any depth
- ✔ How to generate number and date series using recursion
- ✔ How to add safety stop conditions to prevent infinite recursion
- ✔ How to use date series + LEFT JOIN to fill gaps in time-series data

---

## 🟡 LeetCode - Day 12

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/find-the-missing-ids/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1613: Find the Missing IDs</div>
    <div class="text-xs text-gray-500">Recursive CTE to generate sequence</div>
  </a>
  <a href="https://leetcode.com/problems/find-the-subtasks-that-did-not-execute/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1767: Subtasks That Did Not Execute</div>
    <div class="text-xs text-gray-500">Recursive CTE</div>
  </a>
</div>

</div>
</div>