---
title: SubmitButton
description: Submit button with loading and submission state directives.
---

`<SubmitButton>` renders a `<button type="submit">` with directives that respond to form submission state.

```astro
---
import { SubmitButton } from 'astro-snipform/components';
---

<SubmitButton onSubmitText="Sending..." onSubmitClass="opacity-50 cursor-wait">
  Send Message
</SubmitButton>
```

## Props

| Prop            | Type      | Description                                   |
| --------------- | --------- | --------------------------------------------- |
| `onSubmitShow`  | `boolean` | Show this element when the form is submitting |
| `onSubmitHide`  | `boolean` | Hide this element when the form is submitting |
| `onSubmitText`  | `string`  | Replace the button text during submission     |
| `onSubmitClass` | `string`  | Add a CSS class during submission             |
| `onSubmitStyle` | `string`  | Add an inline style during submission         |

Also accepts all standard HTML `<button>` attributes.

## Example with Loading State

```astro
<SubmitButton
  onSubmitText="Sending..."
  onSubmitClass="opacity-50 cursor-not-allowed"
  onSubmitStyle="pointer-events: none"
>
  Send
</SubmitButton>
```
