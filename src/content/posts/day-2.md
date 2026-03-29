---
title: "SELECT - Reading Data From Tables"
meta_title: "SQL Day 2 - SELECT, Aliases, DISTINCT, ORDER BY, LIMIT"
description: "Getting comfortable with SELECT. Learning how to pick columns, rename them, do math, remove duplicates with DISTINCT, sort results, and limit how many rows come back."
date: 2025-08-02
image: "/images/posts/day-2.jpg"
categories: ["fundamentals"]
tags: ["SELECT", "ORDER BY", "DISTINCT", "LIMIT", "aliases"]
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

## 🎯 Goal: Master the SELECT statement inside and out

---

## 📋 The SELECT Statement

SELECT is how I read data from a database. The basic structure is:

```sql
SELECT column1, column2
FROM table_name;
```

The semicolon tells SQL the statement is done. Always include it as good practice.

---

## 📋 Selecting All Columns vs Specific Columns

```sql
-- Get every column (* means everything)
SELECT * FROM employees;

-- Get only specific columns
SELECT name, department FROM employees;

-- Three specific columns
SELECT name, department, salary FROM employees;
```

> 💡 **TIP**: In real Data Engineering work, never use `SELECT *` in production queries. Always name the columns I need. It is fine for exploring data but slow on large tables because it fetches every column whether I need it or not.

---

## 📋 Column Aliases

Sometimes column names are ugly or confusing. I can rename them in the output using `AS`:

```sql
SELECT
  name AS employee_name,
  salary AS annual_salary,
  department AS dept
FROM employees;
```

This does not change the actual column name in the database. It just changes what appears in the result.

---

## 📋 Doing Math in SELECT

I can do calculations directly inside SELECT:

```sql
SELECT
  name,
  salary,
  salary / 12 AS monthly_salary,
  salary * 1.10 AS salary_after_10pct_raise
FROM employees;
```

> 🔑 **KEY CONCEPT**: SQL arithmetic operators are `+`, `-`, `*`, `/`, `%`. Division of two integers in some databases returns an integer. So `7 / 2 = 3`, not `3.5`. Use `7.0 / 2` to get `3.5`.

---

## 📋 DISTINCT - Removing Duplicates

If I want to see unique values only:

```sql
-- All unique departments
SELECT DISTINCT department FROM employees;

-- Unique combinations of two columns
SELECT DISTINCT department, salary FROM employees;
```

---

## 📋 LIMIT - Controlling How Many Rows Come Back

On a table with millions of rows, I never want to fetch everything. LIMIT restricts how many rows come back:

```sql
-- Only the first 3 rows
SELECT * FROM employees LIMIT 3;

-- Rows 4, 5, 6 (skip first 3, then take 3)
SELECT * FROM employees LIMIT 3 OFFSET 3;
```

> ⚠️ **WATCH OUT**: Always use LIMIT when exploring an unknown table. `SELECT * FROM some_huge_table` could return 50 million rows and crash the session. SQL Server uses `TOP` instead of LIMIT, so `SELECT TOP 5 * FROM employees`. Worth knowing.

---

## 📋 ORDER BY - Sorting Results

```sql
-- Sort by salary, highest first
SELECT name, salary
FROM employees
ORDER BY salary DESC;

-- Sort alphabetically A to Z
SELECT name, salary
FROM employees
ORDER BY name ASC;

-- Sort by department first, then by salary within each department
SELECT name, department, salary
FROM employees
ORDER BY department ASC, salary DESC;
```

> 🔑 **KEY CONCEPT**: `ASC` = ascending (smallest to largest, A to Z). This is the default if I do not specify. `DESC` = descending (largest to smallest, Z to A). I can ORDER BY a column that is not even in my SELECT list.

---

## 📋 The Full SELECT Clause Order

All clauses must be written in this exact sequence:

```sql
SELECT DISTINCT column1, column2, expression AS alias
FROM table_name
ORDER BY column1 ASC, column2 DESC
LIMIT n
OFFSET m;
```

---

## ✏️ Practice Exercises

Using the employees table from Day 1:

1. Select only the name and salary columns
2. Show name and salary, label salary as `annual_pay`
3. Show all employees sorted by salary from highest to lowest
4. Show only the top 3 highest paid employees
5. Show all unique departments
6. Show name, salary, and a new column called `daily_pay` (salary divided by 365)

---

## ✅ What I Learned Today

- ✔ How to select specific columns by name
- ✔ How to rename columns in output using AS
- ✔ How to do math inside SELECT
- ✔ How to use DISTINCT to remove duplicates
- ✔ How to use LIMIT and OFFSET to control rows returned
- ✔ How to sort results with ORDER BY using ASC and DESC

---

## 🟡 LeetCode - Day 2

Trying these out today. The WHERE ones I cannot fully solve yet since I cover that tomorrow, but reading them is useful.

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/big-countries/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#595: Big Countries</div>
    <div class="text-xs text-gray-500">SELECT with a simple condition</div>
  </a>
  <a href="https://leetcode.com/problems/recyclable-and-low-fat-products/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1757: Recyclable and Low Fat Products</div>
    <div class="text-xs text-gray-500">Basic SELECT</div>
  </a>
</div>

</div>
</div>