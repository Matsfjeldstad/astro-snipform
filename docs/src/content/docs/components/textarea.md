---
title: Textarea
description: Standalone textarea element with validation and state styling.
---

`<Textarea>` renders a `<textarea>` element with the same validation and styling props as [`<Input>`](/components/input/).

```astro
---
import { Textarea } from 'astro-snipform/components';
---

<Textarea
  name="message"
  rows={5}
  placeholder="Your message"
  validate={{ required: 'Please enter a message', 'min_length[10]': 'At least 10 characters' }}
  errorClass="border-red-500"
/>
```

## Props

| Prop         | Type           | Description                                                         |
| ------------ | -------------- | ------------------------------------------------------------------- |
| `validate`   | `ValidateProp` | Validation rules. See [Validation Overview](/validation/overview/). |
| `errorClass` | `string`       | CSS class added when the field has an error                         |
| `errorStyle` | `string`       | Inline style added when the field has an error                      |
| `validClass` | `string`       | CSS class added when the field is valid                             |
| `validStyle` | `string`       | Inline style added when the field is valid                          |

Also accepts all standard HTML `<textarea>` attributes.
