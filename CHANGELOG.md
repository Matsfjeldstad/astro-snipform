# Changelog

## 0.3.0

### Breaking

- Package renamed from `astro-snipform` to `@snipform/astro-forms`. Update imports:

  ```diff
  - import snipform from "astro-snipform";
  - import { SnipForm } from "astro-snipform/components";
  + import snipform from "@snipform/astro-forms";
  + import { SnipForm } from "@snipform/astro-forms/components";
  ```

- Integration name reported to Astro is now `astro-forms` (was `astro-snipform`). Client-side log prefix changed to `[astro-forms]`.

### Changed

- Repository moved to [SnipForm/astro-forms](https://github.com/SnipForm/astro-forms).
- Removed bundled docs site; documentation lives on the SnipForm docs.

## 0.2.0

- Client-side validation from `sf-validate` directives.
- Removed `cdnUrl` integration option.
