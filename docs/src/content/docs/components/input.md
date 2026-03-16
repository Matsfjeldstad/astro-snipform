---
title: Input
description: Standalone input element with validation and state styling.
---

`<Input>` renders a standard `<input>` element with validation and conditional styling. Unlike [`<Field>`](/components/field/), it does not include a built-in error message — pair it with [`<ErrorMessage>`](/components/error-message/) if needed.

```astro
---
import { Input } from 'astro-snipform/components';
---

<Input
  name="email"
  type="email"
  validate={{ required: 'Required', email: 'Invalid email' }}
  errorClass="border-red-500"
  validClass="border-green-500"
/>
```

## Props

| Prop         | Type           | Description                                                         |
| ------------ | -------------- | ------------------------------------------------------------------- |
| `validate`   | `ValidateProp` | Validation rules. See [Validation Overview](/validation/overview/). |
| `errorClass` | `string`       | CSS class added to the input when it has an error                   |
| `errorStyle` | `string`       | Inline style added to the input when it has an error                |
| `validClass` | `string`       | CSS class added to the input when it is valid                       |
| `validStyle` | `string`       | Inline style added to the input when it is valid                    |

Also accepts all standard HTML `<input>` attributes (`name`, `type`, `placeholder`, `required`, etc.).
