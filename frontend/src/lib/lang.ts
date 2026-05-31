import type { Lang } from "../i18n/dictionaries";

/** Nombre humano del idioma que se envía al backend (preguntas/docs en ese idioma). */
export const LANGUAGE_NAMES: Record<Lang, string> = {
  en: "English",
  zh: "中文 (Simplified Chinese)",
  es: "Spanish (Español)",
  fr: "French (Français)",
  de: "German (Deutsch)",
};
