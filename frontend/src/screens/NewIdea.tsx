import { useState } from "react";
import { ArrowRight, Flame, Lightbulb, Loader2 } from "lucide-react";
import { useI18n } from "../i18n";
import type { TranslationKey } from "../i18n";
import { Button, Input, Textarea } from "../components/ui";
import { api } from "../lib/api";
import type { Navigate } from "../App";

const chipKeys: TranslationKey[] = ["chip_1", "chip_2", "chip_3", "chip_4"];

export function NewIdea({ onNavigate }: { onNavigate: Navigate }) {
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  async function start() {
    if (!body.trim() || loading) return;
    setLoading(true);
    try {
      const p = await api.createProject(title.trim() || body.trim().slice(0, 48), body.trim());
      onNavigate("wizard", { project: { id: p.id, title: p.title } });
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="screen-in max-w-[680px] mx-auto mt-[clamp(10px,5vh,56px)]">
      <span className="inline-flex items-center gap-2 font-mono text-[11.5px] tracking-[0.14em] uppercase text-ember-400 whitespace-nowrap">
        <Flame size={15} />
        {t("new_idea_eyebrow")}
      </span>
      <h1 className="mt-3.5 text-[32px] font-semibold tracking-[-0.028em] text-stone-50">{t("idea_title")}</h1>
      <p className="mt-2.5 text-[15.5px] text-stone-400">{t("idea_sub")}</p>

      <div className="mt-[22px]">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("idea_title_ph")} />
      </div>
      <div className="mt-[22px]">
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={t("idea_body_ph")} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {chipKeys.map((k) => (
          <button
            key={k}
            onClick={() => setBody(t(k))}
            className="inline-flex items-center gap-[7px] max-w-full px-3.5 py-2 rounded-full text-[13px] text-stone-400 bg-white/[0.032] edge transition hover:text-stone-50 hover:border-ember-500/[0.32] hover:bg-ember-500/[0.05]"
          >
            <Lightbulb size={13} className="text-ember-500 shrink-0" />
            <span className="truncate">{t(k)}</span>
          </button>
        ))}
      </div>

      <div className="mt-[26px]">
        <Button variant="primary" size="lg" className="w-full" onClick={start} disabled={loading || !body.trim()}>
          {loading ? <Loader2 size={15} className="spin" /> : null}
          {t("start_wizard")}
          {!loading && <ArrowRight size={15} strokeWidth={1.75} />}
        </Button>
      </div>
    </div>
  );
}
