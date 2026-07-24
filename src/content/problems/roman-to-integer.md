---
title: "Roman to Integer"
slug: "roman-to-integer"
date: 2025-07-26
difficulty: "Easy"
tags: ["strings", "hash tables", "linear scan"]
leetcode: "https://leetcode.com/problems/roman-to-integer/"
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

✅ Problem: **Roman to Integer**

Roman numerals are represented by seven different symbols:

| Symbol | Value |
|--------|-------|
| I      | 1     |
| V      | 5     |
| X      | 10    |
| L      | 50    |
| C      | 100   |
| D      | 500   |
| M      | 1000  |

Roman numerals are usually written from largest to smallest from left to right. However, in some cases, smaller numbers precede larger ones to indicate subtraction (e.g., IV = 4, IX = 9).

**Examples:**

- Input: `s = "III"`  
  Output: `3`

- Input: `s = "LVIII"`  
  Output: `58`

- Input: `s = "MCMXCIV"`  
  Output: `1994`

**Constraints:**
- `1 <= s.length <= 15`
- `s` is a valid Roman numeral between 1 and 3999

---

## 🧠 Problem Explanation

We traverse the Roman numeral string from left to right:
- Normally we **add** each value.
- But if a symbol is **smaller than the one after it**, we subtract it instead.
- This logic handles all special subtractive cases like `IV`, `IX`, `XL`, `XC`, `CD`, and `CM`.

---

## 💡 Approach

- Use a dictionary to map each Roman symbol to its integer value.
- Scan the string from left to right.
- For each character:
  - If it is **smaller than the next one**, subtract its value.
  - Otherwise, add its value.
- The check `i < n-1` prevents out-of-range errors when looking ahead.

---

## 🧾 Pseudocode
```yaml
function: romanToInt
params:
  - s: str
logic:
  - map roman numerals to integers
  - initialize i = 0, sum = 0
  - while i < len(s):
      - if i < len(s)-1 and value[s[i]] < value[s[i+1]]:
          - add (value[s[i+1]] - value[s[i]]) to sum
          - increment i by 2
      - else:
          - add value[s[i]] to sum
          - increment i by 1
  - return sum
```

---

## ✅ Code

```python
d = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
i = 0
n = len(s)
summ = 0

while i < n:
    if i < n-1 and d[s[i]] < d[s[i+1]]:
        summ += d[s[i+1]] - d[s[i]]
        i += 2
    else:
        summ += d[s[i]]
        i += 1

return summ
```

---

## 📊 Complexities

- **Time Complexity:** `O(n)`, where `n` is the length of the string `s`
- **Space Complexity:** `O(1)`, the dictionary is a fixed size

---

## 📝 Notes

- **Pattern Used:** Linear Scan + HashMap
- **Insights:**
  - Roman numerals are additive by default.
  - Subtractive cases occur when a smaller value precedes a larger one.
  - `i < n-1` is critical to avoid index out-of-range errors when comparing with the next character.
  - Always: *If left < right, then subtract and skip two steps; else add and move to next.*

</div>
</div>