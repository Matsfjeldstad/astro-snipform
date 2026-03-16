---
title: SuccessContent
description: Content shown after a successful form submission.
---

`<SuccessContent>` wraps content that should only be visible after the form submits successfully. It is hidden by default and shown automatically when submission succeeds.

```astro
---
import { SuccessContent } from 'astro-snipform/components';
---

<SuccessContent>
  <p>Thanks! We'll be in touch soon.</p>
</SuccessContent>
```

`<SuccessContent>` has no props — it accepts only slot content.

Place it inside a [`<SnipForm>`](/components/snipform/) alongside your fields:

```astro
<SnipForm key="contact-form">
  <Field name="email" type="email" validate="required|email" />
  <SubmitButton>Send</SubmitButton>

  <SuccessContent>
    <h2>Message sent!</h2>
    <p>We'll respond within one business day.</p>
  </SuccessContent>
</SnipForm>
```
