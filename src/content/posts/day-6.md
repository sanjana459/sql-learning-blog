---
title: "Subqueries and Nested Queries"
meta_title: "SQL Day 6 - Subqueries, Derived Tables, EXISTS, NOT EXISTS"
description: "Learning to write queries inside queries. Scalar subqueries, subqueries with IN, derived tables in FROM, and using EXISTS and NOT EXISTS to check for related rows."
date: 2025-08-06
image: "/images/posts/day-6.jpg"
categories: ["subqueries"]
tags: ["subquery", "EXISTS", "IN", "derived table", "nested queries"]
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

## 🎯 Goal: Queries inside queries - a key intermediate skill

---

## 🔁 What Is a Subquery?

A subquery is a SELECT statement inside another SELECT statement. The inner query runs first, and its result is used by the outer query. I like thinking of it as: first answer this question, then use that answer to answer the bigger question.

```sql
-- Question: Who earns more than the average salary?

-- Step 1: What is the average salary?
SELECT AVG(salary) FROM employees;  -- let's say 83333

-- Step 2: Who earns more than 83333?
SELECT name, salary FROM employees WHERE salary > 83333;

-- Combined as a subquery (dynamic, recalculates automatically)
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
```

> 🔑 **KEY CONCEPT**: The subquery in parentheses runs first. Its result replaces the subquery in the outer query. Subqueries can return a single value (scalar), a list of values, or an entire table.

---

## 🔁 Subquery with IN

```sql
-- Which employees work in departments with average salary above 85000?
SELECT name, department
FROM employees
WHERE department IN (
  SELECT department
  FROM employees
  GROUP BY department
  HAVING AVG(salary) > 85000
);

-- Employees hired after the most recent Marketing hire
SELECT name, hire_date
FROM employees
WHERE hire_date > (
  SELECT MAX(hire_date)
  FROM employees
  WHERE department = 'Marketing'
);
```

---

## 🔁 Subquery in FROM - Derived Tables

I can use a subquery as a temporary table in the FROM clause:

```sql
SELECT
  dept_summary.department,
  dept_summary.avg_sal,
  dept_summary.headcount
FROM (
  SELECT
    department,
    ROUND(AVG(salary), 0) AS avg_sal,
    COUNT(*) AS headcount
  FROM employees
  GROUP BY department
) AS dept_summary
WHERE dept_summary.headcount >= 2
ORDER BY dept_summary.avg_sal DESC;
```

> 💡 **TIP**: A subquery in FROM must always have an alias (the `AS dept_summary` part). This is called a derived table or inline view. In Day 11 I will learn CTEs which do the exact same thing but are much easier to read. Looking forward to that.

---

## 🔁 EXISTS and NOT EXISTS

EXISTS checks whether a subquery returns any rows at all. It does not care about the actual data, just whether rows exist.

```sql
-- First setting up a projects table
CREATE TABLE projects (
  project_id INTEGER,
  employee_id INTEGER,
  project_name TEXT
);
INSERT INTO projects VALUES (1, 1, 'Pipeline Rebuild');
INSERT INTO projects VALUES (2, 3, 'Warehouse Migration');
INSERT INTO projects VALUES (3, 1, 'Dashboard Redesign');

-- Find employees who have at least one project
SELECT name
FROM employees e
WHERE EXISTS (
  SELECT 1 FROM projects p
  WHERE p.employee_id = e.employee_id
);

-- Find employees with NO projects
SELECT name
FROM employees e
WHERE NOT EXISTS (
  SELECT 1 FROM projects p
  WHERE p.employee_id = e.employee_id
);
```

The `SELECT 1` inside EXISTS is just a convention. EXISTS only cares if any rows are returned, not what columns they have.

---

## ✏️ Practice Exercises

1. Find employees earning more than the company average salary
2. Find the employee with the maximum salary using a subquery
3. Find all employees who work in the department with the most employees
4. Using a derived table, show the top department by average salary
5. Find employees who have no projects assigned using NOT EXISTS

---

## ✅ What I Learned Today

- ✔ Scalar subqueries return one value and go inside WHERE or SELECT
- ✔ Subqueries with IN return a list of values to filter against
- ✔ Subqueries in FROM create derived tables and must always have an alias
- ✔ EXISTS checks if any rows exist in a related subquery
- ✔ NOT EXISTS finds rows with no match in a related table

---

## 🟡 LeetCode - Day 6

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/customers-who-never-order/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#183: Customers Who Never Order</div>
    <div class="text-xs text-gray-500">NOT IN or NOT EXISTS</div>
  </a>
  <a href="https://leetcode.com/problems/second-highest-salary/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#176: Second Highest Salary</div>
    <div class="text-xs text-gray-500">Classic subquery problem</div>
  </a>
  <a href="https://leetcode.com/problems/rising-temperature/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#197: Rising Temperature</div>
    <div class="text-xs text-gray-500">Subquery comparing dates</div>
  </a>
</div>

</div>
</div>