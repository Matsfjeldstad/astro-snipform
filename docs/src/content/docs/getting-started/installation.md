---
title: Installation
description: Install astro-snipform in your Astro project.
---

Install the package from npm:

```bash
npm install astro-snipform
```

## Importing Components

All components are exported from the `astro-snipform/components` sub-path:

```astro
---
import {
  SnipForm,
  Field,
  Input,
  Textarea,
  Select,
  ErrorMessage,
  ValidMessage,
  SubmitButton,
  SuccessContent,
  SnipFormScript,
} from 'astro-snipform/components';
---
```

Next, [set up the integration](/getting-started/setup/) in your Astro config.
