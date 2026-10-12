# TarjetAlan

Aplicación web educativa (PWA) para estudiar medicina funcional e integradora aplicada a ginecología, con un recorrido prioritario de fertilidad. El contenido se presenta en *learning cards* con repaso espaciado, en español (tú) e inglés, y funciona sin conexión.

> Herramienta educativa para profesionales. No es un título acreditado ni sustituye el juicio clínico. Las auditorías las hacen agentes de IA con roles asignados; no equivalen a revisión médica humana. Sin afiliación con Harvard, IFM ni otras instituciones citadas.

- **App publicada:** https://alansapps.github.io/TarjetAlan/ (cuando el despliegue esté activo; ver `PROJECT_STATUS.md`)
- **Estado, decisiones y auditorías:** `PROJECT_STATUS.md`, `DECISIONS.md`, `AUDIT_LOG.md`, `CONTENT_COVERAGE.md`, `docs/audits/`

## Para Sol: uso rápido

1. Abre el enlace en Safari.
2. **Añadir a inicio:** toca *Compartir* → *Añadir a pantalla de inicio*. Se abrirá como una app, sin barra del navegador.
3. **Estudiar:** toca *Estudiar 5 minutos* (puedes elegir 3, 5, 10 o 15). Mezcla repaso y contenido nuevo, con prioridad en fertilidad.
4. **Sin conexión:** en *Ajustes → Almacenamiento → Descargar todo* se guarda el contenido para estudiar offline.
5. **Respaldo:** el progreso se guarda solo en ese teléfono y navegador. De vez en cuando, en *Ajustes → Respaldo → Exportar respaldo*, guarda el archivo (por ejemplo en Archivos o iCloud). Para recuperarlo, *Importar respaldo* → *Combinar*.

## Desarrollo

Requisitos: Node 24+, Git. La ruta real del proyecto contiene `#` (`#08 AI`), que rompe Vite. Antes de usar las herramientas, mapea una unidad virtual (se pierde al reiniciar):

```powershell
subst T: "C:\Users\alana\OneDrive - albrecht.es\Desktop\WORK\EXECUTIVE SEARCH\#08 AI\#13 TARJETALAN\TARJETALAN CLAUDE"
```

y trabaja desde `T:\tarjetalan-wip` (o `T:\tarjetalan` para `main`).

| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias (versiones fijadas). |
| `npm run dev` | Compila el contenido y abre el servidor de desarrollo. Con `CONTENT_INCLUDE_DRAFTS=1` incluye borradores. |
| `npm test` | Tests (Vitest): scheduler, selector, persistencia, migración, respaldo, contenido. |
| `npm run typecheck` | TypeScript estricto. |
| `npm run build` | Contenido → tipos → build estático en `dist/` (con `sw.js` y `version.json`). |
| `npm run content:check` | Valida el contenido sin escribir. |
| `node scripts/make-icons.ts` | Regenera los iconos PNG. |

### Git y worktrees

- `TARJETALAN CLAUDE/tarjetalan` → `main` (estable). `TARJETALAN CLAUDE/tarjetalan-wip` → ramas de trabajo (`feat/…`, `content/…`, `fix/…`).
- Cada lote se audita (médico, arquitectura, UX) antes de integrarse a `main`; sin bloqueantes abiertos.
- No se usa `force push` ni `rebase` de ramas compartidas.
- OneDrive: el repo vive en una carpeta sincronizada. `.gitignore` excluye `node_modules`, `dist` y copias en conflicto `*-AlanPC.*`. Si aparece un duplicado, se compara antes de borrar.

## Publicación (GitHub Pages)

Se publica desde la rama `gh-pages` (el token disponible no permite GitHub Actions):

```bash
scripts/deploy.sh
```

El script exige estar en `main` limpio, ejecuta `npm ci`, los tests y el build, y publica `dist/` como un commit nuevo en `gh-pages` que indica el commit de origen. **Rollback:** haz checkout del tag o commit anterior de `main` y vuelve a ejecutar el script. Base relativa (`./`) y rutas con hash (`#/…`), así que funciona bajo `/TarjetAlan/` sin reglas de servidor.

## Arquitectura

```
src/
  domain/content    esquemas Zod (autoría bilingüe, paquetes por idioma, manifiesto, índice)
  domain/scheduler  FSRS (ts-fsrs) puro + tiempo (día local, orden de eventos)
  domain/session    selector de sesiones puro (duración, mezcla, prioridad, espaciado)
  storage           IndexedDB: log de intentos → progreso derivado, sesiones (CAS),
                    contenido (SHA-256 + Zod, LRU), respaldo, outbox, preferencias
  i18n              textos de interfaz ES (tú) / EN (EN se carga bajo demanda)
  audio             síntesis de voz del navegador
  ui                tokens Calma, estilos, componentes compartidos
  features          pantallas: inicio, sesión, temas, repaso, escuchar, ajustes, tarjeta
scripts/            build-content, sw-template, make-icons, deploy
content/            curriculum.json, references.json, modules/*.json (autoría)
```

### Persistencia (resumen; detalle en DECISIONS D-008…D-014)

- **IndexedDB:** intentos (inmutables, idempotentes), progreso (caché reconstruible), marcas (guardada/suspendida), sesiones, paquetes de contenido, reportes.
- **localStorage:** solo preferencias pequeñas y una cola de respuestas pendientes si IndexedDB falla.
- **Cache Storage (service worker):** solo el shell de la app; el contenido no se duplica allí.
- **Sin cookies.** Nada se envía a ningún servidor.
- Las descargas de contenido se pueden borrar sin tocar el progreso. El navegador puede borrar datos del sitio (Safari elimina los de webs no usadas durante semanas si no están en la pantalla de inicio): por eso existe el respaldo.

### Contenido

Autoría bilingüe en `content/modules/<módulo>.json`. Cada afirmación clínica lleva una cita `[[ref:id]]` a `content/references.json` (título, autores, año, URL/DOI, tipo, población, hallazgo, limitaciones, fecha de acceso). El build rechaza citas desconocidas, diferencias de citas entre ES y EN, preguntas sin exactamente una opción correcta, IDs duplicados y ciclos de prerrequisitos. Estados editoriales: `draft` → `sources-verified` → `ai-audited` / `needs-human-review`. Solo los dos últimos se publican.

### Límites conocidos de Safari / PWA

- La voz sintetizada puede detenerse al bloquear la pantalla en iPhone.
- iOS puede cerrar la conexión a IndexedDB en segundo plano: la app reabre y reintenta; si no puede, guarda la respuesta como pendiente y no avanza.
- No hay sincronización entre dispositivos: usa exportar/importar.
