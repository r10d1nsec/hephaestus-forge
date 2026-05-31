# Estimation Report — Streakly (AI Adaptive Habit Tracker)

## Breakdown por módulo/feature

| Feature | Complejidad | Horas Min | Horas Max |
|---|---|---|---|
| Project setup (PWA scaffold, CI, env, DB schema) | Media | 16 | 28 |
| Auth: Email + OAuth (signup, login, sessions, recovery) | Media | 24 | 40 |
| Goal input UI + onboarding flow | Baja | 12 | 20 |
| AI goal decomposition (prompt design, LLM integration, parsing into structured micro-tasks) | **Alta** | 40 | 80 |
| Daily task feed + check-off (state, persistence, offline-friendly) | Media | 24 | 40 |
| Adaptive rescheduling engine (miss detection, replanning logic, AI re-prompting) | **Alta** | 48 | 96 |
| Streak & progress view (calc, visualizations, history) | Media | 20 | 36 |
| LLM provider integration layer (calls, retries, cost/rate limiting, error states) | Media-Alta | 20 | 40 |
| PWA polish (installability, service worker, responsive, offline cache) | Media | 16 | 32 |
| Settings / account management | Baja | 8 | 16 |
| QA, bug-fixing, cross-device testing | — | 30 | 60 |
| Deployment, monitoring, basic analytics | Baja-Media | 12 | 24 |

## Total estimado

**270 – 512 horas de desarrollo**

(El rango es amplio a propósito: las dos features con IA — decomposición y rescheduling — concentran ~33–35% del esfuerzo y son las de mayor incertidumbre. Si su diseño de prompt/lógica sale a la primera, te vas al extremo bajo; si requiere iteración para producir planes coherentes, te vas al alto.)

## Estimación según dedicación

| Dedicación | Horas/semana | Tiempo total |
|---|---|---|
| Full-time (1 dev) | 40 | 7 – 13 semanas |
| Part-time serio | 20 | 14 – 26 semanas (~3,5 – 6 meses) |
| Side-project (noches/findes) | 10 | 27 – 51 semanas (~6 – 12 meses) |
| Equipo de 2 devs | 60–70 efectivas | 4 – 8 semanas |

## Factores de riesgo

1. **Calidad no determinista de la IA (riesgo #1).** "Descomponer cualquier objetivo en micro-tareas adaptativas" suena simple en una frase y es donde se va el presupuesto. Un LLM produce planes plausibles pero a menudo genéricos, mal secuenciados o no accionables. Lograr salida *consistentemente buena* exige iteración de prompts, validación de output estructurado y casos límite ("aprender chino", "correr un maratón", "lanzar un SaaS" no se decomponen igual). **Esto puede duplicar la estimación de esas dos features.**
2. **Lógica de rescheduling subespecificada.** "Reprograma cuando fallas un día" no define las reglas: ¿comprime el plan?, ¿mueve la fecha objetivo?, ¿reduce el alcance diario?, ¿qué pasa tras 5 fallos seguidos? Sin estas reglas decididas *antes* de programar, habrá retrabajo. Es un problema de producto disfrazado de tarea técnica.
3. **Costo y latencia del LLM en producción.** Cada decomposición/replanificación es una llamada de pago con latencia de segundos. Necesitas caching, manejo de timeouts, estados de carga y un tope de costos — trabajo real que suele olvidarse en la estimación inicial.
4. **PWA mobile-first ≠ gratis.** Service workers, offline check-off, sincronización de estado e instalabilidad fiable en iOS (notoriamente limitada para PWAs) consumen más tiempo del que la gente espera.
5. **Alcance de auth subestimado.** Email + OAuth con verificación, recuperación y manejo de sesiones es rara vez "unas horas"; los edge cases de seguridad lo inflan.
6. **Scope creep desde el "later".** Push notifications están fuera del MVP, pero un habit tracker sin recordatorios tiene retención débil — hay presión real de meterlas antes de lanzar. Vigílalo.

## Recomendaciones para reducir tiempo

- **Trata la IA como feature de riesgo, no como dado.** Haz un *spike* de 1–2 días sobre decomposición + rescheduling **antes** de comprometerte al rango completo. Reduce la incertidumbre que más infla la estimación.
- **Decide las reglas de rescheduling en producto antes de codear.** Escríbelas como pseudo-reglas explícitas; deja que la IA solo rellene contenido, no que invente la política. Más barato y más predecible.
- **Empieza con la decomposición vía IA y la ejecución/feed con lógica clásica.** No necesitas IA para el check-off, los streaks ni los cálculos de progreso — sepáralo y solo paga el costo (y la incertidumbre) de IA donde aporta diferenciación.
- **Usa servicios gestionados de auth** (Auth0, Clerk, Supabase Auth). Recortas 20–35 h de las más aburridas y arriesgadas.
- **Cachea agresivamente las respuestas del LLM** por objetivo/plan; recortas costo, latencia y código de manejo de errores.
- **Recorta el MVP a un solo método de creación de hábito bien pulido** en vez de "cualquier objetivo". Demostrar excelencia en una vertical (p. ej. fitness) baja el alcance de IA del extremo alto al bajo.
- **Difiere visualizaciones ricas de streaks.** Una vista simple valida la retención; la versión bonita puede esperar a post-lanzamiento.

---
*Nota de honestidad: si solo recuerdas un número de este informe, que sea este — las dos features de IA son el 80% del riesgo de cronograma. Valídalas primero o el rango "max" se convierte en tu realidad.*
