"""Genera ejemplos reales end-to-end con el engine activo (Claude CLI).

Uso: PYTHONPATH=. python scripts_examples.py <slug> <lang>
Lee la definición del ejemplo de EXAMPLES[slug].
"""
from __future__ import annotations

import asyncio
import json
import os
import sys
import time

from sqlmodel import Session, SQLModel, create_engine

from models.project import Project
from models.session import WizardSession
from services.engines.cli import CliEngine
from services.engines.base import EngineConfig
from services.generator_service import MVP_DOCUMENTS, generate_document

EXAMPLES = {
    "standup": {
        "title": "Standup Forge — git activity → daily standup",
        "raw_idea": "A tool that turns my git commits and merged PRs into a concise daily standup summary and posts it to my team's Slack each morning.",
        "sessions": {
            "discovery": [
                ("assistant", "What concrete problem does this solve, and for whom?"),
                ("user", "I forget what I did yesterday and writing standups by hand wastes 10 minutes every morning. It's for me and my 4-person dev team."),
                ("assistant", "What's wrong with just reading the git log?"),
                ("user", "Raw commits are noisy and not readable by non-engineers; I want a human-readable summary grouped by project, not a commit dump."),
            ],
            "audience": [
                ("assistant", "Who reads the output and how technical are they?"),
                ("user", "The dev team and our non-technical PM read it in Slack. The PM mainly wants 'what shipped' in plain English."),
                ("assistant", "When and where is it used?"),
                ("user", "Automatically every weekday at 9am, posted to a Slack channel. Nobody should have to open an app."),
            ],
            "solution_fit": [
                ("assistant", "Should this run on its own, unattended, or do you interact with it?"),
                ("user", "Fully unattended. It should just run on a schedule and post — no UI, no clicking. I only want to tweak config rarely."),
                ("assistant", "Where would it run and what does it integrate with?"),
                ("user", "On a small server or a scheduled job. It reads the GitHub API (commits/PRs) and posts via a Slack webhook, using an LLM to summarize."),
            ],
            "scope": [
                ("assistant", "List the 3–5 MVP features."),
                ("user", "1) Pull yesterday's commits+merged PRs from GitHub, 2) summarize per repo with an LLM, 3) post a formatted message to Slack, 4) a simple config file for repos/channel."),
                ("assistant", "What's out of scope?"),
                ("user", "No web dashboard, no per-user accounts, no Jira/Linear integration in the MVP, no historical analytics."),
            ],
            "constraints": [
                ("assistant", "Budget, time, and your technical level?"),
                ("user", "Basically no budget beyond a cheap VPS and LLM API costs. I'm a mid-level developer comfortable with Python. I can spend a weekend on it."),
                ("assistant", "Solo or team, any deadline?"),
                ("user", "Solo build, no hard deadline — I want something working this weekend that we can iterate on."),
            ],
        },
    },
    "streakly": {
        "title": "Streakly — AI habit tracker",
        "raw_idea": "An AI habit tracker that turns any big goal into adaptive daily micro-tasks and reschedules automatically when you miss a day.",
        "sessions": {
            "discovery": [
                ("assistant", "What concrete problem does Streakly solve?"),
                ("user", "People set big goals but fail because they never break them into daily actions. Existing habit apps are dumb checklists with zero guidance."),
                ("assistant", "Who is the target user?"),
                ("user", "Busy professionals 25–40 building fitness, learning or side-project habits who lack a system to stay consistent."),
                ("assistant", "What makes it different from Habitica or Streaks?"),
                ("user", "AI decomposes any goal into adaptive daily micro-tasks and reschedules the plan when you miss days, instead of just guilt-tripping you."),
            ],
            "scope": [
                ("assistant", "List the 3–5 most important MVP features."),
                ("user", "1) Goal input + AI decomposition into micro-tasks, 2) daily task feed with check-off, 3) adaptive rescheduling on misses, 4) streak & progress view."),
                ("assistant", "What is explicitly out of scope for the MVP?"),
                ("user", "Social features, a gamified rewards store, and wearable integrations."),
                ("assistant", "Auth, platform and integrations?"),
                ("user", "Email + OAuth auth, mobile-first PWA, a single LLM provider, push notifications in a later version."),
            ],
        },
    },
    "dianxiaoer": {
        "title": "店小二 — 餐馆订单库存小程序",
        "raw_idea": "一个微信小程序，把小餐馆在多个外卖平台的订单聚合到一处，并用 AI 预测每日备货量，避免超卖和缺货。",
        "sessions": {
            "discovery": [
                ("assistant", "这个产品解决的具体问题是什么？"),
                ("user", "小餐馆同时用多个外卖平台，订单分散在不同App，库存靠手记，经常超卖或缺货。"),
                ("assistant", "目标用户是谁？"),
                ("user", "经营 1–3 家店的小餐馆老板，30–50 岁，不太懂技术，主要在手机上操作。"),
                ("assistant", "和现有工具相比，差异化在哪里？"),
                ("user", "把多平台订单聚合到一个微信小程序，并用 AI 根据历史销量预测每天该备多少货。"),
            ],
            "scope": [
                ("assistant", "请列出 MVP 的 3–5 个核心功能。"),
                ("user", "1) 多平台订单聚合视图，2) 库存管理与低库存提醒，3) AI 每日备货建议，4) 简单的销售日报。"),
                ("assistant", "MVP 明确不做什么？"),
                ("user", "不做会员营销、不做财务记账、不做 PC 端。"),
                ("assistant", "登录方式、平台与集成？"),
                ("user", "微信登录，微信小程序，接入主流外卖平台 API，单一 LLM 提供商。"),
            ],
        },
    },
}


async def run(slug: str) -> None:
    ex = EXAMPLES[slug]
    out_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "examples", slug)
    os.makedirs(out_dir, exist_ok=True)

    db_path = f"/tmp/hf_example_{slug}.db"
    if os.path.exists(db_path):
        os.remove(db_path)
    engine_db = create_engine(f"sqlite:///{db_path}", connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine_db)

    cli = CliEngine(EngineConfig(kind="cli", provider="claude"))

    with Session(engine_db) as db:
        project = Project(title=ex["title"], raw_idea=ex["raw_idea"])
        db.add(project)
        db.commit()
        for phase, msgs in ex["sessions"].items():
            db.add(WizardSession(
                project_id=project.id,
                phase=phase,
                messages=json.dumps([{"role": r, "content": c} for r, c in msgs], ensure_ascii=False),
            ))
        db.commit()

        for doc_type in MVP_DOCUMENTS:
            t = time.time()
            buf: list[str] = []
            async for piece in generate_document(cli, db, project.id, ex["raw_idea"], doc_type):
                buf.append(piece)
            content = "".join(buf).strip()
            # limpia posibles fences ```markdown que envuelvan todo el doc
            if content.startswith("```"):
                content = content.split("\n", 1)[-1].rsplit("```", 1)[0].strip()
            path = os.path.join(out_dir, f"{doc_type}.md")
            with open(path, "w", encoding="utf-8") as f:
                f.write(content + "\n")
            print(f"  ✓ {doc_type}: {len(content)} chars in {time.time()-t:.0f}s -> {path}")


if __name__ == "__main__":
    asyncio.run(run(sys.argv[1]))
