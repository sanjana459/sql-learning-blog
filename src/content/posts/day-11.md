---
title: "CTEs - Common Table Expressions"
meta_title: "SQL Day 11 - CTEs, WITH, Multiple CTEs, CTE vs Subquery"
description: "Learning to write cleaner, more readable multi-step queries using CTEs. How WITH works, chaining multiple CTEs, when to use a CTE vs a subquery, and combining CTEs with window functions."
date: 2025-08-11
image: "/images/posts/day-11.jpg"
categories: ["subqueries"]
tags: ["CTE", "WITH", "subquery", "window functions"]
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

## 🎯 Goal: Write cleaner, more readable multi-step queries

---

## 📖 What Is a CTE?

A CTE (Common Table Expression) is a named temporary result set I define at the top of my query. It works like a subquery but is much easier to read and reuse. I think of it as giving a name to an intermediate result, then using that name in the main query.

```sql
-- Syntax: WITH cte_name AS (...) SELECT ...
WITH dept_stats AS (
  SELECT
    department,
    AVG(salary) AS avg_salary,
    COUNT(*) AS headcount
  FROM employees
  GROUP BY department
)

SELECT *
FROM dept_stats
WHERE headcount >= 2
ORDER BY avg_salary DESC;
```

> 🔑 **KEY CONCEPT**: CTEs start with the `WITH` keyword before `SELECT`. The CTE exists only for the duration of that single query, it is not stored permanently. I can reference a CTE multiple times in the same query, unlike a subquery which I would have to repeat.

---

## 📖 Multiple CTEs in One Query

I can chain multiple CTEs together. Define them all before the final SELECT, separated by commas:

```sql
WITH
-- CTE 1: Department averages
dept_averages AS (
  SELECT department, AVG(salary) AS avg_sal
  FROM employees
  GROUP BY department
),

-- CTE 2: Employees above their dept average
above_average AS (
  SELECT e.name, e.department, e.salary, d.avg_sal
  FROM employees e
  JOIN dept_averages d ON e.department = d.department
  WHERE e.salary > d.avg_sal
)

-- Final query: count how many above-average per dept
SELECT department, COUNT(*) AS above_avg_count
FROM above_average
GROUP BY department;
```

> 💡 **TIP**: Each CTE can reference CTEs defined before it in the same WITH block. This lets me build a query step by step, like writing a pipeline. In real Data Engineering, CTEs in dbt models are the standard way to write transformations. This clicked for me today.

---

## 📖 CTE vs Subquery

| Aspect | Subquery | CTE |
|---|---|---|
| Readability | Hard to read when nested deeply | Much easier, named and at the top |
| Reusability | Must repeat if used more than once | Define once, reference many times |
| Debugging | Hard to test intermediate steps | Easy, just run the CTE part alone |
| Performance | Similar in most databases | Similar, sometimes better optimized |
| Use when | Simple one-off filters | Multi-step logic or reused results |

---

## 📖 Rewriting Subqueries as CTEs

Here is the same query written both ways. The CTE version is so much easier to read.

```sql
-- SUBQUERY version (harder to read)
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees)
AND department IN (
  SELECT department FROM employees
  GROUP BY department HAVING COUNT(*) > 1
);

-- CTE version (much cleaner)
WITH
company_avg AS (
  SELECT AVG(salary) AS avg_sal FROM employees
),

multi_person_depts AS (
  SELECT department
  FROM employees
  GROUP BY department
  HAVING COUNT(*) > 1
)

SELECT e.name, e.salary
FROM employees e
JOIN company_avg ON e.salary > company_avg.avg_sal
JOIN multi_person_depts mpd ON e.department = mpd.department;
```

---

## 📖 CTEs With Window Functions

A very common pattern: use a CTE to calculate window function results, then filter in the outer query. This is cleaner than a nested subquery.

```sql
-- Top 2 earners per department using CTE + window function
WITH ranked AS (
  SELECT
    name,
    department,
    salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
  FROM employees
)

SELECT name, department, salary
FROM ranked
WHERE rnk <= 2
ORDER BY department, salary DESC;
```

---

## ✏️ Practice Exercises

1. Rewrite the Day 6 subquery exercises as CTEs
2. Using two CTEs, find employees who earn above both the company average AND their department average
3. Write a CTE that ranks employees by salary within their department, then select only rank 1 (highest paid per dept)
4. Use three chained CTEs to: (1) get dept stats, (2) label each dept as High/Low budget, (3) show employees with their dept label

---

## ✅ What I Learned Today

- ✔ What CTEs are and how the WITH keyword works
- ✔ How to write single and multiple chained CTEs
- ✔ When to use CTEs vs subqueries (almost always CTEs for readability)
- ✔ How to combine CTEs with JOINs and window functions
- ✔ How to rewrite complex nested subqueries as clean CTEs

---

## 🟡 LeetCode - Day 11

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/department-top-three-salaries/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#185: Department Top Three Salaries</div>
    <div class="text-xs text-gray-500">CTE + DENSE_RANK</div>
  </a>
  <a href="https://leetcode.com/problems/restaurant-growth/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1321: Restaurant Growth</div>
    <div class="text-xs text-gray-500">CTE + window function</div>
  </a>
  <a href="https://leetcode.com/problems/movie-rating/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1341: Movie Rating</div>
    <div class="text-xs text-gray-500">Two CTEs + UNION</div>
  </a>
</div>

</div>
</div>