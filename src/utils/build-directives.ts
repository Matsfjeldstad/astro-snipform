import type { ValidateProp } from "../types/validation.js";
import type {
  ErrorStateProps,
  ValidStateProps,
  InputStateProps,
  SubmitStateProps,
} from "../types/directives.js";

type Attrs = Record<string, string>;

// Astro renders boolean `true` as the string "true" in HTML attributes.
// SnipForm expects valueless attributes, so we use empty string instead,
// which Astro renders as just the attribute name (e.g. `error-show:email`).
const VALUELESS = "";

/**
 * Converts validation rules into `sf-validate:*` HTML attributes.
 *
 * Accepts all ValidateProp formats:
 * - String: `'required'`
 * - Array: `['required', 'email']`
 * - Object map: `{ required: 'Email is required', email: 'Bad format' }`
 * - Legacy entry: `[{ rule: 'required', message: 'Required' }]`
 */
export function buildValidationAttrs(rules?: ValidateProp): Attrs {
  if (!rules) return {};
  const attrs: Attrs = {};

  // Object map: { required: 'message', email: 'message' }
  if (typeof rules === "object" && !Array.isArray(rules) && !("rule" in rules)) {
    for (const [rule, message] of Object.entries(rules)) {
      attrs[`sf-validate:${rule}`] = message || VALUELESS;
    }
    return attrs;
  }

  // Single entry or array of entries
  const list = Array.isArray(rules) ? rules : [rules];

  for (const entry of list) {
    if (typeof entry === "string") {
      attrs[`sf-validate:${entry}`] = VALUELESS;
    } else {
      attrs[`sf-validate:${entry.rule}`] = entry.message;
    }
  }

  return attrs;
}

/**
 * Converts InputStateProps into error/valid class/style attributes.
 *
 * @example
 * buildInputStateAttrs({ errorClass: 'border-red-500', validClass: 'border-green-500' })
 * // → { 'error-class': 'border-red-500', 'valid-class': 'border-green-500' }
 */
export function buildInputStateAttrs(props?: InputStateProps): Attrs {
  if (!props) return {};
  const attrs: Attrs = {};

  if (props.errorClass) attrs["error-class"] = props.errorClass;
  if (props.errorStyle) attrs["error-style"] = props.errorStyle;
  if (props.validClass) attrs["valid-class"] = props.validClass;
  if (props.validStyle) attrs["valid-style"] = props.validStyle;

  return attrs;
}

/**
 * Converts ErrorStateProps into SnipForm v2 error directives.
 *
 * Uses `if-error="field"` to bind the element to a field, then
 * `then-*` attributes for error state and `else-*` for valid state.
 *
 * @example
 * buildErrorAttrs({ field: 'email', show: true, text: 'Invalid email' })
 * // → { 'if-error': 'email', 'then-show': '', 'then-text': 'Invalid email' }
 */
export function buildErrorAttrs(props: ErrorStateProps): Attrs {
  const { field } = props;
  const attrs: Attrs = {};

  attrs["if-error"] = field;

  if (props.show && props.showText) {
    attrs["then-show-text"] = VALUELESS;
  } else {
    if (props.show) attrs["then-show"] = VALUELESS;
    if (props.showText) attrs["then-show-text"] = VALUELESS;
  }
  if (props.hide) attrs["then-hide"] = VALUELESS;
  if (props.text) attrs["then-text"] = props.text;
  if (props.class) attrs["then-class"] = props.class;
  if (props.style) attrs["then-style"] = props.style;

  return attrs;
}

/**
 * Converts ValidStateProps into SnipForm v2 valid directives.
 *
 * Uses `if-error="field"` with `else-*` attributes for the valid state.
 *
 * @example
 * buildValidAttrs({ field: 'email', show: true, class: 'text-green-500' })
 * // → { 'if-error': 'email', 'else-show': '', 'else-class': 'text-green-500' }
 */
export function buildValidAttrs(props: ValidStateProps): Attrs {
  const { field } = props;
  const attrs: Attrs = {};

  attrs["if-error"] = field;

  if (props.show) attrs["else-show"] = VALUELESS;
  if (props.hide) attrs["else-hide"] = VALUELESS;
  if (props.text) attrs["else-text"] = props.text;
  if (props.class) attrs["else-class"] = props.class;
  if (props.style) attrs["else-style"] = props.style;

  return attrs;
}

/**
 * Converts SubmitStateProps into SnipForm v2 submit/loading state attributes.
 *
 * Uses the format: `on-submit-{option}="value"`
 *
 * @example
 * buildSubmitAttrs({ onSubmitShow: true, onSubmitText: 'Sending...' })
 * // → { 'on-submit-show': '', 'on-submit-text': 'Sending...' }
 */
export function buildSubmitAttrs(props?: SubmitStateProps): Attrs {
  if (!props) return {};
  const attrs: Attrs = {};

  if (props.onSubmitShow) attrs["on-submit-show"] = VALUELESS;
  if (props.onSubmitHide) attrs["on-submit-hide"] = VALUELESS;
  if (props.onSubmitText) attrs["on-submit-text"] = props.onSubmitText;
  if (props.onSubmitClass) attrs["on-submit-class"] = props.onSubmitClass;
  if (props.onSubmitStyle) attrs["on-submit-style"] = props.onSubmitStyle;

  return attrs;
}
