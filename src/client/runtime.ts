/**
 * Client-side validation runtime for SnipForm.
 *
 * Interprets the same `sf-validate:*` directives the server reads and
 * validates before submit, so users get instant feedback instead of a
 * network round trip. The server still validates every submission —
 * this layer only short-circuits the obvious failures.
 *
 * All listeners are delegated at the document level in the capture
 * phase because the SnipForm CDN script rebuilds the DOM inside
 * `<snip-form>` when it mounts: element-level listeners attached
 * before mount would be lost, and the capture phase lets the submit
 * gate run (and cancel) before SnipForm's own submit handler.
 *
 * Errors are displayed through the same `if-error` / `then-*` / `else-*`
 * directive elements and `error-class` / `valid-class` input attributes
 * that SnipForm itself uses, so client and server errors look identical.
 */

import {
  type FieldValue,
  type FormValues,
  type ParsedRule,
  isClientRule,
  parseRuleAttr,
  validateField,
} from "./rules.ts";

type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface FieldEntry {
  name: string;
  els: FormControl[];
  rules: ParsedRule[];
}

/** Per-form interaction state (touched fields validate live; others wait) */
interface FormState {
  touched: Set<string>;
  submitted: boolean;
}

/** Original element state, cached before we mutate it */
interface BaseState {
  style: string | null;
  html: string;
  hidden: boolean;
}

const formStates = new WeakMap<HTMLFormElement, FormState>();
const baseStates = new WeakMap<Element, BaseState>();
const warnedRules = new Set<string>();

function getFormState(form: HTMLFormElement): FormState {
  let state = formStates.get(form);
  if (!state) {
    state = { touched: new Set(), submitted: false };
    formStates.set(form, state);
  }
  return state;
}

/** Finds the SnipForm root for a control, or null if not in one / opted out */
function snipformRoot(el: Element): HTMLElement | null {
  const root = el.closest("snip-form");
  if (!(root instanceof HTMLElement)) return null;
  if (root.getAttribute("sf-client-validate") === "false") return null;
  return root;
}

function isFormControl(el: unknown): el is FormControl {
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement
  );
}

/** Collects validated fields in the form, grouped by name */
function collectFields(form: HTMLFormElement): Map<string, FieldEntry> {
  const fields = new Map<string, FieldEntry>();
  for (const el of Array.from(form.elements)) {
    if (!isFormControl(el) || !el.name) continue;
    let entry = fields.get(el.name);
    if (!entry) {
      entry = { name: el.name, els: [], rules: [] };
      fields.set(el.name, entry);
    }
    entry.els.push(el);
    for (const attr of Array.from(el.attributes)) {
      const rule = parseRuleAttr(attr.name, attr.value);
      if (rule) {
        entry.rules.push(rule);
        warnServerOnly(rule.name);
      }
    }
  }
  return fields;
}

function warnServerOnly(name: string): void {
  if (import.meta.env?.DEV && !isClientRule(name) && !warnedRules.has(name)) {
    warnedRules.add(name);
    console.warn(
      `[astro-snipform] Rule "${name}" cannot be checked client-side; it will be validated by the server on submit.`,
    );
  }
}

/** Reads a field's current value, mirroring how the SnipForm script reads it */
function getValue(entry: FieldEntry): FieldValue {
  const first = entry.els[0];
  if (first instanceof HTMLSelectElement) {
    if (first.multiple) {
      return Array.from(first.selectedOptions).map((o) => o.value);
    }
    return first.value;
  }
  if (first instanceof HTMLInputElement) {
    if (first.type === "checkbox") {
      return entry.els.filter((el) => (el as HTMLInputElement).checked).map((el) => el.value);
    }
    if (first.type === "radio") {
      const checked = entry.els.find((el) => (el as HTMLInputElement).checked);
      return checked ? checked.value : "";
    }
    if (first.type === "file") {
      return first.files && first.files.length > 0 ? "present" : "";
    }
  }
  return first.value;
}

function formValues(fields: Map<string, FieldEntry>): FormValues {
  const values: FormValues = {};
  for (const [name, entry] of fields) values[name] = getValue(entry);
  return values;
}

function baseOf(el: Element): BaseState {
  let base = baseStates.get(el);
  if (!base) {
    base = {
      style: el.getAttribute("style"),
      html: el.innerHTML,
      hidden:
        (el as HTMLElement).hidden === true ||
        /display\s*:\s*none/i.test(el.getAttribute("style") ?? ""),
    };
    baseStates.set(el, base);
  }
  return base;
}

function setVisible(el: HTMLElement, visible: boolean): void {
  if (visible) {
    const style = el.getAttribute("style");
    if (style && /display\s*:\s*none/i.test(style)) {
      const cleaned = style
        .split(";")
        .filter((part) => !/^\s*display\s*:\s*none/i.test(part))
        .join(";")
        .trim();
      if (cleaned) el.setAttribute("style", cleaned);
      else el.removeAttribute("style");
    }
    el.hidden = false;
  } else {
    el.hidden = true;
  }
}

function toggleClasses(el: Element, classes: string | null, on: boolean): void {
  if (!classes) return;
  for (const token of classes.split(/\s+/).filter(Boolean)) {
    el.classList.toggle(token, on);
  }
}

function mergeStyle(el: HTMLElement, base: BaseState, extra: string | null): void {
  const parts = [base.style, extra].filter(Boolean);
  if (parts.length > 0) el.setAttribute("style", parts.join("; "));
  else el.removeAttribute("style");
}

/** Applies error/valid state to the field's inputs (error-class, valid-class, aria-invalid) */
function renderInputs(entry: FieldEntry, error: string | null): void {
  for (const el of entry.els) {
    toggleClasses(el, el.getAttribute("error-class"), error !== null);
    toggleClasses(el, el.getAttribute("valid-class"), error === null);
    const errorStyle = el.getAttribute("error-style");
    const validStyle = el.getAttribute("valid-style");
    if (errorStyle || validStyle) {
      mergeStyle(el, baseOf(el), error !== null ? errorStyle : validStyle);
    }
    if (error !== null) el.setAttribute("aria-invalid", "true");
    else el.removeAttribute("aria-invalid");
  }
}

function escapeSelector(value: string): string {
  return typeof CSS !== "undefined" && CSS.escape
    ? CSS.escape(value)
    : value.replace(/["\\]/g, "\\$&");
}

/** Applies error/valid state to `if-error` display elements */
function renderErrorNodes(root: HTMLElement, field: string, error: string | null): void {
  const selector = `[if-error="${escapeSelector(field)}"]`;
  for (const el of Array.from(root.querySelectorAll<HTMLElement>(selector))) {
    const base = baseOf(el);
    const showText = el.getAttribute("then-show-text");

    if (error !== null) {
      const text = el.getAttribute("then-text") ?? (showText || error);
      if (showText !== null || el.hasAttribute("then-text")) el.textContent = text;
      toggleClasses(el, el.getAttribute("else-class"), false);
      toggleClasses(el, el.getAttribute("then-class"), true);
      mergeStyle(el, base, el.getAttribute("then-style"));
      if (el.hasAttribute("then-show") || showText !== null) setVisible(el, true);
      else if (el.hasAttribute("then-hide") || el.hasAttribute("else-show")) setVisible(el, false);
    } else {
      const elseText = el.getAttribute("else-text");
      if (elseText !== null) el.textContent = elseText;
      else if (showText !== null || el.hasAttribute("then-text")) el.innerHTML = base.html;
      toggleClasses(el, el.getAttribute("then-class"), false);
      toggleClasses(el, el.getAttribute("else-class"), true);
      mergeStyle(el, base, el.getAttribute("else-style"));
      if (el.hasAttribute("else-hide")) setVisible(el, false);
      else if (el.hasAttribute("else-show") || elseText !== null) setVisible(el, true);
      else if (el.hasAttribute("then-show") || showText !== null) setVisible(el, !base.hidden);
    }
  }
}

function renderField(root: HTMLElement, entry: FieldEntry, error: string | null): void {
  renderInputs(entry, error);
  renderErrorNodes(root, entry.name, error);
}

/** Validates one field and renders the result. Returns the error, if any. */
function checkField(
  root: HTMLElement,
  fields: Map<string, FieldEntry>,
  name: string,
): string | null {
  const entry = fields.get(name);
  if (!entry || entry.rules.length === 0) return null;
  const error = validateField(name, getValue(entry), entry.rules, formValues(fields));
  renderField(root, entry, error);
  return error;
}

function onSubmit(event: Event): void {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  const root = snipformRoot(form);
  if (!root) return;

  const fields = collectFields(form);
  const state = getFormState(form);
  state.submitted = true;

  let firstInvalid: FieldEntry | null = null;
  for (const [name, entry] of fields) {
    if (entry.rules.length === 0) continue;
    const error = checkField(root, fields, name);
    if (error && !firstInvalid) firstInvalid = entry;
  }

  if (firstInvalid) {
    event.preventDefault();
    event.stopPropagation();
    firstInvalid.els[0]?.focus();
  }
}

function onFocusOut(event: FocusEvent): void {
  const el = event.target;
  if (!isFormControl(el) || !el.name || !el.form) return;
  const root = snipformRoot(el);
  if (!root) return;

  // Native validation bubbles would fire before our submit gate; the
  // directives own the messaging, so disable them once JS is active.
  el.form.noValidate = true;

  const state = getFormState(el.form);
  state.touched.add(el.name);
  checkField(root, collectFields(el.form), el.name);
}

function onInput(event: Event): void {
  const el = event.target;
  if (!isFormControl(el) || !el.name || !el.form) return;
  const root = snipformRoot(el);
  if (!root) return;

  // Only re-validate fields the user has already left or submitted —
  // no error flashes while typing in an untouched field.
  const state = getFormState(el.form);
  if (!state.touched.has(el.name) && !state.submitted) return;
  checkField(root, collectFields(el.form), el.name);
}

declare global {
  interface Window {
    __astroSnipformClientValidation?: boolean;
  }
}

/**
 * Installs the client validation runtime once per page.
 *
 * Document-level capture listeners survive SnipForm's DOM rebuild and
 * Astro view transitions, so no re-init on navigation is needed.
 */
export function initClientValidation(): void {
  if (window.__astroSnipformClientValidation) return;
  window.__astroSnipformClientValidation = true;

  document.addEventListener("submit", onSubmit, true);
  document.addEventListener("focusout", onFocusOut, true);
  document.addEventListener("input", onInput, true);
  document.addEventListener("change", onInput, true);
}
