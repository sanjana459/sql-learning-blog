---
title: "JSON in SQL, REGEXP, LATERAL JOIN, and GENERATE_SERIES"
meta_title: "SQL Day 34 - JSON Functions, REGEXP, LATERAL JOIN, GENERATE_SERIES"
description: "Modern SQL features every DE needs at work. Querying JSON with PostgreSQL operators and Snowflake VARIANT, complex pattern matching with REGEXP, LATERAL JOIN for per-row subqueries, and native date series generation with GENERATE_SERIES."
date: 2025-09-03
image: "/images/posts/day-34.jpg"
categories: ["advanced"]
tags: ["JSON", "JSONB", "REGEXP", "LATERAL JOIN", "GENERATE_SERIES", "Snowflake", "BigQuery"]
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

## 🎯 Goal: Modern SQL features every DE needs at work

---

## 🔧 JSON Functions in SQL

Modern databases store semi-structured JSON data alongside relational data. Knowing how to query it is essential.

### PostgreSQL JSON Functions

```sql
-- Sample table with JSONB column (binary JSON, indexed, faster than JSON)
CREATE TABLE events (
  event_id INTEGER,
  event_type TEXT,
  metadata JSONB
);
INSERT INTO events VALUES
  (1, 'purchase', '{"user_id": 42, "amount": 150.00, "tags": ["sale", "mobile"]}'),
  (2, 'signup', '{"user_id": 43, "source": "google", "tags": ["organic"]}');

-- Extract a field: -> returns JSON, ->> returns text
SELECT metadata->>'user_id' AS user_id FROM events;
SELECT metadata->'amount' AS amount_json FROM events;   -- returns JSON
SELECT metadata->>'amount' AS amount_text FROM events;  -- returns text

-- Nested access
SELECT metadata->'address'->>'city' AS city FROM events;

-- Check if key exists
SELECT * FROM events WHERE metadata ? 'source';

-- Filter by JSON value
SELECT * FROM events WHERE metadata->>'user_id' = '42';

-- Extract array element (0-indexed)
SELECT metadata->'tags'->>0 AS first_tag FROM events;

-- Expand JSON array into rows
SELECT event_id, jsonb_array_elements_text(metadata->'tags') AS tag
FROM events;
```

### Snowflake JSON / VARIANT

```sql
-- Snowflake stores JSON as VARIANT type
SELECT
  metadata:user_id::INTEGER AS user_id,
  metadata:amount::FLOAT AS amount,
  metadata:address:city::STRING AS city
FROM events;

-- FLATTEN to expand arrays
SELECT e.event_id, f.value::STRING AS tag
FROM events e,
LATERAL FLATTEN(input => e.metadata:tags) f;
```

### BigQuery JSON

```sql
SELECT
  JSON_VALUE(metadata, '$.user_id') AS user_id,
  JSON_VALUE(metadata, '$.address.city') AS city
FROM events;

-- Unnest JSON array
SELECT event_id, tag
FROM events,
UNNEST(JSON_QUERY_ARRAY(metadata, '$.tags')) AS tag;
```

---

## 🔧 REGEXP - Regular Expression Pattern Matching

REGEXP lets me match complex text patterns beyond what LIKE can do.

```sql
-- PostgreSQL: ~ operator for regex
SELECT name FROM employees WHERE name ~ '^S';       -- starts with S
SELECT name FROM employees WHERE name ~ 'an$';      -- ends with 'an'

-- Case-insensitive match: ~*
SELECT name FROM employees WHERE name ~* 'khan';

-- NOT MATCH: !~
SELECT name FROM employees WHERE name !~ '[0-9]';   -- names with no digits

-- Email validation
SELECT email FROM users
WHERE email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$';

-- MySQL / SQLite: REGEXP keyword
SELECT name FROM employees WHERE name REGEXP '^[A-Z]';

-- BigQuery: REGEXP_CONTAINS
SELECT name FROM employees WHERE REGEXP_CONTAINS(name, r'^S');

-- Snowflake: REGEXP_LIKE
SELECT name FROM employees WHERE REGEXP_LIKE(name, '^S.*');

-- Replace a pattern: REGEXP_REPLACE
SELECT REGEXP_REPLACE(phone, '[^0-9]', '') AS clean_phone FROM contacts;
-- Removes all non-digit characters from phone numbers
```

> 🔑 **KEY CONCEPT**: Common regex patterns to memorize:
> - `^` = start of string, `$` = end of string
> - `[a-z]` = any lowercase letter, `[0-9]` = any digit
> - `.` = any character, `*` = zero or more, `+` = one or more
> - `\s` = whitespace, `\w` = word character

---

## 🔧 LATERAL JOIN - Apply a Subquery Per Row

A LATERAL JOIN allows a subquery in FROM to reference columns from tables defined earlier in the same FROM clause. It is evaluated once per row of the outer query.

```sql
-- Find the 3 most recent orders per customer
SELECT c.customer_id, c.name, recent.order_date, recent.amount
FROM customers c
LEFT JOIN LATERAL (
  SELECT order_date, amount
  FROM orders o
  WHERE o.customer_id = c.customer_id  -- references outer table
  ORDER BY order_date DESC
  LIMIT 3
) recent ON TRUE;

-- LATERAL with a function (PostgreSQL)
SELECT e.name, words.word
FROM employees e,
LATERAL UNNEST(STRING_TO_ARRAY(e.name, ' ')) AS words(word);
-- Splits each name into individual words, one per row

-- SQL Server equivalent: CROSS APPLY
SELECT c.name, recent.order_date
FROM customers c
CROSS APPLY (
  SELECT TOP 3 order_date FROM orders o
  WHERE o.customer_id = c.customer_id
  ORDER BY order_date DESC
) recent;
```

---

## 🔧 GENERATE_SERIES - Native Date Generation

Instead of a recursive CTE to generate date series (Day 12), PostgreSQL and Snowflake have native functions.

```sql
-- PostgreSQL: GENERATE_SERIES
-- Generate numbers
SELECT generate_series(1, 10) AS n;

-- Generate dates for all of Q1 2024
SELECT generate_series(
  '2024-01-01'::DATE,
  '2024-03-31'::DATE,
  '1 day'::INTERVAL
) AS dt;

-- Left join to fill gaps in daily sales (much cleaner than recursive CTE)
WITH all_days AS (
  SELECT generate_series(
    '2024-01-01'::DATE,
    '2024-01-31'::DATE,
    '1 day'::INTERVAL
  )::DATE AS dt
)
SELECT
  d.dt AS order_date,
  COALESCE(SUM(o.amount), 0) AS daily_revenue
FROM all_days d
LEFT JOIN orders o ON o.order_date = d.dt
GROUP BY d.dt
ORDER BY d.dt;

-- Snowflake equivalent
SELECT DATEADD('day', seq4(), '2024-01-01'::DATE) AS dt
FROM TABLE(GENERATOR(ROWCOUNT => 31));

-- BigQuery equivalent
SELECT dt FROM UNNEST(
  GENERATE_DATE_ARRAY('2024-01-01', '2024-01-31', INTERVAL 1 DAY)
) AS dt;
```

---

## ✏️ Practice

1. Create a table with a JSONB metadata column, insert 3 rows, extract user_id and first tag
2. Write a REGEXP query to find all emails that do not match standard email format
3. Use REGEXP_REPLACE to clean a phone number column removing all non-digit characters
4. Use LATERAL JOIN to get the most recent 2 orders per customer
5. Use GENERATE_SERIES to produce every Monday in January 2024

---

## ✅ What I Learned Today

- ✔ Query JSON with `->>` operators (PostgreSQL), VARIANT colon notation (Snowflake), and JSON_VALUE (BigQuery)
- ✔ Expand JSON arrays into rows with jsonb_array_elements, FLATTEN, and UNNEST
- ✔ REGEXP for complex text pattern matching, extraction, and replacement
- ✔ LATERAL JOIN to apply a per-row subquery with LIMIT (and CROSS APPLY for SQL Server)
- ✔ GENERATE_SERIES as a native alternative to recursive date CTEs

---

## 🟡 LeetCode - Day 34

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/find-users-with-valid-e-mails/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1517: Find Users With Valid E-Mails</div>
    <div class="text-xs text-gray-500">REGEXP pattern</div>
  </a>
  <a href="https://leetcode.com/problems/patients-with-a-condition/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1527: Patients With a Condition</div>
    <div class="text-xs text-gray-500">LIKE with word boundary</div>
  </a>
  <a href="https://leetcode.com/problems/employees-with-missing-information/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1965: Employees With Missing Information</div>
    <div class="text-xs text-gray-500">UNION gap-fill pattern</div>
  </a>
</div>

</div>
</div>