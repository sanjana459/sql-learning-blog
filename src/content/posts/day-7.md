---
title: "JOINs Part 1 - INNER JOIN and LEFT JOIN"
meta_title: "SQL Day 7 - INNER JOIN, LEFT JOIN, Joining Multiple Tables"
description: "The most important SQL concept for Data Engineers. Learning why JOINs exist, how INNER JOIN returns only matching rows, and how LEFT JOIN keeps all left-side rows including those with no match."
date: 2025-08-07
image: "/images/posts/day-7.jpg"
categories: ["joins"]
tags: ["INNER JOIN", "LEFT JOIN", "JOIN", "multi-table"]
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

## 🎯 Goal: Understand the most important SQL concept for Data Engineers

---

## 🔗 Why JOINs Exist

In a well-designed database, data is split across multiple tables. Customer info lives in one table, their orders in another, the products they ordered in a third. JOINs let me combine these tables to answer real questions.

```sql
-- Setting up two tables to practice with
CREATE TABLE customers (
  customer_id INTEGER,
  customer_name TEXT,
  city TEXT
);
INSERT INTO customers VALUES (1, 'Alice Brown', 'New York');
INSERT INTO customers VALUES (2, 'Bob Smith', 'Chicago');
INSERT INTO customers VALUES (3, 'Carol White', 'New York');
INSERT INTO customers VALUES (4, 'David Lee', 'Boston');  -- has NO orders

CREATE TABLE orders (
  order_id INTEGER,
  customer_id INTEGER,
  product TEXT,
  amount REAL,
  order_date TEXT
);
INSERT INTO orders VALUES (101, 1, 'Laptop', 1200.00, '2024-01-15');
INSERT INTO orders VALUES (102, 1, 'Mouse', 25.00, '2024-01-20');
INSERT INTO orders VALUES (103, 2, 'Keyboard', 75.00, '2024-02-01');
INSERT INTO orders VALUES (104, 3, 'Monitor', 350.00, '2024-02-10');
INSERT INTO orders VALUES (105, 1, 'Headphones', 120.00, '2024-03-05');
```

Notice that David Lee has no orders. This will matter when I get to LEFT JOIN.

---

## 🔗 INNER JOIN - Only Matching Rows

INNER JOIN returns rows where there is a match in BOTH tables. Rows with no match are excluded from results entirely.

```sql
SELECT
  c.customer_name,
  c.city,
  o.product,
  o.amount,
  o.order_date
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;

-- David Lee does NOT appear because he has no orders
```

> 🔑 **KEY CONCEPT**: The ON clause defines which columns link the two tables. Always join on meaningful keys, usually a primary key in one table matching a foreign key in another. `c` and `o` are table aliases. When column names exist in both tables, I must prefix with the table alias.

---

## 🔗 LEFT JOIN - Keep All Left-Side Rows

LEFT JOIN returns all rows from the LEFT table, plus matching rows from the RIGHT table. If there is no match in the right table, the right side columns show NULL.

```sql
-- Get ALL customers, even those with no orders
SELECT
  c.customer_name,
  c.city,
  o.product,
  o.amount
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id;

-- David Lee appears with NULL for product and amount
```

```sql
-- Find customers who have NEVER placed an order
SELECT c.customer_name
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_id IS NULL;
```

> 🔑 **KEY CONCEPT**: The LEFT in LEFT JOIN refers to the table written first (to the left of the JOIN keyword). The trick for finding missing data is LEFT JOIN then `WHERE right_table.key IS NULL`. This pattern is one of the most common patterns in real analytics work.

---

## 🔗 Joining More Than Two Tables

```sql
CREATE TABLE products (
  product_name TEXT,
  category TEXT,
  unit_cost REAL
);
INSERT INTO products VALUES ('Laptop', 'Electronics', 900.00);
INSERT INTO products VALUES ('Mouse', 'Accessories', 15.00);
INSERT INTO products VALUES ('Keyboard', 'Accessories', 45.00);
INSERT INTO products VALUES ('Monitor', 'Electronics', 250.00);
INSERT INTO products VALUES ('Headphones', 'Electronics', 80.00);

-- Join all three tables
SELECT
  c.customer_name,
  o.product,
  o.amount,
  p.category,
  o.amount - p.unit_cost AS profit
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN products p ON o.product = p.product_name;
```

---

## ✏️ Practice Exercises

1. Show all orders with customer names and cities
2. Show total amount spent per customer (GROUP BY after JOIN)
3. Show all customers including those with no orders, show order count (0 if none)
4. Find the customer who spent the most in total
5. Join all three tables to show each order with customer name, product category, and profit

---

## ✅ What I Learned Today

- ✔ JOINs combine data from multiple tables using a linking key
- ✔ INNER JOIN returns only rows that match in both tables
- ✔ LEFT JOIN keeps all left-table rows and shows NULL where there is no right-side match
- ✔ LEFT JOIN + IS NULL is the pattern for finding rows with no match
- ✔ Multiple JOINs can be chained to combine 3 or more tables

---

## 🟡 LeetCode - Day 7

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/combine-two-tables/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#175: Combine Two Tables</div>
    <div class="text-xs text-gray-500">LEFT JOIN basics</div>
  </a>
  <a href="https://leetcode.com/problems/product-sales-analysis-i/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1068: Product Sales Analysis I</div>
    <div class="text-xs text-gray-500">INNER JOIN</div>
  </a>
  <a href="https://leetcode.com/problems/employees-earning-more-than-their-managers/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#181: Employees Earning More Than Managers</div>
    <div class="text-xs text-gray-500">Self JOIN preview</div>
  </a>
</div>

</div>
</div>