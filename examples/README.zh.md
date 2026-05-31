# 示例 — Hephaestus' Forge 的真实产出

[English](README.md) · [简体中文](README.zh.md)

以下文档由 **Hephaestus' Forge** 端到端生成，使用 **Claude Code CLI 引擎**（`claude -p`）在原生模式下运行
——无需 API Key，100% 本地。每个示例都从一句话和一段简短访谈开始，约 2–3 分钟内产出 PRD、技术规格与工时估算。

| 示例 | 想法（输入） | 产出 |
|---|---|---|
| [`streakly/`](streakly/) | "一个 AI 习惯追踪器，把任何大目标拆解为自适应的每日微任务，并在你漏打卡时自动重排。"（英文） | [PRD](streakly/prd.md) · [技术规格](streakly/tech_spec.md) · [估算](streakly/estimation.md) |
| [`dianxiaoer/`](dianxiaoer/) | "一个微信小程序，聚合小餐馆在多个外卖平台的订单，并用 AI 预测每日备货量。" | [PRD](dianxiaoer/prd.md) · [技术规格](dianxiaoer/tech_spec.md) · [估算](dianxiaoer/estimation.md) |

## 亮点

**1. 先追问，再规格化。** 向导在动笔之前先问了关键问题（问题、用户、差异化、MVP 范围、不做什么、平台），
所以 PRD 体现的是*决策*，而非臆测。

**2. 产出真正可开发。** 聚单宝 的 PRD 包含执行摘要、明确的用户画像、带验收标准的优先级用户故事
（P0/P1/P2）、明确的非目标与 KPI；技术规格给出有理由的技术栈、数据模型、API 路由与部署策略。

**3. 诚实的估算。** 估算报告按模块给出 min/max 区间、总工时、按投入度的时间线，以及**明确列出的风险因素**
——而不是一个乐观的单一数字。

**4. 用用户的语言表达。** 聚单宝 示例全程用中文驱动，整份文档以流畅、贴合业务的中文返回（甚至给出了产品名建议）。

## 自己复现

```bash
./run.sh                      # 原生模式 → 可用 CLI 引擎
# 在界面中：Engines → 测试并使用 "Claude Code" → 新建想法 → 完成向导 → 生成 → 导出 ZIP
```

> 这些文档在应用中渲染的截图见 [`../docs/screenshots/`](../docs/screenshots/)。
