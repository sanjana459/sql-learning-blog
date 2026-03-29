---
title: "Advanced Window Functions - NTILE, PERCENT_RANK, FIRST_VALUE"
meta_title: "SQL Day 14 - NTILE, PERCENT_RANK, CUME_DIST, FIRST_VALUE, NTH_VALUE, Moving Averages"
description: "Going beyond ranking with analytical window functions. NTILE for bucketing, PERCENT_RANK and CUME_DIST for percentile positions, FIRST_VALUE and NTH_VALUE for accessing specific positions in a window, and moving averages with rolling frames."
date: 2025-08-14
image: "/images/posts/day-14.jpg"
categories: ["window-functions"]
tags: ["NTILE", "PERCENT_RANK", "FIRST_VALUE", "NTH_VALUE", "moving average", "window functions"]
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

## 🎯 Goal: Go beyond ranking with analytical window functions

---

## 🪟 Quick Recap of Window Function Syntax

```sql
function_name() OVER (
  PARTITION BY column    -- optional: divide into groups
  ORDER BY column        -- optional: define order within group
  ROWS BETWEEN ...       -- optional: define the frame
)
```

---

## 🪟 NTILE - Dividing Rows Into Buckets

`NTILE(n)` divides rows into `n` roughly equal buckets and assigns each row a bucket number. Perfect for quartiles, deciles, and percentiles.

```sql
-- Divide employees into 4 salary quartiles
SELECT
  name,
  salary,
  NTILE(4) OVER (ORDER BY salary) AS salary_quartile
FROM employees;
-- Quartile 1 = lowest 25%, Quartile 4 = highest 25%

-- Divide into quartiles within each department
SELECT
  name,
  department,
  salary,
  NTILE(4) OVER (PARTITION BY department ORDER BY salary) AS dept_quartile
FROM employees;

-- Count employees in each quartile
WITH quartiled AS (
  SELECT name, salary,
    NTILE(4) OVER (ORDER BY salary) AS quartile
  FROM employees
)
SELECT quartile, COUNT(*) AS count, MIN(salary) AS min_sal, MAX(salary) AS max_sal
FROM quartiled
GROUP BY quartile
ORDER BY quartile;
```

---

## 🪟 PERCENT_RANK and CUME_DIST

These tell me where a row falls in terms of percentile position.

```sql
SELECT
  name,
  salary,
  -- What percentile is this person in? (0 to 1)
  ROUND(PERCENT_RANK() OVER (ORDER BY salary), 3) AS pct_rank,
  -- What fraction of rows have salary <= this row?
  ROUND(CUME_DIST() OVER (ORDER BY salary), 3) AS cumulative_dist
FROM employees;

-- Find employees in the top 25% by salary
WITH ranked AS (
  SELECT name, salary,
    PERCENT_RANK() OVER (ORDER BY salary DESC) AS pct
  FROM employees
)
SELECT name, salary
FROM ranked
WHERE pct <= 0.25;
```

| Function | Range | First Row Value | Last Row Value |
|---|---|---|---|
| `PERCENT_RANK()` | 0 to 1 | Always 0 | Always 1 |
| `CUME_DIST()` | 0 to 1 | 1/n | Always 1 |

---

## 🪟 FIRST_VALUE and LAST_VALUE

These return the first or last value in the window frame for each row.

```sql
SELECT
  name,
  department,
  salary,
  -- Highest salary in the department
  FIRST_VALUE(salary) OVER (
    PARTITION BY department
    ORDER BY salary DESC
  ) AS dept_max_salary,

  -- Each employee's salary vs the highest in their dept
  salary - FIRST_VALUE(salary) OVER (
    PARTITION BY department ORDER BY salary DESC
  ) AS gap_from_top
FROM employees;
```

> ⚠️ **WATCH OUT**: `LAST_VALUE()` is tricky. By default the window frame is `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, so "last" means the current row, not the last row in the partition. To get the true last value I must add `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`. Because of this, most developers use `FIRST_VALUE` with DESC ordering instead of `LAST_VALUE`.

---

## 🪟 NTH_VALUE - Any Position in the Window

```sql
-- Get the 2nd highest salary in each department
SELECT
  name, department, salary,
  NTH_VALUE(salary, 2) OVER (
    PARTITION BY department
    ORDER BY salary DESC
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ) AS second_highest_in_dept
FROM employees;
```

---

## 🪟 Moving Averages and Rolling Windows

```sql
-- 3-row moving average of salary ordered by hire date
SELECT
  name,
  hire_date,
  salary,
  ROUND(AVG(salary) OVER (
    ORDER BY hire_date
    ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
  ), 0) AS moving_3_avg
FROM employees
ORDER BY hire_date;

-- Running maximum salary seen so far
SELECT
  name, hire_date, salary,
  MAX(salary) OVER (
    ORDER BY hire_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_max_salary
FROM employees
ORDER BY hire_date;
```

---

## ✏️ Practice Exercises

1. Assign salary quartiles to all employees and show quartile number, name, salary
2. Find all employees who are in the top 30% by salary using PERCENT_RANK
3. Show each employee's salary, their department's highest salary, and the gap between them
4. Calculate a 3-row moving average of salary ordered by hire date
5. Find the 2nd highest paid employee in each department using NTH_VALUE

---

## ✅ What I Learned Today

- ✔ NTILE(n) divides rows into n equal-sized buckets
- ✔ PERCENT_RANK and CUME_DIST give percentile positions (0 to 1)
- ✔ FIRST_VALUE and NTH_VALUE access specific positions in a window
- ✔ The LAST_VALUE frame trap and why to use FIRST_VALUE with DESC instead
- ✔ Moving averages with ROWS BETWEEN n PRECEDING AND n FOLLOWING

---

## 🟡 LeetCode - Day 14

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/restaurant-growth/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1321: Restaurant Growth</div>
    <div class="text-xs text-gray-500">SUM with rolling window frame</div>
  </a>
  <a href="https://leetcode.com/problems/sales-analysis-iii/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1084: Sales Analysis III</div>
    <div class="text-xs text-gray-500">Window functions + date filtering</div>
  </a>
  <a href="https://leetcode.com/problems/trips-and-users/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#262: Trips and Users</div>
    <div class="text-xs text-gray-500">Complex filtering with window functions</div>
  </a>
</div>

</div>
</div>