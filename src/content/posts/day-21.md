---
title: "LeetCode Easy Cleanup - Solving Every Easy SQL Problem"
meta_title: "SQL Day 21 - LeetCode Easy SQL Problems, Patterns, Speed"
description: "Pure LeetCode day. Clearing the entire Easy backlog with speed and confidence. A complete list of every Easy SQL problem with the concept it tests and the key pattern to use."
date: 2025-08-21
image: "/images/posts/day-21.jpg"
categories: ["leetcode"]
tags: ["LeetCode", "SELECT", "JOIN", "GROUP BY", "subquery", "easy"]
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

## 🎯 Goal: Clear the entire Easy backlog with speed and confidence

---

## 📋 Strategy for Today

Today is pure LeetCode. No new concepts. The goal is to clear every remaining Easy SQL problem I have not solved yet. By end of today I should have 20+ Easy problems solved.

> 🔑 **KEY CONCEPT**: Easy LeetCode SQL problems test exactly one concept each. They are not trick questions. If an Easy takes more than 5 minutes, stop, identify which concept it tests, review that section from Days 1-20, then come back. The target is solving Easy problems in 2-3 minutes each by the end of today.

---

## 📋 The Complete Easy SQL LeetCode List

| # | Problem | Concept Tested | Key Pattern |
|---|---|---|---|
| 175 | Combine Two Tables | LEFT JOIN | LEFT JOIN + NULL for missing data |
| 176 | Second Highest Salary | Subquery / LIMIT OFFSET | LIMIT 1 OFFSET 1 or MAX with NOT IN |
| 182 | Duplicate Emails | GROUP BY + HAVING | HAVING COUNT(*) > 1 |
| 183 | Customers Who Never Order | LEFT JOIN or NOT IN | LEFT JOIN + IS NULL |
| 184 | Department Highest Salary | Window function or subquery | MAX per group / RANK = 1 |
| 196 | Delete Duplicate Emails | DELETE with subquery | DELETE WHERE id NOT IN (MIN per email) |
| 197 | Rising Temperature | Self JOIN or LAG | Join yesterday to today on date |
| 511 | Game Play Analysis I | GROUP BY + MIN | MIN(event_date) per player |
| 577 | Employee Bonus | LEFT JOIN | LEFT JOIN + WHERE bonus < 1000 OR IS NULL |
| 584 | Find Customer Referee | NULL comparison | WHERE referee_id != 2 OR IS NULL |
| 586 | Customer Placing Largest Number of Orders | GROUP BY + LIMIT | COUNT + ORDER DESC LIMIT 1 |
| 595 | Big Countries | WHERE with OR | area > 3M OR population > 25M |
| 596 | Classes More Than 5 Students | GROUP BY + HAVING | HAVING COUNT(DISTINCT student) >= 5 |
| 607 | Sales Person | NOT IN with subquery | NOT IN (salespeople who sold to company) |
| 620 | Not Boring Movies | WHERE with MOD | id % 2 = 1 AND description != 'boring' |
| 627 | Swap Salary | UPDATE with CASE | UPDATE SET sex = CASE WHEN 'm' THEN 'f' ELSE 'm' END |
| 1050 | Actors and Directors | GROUP BY + HAVING | HAVING COUNT(*) >= 3 |
| 1068 | Product Sales Analysis I | INNER JOIN | JOIN on product_id |
| 1075 | Project Employees I | JOIN + AVG | AVG(experience_years) per project |
| 1148 | Article Views I | WHERE + DISTINCT | author_id = viewer_id, DISTINCT |
| 1179 | Reformat Department Table | PIVOT with CASE | SUM(CASE WHEN month = 'Jan' THEN revenue END) |
| 1378 | Replace Employee ID With Unique Identifier | LEFT JOIN | Basic LEFT JOIN |
| 1407 | Top Travellers | LEFT JOIN + GROUP BY | SUM distance per person |
| 1484 | Group Sold Products By The Date | GROUP_CONCAT / STRING_AGG | Aggregate product names per date |
| 1527 | Patients With a Condition | LIKE | LIKE 'DIAB1%' OR LIKE '% DIAB1%' |
| 1581 | Customer Who Visited but Did Not Make Transactions | LEFT JOIN + IS NULL | COUNT NULLs |
| 1667 | Fix Names in a Table | UPPER + LOWER + SUBSTR | UPPER first char + LOWER rest |
| 1683 | Invalid Tweets | LENGTH | WHERE LENGTH(content) > 15 |
| 1757 | Recyclable and Low Fat Products | WHERE with AND | low_fats = 'Y' AND recyclable = 'Y' |
| 1873 | Calculate Special Bonus | CASE + MOD | id % 2 != 0 AND name NOT LIKE 'M%' |

---

## 📋 Speed Tips for Easy Problems

- **Read the schema first** before reading the question. Understand what each table contains.
- **Identify the pattern in 30 seconds**: Is it a JOIN? GROUP BY? Subquery? Window function?
- **Build it layer by layer**: Write SELECT first, then FROM, then WHERE, then GROUP BY.
- **Mental trace**: Run through 2 example rows in your head before submitting.

---

## 📋 Core Patterns to Memorize

**Second Highest Salary - two approaches:**

```sql
-- Approach 1: subquery with MAX
SELECT MAX(salary) AS SecondHighestSalary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);

-- Approach 2: DENSE_RANK (handles NULL case cleanly)
WITH ranked AS (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM Employee
)
SELECT MAX(salary) AS SecondHighestSalary FROM ranked WHERE rnk = 2;
```

**Customers Who Never Ordered - LEFT JOIN + IS NULL:**

```sql
SELECT c.name AS Customers
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customerId
WHERE o.id IS NULL;
```

**Fix Names - string manipulation:**

```sql
SELECT user_id,
  CONCAT(UPPER(SUBSTR(name, 1, 1)), LOWER(SUBSTR(name, 2))) AS name
FROM Users
ORDER BY user_id;
```

**Pivot with CASE + GROUP BY:**

```sql
SELECT id,
  SUM(CASE WHEN month = 'Jan' THEN revenue END) AS Jan_Revenue,
  SUM(CASE WHEN month = 'Feb' THEN revenue END) AS Feb_Revenue,
  SUM(CASE WHEN month = 'Mar' THEN revenue END) AS Mar_Revenue
FROM Department
GROUP BY id;
```

---

## ✅ What I Did Today

- ✔ Worked through 20+ Easy LeetCode SQL problems
- ✔ Can identify the pattern of any Easy problem within 30 seconds
- ✔ Memorized the core patterns: second highest, never appeared, fix names, pivot
- ✔ Building speed towards 2-3 minutes per Easy problem

---

## 🟡 LeetCode - Day 21

**Target: Clear every Easy problem from the list above.**

Minimum: 20 Easy problems solved by end of today. Stretch: 30+. If stuck on any, identify the concept, review Days 1-20, then come back.

</div>
</div>