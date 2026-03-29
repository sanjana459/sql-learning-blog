---
title: "JOINs Part 2 - RIGHT, FULL, SELF, and CROSS JOIN"
meta_title: "SQL Day 8 - RIGHT JOIN, FULL OUTER JOIN, SELF JOIN, CROSS JOIN"
description: "Completing JOIN mastery. RIGHT JOIN, FULL OUTER JOIN, SELF JOIN for hierarchical data, CROSS JOIN for cartesian products, and the important difference between filtering in ON vs WHERE."
date: 2025-08-08
image: "/images/posts/day-8.jpg"
categories: ["joins"]
tags: ["SELF JOIN", "CROSS JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "JOIN"]
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

## 🎯 Goal: Complete my JOIN mastery

---

## 🔗 All JOIN Types at a Glance

| JOIN Type | Returns | NULLs Where |
|---|---|---|
| INNER JOIN | Only rows matching in both tables | No NULLs from join |
| LEFT JOIN | All left rows + matching right | Right side where no match |
| RIGHT JOIN | All right rows + matching left | Left side where no match |
| FULL OUTER JOIN | All rows from both tables | Either side where no match |
| CROSS JOIN | Every row combination | No NULLs added |

---

## 🔗 RIGHT JOIN

RIGHT JOIN is the mirror of LEFT JOIN. It keeps all rows from the right (second) table and NULLs where there is no match in the left table.

```sql
-- All orders, even if customer data is missing
SELECT
  c.customer_name,
  o.product,
  o.amount
FROM customers c
RIGHT JOIN orders o ON c.customer_id = o.customer_id;
```

> 💡 **TIP**: In practice, most SQL developers avoid RIGHT JOIN and instead flip the table order to use LEFT JOIN. It reads more naturally. `RIGHT JOIN table_a, table_b` is the same result as `LEFT JOIN table_b, table_a` with the tables flipped.

---

## 🔗 FULL OUTER JOIN

FULL OUTER JOIN returns all rows from both tables. Where there is no match, the missing side shows NULL.

```sql
-- In PostgreSQL or SQL Server
SELECT c.customer_name, o.product
FROM customers c
FULL OUTER JOIN orders o ON c.customer_id = o.customer_id;

-- SQLite workaround using UNION
SELECT c.customer_name, o.product
FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id
UNION
SELECT c.customer_name, o.product
FROM customers c RIGHT JOIN orders o ON c.customer_id = o.customer_id;
```

---

## 🔗 SELF JOIN - A Table Joining Itself

This one is really interesting. Sometimes a table references itself. The most common example is an employees table where each employee has a manager who is also in the same table.

```sql
CREATE TABLE staff (
  id INTEGER,
  name TEXT,
  manager_id INTEGER
);
INSERT INTO staff VALUES (1, 'CEO Dana', NULL);
INSERT INTO staff VALUES (2, 'Sarah Khan', 1);
INSERT INTO staff VALUES (3, 'James Obi', 1);
INSERT INTO staff VALUES (4, 'Priya Nair', 2);
INSERT INTO staff VALUES (5, 'Tom Reyes', 2);

-- Show each employee with their manager's name
SELECT
  e.name AS employee,
  m.name AS manager
FROM staff e
LEFT JOIN staff m ON e.manager_id = m.id;

-- CEO Dana shows NULL for manager, which is correct
```

> 🔑 **KEY CONCEPT**: In a self join I give the same table two different aliases. `e` for employee and `m` for manager. Use LEFT JOIN so the top-level person who has no manager still appears. Self joins come up constantly in LeetCode SQL problems so worth getting comfortable with.

---

## 🔗 CROSS JOIN - Every Combination

CROSS JOIN produces every possible combination of rows from two tables. I probably will not use this often but it is good to know.

```sql
CREATE TABLE sizes (size TEXT);
CREATE TABLE colors (color TEXT);
INSERT INTO sizes VALUES ('S'), ('M'), ('L');
INSERT INTO colors VALUES ('Red'), ('Blue'), ('Green');

SELECT size, color FROM sizes CROSS JOIN colors;
-- Returns 9 rows: S-Red, S-Blue, S-Green, M-Red, M-Blue, M-Green, L-Red, L-Blue, L-Green
```

---

## 🔗 ON vs WHERE in LEFT JOINs

This is one of those things that is easy to get wrong and gives confusing results.

```sql
-- Filter in ON: keeps all customers, only attaches Laptop orders (or NULL)
SELECT c.customer_name, o.product
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id AND o.product = 'Laptop';
-- Customers with no Laptop order still appear, with NULL for product

-- Filter in WHERE: removes customers with no Laptop order entirely
SELECT c.customer_name, o.product
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id
WHERE o.product = 'Laptop';
-- This effectively turns the LEFT JOIN into an INNER JOIN
```

> ⚠️ **WATCH OUT**: These two queries give different results. Filtering in ON preserves all left-side rows. Filtering in WHERE after a LEFT JOIN removes rows where the right side is NULL.

---

## ✏️ Practice Exercises

1. Using the staff table, show each employee and their manager using LEFT JOIN
2. Find employees who have the same manager (self join on manager_id)
3. Create sizes and colors tables and show all combinations with CROSS JOIN
4. Try LeetCode #181: Employees Earning More Than Their Managers

---

## ✅ What I Learned Today

- ✔ RIGHT JOIN is the mirror of LEFT JOIN; most devs flip tables and use LEFT JOIN
- ✔ FULL OUTER JOIN returns all rows from both sides with NULLs where no match
- ✔ SELF JOIN joins a table to itself using two different aliases; great for hierarchical data
- ✔ CROSS JOIN creates every possible row combination
- ✔ Filtering in ON vs WHERE gives different results for LEFT JOIN

---

## 🟡 LeetCode - Day 8

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/employees-earning-more-than-their-managers/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#181: Employees Earning More Than Managers</div>
    <div class="text-xs text-gray-500">Self JOIN</div>
  </a>
  <a href="https://leetcode.com/problems/rising-temperature/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#197: Rising Temperature</div>
    <div class="text-xs text-gray-500">Self JOIN on dates</div>
  </a>
  <a href="https://leetcode.com/problems/average-time-of-process-per-machine/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#1661: Average Time of Process Per Machine</div>
    <div class="text-xs text-gray-500">Self JOIN aggregation</div>
  </a>
</div>

</div>
</div>