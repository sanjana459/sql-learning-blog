---
title: "Writing Data - INSERT, UPDATE, DELETE, UPSERT"
meta_title: "SQL Day 15 - INSERT, UPDATE, DELETE, UPSERT, Transactions"
description: "Learning how data gets into and changes inside databases. Single and multi-row INSERT, safe UPDATE with WHERE, DELETE vs TRUNCATE vs DROP, UPSERT for pipeline idempotency, and wrapping changes in transactions."
date: 2025-08-15
image: "/images/posts/day-15.jpg"
categories: ["fundamentals"]
tags: ["INSERT", "UPDATE", "DELETE", "UPSERT", "transactions"]
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

## 🎯 Goal: Learn how data gets into and changes inside databases

---

## ✍️ INSERT - Adding New Rows

```sql
-- Insert a single row (always specify column names, it is best practice)
INSERT INTO employees (employee_id, name, department, salary, hire_date)
VALUES (8, 'Nina Patel', 'Engineering', 91000, '2024-01-15');

-- Insert without column list (must match ALL columns in exact order)
INSERT INTO employees
VALUES (9, 'Raj Kumar', 'Marketing', 69000, '2024-02-20');

-- Insert multiple rows at once (much faster than one at a time)
INSERT INTO employees (employee_id, name, department, salary, hire_date)
VALUES
  (10, 'Sofia Chen', 'HR', 71000, '2024-03-01'),
  (11, 'Amir Hassan', 'Engineering', 98000, '2024-03-15'),
  (12, 'Emma Walsh', 'Marketing', 77000, '2024-04-01');

-- Insert the result of a SELECT into a table
INSERT INTO archived_employees (employee_id, name, department, salary)
SELECT employee_id, name, department, salary
FROM employees
WHERE hire_date < '2021-01-01';
```

> 💡 **TIP**: Always specify column names in INSERT. Without them, any column added to the table later will break the query. `INSERT INTO ... SELECT ...` is extremely useful in Data Engineering for moving data between tables in pipelines.

---

## ✍️ UPDATE - Changing Existing Data

```sql
-- Give Sarah Khan a 10% raise
UPDATE employees
SET salary = salary * 1.10
WHERE name = 'Sarah Khan';

-- Update multiple columns at once
UPDATE employees
SET
  salary = 105000,
  department = 'Senior Engineering'
WHERE employee_id = 3;

-- Update all rows in a group
UPDATE employees
SET salary = salary * 1.05
WHERE department = 'Marketing';

-- Update based on a subquery
UPDATE employees
SET salary = salary * 1.08
WHERE salary < (SELECT AVG(salary) FROM employees);
```

> ⚠️ **WATCH OUT**: ALWAYS include a WHERE clause in UPDATE. Without it, I update EVERY row in the table. Best practice: before running an UPDATE, run the equivalent SELECT first to verify which rows will be affected.
>
> Run first: `SELECT * FROM employees WHERE department = 'Marketing';`
> Then update: `UPDATE employees SET salary = salary * 1.05 WHERE department = 'Marketing';`

---

## ✍️ DELETE - Removing Rows

```sql
-- Delete a specific employee
DELETE FROM employees WHERE employee_id = 12;

-- Delete all employees in a department
DELETE FROM employees WHERE department = 'HR';

-- Delete based on a subquery
DELETE FROM employees
WHERE salary < (SELECT AVG(salary) FROM employees);

-- Delete ALL rows but keep the table structure
DELETE FROM employees;

-- TRUNCATE: faster way to delete all rows (cannot be rolled back in most databases)
TRUNCATE TABLE employees;
```

| Operation | Removes | Can Be Rolled Back | Speed |
|---|---|---|---|
| DELETE (no WHERE) | All rows, one at a time | Yes (in transactions) | Slow on large tables |
| TRUNCATE | All rows instantly | No (usually) | Very fast |
| DROP TABLE | Entire table including structure | No | Instant |

---

## ✍️ UPSERT - Insert or Update

UPSERT means: if the row already exists, update it. If it does not exist, insert it. This is critical in Data Engineering pipelines that run repeatedly.

```sql
-- SQLite: INSERT OR REPLACE
INSERT OR REPLACE INTO employees
  (employee_id, name, department, salary, hire_date)
VALUES (3, 'Priya Nair', 'Engineering', 110000, '2019-11-20');
-- If employee_id 3 exists, replaces the whole row
-- If it does not exist, inserts a new row

-- PostgreSQL: ON CONFLICT DO UPDATE (more precise, only updates specific columns)
INSERT INTO employees (employee_id, name, department, salary, hire_date)
VALUES (3, 'Priya Nair', 'Engineering', 110000, '2019-11-20')
ON CONFLICT (employee_id)
DO UPDATE SET
  salary = EXCLUDED.salary,
  department = EXCLUDED.department;
-- Only updates salary and department, preserves other columns
```

> 🔑 **KEY CONCEPT**: UPSERT is one of the most important patterns in Data Engineering. When I run a pipeline daily, I do not know if a record already exists. UPSERT handles both cases safely. `EXCLUDED` in PostgreSQL refers to the values I tried to insert (the rejected row).

---

## ✍️ Transactions - All or Nothing

Wrapping multiple statements in a transaction means either ALL of them succeed, or NONE of them do.

```sql
BEGIN;

UPDATE employees SET salary = salary * 1.10 WHERE department = 'Engineering';

INSERT INTO salary_history (employee_id, old_salary, change_date)
SELECT employee_id, salary / 1.10, DATE('now') FROM employees
WHERE department = 'Engineering';

COMMIT;   -- Save both changes permanently

-- or if something went wrong:
ROLLBACK; -- Undo both changes
```

---

## ✏️ Practice Exercises

1. Insert 3 new employees using multi-row INSERT
2. Give all Engineering employees a 12% raise using UPDATE
3. Verify which rows will be affected BEFORE running the update (SELECT first)
4. Delete all employees hired before 2020
5. Use UPSERT to insert or update employee_id 3 with a new salary

---

## ✅ What I Learned Today

- ✔ INSERT single rows, multiple rows, and query results (INSERT INTO ... SELECT)
- ✔ UPDATE specific rows safely with WHERE, always SELECT first to verify
- ✔ DELETE rows and the difference between DELETE, TRUNCATE, and DROP
- ✔ UPSERT for idempotent pipeline inserts where the record may or may not exist
- ✔ Transactions to wrap related changes so they succeed or fail together

---

## 🟡 LeetCode - Day 15

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/delete-duplicate-emails/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#196: Delete Duplicate Emails</div>
    <div class="text-xs text-gray-500">DELETE with subquery</div>
  </a>
  <a href="https://leetcode.com/problems/rising-temperature/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#197: Rising Temperature</div>
    <div class="text-xs text-gray-500">Good review of self-join and subquery</div>
  </a>
</div>

</div>
</div>