import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Terminal,
  XCircle,
  Cpu,
  Cloud,
  CircleDashed,
} from "lucide-react";
import { api, EngineConfig } from "../../lib/api";
import { useT } from "../../i18n/useT";

type Tab = "cli" | "api" | "ollama";

const API_PROVIDERS = [
  { id: "anthropic", label: "Anthropic", placeholder: "claude-sonnet-4-6" },
  { id: "openai", label: "OpenAI", placeholder: "gpt-4o" },
  { id: "gemini", label: "Google Gemini", placeholder: "gemini-2.0-flash" },
  { id: "openai-compatible", label: "OpenAI-compatible", placeholder: "model-id" },
];

const CLI_META: Record<string, string> = {
  claude: "Claude Code",
  codex: "Codex CLI",
  gemini: "Gemini CLI",
};

export default function EngineManager() {
  const { t } = useT();
  const [tab, setTab] = useState<Tab>("cli");
  const [clis, setClis] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  // CLIs that passed a real "Test" (binary present in PATH != authenticated).
  const [verified, setVerified] = useState<Record<string, boolean>>({});

  // form state
  const [apiProvider, setApiProvider] = useState("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [apiModel, setApiModel] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [ollamaModel, setOllamaModel] = useState("llama3");

  useEffect(() => {
    api.detectEngines().then((d) => {
      setClis(d.clis);
      setActive(d.active);
    });
  }, []);

  function buildConfig(): EngineConfig | null {
    if (tab === "cli") return null; // se construye por botón concreto
    if (tab === "api")
      return {
        kind: "api",
        provider: apiProvider,
        model: apiModel || null,
        api_key: apiKey || null,
        base_url: apiProvider === "openai-compatible" ? baseUrl || null : null,
      };
    return { kind: "ollama", provider: "ollama", model: ollamaModel, base_url: ollamaUrl };
  }

  async function handleTest(cfg: EngineConfig) {
    setTesting(true);
    setResult(null);
    try {
      const res = await api.testEngine(cfg);
      setResult(res);
      if (cfg.kind === "cli") {
        setVerified((v) => ({ ...v, [cfg.provider]: res.ok }));
      }
    } catch (e: any) {
      setResult({ ok: false, message: String(e) });
    } finally {
      setTesting(false);
    }
  }

  async function handleActivate(cfg: EngineConfig) {
    await api.setActiveEngine(cfg);
    const d = await api.detectEngines();
    setActive(d.active);
    setResult({ ok: true, message: t("em.activated") });
  }

  const TabButton = ({ id, icon, label }: { id: Tab; icon: React.ReactNode; label: string }) => (
    <button
      onClick={() => { setTab(id); setResult(null); }}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
        tab === id ? "bg-forge-ember text-stone-950" : "bg-forge-border/50 text-forge-steel hover:text-stone-100"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {active && (
        <div className="rounded-lg border border-forge-ember/40 bg-forge-ember/10 px-4 py-3 text-sm">
          <span className="text-forge-steel">{t("em.activeEngine")} </span>
          <span className="font-semibold text-forge-ember-soft">
            {active.kind} · {active.provider}
            {active.model ? ` · ${active.model}` : ""}
          </span>
        </div>
      )}

      <div className="flex gap-2">
        <TabButton id="cli" icon={<Terminal size={16} />} label={t("em.tab.cli")} />
        <TabButton id="api" icon={<Cloud size={16} />} label={t("em.tab.api")} />
        <TabButton id="ollama" icon={<Cpu size={16} />} label={t("em.tab.ollama")} />
      </div>

      {/* --- CLI tab --- */}
      {tab === "cli" && (
        <div className="space-y-3">
          <p className="text-sm text-forge-steel">
            {t("em.cliNote1")}
            <br />
            <span className="text-forge-steel/70">
              <strong>{t("em.cliNoteWarnBold")}</strong> {t("em.cliNoteWarnRest")}
            </span>
          </p>
          {Object.entries(CLI_META).map(([id, label]) => {
            const available = clis[id];
            const isVerified = verified[id];
            const cfg: EngineConfig = { kind: "cli", provider: id, model: null };
            let icon, status;
            if (!available) {
              icon = <XCircle className="text-stone-600" size={18} />;
              status = t("em.status.notFound");
            } else if (isVerified) {
              icon = <CheckCircle2 className="text-emerald-500" size={18} />;
              status = t("em.status.verified");
            } else {
              icon = <CircleDashed className="text-amber-500" size={18} />;
              status = t("em.status.unverified");
            }
            return (
              <div
                key={id}
                className="flex items-center justify-between rounded-lg border border-forge-border bg-forge-panel px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {icon}
                  <span className="font-medium">{label}</span>
                  <code className="text-xs text-forge-steel">{id}</code>
                  <span className="text-xs text-forge-steel/70">· {status}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={!available || testing}
                    onClick={() => handleTest(cfg)}
                    className="rounded-md border border-forge-border px-3 py-1 text-xs hover:border-forge-ember disabled:opacity-40"
                  >
                    {t("em.test")}
                  </button>
                  <button
                    disabled={!available}
                    title={!isVerified ? t("em.useHint") : undefined}
                    onClick={() => handleActivate(cfg)}
                    className="rounded-md bg-forge-ember px-3 py-1 text-xs font-medium text-stone-950 disabled:opacity-40"
                  >
                    {t("em.use")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- API tab --- */}
      {tab === "api" && (
        <div className="space-y-3">
          <select
            value={apiProvider}
            onChange={(e) => setApiProvider(e.target.value)}
            className="w-full rounded-lg border border-forge-border bg-forge-panel px-3 py-2 text-sm"
          >
            {API_PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          {apiProvider === "openai-compatible" && (
            <input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="Base URL (https://openrouter.ai/api/v1)"
              className="w-full rounded-lg border border-forge-border bg-forge-panel px-3 py-2 text-sm"
            />
          )}
          <input
            value={apiModel}
            onChange={(e) => setApiModel(e.target.value)}
            placeholder={t("em.modelPlaceholder", {
              ph: API_PROVIDERS.find((p) => p.id === apiProvider)?.placeholder ?? "",
            })}
            className="w-full rounded-lg border border-forge-border bg-forge-panel px-3 py-2 text-sm"
          />
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={t("em.keyPlaceholder")}
            className="w-full rounded-lg border border-forge-border bg-forge-panel px-3 py-2 text-sm"
          />
          <EngineActions
            testing={testing}
            onTest={() => { const c = buildConfig(); if (c) handleTest(c); }}
            onActivate={() => { const c = buildConfig(); if (c) handleActivate(c); }}
          />
        </div>
      )}

      {/* --- Ollama tab --- */}
      {tab === "ollama" && (
        <div className="space-y-3">
          <input
            value={ollamaUrl}
            onChange={(e) => setOllamaUrl(e.target.value)}
            placeholder={t("em.ollamaUrl")}
            className="w-full rounded-lg border border-forge-border bg-forge-panel px-3 py-2 text-sm"
          />
          <input
            value={ollamaModel}
            onChange={(e) => setOllamaModel(e.target.value)}
            placeholder={t("em.ollamaModel")}
            className="w-full rounded-lg border border-forge-border bg-forge-panel px-3 py-2 text-sm"
          />
          <EngineActions
            testing={testing}
            onTest={() => { const c = buildConfig(); if (c) handleTest(c); }}
            onActivate={() => { const c = buildConfig(); if (c) handleActivate(c); }}
          />
        </div>
      )}

      {result && (
        <div
          className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
            result.ok
              ? "border-emerald-700 bg-emerald-950/40 text-emerald-300"
              : "border-red-800 bg-red-950/40 text-red-300"
          }`}
        >
          {result.ok ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <span>{result.message}</span>
        </div>
      )}
    </div>
  );
}

function EngineActions({
  testing,
  onTest,
  onActivate,
}: {
  testing: boolean;
  onTest: () => void;
  onActivate: () => void;
}) {
  const { t } = useT();
  return (
    <div className="flex gap-2">
      <button
        onClick={onTest}
        disabled={testing}
        className="flex items-center gap-2 rounded-lg border border-forge-border px-4 py-2 text-sm hover:border-forge-ember disabled:opacity-50"
      >
        {testing && <Loader2 size={14} className="animate-spin" />}
        {t("em.testConnection")}
      </button>
      <button
        onClick={onActivate}
        className="rounded-lg bg-forge-ember px-4 py-2 text-sm font-medium text-stone-950"
      >
        {t("em.activate")}
      </button>
    </div>
  );
}
