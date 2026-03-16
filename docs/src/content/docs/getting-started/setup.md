---
title: Setup
description: Add the astro-snipform integration to your Astro project.
---

Add the integration to your `astro.config.mjs`:

```ts
// astro.config.mjs
import { defineConfig } from "astro/config";
import snipform from "astro-snipform";

export default defineConfig({
  integrations: [snipform()],
});
```

This automatically injects the SnipForm CDN script on every page of your site.

## Next Steps

- See [Integration Options](/integration/options/) to configure CDN URL or disable auto-injection.
- Jump to the [Full Form Example](/examples/full-form/) to see all components in action.
