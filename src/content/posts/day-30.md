---
title: "Day 30 - Full Mock Interview"
meta_title: "SQL Day 30 - 90-Minute Mock Interview, 10 Questions, No Notes"
description: "90 minutes, 10 questions, no notes. The final mock interview covering every pattern from the 30-day journey. Full questions and reference answers included."
date: 2025-08-30
image: "/images/posts/day-30.jpg"
categories: ["leetcode"]
tags: ["mock interview", "review", "window functions", "CTE", "JOIN", "deduplication"]
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

## 🎯 Goal: 90 minutes, 10 questions, no notes. I am ready.

---

## 📋 Mock Interview Rules

Timer set to 90 minutes. All references closed. Fresh SQL environment open. Work through all 10 questions. No skipping ahead or looking at answers until I have attempted every question. Each question should take 6-10 minutes. If stuck after 10 minutes, write what I know and move on — come back at the end. Think out loud as I write, narrate the approach.

---

## 📋 Schema for All Questions

```sql
employees: id, name, dept, salary, hire_date, manager_id
orders: id, emp_id, customer_id, amount, order_date, status
customers: id, name, city, signup_date
products: id, name, category, price
order_items: order_id, product_id, quantity, unit_price
```

---

## 📋 The 10 Questions

**Question 1 (Basic - 5 min):** Show the top 5 highest paid employees with their name, department, salary, and monthly salary. Include employees with NULL salary, showing 0 for them.

**Question 2 (Aggregation - 6 min):** For each department show: headcount, total payroll, average salary, highest salary, and lowest salary. Sort by total payroll descending. Exclude departments with fewer than 2 employees.

**Question 3 (JOIN - 8 min):** Show each employee's name, department, total orders placed, and total order value. Include employees with no orders (show 0). Only include orders with status = 'completed'. Sort by total order value descending.

**Question 4 (Window - 8 min):** Show each employee's name, department, salary, their rank within their department by salary (highest = 1), and the difference between their salary and the highest salary in their department.

**Question 5 (CTE - 10 min):** Using CTEs, find all customers who placed orders in every month of Q1 2024 (January, February, March). Show customer name and city.

**Question 6 (Subquery - 8 min):** Find all employees who earn more than the average salary of their own department. Show name, department, salary, and their department's average salary side by side.

**Question 7 (Advanced Window - 10 min):** Show monthly revenue totals with: the previous month's revenue, the month-over-month change in absolute terms, and the percentage change. Round percentage to 2 decimal places.

**Question 8 (Deduplication - 8 min):** The orders table has duplicate records — the same order appears multiple times with different inserted_at timestamps. Write a query that returns only the most recent record per order_id.

**Question 9 (Complex - 12 min):** Find the top 3 products by total revenue in each category. Show category, product name, total revenue, and rank within category. Use DENSE_RANK so ties are handled correctly.

**Question 10 (Design - 10 min):** A table of customer events has columns: customer_id, event_type, event_date. Write a query that shows for each customer: their first event date, their most recent event date, total number of events, number of distinct event types, and whether they were active in the last 30 days (1 or 0).

---

## 📋 Reference Answers

```sql
-- Q1: Top 5 highest paid with NULL handling
SELECT name, dept, COALESCE(salary, 0) AS salary,
  ROUND(COALESCE(salary, 0) / 12.0, 2) AS monthly_salary
FROM employees
ORDER BY salary DESC NULLS LAST
LIMIT 5;

-- Q2: Department stats with HAVING
SELECT dept,
  COUNT(*) AS headcount,
  SUM(salary) AS total_payroll,
  ROUND(AVG(salary), 0) AS avg_salary,
  MAX(salary) AS highest,
  MIN(salary) AS lowest
FROM employees
GROUP BY dept
HAVING COUNT(*) >= 2
ORDER BY total_payroll DESC;

-- Q3: Employee order summary with LEFT JOIN
SELECT e.name, e.dept,
  COUNT(o.id) AS order_count,
  COALESCE(SUM(o.amount), 0) AS total_value
FROM employees e
LEFT JOIN orders o ON e.id = o.emp_id AND o.status = 'completed'
GROUP BY e.id, e.name, e.dept
ORDER BY total_value DESC;

-- Q4: Window rank and gap from max
SELECT name, dept, salary,
  RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS dept_rank,
  MAX(salary) OVER (PARTITION BY dept) - salary AS gap_from_top
FROM employees;

-- Q5: Customers active all 3 months of Q1
WITH q1_activity AS (
  SELECT o.customer_id,
    COUNT(DISTINCT DATE_TRUNC('month', o.order_date)) AS active_months
  FROM orders o
  WHERE o.order_date >= '2024-01-01' AND o.order_date < '2024-04-01'
  GROUP BY o.customer_id
  HAVING COUNT(DISTINCT DATE_TRUNC('month', o.order_date)) = 3
)
SELECT c.name, c.city
FROM customers c JOIN q1_activity qa ON c.id = qa.customer_id;

-- Q6: Above department average
WITH dept_avg AS (
  SELECT dept, AVG(salary) AS avg_sal
  FROM employees GROUP BY dept
)
SELECT e.name, e.dept, e.salary, ROUND(d.avg_sal, 0) AS dept_avg
FROM employees e JOIN dept_avg d ON e.dept = d.dept
WHERE e.salary > d.avg_sal
ORDER BY e.dept, e.salary DESC;

-- Q7: Month-over-month revenue
WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount) AS revenue
  FROM orders GROUP BY 1
)
SELECT month, revenue,
  LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
  revenue - LAG(revenue) OVER (ORDER BY month) AS abs_change,
  ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
  / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 2) AS pct_change
FROM monthly ORDER BY month;

-- Q8: Deduplication
WITH latest AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY id ORDER BY inserted_at DESC) AS rn
  FROM orders
)
SELECT * FROM latest WHERE rn = 1;

-- Q9: Top 3 products per category
WITH product_revenue AS (
  SELECT p.category, p.name,
    SUM(oi.quantity * oi.unit_price) AS total_revenue
  FROM order_items oi JOIN products p ON oi.product_id = p.id
  GROUP BY p.category, p.id, p.name
),
ranked AS (
  SELECT *, DENSE_RANK() OVER (PARTITION BY category ORDER BY total_revenue DESC) AS rnk
  FROM product_revenue
)
SELECT category, name, total_revenue, rnk
FROM ranked WHERE rnk <= 3
ORDER BY category, rnk;

-- Q10: Customer event summary
SELECT customer_id,
  MIN(event_date) AS first_event,
  MAX(event_date) AS last_event,
  COUNT(*) AS total_events,
  COUNT(DISTINCT event_type) AS distinct_event_types,
  CASE WHEN MAX(event_date) >= CURRENT_DATE - 30 THEN 1 ELSE 0 END AS active_last_30_days
FROM customer_events
GROUP BY customer_id
ORDER BY last_event DESC;
```

---

## 📋 Scoring

| Score | Result | What to Do Next |
|---|---|---|
| 9-10 correct | Interview ready | Apply to jobs. You are prepared. |
| 7-8 correct | Nearly there | Review the questions missed. One more week of practice. |
| 5-6 correct | Getting there | Review Days 10-14 (window functions and CTEs). Redo the mock in 3 days. |
| Under 5 | Keep going | Review Days 5-10 thoroughly. Focus on GROUP BY, JOINs, and window functions. |

---

## ✅ 30-Day Journey Complete

By Day 30 I can handle any SQL question in a Data Engineer interview. The patterns that come up most in real DE work: CTEs, deduplication with ROW_NUMBER, COALESCE for NULLs, PIVOT with CASE + GROUP BY, and window functions.

> 💡 The single best thing to do after Day 30: open LeetCode, pick a Medium SQL problem I have not seen, and solve it without looking anything up. If I can solve 5 Medium LeetCode SQL problems in a row without help, I am interview-ready.

</div>
</div>