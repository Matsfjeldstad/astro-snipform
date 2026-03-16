---
title: SnipForm
description: Form container component that connects to the SnipForm backend.
---

The `<SnipForm>` component wraps your form fields and connects them to the SnipForm backend using your form key.

```astro
---
import { SnipForm } from 'astro-snipform/components';
---

<SnipForm key="your-form-key">
  <!-- form fields here -->
</SnipForm>
```

## Props

| Prop          | Type               | Default  | Description                                                           |
| ------------- | ------------------ | -------- | --------------------------------------------------------------------- |
| `key`         | `string`           | required | Your form's unique key from the SnipForm dashboard                    |
| `transition`  | `number \| 'none'` | `150`    | Fade transition duration in milliseconds. Set to `'none'` to disable. |
| `mode`        | `'test'`           | —        | Enable test mode — the form will not actually submit                  |
| `readability` | `false`            | —        | Disable the readability directive parser                              |
| `namespace`   | `false`            | —        | Disable the namespace directive parser                                |
| `shorthand`   | `false`            | —        | Disable the shorthand directive parser                                |

## `key`

Your form's unique identifier from the [SnipForm](https://snipform.io) dashboard. This is required.

```astro
<SnipForm key="abc123xyz">
```

## `transition`

Controls the fade duration (in ms) for showing/hiding the success content. Set to `'none'` to disable the transition entirely.

```astro
<SnipForm key="my-form" transition={300}>
<SnipForm key="my-form" transition="none">
```

## `mode`

Set to `'test'` to submit the form without actually sending data. Useful during development.

```astro
<SnipForm key="my-form" mode="test">
```

## Directive Parsers

SnipForm supports three optional directive systems. All are enabled by default. Pass `false` to disable any of them:

```astro
<SnipForm key="my-form" readability={false} namespace={false} shorthand={false}>
```
