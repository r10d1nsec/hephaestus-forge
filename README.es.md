<div align="center">

# 🔥 Hephaestus' Forge

### Forja una idea difusa en una especificación lista para construir — con el motor de IA que ya tienes.

**Autoalojado · 100% local · Bring Your Own Engine**

[English](README.md) · [简体中文](README.zh.md) · [Español](README.es.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-f97316.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
![Self-hosted](https://img.shields.io/badge/self--hosted-yes-blue)

</div>

---

Deja de darle ideas a medio cocinar a tu agente de código. **Hephaestus' Forge** es una app web
autoalojada que te entrevista sobre tu idea y forja un pack de documentación completo —
**PRD, especificación técnica y una estimación de tiempo honesta**— lista para pegar en Claude Code,
Cursor, Codex o cualquier IDE con IA.

Y lo que nadie más hace: **funciona con la IA que ya tienes.**

## ⚡ Bring Your Own Engine

El resto de herramientas de planificación te atan a una sola API key. Hephaestus funciona con lo que
tengas — incluidos los agentes de coding ya instalados en tu máquina:

| Motor | Ejemplos | Disponible en |
|---|---|---|
| 🖥️ **Agentes CLI** | `claude` (Claude Code), `codex`, `gemini` | Modo nativo |
| ☁️ **Providers API** | Anthropic, OpenAI, Google Gemini, compatibles con OpenAI (OpenRouter, Groq…) | Docker + Nativo |
| 🧊 **Modelos locales** | Ollama (Llama, Mistral, Qwen…) | Docker + Nativo |

La app **autodetecta** los agentes CLI de tu `PATH` y te deja configurar providers API/Ollama en un
panel **Engines** dedicado — prueba la conexión, elige el predeterminado y listo. Tus claves se
guardan solo en un SQLite local y **nunca salen del contenedor.**

## 🚀 Inicio rápido

### Opción A — Docker (motores API + Ollama)

```bash
git clone https://github.com/angelroldanruiz/hephaestus-forge
cd hephaestus-forge
cp .env.example .env        # opcional — también puedes configurar motores en la UI
docker compose up -d
# abre http://localhost:3000
```

### Opción B — Modo nativo (desbloquea los agentes CLI 🔓)

```bash
git clone https://github.com/angelroldanruiz/hephaestus-forge
cd hephaestus-forge
./run.sh
# abre http://localhost:3000
```

## 🛠️ Cómo funciona

1. **Describe** tu idea en una frase o un párrafo.
2. **Responde** una entrevista breve generada por IA — una pregunta afilada cada vez, en streaming.
3. **Genera** el pack: **PRD · Spec Técnica · Estimación**.
4. **Exporta** un ZIP de Markdown limpio, listo como contexto para tu agente de código.

## 🤝 Contribuir

Hephaestus se construye en abierto y los PRs son bienvenidos — ver [CONTRIBUTING.md](CONTRIBUTING.md).
Añadir un nuevo engine es una primera contribución excelente.

## 📜 Licencia

[MIT](LICENSE) © 2026 Angel Roldan — Córdoba, España.

<div align="center">
<sub>Si Hephaestus te ahorró una refactorización, dale una ⭐ — ayuda de verdad.</sub>
</div>
