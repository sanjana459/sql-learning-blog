---
title: "Advanced SQL Patterns - Pivot, Gaps, Islands, Deduplication"
meta_title: "SQL Day 19 - PIVOT, Unpivot, Gaps and Islands, Deduplication, STRING_AGG"
description: "Real-world analytical patterns used in Data Engineering. Pivoting rows to columns with CASE + GROUP BY, unpivoting with UNION ALL, gaps and islands for consecutive sequences, deduplication keeping the latest record, and string aggregation."
date: 2025-08-19
image: "/images/posts/day-19.jpg"
categories: ["advanced"]
tags: ["pivot", "deduplication", "gaps and islands", "STRING_AGG", "GROUP_CONCAT", "ROW_NUMBER"]
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

## 🎯 Goal: Real-world analytical patterns used in Data Engineering

---

## 🔄 Pivoting - Rows to Columns

Pivoting turns row values into column headers. SQL does not have a native PIVOT in all databases, but CASE + GROUP BY achieves the same thing.

```sql
-- Monthly sales data in long format
CREATE TABLE monthly_sales (dept TEXT, month TEXT, sales INTEGER);
INSERT INTO monthly_sales VALUES
  ('Engineering', 'Jan', 120000), ('Engineering', 'Feb', 135000), ('Engineering', 'Mar', 128000),
  ('Marketing', 'Jan', 45000),    ('Marketing', 'Feb', 52000),    ('Marketing', 'Mar', 48000),
  ('HR', 'Jan', 22000),           ('HR', 'Feb', 25000),           ('HR', 'Mar', 23000);

-- Pivot: turn months into columns
SELECT
  dept,
  SUM(CASE WHEN month = 'Jan' THEN sales ELSE 0 END) AS jan_sales,
  SUM(CASE WHEN month = 'Feb' THEN sales ELSE 0 END) AS feb_sales,
  SUM(CASE WHEN month = 'Mar' THEN sales ELSE 0 END) AS mar_sales
FROM monthly_sales
GROUP BY dept;
```

---

## 🔄 Unpivoting - Columns to Rows

The reverse: turning wide column-per-month data into long format. Use UNION ALL.

```sql
CREATE TABLE wide_sales (dept TEXT, jan_sales INT, feb_sales INT, mar_sales INT);
INSERT INTO wide_sales VALUES ('Engineering', 120000, 135000, 128000);
INSERT INTO wide_sales VALUES ('Marketing', 45000, 52000, 48000);

-- Unpivot: turn columns into rows
SELECT dept, 'Jan' AS month, jan_sales AS sales FROM wide_sales
UNION ALL
SELECT dept, 'Feb' AS month, feb_sales AS sales FROM wide_sales
UNION ALL
SELECT dept, 'Mar' AS month, mar_sales AS sales FROM wide_sales
ORDER BY dept, month;
```

---

## 🔄 Gaps and Islands

A gaps and islands problem finds consecutive sequences in data. For example, consecutive days of user activity, or consecutive employee IDs with no gaps.

```sql
-- Sample: user login dates
CREATE TABLE logins (user_id INT, login_date DATE);
INSERT INTO logins VALUES
  (1, '2024-01-01'), (1, '2024-01-02'), (1, '2024-01-03'),
  (1, '2024-01-07'), (1, '2024-01-08'),
  (1, '2024-01-15');

-- Find consecutive login streaks (islands)
WITH numbered AS (
  SELECT
    login_date,
    ROW_NUMBER() OVER (ORDER BY login_date) AS rn
  FROM logins WHERE user_id = 1
),
grouped AS (
  SELECT
    login_date,
    DATE(login_date, '-' || rn || ' days') AS group_key
  FROM numbered
)
SELECT
  group_key,
  MIN(login_date) AS streak_start,
  MAX(login_date) AS streak_end,
  COUNT(*) AS streak_length
FROM grouped
GROUP BY group_key
ORDER BY streak_start;
```

The idea is that if I subtract the row number from the date, consecutive dates will produce the same result and form a group. Gaps in the sequence will produce different results and form separate groups. Pretty clever pattern.

---

## 🔄 Deduplication - Keeping the Latest Record

In real pipelines, data arrives with duplicates all the time. This pattern keeps only the most recent record per entity. I need to memorize this one.

```sql
-- Table with duplicate employee records (from multiple pipeline runs)
CREATE TABLE employee_updates (
  employee_id INT, name TEXT, salary INT, updated_at TIMESTAMP
);
INSERT INTO employee_updates VALUES
  (1, 'Sarah Khan', 95000,  '2024-01-01 10:00:00'),
  (1, 'Sarah Khan', 98000,  '2024-02-01 10:00:00'),
  (1, 'Sarah Khan', 102000, '2024-03-01 10:00:00'),
  (2, 'James Obi',  72000,  '2024-01-15 10:00:00'),
  (2, 'James Obi',  75000,  '2024-02-15 10:00:00');

-- Keep only the most recent record per employee
WITH latest AS (
  SELECT *,
    ROW_NUMBER() OVER (
      PARTITION BY employee_id
      ORDER BY updated_at DESC
    ) AS rn
  FROM employee_updates
)
SELECT employee_id, name, salary, updated_at
FROM latest
WHERE rn = 1;
```

> 🔑 **KEY CONCEPT**: The deduplication pattern (ROW_NUMBER PARTITION BY id ORDER BY updated_at DESC, then WHERE rn = 1) is one of the most used patterns in real Data Engineering. It appears in dbt models, Spark transformations, and SQL pipelines constantly. Worth memorizing.

---

## 🔄 String Aggregation - Combining Rows Into One String

```sql
-- Combine all products ordered per customer into one row

-- SQLite: GROUP_CONCAT
SELECT
  customer_id,
  GROUP_CONCAT(product, ', ') AS all_products
FROM orders
GROUP BY customer_id;

-- PostgreSQL: STRING_AGG (can also specify order)
SELECT
  customer_id,
  STRING_AGG(product, ', ' ORDER BY order_date) AS all_products
FROM orders
GROUP BY customer_id;
```

---

## ✏️ Practice Exercises

1. Pivot the monthly_sales table to show each department as a row and each month as a column
2. Unpivot a wide-format salary table into long format using UNION ALL
3. Using the logins table, find the longest consecutive login streak
4. Deduplicate the employee_updates table keeping only the most recent record per employee
5. Show each customer and a comma-separated list of all products they ordered

---

## ✅ What I Learned Today

- ✔ Pivot data using CASE + GROUP BY (no native PIVOT needed in most databases)
- ✔ Unpivot data using UNION ALL to go from wide to long format
- ✔ Gaps and islands pattern using ROW_NUMBER and date arithmetic
- ✔ Deduplication pattern: ROW_NUMBER PARTITION BY id ORDER BY updated_at DESC, then WHERE rn = 1
- ✔ String aggregation with GROUP_CONCAT (SQLite) and STRING_AGG (PostgreSQL)

---

## 🟡 LeetCode - Day 19

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/consecutive-numbers/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#180: Consecutive Numbers</div>
    <div class="text-xs text-gray-500">Gaps and islands concept</div>
  </a>
  <a href="https://leetcode.com/problems/reformat-department-table/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1179: Reformat Department Table</div>
    <div class="text-xs text-gray-500">PIVOT with CASE + GROUP BY</div>
  </a>
  <a href="https://leetcode.com/problems/group-sold-products-by-the-date/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1484: Group Sold Products By The Date</div>
    <div class="text-xs text-gray-500">GROUP_CONCAT / STRING_AGG</div>
  </a>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center mt-4">
  <a href="https://leetcode.com/problems/human-traffic-of-stadium/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#601: Human Traffic of Stadium</div>
    <div class="text-xs text-gray-500">Advanced consecutive rows, stretch goal</div>
  </a>
</div>

</div>
</div>