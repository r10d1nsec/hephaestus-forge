# IdeaForge — Plan Completo de Desarrollo
## Docker Open Source para Vibecoders e Ingenieros de IA

---

## 1. RESUMEN EJECUTIVO

**IdeaForge** es un contenedor Docker autoalojado y de código abierto que permite a vibecoders, desarrolladores de IA y emprendedores digitales transformar una idea difusa en documentación de proyecto estructurada, realista y lista para ser desarrollada con herramientas de IA (Claude Code, Cursor, Copilot, etc.).

**Problema que resuelve:**
- Los developers arrancan a codificar sin un plan sólido → tokens desperdiciados, refactorizaciones costosas
- Las ideas no están bien definidas → los modelos de IA generan código incorrecto o incompleto
- No se tiene estimación realista de tiempo y complejidad antes de empezar
- Falta de documentación estructurada que sirva como contexto para la IA

**Solución:**
Una interfaz web guiada por preguntas inteligentes que extrae, organiza y amplía la idea del usuario, entregando un paquete completo: PRD, arquitectura técnica, estimación de tiempo, mapa de user flows, stack recomendado y prompts optimizados para Claude.

---

## 2. REPOSITORIOS OPEN SOURCE DE REFERENCIA

### 2.1 GTPlanner (OpenSQZ/GTPlanner)
- **URL:** https://github.com/OpenSQZ/GTPlanner
- **Stars:** ~800+
- **Descripción:** Agente IA para generación de PRDs optimizados para vibe coding
- **Stack:** Python, FastAPI, Markdown output
- **Lo que aporta a IdeaForge:** Flujo de preguntas → PRD estructurado; optimizado específicamente para Cursor/Claude
- **Carencias:** Sin interfaz visual atractiva, sin Docker compose simple, sin estimación de tiempo

### 2.2 Open WebUI (open-webui/open-webui)
- **URL:** https://github.com/open-webui/open-webui
- **Stars:** ~60K+
- **Descripción:** Interfaz web self-hosted para LLMs (Ollama, OpenAI compatible)
- **Stack:** Svelte + TypeScript + Python (FastAPI), Docker nativo
- **Lo que aporta a IdeaForge:** Patrón de despliegue Docker de referencia; UX de chat adaptable; sistema de pipelines
- **Carencias:** Propósito genérico, no orientado a planificación de proyectos

### 2.3 DocForge-AI (Venkatesh188/docforge-ai)
- **URL:** https://github.com/Venkatesh188/docforge-ai
- **Stars:** ~200+
- **Descripción:** Genera documentación enterprise desde una descripción de idea
- **Stack:** Python, Claude API, Markdown/PDF output
- **Outputs:** PRD, SRS, arquitectura de sistema, estrategia de tests, guías de deployment
- **Lo que aporta a IdeaForge:** Catálogo de tipos de documentos a generar; integración con Claude
- **Carencias:** Sin interfaz guiada por preguntas, sin Docker compose, sin UX wizard

### 2.4 AI PRD Generator Plugin (cdeust/ai-prd-generator-plugin)
- **URL:** https://github.com/cdeust/ai-prd-generator-plugin
- **Stars:** ~150+
- **Descripción:** Plugin Claude Code para generación de PRDs enterprise con verificación y export a JIRA
- **Stack:** Claude Code plugin, JSON
- **Lo que aporta a IdeaForge:** Multi-round clarification workflow; verificación de PRD; export formats
- **Carencias:** Sin UI visual, sólo plugin de terminal

### 2.5 PRD Creator (AungMyoKyaw/prd-creator)
- **URL:** https://github.com/AungMyoKyaw/prd-creator
- **Stack:** Node.js, Gemini AI
- **Descripción:** Transforma ideas de producto en PRDs completos vía Gemini
- **Lo que aporta a IdeaForge:** Patrón de transformación idea → PRD; estructura de documento
- **Carencias:** Single-LLM, sin wizard interactivo, sin Docker

### 2.6 AI Dev Tasks / create-prd.md (snarktank/ai-dev-tasks)
- **URL:** https://github.com/snarktank/ai-dev-tasks/blob/main/create-prd.md
- **Descripción:** Prompt template de referencia para Claude: recibe descripción → hace 3-5 preguntas → genera PRD
- **Lo que aporta a IdeaForge:** Estructura de preguntas de clarificación; secciones del PRD; flujo de interacción IA

### 2.7 FreeAskInternet (nashsu/FreeAskInternet)
- **URL:** https://github.com/nashsu/FreeAskInternet
- **Stars:** ~5K+
- **Stack:** Python + Vue3, Docker Compose
- **Lo que aporta a IdeaForge:** Patrón docker-compose up -d → localhost:3000; arquitectura multi-servicio simple

---

## 3. ANÁLISIS COMPARATIVO — CARACTERÍSTICAS EXISTENTES vs. GAP

| Característica | GTPlanner | Open WebUI | DocForge-AI | PRD Plugin | IdeaForge (objetivo) |
|---|---|---|---|---|---|
| Docker Compose 1-click | ❌ | ✅ | ❌ | ❌ | ✅ |
| Wizard visual por preguntas | ❌ | ❌ | ❌ | ❌ | ✅ |
| Multi-LLM (Ollama + API) | ❌ | ✅ | ❌ | ❌ | ✅ |
| Estimación de tiempo/esfuerzo | ❌ | ❌ | ❌ | ❌ | ✅ |
| Export PRD Markdown/PDF | ✅ | ❌ | ✅ | ✅ | ✅ |
| Prompts Claude Code listos | ✅ | ❌ | ❌ | ✅ | ✅ |
| User flow diagram | ❌ | ❌ | ❌ | ❌ | ✅ |
| Stack recomendado | ❌ | ❌ | ❌ | ❌ | ✅ |
| Historial de proyectos | ❌ | ✅ | ❌ | ❌ | ✅ |
| Modo offline (sin API externa) | ❌ | ✅ | ❌ | ❌ | ✅ (vía Ollama) |
| Licencia open source | ✅ | MIT | ✅ | ✅ | MIT |

**Conclusión:** Ningún proyecto existente combina la experiencia guiada (wizard), el output completo de documentación y el despliegue Docker trivial. IdeaForge cubre ese gap único.

---

## 4. NOMBRE Y POSICIONAMIENTO

**Nombre:** `IdeaForge`
**Tagline:** *"From vague idea to actionable spec in minutes. For AI-native developers."*
**Repositorio:** `github.com/[tu-usuario]/ideaforge`
**Docker Hub:** `docker pull ideaforge/app`
**Licencia:** MIT

---

## 5. ARQUITECTURA TÉCNICA

### 5.1 Stack Tecnológico

```
FRONTEND
├── Framework:    React 18 + TypeScript
├── Styling:      Tailwind CSS v4
├── State:        Zustand (ligero, sin boilerplate)
├── Routing:      React Router v6
├── Markdown:     React-Markdown + remark-gfm
├── PDF Export:   jsPDF + html2canvas
└── Icons:        Lucide React

BACKEND (API)
├── Runtime:      Python 3.11
├── Framework:    FastAPI
├── AI Client:    anthropic SDK + openai SDK (compatible)
├── DB:           SQLite (via SQLModel) → sin dependencias externas
├── Migrations:   Alembic
└── Async:        asyncio + httpx

SERVICIOS OPCIONALES (docker-compose profiles)
├── Ollama:       Modelos locales (llama3, mistral, etc.)
└── Redis:        Caché de sesiones (perfil 'full')

INFRAESTRUCTURA DOCKER
├── docker-compose.yml         → Perfil mínimo (API + frontend + SQLite)
├── docker-compose.full.yml    → Perfil completo (+ Ollama + Redis)
└── Dockerfile.frontend        → Build estático servido por nginx:alpine
    Dockerfile.backend         → python:3.11-slim
```

### 5.2 Diagrama de Servicios Docker

```
┌─────────────────────────────────────────────────┐
│              Docker Network: ideaforge            │
│                                                   │
│  ┌──────────────┐     ┌──────────────────────┐   │
│  │   frontend   │────▶│   backend (FastAPI)  │   │
│  │  :3000       │     │   :8000              │   │
│  │  nginx+React │     │   + SQLite           │   │
│  └──────────────┘     └──────────┬───────────┘   │
│                                  │               │
│                    ┌─────────────▼──────────┐    │
│                    │  Ollama (opcional)     │    │
│                    │  :11434                │    │
│                    │  llama3, mistral, etc. │    │
│                    └────────────────────────┘    │
└─────────────────────────────────────────────────┘

Acceso usuario: http://localhost:3000
```

### 5.3 Modelo de Datos (SQLite)

```sql
-- Proyecto / Idea
CREATE TABLE projects (
  id          TEXT PRIMARY KEY,  -- UUID
  title       TEXT NOT NULL,
  raw_idea    TEXT,              -- Descripción inicial libre
  status      TEXT DEFAULT 'draft',  -- draft | refining | complete
  created_at  DATETIME,
  updated_at  DATETIME
);

-- Sesión de preguntas de una idea
CREATE TABLE sessions (
  id          TEXT PRIMARY KEY,
  project_id  TEXT REFERENCES projects(id),
  phase       TEXT,  -- discovery | technical | scope | estimation
  messages    TEXT,  -- JSON array [{role, content}]
  created_at  DATETIME
);

-- Documentos generados
CREATE TABLE documents (
  id          TEXT PRIMARY KEY,
  project_id  TEXT REFERENCES projects(id),
  doc_type    TEXT,  -- prd | tech_spec | user_flows | estimation | prompts_pack
  content     TEXT,  -- Markdown
  version     INTEGER DEFAULT 1,
  created_at  DATETIME
);

-- Configuración del usuario
CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);
```

---

## 6. FUNCIONALIDADES DETALLADAS

### 6.1 MÓDULO 1 — Landing & Onboarding

**Pantalla inicial:**
- Input de texto grande y limpio: "Describe tu idea en una frase o párrafo"
- Ejemplos predefinidos clickables (app de fitness, marketplace, SaaS de análisis...)
- Selector de perfil: Vibe Coder / Full-Stack Dev / No-code Builder / Startup Founder

**Configuración rápida (primera vez):**
- Elección del modelo IA: Claude API (recomendado) / Ollama local / OpenAI API
- Input de API key (guardada en SQLite, nunca sale del contenedor)
- Test de conexión con indicador visual de estado

---

### 6.2 MÓDULO 2 — Wizard de Clarificación (Core)

El corazón del producto. Una secuencia de 4 fases de preguntas guiadas.

#### FASE 1 — Discovery (Comprensión del Problema)
*Objetivo: entender QUÉ y PARA QUIÉN*

Preguntas generadas dinámicamente por la IA, siempre limitadas a 4-6:
1. ¿Cuál es el problema concreto que resuelve tu idea?
2. ¿Quién es tu usuario objetivo? (perfil, edad, contexto de uso)
3. ¿Existe alguna solución similar? ¿Qué la diferencia la tuya?
4. ¿Es un producto para uso personal, interno de empresa o venta al público?
5. ¿Tienes ya algún nombre, logo, o identidad visual en mente?

*Formato de respuesta:* Chat libre + opciones predefinidas clickables (para facilitar respuestas rápidas)

#### FASE 2 — Features & Scope (Alcance)
*Objetivo: definir QUÉ HACE exactamente el MVP*

1. Lista las 3-5 funcionalidades más importantes del MVP
2. ¿Qué NO debe incluir el MVP? (fuera de alcance)
3. ¿Hay integraciones externas necesarias? (pagos, email, APIs de terceros...)
4. ¿El producto requiere autenticación de usuarios?
5. ¿Qué plataforma? (Web, móvil, CLI, extensión de navegador...)

#### FASE 3 — Technical Discovery (Especificaciones Técnicas)
*Objetivo: definir el CÓMO a nivel de arquitectura*

1. ¿Tienes preferencia de lenguaje o framework? (o dejamos que la IA recomiende)
2. ¿Necesitas almacenamiento de datos? ¿De qué tipo?
3. ¿Habrá usuarios simultáneos? Estimación de concurrencia
4. ¿Necesita ser realtime? (chats, notificaciones push, etc.)
5. ¿Dónde se desplegará? (Vercel, VPS, Railway, local...)

#### FASE 4 — Goals & Success Metrics
*Objetivo: definir el ÉXITO del proyecto*

1. ¿Cuándo considerarás que el MVP es un éxito?
2. ¿Hay una fecha límite o milestone específico?
3. ¿Cuánto tiempo diario/semanal puedes dedicar al desarrollo?
4. ¿Vas a desarrollarlo solo o con un equipo?
5. ¿El objetivo es lanzar públicamente, vender o aprender?

*UX de la interfaz wizard:*
- Cada fase tiene su propia tarjeta con barra de progreso visual
- Las respuestas anteriores se muestran en sidebar colapsable
- El usuario puede volver a editar cualquier respuesta
- La IA procesa las respuestas y puede hacer follow-up si algo es ambiguo
- Botón "Suficiente información — Genera los documentos" disponible desde la fase 2

---

### 6.3 MÓDULO 3 — Motor de Generación de Documentos

Tras completar el wizard (o pulsar el botón de generación anticipada), el backend lanza un pipeline de generación con la IA.

#### Documentos Generados:

**1. PRD — Product Requirements Document** (`prd.md`)
```markdown
Secciones:
- Executive Summary (2-3 párrafos)
- Problem Statement
- Target User Persona
- Product Goals & Non-Goals
- Feature List (MVP)
  - Feature Name
  - User Story: "Como [usuario], quiero [acción], para [beneficio]"
  - Acceptance Criteria
  - Priority: P0 / P1 / P2
- Out of Scope
- Success Metrics / KPIs
- Open Questions
```

**2. Technical Spec** (`tech_spec.md`)
```markdown
Secciones:
- Recommended Stack (con justificación)
- Architecture Overview (diagrama ASCII + descripción)
- Data Model (tablas y relaciones principales)
- API Endpoints (lista de rutas principales)
- External Integrations
- Security Considerations
- Deployment Strategy
```

**3. User Flows** (`user_flows.md`)
```markdown
- Happy path diagrams (en formato Mermaid flowchart)
- Flujos de error
- Flujo de onboarding
- Flujo principal de uso
```

**4. Estimation Report** (`estimation.md`)
```markdown
- Breakdown por módulo/feature
- Horas estimadas por tarea (Low / Medium / High)
- Tabla de desglose:
  | Feature | Complejidad | Horas Min | Horas Max |
- Total estimado: X - Y horas de desarrollo
- Factores de riesgo identificados
- Recomendaciones para reducir tiempo
```

**5. AI Prompts Pack** (`claude_prompts.md`)
```markdown
Conjunto de prompts listos para pegar en Claude Code / Cursor:
- PROMPT_01: Setup inicial del proyecto
- PROMPT_02: Generación de la estructura de carpetas
- PROMPT_03: Implementación de [Feature Principal]
- PROMPT_04: Setup de base de datos
- PROMPT_05: Tests para el MVP
Cada prompt incluye:
- El prompt completo (copiable con un click)
- Contexto necesario a adjuntar
- Resultado esperado
```

**6. README.md de proyecto** (`project_readme.md`)
```markdown
- Descripción del proyecto
- Features del MVP
- Instalación / Setup local
- Variables de entorno necesarias
- Guía de contribución básica
```

---

### 6.4 MÓDULO 4 — Visor y Editor de Documentos

**Vista de documentos generados:**
- Panel lateral con todos los documentos del proyecto
- Vista principal con renderizado Markdown bonito
- Editor inline para modificar cualquier sección (Monaco Editor lite)
- Historial de versiones (v1, v2... cada vez que se regenera)
- Botón "Regenerar esta sección" con instrucción adicional
- Indicador de tokens usados por documento

**Sistema de export:**
- "Exportar todo como ZIP" → descarga `.zip` con todos los `.md`
- "Exportar PRD como PDF" → PDF bien formateado
- "Copiar como contexto para Claude" → copia todo en formato de SYSTEM PROMPT listo para pegar
- "Abrir en GitHub Gist" → crea gist directo vía API (con API token del usuario)

---

### 6.5 MÓDULO 5 — Dashboard de Proyectos

**Lista de proyectos:**
- Cards con: título, fase actual, fecha, estado (borrador / completo)
- Búsqueda y filtro por estado
- Duplicar proyecto existente (para variantes del mismo producto)
- Archivar / eliminar

**Estadísticas:**
- Total de proyectos creados
- Tokens consumidos (histórico)
- Tiempo promedio de sesión de planificación

---

### 6.6 MÓDULO 6 — Configuración

- Gestión de API keys (Anthropic, OpenAI, Ollama endpoint)
- Selección de modelo por defecto
- Idioma de los documentos generados (ES / EN / FR / DE)
- Configuración de plantillas (personalizar secciones del PRD)
- Backup / Restore de la base de datos SQLite
- Modo oscuro / claro

---

## 7. FLUJO DE USUARIO COMPLETO

```
[1] Usuario abre http://localhost:3000
        │
        ▼
[2] Onboarding (primera vez): configura API key + modelo
        │
        ▼
[3] Dashboard → "Nueva Idea" → Input de descripción libre
        │
        ▼
[4] FASE DISCOVERY: IA hace 4-6 preguntas → Usuario responde
        │
        ▼
[5] FASE SCOPE: IA hace 4-6 preguntas → Usuario responde
        │
        ▼
[6] FASE TECHNICAL: IA hace 3-5 preguntas → Usuario responde
        │
        ▼
[7] FASE GOALS: IA hace 3-4 preguntas → Usuario responde
        │
        ▼
[8] GENERACIÓN: Pipeline IA genera 6 documentos (streaming visible)
        │
        ▼
[9] VISOR: Usuario revisa, edita, regenera secciones si necesita
        │
        ▼
[10] EXPORT: ZIP / PDF / Contexto Claude / GitHub Gist
        │
        ▼
[11] DESARROLLO: Usuario lleva los docs a Claude Code y empieza a construir
```

---

## 8. ESTRUCTURA DE ARCHIVOS DEL PROYECTO

```
ideaforge/
├── README.md                      # Documentación del proyecto
├── docker-compose.yml             # Perfil mínimo
├── docker-compose.full.yml        # Con Ollama + Redis
├── .env.example                   # Variables de entorno de ejemplo
├── LICENSE                        # MIT
│
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py                    # Entry point FastAPI
│   ├── config.py                  # Settings (pydantic-settings)
│   ├── database.py                # SQLModel + SQLite setup
│   ├── models/
│   │   ├── project.py
│   │   ├── session.py
│   │   └── document.py
│   ├── routers/
│   │   ├── projects.py            # CRUD proyectos
│   │   ├── sessions.py            # Wizard de preguntas
│   │   ├── documents.py           # Generación y gestión de docs
│   │   ├── export.py              # Export ZIP/PDF
│   │   └── settings.py            # Configuración usuario
│   ├── services/
│   │   ├── ai_service.py          # Abstracción LLM (Anthropic/OpenAI/Ollama)
│   │   ├── wizard_service.py      # Lógica de fases de preguntas
│   │   ├── generator_service.py   # Pipeline de generación de documentos
│   │   └── export_service.py      # Generación ZIP/PDF
│   └── prompts/
│       ├── discovery.md           # Prompts para fase 1
│       ├── scope.md               # Prompts para fase 2
│       ├── technical.md           # Prompts para fase 3
│       ├── goals.md               # Prompts para fase 4
│       └── generators/
│           ├── prd.md
│           ├── tech_spec.md
│           ├── user_flows.md
│           ├── estimation.md
│           └── prompts_pack.md
│
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── store/
│       │   ├── projectStore.ts
│       │   └── settingsStore.ts
│       ├── pages/
│       │   ├── Dashboard.tsx
│       │   ├── NewIdea.tsx
│       │   ├── Wizard.tsx
│       │   ├── Documents.tsx
│       │   └── Settings.tsx
│       ├── components/
│       │   ├── wizard/
│       │   │   ├── PhaseCard.tsx
│       │   │   ├── QuestionBubble.tsx
│       │   │   ├── AnswerInput.tsx
│       │   │   └── ProgressBar.tsx
│       │   ├── documents/
│       │   │   ├── DocViewer.tsx
│       │   │   ├── DocEditor.tsx
│       │   │   └── ExportPanel.tsx
│       │   └── ui/
│       │       ├── Button.tsx
│       │       ├── Card.tsx
│       │       ├── Badge.tsx
│       │       └── ModelSelector.tsx
│       └── lib/
│           ├── api.ts             # Cliente API (axios/fetch)
│           └── utils.ts
│
└── docs/
    ├── CONTRIBUTING.md
    ├── ARCHITECTURE.md
    └── screenshots/               # Para el README de GitHub
```

---

## 9. API ENDPOINTS BACKEND

```
POST   /api/projects               → Crear nuevo proyecto
GET    /api/projects               → Listar proyectos
GET    /api/projects/{id}          → Detalle de proyecto
DELETE /api/projects/{id}          → Eliminar proyecto

POST   /api/projects/{id}/sessions → Iniciar sesión wizard
GET    /api/projects/{id}/sessions → Historial de sesiones
POST   /api/sessions/{id}/message  → Enviar respuesta + recibir siguiente pregunta (streaming SSE)
POST   /api/sessions/{id}/advance  → Avanzar a siguiente fase

POST   /api/projects/{id}/generate → Lanzar generación de todos los documentos (streaming SSE)
GET    /api/projects/{id}/documents → Listar documentos
GET    /api/documents/{id}         → Obtener documento
PUT    /api/documents/{id}         → Actualizar documento
POST   /api/documents/{id}/regenerate → Regenerar sección específica

GET    /api/projects/{id}/export/zip → Descargar ZIP con todos los docs
GET    /api/projects/{id}/export/pdf → Descargar PRD como PDF

GET    /api/settings               → Obtener configuración
PUT    /api/settings               → Actualizar configuración
POST   /api/settings/test-connection → Probar conexión IA
```

---

## 10. DOCKER COMPOSE — CONFIGURACIÓN COMPLETA

### docker-compose.yml (perfil mínimo)

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:8000
    restart: unless-stopped

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ideaforge_data:/app/data  # SQLite persiste aquí
    environment:
      - DATABASE_URL=sqlite:////app/data/ideaforge.db
      - SECRET_KEY=${SECRET_KEY:-ideaforge-dev-key}
    restart: unless-stopped

volumes:
  ideaforge_data:
```

### docker-compose.full.yml (con Ollama)

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ideaforge_data:/app/data
    environment:
      - DATABASE_URL=sqlite:////app/data/ideaforge.db
      - OLLAMA_URL=http://ollama:11434
    depends_on:
      - ollama

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

volumes:
  ideaforge_data:
  ollama_data:
```

### Instalación en 3 pasos:

```bash
# 1. Clonar el repositorio
git clone https://github.com/[usuario]/ideaforge
cd ideaforge

# 2. Copiar variables de entorno
cp .env.example .env
# (Opcional: editar .env para añadir API keys)

# 3. Levantar el contenedor
docker compose up -d

# Abrir en el navegador:
# http://localhost:3000
```

---

## 11. ESTIMACIÓN DE TIEMPO DE DESARROLLO

### Desglose por módulo

| Módulo | Componente | Complejidad | Horas |
|---|---|---|---|
| **Infra Docker** | docker-compose + Dockerfiles + nginx config | Baja | 4h |
| **Backend Base** | FastAPI setup + SQLModel + routing base | Baja | 6h |
| **AI Service** | Abstracción multi-LLM (Anthropic/OpenAI/Ollama) | Media | 8h |
| **Wizard Service** | Lógica de fases + gestión de contexto | Alta | 16h |
| **Generator Service** | Pipeline 6 documentos + prompts | Alta | 20h |
| **Export Service** | ZIP + PDF generation | Media | 8h |
| **Frontend Base** | React + Tailwind + routing + store | Baja | 8h |
| **UI Wizard** | PhaseCard + QuestionBubble + AnswerInput | Media | 16h |
| **UI Documents** | DocViewer + Editor + streaming | Media | 12h |
| **UI Dashboard** | Lista proyectos + stats | Baja | 6h |
| **UI Settings** | Config + API key management | Baja | 4h |
| **Streaming SSE** | Server-Sent Events para generación live | Media | 8h |
| **Tests** | Tests unitarios backend + E2E básicos | Media | 12h |
| **Documentación** | README + ARCHITECTURE + screenshots | Baja | 6h |
| **Polish & QA** | Responsive, dark mode, bug fixing | Media | 10h |
| **TOTAL** | | | **~144h** |

### Estimación realista según dedicación:

| Dedicación | Horas/semana | Tiempo total |
|---|---|---|
| A tiempo parcial (evenings) | 10h/semana | ~14-15 semanas |
| Mitad jornada | 20h/semana | ~7-8 semanas |
| Full-time + Claude Code | 40h/semana | ~3-4 semanas |

**Con Claude Code + prompts optimizados del propio IdeaForge:** se estima reducción del 40-50% del tiempo en tareas de implementación → MVP funcional en **2-3 semanas a jornada completa**.

---

## 12. MVP vs. ROADMAP

### v0.1 — MVP (Semanas 1-3 a jornada completa)
- [ ] Docker Compose funcional (frontend + backend)
- [ ] Onboarding: input API key + test conexión
- [ ] Wizard 4 fases completo
- [ ] Generación de PRD + Tech Spec + Estimation
- [ ] Visor de documentos Markdown
- [ ] Export ZIP

### v0.2 — Iteración (Semana 4-6)
- [ ] AI Prompts Pack generados
- [ ] User Flows con Mermaid diagrams
- [ ] Editor inline de documentos
- [ ] Historial de versiones
- [ ] Export PDF

### v0.3 — Experiencia (Semana 7-9)
- [ ] Integración Ollama (modo offline)
- [ ] Soporte multi-idioma (ES/EN)
- [ ] "Copiar como contexto para Claude" 1-click
- [ ] GitHub Gist export
- [ ] Dashboard de estadísticas

### v1.0 — Producción (Semana 10+)
- [ ] Templates personalizables de PRD
- [ ] Modo colaborativo (multi-usuario simple)
- [ ] CLI companion (`ideaforge-cli generate --idea "..."`)
- [ ] Plugin para VS Code
- [ ] Import desde GitHub README existente

---

## 13. CONVENCIONES Y ESTÁNDARES DE DESARROLLO

### Prompt Engineering (clave del proyecto)

Cada prompt de IdeaForge debe seguir esta estructura:

```markdown
## ROL
Eres IdeaForge, un consultor técnico experto en arquitectura de software y product management.
Tu objetivo es ayudar al usuario a definir su idea de forma clara, realista y accionable.

## CONTEXTO DEL PROYECTO
[Insertar respuestas del wizard aquí]

## TAREA
[Generación específica: PRD / Tech Spec / Estimation / etc.]

## FORMATO DE SALIDA
[Estructura exacta del documento en Markdown]

## RESTRICCIONES
- Sé específico y concreto, evita generalidades
- Si hay ambigüedad, señálala en "Open Questions"
- Las estimaciones deben ser realistas, no optimistas
- El stack recomendado debe justificarse con el contexto del usuario
```

### Gestión de tokens

- El wizard acumula contexto progresivo (no reenvía toda la conversación cada vez)
- Se usa un "context summary" comprimido después de cada fase
- El usuario ve el contador de tokens en tiempo real
- Alerta si se acerca al límite del modelo seleccionado

### Modo streaming

- Todos los endpoints de generación usan Server-Sent Events (SSE)
- El frontend muestra el texto generado en tiempo real (efecto typewriter)
- El usuario puede cancelar la generación en cualquier momento

---

## 14. PUNTOS DIFERENCIADORES CLAVE

1. **Estimación honesta de tiempo:** No promete magia. Da rangos realistas con factores de riesgo
2. **Optimizado para Claude Code:** Los prompts generados están diseñados específicamente para maximizar la efectividad con Claude
3. **Zero-config:** `docker compose up` y listo. Sin configuración de base de datos, sin migraciones manuales
4. **Privado por defecto:** Todo corre localmente. Las API keys no salen del contenedor
5. **Multi-LLM:** Funciona con Anthropic, OpenAI, Ollama (local, sin API)
6. **Vibe Coder First:** La UX está diseñada para alguien que quiere ideas claras, no para un product manager enterprise
7. **El propio IdeaForge se usó para planificarse:** Dogfooding desde el día 1

---

## 15. PRIMEROS PASOS PARA DESARROLLAR CON CLAUDE CODE

### Prompt de arranque para Claude Code:

```
Vamos a construir IdeaForge, un contenedor Docker open source para 
planificación de proyectos de software con IA.

El proyecto tiene:
- Backend: FastAPI + SQLite (SQLModel) + Python 3.11
- Frontend: React 18 + TypeScript + Tailwind CSS v4 + Zustand
- Deploy: Docker Compose

Por favor empieza por:
1. Crear la estructura de carpetas completa del proyecto
2. Configurar el backend base con FastAPI y SQLModel
3. Configurar el frontend base con React + Vite + Tailwind
4. Crear el docker-compose.yml funcional
5. Implementar el modelo de datos básico (projects, sessions, documents)

Usa el archivo PLAN_IDEAFORGE.md como referencia completa del proyecto.
Prioriza código limpio, tipado estricto y comentarios en español.
```

---

*Plan generado: Mayo 2026 | Versión: 1.0*
*Autor: Angel Roldan — Córdoba, España*
