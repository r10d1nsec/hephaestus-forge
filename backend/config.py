"""Configuración global de la aplicación (pydantic-settings)."""
from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    secret_key: str = "hephaestus-dev-key-change-me"
    database_url: str = "sqlite:///./data/hephaestus.db"
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    ollama_url: str = "http://localhost:11434"

    # Engines opcionales pre-cargados desde entorno (también configurables en la UI).
    anthropic_api_key: str | None = None
    openai_api_key: str | None = None
    gemini_api_key: str | None = None
    openai_compatible_base_url: str | None = None
    openai_compatible_api_key: str | None = None

    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
