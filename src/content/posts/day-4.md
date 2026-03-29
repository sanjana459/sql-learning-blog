---
title: "String Functions, Date Functions, and CASE"
meta_title: "SQL Day 4 - UPPER, LOWER, SUBSTR, Date Functions, CASE WHEN"
description: "Learning to manipulate and transform data inside queries. String functions, numeric functions, date functions, and writing conditional logic with CASE WHEN."
date: 2025-08-04
image: "/images/posts/day-4.jpg"
categories: ["fundamentals"]
tags: ["CASE", "string functions", "date functions", "ROUND", "UPPER", "LOWER"]
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

## 🎯 Goal: Manipulate and transform data inside my queries

---

## 🔧 String Functions

SQL has built-in functions to work with text data. These vary slightly between databases but the core ones are universal.

| Function | What It Does | Example | Result |
|---|---|---|---|
| `UPPER(text)` | Convert to uppercase | `UPPER('hello')` | HELLO |
| `LOWER(text)` | Convert to lowercase | `LOWER('HELLO')` | hello |
| `LENGTH(text)` | Count characters | `LENGTH('Sarah')` | 5 |
| `TRIM(text)` | Remove leading/trailing spaces | `TRIM(' hi ')` | hi |
| `SUBSTR(text, start, length)` | Extract part of a string | `SUBSTR('Engineering', 1, 3)` | Eng |
| `REPLACE(text, old, new)` | Replace text | `REPLACE('hello world', 'world', 'SQL')` | hello SQL |
| `\|\|` | Join strings together | `'Hello' \|\| ' ' \|\| 'World'` | Hello World |

```sql
-- Show names in uppercase
SELECT UPPER(name) AS name_upper FROM employees;

-- Show first 3 characters of department
SELECT name, SUBSTR(department, 1, 3) AS dept_code FROM employees;

-- Combine name and department into one column
SELECT name || ' - ' || department AS full_label FROM employees;

-- Case-insensitive search
SELECT name FROM employees WHERE LOWER(name) LIKE '%khan%';
```

---

## 🔧 Numeric Functions

```sql
-- Round monthly salary to 2 decimal places
SELECT name, ROUND(salary / 12.0, 2) AS monthly_salary FROM employees;

-- Absolute value
SELECT ABS(-500);  -- returns 500

-- Cast an integer to decimal for accurate division
SELECT CAST(salary AS REAL) / 12 AS monthly FROM employees;
```

---

## 🔧 Date Functions

Dates come up in basically every real dataset. Every transaction and event has a timestamp so this is important.

```sql
-- Get today's date (SQLite)
SELECT DATE('now');

-- Get current datetime
SELECT DATETIME('now');

-- Extract year from a date
SELECT name, hire_date, STRFTIME('%Y', hire_date) AS hire_year
FROM employees;

-- Extract month
SELECT STRFTIME('%m', hire_date) AS hire_month FROM employees;

-- Days since hire
SELECT name, JULIANDAY('now') - JULIANDAY(hire_date) AS days_employed
FROM employees;
```

> 💡 **TIP**: Date functions differ between databases. STRFTIME is SQLite. PostgreSQL uses `EXTRACT(YEAR FROM hire_date)`. MySQL uses `YEAR(hire_date)`. In real DE work on Snowflake or BigQuery, I will use `DATE_TRUNC`, `EXTRACT`, and `DATEDIFF`. Same concept, different syntax.

---

## 🔧 CASE - The SQL If-Else

CASE is how I write conditional logic in SQL. Think of it as an if/else statement. I can use it anywhere in a query.

```sql
-- Label employees by salary band
SELECT
  name,
  salary,
  CASE
    WHEN salary >= 100000 THEN 'Senior'
    WHEN salary >= 80000  THEN 'Mid-Level'
    WHEN salary >= 60000  THEN 'Junior'
    ELSE 'Entry Level'
  END AS seniority_label
FROM employees;
```

```sql
-- Use CASE in ORDER BY to create a custom sort order
SELECT name, department
FROM employees
ORDER BY
  CASE department
    WHEN 'Engineering' THEN 1
    WHEN 'Marketing'   THEN 2
    WHEN 'HR'          THEN 3
    ELSE 4
  END;
```

> 🔑 **KEY CONCEPT**: CASE is evaluated top to bottom. The first matching WHEN wins. ELSE is optional. If no WHEN matches and there is no ELSE, the result is NULL. I can use CASE in SELECT, WHERE, ORDER BY, and GROUP BY.

---

## ✏️ Practice Exercises

1. Show all employees with their names in uppercase
2. Show name, department, and the first 3 letters of department as `dept_code`
3. Show name, salary, and monthly salary rounded to 2 decimal places
4. Create a column called `salary_tier`: 'High' if > 90000, 'Medium' if 70000 to 90000, 'Low' otherwise
5. Sort employees with Engineering first, then Marketing, then everything else

---

## ✅ What I Learned Today

- ✔ String functions: UPPER, LOWER, LENGTH, SUBSTR, REPLACE, concatenation with `||`
- ✔ Numeric functions: ROUND, ABS, CAST
- ✔ Date functions with STRFTIME for SQLite (syntax varies by database)
- ✔ How to write conditional logic with CASE WHEN THEN ELSE END

---

## 🟡 LeetCode - Day 4

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/fix-names-in-a-table/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1667: Fix Names in a Table</div>
    <div class="text-xs text-gray-500">UPPER + LOWER + string functions</div>
  </a>
  <a href="https://leetcode.com/problems/group-sold-products-by-the-date/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1484: Group Sold Products By The Date</div>
    <div class="text-xs text-gray-500">String functions</div>
  </a>
</div>

</div>
</div>