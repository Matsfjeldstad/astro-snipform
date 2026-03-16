/**
 * All SnipForm validation rules.
 *
 * Rules are applied via `sf-validate:rule` directives on input elements.
 * Multiple rules can be combined — they are evaluated in order, first failure is shown.
 */

/** Simple validation rules (no parameters) */
export type SimpleValidationRule =
  | "required"
  | "email"
  | "url"
  | "active_url"
  | "boolean"
  | "accepted"
  | "numeric"
  | "integer"
  | "alpha"
  | "alpha_num"
  | "alpha_dash"
  | "date"
  | "ip"
  | "ipv4"
  | "ipv6"
  | "uuid";

/** Parameterized validation rules */
export type ParameterizedValidationRule =
  | `max[${number}]`
  | `min[${number}]`
  | `between[${number},${number}]`
  | `min_length[${number}]`
  | `max_length[${number}]`
  | `starts_with[${string}]`
  | `ends_with[${string}]`
  | `doesnt_start_with[${string}]`
  | `doesnt_end_with[${string}]`
  | `in[${string}]`
  | `not_in[${string}]`
  | `after[${string}]`
  | `before[${string}]`
  | `after_or_equal[${string}]`
  | `before_or_equal[${string}]`
  | `date_equals[${string}]`
  | `same[${string}]`
  | `different[${string}]`
  | `gt[${string}]`
  | `gte[${string}]`
  | `lt[${string}]`
  | `lte[${string}]`;

/** All supported SnipForm validation rules */
export type ValidationRule = SimpleValidationRule | ParameterizedValidationRule;

/**
 * A single validation entry: rule name with optional custom error message.
 *
 * - `ValidationRule` — uses auto-generated error message
 * - `{ rule: ValidationRule; message: string }` — custom error message
 */
export type ValidationEntry = ValidationRule | { rule: ValidationRule; message: string };

/**
 * Object shorthand: map validation rules to custom error messages.
 *
 * @example
 * { required: 'Email is required', email: 'Invalid email format' }
 */
export type ValidationMap = Partial<Record<ValidationRule, string>>;

/**
 * All accepted formats for the `validate` prop:
 *
 * - `'required'` — single rule, auto-generated message
 * - `['required', 'email']` — multiple rules, auto-generated messages
 * - `{ required: 'Required!', email: 'Bad email' }` — object map with custom messages
 * - `[{ rule: 'required', message: 'Required!' }]` — explicit entry array (legacy)
 */
export type ValidateProp = ValidationEntry | ValidationEntry[] | ValidationMap;
