/// <reference types="astro/client" />
/// <reference types="astro/astro-jsx" />

declare module "*.astro" {
  const Component: (_props: Record<string, any>) => any;
  export default Component;
}

declare namespace astroHTML.JSX {
  interface IntrinsicElements {
    "snip-form": any;
    "sf-result": any;
    "sf-success": any;
  }
}
