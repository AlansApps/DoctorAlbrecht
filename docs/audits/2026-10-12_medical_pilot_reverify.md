# Re-verificación médica — Módulos piloto

**Fecha:** 2026-10-12
**Auditor:** agente de IA con rol asignado de experto multidisciplinario. **No es validación clínica humana**. Soy independiente del implementador.

**Versión revisada:** `feat/phase1-foundations` @ `e071c55`, que contiene el commit de contenido `0386945`. Revisión de solo lectura de `content/modules/fert-ovarian-reserve.json`, `content/modules/pcos-metabolic-pilot.json` y `content/references.json`, en ES y EN.

**Fuentes usadas para re-verificar (las mismas copias de la auditoría anterior, más dos nuevas):**
- Guía SOP 2023: texto completo XML de Europe PMC, PMC10505534.
- ESHRE OS 2025: PDF v23.
- NICE NG257: PDF de marzo de 2026.
- ASRM 2020: HTML de la página oficial, descargado y buscado literalmente (nuevo en esta ronda).
- Steiner 2017: resumen original sin procesar.

## 1. Correcciones importantes

| Ítem | Veredicto | Evidencia |
|---|---|---|
| `fert-or.c10-measurement-limits` (nuevo; FERT-M1) | **Aprobar → `ai-audited`** | La guía SOP 2023 dice, en el **PP 1.5.6**, que la AMH tiene su pico hacia los 20–25 años en la población general, es más baja con IMC mayor, puede estar suprimida por anticonceptivos combinados actuales o recientes (apartado titulado "Hormonal contraception and ovarian surgery") y varía con el día del ciclo. El **PP 1.5.7** pide cortes específicos de población y de ensayo. La card lo recoge fielmente, con la etiqueta de punto de práctica. Nota sin corrección obligatoria: el texto de la guía solo detalla la supresión por anticonceptivos; la cirugía ovárica aparece únicamente en el título del apartado. |
| `fert-or.c3-not-live-birth` | **Aprobar → `ai-audited`** | ESHRE OS 2025: rec. 3 y **rec. 4** ("Female age and BMI are predictors of pregnancy and live birth"), **Strong** según el PDF v23. NICE NG257 **1.18.4** (AMH o AFC como predictores de respuesta para asesorar sobre la probabilidad de nacido vivo tras reproducción asistida): bien citada, sin falsa equivalencia ("no es una contradicción frontal"). ASRM: "only weakly predictive of pregnancy at best". Texto en ES y EN fiel. |
| `fert-or.case1-lucia` | **Aprobar → `ai-audited`** | Paso 2: pregunta por anticonceptivos, cirugía y ensayo (PP 1.5.6–1.5.7). Paso 4: **NICE 1.16.5** (estudio de ambos miembros tras 1 año de relaciones sin protección, si no hay causa conocida) y **1.16.8** (derivación en la primera consulta si tiene ≥36 años o hay causa o factores predisponentes), ambas confirmadas en el PDF. q3 y q6 están enlazadas y encajan con el caso. q3 trata de una mujer de 36 años en lugar de 34, pero sirve como pregunta conceptual. |
| `fert-or.q3-36yo-low-amh` | **Aprobar → `ai-audited`** | El nuevo distractor D ("peor calidad ovocitaria") es plausible y su explicación es correcta: ASRM califica de "conflicting" los estudios sobre AMH y calidad. B sigue siendo la única respuesta defendible. |
| `fert-or.q6-very-low-amh-ivf` | **Aprobar → `ai-audited`** | El nuevo distractor C ("ovodonación sin asesorar") es plausible y su explicación es correcta: ASRM dice que los marcadores no deben usarse para negar el acceso al tratamiento. Solo B es defendible. |
| `pcos-mp.c2-amh-limits` | **Aprobar → `ai-audited`** | 1.5.2–1.5.4 coinciden. Los PP 1.5.6 y 1.5.7 están añadidos con su número. La misma nota que en c10 sobre la cirugía ovárica. |
| `pcos-mp.c5-inositol` | **Aprobar → `ai-audited`** | La card recoge **4.7.1** completa (daño limitado; posible mejora metabólica; beneficio clínico limitado en ovulación, hirsutismo y peso; ❖❖❖ ⊕◯◯◯), **4.7.2** (metformina preferida para hirsutismo y adiposidad central, con más efectos GI), **5.8.1** (experimental en infertilidad, ❖❖❖ ⊕◯◯◯) y **5.8.3** (seguridad desconocida, situada correctamente en el contexto de infertilidad). Sin dosis. Ya no presenta Fitz como beneficio en fertilidad. |
| `pcos-mp.c6-metformin` | **Aprobar → `ai-audited`** | **4.3.1** con su desenlace (antropométrico y metabólico: resistencia a la insulina, glucosa, lípidos; ❖❖❖ ⊕◯◯◯), **4.3.3** (CR, "may be considered") y **5.4.1.1** ("could be used… informing… more effective ovulation agents", ❖❖❖ ⊕⊕◯◯). Todo coincide. |
| `pcos-mp.c8-letrozole` | **Contenido aprobado.** El estado se queda en **`needs-human-review`**, por decisión editorial. | **5.3.1** ❖❖❖❖ ⊕⊕⊕⊕; **5.3.2** (PP fuera de ficha técnica); **5.3.3** (PP: no darlo si hay cualquier posibilidad de embarazo, sin evidencia de mayor teratogenicidad); preferencia frente al clomifeno (recomendación de la sección 5 confirmada en el texto). El contraste con la metformina ya es correcto (5.4.1.1, certeza baja). No queda ningún hallazgo médico abierto. La revisión humana es solo por tratarse de una card de prescripción. |

## 2. Correcciones menores (verificar que se aplicaron tal como se pidió)

| Ítem | ¿Aplicada? | Comentario |
|---|---|---|
| `fert-or.l1` (cierre) | sí | "no son buenos predictores independientes de embarazo". |
| `fert-or.l2` (cierre) | sí | "concepciones (prueba positiva)". |
| `fert-or.c1` | sí | "débil o contradictoria"; "una confusión frecuente". |
| `fert-or.c2` | sí | La perla cita ESHRE ("AFC o AMH, según el contexto"). |
| `fert-or.c4` | sí | n = 84, IC 50–75 % y matiz en la aplicación. Cifras correctas frente al original. |
| `fert-or.c5` | sí; **retiro mi corrección** | La página de ASRM contiene **las dos frases**. En el texto: "no more useful than age alone in predicting unassisted pregnancy in women with infertility". En el resumen: "Results of ovarian reserve tests are not useful in predicting the likelihood of unassisted pregnancy in women with infertility…". La redacción del implementador ("no son útiles") reproduce literalmente la frase del resumen, así que es correcta. Además añade NICE 1.18.3 (verificada). |
| `pcos-mp.l3` (cierre) | sí | Distingue el contexto metabólico (certeza muy baja) del de fertilidad (metformina con certeza baja, inositol experimental). |
| `pcos-mp.c1` | sí | "tras excluir otras causas" y PP 1.5.5. |
| `pcos-mp.c3` | sí | 1.9.1 completa (alteración en ayunas, intolerancia a la glucosa, DM2); 1.9.3 (CR); 1.9.11 (❖❖❖ ⊕◯◯◯). |
| `pcos-mp.c7` | sí | La frase sin fuente está marcada como "interpretación, no recomendación de la guía". |
| `pcos-mp.q7` | sí | Distractor b: 5.8.1; distractor d: 5.4.1.1. Una sola respuesta defendible. |
| `pcos-mp.q8` | sí, con una observación | La opción a añade "(resultados metabólicos)" y es correcta. **Observación editorial (menor, no médica):** el texto cambió pero el `rev` sigue en 1. Conviene subirlo a 2 por coherencia del versionado y del historial de repaso. |

## 3. Referencias

| Ref. | Veredicto | Evidencia |
|---|---|---|
| `nice-2026-ng257` (nueva) | Aprobar | 1.18.3, 1.18.4, 1.18.5, 1.16.8 y el plazo de 1 año (1.16.5) coinciden con el PDF publicado el 31-03-2026. Sustituye a CG156. Nota: la URL web devuelve 403 a herramientas automáticas; el PDF sí se descarga. |
| `eshre-2025-ovarian-stimulation` | Aprobar | Guía completa v23 con DOI 10.1093/humrep/deag018 y Hum Reprod 2026;41(4):498-514 (confirmado en Europe PMC). Recomendaciones 1, 3 y 4 Strong, correcto. La frase "should not be routinely used" proviene de la versión de bolsillo; en la guía completa figura como "not recommended". Aceptable. |
| `steiner-2017-jama` | Aprobar | La URL es ahora doi.org. Contenido correcto. |
| `fitz-2024-inositol-pcos` | Aprobar | J Clin Endocrinol Metab 2024;109(6):1630-1655, correcto. |
| `asrm-2020-ovarian-reserve`, `eshre-2023-unexplained-infertility`, `teede-2023-pcos-guideline` | Sin cambios; ya estaban aprobadas. | — |

**Traducción ES↔EN:** revisé los 9 ítems con corrección importante. Las traducciones son fieles: "could/should/may be considered", fuerza y certeza se conservan.

## 4. Resultado

- **Aprobados → `ai-audited`:** `fert-or.c10-measurement-limits`, `fert-or.c3-not-live-birth`, `fert-or.case1-lucia`, `fert-or.q3-36yo-low-amh`, `fert-or.q6-very-low-amh-ivf`, `pcos-mp.c2-amh-limits`, `pcos-mp.c5-inositol`, `pcos-mp.c6-metformin`.
- **`pcos-mp.c8-letrozole`:** contenido aprobado; se queda en `needs-human-review` hasta la revisión de una especialista humana.
- **Las correcciones menores** están aplicadas correctamente. Los ítems que ya figuran como `ai-audited` (fert l1, l2, c1, c2, c4, c5; pcos l3, c1, c3, c7, q7, q8) quedan **confirmados**.
- **Pendiente (menor, editorial):** subir `rev` de `pcos-mp.q8-ranking` a 2.
- **Hallazgos médicos abiertos:** ninguno. FERT-M1 (antiguo MED-013) queda **resuelto**. Con esto, el módulo de reserva ovárica puede publicarse como unidad desde el punto de vista médico, sujeto a la revisión humana que pide la especificación.
