# PROJECT_STATUS

_Última actualización: 2026-10-12_

## Fase actual
**Fase 2: recorrido completo con módulos piloto auditados.** La app funciona de punta a punta en build de producción local (preview). Pendiente: auditoría de merge (arquitectura y UX sobre la app real), después merge a `main` y primer despliegue en GitHub Pages.

## Rutas reales
| Rol | Ruta | Rama |
|---|---|---|
| Estable | `TARJETALAN CLAUDE/tarjetalan` | `main` |
| WIP | `TARJETALAN CLAUDE/tarjetalan-wip` (worktree) | `feat/phase1-foundations` |
| Especificación (solo lectura) | `TARJETALAN CLAUDE/claude-gineco-instrucciones/claude-gineco/00–06*.md` | — |
| Herramientas Node | `T:\tarjetalan-wip` tras `subst T: "<ruta TARJETALAN CLAUDE>"` (D-007) | — |
| Preview local | `.claude/launch.json` → `tarjetalan-preview` (vite preview en :4173) | — |

Remoto: https://github.com/AlansApps/TarjetAlan (público). Pages: rama `gh-pages` vía `scripts/deploy.sh` (aún no publicada).

## Decisiones de Alan
Estilo **D · Calma** (D-015). Español neutro con **tú** (D-016). Repo público (D-004). Repo dentro de OneDrive (D-002).

## Hecho
- **Fase 0 y Fase 1** completas: mapas curriculares (280 microtemas), fuentes verificadas, 4 estilos, auditorías.
- **Base técnica:**
  - FSRS, selector de sesiones, persistencia en IndexedDB (log de intentos, sesiones con CAS, outbox).
  - Contenido offline verificado por hash, respaldo con combinar/reemplazar/deshacer, SW por hash de contenido.
  - Arquitectura auditada dos veces; todos los bloqueantes cerrados (ARCH-001…033).
- **Interfaz Calma:**
  - Pantallas: Inicio, Sesión (aprender / recuperar / pregunta / refuerzo / resumen), Temas con búsqueda ES/EN, Macrotema, Repaso, Guardadas, Tarjeta, Escuchar (voz del navegador), Ajustes.
  - ES/EN, tema claro/oscuro, tamaño de texto, PWA (manifiesto e iconos).
  - Probada en preview (Chromium emulado): flujo completo, refuerzo tras fallo, reanudación tras recargar, ES/EN, oscuro, 320 px sin scroll horizontal.
- **Contenido piloto:** `fert-ovarian-reserve` y `pcos-metabolic-pilot`: 7 lecciones, 19 tarjetas, 16 preguntas, 1 caso. Todo `ai-audited`, salvo la tarjeta de letrozol (`needs-human-review`).
- **Pesos del build:** JS inicial 128 KB gzip; CSS 4,8 KB; fuentes latinas unos 59 KB. Shell inicial estimado en unos 195 KB.
- README (desarrollo, publicación, rollback, persistencia, límites de Safari) y `docs/curriculum/CONTENT_PLAN.md` (Fase 3 por lotes).

## Pendiente / próximo paso
1. Resultado de las auditorías de merge (arquitectura y UX) y corrección de bloqueantes.
2. Merge a `main`, `scripts/deploy.sh`, activar Pages y verificar la URL HTTPS, la subruta, el SW y los enlaces profundos.
3. Fase 3: lotes de contenido según CONTENT_PLAN.
4. Mapas: normalizar ids cruzados y verificar Cochrane antioxidantes en el varón (ver AUDIT_LOG).
