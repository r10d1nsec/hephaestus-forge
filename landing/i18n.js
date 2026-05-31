/* ============================================================
   i18n — EN / 中文 / ES / FR / DE
   Values may contain inline HTML (we set innerHTML). Proper
   nouns (GitHub, Ollama, PRD, Streakly…) stay untranslated.
   ============================================================ */
const I18N = {
  en: {
    label: "English", glyph: "EN",
    nav_docs: "Docs", nav_github: "GitHub",

    hero_pill: 'Self-hosted · 100% local · <b>Bring Your Own Engine</b>',
    hero_title: 'Forge a vague idea into a <span class="molten">build-ready spec</span>.',
    hero_sub: 'Hephaestus interviews you about your idea and forges a PRD, technical spec and honest estimation — <b>with the AI engine you already have</b>.',
    hero_cta_primary: "Star on GitHub",
    hero_cta_secondary: "Quickstart",
    trust_1: "No data leaves your machine",
    trust_2: "Engines detected from your PATH",
    trust_3: "MIT licensed",
    term_copy: "Copy", term_copied: "Copied",

    byoe_eyebrow: "Bring Your Own Engine",
    byoe_title: "Run it on the AI you already pay for.",
    byoe_lede: "No vendor lock-in, no new subscription. Hephaestus plugs into the engine sitting on your machine or in your existing account.",
    c1_title: "CLI agents", c1_desc: "Point it at the coding agents already installed in your PATH. Detected automatically — just press Use.",
    c2_title: "API providers", c2_desc: "Bring a key from any OpenAI-compatible provider. Your credentials stay in your local config.",
    c3_title: "Local models", c3_desc: "Run fully offline with Ollama or any local server. Nothing ever leaves the machine.",

    how_eyebrow: "How it works",
    how_title: "Five phases from sentence to spec.",
    how_lede: "A guided wizard turns one line of intent into documents a build agent can act on.",
    s1_t: "Describe", s1_d: "Start with a sentence or a short paragraph. That's all Hephaestus needs to begin.",
    s2_t: "Interview", s2_d: "It asks the sharp questions — scope, users, constraints — and fills the gaps you'd have missed.",
    s3_t: "Blueprint", s3_d: "Get a recommended solution type, realistic scale, and an honest time estimate before you commit.",
    s4_t: "Specify", s4_d: "A full PRD and technical spec are forged — structured, opinionated, and build-ready.",
    s5_t: "Ship", s5_d: "Export a ZIP and hand it straight to your build agent, or keep iterating with Regenerate.",

    show_eyebrow: "See it work",
    show_title: "Documents, not chat transcripts.",
    show_lede: "Every project produces a tidy, navigable workspace — Blueprint, PRD, Technical Spec and Estimation, ready to export.",

    ex_eyebrow: "Examples",
    ex_title: "Real specs, forged end to end.",
    ex_lede: "Two sample projects ship with the repo so you can see the output before running your own.",
    ex1_desc: "An AI habit tracker that turns any big goal into adaptive daily micro-tasks.",
    ex2_desc: "A WeChat mini-program that aggregates multi-platform delivery orders and forecasts daily stock with AI.",
    ex_status: "complete", ex_wizard: "Wizard", ex_docs: "Docs",

    docs_eyebrow: "Documentation",
    docs_title: "Everything you need to self-host.",
    docs_lede: "Clear, practical guides — from first clone to plugging in your own engine.",
    d1_t: "Quickstart", d1_d: "Clone, run, forge your first spec in minutes.",
    d2_t: "Bring Your Own Engine", d2_d: "Wire up CLI agents, API keys or local models.",
    d3_t: "The 5-phase wizard", d3_d: "How an idea becomes a build-ready spec.",
    d4_t: "Self-hosting", d4_d: "Run it on your machine, fully offline.",
    d5_t: "Document types", d5_d: "Blueprint, PRD, Technical Spec, Estimation.",
    d6_t: "Contributing", d6_d: "Add engines, translations and templates.",

    cta_title: "Forge with us.",
    cta_sub: "Hephaestus is open source and 100% local. Bring your own engine, bring your own ideas — and help shape the anvil.",
    cta_primary: "Star on GitHub",
    cta_secondary: "Read the docs",

    foot_blurb: "Forge a vague idea into a build-ready spec — with the AI engine you already have.",
    foot_h_product: "Product", foot_h_resources: "Resources", foot_h_project: "Project",
    f_engines: "Engines", f_quickstart: "Quickstart", f_how: "How it works", f_examples: "Examples",
    f_docs: "Documentation", f_byoe: "Bring Your Own Engine", f_wizard: "The wizard", f_selfhost: "Self-hosting",
    f_github: "GitHub", f_releases: "Releases", f_license: "License", f_contributing: "Contributing",
    foot_local: "v0.1.0 · 100% local",
    foot_rights: "Open source, MIT licensed.",
  },

  zh: {
    label: "简体中文", glyph: "中",
    nav_docs: "文档", nav_github: "GitHub",

    hero_pill: '自托管 · 100% 本地 · <b>使用你自己的引擎</b>',
    hero_title: '把模糊的想法锻造成<span class="molten">可直接开发的规格</span>。',
    hero_sub: 'Hephaestus 会就你的想法向你提问，并锻造出 PRD、技术规格与诚实的工时评估 —— <b>运行在你已有的 AI 引擎上</b>。',
    hero_cta_primary: "在 GitHub 加星",
    hero_cta_secondary: "快速开始",
    trust_1: "数据不会离开你的机器",
    trust_2: "从 PATH 自动检测引擎",
    trust_3: "MIT 开源协议",
    term_copy: "复制", term_copied: "已复制",

    byoe_eyebrow: "使用你自己的引擎",
    byoe_title: "运行在你已经付费的 AI 上。",
    byoe_lede: "没有厂商锁定，无需新的订阅。Hephaestus 直接接入你机器上或现有账户里的引擎。",
    c1_title: "CLI 智能体", c1_desc: "指向你 PATH 中已安装的编码智能体。自动检测 —— 点一下「使用」即可。",
    c2_title: "API 服务商", c2_desc: "使用任意兼容 OpenAI 的服务商密钥。凭据只保存在你的本地配置中。",
    c3_title: "本地模型", c3_desc: "通过 Ollama 或任意本地服务完全离线运行。任何数据都不会外泄。",

    how_eyebrow: "工作方式",
    how_title: "从一句话到完整规格，五个阶段。",
    how_lede: "引导式向导把一行意图转化为开发智能体可以直接执行的文档。",
    s1_t: "描述", s1_d: "从一句话或一小段开始，这就是 Hephaestus 起步所需的全部。",
    s2_t: "访谈", s2_d: "它会提出关键问题 —— 范围、用户、约束 —— 补上你会遗漏的空白。",
    s3_t: "蓝图", s3_d: "在投入之前，先得到推荐方案类型、现实规模与诚实的时间评估。",
    s4_t: "规格", s4_d: "锻造出完整的 PRD 与技术规格 —— 结构清晰、立场明确、可直接开发。",
    s5_t: "交付", s5_d: "导出 ZIP 直接交给开发智能体，或用「重新生成」继续迭代。",

    show_eyebrow: "实际效果",
    show_title: "是文档，不是聊天记录。",
    show_lede: "每个项目都会生成整洁、可导航的工作区 —— 蓝图、PRD、技术规格与评估，随时可导出。",

    ex_eyebrow: "示例",
    ex_title: "端到端锻造的真实规格。",
    ex_lede: "仓库自带两个示例项目，让你在动手前先看到产出效果。",
    ex1_desc: "一款 AI 习惯追踪应用，把任何宏大目标拆解为可自适应的每日微任务。",
    ex2_desc: "一个微信小程序，聚合多平台外卖订单，并用 AI 预测每日备货量。",
    ex_status: "已完成", ex_wizard: "向导", ex_docs: "文档",

    docs_eyebrow: "文档",
    docs_title: "自托管所需的一切。",
    docs_lede: "清晰实用的指南 —— 从首次克隆到接入你自己的引擎。",
    d1_t: "快速开始", d1_d: "克隆、运行，几分钟锻造第一份规格。",
    d2_t: "使用你自己的引擎", d2_d: "接入 CLI 智能体、API 密钥或本地模型。",
    d3_t: "五阶段向导", d3_d: "一个想法如何成为可开发的规格。",
    d4_t: "自托管", d4_d: "在你的机器上完全离线运行。",
    d5_t: "文档类型", d5_d: "蓝图、PRD、技术规格、评估。",
    d6_t: "参与贡献", d6_d: "添加引擎、翻译与模板。",

    cta_title: "和我们一起锻造。",
    cta_sub: "Hephaestus 是开源且 100% 本地的。带上你自己的引擎与想法 —— 一起打造这座铁砧。",
    cta_primary: "在 GitHub 加星",
    cta_secondary: "阅读文档",

    foot_blurb: "把模糊的想法锻造成可直接开发的规格 —— 运行在你已有的 AI 引擎上。",
    foot_h_product: "产品", foot_h_resources: "资源", foot_h_project: "项目",
    f_engines: "引擎", f_quickstart: "快速开始", f_how: "工作方式", f_examples: "示例",
    f_docs: "文档", f_byoe: "使用你自己的引擎", f_wizard: "向导", f_selfhost: "自托管",
    f_github: "GitHub", f_releases: "版本发布", f_license: "开源协议", f_contributing: "参与贡献",
    foot_local: "v0.1.0 · 100% 本地",
    foot_rights: "开源，采用 MIT 协议。",
  },

  es: {
    label: "Español", glyph: "ES",
    nav_docs: "Docs", nav_github: "GitHub",

    hero_pill: 'Autoalojado · 100% local · <b>Trae tu propio motor</b>',
    hero_title: 'Forja una idea difusa en una <span class="molten">especificación lista para construir</span>.',
    hero_sub: 'Hephaestus te entrevista sobre tu idea y forja un PRD, una especificación técnica y una estimación honesta — <b>con el motor de IA que ya tienes</b>.',
    hero_cta_primary: "Estrella en GitHub",
    hero_cta_secondary: "Inicio rápido",
    trust_1: "Ningún dato sale de tu máquina",
    trust_2: "Motores detectados desde tu PATH",
    trust_3: "Licencia MIT",
    term_copy: "Copiar", term_copied: "Copiado",

    byoe_eyebrow: "Trae tu propio motor",
    byoe_title: "Ejecútalo con la IA que ya pagas.",
    byoe_lede: "Sin dependencia de proveedores ni suscripciones nuevas. Hephaestus se conecta al motor que ya está en tu máquina o en tu cuenta.",
    c1_title: "Agentes CLI", c1_desc: "Apúntalo a los agentes de coding ya instalados en tu PATH. Se detectan solos — solo pulsa Usar.",
    c2_title: "Proveedores API", c2_desc: "Usa una clave de cualquier proveedor compatible con OpenAI. Tus credenciales quedan en tu config local.",
    c3_title: "Modelos locales", c3_desc: "Ejecuta totalmente sin conexión con Ollama o cualquier servidor local. Nada sale de la máquina.",

    how_eyebrow: "Cómo funciona",
    how_title: "Cinco fases, de la frase a la especificación.",
    how_lede: "Un asistente guiado convierte una línea de intención en documentos que un agente puede ejecutar.",
    s1_t: "Describe", s1_d: "Empieza con una frase o un párrafo corto. Es todo lo que Hephaestus necesita.",
    s2_t: "Entrevista", s2_d: "Hace las preguntas afiladas — alcance, usuarios, límites — y llena los huecos que olvidarías.",
    s3_t: "Blueprint", s3_d: "Obtén un tipo de solución recomendado, una escala realista y una estimación honesta antes de empezar.",
    s4_t: "Especifica", s4_d: "Se forja un PRD completo y una especificación técnica — estructurados y listos para construir.",
    s5_t: "Entrega", s5_d: "Exporta un ZIP y entrégalo a tu agente, o sigue iterando con Regenerar.",

    show_eyebrow: "Míralo en acción",
    show_title: "Documentos, no transcripciones de chat.",
    show_lede: "Cada proyecto genera un espacio ordenado y navegable — Blueprint, PRD, Especificación y Estimación, listos para exportar.",

    ex_eyebrow: "Ejemplos",
    ex_title: "Especificaciones reales, forjadas de principio a fin.",
    ex_lede: "El repo incluye dos proyectos de muestra para que veas el resultado antes de ejecutar el tuyo.",
    ex1_desc: "Un rastreador de hábitos con IA que convierte cualquier gran meta en micro-tareas diarias adaptativas.",
    ex2_desc: "Un mini-programa de WeChat que agrega pedidos de reparto multiplataforma y prevé el stock diario con IA.",
    ex_status: "completo", ex_wizard: "Asistente", ex_docs: "Docs",

    docs_eyebrow: "Documentación",
    docs_title: "Todo lo que necesitas para autoalojar.",
    docs_lede: "Guías claras y prácticas — del primer clon a conectar tu propio motor.",
    d1_t: "Inicio rápido", d1_d: "Clona, ejecuta y forja tu primera spec en minutos.",
    d2_t: "Trae tu propio motor", d2_d: "Conecta agentes CLI, claves API o modelos locales.",
    d3_t: "El asistente de 5 fases", d3_d: "Cómo una idea se vuelve una spec construible.",
    d4_t: "Autoalojamiento", d4_d: "Ejecútalo en tu máquina, sin conexión.",
    d5_t: "Tipos de documento", d5_d: "Blueprint, PRD, Especificación, Estimación.",
    d6_t: "Contribuir", d6_d: "Añade motores, traducciones y plantillas.",

    cta_title: "Forja con nosotros.",
    cta_sub: "Hephaestus es open source y 100% local. Trae tu propio motor y tus ideas — y ayúdanos a dar forma al yunque.",
    cta_primary: "Estrella en GitHub",
    cta_secondary: "Leer la documentación",

    foot_blurb: "Forja una idea difusa en una especificación lista para construir — con el motor de IA que ya tienes.",
    foot_h_product: "Producto", foot_h_resources: "Recursos", foot_h_project: "Proyecto",
    f_engines: "Motores", f_quickstart: "Inicio rápido", f_how: "Cómo funciona", f_examples: "Ejemplos",
    f_docs: "Documentación", f_byoe: "Trae tu propio motor", f_wizard: "El asistente", f_selfhost: "Autoalojamiento",
    f_github: "GitHub", f_releases: "Versiones", f_license: "Licencia", f_contributing: "Contribuir",
    foot_local: "v0.1.0 · 100% local",
    foot_rights: "Open source, licencia MIT.",
  },

  fr: {
    label: "Français", glyph: "FR",
    nav_docs: "Docs", nav_github: "GitHub",

    hero_pill: 'Auto-hébergé · 100% local · <b>Apportez votre moteur</b>',
    hero_title: 'Forgez une idée floue en une <span class="molten">spec prête à construire</span>.',
    hero_sub: "Hephaestus vous interroge sur votre idée et forge un PRD, une spécification technique et une estimation honnête — <b>avec le moteur d'IA que vous avez déjà</b>.",
    hero_cta_primary: "Star sur GitHub",
    hero_cta_secondary: "Démarrage rapide",
    trust_1: "Aucune donnée ne quitte votre machine",
    trust_2: "Moteurs détectés depuis votre PATH",
    trust_3: "Sous licence MIT",
    term_copy: "Copier", term_copied: "Copié",

    byoe_eyebrow: "Apportez votre moteur",
    byoe_title: "Tournez sur l'IA que vous payez déjà.",
    byoe_lede: "Aucun verrouillage fournisseur, aucun nouvel abonnement. Hephaestus se branche au moteur déjà présent sur votre machine ou dans votre compte.",
    c1_title: "Agents CLI", c1_desc: "Pointez-le vers les agents de code déjà installés dans votre PATH. Détectés automatiquement — appuyez sur Utiliser.",
    c2_title: "Fournisseurs API", c2_desc: "Apportez une clé d'un fournisseur compatible OpenAI. Vos identifiants restent dans votre config locale.",
    c3_title: "Modèles locaux", c3_desc: "Tournez entièrement hors ligne avec Ollama ou tout serveur local. Rien ne quitte la machine.",

    how_eyebrow: "Comment ça marche",
    how_title: "Cinq phases, de la phrase à la spec.",
    how_lede: "Un assistant guidé transforme une ligne d'intention en documents qu'un agent peut exécuter.",
    s1_t: "Décrire", s1_d: "Commencez par une phrase ou un court paragraphe. C'est tout ce qu'il faut à Hephaestus.",
    s2_t: "Interviewer", s2_d: "Il pose les bonnes questions — portée, utilisateurs, contraintes — et comble les oublis.",
    s3_t: "Blueprint", s3_d: "Obtenez un type de solution recommandé, une échelle réaliste et une estimation honnête avant de vous lancer.",
    s4_t: "Spécifier", s4_d: "Un PRD complet et une spec technique sont forgés — structurés et prêts à construire.",
    s5_t: "Livrer", s5_d: "Exportez un ZIP à remettre à votre agent, ou continuez d'itérer avec Régénérer.",

    show_eyebrow: "Voyez-le à l'œuvre",
    show_title: "Des documents, pas des transcriptions de chat.",
    show_lede: "Chaque projet produit un espace clair et navigable — Blueprint, PRD, Spec technique et Estimation, prêts à exporter.",

    ex_eyebrow: "Exemples",
    ex_title: "De vraies specs, forgées de bout en bout.",
    ex_lede: "Deux projets d'exemple sont livrés avec le dépôt pour voir le résultat avant de lancer le vôtre.",
    ex1_desc: "Un tracker d'habitudes par IA qui transforme tout grand objectif en micro-tâches quotidiennes adaptatives.",
    ex2_desc: "Un mini-programme WeChat qui agrège les commandes de livraison multi-plateformes et prévoit le stock quotidien par IA.",
    ex_status: "terminé", ex_wizard: "Assistant", ex_docs: "Docs",

    docs_eyebrow: "Documentation",
    docs_title: "Tout pour l'auto-hébergement.",
    docs_lede: "Des guides clairs et concrets — du premier clone au branchement de votre moteur.",
    d1_t: "Démarrage rapide", d1_d: "Clonez, lancez, forgez votre première spec en minutes.",
    d2_t: "Apportez votre moteur", d2_d: "Branchez agents CLI, clés API ou modèles locaux.",
    d3_t: "L'assistant en 5 phases", d3_d: "Comment une idée devient une spec construisible.",
    d4_t: "Auto-hébergement", d4_d: "Tournez sur votre machine, hors ligne.",
    d5_t: "Types de documents", d5_d: "Blueprint, PRD, Spec technique, Estimation.",
    d6_t: "Contribuer", d6_d: "Ajoutez moteurs, traductions et modèles.",

    cta_title: "Forgez avec nous.",
    cta_sub: "Hephaestus est open source et 100% local. Apportez votre moteur et vos idées — et aidez à façonner l'enclume.",
    cta_primary: "Star sur GitHub",
    cta_secondary: "Lire la documentation",

    foot_blurb: "Forgez une idée floue en une spec prête à construire — avec le moteur d'IA que vous avez déjà.",
    foot_h_product: "Produit", foot_h_resources: "Ressources", foot_h_project: "Projet",
    f_engines: "Moteurs", f_quickstart: "Démarrage rapide", f_how: "Fonctionnement", f_examples: "Exemples",
    f_docs: "Documentation", f_byoe: "Apportez votre moteur", f_wizard: "L'assistant", f_selfhost: "Auto-hébergement",
    f_github: "GitHub", f_releases: "Versions", f_license: "Licence", f_contributing: "Contribuer",
    foot_local: "v0.1.0 · 100% local",
    foot_rights: "Open source, licence MIT.",
  },

  de: {
    label: "Deutsch", glyph: "DE",
    nav_docs: "Docs", nav_github: "GitHub",

    hero_pill: 'Selbst-gehostet · 100% lokal · <b>Bring deine eigene Engine</b>',
    hero_title: 'Schmiede eine vage Idee zu einer <span class="molten">build-fertigen Spec</span>.',
    hero_sub: 'Hephaestus befragt dich zu deiner Idee und schmiedet ein PRD, eine technische Spezifikation und eine ehrliche Schätzung — <b>mit der KI-Engine, die du schon hast</b>.',
    hero_cta_primary: "Auf GitHub sternen",
    hero_cta_secondary: "Schnellstart",
    trust_1: "Keine Daten verlassen deinen Rechner",
    trust_2: "Engines aus deinem PATH erkannt",
    trust_3: "MIT-lizenziert",
    term_copy: "Kopieren", term_copied: "Kopiert",

    byoe_eyebrow: "Bring deine eigene Engine",
    byoe_title: "Läuft auf der KI, die du schon bezahlst.",
    byoe_lede: "Kein Vendor-Lock-in, kein neues Abo. Hephaestus klinkt sich in die Engine auf deinem Rechner oder in deinem Konto ein.",
    c1_title: "CLI-Agenten", c1_desc: "Richte es auf die Coding-Agenten in deinem PATH. Automatisch erkannt — einfach „Verwenden“ drücken.",
    c2_title: "API-Anbieter", c2_desc: "Nutze einen Key eines OpenAI-kompatiblen Anbieters. Deine Zugangsdaten bleiben in deiner lokalen Config.",
    c3_title: "Lokale Modelle", c3_desc: "Komplett offline mit Ollama oder einem lokalen Server. Nichts verlässt je den Rechner.",

    how_eyebrow: "So funktioniert's",
    how_title: "Fünf Phasen vom Satz zur Spec.",
    how_lede: "Ein geführter Assistent macht aus einer Zeile Absicht Dokumente, mit denen ein Build-Agent arbeiten kann.",
    s1_t: "Beschreiben", s1_d: "Beginne mit einem Satz oder kurzen Absatz. Mehr braucht Hephaestus nicht.",
    s2_t: "Interviewen", s2_d: "Es stellt die scharfen Fragen — Umfang, Nutzer, Grenzen — und füllt die Lücken, die du übersehen würdest.",
    s3_t: "Blueprint", s3_d: "Erhalte einen empfohlenen Lösungstyp, realistischen Umfang und eine ehrliche Zeitschätzung — vorab.",
    s4_t: "Spezifizieren", s4_d: "Ein vollständiges PRD und eine technische Spec werden geschmiedet — strukturiert und build-fertig.",
    s5_t: "Ausliefern", s5_d: "Exportiere ein ZIP für deinen Build-Agenten oder iteriere mit „Neu generieren“ weiter.",

    show_eyebrow: "In Aktion",
    show_title: "Dokumente, keine Chat-Protokolle.",
    show_lede: "Jedes Projekt erzeugt einen aufgeräumten Arbeitsbereich — Blueprint, PRD, Technische Spec und Schätzung, exportbereit.",

    ex_eyebrow: "Beispiele",
    ex_title: "Echte Specs, durchgängig geschmiedet.",
    ex_lede: "Zwei Beispielprojekte liegen dem Repo bei — sieh das Ergebnis, bevor du dein eigenes startest.",
    ex1_desc: "Ein KI-Habit-Tracker, der jedes große Ziel in adaptive tägliche Mikro-Aufgaben zerlegt.",
    ex2_desc: "Ein WeChat-Mini-Programm, das plattformübergreifende Lieferbestellungen bündelt und den Tagesbestand per KI prognostiziert.",
    ex_status: "fertig", ex_wizard: "Assistent", ex_docs: "Docs",

    docs_eyebrow: "Dokumentation",
    docs_title: "Alles fürs Self-Hosting.",
    docs_lede: "Klare, praktische Anleitungen — vom ersten Clone bis zur eigenen Engine.",
    d1_t: "Schnellstart", d1_d: "Klonen, starten, erste Spec in Minuten schmieden.",
    d2_t: "Bring deine eigene Engine", d2_d: "CLI-Agenten, API-Keys oder lokale Modelle anbinden.",
    d3_t: "Der 5-Phasen-Assistent", d3_d: "Wie aus einer Idee eine baubare Spec wird.",
    d4_t: "Self-Hosting", d4_d: "Auf deinem Rechner, komplett offline.",
    d5_t: "Dokumenttypen", d5_d: "Blueprint, PRD, Technische Spec, Schätzung.",
    d6_t: "Mitwirken", d6_d: "Engines, Übersetzungen und Vorlagen ergänzen.",

    cta_title: "Schmiede mit uns.",
    cta_sub: "Hephaestus ist Open Source und 100% lokal. Bring deine Engine und deine Ideen — und forme den Amboss mit.",
    cta_primary: "Auf GitHub sternen",
    cta_secondary: "Doku lesen",

    foot_blurb: "Schmiede eine vage Idee zu einer build-fertigen Spec — mit der KI-Engine, die du schon hast.",
    foot_h_product: "Produkt", foot_h_resources: "Ressourcen", foot_h_project: "Projekt",
    f_engines: "Engines", f_quickstart: "Schnellstart", f_how: "Funktionsweise", f_examples: "Beispiele",
    f_docs: "Dokumentation", f_byoe: "Bring deine eigene Engine", f_wizard: "Der Assistent", f_selfhost: "Self-Hosting",
    f_github: "GitHub", f_releases: "Releases", f_license: "Lizenz", f_contributing: "Mitwirken",
    foot_local: "v0.1.0 · 100% lokal",
    foot_rights: "Open Source, MIT-lizenziert.",
  },
};

const LANG_ORDER = ["en", "zh", "es", "fr", "de"];
const HTML_LANG = { en: "en", zh: "zh-Hans", es: "es", fr: "fr", de: "de" };

function applyLang(code) {
  const dict = I18N[code] || I18N.en;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] != null) el.innerHTML = dict[key];
  });
  document.documentElement.lang = HTML_LANG[code] || "en";
  // reflect current selection in the switcher
  document.querySelectorAll(".lang-opt").forEach((o) => {
    o.setAttribute("aria-current", o.dataset.lang === code ? "true" : "false");
  });
  const cur = document.getElementById("langCurrent");
  if (cur) cur.textContent = dict.glyph;
  try { localStorage.setItem("hf-lang", code); } catch (e) {}
}

window.HF_I18N = { I18N, LANG_ORDER, applyLang };
