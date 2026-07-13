import { defineConfig } from "astro/config";
import snipform from "../../../src/index.ts";

export default defineConfig({
  integrations: [snipform()],
});
