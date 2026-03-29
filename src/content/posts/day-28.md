---
title: "Mock Interview Prep - Common Questions and Full Answers"
meta_title: "SQL Day 28 - SQL Interview Questions, Verbal Answers, Live Coding"
description: "Practicing the exact questions interviewers ask. Verbal SQL concept questions with clear answers, and five live coding patterns to write from memory under interview conditions."
date: 2025-08-28
image: "/images/posts/day-28.jpg"
categories: ["leetcode"]
tags: ["interview", "mock interview", "WHERE vs HAVING", "RANK vs ROW_NUMBER", "CTE vs subquery"]
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

## 🎯 Goal: Practice the exact questions interviewers ask

---

## 💬 Verbal SQL Questions

Interviewers often ask SQL questions verbally before having me write code. These test whether I know the concepts, not just the syntax.

---

**Q: What is the difference between WHERE and HAVING?**

WHERE filters individual rows before grouping. HAVING filters groups after aggregation. I cannot use aggregate functions in WHERE but I can in HAVING. Example: `WHERE salary > 50000` filters rows before any GROUP BY. `HAVING COUNT(*) > 5` filters groups that have more than 5 members.

---

**Q: What is the difference between RANK, DENSE_RANK, and ROW_NUMBER?**

All three assign numbers to rows based on ORDER BY. ROW_NUMBER assigns unique sequential numbers — ties get different numbers. RANK assigns the same number to ties but skips the next number (1, 1, 3). DENSE_RANK assigns the same number to ties without skipping (1, 1, 2). Use ROW_NUMBER for deduplication, DENSE_RANK for top N per group.

---

**Q: What is a CTE and when would you use it over a subquery?**

A CTE is a named temporary result defined before the main query using the WITH keyword. I use CTEs when: the logic needs to be referenced more than once, the query has multiple steps that benefit from being named, or I need to use a window function result in a WHERE clause. CTEs are also easier to debug because I can run each CTE independently.

---

**Q: How do you handle NULL values in SQL?**

NULL is not zero and not empty — it means unknown. It behaves unexpectedly: NULL = NULL is false, NULL + anything is NULL. To check for NULL use `IS NULL`, not `= NULL`. To replace NULL use `COALESCE(column, default_value)`. To prevent division by zero use `NULLIF(denominator, 0)`. In aggregates, AVG, SUM, MIN, MAX all ignore NULLs automatically, but `COUNT(*)` includes them while `COUNT(column)` excludes them.

---

**Q: What is an index and when should you add one?**

An index is a separate data structure the database maintains to speed up lookups. Without an index, a filter query scans every row. With an index on the filter column, the database jumps directly to matching rows. Add indexes on columns frequently used in WHERE, JOIN conditions, and ORDER BY on large tables. Do not index every column — indexes slow down writes. Avoid indexing low-cardinality columns like booleans.

---

**Q: What is the difference between INNER JOIN and LEFT JOIN?**

INNER JOIN returns only rows where a match exists in both tables. LEFT JOIN returns all rows from the left table and NULLs where there is no match in the right table. Use INNER JOIN when I only want complete matches. Use LEFT JOIN when I want to keep all rows from the primary table, such as showing all customers even those with no orders.

---

## 💻 Live Coding Questions

These I want to write from memory in under 3 minutes each.

**Find the employee with the highest salary in each department:**

```sql
WITH ranked AS (
  SELECT name, department, salary,
    RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
  FROM employees
)
SELECT name, department, salary FROM ranked WHERE rnk = 1;
```

**Find all customers who placed orders every day for the last 7 days:**

```sql
SELECT customer_id
FROM orders
WHERE order_date >= CURRENT_DATE - 7
GROUP BY customer_id
HAVING COUNT(DISTINCT order_date) = 7;
```

**Calculate month-over-month revenue growth:**

```sql
WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS month,
    SUM(amount) AS revenue
  FROM orders GROUP BY 1
)
SELECT month, revenue,
  LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
  ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
  / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 2) AS pct_growth
FROM monthly ORDER BY month;
```

**Remove duplicate rows keeping the most recent record:**

```sql
-- Method 1: CTE + ROW_NUMBER (standard SQL)
WITH deduped AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC) AS rn
  FROM table_name
)
SELECT * FROM deduped WHERE rn = 1;

-- Method 2: QUALIFY (Snowflake/BigQuery)
SELECT * FROM table_name
QUALIFY ROW_NUMBER() OVER (PARTITION BY id ORDER BY updated_at DESC) = 1;
```

**Find users active in January but not in February:**

```sql
SELECT DISTINCT user_id
FROM events
WHERE DATE_TRUNC('month', event_date) = '2024-01-01'
EXCEPT
SELECT DISTINCT user_id
FROM events
WHERE DATE_TRUNC('month', event_date) = '2024-02-01';
```

---

## ✅ What I Did Today

- ✔ Can answer all verbal SQL concept questions clearly and concisely
- ✔ Can write all 5 live coding patterns from memory under 3 minutes each
- ✔ Know the exact wording for WHERE vs HAVING, RANK vs ROW_NUMBER, CTE vs subquery
- ✔ Prepared for both concept questions and live coding rounds

---

## 🟡 LeetCode - Day 28

Simulate interview conditions. Pick 5 random Medium problems I have not seen before. Set a 15-minute timer per problem, no hints, no notes. Grade: solved in time = pass, needed hints = review that pattern.

</div>
</div>