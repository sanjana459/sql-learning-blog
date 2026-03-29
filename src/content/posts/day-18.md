---
title: "EXPLAIN and Query Optimization"
meta_title: "SQL Day 18 - EXPLAIN, Query Plans, Slow Query Fixes"
description: "Learning to diagnose slow queries and fix them. How to read EXPLAIN output, recognizing SCAN vs SEARCH USING INDEX, fixing the 5 most common query performance problems, and rewriting queries for better efficiency."
date: 2025-08-18
image: "/images/posts/day-18.jpg"
categories: ["advanced"]
tags: ["EXPLAIN", "query optimization", "performance", "indexes", "slow queries"]
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

## 🎯 Goal: Diagnose slow queries and fix them

---

## 🔬 How to Read EXPLAIN

EXPLAIN shows me the query execution plan: how the database intends to run my query. This is the main tool for diagnosing why a query is slow.

```sql
-- SQLite: EXPLAIN QUERY PLAN
EXPLAIN QUERY PLAN
SELECT * FROM employees WHERE department = 'Engineering';

-- Without index output:
-- SCAN TABLE employees

-- After adding index output:
-- SEARCH TABLE employees USING INDEX idx_dept (department=?)

-- PostgreSQL: EXPLAIN ANALYZE (runs the query and shows actual timing)
EXPLAIN ANALYZE
SELECT * FROM employees WHERE department = 'Engineering';
```

> 🔑 **KEY CONCEPT**:
> - **SCAN** = bad on large tables. It means reading every row (full table scan)
> - **SEARCH USING INDEX** = good. The database jumped to the right rows using an index
> - In PostgreSQL, look for: `Seq Scan` (bad) vs `Index Scan` (good)
> - `EXPLAIN` shows the plan. `EXPLAIN ANALYZE` actually runs the query and shows real timing

---

## 🔬 Problem 1 - No Index on WHERE Column

```sql
-- Slow: full table scan on 1M rows
SELECT * FROM orders WHERE customer_id = 12345;

-- Fix: add an index
CREATE INDEX idx_orders_customer ON orders(customer_id);
```

---

## 🔬 Problem 2 - SELECT * Fetching Unused Columns

```sql
-- Slow: fetches all 50 columns across 1M rows
SELECT * FROM orders WHERE order_date > '2024-01-01';

-- Faster: fetch only what I need
SELECT order_id, customer_id, total
FROM orders
WHERE order_date > '2024-01-01';
```

---

## 🔬 Problem 3 - Function on Indexed Column in WHERE

This one is sneaky. Wrapping an indexed column in a function prevents the index from being used.

```sql
-- Slow: the index on hire_date cannot be used because of the function
SELECT * FROM employees WHERE YEAR(hire_date) = 2022;

-- Faster: use a range condition instead
SELECT * FROM employees
WHERE hire_date >= '2022-01-01' AND hire_date < '2023-01-01';
```

---

## 🔬 Problem 4 - Implicit Type Conversion

```sql
-- Slow: employee_id is INTEGER but comparing to TEXT string breaks the index
SELECT * FROM employees WHERE employee_id = '3';  -- string '3'

-- Faster: match the actual data type
SELECT * FROM employees WHERE employee_id = 3;    -- integer 3
```

---

## 🔬 Problem 5 - Wildcard LIKE at the Start

```sql
-- Slow: leading wildcard prevents index use entirely
SELECT * FROM employees WHERE name LIKE '%Khan';

-- Faster: trailing wildcard CAN use the index
SELECT * FROM employees WHERE name LIKE 'Khan%';
```

---

## 🔬 JOIN Optimization

Make sure indexes exist on both sides of a JOIN for best performance.

```sql
SELECT c.name, COUNT(o.order_id) AS order_count
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.name;

-- customers.customer_id is PRIMARY KEY (auto-indexed)
-- orders.customer_id needs an index:
CREATE INDEX idx_orders_cust ON orders(customer_id);
```

---

## 🔬 Query Rewriting Tricks

```sql
-- Use EXISTS instead of IN for large subqueries (often faster)

-- Slower with large subquery using IN:
SELECT name FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders WHERE total > 1000);

-- Faster with EXISTS:
SELECT name FROM customers c
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.customer_id = c.customer_id AND o.total > 1000
);

-- Use LIMIT early to reduce rows processed downstream
SELECT * FROM (
  SELECT * FROM orders ORDER BY order_date DESC LIMIT 1000
) recent
WHERE total > 500;
```

---

## ✏️ Practice Exercises

1. Run EXPLAIN QUERY PLAN on a filter query before and after adding an index and compare the output
2. Rewrite a query using YEAR(hire_date) = 2022 to use a date range instead
3. Rewrite a subquery using IN as an equivalent query using EXISTS
4. Look back at Day 11 to 17 queries and identify which ones would benefit from indexes

---

## ✅ What I Learned Today

- ✔ How to use EXPLAIN / EXPLAIN QUERY PLAN to read execution plans
- ✔ SCAN = full table scan (bad), SEARCH USING INDEX = good
- ✔ The 5 most common query performance problems and how to fix them
- ✔ How to optimize JOINs by indexing both sides
- ✔ When to rewrite IN subqueries as EXISTS for large datasets

---

## 🟡 LeetCode - Day 18

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/fix-names-in-a-table/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1667: Fix Names in a Table</div>
    <div class="text-xs text-gray-500">Efficient string functions</div>
  </a>
  <a href="https://leetcode.com/problems/patients-with-a-condition/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1527: Patients With a Condition</div>
    <div class="text-xs text-gray-500">LIKE with correct wildcard placement</div>
  </a>
  <a href="https://leetcode.com/problems/employees-whose-manager-left-the-company/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1978: Employees Whose Manager Left</div>
    <div class="text-xs text-gray-500">LEFT JOIN + IS NULL pattern</div>
  </a>
</div>

</div>
</div>