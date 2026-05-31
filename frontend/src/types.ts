export type Screen = "dashboard" | "new-idea" | "wizard" | "documents" | "engines";

export type EngineStatus = "verified" | "detected" | "notfound";

export interface Project {
  id: string;
  title: string;
  description: string; // = raw_idea
  flag?: string; // emoji opcional (los proyectos reales no lo traen)
  status: "complete" | "draft" | "refining";
}

export interface CliEngine {
  id: string;
  name: string;
  command: string;
  status: EngineStatus;
  active?: boolean;
}
