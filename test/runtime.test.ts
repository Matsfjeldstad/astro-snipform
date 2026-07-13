// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { initClientValidation } from "../src/client/runtime.ts";

/**
 * Builds the post-mount DOM shape: the SnipForm CDN script wraps form
 * content in a <form> inside the <snip-form> container.
 */
function mountForm(fieldsHtml: string, rootAttrs = ""): HTMLFormElement {
  document.body.innerHTML = `
    <snip-form ${rootAttrs}>
      <form action="https://snipform.io">${fieldsHtml}</form>
    </snip-form>
  `;
  const form = document.querySelector("form");
  if (!form) throw new Error("form not mounted");
  return form;
}

function submit(form: HTMLFormElement): Event {
  const event = new Event("submit", { bubbles: true, cancelable: true });
  form.dispatchEvent(event);
  return event;
}

function blur(el: Element): void {
  el.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
}

function type(el: HTMLInputElement, value: string): void {
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

/** Hidden either via the `hidden` property or an inline display:none */
function isHidden(el: HTMLElement): boolean {
  return el.hidden === true || /display\s*:\s*none/i.test(el.getAttribute("style") ?? "");
}

initClientValidation();

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("submit gate", () => {
  it("blocks submit and shows the error when a field is invalid", () => {
    const form = mountForm(`
      <input name="email" sf-validate:required="Email is required" sf-validate:email />
      <span if-error="email" then-show-text else-hide style="display:none"></span>
    `);
    const snipformHandler = vi.fn();
    form.addEventListener("submit", snipformHandler, false);

    const event = submit(form);

    expect(event.defaultPrevented).toBe(true);
    expect(snipformHandler).not.toHaveBeenCalled();
    const span = document.querySelector("span");
    expect(span?.hidden).toBe(false);
    expect(span?.textContent).toBe("Email is required");
    expect(document.querySelector("input")?.getAttribute("aria-invalid")).toBe("true");
  });

  it("lets valid submits through to SnipForm's handler", () => {
    const form = mountForm(`
      <input name="email" value="a@b.co" sf-validate:required sf-validate:email />
      <span if-error="email" then-show-text else-hide style="display:none"></span>
    `);
    const snipformHandler = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener("submit", snipformHandler, false);

    submit(form);

    expect(snipformHandler).toHaveBeenCalledOnce();
    expect(document.querySelector("span")?.hidden).toBe(true);
  });

  it("focuses the first invalid field", () => {
    const form = mountForm(`
      <input name="name" sf-validate:required />
      <input name="email" sf-validate:required />
    `);
    submit(form);
    expect(document.activeElement?.getAttribute("name")).toBe("name");
  });
});

describe("live validation", () => {
  it("validates on blur and clears on corrected input", () => {
    mountForm(`
      <input name="email" sf-validate:required="Required" sf-validate:email="Bad email" />
      <span if-error="email" then-show-text else-hide style="display:none"></span>
    `);
    const input = document.querySelector("input");
    const span = document.querySelector("span");
    if (!input || !span) throw new Error("missing elements");

    type(input, "nope");
    expect(isHidden(span)).toBe(true); // untouched — no error while typing

    blur(input);
    expect(isHidden(span)).toBe(false);
    expect(span.textContent).toBe("Bad email");

    type(input, "a@b.co");
    expect(isHidden(span)).toBe(true);
    expect(input.hasAttribute("aria-invalid")).toBe(false);
  });

  it("hides else-show elements while the field has an error", () => {
    mountForm(`
      <input name="email" sf-validate:required sf-validate:email />
      <span if-error="email" else-show style="display:none">Email valid</span>
    `);
    const input = document.querySelector("input");
    const span = document.querySelector("span");
    if (!input || !span) throw new Error("missing elements");

    blur(input);
    expect(isHidden(span)).toBe(true);

    type(input, "a@b.co");
    expect(isHidden(span)).toBe(false);
  });

  it("toggles error-class and valid-class on the input", () => {
    mountForm(`
      <input name="name" sf-validate:required error-class="is-bad" valid-class="is-good" />
    `);
    const input = document.querySelector("input");
    if (!input) throw new Error("missing input");

    blur(input);
    expect(input.classList.contains("is-bad")).toBe(true);
    expect(input.classList.contains("is-good")).toBe(false);

    type(input, "hello");
    expect(input.classList.contains("is-bad")).toBe(false);
    expect(input.classList.contains("is-good")).toBe(true);
  });

  it("validates cross-field rules against current form values", () => {
    mountForm(`
      <input name="password" value="secret" />
      <input name="confirm" sf-validate:same[password]="Must match" />
      <span if-error="confirm" then-show-text else-hide style="display:none"></span>
    `);
    const confirm = document.querySelectorAll("input")[1];
    const span = document.querySelector("span");
    if (!confirm || !span) throw new Error("missing elements");

    type(confirm, "other");
    blur(confirm);
    expect(span.hidden).toBe(false);
    expect(span.textContent).toBe("Must match");

    type(confirm, "secret");
    expect(span.hidden).toBe(true);
  });
});

describe("opt-out", () => {
  it("does nothing when sf-client-validate is false", () => {
    const form = mountForm(
      `<input name="email" sf-validate:required />`,
      'sf-client-validate="false"',
    );
    const snipformHandler = vi.fn((e: Event) => e.preventDefault());
    form.addEventListener("submit", snipformHandler, false);

    const event = submit(form);

    expect(snipformHandler).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(true); // prevented by the handler, not the gate
    expect(document.querySelector("input")?.hasAttribute("aria-invalid")).toBe(false);
  });
});

describe("checkbox groups", () => {
  it("requires at least one checked box", () => {
    const form = mountForm(`
      <input type="checkbox" name="topics" value="a" sf-validate:required="Pick one" />
      <input type="checkbox" name="topics" value="b" />
      <span if-error="topics" then-show-text else-hide style="display:none"></span>
    `);
    submit(form);
    const span = document.querySelector("span");
    expect(span?.hidden).toBe(false);
    expect(span?.textContent).toBe("Pick one");

    const box = document.querySelector("input");
    if (!box) throw new Error("missing checkbox");
    box.checked = true;
    box.dispatchEvent(new Event("change", { bubbles: true }));
    expect(span?.hidden).toBe(true);
  });
});
