---
title: "Stored Procedures, Triggers, Named Windows, and Deadlocks"
meta_title: "SQL Day 35 - Stored Procedures, Triggers, Named Windows, Deadlocks, EXPLAIN ANALYZE"
description: "The final gaps closed. Stored procedures and UDFs, AFTER triggers for audit logging, named window definitions to avoid repeating OVER() clauses, deadlock prevention, deep reading of EXPLAIN ANALYZE output, and final Hard LeetCode problems."
date: 2025-09-04
image: "/images/posts/day-35.jpg"
categories: ["advanced"]
tags: ["stored procedures", "triggers", "named windows", "deadlocks", "EXPLAIN ANALYZE", "UDF"]
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

## 🎯 Goal: Last gaps closed - truly complete after today

---

## 🔧 Stored Procedures and User-Defined Functions

Stored procedures are reusable SQL programs stored in the database. UDFs are similar but return a value and can be used inline in queries.

```sql
-- PostgreSQL stored procedure
CREATE OR REPLACE PROCEDURE give_raises(dept_name TEXT, pct NUMERIC)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE employees
  SET salary = salary * (1 + pct / 100)
  WHERE department = dept_name;
  RAISE NOTICE 'Raise applied to % department', dept_name;
END;
$$;

-- Call the procedure
CALL give_raises('Engineering', 10.0);

-- User-defined function (returns a value, usable in SELECT)
CREATE OR REPLACE FUNCTION monthly_salary(annual_salary NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
  RETURN ROUND(annual_salary / 12, 2);
END;
$$ LANGUAGE plpgsql;

-- Use in a query
SELECT name, monthly_salary(salary) AS monthly FROM employees;

-- Snowflake UDF (SQL syntax)
CREATE OR REPLACE FUNCTION monthly_salary(annual_salary FLOAT)
RETURNS FLOAT
LANGUAGE SQL
AS $$
  ROUND(annual_salary / 12, 2)
$$;

-- BigQuery temporary UDF
CREATE TEMP FUNCTION monthly_salary(annual_salary FLOAT64)
RETURNS FLOAT64 AS (
  ROUND(annual_salary / 12, 2)
);
```

> 💡 **TIP**: In modern DE work with dbt and cloud warehouses, stored procedures are less common than they used to be. dbt models replaced much of what stored procedures used to do. UDFs are still very common in Snowflake and BigQuery for encapsulating reusable transformation logic.

---

## 🔧 Triggers

A trigger is a stored procedure that automatically executes in response to an event on a table (INSERT, UPDATE, or DELETE).

```sql
-- PostgreSQL trigger: log every salary change

-- First create the audit log table
CREATE TABLE salary_audit (
  audit_id   SERIAL PRIMARY KEY,
  emp_id     INTEGER,
  old_salary NUMERIC,
  new_salary NUMERIC,
  changed_at TIMESTAMP DEFAULT NOW(),
  changed_by TEXT DEFAULT CURRENT_USER
);

-- Create the trigger function
CREATE OR REPLACE FUNCTION log_salary_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.salary != NEW.salary THEN
    INSERT INTO salary_audit (emp_id, old_salary, new_salary)
    VALUES (OLD.id, OLD.salary, NEW.salary);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach the trigger to the employees table
CREATE TRIGGER salary_change_trigger
AFTER UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION log_salary_change();

-- Now every salary change is automatically logged
UPDATE employees SET salary = 105000 WHERE id = 3;
SELECT * FROM salary_audit;  -- shows the change
```

| Trigger Timing | When It Fires |
|---|---|
| BEFORE INSERT/UPDATE/DELETE | Before the operation — can modify the data being inserted/updated |
| AFTER INSERT/UPDATE/DELETE | After the operation — best for audit logging and cascading actions |
| INSTEAD OF (views) | Replaces the operation — used to make views updatable |

---

## 🔧 Named Window Definitions

If I use the same OVER() clause multiple times, I can define a named window once and reference it.

```sql
-- Without named windows: repetitive and error-prone
SELECT name, dept, salary,
  RANK()        OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk,
  DENSE_RANK()  OVER (PARTITION BY dept ORDER BY salary DESC) AS dense_rnk,
  ROW_NUMBER()  OVER (PARTITION BY dept ORDER BY salary DESC) AS row_num,
  AVG(salary)   OVER (PARTITION BY dept ORDER BY salary DESC) AS dept_avg
FROM employees;

-- With named window: define once, reuse everywhere
SELECT name, dept, salary,
  RANK()       OVER dept_window AS rnk,
  DENSE_RANK() OVER dept_window AS dense_rnk,
  ROW_NUMBER() OVER dept_window AS row_num,
  AVG(salary)  OVER dept_window AS dept_avg
FROM employees
WINDOW dept_window AS (PARTITION BY dept ORDER BY salary DESC);

-- Multiple named windows
SELECT name, dept, salary,
  RANK()     OVER dept_rank_window AS dept_rank,
  SUM(salary) OVER dept_sum_window AS dept_total
FROM employees
WINDOW
  dept_rank_window AS (PARTITION BY dept ORDER BY salary DESC),
  dept_sum_window  AS (PARTITION BY dept);
```

---

## 🔧 Deadlocks and Lock Contention

A deadlock occurs when two transactions each hold a lock the other needs and both are waiting. The database detects this and kills one transaction.

```sql
-- Deadlock scenario:
-- Transaction A:                         Transaction B:
-- UPDATE accounts SET bal=bal-100 WHERE id=1;
--                                        UPDATE accounts SET bal=bal-50 WHERE id=2;
-- UPDATE accounts SET bal=bal+100 WHERE id=2; -- WAITS for B
--                                        UPDATE accounts SET bal=bal+50 WHERE id=1; -- WAITS for A
-- DEADLOCK: database kills one transaction

-- Prevention strategy 1: always lock rows in the same order
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;  -- always lower id first
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- Prevention strategy 2: SELECT FOR UPDATE to pre-lock rows
BEGIN;
SELECT * FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;
-- Both rows are now locked by this transaction
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;
```

> ⚠️ **WATCH OUT**: The main deadlock prevention: always access resources in the same order across all transactions. Lock contention (many transactions waiting for the same lock) is different from deadlock — it causes slowness, not failure. `SELECT FOR UPDATE` locks rows for the transaction duration — use sparingly and keep transactions short.

---

## 🔧 EXPLAIN ANALYZE Deep Dive

Day 18 covered basic EXPLAIN. Here is how to read the full output in PostgreSQL.

| Output Element | What It Means | What to Look For |
|---|---|---|
| `cost=X..Y` | Estimated startup..total cost | High cost = potential optimization needed |
| `rows=N` | Estimated rows returned | Large gap vs actual rows = stale statistics (run ANALYZE) |
| `actual time=X..Y ms` | Real timing (ANALYZE only) | Slow nodes are bottlenecks |
| Seq Scan | Full table scan | Bad on large tables without index |
| Index Scan | Uses an index | Good, much faster than Seq Scan |
| Hash Join | Builds hash table from smaller table | Good for large joins |
| Nested Loop | For each outer row, loops through inner | Good for small tables or index lookups |
| Bitmap Heap Scan | Uses index bitmap then fetches rows | Good, used when many rows match index |

---

## 🔴 Final Hard LeetCode Problems

| # | Problem | Patterns Combined | Key Insight |
|---|---|---|---|
| 185 | Department Top Three Salaries | CTE + DENSE_RANK + JOIN | DENSE_RANK per dept, filter rnk <= 3 |
| 262 | Trips and Users | Multiple JOINs + conditional SUM | Filter banned users before aggregating |
| 601 | Human Traffic of Stadium | Gaps and islands + id - ROW_NUMBER trick | Mark consecutive groups, filter count >= 3 |
| 1767 | Find Subtasks That Did Not Execute | Recursive CTE + LEFT JOIN | Generate all expected subtasks, find missing |

> 🎯 **INTERVIEW PATTERN**: For Hard problems in interviews, explain the approach out loud before writing any code. Structure: "First I would... then I would... the key insight is...". Most Hard problems are Medium problems with one extra step. Find that step. If I can solve #185, #262, and #601 confidently — I am prepared for any DE SQL interview.

---

## ✏️ Practice

1. Create a stored procedure that promotes all employees earning below the department average to the department average
2. Create a trigger that prevents salary from being decreased
3. Rewrite a window function query from Day 14 using a named window definition
4. Solve LeetCode #601 Human Traffic of Stadium without looking at notes

---

## ✅ What I Learned Today - Full Journey Complete

- ✔ Stored procedures and UDFs in PostgreSQL, Snowflake, and BigQuery
- ✔ AFTER triggers for audit logging
- ✔ Named window definitions to avoid repeating OVER() clauses
- ✔ Deadlock prevention: always access resources in the same order
- ✔ Reading EXPLAIN ANALYZE output: Seq Scan vs Index Scan, cost estimates, actual timing

Combined with Days 1-34, I now have complete coverage of everything that appears in Data Engineer SQL interviews and real production work. There is nothing left to learn — only speed and confidence that comes from practice.

---

## 🟡 LeetCode - Day 35

**Final target: 60+ problems solved across Easy, Medium, and Hard.**

Must-solve Hard: #185, #262, #601, #1767. Stretch: #569, #571, #618.

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/department-top-three-salaries/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#185: Department Top Three Salaries</div>
    <div class="text-xs text-gray-500">Must solve</div>
  </a>
  <a href="https://leetcode.com/problems/trips-and-users/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#262: Trips and Users</div>
    <div class="text-xs text-gray-500">Must solve</div>
  </a>
  <a href="https://leetcode.com/problems/human-traffic-of-stadium/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#601: Human Traffic of Stadium</div>
    <div class="text-xs text-gray-500">Must solve</div>
  </a>
</div>

</div>
</div>