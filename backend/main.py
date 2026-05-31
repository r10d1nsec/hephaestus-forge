"""Hephaestus' Forge — API (FastAPI).

Punto de entrada. Registra routers y crea la BD al arrancar.
"""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import init_db
from routers import documents, engines, export, projects, sessions


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Hephaestus' Forge", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(engines.router)
app.include_router(projects.router)
app.include_router(sessions.router)
app.include_router(documents.router)
app.include_router(export.router)


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "hephaestus-forge", "version": "0.1.0"}
