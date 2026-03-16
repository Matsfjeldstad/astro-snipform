import { defineConfig } from "vite-plus";

export default defineConfig({
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  staged: {
    "*": "vp check --fix",
  },
  pack: {
    entry: ["src/index.ts"],
    format: "esm",
    dts: true,
    clean: true,
    deps: {
      neverBundle: ["astro"],
    },
  },

  lint: {
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: [
      "dist/**",
      "coverage/**",
      "vendor/**",
      "test/snapshots/**",
      "node_modules/**",
      ".astro/**",
    ],
  },
});
