# PROJECT_STATUS

_Última actualización: 2026-10-12_

## Fase actual
**Fase 1 casi completa — en pausa por la elección de estilo de Alan.** Base técnica (Fase 2) avanzada en paralelo.

## Rutas reales
| Rol | Ruta | Rama |
|---|---|---|
| Estable | `TARJETALAN CLAUDE/tarjetalan` | `main` |
| WIP | `TARJETALAN CLAUDE/tarjetalan-wip` (worktree) | `feat/phase1-foundations` |
| Especificación (solo lectura) | `TARJETALAN CLAUDE/claude-gineco-instrucciones/claude-gineco/00–06*.md` | — |
| Herramientas Node | ejecutar desde `T:\tarjetalan-wip` tras `subst T: "<ruta TARJETALAN CLAUDE>"` (D-007) | — |

Remoto: https://github.com/AlansApps/TarjetAlan (público). Pages: aún sin activar (rama `gh-pages`, D-005).

## Entorno
Git 2.54 · Node 24.16 · npm 11.13 · sin Python · `gh` como AlansApps (scopes `repo`, `gist`, `read:org`, sin `workflow`) · subagentes disponibles.

## Hecho
- **Fase 0:** repo, worktree, remoto, continuidad.
- **Fase 1:**
  - Mapas curriculares (`docs/curriculum/`): 16 macrotemas y 276 microtemas, alrededor de 120 fuentes verificadas y registro de discrepancias. Generan `content/curriculum.json`.
  - Referentes de diseño verificados (`docs/branding/REFERENCES.md`) y 4 direcciones visuales: https://claude.ai/artifact/UkxcRNU2J28sBNKBmWLVNw
  - 3 auditorías independientes (`AUDIT_LOG.md`).
- **Base técnica:**
  - Programador FSRS, selector de sesiones y persistencia en IndexedDB (log de intentos, sesiones con CAS, outbox).
  - Contenido offline verificado por hash, respaldo con combinar y reemplazar, y plantilla del service worker.
  - 59 tests pasan; `tsc` sin errores. Correcciones de los 3 bloqueantes y 8 importantes de arquitectura.
- **Contenido piloto (estado `sources-verified`, pendiente de auditoría médica):** `fert-ovarian-reserve` (3 lecciones, 9 cards, 8 preguntas, 1 caso) y `pcos-metabolic-pilot` (3 lecciones, 8 cards, 8 preguntas).

## Pendiente / próximo paso
1. **Alan:** elegir estilo (A/B/C/D o mezcla) y registro de idioma (voseo o "tú").
2. Re-verificación de arquitectura sobre las correcciones; auditoría médica de los 2 módulos piloto.
3. Correcciones médicas pendientes de los mapas (ids, alarmas, alias PMOS, antioxidantes; ver AUDIT_LOG).
4. UI con el estilo elegido: tokens, inicio, sesión, temas, repaso, ajustes, i18n ES/EN, audio, PWA, export/import.
5. Primer build, despliegue en GitHub Pages y escenarios de aceptación de la spec 06.
