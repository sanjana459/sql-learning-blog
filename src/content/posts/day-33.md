---
title: "ROLLUP, CUBE, GROUPING SETS, and WITH TIES"
meta_title: "SQL Day 33 - ROLLUP, CUBE, GROUPING SETS, GROUPING(), WITH TIES"
description: "Multi-dimensional aggregation missing from the main series. ROLLUP for hierarchical subtotals, GROUPING() to label subtotal rows, CUBE for cross-dimensional reporting, GROUPING SETS for custom combinations, and WITH TIES for inclusive LIMIT."
date: 2025-09-02
image: "/images/posts/day-33.jpg"
categories: ["advanced"]
tags: ["ROLLUP", "CUBE", "GROUPING SETS", "WITH TIES", "aggregations", "subtotals"]
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

## 🎯 Goal: Fill the gap - multi-dimensional aggregation missing from the main series

---

## 📊 ROLLUP - Automatic Subtotals

Often I need subtotals and grand totals alongside regular GROUP BY results. Without ROLLUP I would need multiple queries and UNION ALL. ROLLUP generates them automatically.

```sql
-- Without ROLLUP: three separate queries needed
SELECT department, job_level, SUM(salary) FROM employees GROUP BY department, job_level
UNION ALL
SELECT department, NULL, SUM(salary) FROM employees GROUP BY department
UNION ALL
SELECT NULL, NULL, SUM(salary) FROM employees;

-- WITH ROLLUP: one query, automatic subtotals
SELECT department, job_level, SUM(salary) AS total_salary
FROM employees
GROUP BY ROLLUP(department, job_level);

-- Result includes:
-- Engineering | Senior | 204000  (leaf level)
-- Engineering | Mid    | 176000  (leaf level)
-- Engineering | NULL   | 380000  (department subtotal)
-- Marketing   | Senior | 75000   (leaf level)
-- Marketing   | NULL   | 147000  (department subtotal)
-- NULL        | NULL   | 527000  (grand total)
```

> 🔑 **KEY CONCEPT**: `ROLLUP(A, B)` generates: (A, B), (A), () — three levels. `ROLLUP(A, B, C)` generates four levels. NULL in the result means "all values" for that column — it represents the subtotal/total row. Use `GROUPING(column)` to distinguish NULL-as-subtotal from NULL-as-actual-data.

---

## 📊 GROUPING() - Distinguishing Subtotal NULLs

```sql
SELECT
  CASE WHEN GROUPING(department) = 1 THEN 'ALL DEPARTMENTS'
       ELSE department END AS department,
  CASE WHEN GROUPING(job_level) = 1 THEN 'ALL LEVELS'
       ELSE job_level END AS job_level,
  SUM(salary) AS total_salary
FROM employees
GROUP BY ROLLUP(department, job_level);

-- GROUPING() returns 1 when the NULL is from ROLLUP (subtotal row)
-- GROUPING() returns 0 when the NULL is actual data
```

---

## 📊 CUBE - Every Possible Combination

CUBE generates subtotals for every possible combination of the grouping columns, like ROLLUP but in all directions simultaneously.

```sql
-- CUBE(department, year) generates ALL combinations:
-- (dept, year)  -- most detailed
-- (dept)        -- by dept only
-- (year)        -- by year only
-- ()            -- grand total

SELECT department, year, SUM(salary) AS total_salary
FROM employees
GROUP BY CUBE(department, year)
ORDER BY department NULLS LAST, year NULLS LAST;
```

| Feature | What It Generates | When to Use |
|---|---|---|
| GROUP BY | One level of aggregation | Normal use |
| ROLLUP(A, B) | Hierarchy: (A,B), (A), () | Subtotals along a hierarchy (year > month > day) |
| CUBE(A, B) | All combinations: (A,B), (A), (B), () | Cross-dimensional reporting, BI dashboards |
| GROUPING SETS | Exactly the combinations I specify | Custom combinations, most flexible |

---

## 📊 GROUPING SETS - Custom Combinations

GROUPING SETS lets me specify exactly which groupings I want. More flexible than ROLLUP or CUBE.

```sql
-- Get: by department, by year, and grand total
-- but NOT the combination of (department, year)
SELECT
  COALESCE(department, 'ALL') AS department,
  COALESCE(CAST(year AS TEXT), 'ALL') AS year,
  SUM(salary) AS total_salary
FROM employees
GROUP BY GROUPING SETS (
  (department),   -- just by department
  (year),         -- just by year
  ()              -- grand total
);

-- GROUPING SETS equivalent to ROLLUP:
-- GROUP BY ROLLUP(A, B)    = GROUP BY GROUPING SETS ((A,B), (A), ())

-- GROUPING SETS equivalent to CUBE:
-- GROUP BY CUBE(A, B)      = GROUP BY GROUPING SETS ((A,B), (A), (B), ())
```

---

## 📊 WITH TIES - Include Tied Rows in LIMIT

WITH TIES includes all rows that tie for the last position. Available in PostgreSQL, SQL Server, Snowflake, and BigQuery.

```sql
-- FETCH FIRST n ROWS WITH TIES (standard SQL)
SELECT name, salary
FROM employees
ORDER BY salary DESC
FETCH FIRST 3 ROWS WITH TIES;
-- If 4th and 5th rows tie the 3rd, all 5 rows are returned

-- Without WITH TIES: arbitrary 3 rows, ties broken unpredictably
SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3;

-- MySQL workaround (no WITH TIES): use RANK() instead
WITH ranked AS (
  SELECT name, salary, RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
)
SELECT name, salary FROM ranked WHERE rnk <= 3;
```

---

## ✏️ Practice

1. Using ROLLUP, show total salary by department and job level with department subtotals and grand total
2. Use GROUPING() to replace NULL subtotal markers with labels like 'All Departments'
3. Using CUBE on department and hire_year, show salary totals for all combinations
4. Using GROUPING SETS, show salary totals by department only, by city only, and grand total (no combination of both)
5. Show top 3 salaries WITH TIES and verify that employees with equal salaries all appear

---

## ✅ What I Learned Today

- ✔ ROLLUP generates hierarchical subtotals automatically
- ✔ GROUPING() returns 1 for subtotal NULLs and 0 for actual data NULLs
- ✔ CUBE generates every possible combination of grouping columns
- ✔ GROUPING SETS lets me specify exactly the combinations I want
- ✔ WITH TIES includes all rows that tie for the last position in a LIMIT/FETCH FIRST

---

## 🟡 LeetCode - Day 33

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/monthly-transactions-i/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1193: Monthly Transactions I</div>
    <div class="text-xs text-gray-500">Date grouping and conditional SUM</div>
  </a>
  <a href="https://leetcode.com/problems/count-salary-categories/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1907: Count Salary Categories</div>
    <div class="text-xs text-gray-500">GROUPING SETS style logic with CASE</div>
  </a>
</div>

</div>
</div>