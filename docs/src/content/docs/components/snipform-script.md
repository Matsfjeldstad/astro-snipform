---
title: SnipFormScript
description: Manually render the SnipForm CDN script tag on specific pages.
---

`<SnipFormScript>` renders a `<script>` tag that loads the SnipForm CDN. Use it when automatic script injection is disabled (`scriptInjection: false` in the integration options).

```astro
---
import { SnipFormScript } from 'astro-snipform/components';
---

<SnipFormScript />
```

## Props

| Prop  | Type     | Default               | Description                                       |
| ----- | -------- | --------------------- | ------------------------------------------------- |
| `src` | `string` | Official SnipForm CDN | Override the CDN URL for this specific script tag |

## When to Use

By default, `astro-snipform` injects the CDN script globally on every page. If you set `scriptInjection: false` in your [integration options](/integration/options/), you are responsible for adding `<SnipFormScript>` to each page that contains a form:

```astro
---
import { SnipForm, Field, SubmitButton, SnipFormScript } from 'astro-snipform/components';
---

<SnipFormScript />

<SnipForm key="contact-form">
  <!-- fields -->
</SnipForm>
```

See [Script Injection](/integration/script-injection/) for the full pattern.
