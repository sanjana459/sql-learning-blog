---
title: "WHERE - Filtering Your Data"
meta_title: "SQL Day 3 - WHERE, AND, OR, IN, BETWEEN, LIKE, NULL"
description: "Learning to retrieve exactly the rows I want using WHERE. Comparison operators, AND/OR/NOT, IN, BETWEEN, LIKE pattern matching, and NULL handling."
date: 2025-08-03
image: "/images/posts/day-3.jpg"
categories: ["fundamentals"]
tags: ["WHERE", "filtering", "NULL", "LIKE", "IN", "BETWEEN"]
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

## 🎯 Goal: Learn to retrieve exactly the rows I want

---

## 🔍 Why Filtering Matters

A real database has millions of rows. I almost never want all of them. WHERE lets me filter to only the rows I care about:

```sql
SELECT column1, column2
FROM table_name
WHERE condition;
```

---

## 🔍 Comparison Operators

| Operator | Meaning | Example |
|---|---|---|
| `=` | Equals | `WHERE salary = 95000` |
| `!=` or `<>` | Not equals | `WHERE department != 'HR'` |
| `>` | Greater than | `WHERE salary > 80000` |
| `<` | Less than | `WHERE salary < 80000` |
| `>=` | Greater than or equal | `WHERE salary >= 95000` |
| `<=` | Less than or equal | `WHERE salary <= 75000` |

```sql
-- All Engineering employees
SELECT * FROM employees WHERE department = 'Engineering';

-- Everyone earning more than 80000
SELECT name, salary FROM employees WHERE salary > 80000;

-- Everyone NOT in Marketing
SELECT * FROM employees WHERE department != 'Marketing';
```

> ⚠️ **WATCH OUT**: Text values must be wrapped in single quotes: `WHERE department = 'Engineering'`. Numbers do NOT use quotes: `WHERE salary > 80000`. SQL is case-sensitive for data values in most databases.

---

## 🔍 AND, OR, NOT

```sql
-- Engineering employees earning more than 90000
SELECT name, salary
FROM employees
WHERE department = 'Engineering' AND salary > 90000;

-- Engineering OR Marketing employees
SELECT name, department
FROM employees
WHERE department = 'Engineering' OR department = 'Marketing';

-- Use parentheses to control logic
-- This means: (Engineering OR Marketing) AND salary > 80000
SELECT name, department, salary
FROM employees
WHERE (department = 'Engineering' OR department = 'Marketing')
AND salary > 80000;
```

> 🔑 **KEY CONCEPT**: AND requires BOTH conditions to be true. OR requires AT LEAST ONE condition to be true. NOT inverts the condition. Operator priority: NOT evaluates first, then AND, then OR. Always use parentheses to be explicit.

---

## 🔍 IN - Matching a List of Values

Instead of chaining multiple OR conditions, IN is much cleaner:

```sql
-- Clunky way (avoid this)
WHERE department = 'Engineering' OR department = 'Marketing' OR department = 'HR'

-- Clean way with IN
SELECT name, department
FROM employees
WHERE department IN ('Engineering', 'Marketing', 'HR');

-- NOT IN
SELECT name, department
FROM employees
WHERE department NOT IN ('HR', 'Marketing');
```

---

## 🔍 BETWEEN - Filtering a Range

```sql
-- Salaries between 70000 and 95000 (inclusive, includes both endpoints)
SELECT name, salary
FROM employees
WHERE salary BETWEEN 70000 AND 95000;

-- Same as writing this
WHERE salary >= 70000 AND salary <= 95000

-- Works on dates too
SELECT name, hire_date
FROM employees
WHERE hire_date BETWEEN '2020-01-01' AND '2021-12-31';
```

---

## 🔍 LIKE - Pattern Matching

LIKE lets me match patterns in text. Two special characters:
- `%` matches any sequence of characters (including none)
- `_` matches exactly one character

```sql
-- Names starting with 'S'
SELECT name FROM employees WHERE name LIKE 'S%';

-- Names ending with 'n'
SELECT name FROM employees WHERE name LIKE '%n';

-- Names containing 'ai' anywhere
SELECT name FROM employees WHERE name LIKE '%ai%';

-- Second character is 'r'
SELECT name FROM employees WHERE name LIKE '_r%';
```

---

## 🔍 IS NULL / IS NOT NULL

NULL means missing or unknown data. It is NOT zero. It is NOT an empty string. It means the value does not exist.

```sql
-- Add an employee with a missing salary
INSERT INTO employees VALUES (7, 'Alex Doe', 'Finance', NULL, '2023-01-01');

-- Find employees with no salary recorded
SELECT name FROM employees WHERE salary IS NULL;

-- Find employees who DO have a salary
SELECT name, salary FROM employees WHERE salary IS NOT NULL;
```

> ⚠️ **WATCH OUT**: I can NEVER use `= NULL` to check for null values. It will always return nothing. `NULL = NULL` is actually false in SQL. Always use `IS NULL` or `IS NOT NULL`.

---

## ✏️ Practice Exercises

1. Find all employees in the Engineering department
2. Find all employees earning more than 80000
3. Find all employees in Engineering earning more than 90000
4. Find all employees in Engineering or HR
5. Find employees hired between 2021-01-01 and 2022-12-31
6. Find employees whose name contains the letter 'a'
7. Add a NULL salary employee and then find all employees with NULL salary

---

## ✅ What I Learned Today

- ✔ How to filter rows using WHERE with comparison operators
- ✔ How to combine conditions with AND, OR, NOT
- ✔ How to use IN for matching lists of values
- ✔ How to use BETWEEN for ranges
- ✔ How to use LIKE for pattern matching with % and _
- ✔ How to handle NULL values correctly with IS NULL and IS NOT NULL

---

## 🟡 LeetCode - Day 3

These are all solvable now with what I learned today.

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/big-countries/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#595: Big Countries</div>
    <div class="text-xs text-gray-500">WHERE with OR</div>
  </a>
  <a href="https://leetcode.com/problems/recyclable-and-low-fat-products/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1757: Recyclable and Low Fat Products</div>
    <div class="text-xs text-gray-500">WHERE with AND</div>
  </a>
  <a href="https://leetcode.com/problems/find-customer-referee/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#584: Find Customer Referee</div>
    <div class="text-xs text-gray-500">IS NULL handling</div>
  </a>
</div>

</div>
</div>