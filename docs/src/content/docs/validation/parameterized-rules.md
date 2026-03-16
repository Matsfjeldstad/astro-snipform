---
title: Parameterized Rules
description: Validation rules that accept arguments in brackets.
---

Parameterized rules take arguments inside brackets: `rule[arg]` or `rule[arg1,arg2]`.

```astro
<Input name="age" validate={{ 'between[18,99]': 'Must be 18–99' }} />
<Input name="tags" validate={{ 'in[astro,next,nuxt]': 'Pick a valid framework' }} />
```

## Available Rules

### Numeric Range

| Rule           | Description                                                 |
| -------------- | ----------------------------------------------------------- |
| `max[n]`       | Value must be ≤ `n`                                         |
| `min[n]`       | Value must be ≥ `n`                                         |
| `between[n,m]` | Value must be between `n` and `m` (inclusive)               |
| `gt[field]`    | Value must be greater than the value of `field`             |
| `gte[field]`   | Value must be greater than or equal to the value of `field` |
| `lt[field]`    | Value must be less than the value of `field`                |
| `lte[field]`   | Value must be less than or equal to the value of `field`    |

### String Length

| Rule            | Description                            |
| --------------- | -------------------------------------- |
| `min_length[n]` | String must be at least `n` characters |
| `max_length[n]` | String must be at most `n` characters  |

### String Content

| Rule                     | Description               |
| ------------------------ | ------------------------- |
| `starts_with[str]`       | Must start with `str`     |
| `ends_with[str]`         | Must end with `str`       |
| `doesnt_start_with[str]` | Must not start with `str` |
| `doesnt_end_with[str]`   | Must not end with `str`   |

### Inclusion / Exclusion

| Rule            | Description                                 |
| --------------- | ------------------------------------------- |
| `in[a,b,c]`     | Value must be one of the listed options     |
| `not_in[a,b,c]` | Value must not be one of the listed options |

### Date Comparison

| Rule                    | Description                    |
| ----------------------- | ------------------------------ |
| `after[date]`           | Date must be after `date`      |
| `before[date]`          | Date must be before `date`     |
| `after_or_equal[date]`  | Date must be `date` or later   |
| `before_or_equal[date]` | Date must be `date` or earlier |
| `date_equals[date]`     | Date must equal `date`         |

### Field Comparison

| Rule               | Description                                                        |
| ------------------ | ------------------------------------------------------------------ |
| `same[field]`      | Value must match the value of `field` (e.g. password confirmation) |
| `different[field]` | Value must differ from the value of `field`                        |
