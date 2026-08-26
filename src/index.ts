import type { AstroIntegration } from "astro";
import type { SnipFormIntegrationOptions } from "./types/container.ts";

const SNIPFORM_CDN_URL = "https://cdn.snipform.io/api/v2/sf.iife.js";

/**
 * Astro integration for SnipForm.
 *
 * Automatically injects the SnipForm CDN script on all pages.
 * Use `scriptInjection: false` to disable and load the script manually
 * with the `<SnipFormScript>` component on specific pages.
 *
 * @example
 * ```ts
 * // astro.config.mjs
 * import { defineConfig } from 'astro/config';
 * import snipform from '@snipform/astro-forms';
 *
 * export default defineConfig({
 *   integrations: [snipform()],
 * });
 * ```
 */
export default function snipform(options?: SnipFormIntegrationOptions): AstroIntegration {
  const inject = options?.scriptInjection !== false;

  return {
    name: "astro-forms",
    hooks: {
      "astro:config:setup": ({ injectScript }) => {
        if (inject) {
          injectScript(
            "head-inline",
            `var s=document.createElement('script');s.src='${SNIPFORM_CDN_URL}';s.defer=true;document.head.appendChild(s);`,
          );
        }
      },
    },
  };
}

// Re-export all types
export type {
  ValidationRule,
  SimpleValidationRule,
  ParameterizedValidationRule,
  ValidationEntry,
  ValidationMap,
  ValidateProp,
  ErrorStateProps,
  ValidStateProps,
  InputStateProps,
  SubmitStateProps,
  SnipFormProps,
  SnipFormIntegrationOptions,
} from "./types/index.ts";

// Re-export utilities
export {
  buildValidationAttrs,
  buildInputStateAttrs,
  buildErrorAttrs,
  buildValidAttrs,
  buildSubmitAttrs,
} from "./utils/build-directives.ts";
