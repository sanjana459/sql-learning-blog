---
title: "Indexes - Making Queries Fast"
meta_title: "SQL Day 17 - Indexes, B-Tree, CREATE INDEX, Covering Indexes"
description: "Understanding the most important performance tool in SQL. What indexes are, how B-Tree indexes work, when to add them and when not to, composite indexes, and covering indexes that eliminate table lookups entirely."
date: 2025-08-17
image: "/images/posts/day-17.jpg"
categories: ["advanced"]
tags: ["indexes", "performance", "B-Tree", "covering index", "CREATE INDEX"]
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

## 🎯 Goal: Understand the most important performance tool in SQL

---

## ⚡ What Is an Index?

An index is a separate data structure that the database maintains alongside a table to make lookups faster. I like the analogy: think of it like the index at the back of a book. Instead of reading every page to find a topic, I jump straight to the right page.

Without an index, every query that filters or sorts must scan every single row. This is called a **full table scan**. With an index on the right column, the database can jump directly to the matching rows.

> 🔑 **KEY CONCEPT**:
> - Indexes **speed up**: SELECT with WHERE, JOIN conditions, ORDER BY, GROUP BY
> - Indexes **slow down**: INSERT, UPDATE, DELETE because the index must be updated too
> - Every table should have a primary key index (created automatically)
> - Add indexes on columns frequently filtered or joined on, not on every column

---

## ⚡ Creating and Dropping Indexes

```sql
-- Create a basic index on one column
CREATE INDEX idx_employees_department
ON employees (department);

-- Create index on multiple columns (composite index)
CREATE INDEX idx_employees_dept_salary
ON employees (department, salary);

-- Create a unique index (also enforces uniqueness)
CREATE UNIQUE INDEX idx_employees_email
ON employees (email);

-- See indexes on a table (SQLite)
PRAGMA index_list('employees');

-- Drop an index
DROP INDEX idx_employees_department;
```

---

## ⚡ How Indexes Work - B-Tree

Most indexes use a B-Tree (balanced tree) structure. The database organizes indexed values in sorted order in a tree structure that allows lookups in O(log n) time instead of O(n) for a full scan.

| Scenario | Without Index | With Index on department |
|---|---|---|
| Table has 1,000,000 rows | Scan all 1M rows | Jump to ~33,000 Engineering rows directly |
| Query: WHERE department = 'Engineering' | Read every row | Use index to find matching rows |
| Time complexity | O(n) linear | O(log n) logarithmic |

---

## ⚡ When to Add an Index

```sql
-- 1. Columns used frequently in WHERE
SELECT * FROM orders WHERE customer_id = 123;
-- Add: CREATE INDEX idx_orders_customer ON orders(customer_id);

-- 2. Columns used in JOIN conditions
SELECT * FROM orders o JOIN customers c ON o.customer_id = c.customer_id;
-- Add: CREATE INDEX idx_orders_customer ON orders(customer_id);

-- 3. Columns used in ORDER BY on large tables
SELECT * FROM orders ORDER BY order_date DESC LIMIT 100;
-- Add: CREATE INDEX idx_orders_date ON orders(order_date);

-- 4. Composite index for multi-column filters
SELECT * FROM orders WHERE customer_id = 5 AND order_date > '2024-01-01';
-- Add: CREATE INDEX idx_orders_cust_date ON orders(customer_id, order_date);
```

---

## ⚡ When NOT to Add an Index

- **Small tables** (under ~10,000 rows): full scan is fast enough anyway
- **Columns with very few distinct values**: a boolean column only has 2 values. The index barely helps
- **Columns rarely used in WHERE or JOIN**: the index maintenance overhead is not worth it
- **Tables with very frequent INSERT/UPDATE/DELETE**: too many indexes slow writes significantly

---

## ⚡ Covering Indexes

A covering index includes all columns needed by a query. The database can answer the query using only the index without touching the actual table rows at all. This is a big performance win.

```sql
-- Query: get name and salary for all Engineering employees
SELECT name, salary FROM employees WHERE department = 'Engineering';

-- A covering index includes all 3 columns
CREATE INDEX idx_covering
ON employees (department, name, salary);

-- Now the database never needs to touch the main table
```

---

## ✏️ Practice Exercises

1. Create an index on customer_id in the orders table
2. Create a composite index on (department, salary) and write a query that uses both columns in WHERE
3. Run EXPLAIN QUERY PLAN before and after creating an index and compare the output (covered in Day 18)
4. List all indexes on the employees table
5. Think: which columns in the employees table would benefit most from an index?

---

## ✅ What I Learned Today

- ✔ Indexes are separate data structures that speed up lookups at the cost of slower writes
- ✔ B-Tree indexes allow O(log n) lookups instead of O(n) full table scans
- ✔ How to create single-column and composite indexes
- ✔ When to add indexes (high-selectivity WHERE and JOIN columns) and when not to (small tables, low-cardinality, write-heavy)
- ✔ Covering indexes include all query columns so the table itself never needs to be read

---

## 🟡 LeetCode - Day 17

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/reformat-department-table/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1179: Reformat Department Table</div>
    <div class="text-xs text-gray-500">PIVOT pattern with CASE + GROUP BY</div>
  </a>
  <a href="https://leetcode.com/problems/monthly-transactions-i/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1193: Monthly Transactions I</div>
    <div class="text-xs text-gray-500">GROUP BY with date functions</div>
  </a>
  <a href="https://leetcode.com/problems/last-person-to-fit-in-the-bus/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1204: Last Person to Fit in the Bus</div>
    <div class="text-xs text-gray-500">Running sum with window function</div>
  </a>
</div>

</div>
</div>