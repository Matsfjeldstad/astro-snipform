import { describe, expect, it, vi } from "vite-plus/test";
import snipform from "../src/index.ts";

function getSetupHook(options?: Parameters<typeof snipform>[0]) {
  const hook = snipform(options).hooks["astro:config:setup"];

  if (typeof hook !== "function") {
    throw new TypeError("Expected astro:config:setup hook");
  }

  return hook;
}

describe("snipform integration", () => {
  it("injects the default CDN script", async () => {
    const injectScript = vi.fn();
    const hook = getSetupHook();

    await hook({ injectScript } as unknown as Parameters<typeof hook>[0]);

    expect(injectScript).toHaveBeenCalledOnce();
    expect(injectScript).toHaveBeenCalledWith(
      "head-inline",
      "var s=document.createElement('script');s.src='https://cdn.snipform.io/api/v2/sf.iife.js';s.defer=true;document.head.appendChild(s);",
    );
  });

  it("can disable automatic script injection", async () => {
    const injectScript = vi.fn();
    const hook = getSetupHook({ scriptInjection: false });

    await hook({ injectScript } as unknown as Parameters<typeof hook>[0]);

    expect(injectScript).not.toHaveBeenCalled();
  });
});
