import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Flame, LayoutGrid, Languages, Settings } from "lucide-react";
import { useI18n } from "../i18n";
import { cn } from "../lib/cn";
import type { Screen } from "../types";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid place-items-center w-[30px] h-[30px] rounded-lg text-ember-400 ember-tile">
        <Flame size={17} strokeWidth={2} />
      </span>
      {!compact && (
        <span className="font-semibold text-stone-50 tracking-[-0.01em]">
          Hephaestus<span className="text-ember-500">&apos;</span> Forge
        </span>
      )}
    </div>
  );
}

function LanguageSelect() {
  const { lang, setLang, langs, meta } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className={cn(
          "flex items-center gap-2.5 w-full h-[34px] px-2.5 rounded-[7px] text-[13px] transition edge bg-white/[0.018]",
          open ? "text-stone-50 bg-white/[0.032]" : "text-stone-400 hover:text-stone-50 hover:bg-white/[0.032]",
        )}
      >
        <Languages size={15} className="text-stone-500" />
        <span>{meta(lang).label}</span>
        <ChevronDown size={15} className={cn("ml-auto transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 right-0 bottom-[calc(100%+8px)] p-1.5 rounded-[10px] bg-panel edge shadow-[0_36px_70px_-28px_rgba(0,0,0,0.85)] z-30 origin-bottom screen-in"
        >
          {langs.map((l) => {
            const m = meta(l);
            const on = l === lang;
            return (
              <button
                key={l}
                role="menuitemradio"
                aria-checked={on}
                onClick={() => {
                  setLang(l);
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-[7px] text-[13px] transition hover:bg-white/[0.032]",
                  on ? "text-stone-50" : "text-stone-400 hover:text-stone-50",
                )}
              >
                <span className="font-mono text-[11px] text-stone-500 w-[22px]">{m.glyph}</span>
                <span>{m.label}</span>
                <Check size={15} className={cn("ml-auto text-ember-400", on ? "opacity-100" : "opacity-0")} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ active, onNavigate }: { active: Screen; onNavigate: (s: Screen) => void }) {
  const { t } = useI18n();
  const items: { id: Screen; label: string; icon: typeof LayoutGrid }[] = [
    { id: "dashboard", label: t("nav_dashboard"), icon: LayoutGrid },
    { id: "engines", label: t("nav_engines"), icon: Settings },
  ];

  return (
    <aside className="sticky top-0 h-screen flex flex-col p-4 bg-gradient-to-b from-[#1a1715] to-[#161311] border-r border-white/[0.07]">
      <div className="px-2 pt-2 pb-1.5">
        <Brand />
      </div>

      <div className="mt-[18px] px-2 pb-2 font-mono text-[10.5px] tracking-[0.12em] uppercase text-stone-500">
        {t("nav_section")}
      </div>
      <nav className="flex flex-col gap-0.5">
        {items.map(({ id, label, icon: Icon }) => {
          const on = id === active;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              aria-current={on ? "page" : undefined}
              className={cn(
                "flex items-center gap-[11px] h-[38px] px-2.5 rounded-lg text-[13.5px] font-medium border transition",
                on
                  ? "text-ember-300 bg-ember-500/[0.08] edge-ember"
                  : "text-stone-400 border-transparent hover:text-stone-50 hover:bg-white/[0.032]",
              )}
            >
              <Icon size={18} strokeWidth={1.75} className={on ? "text-ember-400" : "text-stone-500"} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="flex-1" />

      <div className="flex flex-col gap-2.5 p-2 border-t border-white/[0.045]">
        <LanguageSelect />
        <div className="flex items-center gap-2 px-1 font-mono text-[11px] text-stone-500">
          <span className="w-[5px] h-[5px] rounded-full bg-ember-500 shadow-[0_0_7px_1px_rgba(249,115,22,0.45)]" />
          v0.1.0 · {t("local")}
        </div>
      </div>
    </aside>
  );
}
