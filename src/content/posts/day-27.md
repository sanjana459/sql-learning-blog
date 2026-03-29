---
title: "SQL for Data Engineers - Pipeline Patterns and Production SQL"
meta_title: "SQL Day 27 - Idempotent Pipelines, MERGE, Partition Pruning, Production SQL Style"
description: "The SQL I will write every day on the job. Idempotent pipeline patterns, the full MERGE statement, partition pruning for performance, and how to write readable production-quality SQL with proper formatting and comments."
date: 2025-08-27
image: "/images/posts/day-27.jpg"
categories: ["advanced"]
tags: ["pipelines", "MERGE", "idempotent", "partition pruning", "production SQL", "dbt"]
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

## 🎯 Goal: The SQL I write every day on the job

---

## 🔄 Writing Idempotent Pipelines

Idempotent means: running the same query twice produces the same result. This is essential for pipelines that might be re-run after failures.

```sql
-- NOT idempotent: running twice doubles the data
INSERT INTO fact_orders SELECT * FROM staging.orders;

-- Idempotent approach 1: TRUNCATE then INSERT
TRUNCATE TABLE fact_orders;
INSERT INTO fact_orders SELECT * FROM staging.orders;

-- Idempotent approach 2: DELETE by date then INSERT
DELETE FROM fact_orders WHERE order_date = '2024-03-27';
INSERT INTO fact_orders
SELECT * FROM staging.orders WHERE order_date = '2024-03-27';

-- Idempotent approach 3: MERGE (the cleanest)
MERGE INTO fact_orders AS target
USING staging.orders AS source
ON target.order_id = source.order_id
WHEN MATCHED THEN UPDATE SET
  target.amount = source.amount,
  target.status = source.status
WHEN NOT MATCHED THEN INSERT
  (order_id, customer_id, amount, status, order_date)
VALUES (source.order_id, source.customer_id, source.amount,
        source.status, source.order_date);
```

---

## 🔄 MERGE Statement - The Full UPSERT

MERGE handles insert, update, and delete in one statement. Available in Snowflake, BigQuery, SQL Server, and PostgreSQL 15+.

```sql
MERGE INTO target_table AS t
USING source_table AS s
ON t.id = s.id

-- Row exists in both: update it
WHEN MATCHED AND s.updated_at > t.updated_at THEN UPDATE SET
  t.name = s.name,
  t.amount = s.amount,
  t.updated_at = s.updated_at

-- Row only in source: insert it
WHEN NOT MATCHED BY TARGET THEN INSERT
  (id, name, amount, updated_at)
VALUES (s.id, s.name, s.amount, s.updated_at)

-- Row only in target (deleted from source): delete it
WHEN NOT MATCHED BY SOURCE THEN DELETE;
```

---

## 🔄 Partition Pruning for Performance

If a table is partitioned by date, filtering on the partition column is much faster than not.

```sql
-- Always filter on the partition column first

-- Fast: uses partition pruning
SELECT * FROM events WHERE event_date = '2024-03-27';

-- Slow: scans ALL partitions
SELECT * FROM events WHERE user_id = 12345;

-- Better: add the partition column even if not strictly needed for the logic
SELECT * FROM events
WHERE user_id = 12345
AND event_date >= '2024-01-01';  -- partition pruning reduces scan

-- In BigQuery: use _PARTITIONDATE or the partition column in WHERE
-- In Snowflake: use CLUSTER BY columns in WHERE for micro-partition pruning
```

---

## 🔄 Writing Readable Production SQL

Production SQL is read 10x more often than it is written. Style matters a lot.

```sql
-- BAD: one line, no comments, inconsistent style
select e.name,d.name,sum(o.amount) from employees e join departments d on e.dept_id=d.id join orders o on e.id=o.emp_id where e.hire_date>'2020-01-01' group by e.name,d.name having sum(o.amount)>1000

-- GOOD: formatted, commented, CTE-first
/*
  Purpose: Active employees with significant orders
  Author: Sanjana
  Updated: 2024-03-27
*/
WITH
-- Employees hired after 2020
recent_employees AS (
  SELECT id, name, dept_id
  FROM employees
  WHERE hire_date > '2020-01-01'
),

-- Order totals per employee
employee_orders AS (
  SELECT emp_id, SUM(amount) AS total_orders
  FROM orders
  GROUP BY emp_id
  HAVING SUM(amount) > 1000
)

SELECT
  e.name          AS employee_name,
  d.name          AS department_name,
  eo.total_orders AS total_order_amount
FROM recent_employees e
JOIN departments d    ON e.dept_id = d.id
JOIN employee_orders eo ON e.id = eo.emp_id
ORDER BY eo.total_orders DESC;
```

> 💡 **TIP**: Align column aliases vertically, it makes code scannable. One CTE = one responsibility, never put two unrelated things in one CTE. Comment the WHY not the WHAT. 'Filter to active employees' is obvious. 'Filter to employees hired after 2020 per business rule BRD-145' is useful. Always use explicit JOIN type (INNER JOIN, LEFT JOIN) in production.

---

## ✏️ Practice

1. Rewrite a complex query from earlier in dbt-style with full comments
2. Write a MERGE statement that upserts employee records from a staging table
3. Write an idempotent daily pipeline that loads one day of orders at a time
4. Take any unformatted SQL and reformat it with proper alignment and CTEs

---

## ✅ What I Learned Today

- ✔ How to write idempotent pipelines using TRUNCATE+INSERT, DELETE+INSERT, or MERGE
- ✔ MERGE for full upsert logic with matched and unmatched handling
- ✔ Partition pruning: always filter on the partition column to avoid scanning unnecessary data
- ✔ Production SQL style: CTE-first, aligned, commented, explicit JOIN types

---

## 🟡 LeetCode - Day 27

Final Medium push. Solve any remaining Medium problems from Day 22's list. Target: 50+ total problems solved. If at 50+, attempt #262 Trips and Users.

</div>
</div>