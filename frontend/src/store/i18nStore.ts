import { create } from "zustand";
import { Lang, LANGS } from "../i18n";

const KEY = "hf_lang";

function initialLang(): Lang {
  const saved = localStorage.getItem(KEY) as Lang | null;
  if (saved && LANGS.includes(saved)) return saved;
  const nav = navigator.language.slice(0, 2) as Lang;
  if (LANGS.includes(nav)) return nav;
  return "en";
}

interface I18nState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useI18nStore = create<I18nState>((set) => ({
  lang: initialLang(),
  setLang: (lang) => {
    localStorage.setItem(KEY, lang);
    set({ lang });
  },
}));
