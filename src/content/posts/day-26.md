---
title: "Advanced Interview Patterns - The Top 10 DE Interview Questions"
meta_title: "SQL Day 26 - Top 10 Data Engineer Interview SQL Patterns"
description: "Every pattern that actually appears in Data Engineer technical screens. Top N per group, running totals, deduplication, year-over-year comparison, cohort analysis, funnel analysis, session analysis, median, fill forward, and many-to-many resolution."
date: 2025-08-26
image: "/images/posts/day-26.jpg"
categories: ["advanced"]
tags: ["interview", "cohort analysis", "funnel analysis", "session analysis", "running total", "deduplication"]
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

## 🎯 Goal: Every pattern that actually appears in Data Engineer technical screens

---

## 🏆 The 10 Patterns That Appear in Every DE Interview

These are the 10 SQL patterns that come up most frequently in Data Engineer technical interviews. I want to know every one of them cold.

---

## 🏆 Pattern 1: Top N Per Group

```sql
WITH ranked AS (
  SELECT *, DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk
  FROM employees
)
SELECT name, dept, salary FROM ranked WHERE rnk <= 1;
```

---

## 🏆 Pattern 2: Running Total / Cumulative Sum

```sql
SELECT order_id, amount, order_date,
  SUM(amount) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM orders;
```

---

## 🏆 Pattern 3: Deduplication - Keep Latest

```sql
WITH deduped AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY updated_at DESC) AS rn
  FROM customer_updates
)
SELECT * FROM deduped WHERE rn = 1;
```

---

## 🏆 Pattern 4: Year-Over-Year / Period Comparison

```sql
WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount) AS revenue
  FROM orders GROUP BY 1
)
SELECT
  month,
  revenue,
  LAG(revenue) OVER (ORDER BY month) AS prev_month_revenue,
  ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
  / LAG(revenue) OVER (ORDER BY month), 2) AS pct_change
FROM monthly;
```

---

## 🏆 Pattern 5: Cohort Analysis

What percentage of users who joined in month X are still active in month X+1?

```sql
WITH first_order AS (
  SELECT customer_id, DATE_TRUNC('month', MIN(order_date)) AS cohort_month
  FROM orders GROUP BY customer_id
),
activity AS (
  SELECT o.customer_id, DATE_TRUNC('month', o.order_date) AS active_month,
    f.cohort_month
  FROM orders o JOIN first_order f ON o.customer_id = f.customer_id
)
SELECT
  cohort_month,
  active_month,
  COUNT(DISTINCT customer_id) AS active_users
FROM activity
GROUP BY cohort_month, active_month
ORDER BY cohort_month, active_month;
```

> 🎯 Cohort analysis is the most common analytics engineering interview question. The key idea: find each user's first activity date (their cohort), then track their activity in subsequent periods.

---

## 🏆 Pattern 6: Funnel Analysis

Count users at each stage of a funnel.

```sql
SELECT
  COUNT(DISTINCT CASE WHEN event = 'view'     THEN user_id END) AS viewed,
  COUNT(DISTINCT CASE WHEN event = 'add_cart' THEN user_id END) AS added_to_cart,
  COUNT(DISTINCT CASE WHEN event = 'purchase' THEN user_id END) AS purchased,
  ROUND(100.0 *
    COUNT(DISTINCT CASE WHEN event = 'purchase' THEN user_id END) /
    NULLIF(COUNT(DISTINCT CASE WHEN event = 'view' THEN user_id END), 0),
  2) AS view_to_purchase_pct
FROM events;
```

---

## 🏆 Pattern 7: Session Analysis

Group user events into sessions. A new session starts if the gap since the last event is more than 30 minutes.

```sql
WITH gaps AS (
  SELECT user_id, event_time,
    LAG(event_time) OVER (PARTITION BY user_id ORDER BY event_time) AS prev_time
  FROM events
),
session_flags AS (
  SELECT *,
    CASE WHEN prev_time IS NULL
      OR (event_time - prev_time) > 1800  -- 30 minutes in seconds
    THEN 1 ELSE 0 END AS new_session
  FROM gaps
),
sessions AS (
  SELECT *,
    SUM(new_session) OVER (PARTITION BY user_id ORDER BY event_time) AS session_id
  FROM session_flags
)
SELECT user_id, session_id, MIN(event_time) AS start, MAX(event_time) AS end,
  COUNT(*) AS events
FROM sessions GROUP BY user_id, session_id;
```

---

## 🏆 Pattern 8: Median Calculation

```sql
WITH ordered AS (
  SELECT salary,
    ROW_NUMBER() OVER (ORDER BY salary) AS rn,
    COUNT(*) OVER () AS total
  FROM employees WHERE salary IS NOT NULL
)
SELECT AVG(salary) AS median_salary
FROM ordered
WHERE rn IN (FLOOR((total + 1) / 2.0), CEIL((total + 1) / 2.0));
```

---

## 🏆 Pattern 9: Fill Forward (Last Value Carried Forward)

Fill NULL prices with the last known price.

```sql
SELECT date,
  LAST_VALUE(price IGNORE NULLS) OVER (ORDER BY date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS filled_price
FROM daily_prices;
-- Note: IGNORE NULLS is Snowflake/BigQuery. PostgreSQL needs a different approach.
```

---

## 🏆 Pattern 10: Many-to-Many Resolution

Find all products bought by customers who also bought 'Laptop'.

```sql
WITH laptop_customers AS (
  SELECT DISTINCT customer_id
  FROM orders WHERE product = 'Laptop'
)
SELECT DISTINCT o.product, COUNT(DISTINCT o.customer_id) AS customer_count
FROM orders o
JOIN laptop_customers lc ON o.customer_id = lc.customer_id
WHERE o.product != 'Laptop'
GROUP BY o.product
ORDER BY customer_count DESC;
```

---

> 🎯 **INTERVIEW PATTERN**: Patterns 1 (top N per group), 3 (deduplication), and 4 (period comparison) appear in 80% of DE interviews. Pattern 5 (cohort analysis) is the most common analytics engineering interview question. Pattern 7 (session analysis) appears in product analytics DE roles. Know all 10 cold and practice writing them without notes.

---

## ✅ What I Learned Today

- ✔ Memorized all 10 core DE interview SQL patterns
- ✔ Can write each pattern from memory in under 3 minutes
- ✔ Understand cohort analysis and session analysis
- ✔ Know funnel analysis with conditional COUNT DISTINCT

---

## 🟡 LeetCode - Day 26

Practice the interview patterns on real problems: #1321 Restaurant Growth (running total variant), #1454 Active Users (consecutive activity), #1158 Market Analysis I (funnel variant). Running total target: 45+ problems solved.

</div>
</div>