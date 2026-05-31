#!/usr/bin/env bash
# Hephaestus' Forge — modo nativo.
# Arranca backend (:8000) y frontend (:3000) en el host, de modo que los engines
# CLI (claude / codex / gemini) instalados en tu PATH estén disponibles.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

echo "🔥 Hephaestus' Forge — modo nativo"

# --- backend ---
cd backend
if [ ! -d .venv ]; then
  echo "→ Creando venv e instalando dependencias del backend…"
  python3 -m venv .venv
  ./.venv/bin/pip install -q -r requirements.txt
fi
echo "→ Backend en http://localhost:8000"
./.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd "$ROOT"

# --- frontend ---
cd frontend
if [ ! -d node_modules ]; then
  echo "→ Instalando dependencias del frontend…"
  npm install
fi
echo "→ Frontend en http://localhost:3000"
npm run dev -- --port 3000 &
FRONTEND_PID=$!
cd "$ROOT"

trap 'echo; echo "Apagando…"; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true' INT TERM
echo
echo "✅ Listo. Abre http://localhost:3000  ·  Engines CLI detectados desde tu PATH."
wait
