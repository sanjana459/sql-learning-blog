---
title: "LeetCode Medium - Part 1"
meta_title: "SQL Day 22 - LeetCode Medium Problems, DE Interview Patterns"
description: "Tackling the Medium problems that appear most in Data Engineer interviews. Strategy for combining multiple SQL concepts, priority problems list, and solutions for the 8 most important Medium problems."
date: 2025-08-22
image: "/images/posts/day-22.jpg"
categories: ["leetcode"]
tags: ["LeetCode", "DENSE_RANK", "CTE", "window functions", "medium"]
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

## 🎯 Goal: Tackle the Medium problems that appear most in DE interviews

---

## 📋 Medium Problem Strategy

Medium problems combine multiple concepts. They require chaining 2 or 3 patterns together. My approach:

1. Read the problem and identify EVERY concept it is testing, usually 2 or 3
2. Plan the query structure before writing. What CTEs do I need? What window functions?
3. Build it step by step. Write and test each piece before combining
4. If stuck after 15 minutes, look at hints only, not the full solution

---

## 📋 Priority Medium Problems for Data Engineers

| # | Problem | Concepts Combined | Why Important for DE |
|---|---|---|---|
| 178 | Rank Scores | DENSE_RANK window function | Classic ranking, appears in almost every interview |
| 180 | Consecutive Numbers | Self JOIN or LAG/LEAD | Gaps and islands, real pipeline pattern |
| 184 | Department Highest Salary | JOIN + MAX or window | Top N per group, extremely common |
| 185 | Department Top Three Salaries | CTE + DENSE_RANK | Harder version of top N, tests CTE mastery |
| 262 | Trips and Users | Multiple JOINs + GROUP BY + ROUND | Complex filtering with date ranges |
| 570 | Managers with at Least 5 Direct Reports | Self JOIN + GROUP BY + HAVING | Org hierarchy + aggregation |
| 601 | Human Traffic of Stadium | Gaps and islands advanced | Consecutive rows with condition |
| 1045 | Customers Who Bought All Products | GROUP BY + HAVING + COUNT DISTINCT | Relational division pattern |
| 1193 | Monthly Transactions I | DATE functions + CASE in aggregate | Monthly pivot-style aggregation |
| 1204 | Last Person to Fit in the Bus | Running SUM + window | Find last row before threshold |
| 1321 | Restaurant Growth | SUM with rolling window | 7-day moving average |
| 1341 | Movie Rating | Two CTEs + UNION + ORDER BY | Union two different aggregations |

---

## 📋 Today's Target: Solve These 8 First

These are the most common in Data Engineer technical screens.

**#178: Rank Scores**

```sql
SELECT score,
  DENSE_RANK() OVER (ORDER BY score DESC) AS 'rank'
FROM Scores
ORDER BY score DESC;
```

**#184: Department Highest Salary**

```sql
WITH dept_max AS (
  SELECT departmentId, MAX(salary) AS max_sal
  FROM Employee GROUP BY departmentId
)
SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
JOIN dept_max m ON e.departmentId = m.departmentId AND e.salary = m.max_sal;
```

**#185: Department Top Three Salaries**

```sql
WITH ranked AS (
  SELECT e.name AS Employee, e.salary, e.departmentId,
    DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) AS rnk
  FROM Employee e
)
SELECT d.name AS Department, r.Employee, r.salary AS Salary
FROM ranked r
JOIN Department d ON r.departmentId = d.id
WHERE r.rnk <= 3;
```

**#1204: Last Person to Fit in the Bus**

```sql
WITH running AS (
  SELECT person_name, weight, turn,
    SUM(weight) OVER (ORDER BY turn) AS running_weight
  FROM Queue
)
SELECT person_name
FROM running
WHERE running_weight <= 1000
ORDER BY turn DESC
LIMIT 1;
```

**#1193: Monthly Transactions I**

```sql
SELECT
  DATE_FORMAT(trans_date, '%Y-%m') AS month,
  country,
  COUNT(*) AS trans_count,
  SUM(CASE WHEN state = 'approved' THEN 1 ELSE 0 END) AS approved_count,
  SUM(amount) AS trans_total_amount,
  SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END) AS approved_total_amount
FROM Transactions
GROUP BY month, country;
```

**#570: Managers with at Least 5 Direct Reports**

```sql
SELECT name
FROM Employee
WHERE id IN (
  SELECT managerId
  FROM Employee
  GROUP BY managerId
  HAVING COUNT(*) >= 5
);
```

**#178 and #185 are the two I want to get completely comfortable with today.** The DENSE_RANK pattern and the top N per group CTE pattern appear in basically every DE interview.

---

## ✅ What I Did Today

- ✔ Learned the Medium problem strategy: identify concepts, plan, build layer by layer
- ✔ Solved at least 8 Medium problems
- ✔ Got comfortable with the DENSE_RANK ranking pattern
- ✔ Got comfortable with the top N per group pattern with CTE + DENSE_RANK

---

## 🟡 LeetCode - Day 22

**Target: 8 Medium problems solved.**

Priority order: #178, #184, #185, #1204, #1193, #1341, #1321, #570. If done early: #262, #1158. Running total aim: around 28+ problems solved (20 Easy + 8 Medium).

</div>
</div>