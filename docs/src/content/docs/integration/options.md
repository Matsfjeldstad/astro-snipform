---
title: Integration Options
description: Configuration options for the astro-snipform Astro integration.
---

Pass options to the `snipform()` integration call in your `astro.config.mjs`:

```ts
import snipform from "astro-snipform";

export default defineConfig({
  integrations: [
    snipform({
      scriptInjection: false,
    }),
  ],
});
```

## Options

| Option            | Type      | Default | Description                                                       |
| ----------------- | --------- | ------- | ----------------------------------------------------------------- |
| `scriptInjection` | `boolean` | `true`  | Set to `false` to disable automatic script injection on all pages |

## `scriptInjection`

By default, the SnipForm script is injected on every page. Set to `false` to manage injection manually using the [`<SnipFormScript>`](/components/snipform-script/) component on individual pages.

```ts
snipform({
  scriptInjection: false,
});
```

See [Script Injection](/integration/script-injection/) for the full pattern.
