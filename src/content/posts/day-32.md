---
title: "Normalization, ACID, and Transaction Isolation Levels"
meta_title: "SQL Day 32 - 1NF 2NF 3NF, ACID Properties, Transaction Isolation Levels"
description: "Database theory every DE interview tests. Identifying and fixing 1NF, 2NF, and 3NF violations, all four ACID properties with examples, and the four transaction isolation levels with what anomalies each prevents."
date: 2025-09-01
image: "/images/posts/day-32.jpg"
categories: ["advanced"]
tags: ["normalization", "ACID", "1NF", "2NF", "3NF", "transactions", "isolation levels"]
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

## 🎯 Goal: Fill the gap - database theory every DE interview tests

---

## 📐 Database Normalization

Normalization is the process of organizing a database to reduce redundancy and improve data integrity. Done in stages called Normal Forms.

### The Problem Without Normalization

```sql
-- Unnormalized table (everything in one table)
-- employee_id | name  | dept_name   | dept_manager | project_name  | project_budget
-- 1           | Sarah | Engineering | Alice        | Pipeline Proj | 50000
-- 1           | Sarah | Engineering | Alice        | Dashboard Proj| 30000

-- Problems:
-- 1. dept_manager repeated for every employee in that dept (redundancy)
-- 2. If Alice changes name, must update every row (update anomaly)
-- 3. Can't store a dept with no employees (insertion anomaly)
-- 4. Deleting Sarah's last project deletes her dept info (deletion anomaly)
```

---

### First Normal Form (1NF) - No Repeating Groups

Each column must contain atomic (single) values. No arrays, no comma-separated lists.

```sql
-- VIOLATES 1NF: multiple values in one cell
-- employee_id | name  | skills
-- 1           | Sarah | 'Python, SQL, Spark'  <-- not atomic

-- SATISFIES 1NF: one value per cell
-- employee_skills table:
-- employee_id | skill
-- 1           | Python
-- 1           | SQL
-- 1           | Spark
```

---

### Second Normal Form (2NF) - No Partial Dependencies

Must be in 1NF. Every non-key column must depend on the ENTIRE primary key, not just part of it. Only relevant when the primary key is composite.

```sql
-- VIOLATES 2NF: order_items with composite PK (order_id, product_id)
-- order_id | product_id | quantity | product_name | product_price
-- product_name and product_price depend only on product_id (partial dependency)

-- SATISFIES 2NF: split into two tables
-- order_items: order_id, product_id, quantity
-- products:    product_id, product_name, product_price
```

---

### Third Normal Form (3NF) - No Transitive Dependencies

Must be in 2NF. Non-key columns must depend only on the primary key, not on other non-key columns.

```sql
-- VIOLATES 3NF: employees table
-- emp_id | name | dept_id | dept_name | dept_manager
-- dept_name depends on dept_id (not emp_id) -- transitive dependency

-- SATISFIES 3NF: split into two tables
-- employees:   emp_id, name, dept_id
-- departments: dept_id, dept_name, dept_manager
```

> 🎯 **INTERVIEW PATTERN**: Interviewers show a poorly designed table and ask what is wrong. The answer structure: identify the normal form violation, name it (1NF/2NF/3NF), explain the anomaly it causes, show the fix. In real DE work, data warehouses are often intentionally denormalized (star schema) for query performance. Know both sides.

---

## ⚡ ACID Properties

ACID stands for Atomicity, Consistency, Isolation, Durability. These four properties guarantee database transactions are processed reliably.

| Property | Meaning | Example | Violated When |
|---|---|---|---|
| Atomicity | All or nothing | Transferring money: debit AND credit must both succeed or neither happens | Debit succeeds but credit fails — money lost |
| Consistency | Database goes from one valid state to another, all constraints satisfied | A foreign key constraint is enforced during INSERT | An order references a non-existent customer |
| Isolation | Concurrent transactions execute as if they ran sequentially | Two people booking the last seat — only one succeeds | Two sessions both see the same row as available and both book it |
| Durability | Once committed, stays committed even if the system crashes | Committed order survives a server restart | Power failure after COMMIT loses the transaction |

```sql
-- Atomicity in practice: wrap related operations in a transaction
BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;  -- debit
UPDATE accounts SET balance = balance + 500 WHERE id = 2;  -- credit
-- If any error occurs, ROLLBACK undoes both changes
COMMIT;  -- only if both succeed
```

---

## 🔒 Transaction Isolation Levels

Isolation levels control how much one transaction can see from other concurrent transactions. Lower isolation = better performance but more anomalies.

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read | Performance |
|---|---|---|---|---|
| READ UNCOMMITTED | Possible | Possible | Possible | Fastest |
| READ COMMITTED (default most DBs) | Prevented | Possible | Possible | Fast |
| REPEATABLE READ | Prevented | Prevented | Possible | Moderate |
| SERIALIZABLE | Prevented | Prevented | Prevented | Slowest |

**What Each Anomaly Means:**
- **Dirty Read:** Transaction A reads data that B modified but not committed. If B rolls back, A read data that never existed.
- **Non-Repeatable Read:** Transaction A reads a row twice and gets different values because B committed a change between the reads.
- **Phantom Read:** Transaction A runs a range query twice and gets different rows because B inserted or deleted rows matching the range.

```sql
-- Set isolation level (PostgreSQL)
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT * FROM orders WHERE customer_id = 5;
-- ... do work ...
SELECT * FROM orders WHERE customer_id = 5;  -- same result guaranteed
COMMIT;

-- In Snowflake: isolation level is always READ COMMITTED
-- In BigQuery: transactions are SERIALIZABLE within a session
-- In MySQL: default is REPEATABLE READ
```

---

## ✏️ Practice

1. Take this table and normalize to 3NF: `orders(order_id, customer_name, customer_city, product_name, product_category, quantity, unit_price)`
2. Write a transaction that transfers 500 from account 1 to account 2, with a rollback if either update fails
3. Explain in plain English what would go wrong if two sessions both ran `SELECT seat FROM flights WHERE available = 1 LIMIT 1` simultaneously without proper isolation

---

## ✅ What I Learned Today

- ✔ How to identify and fix 1NF, 2NF, and 3NF violations
- ✔ How to normalize a denormalized table step by step
- ✔ All four ACID properties with real examples
- ✔ The four transaction isolation levels and what anomalies each prevents
- ✔ Default isolation levels: READ COMMITTED (PostgreSQL/Snowflake), REPEATABLE READ (MySQL), SERIALIZABLE (BigQuery)

---

## 🟡 LeetCode - Day 32

Revisit #262 Trips and Users and trace through what ACID guarantees the booking system needs. Review any unsolved Medium problems. Aim for 50+ total solved by now.

</div>
</div>