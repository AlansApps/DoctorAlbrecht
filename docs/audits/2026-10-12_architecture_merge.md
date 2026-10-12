# Auditoría de arquitectura y código para el merge — Fase 2 (núcleo + UI)

- **Auditor:** arquitectura y calidad de código (independiente). Solo lectura sobre `src/`, `scripts/` y configuración. `npm run build` regeneró `dist/` y `public/content/` (ambos en `.gitignore`), como se pidió.
- **Fecha:** 2026-10-12
- **Commit auditado:** `89b1744` (rama `feat/phase1-foundations`), con las correcciones del núcleo en `5638225`.
- **Informes previos:**
  - `2026-10-12_architecture_phase1.md` (ARCH-001…023).
  - `2026-10-12_architecture_phase1_reverify.md` (ARCH-024…033).
- **Aviso:** el worktree tiene cambios que no están en `89b1744`: `README.md` y `scripts/deploy.sh` preparados para commit, `content/curriculum.json` modificado. Los tests y el build se ejecutaron sobre ese árbol. Antes del merge hay que repetirlos sobre el commit exacto que se integre.

## 1. Comandos y resultados

| Comando (desde `/t/tarjetalan-wip`) | Resultado |
|---|---|
| `npx vitest run` | 9 archivos, **69/69 tests pasan**. |
| `npx tsc --noEmit -p tsconfig.json` | **0 errores**. |
| `npm run build` | OK. `content ok: 2 modules, 35 items, 4 packs`. JS principal `index-*.js` **414,97 KB / 127,83 KB gzip**; CSS 22,3 KB / 4,8 KB gzip; 6 pantallas en chunks perezosos (0,6–2,7 KB gzip cada una); `en` perezoso (3,75 KB gzip); 4 fuentes WOFF2 (93 KB en total, 2 por página). |
| Peso del contenido (`dist/content`) | `manifest.json`: **69,8 KB / 19,0 KB gzip** para 35 ítems (la mayor parte son títulos bilingües del currículo completo). Paquetes: 22–32 KB / 6–9 KB gzip. |
| Estimación con `rolldown` de las dependencias del JS principal (`docs/audits/scratch/bundle/`) | React 19 + react-dom en producción: unos 58–60 KB gzip (mi build aislado salió en modo desarrollo, 66 KB). Zod clásico con un uso realista: unos 23 KB gzip (más con `discriminatedUnion`/`record`/`url`); `zod/mini` serían unos 4 KB. ts-fsrs 6,4 KB, idb 1,3 KB. El resto es código propio, iconos Lucide y `es`. |
| `node -e "import('./src/storage/sessionRepo.ts')…"` | `import ok` (ARCH-028 corregido). |
| `npx vitest run --config docs/audits/scratch/vitest.scratch.config.ts` | Sondas `arch_merge.probe.ts` (re-ejecución de A–M) y `outbox_merge.probe.ts` (OB1–OB3). Salida en el §2. |
| `curl http://localhost:4173/` | 200 (servidor de preview activo; no se usó para cambiar nada). |

Las sondas están **solo** en `docs/audits/scratch/`, que ya está en `.gitignore`.

## 2. Salida de las sondas

```
ok   A..F, K, L, M (sin regresiones respecto a la re-verificación)
ok   D2 suspended + attempt: incremental == rebuild (differingFields [])
ok   G  filter + prerequisite outside filter -> ["diet.card"]
--   G2 cyclic prerequisites -> [] en el selector, pero el build ahora rechaza los ciclos (build-content.test)
ok   H  mistakes: pregunta fallada hace 5 s -> no seleccionada
ok   I  answerStep para un ítem distinto -> SessionConflictError; el log queda coherente (no hay progreso sin intento)
ok   J  answerStep rechaza ítem equivocado y sesión terminada (SessionConflictError)
ok   OB1 outbox: flushed 1, la sesión avanza a pos 1, pending 0
BUG  OB2 tras "Borrar datos de aprendizaje", el outbox vuelve a escribir el intento pendiente: attempts 1, progress 1
BUG  OB3 flush concurrente con enqueue: queda 0 pendientes (se esperaba 1): la nueva entrada se pierde
```

(En la salida bruta de `arch_merge.probe.ts`, I y J aparecen como "BUG" porque la condición de la sonda original esperaba aceptación. El comportamiento observado, `SessionConflictError`, es justamente la corrección.)

## 3. Estado de los hallazgos anteriores

| ID | Archivo:línea (89b1744) | Hallazgo | Severidad | Evidencia | Corrección pendiente | Estado tras re-verificación |
|---|---|---|---|---|---|---|
| ARCH-001…007, 009, 010, 015…020, 022, 023 | — | (cerrados en la re-verificación) | — | Sondas A–F, K, L, M sin regresión. | — | **cerrado** |
| ARCH-008 | `sessionRepo.ts:64-95` | Sesión: validar el paso y abortar ante errores | importante | Sonda J: rechaza ítem distinto y sesión terminada; `try/catch → tx.abort()` alrededor de `applyAttemptInTx`. | — | **cerrado** |
| ARCH-011 | `selector.ts:127-132` | "Errores": re-preguntar inmediatamente | importante | Sonda H: `MISTAKE_MIN_GAP_MS` = 1 h, salvo que ya esté vencido. | — | **cerrado** |
| ARCH-012 | `selector.ts:93` | Fertilidad cableada | menor | Las prioridades llegan del manifiesto, pero el ámbito `fertility` sigue usando `FERTILITY_MACRO`. | Derivar el ámbito del manifiesto. | **parcial** |
| ARCH-013 | `selector.ts:205-210` | Pregunta cuyo concepto tiene la card en otro micro fuera del ámbito | menor | Sin cambios. | Igual que antes. | **parcial** |
| ARCH-014 | DECISIONS | Política ante cambios materiales de pregunta | menor | No hay decisión documentada. | Documentarla. | **parcial** |
| ARCH-021 | `tsconfig.json` | tsconfig único; falta `erasableSyntaxOnly` | sugerencia | Ya no hay propiedades de parámetro, pero nada impide que vuelvan. | Separar app/node/sw y activar `erasableSyntaxOnly`. | **abierto** (aceptado) |
| ARCH-024 | `progressRepo.ts:57-74`; `sessionRepo.ts:64-95`; `outbox.ts` | Colisión de ids del outbox | bloqueante | Sondas I/J/OB1: `AttemptIdConflictError` si el id pertenece a otro ítem o evento; `answerStep` valida el ítem y el estado; el outbox guarda `{attempt, position}` validado con Zod y se vacía mediante `answerStep` (avanza la sesión); la UI no avanza mientras hay una respuesta pendiente (`SessionScreen.tsx:85-88`). | Defectos residuales menores en ARCH-041/042. | **cerrado** |
| ARCH-025 | `selector.ts:152-160`; `build-content.ts` (detección de ciclos) | Prerrequisitos que bloqueaban | importante | Sonda G: se permite el micro cuyo prerrequisito queda fuera del pool; un micro ya empezado sigue abierto; el build rechaza ciclos (test). | — | **cerrado** |
| ARCH-026 | `selector.ts:127-132` | "Errores" re-preguntaba al instante | importante | Sonda H. | — | **cerrado** |
| ARCH-027 | `progressRepo.ts:33-40` | `updatedAt` distinto entre caché y replay | menor | Sonda D2: sin diferencias (`withFlags` compartido). | — | **cerrado** |
| ARCH-028 | `sessionRepo.ts`, `contentRepo.ts` | Propiedades de parámetro | menor | Node importa ambos módulos. | Ver ARCH-021. | **cerrado** |
| ARCH-029 | `outbox.ts` | Recorte silencioso; sin validación | menor | Validado con Zod; `enqueue` devuelve `false` si está lleno (1000). Hay defectos nuevos de concurrencia y de reinicio (ARCH-040/041). | — | **cerrado** |
| ARCH-030 | `contentRepo.ts:53-120` | JSON corrupto; re-validación; expulsión por cuota | menor | `ContentError('invalid')`, `looksLikePack` y expulsión LRU de uno en uno. | — | **cerrado** |
| ARCH-031 | `build-content.ts` (fórmula de `order`) | Colisiones de `order` | menor | Fórmula por campos con topes de 99 lecciones y 99 ítems verificados en el build (`microPos ≤ 999` no se verifica, pero es improbable). | — | **cerrado** |
| ARCH-032 | `db.ts:14` | Esquema v1 cambiado sin subir la versión | menor | No consta en PROJECT_STATUS ni en AUDIT_LOG. Este merge es la **primera publicación con BD**: a partir de aquí v1 queda congelado. | Anotar en PROJECT_STATUS que no hay BD v1 publicada previamente y que cualquier cambio de esquema futuro sube `DB_VERSION`. | **abierto** |
| ARCH-033 | `selector.ts:279-287` | Descarte de la pregunta equivocada | sugerencia | Solo se descartan preguntas nuevas del concepto en conflicto (`isNew`). | — | **cerrado** |

## 4. Hallazgos nuevos (capa UI y su integración)

| ID | Archivo:línea | Hallazgo | Severidad | Evidencia / escenario de fallo | Corrección requerida | Estado tras re-verificación |
|---|---|---|---|---|---|---|
| ARCH-034 | `src/features/settings/SettingsScreen.tsx:198`; `src/storage/backup.ts` (`restorePreImport`, `importBackup`) | **"Deshacer importación" puede revertir todo el progreso sin confirmación.** El botón está siempre visible, no pide confirmación ni muestra la fecha de la copia, y hace un `replace` con la copia tomada antes de la **última** importación (que puede tener semanas). A su vez guarda el estado actual como nueva copia, así que el botón alterna entre dos estados sin que se vea. `eraseLearningData` tampoco borra esa copia. | **bloqueante** | Escenario: Sol importa un respaldo en octubre y estudia 3 semanas. En noviembre toca "Deshacer importación" por error (botón *ghost* en Ajustes) → todo lo estudiado desde octubre desaparece. Solo se recupera pulsando otra vez, cosa que nada le indica; si estudia antes de hacerlo, el segundo toque también pierde lo nuevo. Riesgo de pérdida de progreso. | Mostrar el botón solo si existe copia, con su fecha y número de intentos; confirmación explícita; caducar la copia (p. ej. 24 h o al registrar el siguiente intento) o convertir "deshacer" en **combinar** en vez de reemplazar; borrar la copia con "Borrar datos". Test. | **nuevo** |
| ARCH-035 | `src/app/AppState.tsx` (efecto del SW, listener `controllerchange`); `scripts/sw-template.js:23` (`clients.claim()`) | **Recarga forzada a mitad de pregunta.** `controllerchange → location.reload()` es incondicional: (a) en la **primera visita**, `clients.claim()` en `activate` hace pasar el controlador de `null` al SW y la página se recarga sola segundos después de abrirse, quizá con Sol ya en la primera tarjeta; (b) si Sol pulsa "Actualizar ahora" en una pestaña, **todas** las demás pestañas o ventanas de la PWA se recargan, aunque estén a mitad de pregunta. Spec 04: "no fuerces recarga a mitad de pregunta". | importante | Lectura de código y semántica estándar de SW (`claim()` dispara `controllerchange`). El aviso de actualización se oculta en la sesión, pero la recarga no depende de ese aviso. Los intentos ya guardados no se pierden (se guardan por paso); se pierde la respuesta en curso y se interrumpe el flujo. | Recargar solo si había controlador al cargar (`const hadController = !!navigator.serviceWorker.controller`) **y** esta pestaña pidió la actualización (bandera local), o aplazar la recarga hasta que la ruta no sea `session`. | **nuevo** |
| ARCH-036 | `src/features/session/SessionScreen.tsx:99-102` (`pause`) y `:84-93` (`advance`); `src/features/session/useStartSession.ts:29`; `src/features/listen/ListenScreen.tsx:91-99` | **Progreso en memoria obsoleto al construir la siguiente sesión.** `app.progress` solo se refresca al **terminar** una sesión, al cambiar marcas o por mensajes de **otra** pestaña. Responder, pausar o escuchar no lo refrescan, y `startSession` usa ese `app.progress`. | importante | Escenario: Sol hace 3 pasos, pausa y pulsa "Estudiar 5 min" → el selector ve esos ítems como nuevos: vuelve a leer las mismas cards y **re-pregunta** lo que acaba de contestar (rompe "no repreguntar inmediatamente"). Las estadísticas de inicio también quedan desfasadas. Lo mismo ocurre con "Repasar" tras pausar y con las exposiciones de "Escuchar". | `startSession` debe leer el progreso y las marcas de IndexedDB en el momento (`loadAllProgress`/`loadFlags` dentro de `withDb`), o `advance`/`pause`/escucha deben llamar a `refresh()`. Lo primero elimina la clase de error. Test de integración: responder → pausar → nueva sesión no repite. | **nuevo** |
| ARCH-037 | `src/features/session/useStartSession.ts:29`; `src/features/session/sessionActions.ts:20,37`; `SessionScreen.tsx:55-61` | **Sin conexión, una sesión que incluye un módulo no descargado falla entera.** `startSession` admite `loadable`, pero **ningún llamador lo pasa**. Los paquetes solo se descargan bajo demanda (o con "descargar todo" del idioma actual), así que sin red la sesión se crea con ítems no cargables, `loadItems` lanza error y se muestra "requiere conexión" **para toda la sesión**. Además, crearla ya pausó la sesión abierta anterior. | importante | Escenario 8 de aceptación (descargar, desconectar, estudiar): con un módulo descargado y otro no, "Estudiar 5 min" sin red no funciona. Cambiar de idioma sin red también lo impide (los paquetes son por idioma). | Pasar `loadable` (paquetes guardados del idioma actual, vía `downloadedPacks`) cuando `!navigator.onLine` o cuando falle la descarga; en `SessionScreen`, saltar pasos no cargables en vez de fallar todo. Test con un paquete sí y otro no. | **nuevo** |
| ARCH-038 | `src/features/listen/ListenScreen.tsx:76-108`; `src/audio/speech.ts:35,41-44` | **"Escuchar": pausar no pausa y siguiente/anterior saltan segmentos.** `onEnd` se enlaza también a `onerror`, y tanto `speechSynthesis.cancel()` (en `pause` y al inicio de cada `speak`) como las interrupciones disparan `end`/`error` de forma **asíncrona**. `pause()` limpia el temporizador **antes** de que llegue ese evento, que luego programa `play(i + 1)`: la reproducción continúa. Al saltar, el evento del segmento cancelado programa otro `play` y se duplica el avance. Además, se registra **exposición** de cards interrumpidas. | importante | Lectura de código (comportamiento de `SpeechSynthesis` en Safari y Chrome: `cancel()` dispara `end` o `error` "interrupted"/"canceled"). Flujo principal "Escuchar" defectuoso; las exposiciones sin escuchar entera la card inflan "leído" y adelantan la primera recuperación. | Token de reproducción (contador) comprobado en `onEnd`; ignorar `onerror` con `error === 'interrupted'/'canceled'`; registrar exposición solo con `onend` del token vigente. Test con `speechSynthesis` simulado. | **nuevo** |
| ARCH-039 | `src/app/AppState.tsx:83` (arranque); `src/storage/contentRepo.ts:30-43`; `scripts/sw-template.js:34-39` | **El arranque depende de la red sin límite de tiempo.** El arranque espera a `loadManifest` (red primero, sin timeout) antes de quedar listo, y la navegación del SW también va a la red primero sin timeout. Con cobertura mala pero no nula, la app se queda en "Cargando…" hasta que expire el fetch (decenas de segundos). El manifiesto pesa 70 KB (19 KB gzip) con 35 ítems y se descarga entero en **cada** arranque. | importante | Spec 00/04: "inicio inmediato", offline tras descargar. Sin red, `fetch` falla rápido y hay fallback; el problema es la red lenta o intermitente. | Usar el manifiesto guardado al instante y revalidar en segundo plano (stale-while-revalidate), o timeout de 2–3 s; navegación del SW *cache-first* (los assets van versionados) con actualización en segundo plano; separar del manifiesto los títulos del currículo sin contenido o comprimirlos. | **nuevo** |
| ARCH-040 | `src/storage/backup.ts:131-140`; `src/storage/sessionRepo.ts:67-68`; `src/features/session/sessionActions.ts:105-108` | Tras "Borrar datos" o una importación con *reemplazar*: (a) no se vacía el outbox, y un intento pendiente **reaparece** al vaciarlo (sonda OB2); (b) `eraseLearningData` no avisa a otras pestañas; (c) en otra pestaña, `answerStep` lanza `Error('Unknown session')`, que se clasifica como fallo de guardado (`pending`) en vez de conflicto: el aviso "no se pudo guardar" se repite indefinidamente. | menor | OB2: `attempts 1, progress 1` tras borrar y vaciar el outbox. | Vaciar el outbox y notificar `progress-all` + sesión en `eraseLearningData` e `importBackup(replace)`; error tipado `SessionNotFoundError` tratado como "sesión terminada"; en `flush`, descartar entradas de sesiones inexistentes. | **nuevo** |
| ARCH-041 | `src/storage/outbox.ts` (`flush`/`enqueue`) | Lectura-modificación-escritura no atómica: si un `flush` (evento `online` o `advance`) corre mientras otro `enqueue` añade una entrada, el `write(remaining)` final la borra. | menor | OB3: 0 pendientes en vez de 1. La UI no avanza mientras haya algo pendiente, así que la respuesta se re-envía al reintentar; solo se pierde si la app se cierra en ese momento (entonces se re-pregunta). | Al final de `flush`, releer la lista y quitar solo los ids procesados; serializar los `flush` (promesa compartida). | **nuevo** |
| ARCH-042 | `src/storage/outbox.ts` (rama de sesión de `flush`); `src/storage/sessionRepo.ts` (estado tras `answerStep`) | Al vaciar el outbox no se pasan los `steps` re-encolados (se pierde el paso de consolidación de un fallo). `answerStep` pone `active` una sesión pausada, lo que puede dejar dos sesiones activas si mientras tanto se creó otra; "Continuar" podría reanudar la antigua. | menor | Lectura de código. | Guardar `steps` en la entrada del outbox (o recalcular el re-encolado en `flush`); conservar `paused` si la sesión no es la abierta. | **nuevo** |
| ARCH-043 | `src/app/App.tsx:48`; `src/app/AppState.tsx` (`onNewerVersion`); `src/storage/db.ts` (`RETRYABLE`) | Si otra pestaña sube el esquema durante una sesión, esta pestaña cierra la conexión y cada respuesta falla con `VersionError` (no reintentable): se muestra el genérico "no se pudo guardar", y el aviso de actualización está oculto dentro de la sesión. No hay pérdida (queda en el outbox y no avanza), pero no se explica nada. | menor | Lectura de código. | En la sesión, mostrar "hay una versión nueva: guarda y recarga" cuando `updateReady` venga de `onNewerVersion`. | **nuevo** |
| ARCH-044 | `src/storage/prefs.ts:15`; `src/storage/contentRepo.ts:122` (`evictPacks`) | `downloadLimitMB` (25 MB por defecto, spec 04) no se usa en ningún sitio: no hay expulsión LRU por tamaño, solo cuando se agota la cuota. | menor | `grep`: sin usos. | Llamar a `evictPacks(db, limit, keep = paquetes de la sesión actual)` tras guardar un paquete. | **nuevo** |
| ARCH-045 | `src/features/listen/ListenScreen.tsx:58-66`; `src/features/home/stats.ts:31` | Lógica duplicada: "Escuchar" repite el ensamblado de entradas del selector (suspendidos, prioridades, `dayEnd`) en vez de reutilizar `startSession`/un helper. Las estadísticas cuentan como "errores" cualquier `lastResult === 'fail'`, sin la ventana de 30 días de `isActiveMistake`: la cifra de inicio no coincide con lo que trae "Errores". | menor | Lectura de código. | Extraer `selectorInputFrom(app)`; usar `isActiveMistake` en `stats`. | **nuevo** |
| ARCH-046 | `src/app/router.ts:18` (`parseHash`); `src/app/App.tsx` | No hay *error boundary*: cualquier excepción de render deja la app en blanco. `decodeURIComponent` en `parseHash` lanza `URIError` con un hash mal formado (p. ej. `#/card/%E0`), dentro del inicializador de `useState`, y tumba la app. `useStartSession.start` y `apply` de importación no capturan errores (promesas rechazadas sin aviso). | menor | Lectura de código. | Error boundary con "Reintentar" y enlace a inicio; `try/catch` en `parseHash` → `home`; avisos de error en inicio de sesión e importación. | **nuevo** |
| ARCH-047 | `vite.config.ts`; `src/domain/content/schema.ts` (dependencia `zod`) | Presupuesto de JS cumplido (128 KB gzip frente a 180 KB). Lo que más pesa es React 19 (≈58–60 KB) y Zod clásico (≈25–30 KB). | sugerencia | Medidas del §1. | Si hace falta margen: `zod/mini` para los esquemas de runtime, o cargar en diferido los esquemas de respaldo/importación con Ajustes. | **nuevo** |

### Comprobaciones positivas (sin hallazgo)

- **Flujo de sesión:**
  - Nunca avanza con una respuesta pendiente (`status: 'pending'` → aviso y se queda en el paso).
  - Los dobles toques quedan protegidos por CAS (el segundo da conflicto, no duplicado).
  - Un conflicto recarga la sesión actual.
  - El re-encolado se guarda en la misma transacción.
  - Se reanuda con `latestOpenSession`.
  - La exposición (`learn` → "Entendido") nunca cuenta como recuerdo.
- **Seguridad:**
  - Ningún `innerHTML`/`dangerouslySetInnerHTML`: `RichText` construye nodos de texto.
  - Los enlaces externos llevan `rel="noopener noreferrer"` y las referencias solo admiten `https`.
  - La importación limita el archivo a 50 MB, lo valida con Zod y muestra vista previa; *reemplazar* pide confirmación (pero ver ARCH-034 sobre "deshacer").
  - Las preferencias se validan con `.catch()`.
- **PWA:**
  - `start_url` y `scope` son relativos; hay icono *maskable* y `apple-touch-icon`.
  - El SW no cachea `/content/`, versiona el shell por contenido, borra las cachés antiguas tras `activate` y espera `SKIP_WAITING`.
  - Con el router hash, los enlaces profundos funcionan en subruta.
- **Mantenibilidad:**
  - Ningún componente pasa de unas 270 líneas.
  - La lógica de sesión está fuera de React (`sessionActions.ts`).
  - La i18n está tipada por `MessageKey`, con `en` en diferido.
  - `document.documentElement.lang` se actualiza.

## 5. Recuento

**Anteriores (ARCH-001…033):**

| Estado | Nº | IDs |
|---|---|---|
| cerrado | 28 | — |
| parcial | 3 | 012, 013, 014 (menores) |
| abierto | 2 | 021 (sugerencia aceptada), 032 (menor; trámite de documentación antes de publicar) |

**Nuevos (ARCH-034…047):**

| Severidad | Nº | IDs |
|---|---|---|
| bloqueante | 1 | ARCH-034 |
| importante | 5 | ARCH-035, 036, 037, 038, 039 |
| menor | 7 | ARCH-040 … 046 |
| sugerencia | 1 | ARCH-047 |

## 6. Veredicto de merge

**No integrable todavía: aprobar con correcciones.** El núcleo queda sólido: todos los hallazgos importantes y bloqueantes previos están cerrados con evidencia, y no hay regresiones en las sondas. La UI está bien estructurada y no expone XSS.

Para integrar a `main` y publicar a Sol:

1. **ARCH-034 (bloqueante):** hay que cerrarlo; es un riesgo de pérdida de progreso y la corrección es pequeña.
2. **ARCH-035, ARCH-036 y ARCH-037:** según spec 06 ("resuélvelos si afectan uso/calidad antes de integrar") deben corregirse antes del merge. Rompen respectivamente:
   - "nunca recargar a mitad de pregunta";
   - "no repreguntar inmediatamente", tras pausar;
   - el escenario 8 (estudiar sin conexión).

   Son cambios locales, sin rediseño.
3. **ARCH-038 y ARCH-039:** pueden ir en el lote siguiente si se registran en AUDIT_LOG como pendientes y "Escuchar" se marca como beta. Recomiendo corregir ARCH-038 antes si "Escuchar" aparece en el inicio.
4. **ARCH-032:** dejar constancia en PROJECT_STATUS antes de la primera publicación con BD.
5. **Verificación final:** repetir `vitest`, `tsc` y `npm run build` sobre el commit exacto que se integre (hay cambios sin commitear en el worktree).
