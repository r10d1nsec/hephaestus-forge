<div align="center">

# 🔥 Hephaestus' Forge（赫菲斯托斯熔炉）

### 用你现有的 AI 引擎，把模糊的想法锻造成可直接开发的规格文档。

**自托管 · 100% 本地 · 自带引擎（Bring Your Own Engine）**

[English](README.md) · [简体中文](README.zh.md) · [Español](README.es.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-f97316.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
![Self-hosted](https://img.shields.io/badge/self--hosted-yes-blue)

</div>

---

别再把没想清楚的点子直接丢给编程智能体了。**Hephaestus' Forge** 是一个自托管的 Web 应用：
它会就你的想法对你进行结构化提问，然后锻造出一整套文档——**PRD（产品需求文档）、技术规格、
以及诚实的工时估算**——可直接投喂给 Claude Code、Cursor、Codex 或任意 AI IDE。

而且它做了别人没做的事：**直接运行在你已经拥有的 AI 上。**

## ⚡ 自带引擎（Bring Your Own Engine）

其他规划工具都把你锁死在某一个 API Key 上。Hephaestus 用你手头的任何东西运行——
包括你机器上已经装好的编程智能体：

| 引擎类型 | 示例 | 可用环境 |
|---|---|---|
| 🖥️ **CLI 智能体** | `claude`（Claude Code）、`codex`、`gemini` | 原生模式 |
| ☁️ **API 提供商** | Anthropic、OpenAI、Google Gemini、OpenAI 兼容（OpenRouter、Groq…） | Docker + 原生 |
| 🧊 **本地模型** | Ollama（Llama、Mistral、Qwen…） | Docker + 原生 |

应用会**自动检测** `PATH` 中的 CLI 智能体，并提供专门的 **Engines 面板**配置 API/Ollama——
测试连接、设为默认即可。你的密钥只存在本地 SQLite 文件中，**绝不离开容器**。

## 🚀 快速开始

### 方式 A — Docker（API + Ollama 引擎）

```bash
git clone https://github.com/angelroldanruiz/hephaestus-forge
cd hephaestus-forge
cp .env.example .env        # 可选，也可在 UI 中配置引擎
docker compose up -d
# 打开 http://localhost:3000
```

### 方式 B — 原生模式（解锁 CLI 智能体 🔓）

在宿主机运行，从而能调用 `PATH` 中的 `claude` / `codex` / `gemini`：

```bash
git clone https://github.com/angelroldanruiz/hephaestus-forge
cd hephaestus-forge
./run.sh
# 打开 http://localhost:3000
```

## 🛠️ 工作流程

1. **描述**你的想法，一句话或一段话都行。
2. **回答**由 AI 生成的简短访谈——每次一个精准问题，实时流式输出。
3. **生成**文档包：**PRD · 技术规格 · 工时估算**。
4. **导出**为干净的 Markdown ZIP，直接作为编程智能体的上下文。

## 🆚 为什么选 Hephaestus

| | GTPlanner | DocForge-AI | ideaforge.chat | **Hephaestus' Forge** |
|---|:---:|:---:|:---:|:---:|
| 自托管 / 隐私 | ✅ | ✅ | ❌（SaaS） | ✅ |
| 一条命令 Docker | ❌ | ❌ | — | ✅ |
| **CLI 智能体（Claude Code/Codex/Gemini）** | ❌ | ❌ | ❌ | ✅ |
| 本地模型（Ollama） | ❌ | ❌ | ❌ | ✅ |
| 引导式向导界面 | ❌ | ❌ | ✅ | ✅ |
| 诚实的工时估算 | ❌ | ❌ | ❌ | ✅ |
| 开源（MIT） | ✅ | ✅ | ❌ | ✅ |

## 🤝 参与贡献

Hephaestus 完全公开开发，欢迎 PR——见 [CONTRIBUTING.md](CONTRIBUTING.md)。
新增一个引擎是非常棒的第一次贡献。

## 📜 许可证

[MIT](LICENSE) © 2026 Angel Roldan

<div align="center">
<sub>如果 Hephaestus 帮你省下了一次重构，欢迎点个 ⭐，这对项目真的很有帮助。</sub>
</div>
