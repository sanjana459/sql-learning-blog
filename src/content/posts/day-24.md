---
title: "Real DE Patterns - dbt-Style SQL and Incremental Loading"
meta_title: "SQL Day 24 - dbt SQL, Incremental Loading, SCD Type 2, Data Quality Checks"
description: "Learning to write SQL the way Data Engineers write it at work. dbt-style CTE-first models, incremental loading, SCD Type 2 for tracking historical changes, and SQL-based data quality checks."
date: 2025-08-24
image: "/images/posts/day-24.jpg"
categories: ["advanced"]
tags: ["dbt", "SCD Type 2", "incremental loading", "data quality", "pipelines", "CTE"]
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

## 🎯 Goal: Write SQL the way Data Engineers write it at work

---

## 🏭 How DE SQL Differs From LeetCode SQL

| LeetCode | Production DE SQL |
|---|---|
| One-off query | Runs on a schedule (daily, hourly) |
| Small tables | Millions or billions of rows |
| Result is correct once | Must be correct every run (idempotent) |
| No documentation needed | Fully documented with comments and lineage |
| Any style works | Consistent style, CTE-first, no SELECT * |

---

## 🏭 The CTE-First Pattern - How dbt Models Work

In dbt, every model is a SQL file. The convention is: all logic in CTEs, one final SELECT at the end. This makes every step testable and readable.

```sql
-- dbt-style model: daily_revenue.sql
-- This runs every day and produces one row per customer per day

WITH
-- Step 1: Source data
orders AS (
  SELECT * FROM staging.orders
),

-- Step 2: Filter to relevant date range
recent_orders AS (
  SELECT *
  FROM orders
  WHERE order_date >= DATEADD('day', -7, CURRENT_DATE)
),

-- Step 3: Aggregate
daily_totals AS (
  SELECT
    customer_id,
    order_date,
    COUNT(*) AS order_count,
    SUM(amount) AS total_revenue,
    AVG(amount) AS avg_order_value
  FROM recent_orders
  GROUP BY customer_id, order_date
),

-- Step 4: Enrich with customer info
final AS (
  SELECT
    dt.customer_id,
    c.name AS customer_name,
    dt.order_date,
    dt.order_count,
    dt.total_revenue,
    dt.avg_order_value
  FROM daily_totals dt
  LEFT JOIN customers c ON dt.customer_id = c.customer_id
)

SELECT * FROM final
```

> 💡 **TIP**: Every CTE has a comment explaining what it does. Each CTE does ONE thing: filter, aggregate, join, or enrich. The final SELECT is always just `SELECT * FROM final`. This makes it easy to debug: just run any individual CTE to see its output.

---

## 🏭 Incremental Loading

Incremental loading means: on each run, only process new or changed data, not the entire table. Critical for performance on large tables.

```sql
-- Full load: reprocesses everything every time
-- Fine for small tables, bad for 1B row tables
INSERT OVERWRITE INTO fact_orders
SELECT * FROM staging.orders;

-- Incremental load: only new records since last run
-- Step 1: Find the last processed timestamp
SELECT MAX(processed_at) FROM fact_orders;  -- e.g. '2024-03-26 23:59:59'

-- Step 2: Insert only records newer than that
INSERT INTO fact_orders
SELECT *
FROM staging.orders
WHERE created_at > (SELECT MAX(processed_at) FROM fact_orders);
```

---

## 🏭 SCD Type 2 - Tracking Historical Changes

SCD Type 2 is one of the most important patterns in Data Engineering. When a dimension attribute changes (customer moves cities, employee changes department), I keep the history by creating a new row instead of overwriting.

```sql
-- SCD Type 2 customer table structure
CREATE TABLE dim_customers (
  surrogate_key INTEGER PRIMARY KEY,  -- system-generated unique key
  customer_id   INTEGER,              -- natural/business key
  name          TEXT,
  city          TEXT,
  valid_from    DATE NOT NULL,
  valid_to      DATE,                 -- NULL means current/active record
  is_current    BOOLEAN DEFAULT TRUE
);

-- Original record
INSERT INTO dim_customers VALUES (1, 101, 'Alice Brown', 'New York', '2020-01-01', NULL, TRUE);

-- Alice moves to Chicago on 2024-03-01
-- Step 1: Close the old record
UPDATE dim_customers
SET valid_to = '2024-02-29', is_current = FALSE
WHERE customer_id = 101 AND is_current = TRUE;

-- Step 2: Insert new record
INSERT INTO dim_customers VALUES (2, 101, 'Alice Brown', 'Chicago', '2024-03-01', NULL, TRUE);

-- Query: find Alice's city at any point in time
SELECT city FROM dim_customers
WHERE customer_id = 101
AND '2022-06-15' BETWEEN valid_from AND COALESCE(valid_to, '9999-12-31');
-- Returns: New York (she was in NY on that date)
```

> 🎯 **INTERVIEW PATTERN**: SCD Type 2 is one of the top 5 most asked DE interview questions. Know what it is, why Type 1 (overwrite) loses history, and how valid_from/valid_to/is_current work. The query pattern `WHERE date BETWEEN valid_from AND COALESCE(valid_to, '9999-12-31')` is the standard way to find the record at a point in time. Also know: SCD Type 1 (overwrite), Type 2 (history rows), Type 3 (previous value column).

---

## 🏭 Data Quality Checks in SQL

Real DE pipelines include SQL-based data quality checks that run before data is promoted to production.

```sql
-- Check 1: No NULL primary keys
SELECT COUNT(*) AS null_pk_count
FROM orders WHERE order_id IS NULL;
-- Expected: 0. If > 0, fail the pipeline.

-- Check 2: No duplicate primary keys
SELECT order_id, COUNT(*) AS cnt
FROM orders GROUP BY order_id HAVING COUNT(*) > 1;
-- Expected: 0 rows returned.

-- Check 3: Foreign key integrity
SELECT COUNT(*) AS orphan_orders
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
WHERE c.customer_id IS NULL;
-- Expected: 0.

-- Check 4: Value range
SELECT COUNT(*) AS invalid_amounts
FROM orders WHERE amount <= 0 OR amount IS NULL;
-- Expected: 0.

-- Check 5: Freshness check
SELECT MAX(order_date) AS latest_order
FROM orders;
-- Expected: within 24 hours of current time.
```

---

## ✏️ Practice

1. Write a dbt-style CTE query that calculates weekly revenue per customer with enrichment
2. Write the SCD Type 2 update + insert for an employee who changes departments
3. Write all 5 data quality checks for the employees table
4. Write an incremental load query that only processes employees hired since the last run

---

## ✅ What I Learned Today

- ✔ How to write dbt-style CTE-first SQL models with one responsibility per CTE
- ✔ Incremental loading: only processing new/changed data for performance at scale
- ✔ SCD Type 2: maintaining historical records with valid_from, valid_to, is_current
- ✔ SQL-based data quality checks that run in pipelines before data goes to production

---

## 🟡 LeetCode - Day 24

Revisit any Medium problem I am not confident in. Focus on #1174 Immediate Food Delivery II and #1251 Average Selling Price. Both require weighted averages and JOINs, which are real DE calculation patterns.

</div>
</div>