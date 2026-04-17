import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    starlight({
      customCss: ["./src/styles/custom.css"],
      title: "astro-snipform",
      description:
        "Typesafe Astro integration and components for SnipForm — directive-driven form backend for static sites.",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/Matsfjeldstad/astro-snipform",
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Installation", slug: "getting-started/installation" },
            { label: "Setup", slug: "getting-started/setup" },
          ],
        },
        {
          label: "Integration",
          items: [
            { label: "Options", slug: "integration/options" },
            { label: "Script Injection", slug: "integration/script-injection" },
          ],
        },
        {
          label: "Components",
          items: [
            { label: "SnipForm", slug: "components/snipform" },
            { label: "Field", slug: "components/field" },
            { label: "Input", slug: "components/input" },
            { label: "Textarea", slug: "components/textarea" },
            { label: "Select", slug: "components/select" },
            { label: "ErrorMessage", slug: "components/error-message" },
            { label: "ValidMessage", slug: "components/valid-message" },
            { label: "SubmitButton", slug: "components/submit-button" },
            { label: "SuccessContent", slug: "components/success-content" },
            { label: "SnipFormScript", slug: "components/snipform-script" },
          ],
        },
        {
          label: "Validation",
          items: [
            { label: "Overview", slug: "validation/overview" },
            { label: "Simple Rules", slug: "validation/simple-rules" },
            { label: "Parameterized Rules", slug: "validation/parameterized-rules" },
          ],
        },
        {
          label: "Examples",
          items: [{ label: "Full Form", slug: "examples/full-form" }],
        },
      ],
    }),
  ],
});
