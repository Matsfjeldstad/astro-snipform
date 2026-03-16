# astro-snipform

![astro-snipform](https://raw.githubusercontent.com/Matsfjeldstad/astro-snipform/master/public/astro-snipform.jpg)

Typesafe Astro integration and components for [SnipForm](https://snipform.io) — directive-driven form backend for static sites.

## Installation

```bash
npm install astro-snipform
```

## Setup

Add the integration to your Astro config:

```ts
// astro.config.mjs
import { defineConfig } from "astro/config";
import snipform from "astro-snipform";

export default defineConfig({
  integrations: [snipform()],
});
```

This automatically injects the SnipForm CDN script on all pages.

### Integration Options

| Option            | Type      | Default               | Description                                                                  |
| ----------------- | --------- | --------------------- | ---------------------------------------------------------------------------- |
| `cdnUrl`          | `string`  | Official SnipForm CDN | Override the CDN URL                                                         |
| `scriptInjection` | `boolean` | `true`                | Set to `false` to disable auto-injection and use `<SnipFormScript>` per-page |

```ts
snipform({
  scriptInjection: false, // manually control which pages load the script
});
```

## Components

Import components from `astro-snipform/components`:

```astro
---
import { SnipForm, Field, Input, Textarea, Select, ErrorMessage, ValidMessage, SubmitButton, SuccessContent, SnipFormScript } from 'astro-snipform/components';
---
```

### `<SnipForm>`

Form container. Wraps your form fields and connects to the SnipForm backend.

| Prop          | Type                | Description                                        |
| ------------- | ------------------- | -------------------------------------------------- | --------------------------------------------- |
| `key`         | `string` (required) | Your form's unique key from the SnipForm dashboard |
| `transition`  | `number             | 'none'`                                            | Fade transition duration in ms (default: 150) |
| `mode`        | `'test'`            | Enable test mode — form won't actually submit      |
| `readability` | `false`             | Disable the readability directive parser           |
| `namespace`   | `false`             | Disable the namespace directive parser             |
| `shorthand`   | `false`             | Disable the shorthand directive parser             |

```astro
<SnipForm key="your-form-key">
  <!-- form fields here -->
</SnipForm>
```

### `<Field>`

Compound component that renders an input element with validation and an auto-hidden error message.

| Prop                | Type                | Description                                                       |
| ------------------- | ------------------- | ----------------------------------------------------------------- | ----------- | --------------------------------- |
| `name`              | `string` (required) | Field name (used for input name attr and error binding)           |
| `validate`          | `ValidateProp`      | Validation rules (see [Validation](#validation))                  |
| `as`                | `'input'            | 'select'                                                          | 'textarea'` | Element type (default: `'input'`) |
| `errorMessageClass` | `string`            | CSS class for the auto-generated error message span               |
| `hideError`         | `boolean`           | Suppress built-in error element (use standalone `<ErrorMessage>`) |
| `errorClass`        | `string`            | CSS class added to the input on error                             |
| `errorStyle`        | `string`            | Inline style added to the input on error                          |
| `validClass`        | `string`            | CSS class added to the input when valid                           |
| `validStyle`        | `string`            | Inline style added to the input when valid                        |

```astro
<Field
  name="email"
  type="email"
  validate={{ required: 'Enter your email', email: 'Invalid email' }}
  errorClass="border-red-500"
  validClass="border-green-500"
/>

<Field name="role" as="select" validate={{ required: 'Pick a role' }}>
  <option value="">Select...</option>
  <option value="dev">Developer</option>
  <option value="design">Designer</option>
</Field>
```

### `<Input>`

Standalone input element with validation and state styling (no built-in error message).

| Prop         | Type           | Description                   |
| ------------ | -------------- | ----------------------------- |
| `validate`   | `ValidateProp` | Validation rules              |
| `errorClass` | `string`       | CSS class added on error      |
| `errorStyle` | `string`       | Inline style added on error   |
| `validClass` | `string`       | CSS class added when valid    |
| `validStyle` | `string`       | Inline style added when valid |

Also accepts all standard HTML `<input>` attributes.

```astro
<Input name="email" type="email" validate={{ required: 'Required', email: 'Invalid' }} />
```

### `<Textarea>`

Same props as `<Input>`, renders a `<textarea>`.

```astro
<Textarea name="message" validate={{ required: 'Please enter a message' }} />
```

### `<Select>`

Same props as `<Input>`, renders a `<select>`.

```astro
<Select name="country" validate="required">
  <option value="">Choose...</option>
  <option value="us">United States</option>
</Select>
```

### `<ErrorMessage>`

Displays a validation error message for a specific field. Hidden by default, shown when the field has an error.

| Prop       | Type      | Default    | Description                                             |
| ---------- | --------- | ---------- | ------------------------------------------------------- |
| `field`    | `string`  | (required) | The field name to watch                                 |
| `as`       | `string`  | `'span'`   | HTML element to render                                  |
| `visible`  | `boolean` | `false`    | Keep element visible at all times (skip `display:none`) |
| `showOnly` | `boolean` | `false`    | Show element without injecting error text               |
| `text`     | `string`  |            | Set custom text on error                                |
| `class`    | `string`  |            | CSS class added on error                                |
| `style`    | `string`  |            | Inline style added on error                             |

```astro
<ErrorMessage field="email" class="text-red-500 text-sm" />
```

### `<ValidMessage>`

Displays content when a field passes validation.

| Prop    | Type      | Default    | Description                      |
| ------- | --------- | ---------- | -------------------------------- |
| `field` | `string`  | (required) | The field name to watch          |
| `as`    | `string`  | `'span'`   | HTML element to render           |
| `show`  | `boolean` |            | Show element when field is valid |
| `hide`  | `boolean` |            | Hide element when field is valid |
| `text`  | `string`  |            | Set custom text when valid       |
| `class` | `string`  |            | CSS class added when valid       |
| `style` | `string`  |            | Inline style added when valid    |

```astro
<ValidMessage field="email" class="text-green-500 text-sm">Looks good!</ValidMessage>
```

### `<SubmitButton>`

Submit button with loading/submission state directives.

| Prop            | Type      | Description                         |
| --------------- | --------- | ----------------------------------- |
| `onSubmitShow`  | `boolean` | Show this element during submission |
| `onSubmitHide`  | `boolean` | Hide this element during submission |
| `onSubmitText`  | `string`  | Set text during submission          |
| `onSubmitClass` | `string`  | Add CSS class during submission     |
| `onSubmitStyle` | `string`  | Add inline style during submission  |

```astro
<SubmitButton onSubmitText="Sending..." onSubmitClass="opacity-50 cursor-wait">
  Send Message
</SubmitButton>
```

### `<SuccessContent>`

Content shown after a successful form submission. Hidden by default.

```astro
<SuccessContent>
  <p>Thanks! We'll be in touch.</p>
</SuccessContent>
```

### `<SnipFormScript>`

Standalone script tag for the SnipForm CDN. Use when `scriptInjection: false` is set in the integration options.

| Prop  | Type     | Default               | Description      |
| ----- | -------- | --------------------- | ---------------- |
| `src` | `string` | Official SnipForm CDN | CDN URL override |

```astro
<SnipFormScript />
```

## Validation

The `validate` prop accepts multiple formats:

```astro
<!-- Single rule -->
<Input name="name" validate="required" />

<!-- Multiple rules (array) -->
<Input name="age" validate={['required', 'integer']} />

<!-- Object map with custom messages -->
<Input name="email" validate={{ required: 'Email is required', email: 'Invalid email format' }} />

<!-- Parameterized rules -->
<Input name="age" validate={{ required: 'Required', 'between[18,99]': 'Must be 18-99' }} />
```

### Available Rules

**Simple rules:** `required`, `email`, `url`, `active_url`, `boolean`, `accepted`, `numeric`, `integer`, `alpha`, `alpha_num`, `alpha_dash`, `date`, `ip`, `ipv4`, `ipv6`, `uuid`

**Parameterized rules:** `max[n]`, `min[n]`, `between[n,m]`, `min_length[n]`, `max_length[n]`, `starts_with[str]`, `ends_with[str]`, `doesnt_start_with[str]`, `doesnt_end_with[str]`, `in[a,b,c]`, `not_in[a,b,c]`, `after[date]`, `before[date]`, `after_or_equal[date]`, `before_or_equal[date]`, `date_equals[date]`, `same[field]`, `different[field]`, `gt[field]`, `gte[field]`, `lt[field]`, `lte[field]`

## Full Example

```astro
---
import { SnipForm, Field, SubmitButton, SuccessContent } from 'astro-snipform/components';
---

<SnipForm key="contact-form">
  <Field
    name="name"
    type="text"
    placeholder="Your name"
    validate={{ required: 'Name is required' }}
    errorClass="border-red-500"
  />

  <Field
    name="email"
    type="email"
    placeholder="your@email.com"
    validate={{ required: 'Email is required', email: 'Invalid email' }}
    errorClass="border-red-500"
  />

  <Field
    name="message"
    as="textarea"
    placeholder="Your message"
    validate={{ required: 'Message is required', 'min_length[10]': 'At least 10 characters' }}
    errorClass="border-red-500"
  />

  <SubmitButton onSubmitText="Sending..." onSubmitClass="opacity-50">
    Send
  </SubmitButton>

  <SuccessContent>
    <p>Thanks for reaching out! We'll get back to you soon.</p>
  </SuccessContent>
</SnipForm>
```

## License

MIT
