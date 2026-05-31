import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { dictionaries, HTML_LANG, LANGS, type Lang, type TranslationKey } from "./dictionaries";

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
  langs: Lang[];
  meta: (lang: Lang) => { label: string; glyph: string };
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "hf-app-lang";

function detectInitial(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && LANGS.includes(saved)) return saved;
    const n = (navigator.language || "en").toLowerCase();
    if (n.startsWith("zh")) return "zh";
    if (n.startsWith("es")) return "es";
    if (n.startsWith("fr")) return "fr";
    if (n.startsWith("de")) return "de";
  } catch {
    /* ignore */
  }
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitial);

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);
  const t = useCallback((key: TranslationKey) => dictionaries[lang][key] ?? dictionaries.en[key], [lang]);
  const meta = useCallback(
    (l: Lang) => ({ label: dictionaries[l]._label, glyph: dictionaries[l]._glyph }),
    [],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ lang, setLang, t, langs: LANGS, meta }),
    [lang, setLang, t, meta],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}

export type { Lang, TranslationKey };
