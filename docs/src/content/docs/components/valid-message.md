---
title: ValidMessage
description: Displays content when a field passes validation.
---

`<ValidMessage>` shows or modifies an element when a field's value is valid. It is the counterpart to [`<ErrorMessage>`](/components/error-message/).

```astro
---
import { Input, ValidMessage } from 'astro-snipform/components';
---

<Input name="email" type="email" validate={{ required: 'Required', email: 'Invalid' }} />
<ValidMessage field="email" class="text-green-500 text-sm">Looks good!</ValidMessage>
```

## Props

| Prop    | Type      | Default  | Description                                  |
| ------- | --------- | -------- | -------------------------------------------- |
| `field` | `string`  | required | The name of the field to watch               |
| `as`    | `string`  | `'span'` | HTML element to render                       |
| `show`  | `boolean` | —        | Show the element when the field is valid     |
| `hide`  | `boolean` | —        | Hide the element when the field is valid     |
| `text`  | `string`  | —        | Set custom text when the field is valid      |
| `class` | `string`  | —        | CSS class applied when the field is valid    |
| `style` | `string`  | —        | Inline style applied when the field is valid |
