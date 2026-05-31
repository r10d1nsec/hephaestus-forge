import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame } from "lucide-react";
import { api } from "../lib/api";
import { useT } from "../i18n/useT";

export default function NewIdea() {
  const { t, tList } = useT();
  const [title, setTitle] = useState("");
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const examples = tList("new.examples");

  async function create() {
    if (!idea.trim()) return;
    setLoading(true);
    const project = await api.createProject(title.trim() || idea.slice(0, 40), idea.trim());
    nav(`/project/${project.id}/wizard`);
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-16">
      <div className="mb-2 flex items-center gap-2 text-forge-ember">
        <Flame size={22} />
        <span className="text-sm font-medium uppercase tracking-wider">{t("new.label")}</span>
      </div>
      <h1 className="text-3xl font-bold text-stone-50">{t("new.title")}</h1>
      <p className="mt-2 text-forge-steel">{t("new.subtitle")}</p>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("new.titlePlaceholder")}
        className="mt-8 w-full rounded-lg border border-forge-border bg-forge-panel px-4 py-3 text-sm"
      />
      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        rows={5}
        placeholder={t("new.ideaPlaceholder")}
        className="mt-3 w-full rounded-lg border border-forge-border bg-forge-panel px-4 py-3 text-sm"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => setIdea(ex)}
            className="rounded-full border border-forge-border px-3 py-1 text-xs text-forge-steel hover:border-forge-ember hover:text-stone-100"
          >
            {ex.length > 40 ? ex.slice(0, 38) + "…" : ex}
          </button>
        ))}
      </div>

      <button
        onClick={create}
        disabled={loading || !idea.trim()}
        className="ember-glow mt-8 w-full rounded-lg bg-forge-ember py-3 font-semibold text-stone-950 disabled:opacity-50"
      >
        {loading ? t("new.creating") : t("new.start")}
      </button>
    </div>
  );
}
