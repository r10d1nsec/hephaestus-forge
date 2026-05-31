/** Cliente de la API de Hephaestus' Forge (REST + SSE). */
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface Project {
  id: string;
  title: string;
  raw_idea: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface WizardSession {
  id: string;
  project_id: string;
  phase: string;
  messages: string;
}

export interface Document {
  id: string;
  project_id: string;
  doc_type: string;
  content: string;
  version: number;
}

export interface EngineConfig {
  kind: "api" | "ollama" | "cli";
  provider: string;
  model?: string | null;
  api_key?: string | null;
  base_url?: string | null;
}

async function jsonFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

export const api = {
  // --- engines ---
  detectEngines: () =>
    jsonFetch<{ clis: Record<string, boolean>; active: any }>("/api/engines/detect"),
  getActiveEngine: () => jsonFetch<{ active: any }>("/api/engines"),
  testEngine: (cfg: EngineConfig) =>
    jsonFetch<{ ok: boolean; message: string }>("/api/engines/test", {
      method: "POST",
      body: JSON.stringify(cfg),
    }),
  setActiveEngine: (cfg: EngineConfig) =>
    jsonFetch<{ active: any }>("/api/engines/active", {
      method: "PUT",
      body: JSON.stringify(cfg),
    }),

  // --- projects ---
  listProjects: () => jsonFetch<Project[]>("/api/projects"),
  createProject: (title: string, raw_idea: string) =>
    jsonFetch<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify({ title, raw_idea }),
    }),
  getProject: (id: string) => jsonFetch<Project>(`/api/projects/${id}`),
  deleteProject: (id: string) =>
    jsonFetch<{ deleted: string }>(`/api/projects/${id}`, { method: "DELETE" }),

  // --- wizard ---
  startSession: (projectId: string) =>
    jsonFetch<WizardSession>(`/api/projects/${projectId}/sessions`, { method: "POST" }),
  answer: (sessionId: string, content: string) =>
    jsonFetch<{ ok: boolean }>(`/api/sessions/${sessionId}/answer`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
  advance: (sessionId: string) =>
    jsonFetch<WizardSession | { finished: boolean }>(`/api/sessions/${sessionId}/advance`, {
      method: "POST",
    }),

  // --- documents ---
  listDocuments: (projectId: string) =>
    jsonFetch<Document[]>(`/api/projects/${projectId}/documents`),

  exportZipUrl: (projectId: string) => `${BASE}/api/projects/${projectId}/export/zip`,
};

/**
 * Consume un endpoint SSE y llama onEvent con cada objeto JSON recibido.
 * Devuelve un AbortController para poder cancelar la generación.
 */
export function streamSSE(
  path: string,
  onEvent: (data: any) => void,
  onDone?: () => void
): AbortController {
  const controller = new AbortController();
  (async () => {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    });
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop() || "";
      for (const ev of events) {
        const line = ev.replace(/^data: /, "").trim();
        if (line) {
          try {
            onEvent(JSON.parse(line));
          } catch {
            /* ignora fragmentos no-JSON */
          }
        }
      }
    }
    onDone?.();
  })().catch((err) => {
    if (err.name !== "AbortError") console.error("SSE error", err);
    onDone?.();
  });
  return controller;
}
