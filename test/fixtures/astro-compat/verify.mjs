import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile(new URL("./dist/index.html", import.meta.url), "utf8");

for (const output of [
  "<snip-form",
  "<sf-result",
  "sf-validate:required",
  'if-error="email"',
  'on-submit-text="Sending"',
  "https://cdn.snipform.io/api/v2/sf.iife.js",
  'sf-client-validate="false"',
]) {
  assert.ok(html.includes(output), `Expected built HTML to include ${output}`);
}

// The client validation runtime is bundled by Astro as a hoisted module script
// (named SnipForm_*.js on Astro 6+, hoisted.*.js on Astro 4/5)
assert.match(html, /<script type="module" src="\/_astro\/[^"]+\.js"><\/script>/);
