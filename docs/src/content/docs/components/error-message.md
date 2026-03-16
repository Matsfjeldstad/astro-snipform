---
title: ErrorMessage
description: Displays a validation error message for a specific field.
---

`<ErrorMessage>` renders a hidden element that becomes visible when a field fails validation. Use it alongside [`<Input>`](/components/input/), [`<Textarea>`](/components/textarea/), or [`<Select>`](/components/select/) when you want full control over error message placement.

```astro
---
import { Input, ErrorMessage } from 'astro-snipform/components';
---

<Input name="email" type="email" validate={{ required: 'Required', email: 'Invalid' }} />
<ErrorMessage field="email" class="text-red-500 text-sm mt-1" />
```

## Props

| Prop       | Type      | Default  | Description                                                   |
| ---------- | --------- | -------- | ------------------------------------------------------------- |
| `field`    | `string`  | required | The name of the field to watch for errors                     |
| `as`       | `string`  | `'span'` | HTML element to render                                        |
| `visible`  | `boolean` | `false`  | Keep the element visible at all times — skips `display: none` |
| `showOnly` | `boolean` | `false`  | Show the element on error without injecting the error text    |
| `text`     | `string`  | —        | Set a fixed custom error text (overrides the rule's message)  |
| `class`    | `string`  | —        | CSS class applied when the field has an error                 |
| `style`    | `string`  | —        | Inline style applied when the field has an error              |

## `visible`

By default the element is hidden with `display: none` until an error occurs. Pass `visible` to always render it in the layout (e.g. to reserve space):

```astro
<ErrorMessage field="email" visible class="text-red-500 text-sm" />
```

## `showOnly`

Show the element on error without replacing its text content. Useful when you want to style a custom element rather than display a message:

```astro
<ErrorMessage field="email" showOnly>
  <svg><!-- error icon --></svg>
</ErrorMessage>
```
