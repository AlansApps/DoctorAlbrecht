# DECISIONS

| ID | Fecha | Decisión | Motivo |
|---|---|---|---|
| D-001 | 2026-10-12 | ~~Nombre de trabajo `sol-gineco`~~ → reemplazado por D-006. | — |
| D-002 | 2026-10-12 | Repo y worktrees dentro de la carpeta OneDrive `TARJETALAN CLAUDE`. | Elección de Alan, aceptando riesgo de sync. Mitigación: escrituras pausadas, revisar duplicados `*-AlanPC.*` / locks tras operaciones masivas, `.gitignore` los excluye. |
| D-003 | 2026-10-12 | Stack: React + TypeScript + Vite, build estático, GitHub Pages. | Spec 04. |
| D-004 | 2026-10-12 | Repo público. | Pages gratis solo en repos públicos; la URL de Pages es pública igual (sin auth). Sin datos de pacientes ni secretos. Elección de Alan. |
| D-005 | 2026-10-12 | Despliegue Pages desde rama `gh-pages` (no Actions) por ahora. | Token sin scope `workflow`. Reevaluar si Alan amplía permisos. |
| D-006 | 2026-10-12 | Nombre de la app: **TarjetAlan**. Repo `AlansApps/TarjetAlan`; carpetas `tarjetalan` (main) y `tarjetalan-wip` (worktree). | Elección de Alan. Comprobación razonable (búsqueda web 2026-10-12): no aparece app ni marca "TarjetAlan". No es búsqueda de registro ni garantía legal. |
| D-007 | 2026-10-12 | Las herramientas Node se ejecutan desde `T:\` (`subst T: "<ruta TARJETALAN CLAUDE>"`). | La ruta real contiene `#` (`#08 AI`), que rompe Vite/Vitest; un junction no sirve (realpath lo resuelve). `subst` se pierde al reiniciar. |
| D-008 | 2026-10-12 | Ciclo de aprendizaje de card: `new → studied` (lectura = exposición) → primera recuperación a los 10 min → FSRS. Preguntas: FSRS desde la primera respuesta. | Separar exposición de recuerdo (spec 05) sin repetir indefinidamente lo leído (ARCH-001). |
| D-009 | 2026-10-12 | FSRS (ts-fsrs 5.4.2): retención 0,9, intervalo máx. 365 d, fuzz con semilla por ítem. Botones: No lo recordaba=Again, Me costó=Hard, Lo recordaba=Good, Muy fácil=Easy. Pregunta: error=Again, acierto=Good, acierto dudoso=Hard. | Algoritmo mantenido y documentado; determinista para replay (ARCH-020/023). |
| D-010 | 2026-10-12 | Día de estudio local con corte a las 04:00 en la zona del dispositivo; repasos largos vencen por día local, pasos cortos al minuto. | ARCH-009; Sol puede estudiar de noche. |
| D-011 | 2026-10-12 | Persistencia: log de intentos inmutable (IndexedDB) → progreso derivado y reconstruible; un único orden de eventos (instante, id). Sesión: respuesta + avance en una transacción con CAS por `rev`; id de intento `${sesión}:${posición}`. Salvavidas en localStorage (outbox) si IndexedDB falla. | Idempotencia, dos pestañas, reanudación sin duplicar, combinación de respaldos (ARCH-004/008). |
| D-012 | 2026-10-12 | Contenido en IndexedDB (no en el service worker): manifiesto persistido, paquetes verificados por SHA-256 y Zod antes de marcarse disponibles, LRU solo sobre paquetes. El SW cachea solo el shell, versionado por hash del contenido. | Spec 04: sin duplicar capas; offline; descarga atómica (ARCH-010/016). |
| D-013 | 2026-10-12 | Respaldo JSON versionado (`tarjetalan-backup` v1): intentos + marcas + reportes. Combinar = unión por id + marca más reciente + reconstrucción. Reemplazar guarda copia previa restaurable. | Spec 04. |
| D-014 | 2026-10-12 | Publicación estable solo de ítems `ai-audited` o `needs-human-review`; `draft`/`sources-verified` solo en desarrollo. | Spec 05: no mostrar contenido no auditado como recomendado. |
| D-015 | 2026-10-12 | Estilo visual: **D · Calma** (serena minimalista): Manrope (títulos) + Atkinson Hyperlegible Next (texto), acento pizarra, Lucide. Se aplican las correcciones del auditor UX (cuerpo ≥16 px en `rem`, bordes ≥3:1, botón principal con aspecto de botón, barra de acción fija, ✓/✗ + etiqueta en respuestas). | Elección de Alan sobre la vista previa de 4 direcciones. |
| D-016 | 2026-10-12 | Español neutro con **tú** (no voseo) en interfaz y contenido. | Elección de Alan; coincide con la especificación. |
