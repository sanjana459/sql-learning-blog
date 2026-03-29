---
title: "Final Review - Weak Spots and Hard Problems"
meta_title: "SQL Day 29 - Self Assessment, Hard LeetCode, Speed Drills"
description: "Shoring up any remaining gaps before the mock interview. Self-assessment checklist of every pattern, Hard LeetCode problems combining 3+ concepts, and 10 speed drills to write from memory in under 2 minutes each."
date: 2025-08-29
image: "/images/posts/day-29.jpg"
categories: ["leetcode"]
tags: ["review", "hard", "LeetCode", "speed drills", "self assessment"]
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

## 🎯 Goal: Shore up any remaining gaps before the mock interview

---

## 📋 Self-Assessment Checklist

Before the mock interview, I am honestly checking which patterns I am least confident in.

| Pattern | Status | If Weak - Review |
|---|---|---|
| SELECT, WHERE, ORDER BY, LIMIT | Should be solid | Day 2-3 |
| GROUP BY + HAVING | Should be solid | Day 5 |
| INNER JOIN, LEFT JOIN | Should be solid | Day 7 |
| SELF JOIN | Check this | Day 8 |
| Subqueries: scalar, IN, EXISTS | Check this | Day 6 |
| CTEs: single and chained | Check this | Day 11 |
| Window functions: RANK, ROW_NUMBER, LAG | Check this | Day 10 |
| CASE WHEN | Should be solid | Day 4 |
| NULL handling: COALESCE, NULLIF | Check this | Day 13 |
| Deduplication pattern | Must know cold | Day 19 |
| Top N per group | Must know cold | Day 10, 22 |
| Running total | Check this | Day 14 |
| Month-over-month comparison | Check this | Day 26 |
| UNION, INTERSECT, EXCEPT | Should be solid | Day 9 |
| SCD Type 2 | Know conceptually | Day 24 |

---

## 🔴 Hard Problems to Attempt Today

**#262: Trips and Users - Complex multi-table filtering**

```sql
WITH unbanned_trips AS (
  SELECT t.*
  FROM Trips t
  JOIN Users u1 ON t.client_id = u1.users_id AND u1.banned = 'No'
  JOIN Users u2 ON t.driver_id = u2.users_id AND u2.banned = 'No'
  WHERE t.request_at BETWEEN '2013-10-01' AND '2013-10-03'
)
SELECT
  request_at AS Day,
  ROUND(SUM(CASE WHEN status != 'completed' THEN 1.0 ELSE 0 END) / COUNT(*), 2)
  AS 'Cancellation Rate'
FROM unbanned_trips
GROUP BY request_at
ORDER BY request_at;
```

**#1767: Find the Subtasks That Did Not Execute - Recursive CTE**

```sql
WITH RECURSIVE all_subtasks AS (
  SELECT task_id, 1 AS subtask_id
  FROM Tasks
  UNION ALL
  SELECT t.task_id, a.subtask_id + 1
  FROM Tasks t
  JOIN all_subtasks a ON t.task_id = a.task_id
  WHERE a.subtask_id < t.subtasks_count
)
SELECT a.task_id, a.subtask_id
FROM all_subtasks a
LEFT JOIN Executed e ON a.task_id = e.task_id AND a.subtask_id = e.subtask_id
WHERE e.subtask_id IS NULL
ORDER BY a.task_id, a.subtask_id;
```

---

## ⚡ Speed Drills - Write These in Under 2 Minutes Each

Without looking at notes, writing each of these from memory and timing myself.

1. Show the second highest salary from the employees table
2. Find all employees who earn above the average salary in their department
3. Show each employee and their manager name using a self JOIN
4. Find customers who placed orders in January but not February using EXCEPT
5. Deduplicate the employees table keeping the most recently updated record per employee_id
6. Show monthly total orders with month-over-month percentage change
7. Rank employees by salary within each department, show top 2 per department
8. Find all employees who have completed all assigned projects (relational division)
9. Calculate a 3-month rolling average of revenue
10. Show the running total of salary ordered by hire date

> 💡 **TIP**: If any of these take more than 2 minutes, review the corresponding section and try again. The goal is not perfection, it is fluency. I should be able to produce correct SQL for any of these within 2 minutes.

---

## ✅ What I Did Today

- ✔ Identified and reviewed any remaining weak spots using the checklist
- ✔ Attempted Hard LeetCode problems
- ✔ Completed 10 speed drills from memory
- ✔ Ready for the Day 30 mock interview

---

## 🟡 LeetCode - Day 29

Target: 55+ total problems solved. Solve at least 2 problems I have never seen before under timed conditions. Review any pattern where the speed drill took more than 2 minutes.

</div>
</div>