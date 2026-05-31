import { useI18nStore } from "../store/i18nStore";
import { LANGUAGE_NAMES, translations } from "./index";

/** Hook de traducción. t(key, vars?) interpola {name}; tList(key) devuelve arrays. */
export function useT() {
  const lang = useI18nStore((s) => s.lang);
  const setLang = useI18nStore((s) => s.setLang);
  const dict = translations[lang] ?? translations.en;

  function t(key: string, vars?: Record<string, string | number>): string {
    let v = (dict[key] ?? translations.en[key] ?? key) as string;
    if (vars) {
      for (const k of Object.keys(vars)) v = v.replace(`{${k}}`, String(vars[k]));
    }
    return v;
  }

  function tList(key: string): string[] {
    return (dict[key] ?? translations.en[key] ?? []) as string[];
  }

  // Nombre del idioma para enviar al backend (preguntas/docs en este idioma).
  const languageName = LANGUAGE_NAMES[lang];

  return { t, tList, lang, setLang, languageName };
}
