import { defineConfig } from "astro/config";

// GitHub Pages (project site). Adjust `site`/`base` if you use a custom domain.
export default defineConfig({
  site: "https://r10d1nsec.github.io",
  base: process.env.LANDING_BASE ?? "/hephaestus-forge",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh", "es", "fr", "de"],
    routing: { prefixDefaultLocale: false },
  },
});
