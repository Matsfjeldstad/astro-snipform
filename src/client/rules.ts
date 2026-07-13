/**
 * Client-side implementations of SnipForm validation rules.
 *
 * Pure functions, no DOM. The runtime feeds these the parsed
 * `sf-validate:*` directives, so rules stay aligned with the server
 * by construction — the directives are the single source of truth.
 *
 * The server remains the authority: rules that cannot run in the
 * browser (e.g. `active_url`, which needs a DNS lookup) are skipped
 * and left for the server to enforce.
 */

/** A field's current value: string, or string[] for checkbox groups / multi-selects */
export type FieldValue = string | string[];

/** All field values in the form, keyed by field name */
export type FormValues = Record<string, FieldValue>;

/** A parsed `sf-validate:rule[param]="message"` directive */
export interface ParsedRule {
  /** Rule name, e.g. "required", "min_length" */
  name: string;
  /** Raw parameter between brackets, e.g. "5" or "a,b,c" (null if none) */
  param: string | null;
  /** Custom error message (null → auto-generated) */
  message: string | null;
}

// Broader than the CDN script's pattern ([a-z_]+), which misses ipv4/ipv6
const RULE_ATTR_PATTERN = /^sf-validate:([a-z0-9_]+)(?:\[(.+?)\])?$/;

/** Parses an attribute name/value pair into a rule. Returns null for non-validation attributes. */
export function parseRuleAttr(attrName: string, attrValue: string): ParsedRule | null {
  const match = RULE_ATTR_PATTERN.exec(attrName);
  if (!match) return null;
  return { name: match[1], param: match[2] ?? null, message: attrValue || null };
}

/** Rules that cannot be checked in the browser and are deferred to the server */
export const SERVER_ONLY_RULES = new Set(["active_url"]);

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTEGER = /^-?\d+$/;
const NUMERIC = /^-?(\d+\.?\d*|\.\d+)$/;
const ALPHA = /^[a-zA-Z]+$/;
const ALPHA_NUM = /^[a-zA-Z0-9]+$/;
const ALPHA_DASH = /^[a-zA-Z0-9_-]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const IPV4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
const IPV6 =
  /^((([0-9a-f]{1,4}:){7}[0-9a-f]{1,4})|(([0-9a-f]{1,4}:)*[0-9a-f]{1,4})?::(([0-9a-f]{1,4}:)*[0-9a-f]{1,4})?)$/i;
const DATE = /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}(:\d{2})?)?$/;

function isEmpty(value: FieldValue): boolean {
  return Array.isArray(value) ? value.length === 0 : value.trim() === "";
}

function parseDate(value: string): number | null {
  if (!DATE.test(value.trim())) return null;
  const time = Date.parse(value.trim().replace(" ", "T"));
  return Number.isNaN(time) ? null : time;
}

/** Resolves an `after[ref]`-style reference: keyword, date literal, or another field */
function resolveDateRef(ref: string, values: FormValues): number | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  switch (ref) {
    case "today":
      return today.getTime();
    case "tomorrow":
      return today.getTime() + 86_400_000;
    case "yesterday":
      return today.getTime() - 86_400_000;
  }
  const literal = parseDate(ref);
  if (literal !== null) return literal;
  const other = values[ref];
  return typeof other === "string" ? parseDate(other) : null;
}

/**
 * Comparative rules (`gt`, `gte`, `lt`, `lte`) compare numerically when both
 * values are numeric, otherwise by character length (matching server behavior).
 */
function comparable(value: string, other: string): [number, number] {
  if (NUMERIC.test(value.trim()) && NUMERIC.test(other.trim())) {
    return [Number.parseFloat(value), Number.parseFloat(other)];
  }
  return [value.length, other.length];
}

function inList(param: string): string[] {
  return param.split(",").map((entry) => entry.trim());
}

type RuleCheck = (value: string, param: string, values: FormValues) => boolean;

/** Each check returns true when the value passes. Empty values are handled before dispatch. */
const CHECKS: Record<string, RuleCheck> = {
  email: (v) => EMAIL.test(v.trim()),
  url: (v) => {
    try {
      const url = new URL(v.trim());
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  },
  boolean: (v) => ["true", "false", "1", "0"].includes(v.trim().toLowerCase()),
  accepted: (v) => ["yes", "on", "1", "true"].includes(v.trim().toLowerCase()),
  numeric: (v) => NUMERIC.test(v.trim()),
  integer: (v) => INTEGER.test(v.trim()),
  alpha: (v) => ALPHA.test(v),
  alpha_num: (v) => ALPHA_NUM.test(v),
  alpha_dash: (v) => ALPHA_DASH.test(v),
  uuid: (v) => UUID.test(v.trim()),
  ip: (v) => IPV4.test(v.trim()) || IPV6.test(v.trim()),
  ipv4: (v) => IPV4.test(v.trim()),
  ipv6: (v) => IPV6.test(v.trim()),
  date: (v) => parseDate(v) !== null,

  max: (v, p) => NUMERIC.test(v.trim()) && Number.parseFloat(v) <= Number.parseFloat(p),
  min: (v, p) => NUMERIC.test(v.trim()) && Number.parseFloat(v) >= Number.parseFloat(p),
  between: (v, p) => {
    const [lo, hi] = p.split(",").map((n) => Number.parseFloat(n));
    const num = Number.parseFloat(v);
    return NUMERIC.test(v.trim()) && num >= lo && num <= hi;
  },

  min_length: (v, p) => v.length >= Number.parseInt(p, 10),
  max_length: (v, p) => v.length <= Number.parseInt(p, 10),
  starts_with: (v, p) => inList(p).some((s) => v.startsWith(s)),
  ends_with: (v, p) => inList(p).some((s) => v.endsWith(s)),
  doesnt_start_with: (v, p) => !inList(p).some((s) => v.startsWith(s)),
  doesnt_end_with: (v, p) => !inList(p).some((s) => v.endsWith(s)),
  in: (v, p) => inList(p).includes(v),
  not_in: (v, p) => !inList(p).includes(v),

  after: (v, p, values) => compareDates(v, p, values, (a, b) => a > b),
  before: (v, p, values) => compareDates(v, p, values, (a, b) => a < b),
  after_or_equal: (v, p, values) => compareDates(v, p, values, (a, b) => a >= b),
  before_or_equal: (v, p, values) => compareDates(v, p, values, (a, b) => a <= b),
  date_equals: (v, p, values) => compareDates(v, p, values, (a, b) => a === b),

  same: (v, p, values) => v === asString(values[p]),
  different: (v, p, values) => v !== asString(values[p]),
  gt: (v, p, values) => compareFields(v, values[p], (a, b) => a > b),
  gte: (v, p, values) => compareFields(v, values[p], (a, b) => a >= b),
  lt: (v, p, values) => compareFields(v, values[p], (a, b) => a < b),
  lte: (v, p, values) => compareFields(v, values[p], (a, b) => a <= b),
};

function asString(value: FieldValue | undefined): string {
  return typeof value === "string" ? value : "";
}

function compareDates(
  value: string,
  ref: string,
  values: FormValues,
  cmp: (a: number, b: number) => boolean,
): boolean {
  const valueTime = parseDate(value);
  const refTime = resolveDateRef(ref, values);
  return valueTime !== null && refTime !== null && cmp(valueTime, refTime);
}

function compareFields(
  value: string,
  other: FieldValue | undefined,
  cmp: (a: number, b: number) => boolean,
): boolean {
  const otherValue = asString(other);
  const [a, b] = comparable(value, otherValue);
  return cmp(a, b);
}

/** Humanizes a field name for auto-generated messages ("first_name" → "first name") */
function label(field: string): string {
  return field.replace(/[_-]+/g, " ");
}

const MESSAGES: Record<string, (field: string, param: string) => string> = {
  required: (f) => `The ${f} field is required.`,
  email: (f) => `The ${f} field must be a valid email address.`,
  url: (f) => `The ${f} field must be a valid URL.`,
  boolean: (f) => `The ${f} field must be true or false.`,
  accepted: (f) => `The ${f} field must be accepted.`,
  numeric: (f) => `The ${f} field must be a number.`,
  integer: (f) => `The ${f} field must be an integer.`,
  alpha: (f) => `The ${f} field may only contain letters.`,
  alpha_num: (f) => `The ${f} field may only contain letters and numbers.`,
  alpha_dash: (f) => `The ${f} field may only contain letters, numbers, dashes, and underscores.`,
  uuid: (f) => `The ${f} field must be a valid UUID.`,
  ip: (f) => `The ${f} field must be a valid IP address.`,
  ipv4: (f) => `The ${f} field must be a valid IPv4 address.`,
  ipv6: (f) => `The ${f} field must be a valid IPv6 address.`,
  date: (f) => `The ${f} field must be a valid date.`,
  max: (f, p) => `The ${f} field must not be greater than ${p}.`,
  min: (f, p) => `The ${f} field must be at least ${p}.`,
  between: (f, p) => `The ${f} field must be between ${p.replace(",", " and ")}.`,
  min_length: (f, p) => `The ${f} field must be at least ${p} characters.`,
  max_length: (f, p) => `The ${f} field must not be greater than ${p} characters.`,
  starts_with: (f, p) => `The ${f} field must start with one of: ${p}.`,
  ends_with: (f, p) => `The ${f} field must end with one of: ${p}.`,
  doesnt_start_with: (f, p) => `The ${f} field must not start with one of: ${p}.`,
  doesnt_end_with: (f, p) => `The ${f} field must not end with one of: ${p}.`,
  in: (f) => `The selected ${f} is invalid.`,
  not_in: (f) => `The selected ${f} is invalid.`,
  after: (f, p) => `The ${f} field must be a date after ${p}.`,
  before: (f, p) => `The ${f} field must be a date before ${p}.`,
  after_or_equal: (f, p) => `The ${f} field must be a date after or equal to ${p}.`,
  before_or_equal: (f, p) => `The ${f} field must be a date before or equal to ${p}.`,
  date_equals: (f, p) => `The ${f} field must be a date equal to ${p}.`,
  same: (f, p) => `The ${f} field must match ${label(p)}.`,
  different: (f, p) => `The ${f} field must be different from ${label(p)}.`,
  gt: (f, p) => `The ${f} field must be greater than ${label(p)}.`,
  gte: (f, p) => `The ${f} field must be greater than or equal to ${label(p)}.`,
  lt: (f, p) => `The ${f} field must be less than ${label(p)}.`,
  lte: (f, p) => `The ${f} field must be less than or equal to ${label(p)}.`,
};

function defaultMessage(rule: ParsedRule, field: string): string {
  const template = MESSAGES[rule.name];
  return template
    ? template(label(field), rule.param ?? "")
    : `The ${label(field)} field is invalid.`;
}

/** True if the rule can run in the browser */
export function isClientRule(name: string): boolean {
  return name === "required" || (name in CHECKS && !SERVER_ONLY_RULES.has(name));
}

/**
 * Validates one field against its rules.
 *
 * Mirrors server semantics: rules are evaluated in order and the first
 * failure is returned. Rules other than `required` and `accepted` pass
 * on empty values (empty + optional = valid). Rules the client cannot
 * check are skipped — the server enforces them on submit.
 *
 * @returns the error message for the first failing rule, or null if valid
 */
export function validateField(
  field: string,
  value: FieldValue,
  rules: ParsedRule[],
  values: FormValues,
): string | null {
  for (const rule of rules) {
    if (rule.name === "required") {
      if (isEmpty(value)) return rule.message ?? defaultMessage(rule, field);
      continue;
    }
    if (!isClientRule(rule.name)) continue;
    if (rule.name !== "accepted" && isEmpty(value)) continue;

    const check = CHECKS[rule.name];
    const items = Array.isArray(value) ? value : [value];
    const passes =
      rule.name === "accepted"
        ? check(asString(Array.isArray(value) ? value[0] : value), "", values)
        : items.every((item) => check(item, rule.param ?? "", values));

    if (!passes) return rule.message ?? defaultMessage(rule, field);
  }
  return null;
}
