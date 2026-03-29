---
title: "VIEWs, Materialized Views, and Temporary Tables"
meta_title: "SQL Day 31 - CREATE VIEW, Materialized View, Temp Tables, Column Security"
description: "Learning VIEWs and Materialized Views which were missing from the main series. What a VIEW is, when to use one, Materialized Views for fast repeated queries, Temporary Tables for intermediate pipeline steps, and VIEW-based column security."
date: 2025-08-31
image: "/images/posts/day-31.jpg"
categories: ["advanced"]
tags: ["VIEW", "materialized view", "temporary table", "security", "dbt"]
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

## 🎯 Goal: Fill the gap - VIEWs and Materialized Views were never covered in Days 1-30

---

## 👁️ What Is a VIEW?

A VIEW is a saved SELECT query that behaves like a table. I query it exactly like a regular table but it does not store data — it runs the underlying query every time I select from it.

```sql
-- Create a view
CREATE VIEW engineering_employees AS
SELECT name, salary, hire_date
FROM employees
WHERE department = 'Engineering';

-- Query the view exactly like a table
SELECT * FROM engineering_employees;
SELECT * FROM engineering_employees WHERE salary > 90000;

-- Views can JOIN other tables
CREATE VIEW employee_order_summary AS
SELECT e.name, e.department,
  COUNT(o.id) AS order_count,
  COALESCE(SUM(o.amount), 0) AS total_value
FROM employees e
LEFT JOIN orders o ON e.id = o.emp_id
GROUP BY e.id, e.name, e.department;

-- Now analysts can just do:
SELECT * FROM employee_order_summary WHERE total_value > 1000;

-- Update a view
CREATE OR REPLACE VIEW engineering_employees AS
SELECT name, salary, hire_date, manager_id
FROM employees
WHERE department = 'Engineering';

-- Drop a view
DROP VIEW engineering_employees;
```

> 🔑 **KEY CONCEPT**: A VIEW is just a stored query, not stored data. Every SELECT from a view re-runs the underlying query. Views are used to: simplify complex queries for analysts, enforce security (hide columns), provide a stable interface when the underlying table structure changes. I cannot INSERT or UPDATE through most views unless they meet specific simplicity requirements (single table, no aggregation, no DISTINCT).

---

## 👁️ When to Use Views

| Use Case | Example | Why VIEW Helps |
|---|---|---|
| Simplify complex queries | Analysts need dept stats daily | Hide the GROUP BY logic behind a simple view |
| Column security | Hide salary from some users | Create view without salary column |
| Stable interface | Underlying table restructured | View abstracts the change, queries still work |
| Reusable logic | Same join pattern used in 10 places | Define once in view, reference everywhere |

---

## 👁️ Materialized Views - Stored Snapshots

A Materialized View (MV) is like a regular view but it actually stores the result as a physical table. Queries are fast because they read stored data. The trade-off: the data can become stale and needs refreshing.

```sql
-- PostgreSQL Materialized View
CREATE MATERIALIZED VIEW dept_salary_summary AS
SELECT
  department,
  COUNT(*) AS headcount,
  AVG(salary) AS avg_salary,
  SUM(salary) AS total_payroll
FROM employees
GROUP BY department;

-- Query it (fast, reads stored snapshot)
SELECT * FROM dept_salary_summary ORDER BY avg_salary DESC;

-- Refresh the materialized view (update the snapshot)
REFRESH MATERIALIZED VIEW dept_salary_summary;

-- Refresh without locking reads (PostgreSQL 9.4+)
REFRESH MATERIALIZED VIEW CONCURRENTLY dept_salary_summary;

-- Snowflake: Dynamic Tables (similar concept, auto-refreshes)
CREATE DYNAMIC TABLE dept_summary
  TARGET_LAG = '1 hour'
  WAREHOUSE = compute_wh
AS
SELECT department, AVG(salary) AS avg_salary
FROM employees GROUP BY department;
```

| Type | Data Storage | Query Speed | Freshness | Best For |
|---|---|---|---|---|
| Regular VIEW | None, runs live | Slow on complex queries | Always current | Simple abstractions |
| Materialized VIEW | Stores result physically | Fast, reads snapshot | Stale until refreshed | Expensive aggregations queried often |
| Temp TABLE | Stored for session only | Fast | Manual | Intermediate pipeline steps |

---

## 👁️ Temporary Tables

A temporary table exists only for the duration of a session (or transaction). It is stored physically but disappears when I disconnect. Useful for storing intermediate results in complex pipelines.

```sql
-- Create a temp table (SQLite / PostgreSQL)
CREATE TEMPORARY TABLE temp_high_earners AS
SELECT name, department, salary
FROM employees
WHERE salary > 90000;

-- Use it like any regular table
SELECT t.name, t.salary, o.order_count
FROM temp_high_earners t
LEFT JOIN (
  SELECT emp_id, COUNT(*) AS order_count FROM orders GROUP BY emp_id
) o ON t.id = o.emp_id;

-- I can even add indexes to a temp table (impossible with CTE)
CREATE INDEX idx_temp_dept ON temp_high_earners(department);

-- Drop explicitly (or it disappears on disconnect)
DROP TABLE IF EXISTS temp_high_earners;
```

---

## 👁️ VIEW Security - Column-Level Access Control

```sql
-- Create a view that hides the salary column
CREATE VIEW employees_public AS
SELECT employee_id, name, department, hire_date
FROM employees;
-- Analysts can query employees_public but never see salaries

-- Row-level security through views
CREATE VIEW my_dept_employees AS
SELECT * FROM employees
WHERE department = CURRENT_USER();
-- Each user only sees their own department's rows
```

---

## ✏️ Practice

1. Create a view called `high_value_customers` showing customers with total order value > 1000
2. Create a materialized view of monthly revenue by department, then refresh it
3. Create a temp table of employees hired in the last year, add an index on department, then use it in a join
4. Create a view that hides the salary column from the employees table

---

## ✅ What I Learned Today

- ✔ How to create and query regular VIEWs
- ✔ When views are useful: simplification, security, stable interface
- ✔ Materialized Views for storing expensive aggregation results and refreshing on a schedule
- ✔ Temporary Tables for intermediate pipeline steps within a session
- ✔ When to choose CTE vs temp table vs materialized view

---

## 🟡 LeetCode - Day 31

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/immediate-food-delivery-i/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1173: Immediate Food Delivery I</div>
    <div class="text-xs text-gray-500">Simple aggregation, write as CTE then as a view</div>
  </a>
  <a href="https://leetcode.com/problems/students-and-examinations/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1280: Students and Examinations</div>
    <div class="text-xs text-gray-500">CROSS JOIN pattern</div>
  </a>
</div>

</div>
</div>