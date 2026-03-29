---
title: "Window Functions - ROW_NUMBER, RANK, LAG, LEAD"
meta_title: "SQL Day 10 - Window Functions, OVER, PARTITION BY, ROW_NUMBER, RANK, LAG, LEAD"
description: "The most powerful SQL feature. How window functions differ from GROUP BY, ranking rows with ROW_NUMBER/RANK/DENSE_RANK, looking at adjacent rows with LAG and LEAD, and calculating running totals. Also covering the top N per group interview pattern."
date: 2025-08-10
image: "/images/posts/day-10.jpg"
categories: ["window-functions"]
tags: ["ROW_NUMBER", "RANK", "DENSE_RANK", "LAG", "LEAD", "OVER", "PARTITION BY", "window functions"]
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

## 🎯 Goal: Rank, compare, and analyze rows without collapsing my data

---

## 🪟 What Makes Window Functions Different?

This is probably the most mind-bending concept so far. Aggregate functions collapse multiple rows into one row. Window functions do calculations across a set of rows but KEEP every individual row in the result.

```sql
-- Regular AVG: collapses all rows into ONE row per department
SELECT department, AVG(salary) FROM employees GROUP BY department;
-- Returns 3 rows

-- Window function AVG: keeps ALL rows but adds dept average to each
SELECT name, department, salary,
  AVG(salary) OVER (PARTITION BY department) AS dept_avg_salary
FROM employees;
-- Returns 6 rows, one per employee, each showing their department's average
```

> 🔑 **KEY CONCEPT**: The `OVER()` clause is what makes a function a window function. `PARTITION BY` divides rows into groups like GROUP BY but without collapsing them. `ORDER BY` inside `OVER()` defines the order within the window. Window functions are among the most tested concepts in SQL interviews.

---

## 🪟 ROW_NUMBER, RANK, and DENSE_RANK

```sql
SELECT
  name,
  department,
  salary,
  ROW_NUMBER()  OVER (ORDER BY salary DESC) AS row_num,
  RANK()        OVER (ORDER BY salary DESC) AS rank_overall,
  DENSE_RANK()  OVER (ORDER BY salary DESC) AS dense_rank,
  ROW_NUMBER()  OVER (PARTITION BY department ORDER BY salary DESC) AS rank_in_dept
FROM employees;
```

| Function | How It Handles Ties | Example (100, 100, 90) |
|---|---|---|
| `ROW_NUMBER()` | Unique sequential numbers even for ties | 1, 2, 3 |
| `RANK()` | Ties get same rank, next rank skips | 1, 1, 3 |
| `DENSE_RANK()` | Ties get same rank, next rank does NOT skip | 1, 1, 2 |

I think of DENSE_RANK as the "no gaps" version of RANK.

---

## 🪟 LAG and LEAD - Looking at Adjacent Rows

LAG looks at the previous row. LEAD looks at the next row. Really useful for comparing a value to the one before or after it.

```sql
SELECT
  name,
  salary,
  LAG(salary)  OVER (ORDER BY salary) AS prev_salary,
  LEAD(salary) OVER (ORDER BY salary) AS next_salary,
  salary - LAG(salary) OVER (ORDER BY salary) AS diff_from_prev
FROM employees;

-- LAG and LEAD within each department
SELECT
  name,
  department,
  salary,
  LAG(salary) OVER (PARTITION BY department ORDER BY salary) AS lower_salary_in_dept
FROM employees;
```

---

## 🪟 Running Totals and Moving Averages

```sql
-- Running total of salary ordered by hire date
SELECT
  name,
  hire_date,
  salary,
  SUM(salary) OVER (ORDER BY hire_date) AS running_total_payroll
FROM employees;

-- Cumulative average salary
SELECT
  name,
  salary,
  ROUND(AVG(salary) OVER (ORDER BY salary
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW), 0) AS cumulative_avg
FROM employees;
```

---

## 🪟 Window Frame Reference

The ROWS BETWEEN clause defines exactly which rows are included in the window calculation:

| Frame Expression | Meaning |
|---|---|
| `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` | First row to current row (running total) |
| `ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING` | Current row plus one before and after (3-row moving average) |
| `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` | All rows in the partition |

---

## 🪟 Top N Per Group - A Must-Know Interview Pattern

This pattern comes up constantly. Get the top N employees per department:

```sql
-- Top 2 highest paid employees per department
SELECT name, department, salary, rank_in_dept
FROM (
  SELECT
    name,
    department,
    salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rank_in_dept
  FROM employees
) ranked
WHERE rank_in_dept <= 2;
```

> 💡 **TIP**: Window functions cannot be used directly in WHERE clauses. I have to wrap them in a subquery or CTE. This top N per group pattern using RANK or ROW_NUMBER inside a subquery is one of the top 5 most common SQL interview questions. Worth practicing until it feels natural.

---

## ✏️ Practice Exercises

1. Rank all employees by salary using ROW_NUMBER, RANK, and DENSE_RANK and see how the results differ
2. Show each employee's salary and their department's average salary side by side
3. Show each employee's salary and the salary of the person hired just before them using LAG
4. Calculate the running total payroll ordered by hire date
5. Find the highest paid employee in each department using RANK inside a subquery

---

## ✅ What I Learned Today

- ✔ Window functions keep all rows; GROUP BY collapses them. The OVER() clause is what makes the difference
- ✔ PARTITION BY groups rows without collapsing; ORDER BY inside OVER sets the order within the window
- ✔ ROW_NUMBER gives unique numbers; RANK skips after ties; DENSE_RANK does not skip
- ✔ LAG looks at the previous row; LEAD looks at the next row
- ✔ Running totals with SUM OVER (ORDER BY ...)
- ✔ Top N per group pattern: RANK inside a subquery, then filter by rank

---

## 🟡 LeetCode - Day 10

These are Medium level but very doable with today's knowledge.

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/rank-scores/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#178: Rank Scores</div>
    <div class="text-xs text-gray-500">DENSE_RANK window function</div>
  </a>
  <a href="https://leetcode.com/problems/consecutive-numbers/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#180: Consecutive Numbers</div>
    <div class="text-xs text-gray-500">LAG/LEAD or self join</div>
  </a>
  <a href="https://leetcode.com/problems/department-highest-salary/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#184: Department Highest Salary</div>
    <div class="text-xs text-gray-500">Top N per group pattern</div>
  </a>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center mt-4">
  <a href="https://leetcode.com/problems/department-top-three-salaries/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#185: Department Top Three Salaries</div>
    <div class="text-xs text-gray-500">Top N per group, harder version</div>
  </a>
</div>

</div>
</div>