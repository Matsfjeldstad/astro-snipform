---
title: Simple Rules
description: Validation rules that require no parameters.
---

Simple rules are single keywords with no arguments. Pass them as strings in any [validate prop format](/validation/overview/).

```astro
<Input name="email" validate={['required', 'email']} />
```

## Available Rules

| Rule         | Description                                                                   |
| ------------ | ----------------------------------------------------------------------------- |
| `required`   | Value must not be empty                                                       |
| `email`      | Must be a valid email address                                                 |
| `url`        | Must be a valid URL                                                           |
| `active_url` | Must be a reachable URL                                                       |
| `boolean`    | Must be a boolean-like value (`true`, `false`, `1`, `0`, `"true"`, `"false"`) |
| `accepted`   | Must be accepted (`yes`, `on`, `1`, or `true`) — useful for checkboxes        |
| `numeric`    | Must be a numeric value                                                       |
| `integer`    | Must be an integer                                                            |
| `alpha`      | Must contain only alphabetic characters                                       |
| `alpha_num`  | Must contain only alphanumeric characters                                     |
| `alpha_dash` | Must contain only alphanumeric characters, dashes, and underscores            |
| `date`       | Must be a valid date                                                          |
| `ip`         | Must be a valid IP address (v4 or v6)                                         |
| `ipv4`       | Must be a valid IPv4 address                                                  |
| `ipv6`       | Must be a valid IPv6 address                                                  |
| `uuid`       | Must be a valid UUID                                                          |
