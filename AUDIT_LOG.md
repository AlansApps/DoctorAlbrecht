# AUDIT_LOG

Auditores = agentes de IA con rol asignado (médico multidisciplinario, arquitectura/código, branding/UX/accesibilidad), independientes del implementador. **No son revisión médica humana ni credencial real.**

Formato por hallazgo: versión/commit · ámbito · hallazgo · severidad (`bloqueante`/`importante`/`menor`/`sugerencia`) · evidencia · corrección requerida · resultado tras corregir. Los informes completos están en `docs/audits/`.

---

## Fase 1 · 2026-10-12 · commit `c88bae5` (rama `feat/phase1-foundations`)

### Médico — `docs/audits/2026-10-12_medical_phase1.md`
Veredicto: mapas **aprobar con correcciones**; contenido de muestra **aprobar con correcciones**. 0 bloqueantes · 13 importantes · 15 menores · 4 sugerencias. 48 fuentes cotejadas: 41 correctas, 7 con caracterización a corregir, 0 inexistentes.

| Hallazgo | Severidad | Estado |
|---|---|---|
| MED-001/002/003 card AMH: 981 vs 750 analizadas; "anticipa respuesta" citado solo a Steiner; desenlace = test positivo, no nacido vivo | importante | **Corregido** en el módulo piloto (`fert-or.c2/c4`, `q4`) y en la vista previa de estilos |
| MED-010/011 ids rotos entre mapas (15 + 15; `supp.antioxidants`, `preg.early-pregnancy` sin equivalente) | importante | Pendiente (Fase 2: normalizar `curriculum.json` y mapas) |
| MED-012/026/028 faltan microtemas de alarmas/derivación (fertilidad, pérdida temprana/ectópico, sangrado posmenopáusico, liquen escleroso) | importante | Pendiente (añadir a `curriculum.json` y mapas) |
| MED-025 SOP → nuevo nombre PMOS (Lancet 2026) como alias con fuente | importante | Pendiente (verificar fuente y añadir alias) |
| MED-013 piloto: añadir card de límites de medición de AMH y ESHRE 2025 rec. 4 (edad/IMC sí predicen embarazo) | importante | Pendiente |
| MED-014/015 antioxidantes: nota editorial Cochrane 2020 (retracciones) y análisis de sensibilidad Cochrane 2022 | importante | Pendiente (mapa) |
| Resto (menores/sugerencias) | — | Ver informe |

### Arquitectura — `docs/audits/2026-10-12_architecture_phase1.md`
Veredicto: **aprobar con correcciones**; no integrable hasta cerrar 3 bloqueantes. 3 bloqueantes · 8 importantes · 8 menores · 4 sugerencias.

| Hallazgo | Severidad | Estado |
|---|---|---|
| ARCH-001 card leída nunca entra en repaso | bloqueante | **Corregido** (D-008) + tests |
| ARCH-002 tope por micro trunca sesiones de repaso | bloqueante | **Corregido** (diversidad como preferencia, 2 pasadas) + test |
| ARCH-003 conexión IndexedDB frágil en Safari | bloqueante | **Corregido** (`terminated`/`blocking`, `withDb` con reintento, aviso de versión, outbox) + test |
| ARCH-004 orden de intentos sin normalizar | importante | **Corregido** (`normalizeIso`, `compareEvents` único, `lastEventAt`) + tests |
| ARCH-005 suspensión sin efecto / caché≠replay | importante | **Corregido** + tests |
| ARCH-006 orden alfabético, prerrequisitos ignorados | importante | **Corregido** (`order` global y `prereqMicros` en índice) + test |
| ARCH-007 pregunta pegada a su card | importante | **Corregido** (`MIN_GAP`, se descarta si no cabe) + test |
| ARCH-008 sin repositorio de sesión con CAS | importante | **Corregido** (`sessionRepo`, D-011) + tests |
| ARCH-009 zona horaria sin usar | importante | **Corregido** (D-010) + tests de cambio de hora |
| ARCH-010 validación/almacenamiento de contenido | importante | **Corregido** (una correcta en esquema, SHA-256, manifiesto persistido, LRU, cuota) + tests |
| ARCH-011 "Errores" histórico; fallos recientes postergados | importante | **Corregido** (errores activos 30 d; cola corta antes que larga) + tests |
| ARCH-012/013/014/015/016/017/018/020/022/023 | menor/sugerencia | **Corregidos** |
| ARCH-019 build sin script de contenido/SW | menor | **Corregido** (scripts existen); build completo se verifica con la UI |
| ARCH-021 tsconfig único | sugerencia | Pendiente (separar al añadir el SW tipado) |

Re-verificación pendiente: se pedirá al auditor de arquitectura que revise las correcciones antes del merge.

### Branding/UX — `docs/audits/2026-10-12_ux_phase1.md`
Ranking del auditor: A · Consulta > D · Calma > B · Raíz > C · Pulso. 2 bloqueantes · 14 importantes · 14 menores · 3 sugerencias. Todos los pares de color de texto pasan AA.

| Hallazgo | Severidad | Estado |
|---|---|---|
| UX-001 respuesta correcta/incorrecta solo por color | bloqueante | **Corregido** en la vista previa (✓/✗ + etiqueta); obligatorio en la app |
| UX-002 cards de C recortadas (CSS) | bloqueante | **Corregido** y republicado |
| UX-003/004/005 texto de lectura pequeño, 13 tamaños, px fijos | importante | Para la app: escala tipográfica en `rem`, cuerpo ≥16 px |
| UX-006 bordes no textuales < 3:1 | importante | Para la app: token de borde ≥3:1 |
| UX-007/008 "Siguiente" fuera de pantalla; explicaciones en gris pequeño | importante | Para la app: barra de acción fija; explicaciones ≥15 px en color de texto |
| Voseo vs "tú" en los textos | importante | **Decisión de Alan pendiente** |
| "¿Lo recordabas?" justo tras primera lectura | importante | **Corregido** en el diseño (D-008: la primera lectura no se califica) |
