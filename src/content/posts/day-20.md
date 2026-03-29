---
title: "Day 20 Review - The 20-Query Challenge"
meta_title: "SQL Day 20 - Full Review, 20-Query Challenge, LeetCode Progress Check"
description: "Review day. Writing 20 queries from memory covering every major pattern from Days 1 through 19. No new concepts today, just proving I can write every pattern without looking at notes."
date: 2025-08-20
image: "/images/posts/day-20.jpg"
categories: ["fundamentals"]
tags: ["review", "challenge", "SELECT", "JOIN", "CTE", "window functions", "deduplication"]
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

## 🎯 Goal: Prove I can write every pattern from memory

---

## 📋 How I Used Today

No new concepts today. The goal is to write 20 queries from scratch, one covering each major pattern from Days 1 through 19. I tried each query from memory before checking the answer. Timed myself and aimed for under 3 minutes per query.

Setting up a fresh environment at [SQLiteOnline.com](https://sqliteonline.com):

```sql
CREATE TABLE employees (
  id INTEGER PRIMARY KEY, name TEXT, dept TEXT, salary INTEGER, hire_date TEXT, manager_id INTEGER
);
INSERT INTO employees VALUES
  (1,'Sarah Khan','Engineering',95000,'2021-03-15',NULL),
  (2,'James Obi','Marketing',72000,'2020-07-01',NULL),
  (3,'Priya Nair','Engineering',102000,'2019-11-20',1),
  (4,'Tom Reyes','HR',68000,'2022-01-10',1),
  (5,'Liu Wei','Engineering',88000,'2022-06-05',1),
  (6,'Ana Costa','Marketing',75000,'2021-09-14',2),
  (7,'Ravi Das','Engineering',NULL,'2023-01-01',1);

CREATE TABLE orders (id INTEGER PRIMARY KEY, emp_id INTEGER, amount REAL, order_date TEXT);
INSERT INTO orders VALUES
  (1,1,1200.00,'2024-01-15'),(2,1,350.00,'2024-02-01'),
  (3,2,750.00,'2024-01-20'),(4,3,2200.00,'2024-02-15'),
  (5,5,180.00,'2024-03-01'),(6,1,95.00,'2024-03-10');
```

---

## 📋 The 20 Queries

**Query 1 - SELECT**: Show name, dept, and monthly salary (salary/12 rounded to 2 dp), sorted by monthly salary descending

**Query 2 - WHERE**: Find all Engineering employees earning more than 85000

**Query 3 - LIKE + NULL**: Find employees whose name contains 'a' and have a NULL salary

**Query 4 - CASE**: Add a column 'band': 'Senior' if salary > 95000, 'Mid' if 70000-95000, 'Junior' otherwise

**Query 5 - AGGREGATE**: Show total payroll, average salary, and headcount per department

**Query 6 - HAVING**: Show only departments where total payroll exceeds 200000

**Query 7 - SUBQUERY**: Find employees who earn more than the company average salary

**Query 8 - INNER JOIN**: Show each order with the employee name and department

**Query 9 - LEFT JOIN**: Show all employees and their total order amount, include employees with no orders (show 0)

**Query 10 - SELF JOIN**: Show each employee and their manager's name

**Query 11 - UNION**: Combine all Engineering employees and all employees earning over 90000 (no duplicates)

**Query 12 - WINDOW RANK**: Rank employees by salary within each department

**Query 13 - LAG**: Show each employee, their hire date, the previous hire date, and days between hires

**Query 14 - CTE**: Using a CTE, find the top earner in each department

**Query 15 - MULTI CTE**: Using two CTEs, find dept averages then find employees above their dept average

**Query 16 - NULL HANDLING**: Show all employees, replace NULL salary with 0 using COALESCE, show salary_status as 'Unknown' or 'Known'

**Query 17 - DEDUPLICATION**: Show only the most recent order per employee

**Query 18 - PIVOT**: Show total order amount per employee as columns: emp_id, jan_total, feb_total, mar_total

**Query 19 - RUNNING TOTAL**: Show each order with a running total of all amounts ordered by date

**Query 20 - FULL PIPELINE**: Using a CTE, find the department with the highest average order amount per employee

---

## 📋 Reference Answers

```sql
-- Query 1
SELECT name, dept, ROUND(salary/12.0, 2) AS monthly_salary
FROM employees ORDER BY monthly_salary DESC;

-- Query 2
SELECT * FROM employees WHERE dept = 'Engineering' AND salary > 85000;

-- Query 3
SELECT name FROM employees WHERE LOWER(name) LIKE '%a%' AND salary IS NULL;

-- Query 4
SELECT name, salary,
  CASE WHEN salary > 95000 THEN 'Senior'
       WHEN salary >= 70000 THEN 'Mid'
       ELSE 'Junior' END AS band
FROM employees;

-- Query 5
SELECT dept, SUM(salary) AS payroll, ROUND(AVG(salary),0) AS avg_sal, COUNT(*) AS headcount
FROM employees GROUP BY dept;

-- Query 6
SELECT dept, SUM(salary) AS payroll FROM employees
GROUP BY dept HAVING SUM(salary) > 200000;

-- Query 7
SELECT name, salary FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Query 8
SELECT e.name, e.dept, o.amount, o.order_date
FROM employees e INNER JOIN orders o ON e.id = o.emp_id;

-- Query 9
SELECT e.name, COALESCE(SUM(o.amount), 0) AS total_orders
FROM employees e LEFT JOIN orders o ON e.id = o.emp_id
GROUP BY e.id, e.name ORDER BY total_orders DESC;

-- Query 10
SELECT e.name AS employee, COALESCE(m.name, 'No Manager') AS manager
FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;
```

```sql
-- Query 11
SELECT name, dept FROM employees WHERE dept = 'Engineering'
UNION
SELECT name, dept FROM employees WHERE salary > 90000;

-- Query 12
SELECT name, dept, salary,
  RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS dept_rank
FROM employees;

-- Query 13
SELECT name, hire_date,
  LAG(hire_date) OVER (ORDER BY hire_date) AS prev_hire,
  JULIANDAY(hire_date) - JULIANDAY(LAG(hire_date) OVER (ORDER BY hire_date)) AS days_between
FROM employees ORDER BY hire_date;

-- Query 14
WITH ranked AS (
  SELECT *, RANK() OVER (PARTITION BY dept ORDER BY salary DESC) AS rnk
  FROM employees
)
SELECT name, dept, salary FROM ranked WHERE rnk = 1;

-- Query 15
WITH dept_avg AS (
  SELECT dept, AVG(salary) AS avg_sal FROM employees GROUP BY dept
),
above_avg AS (
  SELECT e.* FROM employees e JOIN dept_avg d ON e.dept = d.dept WHERE e.salary > d.avg_sal
)
SELECT name, dept, salary FROM above_avg;

-- Query 16
SELECT name, COALESCE(salary, 0) AS salary,
  CASE WHEN salary IS NULL THEN 'Unknown' ELSE 'Known' END AS salary_status
FROM employees;

-- Query 17
WITH latest AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY emp_id ORDER BY order_date DESC) AS rn
  FROM orders
)
SELECT id, emp_id, amount, order_date FROM latest WHERE rn = 1;

-- Query 18
SELECT emp_id,
  SUM(CASE WHEN STRFTIME('%m',order_date)='01' THEN amount ELSE 0 END) AS jan_total,
  SUM(CASE WHEN STRFTIME('%m',order_date)='02' THEN amount ELSE 0 END) AS feb_total,
  SUM(CASE WHEN STRFTIME('%m',order_date)='03' THEN amount ELSE 0 END) AS mar_total
FROM orders GROUP BY emp_id;

-- Query 19
SELECT id, emp_id, amount, order_date,
  SUM(amount) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM orders ORDER BY order_date;

-- Query 20
WITH emp_orders AS (
  SELECT e.dept, e.id, COALESCE(SUM(o.amount),0) AS total_orders
  FROM employees e LEFT JOIN orders o ON e.id = o.emp_id GROUP BY e.dept, e.id
),
dept_avg AS (
  SELECT dept, ROUND(AVG(total_orders),2) AS avg_orders_per_emp FROM emp_orders GROUP BY dept
)
SELECT dept, avg_orders_per_emp,
  RANK() OVER (ORDER BY avg_orders_per_emp DESC) AS rank
FROM dept_avg ORDER BY rank;
```

---

## 📋 LeetCode Progress Check - Day 20 Target

| Difficulty | Target by Day 20 | Key Problems |
|---|---|---|
| Easy | 20+ solved | #175, #176, #182, #183, #184, #196, #197, #511, #584, #595, #1068, #1148, #1179, #1484, #1527, #1667, #1683, #1757, #1795 |
| Medium | 8+ solved | #178, #180, #185, #262, #570, #1084, #1193, #1204, #1321, #1341 |
| Hard | 1+ attempted | #185 harder version, #601, #1767 |

---

## ✅ Days 1-20 Complete

By the end of today I know every pattern needed to pass a SQL interview at most Data Engineer roles. Days 21-30 are about speed and confidence. Same patterns, but faster and under pressure.

The patterns that come up most in real DE work: CTEs, deduplication with ROW_NUMBER, COALESCE for NULLs, PIVOT with CASE + GROUP BY, and window functions. Worth drilling these until they feel completely automatic.

> 💡 **TIP**: The single best thing to do after Day 20 is open LeetCode, pick a Medium SQL problem I have not seen, and solve it without looking anything up. If I can solve 5 Medium LeetCode SQL problems in a row without help, I am interview-ready.

</div>
</div>