---
title: "LeetCode Medium Part 2 and First Hard Problem"
meta_title: "SQL Day 23 - LeetCode Medium, Hard Intro, Relational Division, Gaps and Islands"
description: "Finishing the Medium list and attempting the first Hard problem. Covers the rolling window pattern, two CTEs plus UNION, relational division, and the gaps and islands trick for consecutive rows."
date: 2025-08-23
image: "/images/posts/day-23.jpg"
categories: ["leetcode"]
tags: ["LeetCode", "rolling window", "relational division", "gaps and islands", "hard", "medium"]
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

## 🎯 Goal: Finish the Medium list and attempt my first Hard problem

---

## 📋 Remaining Medium Problems

**#1321: Restaurant Growth - Rolling Window**

```sql
WITH daily AS (
  SELECT visited_on, SUM(amount) AS day_total
  FROM Customer
  GROUP BY visited_on
),
rolling AS (
  SELECT visited_on,
    SUM(day_total) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS amount,
    COUNT(*) OVER (ORDER BY visited_on ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS days_count
  FROM daily
)
SELECT visited_on,
  amount,
  ROUND(amount / 7.0, 2) AS average_amount
FROM rolling
WHERE days_count = 7
ORDER BY visited_on;
```

**#1341: Movie Rating - Two CTEs + UNION**

```sql
WITH top_user AS (
  SELECT u.name AS results
  FROM MovieRating mr JOIN Users u ON mr.user_id = u.user_id
  GROUP BY mr.user_id
  ORDER BY COUNT(*) DESC, u.name ASC
  LIMIT 1
),
top_movie AS (
  SELECT m.title AS results
  FROM MovieRating mr JOIN Movies m ON mr.movie_id = m.movie_id
  WHERE mr.created_at BETWEEN '2020-02-01' AND '2020-02-29'
  GROUP BY mr.movie_id
  ORDER BY AVG(mr.rating) DESC, m.title ASC
  LIMIT 1
)
SELECT results FROM top_user
UNION ALL
SELECT results FROM top_movie;
```

**#1045: Customers Who Bought All Products - Relational Division**

```sql
SELECT customer_id
FROM Customer
GROUP BY customer_id
HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);
```

> 🎯 **INTERVIEW PATTERN**: The relational division pattern is a classic interview question. `GROUP BY + HAVING COUNT(DISTINCT x) = (SELECT COUNT(*) FROM full_list)` means the customer's distinct purchases equal the total number of products. This same pattern works for: employees who worked every day, students who passed every exam, users who visited every page.

---

## 🔴 First Hard Problem: #601 Human Traffic of Stadium

Hard problems combine 3 or more patterns. The trick here is not to be intimidated. Break it down first.

**Problem**: Find rows where 3 or more consecutive IDs all have people >= 100.

```sql
WITH filtered AS (
  SELECT id, visit_date, people,
    id - ROW_NUMBER() OVER (ORDER BY id) AS grp
  FROM Stadium
  WHERE people >= 100
),
groups AS (
  SELECT grp, COUNT(*) AS grp_size
  FROM filtered
  GROUP BY grp
  HAVING COUNT(*) >= 3
)
SELECT f.id, f.visit_date, f.people
FROM filtered f
JOIN groups g ON f.grp = g.grp
ORDER BY f.visit_date;
```

> 🔑 **KEY CONCEPT**: The key insight is that `id - ROW_NUMBER()` gives the same value for consecutive IDs. If IDs are 3, 4, 5 and ROW_NUMBERs are 1, 2, 3 then id - rn = 2, 2, 2 — same group. If there is a gap (e.g. 3, 4, 7) then 7 - 3 = 4, which is different — new group. This is the fundamental gaps and islands trick.

---

## 🔴 #185 Revisited - Handling Ties Correctly

Making sure ties are handled right. If two people tie for 2nd, both appear and no 3rd exists. DENSE_RANK handles this correctly.

```sql
WITH ranked AS (
  SELECT
    e.name, e.salary, d.name AS dept,
    DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rnk
  FROM Employee e
  JOIN Department d ON e.departmentId = d.id
)
SELECT dept AS Department, name AS Employee, salary AS Salary
FROM ranked
WHERE rnk <= 3;
```

---

## ✏️ Practice

1. Solve #1045 using the relational division pattern
2. Attempt #601 without looking at the solution first
3. Write the relational division pattern for a new scenario: find employees who worked on ALL projects
4. Solve #1321 Restaurant Growth using the rolling 7-day window

---

## ✅ What I Did Today

- ✔ Completed the Medium LeetCode list
- ✔ Understood the relational division pattern (GROUP BY + HAVING COUNT DISTINCT = total)
- ✔ Attempted first Hard problem (#601)
- ✔ Understood the gaps and islands trick: id - ROW_NUMBER() = same value for consecutive rows

---

## 🟡 LeetCode - Day 23

**Target: 6 more Medium + 1 Hard solved.** Priority: #1321, #1341, #1045, #1393, #1211 + #601. Running total aim: 35+ problems solved.

</div>
</div>