import { defineConfig } from "astro/config";

// Defaults are root-hosting (Vercel / custom domain). For a GitHub Pages *project*
// site, the Pages workflow sets LANDING_BASE=/hephaestus-forge + LANDING_SITE.
export default defineConfig({
  site: process.env.LANDING_SITE ?? "https://hephaestus-forge.vercel.app",
  base: process.env.LANDING_BASE ?? "/",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh", "es", "fr", "de"],
    routing: { prefixDefaultLocale: false },
  },
});
