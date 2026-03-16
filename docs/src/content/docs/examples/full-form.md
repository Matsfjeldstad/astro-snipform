---
title: Full Form Example
description: A complete contact form using all major astro-snipform components.
---

A complete contact form with name, email, message, submit button, and success state.

## Code

```astro
---
import {
  SnipForm,
  Field,
  SubmitButton,
  SuccessContent,
} from 'astro-snipform/components';
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

## What's Happening

- **`<SnipForm key="...">`** — Connects the form to your SnipForm endpoint using your form key.
- **`<Field as="input">`** (default) — Renders an `<input>` with inline validation and an auto-hidden error span.
- **`<Field as="textarea">`** — Same as above but renders a `<textarea>`.
- **`errorClass`** — Applied to the input element when it has a validation error.
- **`<SubmitButton onSubmitText="...">`** — Replaces the button text while the form is submitting.
- **`<SuccessContent>`** — Hidden until the form submits successfully, then revealed automatically.

## Adding Script Injection

If you disabled automatic script injection, add `<SnipFormScript>` to the page:

```astro
---
import {
  SnipForm,
  Field,
  SubmitButton,
  SuccessContent,
  SnipFormScript,
} from 'astro-snipform/components';
---

<SnipFormScript />

<SnipForm key="contact-form">
  <!-- ... -->
</SnipForm>
```
