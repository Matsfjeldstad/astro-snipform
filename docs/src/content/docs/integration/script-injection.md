---
title: Script Injection
description: Control how and where the SnipForm CDN script is loaded.
---

By default, `astro-snipform` injects the SnipForm CDN script on every page automatically. This is the recommended approach for most sites.

## Automatic Injection (Default)

No configuration needed. Add the integration and the script is injected globally:

```ts
// astro.config.mjs
export default defineConfig({
  integrations: [snipform()],
});
```

## Manual Injection Per-Page

If you only have forms on certain pages and want to avoid loading the script everywhere, disable automatic injection and use [`<SnipFormScript>`](/components/snipform-script/) on the pages that need it:

```ts
// astro.config.mjs
export default defineConfig({
  integrations: [snipform({ scriptInjection: false })],
});
```

Then add `<SnipFormScript>` to any page that uses a form:

```astro
---
// src/pages/contact.astro
import { SnipForm, Field, SubmitButton, SnipFormScript } from 'astro-snipform/components';
---

<SnipFormScript />

<SnipForm key="contact-form">
  <!-- fields -->
</SnipForm>
```

The `<SnipFormScript>` component renders a `<script>` tag pointing to the SnipForm CDN. Place it anywhere on the page — typically before the form or in the `<head>`.
