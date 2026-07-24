---
title: "Is Subsequence"
slug: "is-subsequence"
date: 2025-07-22
difficulty: "Easy"
tags: ["substrings", "two pointers"]
leetcode: "https://leetcode.com/problems/is-subsequence/"
---

<div class="max-w-none prose-tight">
  <style>
    hr {
      margin-top: 1.5rem;
      margin-bottom: 1.5rem;
    }
  </style>

<div class="prose prose-tight max-w-none">

## 📄 Problem Statement

✅ Problem: **Is Subsequence**

Given two strings `s` and `t`, return `true` if `s` is a **subsequence** of `t`, or `false` otherwise.

A **subsequence** of a string is formed by deleting some (or no) characters **without changing the order** of the remaining characters.

**Examples:**

- Input: `s = "abc"`, `t = "ahbgdc"`  
  Output: `true`

- Input: `s = "axc"`, `t = "ahbgdc"`  
  Output: `false`

**Constraints:**
- `0 <= s.length <= 100`
- `0 <= t.length <= 10^4`
- `s` and `t` consist only of lowercase English letters

---

## 🧠 Problem Explanation

We need to check if all characters in string `s` appear in string `t`, **in the same order**, possibly with other characters in between.

---

## 💡 Approach

- Use two pointers `i` for `t` and `j` for `s`.
- Move through both strings:
  - If characters match, advance both `i` and `j`.
  - If not, just advance `i` (keep looking in `t`).
- If `j` reaches the end of `s`, it means all characters of `s` were matched in `t`.

---

## 🧾 Pseudocode
```yaml
function: isSubsequence
params:
  - s: str
  - t: str
logic:
  - if s is empty: return True
  - if len(s) > len(t): return False
  - initialize i = 0, j = 0
  - while i < len(t):
      - if s[j] == t[i]:
          - increment j
          - if j == len(s): return True
      - increment i
  - return False
```
---

## ✅ Code
```python
class Solution(object):
    def isSubsequence(self, s, t):
        """
        :type s: str
        :type t: str
        :rtype: bool
        """
        J = len(s)
        I = len(t)
        i, j = 0, 0

        if s == '':
            return True

        if len(s) > len(t):
            return False

        while i < I:
            if s[j] == t[i]:
                if j == J - 1:
                    return True
                j += 1
            i += 1
        return False
```
---

## 📊 Complexities

- **Time Complexity:** `O(n)`, where `n = len(t)`
- **Space Complexity:** `O(1)`, just a couple of pointers

---

## 📝 Notes

- **Pattern Used:** Two Pointers
- **Insights:**
  - Always advance through `t`, matching characters with `s` as you go.
  - `j == len(s)` at the end means we found all characters of `s` in order inside `t`.
  - Edge case: an empty `s` is always a subsequence of any string `t`.

</div>
</div>
