---
title: Field
description: Compound component that renders an input with built-in validation and error display.
---

`<Field>` is the recommended way to add form inputs. It renders an input element with validation and automatically attaches a hidden error message that appears on failure.

```astro
---
import { Field } from 'astro-snipform/components';
---

<Field
  name="email"
  type="email"
  validate={{ required: 'Enter your email', email: 'Invalid email' }}
  errorClass="border-red-500"
  validClass="border-green-500"
/>
```

## Props

| Prop                | Type                                | Default   | Description                                                                                                   |
| ------------------- | ----------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------- |
| `name`              | `string`                            | required  | Field name — used for the input `name` attribute and error binding                                            |
| `validate`          | `ValidateProp`                      | —         | Validation rules. See [Validation Overview](/validation/overview/).                                           |
| `as`                | `'input' \| 'select' \| 'textarea'` | `'input'` | Element type to render                                                                                        |
| `errorMessageClass` | `string`                            | —         | CSS class for the auto-generated error message element                                                        |
| `hideError`         | `boolean`                           | —         | Suppress the built-in error element — use a standalone [`<ErrorMessage>`](/components/error-message/) instead |
| `errorClass`        | `string`                            | —         | CSS class added to the input when it has an error                                                             |
| `errorStyle`        | `string`                            | —         | Inline style added to the input when it has an error                                                          |
| `validClass`        | `string`                            | —         | CSS class added to the input when it is valid                                                                 |
| `validStyle`        | `string`                            | —         | Inline style added to the input when it is valid                                                              |

`<Field>` also passes through all standard HTML attributes for the underlying element (`type`, `placeholder`, `required`, etc.).

## Rendering a Select

Pass `as="select"` and provide `<option>` elements as children:

```astro
<Field name="role" as="select" validate={{ required: 'Pick a role' }}>
  <option value="">Select...</option>
  <option value="dev">Developer</option>
  <option value="design">Designer</option>
</Field>
```

## Rendering a Textarea

```astro
<Field
  name="message"
  as="textarea"
  rows={5}
  validate={{ required: 'Message is required', 'min_length[10]': 'At least 10 characters' }}
/>
```

## Custom Error Display

By default `<Field>` renders a `<span>` for error messages. To use a standalone [`<ErrorMessage>`](/components/error-message/) component instead, pass `hideError`:

```astro
<Field name="email" type="email" validate="required|email" hideError />
<ErrorMessage field="email" class="text-red-500 text-sm mt-1" />
```
