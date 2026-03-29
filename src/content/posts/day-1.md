---
title: "What Is Data, What Is a Database, and What Is SQL?"
meta_title: "SQL Day 1 - Databases, Relational vs NoSQL, First Query"
description: "Start from absolute zero. Understanding what databases are, the difference between relational and NoSQL, what SQL is, and running my very first SELECT query."
date: 2025-08-01
image: "/images/posts/day-1.jpg"
categories: ["fundamentals"]
tags: ["SELECT", "databases", "SQL basics"]
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

## 🎯 Goal: Understand the concepts before writing a single line of code

---

## 🗄️ What Is Data?

Data is just information. Your name is data. Your age is data. The price of a product is data. When you have millions of pieces of information, you need a structured way to store it, find it, and work with it. That is where databases come in.

---

## 🗄️ What Is a Database?

A database is an organized collection of data stored electronically. I like to think of it as a very powerful Excel file. But instead of one sheet with a few hundred rows, it can handle millions of rows across dozens of tables, all connected to each other.

> 🔑 **KEY CONCEPT**: A database is not software itself. The software that manages it is called a **Database Management System (DBMS)**. Examples: MySQL, PostgreSQL, SQLite, Snowflake.

---

## 🗄️ Relational vs Non-Relational Databases

This one is important to get right from the start.

| Type | Also Called | How Data Is Stored | Examples |
|---|---|---|---|
| Relational | SQL / RDBMS | Tables with rows and columns | MySQL, PostgreSQL, SQLite, Snowflake |
| Non-Relational | NoSQL | Documents, key-value, graphs | MongoDB, Redis, DynamoDB |

In a relational database, data lives in **tables**. Each table has columns (fields) and rows (records). Tables can be linked to each other. That is the "relational" part.

In NoSQL, data looks more like this:

```json
{
  "name": "Sarah Khan",
  "department": "Engineering",
  "skills": ["Python", "SQL", "Spark"]
}
```

Notice how it can have nested data and arrays. A regular table cannot do this easily. But NoSQL is not better than SQL, they are just different tools for different problems.

> 💡 **TIP**: As a Data Engineer, I will use both. SQL databases are the primary tool for analytics and warehousing. NoSQL comes up for real-time pipelines and flexible storage. SQL first.

---

## 🗄️ What Is SQL?

SQL stands for **Structured Query Language**. It is the language I use to talk to a relational database. Think of the database as a library and SQL as how I ask the librarian to find, add, update, or remove a book.

The four main things I can do in SQL:

| Operation | SQL Command | What It Does |
|---|---|---|
| Read | SELECT | Get data from tables |
| Create | INSERT | Add new data |
| Update | UPDATE | Change existing data |
| Delete | DELETE | Remove data |

These are called **CRUD** operations. As a Data Engineer I will mostly be using SELECT constantly, and INSERT/UPDATE when building pipelines.

> 🔑 **KEY CONCEPT**: SQL is not a general-purpose programming language like Python. It is specifically designed to work with data in tables. It has been around since the 1970s and is not going anywhere.

---

## ✏️ Setting Up

I do not need to install anything for now. Just opening [SQLiteOnline.com](https://sqliteonline.com) in the browser. Free and zero setup.

**Exercise 1.1 - First ever query:**

```sql
SELECT 'Hello, SQL World!';
```

Output: `Hello, SQL World!` — that is it. I just ran my first SQL query.

---

## ✏️ My First Real Table

```sql
-- Create a table called employees
CREATE TABLE employees (
  employee_id INTEGER,
  name TEXT,
  department TEXT,
  salary INTEGER,
  hire_date TEXT
);

-- Insert some rows
INSERT INTO employees VALUES (1, 'Sarah Khan', 'Engineering', 95000, '2021-03-15');
INSERT INTO employees VALUES (2, 'James Obi', 'Marketing', 72000, '2020-07-01');
INSERT INTO employees VALUES (3, 'Priya Nair', 'Engineering', 102000, '2019-11-20');
INSERT INTO employees VALUES (4, 'Tom Reyes', 'HR', 68000, '2022-01-10');
INSERT INTO employees VALUES (5, 'Liu Wei', 'Engineering', 88000, '2022-06-05');
INSERT INTO employees VALUES (6, 'Ana Costa', 'Marketing', 75000, '2021-09-14');

-- Read it back
SELECT * FROM employees;
```

The `--` lines are comments, SQL ignores them. `SELECT * FROM employees` means give me everything from the employees table. The `*` means all columns. I should see all 6 rows when I run this.

---

## ✅ What I Learned Today

- ✔ What a database is and why it exists
- ✔ The difference between SQL (relational) and NoSQL databases
- ✔ What SQL stands for and what it is used for
- ✔ How to create a table, insert data, and run a SELECT query

Tomorrow: going deeper into SELECT, the most important SQL command I will ever use.

---

## 🟡 LeetCode - Day 1

Just reading today, not solving yet. The goal is to understand that LeetCode SQL problems are just SELECT queries on given tables.

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 place-items-center">
  <a href="https://leetcode.com/problems/combine-two-tables/" target="_blank" class="w-60 h-18 block p-4 border border-gray-300 rounded-xl shadow-sm hover:shadow transition text-sm">
    <div class="font-medium text-blue-600">#175: Combine Two Tables</div>
    <div class="text-xs text-gray-500">Just read the problem today</div>
  </a>
</div>

</div>
</div>