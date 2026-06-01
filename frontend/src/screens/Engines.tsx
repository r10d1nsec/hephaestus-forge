import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Check, CheckCircle2, CircleCheck, Cloud, Cpu, Flame, Terminal, XCircle } from "lucide-react";
import { useI18n } from "../i18n";
import { Button, Input, Select, Tabs } from "../components/ui";
import { EngineRow } from "../components/EngineRow";
import { api } from "../lib/api";
import type { EngineConfig } from "../lib/api";
import type { CliEngine, EngineStatus } from "../types";

type TabId = "cli" | "api" | "ollama";

const CLI_META: { id: string; name: string }[] = [
  { id: "claude", name: "Claude Code" },
  { id: "codex", name: "Codex CLI" },
  { id: "gemini", name: "Gemini CLI" },
  { id: "opencode", name: "opencode" },
];

const API_PROVIDERS = [
  { id: "anthropic", label: "Anthropic", model: "claude-sonnet-4-6" },
  { id: "openai", label: "OpenAI", model: "gpt-4o" },
  { id: "gemini", label: "Google Gemini", model: "gemini-2.0-flash" },
  { id: "openai-compatible", label: "OpenAI-compatible", model: "model-id" },
];

export function Engines() {
  const { t } = useI18n();
  const [tab, setTab] = useState<TabId>("cli");
  const [clis, setClis] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState<any>(null);
  const [verified, setVerified] = useState<Record<string, boolean>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  // API / Ollama form state
  const [apiProvider, setApiProvider] = useState("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [apiModel, setApiModel] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://openrouter.ai/api/v1");
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [ollamaModel, setOllamaModel] = useState("llama3");

  async function refresh() {
    const d = await api.detectEngines();
    setClis(d.clis);
    setActive(d.active);
  }
  useEffect(() => {
    refresh();
  }, []);

  function cliEngine(id: string, name: string): CliEngine {
    let status: EngineStatus = "notfound";
    if (verified[id]) status = "verified";
    else if (clis[id]) status = "detected";
    const isActive = active?.kind === "cli" && active?.provider === id;
    return { id, name, command: id, status, active: isActive };
  }

  async function runTest(cfg: EngineConfig, id: string) {
    setBusyId(id);
    setResult(null);
    try {
      const r = await api.testEngine(cfg);
      setResult(r);
      if (cfg.kind === "cli") setVerified((v) => ({ ...v, [cfg.provider]: r.ok }));
    } catch (e: any) {
      setResult({ ok: false, message: String(e) });
    } finally {
      setBusyId(null);
    }
  }

  async function activate(cfg: EngineConfig) {
    await api.setActiveEngine(cfg);
    await refresh();
    setResult({ ok: true, message: t("save_use") + " ✓" });
  }

  const apiConfig = (): EngineConfig => ({
    kind: "api",
    provider: apiProvider,
    model: apiModel || API_PROVIDERS.find((p) => p.id === apiProvider)?.model || null,
    api_key: apiKey || null,
    base_url: apiProvider === "openai-compatible" ? baseUrl || null : null,
  });
  const ollamaConfig = (): EngineConfig => ({
    kind: "ollama",
    provider: "ollama",
    model: ollamaModel,
    base_url: ollamaUrl,
  });

  return (
    <div className="screen-in">
      <header className="mb-[30px]">
        <h1 className="text-[25px] font-semibold tracking-[-0.022em] text-stone-50">{t("nav_engines")}</h1>
        <p className="mt-1.5 text-[14.5px] text-stone-400 max-w-[60ch]">{t("engines_sub")}</p>
      </header>

      {active && (
        <div className="flex items-center gap-3.5 px-[18px] py-3.5 rounded-[14px] mb-6 edge-ember [background:radial-gradient(120%_180%_at_0%_50%,rgba(249,115,22,0.1),transparent_60%),rgba(255,255,255,0.018)]">
          <span className="grid place-items-center w-9 h-9 rounded-[9px] text-ember-400 bg-ember-500/10 edge-ember shrink-0">
            <Flame size={18} />
          </span>
          <span className="text-[13.5px] text-stone-400">
            {t("active_engine")}:{" "}
            <b className="text-stone-50 font-semibold">{active.kind} · {active.provider}</b>
            {active.model ? ` · ${active.model}` : ""}
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11.5px] text-ember-300 px-2.5 py-1 rounded-md bg-ember-500/[0.08] edge-ember whitespace-nowrap">
            <CircleCheck size={12} /> {t("active_engine")}
          </span>
        </div>
      )}

      <Tabs
        active={tab}
        onChange={(id) => { setTab(id as TabId); setResult(null); }}
        items={[
          { id: "cli", label: t("tab_cli"), icon: <Terminal size={15} /> },
          { id: "api", label: t("tab_api"), icon: <Cloud size={15} /> },
          { id: "ollama", label: t("tab_ollama"), icon: <Cpu size={15} /> },
        ]}
      />

      <div className="mt-[18px]">
        {tab === "cli" && (
          <div className="screen-in">
            <p className="text-[13.5px] text-stone-400 mb-4 max-w-[70ch]">
              {t("cli_note_a")} <b className="text-stone-300 font-medium">{t("cli_note_b")}</b> {t("cli_note_c")}
            </p>
            <div className="flex flex-col gap-2.5">
              {CLI_META.map(({ id, name }) => {
                const e = cliEngine(id, name);
                const cfg: EngineConfig = { kind: "cli", provider: id, model: null };
                return (
                  <EngineRow
                    key={id}
                    engine={e}
                    busy={busyId === id}
                    onTest={() => runTest(cfg, id)}
                    onUse={() => activate(cfg)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {tab === "api" && (
          <div className="screen-in">
            <p className="text-[13.5px] text-stone-400 mb-4 max-w-[70ch]">{t("api_note")}</p>
            <div className="grid gap-4 max-w-[560px]">
              <Field label={t("lbl_provider")}>
                <Select value={apiProvider} onChange={(e) => setApiProvider(e.target.value)}>
                  {API_PROVIDERS.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </Select>
              </Field>
              {apiProvider === "openai-compatible" && (
                <Field label={t("lbl_baseurl")}>
                  <Input className="font-mono text-[13px]" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
                </Field>
              )}
              <Field label={t("lbl_model")}>
                <Input value={apiModel} onChange={(e) => setApiModel(e.target.value)} placeholder={API_PROVIDERS.find((p) => p.id === apiProvider)?.model} />
              </Field>
              <Field label={t("lbl_key")}>
                <Input className="font-mono text-[13px]" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={t("lbl_key")} />
              </Field>
              <div className="flex gap-2.5 mt-1">
                <Button variant="ghost" disabled={busyId === "api"} onClick={() => runTest(apiConfig(), "api")}>{t("test_conn")}</Button>
                <Button variant="primary" onClick={() => activate(apiConfig())}>
                  <Check size={14} strokeWidth={2.2} />
                  {t("save_use")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {tab === "ollama" && (
          <div className="screen-in">
            <p className="text-[13.5px] text-stone-400 mb-4 max-w-[70ch]">{t("ollama_note")}</p>
            <div className="grid gap-4 max-w-[560px]">
              <Field label={t("lbl_baseurl")}>
                <Input className="font-mono text-[13px]" value={ollamaUrl} onChange={(e) => setOllamaUrl(e.target.value)} />
              </Field>
              <Field label={t("lbl_model")}>
                <Input value={ollamaModel} onChange={(e) => setOllamaModel(e.target.value)} placeholder="llama3, qwen2.5, mistral…" />
              </Field>
              <div className="flex gap-2.5 mt-1">
                <Button variant="ghost" disabled={busyId === "ollama"} onClick={() => runTest(ollamaConfig(), "ollama")}>{t("test_conn")}</Button>
                <Button variant="primary" onClick={() => activate(ollamaConfig())}>
                  <Check size={14} strokeWidth={2.2} />
                  {t("save_use")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div
            className={`flex items-start gap-2 mt-5 px-4 py-3 rounded-[10px] text-[13px] max-w-[640px] ${
              result.ok ? "text-ok bg-ok/[0.08] border border-ok/30" : "text-[#e0795c] bg-[rgba(216,90,60,0.08)] border border-[rgba(216,90,60,0.3)]"
            }`}
          >
            {result.ok ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <span>{result.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-[12.5px] text-stone-400 mb-[7px] font-medium">{label}</label>
      {children}
    </div>
  );
}
