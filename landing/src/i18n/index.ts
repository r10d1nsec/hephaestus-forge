export type Lang = "en" | "zh" | "es" | "fr" | "de";

export interface Dict {
  locale: Lang;
  dir?: "ltr";
  badge: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  byoTitle: string;
  byoSub: string;
  cli: string;
  cliDesc: string;
  apiP: string;
  apiDesc: string;
  local: string;
  localDesc: string;
  howTitle: string;
  steps: string[];
  privacy: string;
  footer: string;
}

export const LANGS: Lang[] = ["en", "zh", "es", "fr", "de"];
export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  zh: "简体中文",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
};

export const translations: Record<Lang, Dict> = {
  en: {
    locale: "en",
    badge: "Self-hosted · 100% local · Bring Your Own Engine",
    title: "Forge a vague idea into a build-ready spec.",
    subtitle:
      "Hephaestus interviews you about your idea and forges a PRD, technical spec and honest estimation — running on the AI engine you already have.",
    ctaPrimary: "Star on GitHub",
    ctaSecondary: "Quickstart",
    byoTitle: "Bring Your Own Engine",
    byoSub:
      "Every other tool locks you to one API key. Hephaestus runs on whatever you've got.",
    cli: "CLI agents",
    cliDesc: "Claude Code, Codex, Gemini CLI — auto-detected from your PATH.",
    apiP: "API providers",
    apiDesc: "Anthropic, OpenAI, Gemini, OpenAI-compatible (OpenRouter, Groq…).",
    local: "Local models",
    localDesc: "Ollama — Llama, Mistral, Qwen. Fully offline.",
    howTitle: "How it works",
    steps: [
      "Describe your idea in a sentence.",
      "Answer a short AI-generated interview, streamed live.",
      "Generate PRD · Tech Spec · Estimation.",
      "Export a clean Markdown ZIP for your AI IDE.",
    ],
    privacy: "Your keys live in a local SQLite file and never leave your machine.",
    footer: "MIT licensed · Built in the open",
  },
  zh: {
    locale: "zh",
    badge: "自托管 · 100% 本地 · 自带引擎",
    title: "用你现有的 AI 引擎，把模糊的想法锻造成可开发的规格。",
    subtitle:
      "Hephaestus 就你的想法进行结构化提问，锻造出 PRD、技术规格与诚实的工时估算——直接运行在你已有的 AI 引擎上。",
    ctaPrimary: "在 GitHub 点亮 Star",
    ctaSecondary: "快速开始",
    byoTitle: "自带引擎（Bring Your Own Engine）",
    byoSub: "其他工具都把你锁死在某个 API Key 上。Hephaestus 用你手头的任何东西运行。",
    cli: "CLI 智能体",
    cliDesc: "Claude Code、Codex、Gemini CLI——自动从你的 PATH 检测。",
    apiP: "API 提供商",
    apiDesc: "Anthropic、OpenAI、Gemini、OpenAI 兼容（OpenRouter、Groq…）。",
    local: "本地模型",
    localDesc: "Ollama——Llama、Mistral、Qwen，完全离线。",
    howTitle: "工作流程",
    steps: [
      "一句话描述你的想法。",
      "回答 AI 生成的简短访谈，实时流式输出。",
      "生成 PRD · 技术规格 · 工时估算。",
      "导出干净的 Markdown ZIP，投喂给你的 AI IDE。",
    ],
    privacy: "你的密钥保存在本地 SQLite 文件中，绝不离开你的机器。",
    footer: "MIT 许可证 · 公开开发",
  },
  es: {
    locale: "es",
    badge: "Autoalojado · 100% local · Bring Your Own Engine",
    title: "Forja una idea difusa en una especificación lista para construir.",
    subtitle:
      "Hephaestus te entrevista sobre tu idea y forja un PRD, una spec técnica y una estimación honesta — con el motor de IA que ya tienes.",
    ctaPrimary: "Star en GitHub",
    ctaSecondary: "Inicio rápido",
    byoTitle: "Bring Your Own Engine",
    byoSub: "El resto te ata a una API key. Hephaestus funciona con lo que tengas.",
    cli: "Agentes CLI",
    cliDesc: "Claude Code, Codex, Gemini CLI — autodetectados desde tu PATH.",
    apiP: "Providers API",
    apiDesc: "Anthropic, OpenAI, Gemini, compatibles con OpenAI (OpenRouter, Groq…).",
    local: "Modelos locales",
    localDesc: "Ollama — Llama, Mistral, Qwen. Totalmente offline.",
    howTitle: "Cómo funciona",
    steps: [
      "Describe tu idea en una frase.",
      "Responde una entrevista breve generada por IA, en streaming.",
      "Genera PRD · Spec Técnica · Estimación.",
      "Exporta un ZIP de Markdown limpio para tu IDE con IA.",
    ],
    privacy: "Tus claves viven en un SQLite local y nunca salen de tu máquina.",
    footer: "Licencia MIT · Construido en abierto",
  },
  fr: {
    locale: "fr",
    badge: "Auto-hébergé · 100% local · Bring Your Own Engine",
    title: "Forgez une idée floue en une spec prête à coder.",
    subtitle:
      "Hephaestus vous interroge sur votre idée et forge un PRD, une spec technique et une estimation honnête — avec le moteur d'IA que vous avez déjà.",
    ctaPrimary: "Star sur GitHub",
    ctaSecondary: "Démarrage rapide",
    byoTitle: "Bring Your Own Engine",
    byoSub: "Les autres outils vous enferment dans une seule clé API. Hephaestus tourne avec ce que vous avez.",
    cli: "Agents CLI",
    cliDesc: "Claude Code, Codex, Gemini CLI — détectés depuis votre PATH.",
    apiP: "Fournisseurs API",
    apiDesc: "Anthropic, OpenAI, Gemini, compatibles OpenAI (OpenRouter, Groq…).",
    local: "Modèles locaux",
    localDesc: "Ollama — Llama, Mistral, Qwen. Totalement hors-ligne.",
    howTitle: "Comment ça marche",
    steps: [
      "Décrivez votre idée en une phrase.",
      "Répondez à un court entretien généré par l'IA, en streaming.",
      "Générez PRD · Spec Technique · Estimation.",
      "Exportez un ZIP Markdown propre pour votre IDE IA.",
    ],
    privacy: "Vos clés restent dans un SQLite local et ne quittent jamais votre machine.",
    footer: "Licence MIT · Développé en open source",
  },
  de: {
    locale: "de",
    badge: "Self-hosted · 100% lokal · Bring Your Own Engine",
    title: "Schmiede eine vage Idee zu einer baufertigen Spezifikation.",
    subtitle:
      "Hephaestus befragt dich zu deiner Idee und schmiedet ein PRD, eine technische Spec und eine ehrliche Schätzung — mit der KI-Engine, die du bereits hast.",
    ctaPrimary: "Auf GitHub sternen",
    ctaSecondary: "Schnellstart",
    byoTitle: "Bring Your Own Engine",
    byoSub: "Andere Tools binden dich an einen API-Key. Hephaestus läuft mit dem, was du hast.",
    cli: "CLI-Agenten",
    cliDesc: "Claude Code, Codex, Gemini CLI — automatisch aus deinem PATH erkannt.",
    apiP: "API-Anbieter",
    apiDesc: "Anthropic, OpenAI, Gemini, OpenAI-kompatibel (OpenRouter, Groq…).",
    local: "Lokale Modelle",
    localDesc: "Ollama — Llama, Mistral, Qwen. Komplett offline.",
    howTitle: "So funktioniert's",
    steps: [
      "Beschreibe deine Idee in einem Satz.",
      "Beantworte ein kurzes, KI-generiertes Interview, live gestreamt.",
      "Generiere PRD · Tech-Spec · Schätzung.",
      "Exportiere ein sauberes Markdown-ZIP für deine KI-IDE.",
    ],
    privacy: "Deine Keys liegen in einer lokalen SQLite-Datei und verlassen nie deinen Rechner.",
    footer: "MIT-lizenziert · Offen entwickelt",
  },
};
