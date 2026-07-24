---
title: "Merge Strings Alternately"
slug: "merge-strings-alternately"
date: 2025-07-24
difficulty: "Easy"
tags: ["arrays", "strings", "two pointers"]
leetcode: "https://leetcode.com/problems/merge-strings-alternately/"
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

✅ Problem: **Merge Strings Alternately**

You are given two strings `word1` and `word2`. Merge them by alternating characters from each, starting with `word1`. If one string is longer, append the extra characters to the end of the merged result.

**Examples:**

- Input: `word1 = "abc"`, `word2 = "pqr"`  
  Output: `"apbqcr"`

- Input: `word1 = "ab"`, `word2 = "pqrs"`  
  Output: `"apbqrs"`

- Input: `word1 = "abcd"`, `word2 = "pq"`  
  Output: `"apbqcd"`

**Constraints:**
- `1 <= word1.length, word2.length <= 100`
- Both strings consist of lowercase English letters

---

## 🧠 Problem Explanation

We are to merge two strings in alternating fashion:
- Take one character from `word1`, then one from `word2`, and repeat.
- Once one string runs out, continue with the remaining characters of the other string.

---

## 💡 Approach

- Use two pointers `i` and `j` for `word1` and `word2`, respectively.
- Loop while both pointers are in range:
  - Append `word1[i]` and `word2[j]` alternately to a result list.
- After the main loop, append the remainder of the longer string.
- Join the list into a final string using `"".join()`.

---

## 🧾 Pseudocode
```yaml
function: mergeAlternately
params:
  - word1: str
  - word2: str
logic:
  - initialize i = 0, j = 0, result = []
  - while i < len(word1) and j < len(word2):
      - append word1[i] to result
      - append word2[j] to result
      - increment i and j
  - append remaining part of word1[i:] and word2[j:] to result
  - return ''.join(result)
```

## ✅ Code

```python
class Solution(object):
    def mergeAlternately(self, word1, word2):
        """
        :type word1: str
        :type word2: str
        :rtype: str
        """
        A = len(word1)
        B = len(word2)
        a, b = 0, 0
        word = 1
        s = []

        while a < A and b < B:
            if word == 1:
                s.append(word1[a])
                a += 1
                word = 2
            if word == 2:
                s.append(word2[b])
                b += 1
                word = 1

        while a < A:
            s.append(word1[a])
            a += 1

        while b < B:
            s.append(word2[b])
            b += 1

        return ''.join(s)
```

## 📊 Complexities

- **Time Complexity:** `O(n + m)` where `n = len(word1)` and `m = len(word2)`
- **Space Complexity:** `O(n + m)` for storing the merged result in a list

---

## 📝 Notes

- **Pattern Used:** Two Pointers, Alternating Merge
- **Insights:**
  - Using a toggle flag to switch between the two input strings helps keep the merge logic clean.
  - The use of `''.join()` avoids performance issues due to string immutability in Python.
  - This approach naturally handles uneven string lengths.

</div>
</div>