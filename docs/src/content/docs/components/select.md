---
title: Select
description: Standalone select element with validation and state styling.
---

`<Select>` renders a `<select>` element with the same validation and styling props as [`<Input>`](/components/input/). Provide `<option>` elements as children.

```astro
---
import { Select } from 'astro-snipform/components';
---

<Select name="country" validate="required" errorClass="border-red-500">
  <option value="">Choose a country...</option>
  <option value="us">United States</option>
  <option value="gb">United Kingdom</option>
  <option value="ca">Canada</option>
</Select>
```

## Props

| Prop         | Type           | Description                                                         |
| ------------ | -------------- | ------------------------------------------------------------------- |
| `validate`   | `ValidateProp` | Validation rules. See [Validation Overview](/validation/overview/). |
| `errorClass` | `string`       | CSS class added when the field has an error                         |
| `errorStyle` | `string`       | Inline style added when the field has an error                      |
| `validClass` | `string`       | CSS class added when the field is valid                             |
| `validStyle` | `string`       | Inline style added when the field is valid                          |

Also accepts all standard HTML `<select>` attributes.
