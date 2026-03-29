---
title: "Table Design - Data Types, Keys, and Constraints"
meta_title: "SQL Day 16 - Data Types, PRIMARY KEY, FOREIGN KEY, Constraints, ALTER TABLE"
description: "Learning to build tables the right way from scratch. Choosing the right data types, creating primary and foreign keys, applying NOT NULL, UNIQUE, CHECK, and DEFAULT constraints, and modifying tables with ALTER TABLE."
date: 2025-08-16
image: "/images/posts/day-16.jpg"
categories: ["fundamentals"]
tags: ["data types", "PRIMARY KEY", "FOREIGN KEY", "constraints", "ALTER TABLE"]
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

## 🎯 Goal: Learn to build tables the right way from scratch

---

## 🏗️ Data Types - Choosing the Right Type

Every column in a table has a data type. Choosing the right one matters for storage, performance, and data integrity.

| Category | Common Types | Examples | Notes |
|---|---|---|---|
| Integer | INTEGER, INT, BIGINT | employee_id, age, quantity | BIGINT for very large numbers |
| Decimal | DECIMAL(p,s), NUMERIC, FLOAT | price DECIMAL(10,2) | DECIMAL for money (exact). FLOAT for science (approximate) |
| Text | VARCHAR(n), TEXT, CHAR(n) | name VARCHAR(100) | VARCHAR for variable length. CHAR for fixed (country codes) |
| Date/Time | DATE, TIMESTAMP, TIMESTAMPTZ | hire_date DATE | Always TIMESTAMP for events. DATE for calendar dates only |
| Boolean | BOOLEAN | is_active BOOLEAN | SQLite uses INTEGER (0/1). PostgreSQL has native BOOLEAN |
| JSON | JSON, JSONB | metadata JSON | JSONB (PostgreSQL) is indexed and faster than JSON |

> 💡 **TIP**: Never store money as FLOAT. Use `DECIMAL(15, 2)`. FLOAT has rounding errors. Never store dates as TEXT. Use DATE or TIMESTAMP so date functions work correctly. Always use TIMESTAMPTZ for events that cross timezones.

---

## 🏗️ Primary Keys

A primary key uniquely identifies each row. No two rows can have the same primary key value. It cannot be NULL.

```sql
-- Integer primary key (most common)
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(200)
);

-- Auto-incrementing primary key (SQLite)
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER,
  total DECIMAL(10,2)
);

-- Auto-incrementing primary key (PostgreSQL)
CREATE TABLE orders (
  order_id SERIAL PRIMARY KEY,
  customer_id INTEGER,
  total DECIMAL(10,2)
);

-- Composite primary key (combination of two columns is unique)
CREATE TABLE order_items (
  order_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  PRIMARY KEY (order_id, product_id)
);
```

---

## 🏗️ Foreign Keys - Linking Tables

A foreign key is a column that references the primary key of another table. This enforces referential integrity. I cannot add an order for a customer that does not exist.

```sql
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  total DECIMAL(10,2),
  order_date DATE,
  -- customer_id must exist in customers.customer_id
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    ON DELETE CASCADE   -- delete orders if customer is deleted
    ON UPDATE CASCADE   -- update if customer_id changes
);
```

---

## 🏗️ Constraints - Enforcing Rules

```sql
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,               -- cannot be NULL
  email VARCHAR(200) UNIQUE,               -- must be unique across all rows
  salary DECIMAL(10,2) CHECK (salary > 0), -- must be positive
  department VARCHAR(50) DEFAULT 'General', -- default if not specified on INSERT
  hire_date DATE NOT NULL
);

-- Test the constraints
INSERT INTO employees VALUES (1, NULL, 'a@b.com', 50000, 'Engineering', '2024-01-01');
-- Error: NOT NULL violation on name

INSERT INTO employees VALUES (2, 'Alice', 'a@b.com', -1000, 'Engineering', '2024-01-01');
-- Error: CHECK constraint violation on salary
```

| Constraint | What It Enforces |
|---|---|
| NOT NULL | Column cannot contain NULL values |
| UNIQUE | All values in column must be different |
| PRIMARY KEY | NOT NULL + UNIQUE combined, one per table |
| FOREIGN KEY | Value must exist in the referenced table |
| CHECK | Value must satisfy a custom condition |
| DEFAULT | Value to use when none is provided on INSERT |

---

## 🏗️ ALTER TABLE - Modifying Existing Tables

```sql
-- Add a new column
ALTER TABLE employees ADD COLUMN bonus DECIMAL(10,2) DEFAULT 0;

-- Rename a column (PostgreSQL)
ALTER TABLE employees RENAME COLUMN name TO full_name;

-- Change a column's data type (PostgreSQL)
ALTER TABLE employees ALTER COLUMN salary TYPE BIGINT;

-- Drop a column
ALTER TABLE employees DROP COLUMN bonus;

-- Add a constraint after creation
ALTER TABLE employees ADD CONSTRAINT chk_salary CHECK (salary > 0);
```

---

## ✏️ Practice Exercises

1. Create a products table with proper data types: product_id (PK), name, price (DECIMAL), category, in_stock (BOOLEAN), created_at (TIMESTAMP)
2. Create an order_items table with a composite primary key and foreign keys to orders and products
3. Add a CHECK constraint that ensures price is always > 0
4. Try inserting a row that violates each constraint and observe the error
5. Add a discount_pct column to products with a DEFAULT of 0

---

## ✅ What I Learned Today

- ✔ How to choose the right data type for each column (no FLOAT for money, no TEXT for dates)
- ✔ How to create tables with primary keys (single and composite)
- ✔ How to define foreign keys to link related tables
- ✔ How to apply NOT NULL, UNIQUE, CHECK, and DEFAULT constraints
- ✔ How to modify existing tables with ALTER TABLE

---

## 🟡 LeetCode - Day 16

No specific problems today. The focus is on reading table schemas carefully for upcoming problems.

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/immediate-food-delivery-ii/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1174: Immediate Food Delivery II</div>
    <div class="text-xs text-gray-500">Read the schema carefully</div>
  </a>
  <a href="https://leetcode.com/problems/monthly-transactions-i/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1193: Monthly Transactions I</div>
    <div class="text-xs text-gray-500">Read the schema carefully</div>
  </a>
</div>

</div>
</div>