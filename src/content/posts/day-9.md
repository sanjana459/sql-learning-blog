---
title: "UNION, INTERSECT, EXCEPT - Combining Query Results"
meta_title: "SQL Day 9 - UNION, UNION ALL, INTERSECT, EXCEPT"
description: "Learning to stack multiple query results together using set operators. The difference between UNION and UNION ALL, when to use INTERSECT and EXCEPT, and the rules for all set operations."
date: 2025-08-09
image: "/images/posts/day-9.jpg"
categories: ["fundamentals"]
tags: ["UNION", "UNION ALL", "INTERSECT", "EXCEPT", "set operations"]
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

## 🎯 Goal: Stack multiple query results together

---

## 🔀 Set Operations Overview

Sometimes I need to combine the results of two or more separate queries into one result. SQL has three set operators for this.

| Operator | Returns | Duplicates |
|---|---|---|
| `UNION` | All rows from both queries combined | Removes duplicates |
| `UNION ALL` | All rows from both queries combined | Keeps all duplicates |
| `INTERSECT` | Only rows that appear in BOTH queries | Removes duplicates |
| `EXCEPT` | Rows in first query but NOT in second | Removes duplicates |

> 🔑 **KEY CONCEPT**: Rules for all set operations: both queries must have the same number of columns. Corresponding columns must have compatible data types. The column names in the result come from the FIRST query. UNION ALL is faster than UNION because it skips the de-duplication step. Use it when I know there are no duplicates or when I actually want them.

---

## 🔀 UNION and UNION ALL

```sql
-- UNION: all Engineering and Marketing employees, no duplicates
SELECT name, department FROM employees WHERE department = 'Engineering'
UNION
SELECT name, department FROM employees WHERE department = 'Marketing';

-- UNION ALL: keeps duplicates (same person could appear twice)
SELECT name FROM employees WHERE salary > 90000
UNION ALL
SELECT name FROM employees WHERE department = 'Engineering';
```

---

## 🔀 INTERSECT

```sql
-- Employees who are BOTH in Engineering AND earn more than 90000
SELECT name FROM employees WHERE department = 'Engineering'
INTERSECT
SELECT name FROM employees WHERE salary > 90000;
```

---

## 🔀 EXCEPT

```sql
-- Engineering employees who do NOT earn more than 90000
SELECT name FROM employees WHERE department = 'Engineering'
EXCEPT
SELECT name FROM employees WHERE salary > 90000;
```

---

## 🔀 Real Use Case - Stacking Tables

This comes up all the time in Data Engineering when combining data from different source tables:

```sql
CREATE TABLE archived_employees (
  employee_id INTEGER,
  name TEXT,
  department TEXT,
  salary INTEGER
);
INSERT INTO archived_employees VALUES (10, 'Former Alice', 'Engineering', 80000);
INSERT INTO archived_employees VALUES (11, 'Former Bob', 'HR', 65000);

-- Full headcount report across both tables
SELECT name, department, salary, 'Current' AS status FROM employees
UNION ALL
SELECT name, department, salary, 'Archived' AS status FROM archived_employees
ORDER BY department, name;
```

---

## 🔀 ORDER BY With Set Operations

When using UNION, there can only be ONE ORDER BY and it goes at the very end:

```sql
-- CORRECT: ORDER BY goes at the end
SELECT name, salary FROM employees WHERE department = 'Engineering'
UNION
SELECT name, salary FROM employees WHERE department = 'Marketing'
ORDER BY salary DESC
LIMIT 5;

-- WRONG: cannot ORDER BY inside each SELECT in a UNION
-- SELECT name FROM employees ORDER BY name  <-- causes error
-- UNION
-- SELECT name FROM archived_employees ORDER BY name;
```

---

## ✏️ Practice Exercises

1. Use UNION to combine all Engineering and HR employees
2. Use INTERSECT to find employees who earn more than 70000 AND were hired after 2021
3. Use EXCEPT to find Engineering employees earning less than 95000
4. Combine current and archived employees with a status column, sorted by salary

---

## ✅ What I Learned Today

- ✔ UNION combines results and removes duplicates; UNION ALL keeps them and is faster
- ✔ INTERSECT returns only rows common to both queries
- ✔ EXCEPT returns rows in the first query but not the second
- ✔ Rules: same column count, compatible types, one ORDER BY at the very end

---

## 🟡 LeetCode - Day 9

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/employees-with-missing-information/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1965: Employees With Missing Information</div>
    <div class="text-xs text-gray-500">UNION approach</div>
  </a>
  <a href="https://leetcode.com/problems/rearrange-products-table/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1795: Rearrange Products Table</div>
    <div class="text-xs text-gray-500">UNION for data reshaping</div>
  </a>
</div>

</div>
</div>