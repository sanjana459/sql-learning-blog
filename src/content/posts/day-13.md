---
title: "NULL Handling - COALESCE, NULLIF, and NULL Traps"
meta_title: "SQL Day 13 - COALESCE, NULLIF, IFNULL, NULL in JOINs and GROUP BY"
description: "Mastering the most misunderstood part of SQL. How NULL behaves unexpectedly in comparisons and arithmetic, how COALESCE replaces NULLs with fallback values, how NULLIF prevents division by zero, and how NULLs behave in GROUP BY, ORDER BY, and JOINs."
date: 2025-08-13
image: "/images/posts/day-13.jpg"
categories: ["fundamentals"]
tags: ["NULL", "COALESCE", "NULLIF", "IFNULL", "IS NULL"]
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

## 🎯 Goal: Master the most misunderstood part of SQL

---

## ❓ Why NULL Is Tricky

NULL represents unknown or missing data. It is not zero. It is not an empty string. It is not false. It is the complete absence of a value. And SQL treats it in ways that trip up a lot of people.

```sql
-- These all return NULL, not what I might expect
SELECT NULL + 5;             -- returns NULL (not 5)
SELECT NULL || 'hello';      -- returns NULL (not 'hello')
SELECT NULL = NULL;          -- returns NULL (not TRUE)
SELECT NULL != NULL;         -- returns NULL (not FALSE)

-- NULL in arithmetic always produces NULL
SELECT salary + NULL FROM employees;  -- all NULLs
```

> ⚠️ **WATCH OUT**: Any arithmetic or comparison with NULL produces NULL. `NULL = NULL` is NOT true in SQL. In WHERE clauses, only rows where the condition is TRUE are included. NULL conditions get excluded. `COUNT(*)` includes NULLs but `COUNT(column)`, `AVG`, `SUM`, `MIN`, `MAX` all ignore NULLs.

---

## 🔧 COALESCE - Return the First Non-NULL Value

COALESCE is the most important NULL-handling function. It takes any number of arguments and returns the first one that is not NULL.

```sql
-- Replace NULL salary with 0
SELECT name, COALESCE(salary, 0) AS salary
FROM employees;

-- Use a fallback chain: try bonus first, then salary, then 0
SELECT name, COALESCE(bonus, salary, 0) AS compensation
FROM employees;

-- Replace NULL department with 'Unassigned'
SELECT name, COALESCE(department, 'Unassigned') AS dept
FROM employees;

-- COALESCE in calculations prevents NULL contamination
SELECT name,
  salary + COALESCE(bonus, 0) AS total_comp
FROM employees;
```

---

## 🔧 NULLIF - Return NULL When Two Values Are Equal

NULLIF is the opposite of COALESCE. It returns NULL if two values are equal, otherwise returns the first value. The most common use case is avoiding division by zero.

```sql
-- Avoid division by zero
SELECT
  department,
  total_sales / NULLIF(headcount, 0) AS sales_per_person
FROM dept_summary;
-- If headcount is 0, NULLIF returns NULL
-- Dividing by NULL returns NULL instead of crashing

-- Convert empty strings to NULL
SELECT NULLIF(notes, '') AS cleaned_notes FROM feedback;
```

---

## 🔧 Database-Specific Alternatives

| Function | Database | Behavior |
|---|---|---|
| `COALESCE(a, b)` | All databases (SQL standard) | Returns first non-NULL |
| `IFNULL(a, b)` | MySQL, SQLite | Returns b if a is NULL |
| `NVL(a, b)` | Oracle | Returns b if a is NULL |
| `ISNULL(a, b)` | SQL Server | Returns b if a is NULL |

> 💡 **TIP**: Always use `COALESCE` in new code. It is the SQL standard and works everywhere. I will see `IFNULL` in MySQL codebases and `NVL` in Oracle codebases. Good to know they all do the same thing.

---

## 🔧 NULL in GROUP BY

NULL is treated as a single group in GROUP BY. So employees with NULL department form their own group.

```sql
SELECT department, COUNT(*) AS headcount
FROM employees
GROUP BY department;
-- Employees with NULL department appear as their own group
```

---

## 🔧 NULL in ORDER BY

NULL sorts last in ASC and first in DESC in most databases. I can control this with COALESCE.

```sql
-- NULL salary rows appear first in DESC
SELECT name, salary FROM employees ORDER BY salary DESC;

-- Force NULLs to the end using COALESCE in ORDER BY
SELECT name, salary
FROM employees
ORDER BY COALESCE(salary, 0) DESC;
```

---

## 🔧 NULL in JOINs

NULL values in JOIN keys cause rows to be excluded from INNER JOINs because NULL does not match anything, including another NULL.

```sql
-- CEO has NULL manager_id so is excluded from INNER JOIN
SELECT e.name, m.name AS manager
FROM staff e
INNER JOIN staff m ON e.manager_id = m.id;
-- CEO does NOT appear

-- Use LEFT JOIN + COALESCE to handle it properly
SELECT e.name, COALESCE(m.name, 'No Manager') AS manager
FROM staff e
LEFT JOIN staff m ON e.manager_id = m.id;
-- CEO appears with 'No Manager'
```

---

## ✏️ Practice Exercises

1. Add 3 employees with NULL salaries. Show all employees replacing NULL salary with the text 'Not Set'
2. Calculate total compensation (salary + bonus) where bonus is sometimes NULL, use COALESCE to treat NULL bonus as 0
3. Show department headcount including a row for employees with no department
4. Use NULLIF to safely calculate average order value when order count might be zero
5. Show all staff with manager names and replace NULL manager with 'Top Level'

---

## ✅ What I Learned Today

- ✔ Why NULL behaves unexpectedly in comparisons and arithmetic (anything + NULL = NULL)
- ✔ COALESCE returns the first non-NULL value from a list of arguments
- ✔ NULLIF converts specific values to NULL, great for division by zero safety
- ✔ Database-specific equivalents: IFNULL (MySQL/SQLite), NVL (Oracle), ISNULL (SQL Server)
- ✔ How NULLs behave in GROUP BY (own group), ORDER BY (sorts first/last), and JOINs (excluded from INNER JOIN)

---

## 🟡 LeetCode - Day 13

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/find-customer-referee/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#584: Find Customer Referee</div>
    <div class="text-xs text-gray-500">NULL comparison trap</div>
  </a>
  <a href="https://leetcode.com/problems/article-views-i/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1148: Article Views I</div>
    <div class="text-xs text-gray-500">DISTINCT with NULLs</div>
  </a>
  <a href="https://leetcode.com/problems/invalid-tweets/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1683: Invalid Tweets</div>
    <div class="text-xs text-gray-500">LENGTH function with NULLs</div>
  </a>
</div>

</div>
</div>