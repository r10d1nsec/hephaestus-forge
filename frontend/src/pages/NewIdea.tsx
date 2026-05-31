import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame } from "lucide-react";
import { api } from "../lib/api";

const EXAMPLES = [
  "Una app de fitness que genera rutinas con IA según tu equipamiento",
  "Un marketplace de servicios locales para mi ciudad",
  "Un SaaS que analiza reseñas de productos y resume el sentimiento",
  "Una extensión de navegador que resume artículos largos",
];

export default function NewIdea() {
  const [title, setTitle] = useState("");
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

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
        <span className="text-sm font-medium uppercase tracking-wider">Nueva idea</span>
      </div>
      <h1 className="text-3xl font-bold text-stone-50">Describe tu idea</h1>
      <p className="mt-2 text-forge-steel">
        Una frase o un párrafo. Hephaestus hará las preguntas correctas para forjarla.
      </p>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título (opcional)"
        className="mt-8 w-full rounded-lg border border-forge-border bg-forge-panel px-4 py-3 text-sm"
      />
      <textarea
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        rows={5}
        placeholder="Describe tu idea en una frase o párrafo…"
        className="mt-3 w-full rounded-lg border border-forge-border bg-forge-panel px-4 py-3 text-sm"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => setIdea(ex)}
            className="rounded-full border border-forge-border px-3 py-1 text-xs text-forge-steel hover:border-forge-ember hover:text-stone-100"
          >
            {ex.slice(0, 38)}…
          </button>
        ))}
      </div>

      <button
        onClick={create}
        disabled={loading || !idea.trim()}
        className="ember-glow mt-8 w-full rounded-lg bg-forge-ember py-3 font-semibold text-stone-950 disabled:opacity-50"
      >
        {loading ? "Creando…" : "Empezar el wizard →"}
      </button>
    </div>
  );
}
