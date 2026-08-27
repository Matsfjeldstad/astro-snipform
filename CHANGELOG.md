# Changelog

## 0.3.2

### Fixed

- Client-side validation only implements rules the server accepts. `between`, `ends_with`, `after_or_equal`, `before_or_equal` and `different` were checked in the browser and listed in the README, but the server rejects them at init with `Unknown validation rule`, so any form using one was broken. They are removed from the rule engine, the `ValidationRule` type and the docs; the README example now uses `min[18]` + `max[99]`.
- `regex` and `not_regex` are declared server-only (they run with PHP regex semantics), so the dev-mode warning names them instead of silently skipping. Added to the `ValidationRule` type.

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
