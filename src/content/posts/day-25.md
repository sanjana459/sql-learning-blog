---
title: "Snowflake and BigQuery Dialect Differences"
meta_title: "SQL Day 25 - Snowflake, BigQuery, QUALIFY, DATE_TRUNC, ARRAY_AGG, Dialects"
description: "Mastering the SQL variations I will actually use at work. Key syntax differences between SQLite, PostgreSQL, Snowflake, and BigQuery. QUALIFY for inline window filtering, DATE_TRUNC, DATEADD, FLATTEN, and ARRAY_AGG."
date: 2025-08-25
image: "/images/posts/day-25.jpg"
categories: ["advanced"]
tags: ["Snowflake", "BigQuery", "QUALIFY", "DATE_TRUNC", "ARRAY_AGG", "dialects"]
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

## 🎯 Goal: Master the SQL variations I will actually use at work

---

## 🗺️ Why Dialect Differences Matter

Standard SQL is a specification. Every database implements it slightly differently. As a Data Engineer I will work primarily in Snowflake, BigQuery, Redshift, or PostgreSQL. Knowing the key differences saves hours of debugging.

| Feature | SQLite (practice) | PostgreSQL | MySQL | Snowflake | BigQuery |
|---|---|---|---|---|---|
| String concat | `\|\|` | `\|\|` or `CONCAT()` | `CONCAT()` | `\|\|` or `CONCAT()` | `\|\|` or `CONCAT()` |
| Date today | `DATE('now')` | `CURRENT_DATE` | `CURDATE()` | `CURRENT_DATE()` | `CURRENT_DATE()` |
| Date truncate | `STRFTIME` | `DATE_TRUNC()` | `DATE_FORMAT()` | `DATE_TRUNC()` | `DATE_TRUNC()` |
| String length | `LENGTH()` | `LENGTH()` / `CHAR_LENGTH()` | `CHAR_LENGTH()` | `LENGTH()` | `LENGTH()` |
| Regex match | `GLOB` / `LIKE` | `~` or `SIMILAR TO` | `REGEXP` | `REGEXP` / `RLIKE` | `REGEXP_CONTAINS()` |

---

## 🗺️ Snowflake - QUALIFY

QUALIFY is Snowflake's (and BigQuery's) way to filter window function results without a subquery or CTE. It is the window function equivalent of HAVING.

```sql
-- Without QUALIFY: needs a subquery (standard SQL)
SELECT * FROM (
  SELECT name, dept, salary,
    RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk
  FROM employees
) WHERE rnk = 1;

-- With QUALIFY: much cleaner (Snowflake / BigQuery only)
SELECT name, dept, salary
FROM employees
QUALIFY RANK() OVER (PARTITION BY dept ORDER BY salary DESC) = 1;

-- QUALIFY for deduplication (this is how I would do it in Snowflake)
SELECT *
FROM employee_updates
QUALIFY ROW_NUMBER() OVER (PARTITION BY employee_id ORDER BY updated_at DESC) = 1;
```

> 🎯 **INTERVIEW PATTERN**: QUALIFY appears in Snowflake and BigQuery interviews frequently. If an interviewer asks "how would you deduplicate this table in Snowflake?" — `QUALIFY ROW_NUMBER()` is the answer. It eliminates the need for a subquery just to filter a window function result.

---

## 🗺️ Snowflake Date Functions

```sql
-- Truncate to month (first day of month)
SELECT DATE_TRUNC('month', order_date) AS month_start FROM orders;

-- Truncate to week
SELECT DATE_TRUNC('week', order_date) AS week_start FROM orders;

-- Extract parts
SELECT
  EXTRACT(year FROM order_date) AS yr,
  EXTRACT(month FROM order_date) AS mo,
  EXTRACT(dow FROM order_date) AS day_of_week  -- 0=Sunday
FROM orders;

-- Date difference in days
SELECT DATEDIFF('day', hire_date, CURRENT_DATE()) AS days_employed
FROM employees;

-- Add days to a date
SELECT DATEADD('day', 30, order_date) AS due_date FROM orders;
```

---

## 🗺️ Snowflake FLATTEN for Arrays

```sql
-- FLATTEN unpacks array elements into rows
-- If tags = ['urgent', 'bulk', 'international']
-- This returns 3 rows, one per tag

SELECT
  order_id,
  f.value::STRING AS tag
FROM orders,
LATERAL FLATTEN(input => tags) f;
```

---

## 🗺️ BigQuery - ARRAY_AGG

```sql
-- Collect all products ordered per customer into an array
SELECT
  customer_id,
  ARRAY_AGG(product ORDER BY order_date) AS products_ordered
FROM orders
GROUP BY customer_id;

-- Unnest an array back into rows
SELECT customer_id, product
FROM orders_summary,
UNNEST(products_ordered) AS product;
```

---

## 🗺️ BigQuery Date Functions

```sql
SELECT
  DATE_TRUNC(order_date, MONTH) AS month,
  DATE_DIFF(CURRENT_DATE(), order_date, DAY) AS days_since_order,
  DATE_ADD(order_date, INTERVAL 30 DAY) AS due_date,
  FORMAT_DATE('%Y-%m', order_date) AS year_month
FROM orders;
```

---

## 🗺️ Universal Patterns That Work Everywhere

```sql
-- Date truncation to month (works even without DATE_TRUNC)
SELECT SUBSTR(order_date, 1, 7) AS year_month FROM orders;  -- '2024-03'

-- Current date (works in PostgreSQL, Snowflake, BigQuery)
SELECT CURRENT_DATE;

-- String aggregation:
-- SQLite:              GROUP_CONCAT(x, ', ')
-- PostgreSQL/Snowflake/Redshift: STRING_AGG(x, ', ')
-- BigQuery:            STRING_AGG(x, ', ')
-- MySQL:               GROUP_CONCAT(x SEPARATOR ', ')
```

---

## ✏️ Practice

1. Rewrite the deduplication query from Day 19 using QUALIFY (Snowflake style)
2. Write a query using DATE_TRUNC to show monthly revenue totals
3. Write a query using DATEADD to find orders due within 30 days
4. Convert a GROUP_CONCAT query to STRING_AGG syntax for PostgreSQL/Snowflake

---

## ✅ What I Learned Today

- ✔ Key syntax differences between SQLite, PostgreSQL, Snowflake, and BigQuery
- ✔ QUALIFY for inline window function filtering in Snowflake and BigQuery
- ✔ DATE_TRUNC, DATEADD, DATEDIFF across different databases
- ✔ FLATTEN/LATERAL for array data in Snowflake
- ✔ ARRAY_AGG and UNNEST for BigQuery

---

## 🟡 LeetCode - Day 25

Focus on date-based problems today: #1693 Daily Leads and Partners, #1741 Find Total Time Spent by Each Employee, #1107 New Users Daily Count. Running total target: 40+ problems solved.

</div>
</div>