---
title: "Aggregate Functions - COUNT, SUM, AVG, MIN, MAX"
meta_title: "SQL Day 5 - COUNT, SUM, AVG, GROUP BY, HAVING"
description: "Learning to turn rows of data into meaningful summary numbers using aggregate functions. Also covering GROUP BY to aggregate by category and HAVING to filter groups."
date: 2025-08-05
image: "/images/posts/day-5.jpg"
categories: ["aggregations"]
tags: ["COUNT", "SUM", "AVG", "GROUP BY", "HAVING", "aggregations"]
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

## 🎯 Goal: Turn rows of data into meaningful summary numbers

---

## 📊 What Are Aggregate Functions?

Aggregate functions collapse multiple rows into a single summary value. Instead of seeing 100 individual salaries, I see the average. Instead of 1000 orders, I see the total.

| Function | What It Does | Example | Returns |
|---|---|---|---|
| `COUNT(*)` | Count total rows (including NULLs) | `COUNT(*)` | 6 |
| `COUNT(column)` | Count non-NULL values only | `COUNT(salary)` | 5 |
| `SUM(column)` | Add up all values | `SUM(salary)` | 500000 |
| `AVG(column)` | Calculate average (ignores NULLs) | `AVG(salary)` | 83333 |
| `MIN(column)` | Find smallest value | `MIN(salary)` | 68000 |
| `MAX(column)` | Find largest value | `MAX(salary)` | 102000 |

```sql
-- All in one query
SELECT
  COUNT(*) AS headcount,
  SUM(salary) AS total_payroll,
  ROUND(AVG(salary), 0) AS avg_salary,
  MIN(salary) AS min_salary,
  MAX(salary) AS max_salary
FROM employees;
```

> ⚠️ **WATCH OUT**: `COUNT(*)` counts all rows including NULLs. `COUNT(salary)` counts only rows where salary is not NULL. These can give different numbers. `AVG()` automatically ignores NULL values.

---

## 📊 COUNT DISTINCT

```sql
-- How many total rows have a department?
SELECT COUNT(department) FROM employees;   -- 6

-- How many UNIQUE departments are there?
SELECT COUNT(DISTINCT department) FROM employees;  -- 3

-- How many unique salary levels?
SELECT COUNT(DISTINCT salary) FROM employees;
```

---

## 📊 GROUP BY - Aggregating by Category

Without GROUP BY I get one summary number for the whole table. With GROUP BY I get one summary number for each group. This is where aggregate functions get really powerful.

```sql
-- Average salary for EACH department
SELECT
  department,
  ROUND(AVG(salary), 0) AS avg_salary,
  COUNT(*) AS headcount,
  SUM(salary) AS total_payroll
FROM employees
GROUP BY department;

-- Hire count by year
SELECT
  STRFTIME('%Y', hire_date) AS hire_year,
  COUNT(*) AS employees_hired
FROM employees
GROUP BY hire_year
ORDER BY hire_year;
```

> 🔑 **KEY CONCEPT**: The rule is that every column in SELECT that is NOT inside an aggregate function must appear in GROUP BY. Think of GROUP BY as creating buckets. Each unique value becomes one bucket and aggregate functions summarize each bucket.

```sql
-- WRONG: name is not in GROUP BY or an aggregate
-- SELECT name, department, AVG(salary) FROM employees GROUP BY department;

-- RIGHT
SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department;
```

---

## 📊 HAVING - Filtering Groups

WHERE filters individual rows before grouping. HAVING filters groups after aggregation. This tripped me up at first.

```sql
-- Only show departments with average salary above 80000
SELECT
  department,
  ROUND(AVG(salary), 0) AS avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 80000;

-- Only departments with more than 1 employee
SELECT department, COUNT(*) AS headcount
FROM employees
GROUP BY department
HAVING COUNT(*) > 1;

-- WHERE and HAVING together
SELECT department, AVG(salary) AS avg_salary
FROM employees
WHERE hire_date >= '2021-01-01'   -- filter rows first
GROUP BY department
HAVING AVG(salary) > 75000;      -- then filter groups
```

> 🔑 **KEY CONCEPT**: WHERE comes before GROUP BY and filters rows. HAVING comes after GROUP BY and filters aggregated groups. I cannot use a column alias from SELECT in HAVING. I have to use the full aggregate expression.

---

## 📊 Full SELECT Execution Order

This is really important to understand. The order I write clauses vs the order SQL actually executes them:

```
Write order:    SELECT  FROM  WHERE  GROUP BY  HAVING  ORDER BY  LIMIT
Execute order:  FROM  WHERE  GROUP BY  HAVING  SELECT  ORDER BY  LIMIT
```

> 💡 **TIP**: This is why I cannot use a SELECT alias inside WHERE or HAVING. SELECT runs after them so the alias does not exist yet at that point.

---

## ✏️ Practice Exercises

1. Count total number of employees
2. Find total payroll, average salary, min and max in one query
3. Show headcount and average salary per department
4. Show only departments where total payroll exceeds 200000
5. Show departments with more than 1 employee, sorted by headcount descending
6. Count how many employees were hired each year

---

## ✅ What I Learned Today

- ✔ How to use COUNT, SUM, AVG, MIN, MAX
- ✔ COUNT DISTINCT for counting unique values
- ✔ GROUP BY to aggregate by category (every non-aggregate column must be in GROUP BY)
- ✔ HAVING to filter aggregated groups (different from WHERE which filters rows)
- ✔ The full SELECT execution order: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT

---

## 🟡 LeetCode - Day 5

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/duplicate-emails/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#182: Duplicate Emails</div>
    <div class="text-xs text-gray-500">GROUP BY + HAVING COUNT > 1</div>
  </a>
  <a href="https://leetcode.com/problems/actors-and-directors-who-cooperated-at-least-three-times/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1050: Actors and Directors</div>
    <div class="text-xs text-gray-500">GROUP BY + HAVING</div>
  </a>
  <a href="https://leetcode.com/problems/game-play-analysis-i/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#511: Game Play Analysis I</div>
    <div class="text-xs text-gray-500">MIN with GROUP BY</div>
  </a>
</div>

</div>
</div>