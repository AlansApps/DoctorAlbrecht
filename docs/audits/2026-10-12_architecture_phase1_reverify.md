# Re-verificación de arquitectura — Fase 1 (núcleo sin UI)

- **Auditor:** arquitectura y calidad de código (independiente). Solo lectura: no se ha modificado `src/`, `scripts/` ni configuración.
- **Fecha:** 2026-10-12
- **Commit verificado:** `3731c0e` (rama `feat/phase1-foundations`, worktree `T:\tarjetalan-wip`). Auditoría original: `docs/audits/2026-10-12_architecture_phase1.md` (sobre `c88bae5`).
- **Aviso:** el worktree tiene cambios sin commitear del implementador (`package.json`, `package-lock.json`, `DECISIONS.md`, `src/ui/` sin seguimiento). Los tests y `tsc` se ejecutaron sobre ese árbol, que incluye `src/ui/`. Antes del merge hay que repetirlos sobre el commit limpio que se integre.

## 1. Comandos y resultados

| Comando (desde `/t/tarjetalan-wip`) | Resultado |
|---|---|
| `npx vitest run` | 9 archivos, **59/59 tests pasan**. |
| `npx tsc --noEmit -p tsconfig.json` | **0 errores**. |
| `node scripts/build-content.ts --check` | `content ok: 0 modules, 0 items, 0 packs` y 4 avisos de referencias no citadas. Es lo esperado: todo el piloto está en `sources-verified`, que no se publica en estable (D-014). |
| `npm audit` | 0 vulnerabilidades. |
| `npx vitest run --config docs/audits/scratch/vitest.scratch.config.ts` | Sondas de re-verificación (`docs/audits/scratch/arch_reverify.probe.ts`). Resultados en la tabla y en el §2. |
| `node docs/audits/scratch/arch_reverify_probes.ts` | **Falla al importar**: `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX` (propiedades de parámetro en `sessionRepo.ts`). Ver ARCH-028. Por eso las sondas se ejecutaron con vitest. |

Los archivos de sonda están **solo** en `docs/audits/scratch/`. `.gitignore` ya los excluye.

## 2. Salida de las sondas

```
ok   A studied card -> first recall, not re-learn: ["c0.card:review","c1.card:learn"]
ok   B review 15min, debt in 1 micro(s): {"steps":36,"seconds":900}
ok   B review 15min, debt in 2 micro(s): {"steps":36,"seconds":900}
ok   C withDb retries after closed connection: {"retrievals":1}
ok   D1 equal-ts + mixed formats: incremental == rebuild
BUG  D2 suspended + attempt: incremental == rebuild: differingFields ["updatedAt"]
ok   D3 suspended-before-first-attempt parity: status suspended, no diff
ok   E suspended (no progress) excluded
ok   F single-concept micro: ["k.card:learn"]  (la pregunta se descarta)
BUG  G filter + prerequisite outside filter -> empty session: []
BUG  G2 cyclic prerequisites -> deadlock: []
BUG  H mistakes re-asks a question failed 5 s ago (before due): steps ["q.b"]
BUG  I outbox + answerStep id collision: attempt S:0 -> item A; progress B=1 sin intento en el log; 1 intento en el log
BUG  J answerStep accepts an attempt for a different item and a step on a finished session (pos=2, status=done)
ok   K studyDayEnd DST (Madrid 25-10 y 29-03, Lord_Howe, Kolkata, Havana, São Paulo, UTC)
ok   L fuzz per item: dues distintos (2028-06-04 vs 2028-06-07)
ok   M https-only reference URL
```

## 3. Hallazgos originales: estado tras re-verificación

| ID | Archivo:línea (3731c0e) | Hallazgo original | Severidad | Evidencia de la re-verificación | Corrección pendiente | Estado tras re-verificación |
|---|---|---|---|---|---|---|
| ARCH-001 | `scheduler.ts:226-241`; `selector.ts:153-160` | Una card leída nunca entraba en repaso | bloqueante | Sonda A: 11 min después de leerla, la card sale como `review` (primera recuperación) y no como `learn`. `fresh` solo admite `status === 'new'`. D-008 documenta la regla. | — | **cerrado** |
| ARCH-002 | `selector.ts:171-190` | El tope por micro truncaba las sesiones de repaso | bloqueante | Sonda B: con 40 vencidos en 1 o en 2 micros, la sesión tiene 36 pasos (900 s de 900 s). La segunda pasada no aplica el tope y respeta el presupuesto con `fits`. | — | **cerrado** |
| ARCH-003 | `db.ts:107-167` | Conexión IndexedDB frágil en Safari | bloqueante | `terminated` y `blocking` invalidan el singleton; `blocking` avisa a la UI con `onNewerVersion`. `withDb` reabre y reintenta una vez ante `InvalidStateError`/`TransactionInactiveError`/`AbortError`; sonda C y `db.test.ts` lo confirman. El outbox existe, pero su semántica introduce un defecto nuevo (ARCH-024). | Ver ARCH-024. Detalle residual: una conexión abierta con `openDatabase(name)` sin `onLost` no se cierra en `blocking` (solo afecta a tests y scripts). | **cerrado** (defecto derivado en ARCH-024) |
| ARCH-004 | `time.ts:7-19`; `progressRepo.ts:14-60` | Orden de intentos sin normalizar | importante | Sonda D1: timestamps iguales, `…Z` frente a `….000Z` y `+02:00` → la caché incremental y la reconstrucción coinciden en todos los campos. Hay un comparador único `compareEvents` y `lastEventAt/lastEventId`. | — | **cerrado** |
| ARCH-005 | `selector.ts:105,116-117`; `progressRepo.ts:53` | Suspender un ítem nuevo no tenía efecto; caché ≠ replay | importante | Sonda E: el selector excluye los ítems suspendidos sin fila de progreso. Sonda D3: suspender y luego responder coincide con el replay. Sonda D2: tras suspender y responder, solo difiere `updatedAt` (ARCH-027). | Ver ARCH-027. La UI debe pasar `suspended` al selector. | **cerrado** (residuo menor en ARCH-027) |
| ARCH-006 | `build-content.ts:164-176`; `selector.ts:149-162` | Orden alfabético; prerrequisitos ignorados | importante | El índice lleva `order` global (macro → micro → lección → seq) y `prereqMicros`, y el selector ordena por `order`. Los prerrequisitos introducen un bloqueo nuevo (ARCH-025) y la fórmula de `order` puede colisionar (ARCH-031). | Ver ARCH-025 y ARCH-031. | **cerrado** (defectos derivados) |
| ARCH-007 | `selector.ts:259-284` | Pregunta pegada a su card | importante | Sonda F: en un micro de un solo concepto, la pregunta se descarta en vez de quedar adyacente. `MIN_GAP = 2`. | Mejora menor en ARCH-033. | **cerrado** |
| ARCH-008 | `sessionRepo.ts:149-222` | Faltaba un repositorio de sesión con CAS | importante | `answerStep` registra el intento y avanza en una transacción con CAS por `rev`; el id del intento es `${sesión}:${posición}`; el resumen se deriva del log (`bySession`); se guardan `seed` y `contentVersion`. Pero no valida que el intento corresponda al paso actual ni que la sesión siga abierta (sonda J), y eso permite la colisión de ARCH-024. | Validar `attempt.itemId === steps[position].itemId` y `status !== 'done'` / `position < steps.length`. Abortar explícitamente la transacción ante cualquier error (`try/catch → tx.abort()`). | **parcial** |
| ARCH-009 | `time.ts:21-54`; `scheduler.ts:243-253` | Zona horaria sin usar; vencimientos al milisegundo | importante | Corte local a las 04:00 (D-010); los repasos largos vencen por día local y los pasos cortos al minuto. Sonda K: correcto en Madrid en ambos cambios de hora y en zonas con medias horas, sin DST y con DST australiano. | Residual aceptable: ts-fsrs sigue contando `elapsed_days` por día UTC. La UI debe pasar `dayEnd`. | **cerrado** |
| ARCH-010 | `schema.ts:93-98`; `build-content.ts:97-129`; `contentRepo.ts:30-120` | Validación y almacenamiento de contenido | importante | Exactamente una opción correcta (esquema y build), IDs únicos, integridad referencial (lecciones, referencias, citas ES/EN, pasos de caso), SHA-256 recalculado sobre el cuerpo y comparado con el manifiesto (el test usa el contenido real del builder, así que la serialización coincide: mismo orden de claves, `hash` al final), manifiesto persistido con fallback, LRU solo sobre `packs`, cuota con `estimate/persist`. | Detalles menores en ARCH-030. | **cerrado** |
| ARCH-011 | `selector.ts:97-100,123-135` | "Errores" histórico; fallos recientes postergados | importante | Corregido: un error es activo si el último resultado fue fallo y tiene ≤30 días, y la cola de pasos cortos va antes que la de repasos largos. Pero el ámbito "Errores" ignora el vencimiento: vuelve a preguntar algo fallado hace 5 s (sonda H). Ver ARCH-026. | Ver ARCH-026. | **parcial** |
| ARCH-012 | `selector.ts:93,106,195-216` | Tope no aplicado a material nuevo; fertilidad cableada | menor | El tope se aplica a lo nuevo con una pasada diferida; las prioridades llegan por `priorityMacros`. Pero el ámbito `fertility` sigue usando `FERTILITY_MACRO` cableado (`inScope`, línea 93) y el valor por defecto es `['fert']`. | Derivar el ámbito de fertilidad de los macros prioritarios o del manifiesto. | **parcial** |
| ARCH-013 | `selector.ts:196-201` | Variantes y conceptos sin card | menor | Una pregunta por concepto y sesión; se permiten preguntas de conceptos sin card. Sigue sin salir una pregunta cuyo concepto tiene la card en otro micro fuera del ámbito y nunca leída. | Permitirlo, o validar en el build que card y pregunta comparten micro. | **parcial** |
| ARCH-014 | `selector.ts:225-230` | Los ítems revisados quedaban los últimos | menor | `overdue` usa ahora `dueAt`. No hay política documentada para reiniciar la estabilidad cuando cambia materialmente una pregunta. | Documentarla en DECISIONS. | **parcial** |
| ARCH-015 | `db.ts:103-125`; `progressRepo.ts:118-128` | Patrón de migración, versión de algoritmo | menor | Patrón `if (oldVersion < n)`, `SCHEDULER_VERSION` en `meta` y `ensureSchedulerVersion` reconstruye si falta o cambia (correcto para BDs creadas con `c88bae5`). Hay un defecto relacionado en ARCH-032. | Ver ARCH-032. | **cerrado** |
| ARCH-016 | `vite.config.ts` (plugin `tarjetalan-sw`) | Versión del SW calculada por nombres de archivo | menor | Hash del **contenido** de todo `dist/` salvo `content/`, mapas y `sw.js`; `replace` con función; `version.json`. El SW (`scripts/sw-template.js`) borra cachés antiguas en `activate`, no cachea `/content/` y espera `SKIP_WAITING`. | — | **cerrado** |
| ARCH-017 | `schema.ts:48` | `javascript:` en referencias | menor | Sonda M: rechazado (`protocol: /^https$/`). | — | **cerrado** |
| ARCH-018 | `channel.ts:9-32` | BroadcastChannel mantenía vivo Node; `itemIds: []` implícito | menor | Canal perezoso con `closeChannel()` y mensaje explícito `progress-all`. | — | **cerrado** |
| ARCH-019 | `scripts/build-content.ts`, `scripts/sw-template.js` | Scripts de build inexistentes | menor | Existen; `content:check` pasa. | — | **cerrado** |
| ARCH-020 | `scheduler.ts:124-126` | Fuzz sin semilla por ítem | sugerencia | Sonda L: `GenSeedStrategyWithCardId('item_id')` → fechas distintas y deterministas para el replay. | — | **cerrado** |
| ARCH-021 | `tsconfig.json` | tsconfig único | sugerencia | Pendiente por decisión del implementador. Agravado por ARCH-028. | Separar app/node/sw y activar `erasableSyntaxOnly`. | **abierto** (aceptado) |
| ARCH-022 | `schema.ts:155-171` | Regex global exportada | sugerencia | `extractCitations`/`splitCitations` crean la regex localmente. | — | **cerrado** |
| ARCH-023 | `scheduler.ts:131-134`; `selector.ts:171` | Sin "acerté dudando"; exceso de presupuesto | sugerencia | `ratingForAnswer(correct, unsure)` → `hard`; `fits()` con tolerancia de 20 s en todos los bucles. | — | **cerrado** |

## 4. Hallazgos nuevos introducidos por las correcciones

| ID | Archivo:línea | Hallazgo | Severidad | Evidencia / escenario de fallo | Corrección requerida | Estado tras re-verificación |
|---|---|---|---|---|---|---|
| ARCH-024 | `progressRepo.ts:41-58`; `sessionRepo.ts:189-218`; `outbox.ts:205-230` | **Colisión de ids entre el outbox y `answerStep`: se sobrescribe un intento y se pierde progreso en silencio.** Cuando IndexedDB falla, el intento del paso N (id `S:N`) va al outbox, pero la sesión guardada no avanza. Al volver la conexión, la UI responde el paso N+1 con el `rev` que conserva (sigue siendo válido): `answerStep` lo guarda con id `S:N` para **otro ítem**. Al vaciar el outbox, `applyAttemptInTx` ve que el id existe pero que no hay progreso del ítem original, así que no lo trata como duplicado y **sobrescribe** el intento. | **bloqueante** | Sonda I: el log queda con 1 intento (`S:0` → ítem A); el progreso de B tiene `retrievals = 1` sin intento en el log. El siguiente `rebuildProgress` (importación o cambio de scheduler) borra la respuesta de B. Ocurre justo en el escenario que el outbox debía proteger (Safari mata la conexión a mitad de sesión). | (1) `applyAttemptInTx`: si el id existe y `itemId`/contenido difieren, lanzar error, nunca sobrescribir. (2) `answerStep`: rechazar si `attempt.itemId !== steps[position].itemId` o si la sesión está terminada (sonda J). (3) Que el outbox guarde `{sessionId, position, expectedRev, steps}` y se vacíe con `answerStep` (avance incluido), o que la UI no avance mientras haya pendientes de esa sesión. Test: escenario de la sonda I. | **nuevo** |
| ARCH-025 | `selector.ts:149-151`; `build-content.ts:99` | **Los prerrequisitos pueden bloquear todo el material nuevo.** (a) Con un filtro clínico, un micro cuyo prerrequisito queda fuera del filtro nunca se desbloquea y la sesión sale vacía. (b) El build no detecta ciclos de prerrequisitos (A↔B → ninguno sale). (c) Al publicar más adelante el micro prerrequisito (p. ej. `horm.folliculogenesis-ovulation`, citado por el piloto de fertilidad), las lecciones ya empezadas quedan bloqueadas de golpe. Un micro suspendido entero bloquea igual. | importante | Sonda G: filtro `diet` + prerrequisito en `fert.base` → `[]`. Sonda G2: ciclo → `[]`. | Tratar el prerrequisito como preferencia de orden, no como corte: si no queda material elegible, segunda pasada sin prerrequisitos. Considerar cumplido un prerrequisito fuera del ámbito o del filtro. Detectar ciclos en el build. Tests. | **nuevo** |
| ARCH-026 | `selector.ts:123-127` | **El ámbito "Errores" vuelve a preguntar de inmediato lo que se acaba de fallar** (no mira el vencimiento ni una antigüedad mínima). Además registra una revisión FSRS antes de tiempo. Contradice "no repreguntes inmediatamente" (spec 05). | importante | Sonda H: pregunta fallada hace 5 s (vence 1 min después) → seleccionada. Escenario: al terminar una sesión, Sol pulsa "Errores" y recibe las mismas preguntas cuya respuesta acaba de leer. | En "Errores", exigir que el ítem esté vencido o que hayan pasado al menos X horas desde el fallo; si para una pregunta no hay nada elegible, ofrecer la card del concepto (consolidación) en lugar de la misma pregunta. | **nuevo** |
| ARCH-027 | `scheduler.ts:158-164`; `progressRepo.ts:29,53` | La caché y el replay difieren en `updatedAt` cuando hay suspensión. El replay suspende al final con la fecha del flag; el camino incremental usa la fecha del evento. Además, `stamp` asigna a `updatedAt` la fecha de un evento antiguo aunque no sea el último. | menor | Sonda D2: `updatedAt` incremental 2026-10-14 frente a 2026-10-13 tras reconstruir. No afecta al calendario, pero rompe el invariante "caché == replay" que los tests deberían poder comprobar con `toEqual`. | Dar a `updatedAt` una definición determinista (máximo de evento y flag) igual en ambos caminos. Test de igualdad completa con suspensión. | **nuevo** |
| ARCH-028 | `sessionRepo.ts:16-20`; `contentRepo.ts:13-20` | Las propiedades de parámetro (`readonly current`, `readonly code`) no funcionan con el stripping de tipos de Node 24, que es como corren los scripts (`node scripts/*.ts`): ningún script puede importar `sessionRepo` ni `contentRepo`. | menor | `node docs/audits/scratch/arch_reverify_probes.ts` → `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`. | Declarar los campos explícitamente y activar `erasableSyntaxOnly: true` en tsconfig (ARCH-021). | **nuevo** |
| ARCH-029 | `outbox.ts:184-230` | El outbox recorta en silencio a 200 entradas (descarta las más antiguas) y relee JSON de localStorage sin validarlo. | menor | Lectura de código. | No descartar sin avisar: exponer `pendingCount` y avisar en la UI; validar con el esquema de intento de `backup.ts`. | **nuevo** |
| ARCH-030 | `contentRepo.ts:54,71,98` | (a) Un JSON corrupto lanza `SyntaxError` y no `ContentError('invalid')`. (b) Cada acceso a un paquete guardado lo vuelve a validar con Zod (coste de CPU en cada sesión con paquetes de ~1 MB). (c) Con la cuota llena se expulsan **todos** los demás paquetes (`evictPacks(db, 0)`), no solo los necesarios. | menor | Lectura de código. | Envolver `JSON.parse`; validar al guardar y confiar en el hash al leer (o validar una sola vez por sesión); expulsar por LRU hasta liberar los bytes del nuevo paquete. | **nuevo** |
| ARCH-031 | `build-content.ts:173` | `order = macro*1e6 + micro*1e3 + lessonIdx*50 + seq`: una lección con más de 50 ítems invade la siguiente, más de 20 lecciones en un micro invaden el siguiente micro, y dos módulos del mismo micro reinician `lessonIdx` y se intercalan. | menor | Lectura de código. | Asignar `order` con un contador global incremental recorriendo el currículo en orden. Test con más de 50 ítems. | **nuevo** |
| ARCH-032 | `db.ts:14,115,120` | El esquema v1 cambió en sitio (nuevos índices `bySession` y `byUpdated`) sin subir `DB_VERSION`. Una BD creada con `c88bae5` (dev o test) no tiene esos índices y `summarizeSession` lanzaría `NotFoundError`. | menor | Lectura de código. Aceptable solo si nunca se publicó una versión con BD. | Confirmarlo en PROJECT_STATUS (no hay datos de Sol en v1), o subir a v2 creando los índices si faltan. Desde la primera publicación, cualquier cambio de esquema implica subir la versión. | **nuevo** |
| ARCH-033 | `selector.ts:269-279` | Si nada se puede separar, `spreadConcepts` descarta la **primera** pregunta pendiente, que puede ser una pregunta de repaso vencida en lugar de la nueva que causa el conflicto. El tiempo de los pasos descartados ya se había contado, así que la sesión queda corta. | sugerencia | Lectura de código. | Descartar preferentemente preguntas nuevas del concepto en conflicto y rellenar el presupuesto liberado. | **nuevo** |

## 5. Recuento

**Hallazgos originales (23):**
- cerrado: 17 (001, 002, 003, 004, 005, 006, 007, 009, 010, 015, 016, 017, 018, 019, 020, 022 y 023).
- parcial: 5 (008 y 011, importantes; 012, 013 y 014, menores).
- abierto: 1 (021, sugerencia aceptada).

**Hallazgos nuevos (10):**

| Severidad | Nº | IDs |
|---|---|---|
| bloqueante | 1 | ARCH-024 |
| importante | 2 | ARCH-025, ARCH-026 |
| menor | 6 | ARCH-027 a ARCH-032 |
| sugerencia | 1 | ARCH-033 |

**Siguen bloqueando:** ARCH-024, junto con la parte de ARCH-008 que lo provoca (`answerStep` no valida el paso).

## 6. Veredicto sobre la preparación para merge del núcleo sin UI

**Aprobar con correcciones; todavía no integrable.** Los tres bloqueantes originales están cerrados con evidencia (sondas A, B y C y tests), y la mayoría de los importantes también. Las correcciones son de causa raíz y proporcionadas: comparador único de eventos, CAS de sesión, hash de contenido verificado con la salida real del builder y corte de día local probado en los cambios de hora.

Antes del merge:

1. **Cerrar ARCH-024** (y la validación de ARCH-008): es un cambio pequeño en `applyAttemptInTx` y `answerStep`, más la semántica del outbox, con un test del escenario de la sonda I.
2. Corregir **ARCH-025** y **ARCH-026** antes de cablear "Estudiar con filtros" y "Errores" en la UI; si se posponen, registrarlos como pendientes en AUDIT_LOG.
3. Repetir `vitest` y `tsc` sobre el commit exacto que se integre, sin los cambios sin commitear de `src/ui/`, `package.json` y `DECISIONS.md`.

Los menores (027 a 032) pueden resolverse en el siguiente lote.
