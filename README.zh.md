<div align="center">

# 🔥 Hephaestus' Forge（赫菲斯托斯熔炉）

### 用你现有的 AI 引擎，把模糊的想法锻造成可直接开发的规格文档。

**自托管 · 100% 本地 · 自带引擎（Bring Your Own Engine）**

[English](README.md) · [简体中文](README.zh.md) · [Español](README.es.md)

[![网站](https://img.shields.io/badge/🌐_网站-在线演示-f97316?style=for-the-badge)](https://r10d1nsec.github.io/hephaestus-forge/)
[![在 GitHub 点 Star](https://img.shields.io/badge/⭐_点亮-Star-1c1917?style=for-the-badge)](https://github.com/r10d1nsec/hephaestus-forge)

[![License: MIT](https://img.shields.io/badge/License-MIT-f97316.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub stars](https://img.shields.io/github/stars/r10d1nsec/hephaestus-forge?color=f97316)](https://github.com/r10d1nsec/hephaestus-forge/stargazers)
![Self-hosted](https://img.shields.io/badge/self--hosted-yes-blue)

🌐 **[网站与演示](https://r10d1nsec.github.io/hephaestus-forge/)** · 📂 **[示例](examples/README.zh.md)** · 🚀 **[快速开始](#-快速开始)** · 🤝 **[参与贡献](#-参与贡献)**

</div>

---

别再把没想清楚的点子直接丢给编程智能体了。**Hephaestus' Forge** 是一个自托管的 Web 应用：
它会就你的想法对你进行结构化提问，然后锻造出一整套文档——**PRD（产品需求文档）、技术规格、
以及诚实的工时估算**——可直接投喂给 Claude Code、Cursor、Codex 或任意 AI IDE。

而且它做了别人没做的事：**直接运行在你已经拥有的 AI 上。**

## ✨ 为什么用它

- 🔒 **默认隐私**：100% 自托管。你的想法和 API Key 只存在本地，**绝不离开你的机器**，无遥测、无 SaaS 账号。
- ⚡ **自带引擎**：用你已有的编程智能体（Claude Code、Codex、Gemini CLI）+ Ollama + 任意 API，零厂商锁定。
- 🧭 **帮你选对方案**：在动一行代码之前，告诉你该做的是自动化、智能体、网页还是 App——别再用 App 解决一个脚本就能搞定的事。
- 💸 **省 Token、省重构**：先有清晰规格，智能体一次就把对的东西做出来。
- 🌍 **多语言**：界面支持 EN · 中文 · ES · FR · DE，所选语言还会驱动访谈问题与生成的文档。
- 🆓 **开源（MIT）**：永久免费，随意扩展、Fork、发布。

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
git clone https://github.com/r10d1nsec/hephaestus-forge
cd hephaestus-forge
cp .env.example .env        # 可选，也可在 UI 中配置引擎
docker compose up -d
# 打开 http://localhost:3000
```

### 方式 B — 原生模式（解锁 CLI 智能体 🔓）

在宿主机运行，从而能调用 `PATH` 中的 `claude` / `codex` / `gemini`：

```bash
git clone https://github.com/r10d1nsec/hephaestus-forge
cd hephaestus-forge
./run.sh
# 打开 http://localhost:3000
```

## 🛠️ 工作流程

1. **描述**你的想法，一句话或一段话都行。
2. **回答**由 AI 生成的简短访谈——每次一个精准问题，实时流式输出，覆盖五个阶段：
   **探索 → 受众 → 方案匹配 → 范围 → 约束**。正是这一步让 Hephaestus 能推荐*正确形态*的方案。
3. **生成**以**项目蓝图**为首的文档包（推荐方案、规模、时间、阶段、范围）+ **PRD · 技术规格 · 工时估算**。
4. **导出**为干净的 Markdown ZIP，直接作为编程智能体的上下文。

> 🌍 整个应用支持多语言（EN · 中文 · ES · FR · DE）；所选语言同时决定访谈问题与文档的语言。

## 📂 真实示例

三套由 Hephaestus 用 Claude Code 引擎端到端生成的文档：

- 🤖 [**Standup Forge**](examples/standup/) — git 活动 → 每日站会（其[蓝图](examples/standup/blueprint.md)推荐**定时自动化而非网页应用**）
- 🇬🇧 [**Streakly**](examples/streakly/) — AI 习惯追踪器
- 🇨🇳 [**聚单宝**](examples/dianxiaoer/) — 餐馆订单库存小程序（全中文）

详见 [`examples/`](examples/README.zh.md)。

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

**Hephaestus 完全公开开发，是贡献者让它变得更好。** 无论你写不写代码，都有参与的方式：

- ⭐ **点亮 Star** —— 帮项目触达更多开发者，最简单也最有效。
- 🖥️ **新增一个引擎** —— 价值最高的贡献，每个引擎都带来一个新社区。[CONTRIBUTING.md](CONTRIBUTING.md) 里有"**20 分钟添加你的第一个引擎**"实战教程。
- 🌍 **翻译** —— 新增 `README.<lang>.md` 或界面语言，触达新受众。
- 📝 **改进提示词** —— 向导与生成器只是 `backend/prompts/` 里的 Markdown，无需写代码。
- 🐛 **报告 Bug** 或 💡 **提建议** —— [提交 Issue](https://github.com/r10d1nsec/hephaestus-forge/issues)。

新手可从 [`good first issue`](https://github.com/r10d1nsec/hephaestus-forge/labels/good%20first%20issue) 开始，我们维护了一份[种子任务清单](docs/GOOD_FIRST_ISSUES.md)。请友善相待，见[行为准则](CODE_OF_CONDUCT.md)。

> 每一个 Star、Issue 和 PR 都真切地推动着项目前进。感谢与我们一起锻造。🔥

## 📜 许可证

[MIT](LICENSE) © 2026 Angel Roldan

<div align="center">
<br/>

### 如果 Hephaestus 帮你省下了一次重构，请点个 ⭐

[![在 GitHub 点 Star](https://img.shields.io/badge/⭐_在_GitHub_点亮_Star-f97316?style=for-the-badge)](https://github.com/r10d1nsec/hephaestus-forge)
[![访问网站](https://img.shields.io/badge/🌐_访问网站-1c1917?style=for-the-badge)](https://r10d1nsec.github.io/hephaestus-forge/)

</div>
