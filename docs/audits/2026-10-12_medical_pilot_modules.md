# Auditoría médica — Módulos piloto (reserva ovárica y SOP metabólico)

**Fecha:** 2026-10-12
**Auditor:** agente de IA con rol asignado de experto multidisciplinario (ginecología, endocrinología reproductiva, medicina funcional e integrativa, nutrición, farmacología de suplementos, metodología de la evidencia).

> **Descargo de rol.** Este informe lo redacta una IA, sin licencia ni título médico. **No es validación clínica humana.** Soy independiente del implementador y no audito trabajo propio. Las tarjetas aprobadas pasan a `ai-audited`, no a "validado por especialista".

## 1. Versión, alcance y método

- **Rama / commit:** `feat/phase1-foundations` @ `3731c0e` (worktree `T:\tarjetalan-wip`, sin cambios locales en `content/` al auditar).
- **Archivos:** `content/modules/fert-ovarian-reserve.json` (3 lecciones, 9 cards, 8 preguntas, 1 caso), `content/modules/pcos-metabolic-pilot.json` (3 lecciones, 8 cards, 8 preguntas), `content/references.json` (6 referencias). Revisé los textos ES y EN de cada ítem. El registro (voseo o tú) queda fuera, por decisión de la propietaria.
- **Cómo verifiqué:**
  - **Guía internacional de SOP 2023** (Teede et al., JCEM 2023;108(10):2447-2469): texto completo XML de Europe PMC (PMC10505534). Cotejé cada número de recomendación, su tipo (EBR, CR o PP), el símbolo de fuerza (❖) y el de certeza (⊕) con la leyenda de la propia guía: ❖❖❖❖ = recomendación fuerte; ❖❖❖ = condicional a favor; ❖❖ = condicional por cualquiera de las opciones.
  - **ESHRE OS 2025:** PDF completo v23 y PDF de bolsillo.
  - **ESHRE UI 2023:** PDF (fuerza) y página de OUP (certeza, extraída con un resumidor automático).
  - **ASRM 2020:** página de ASRM (frases literales).
  - **Steiner 2017:** resumen original en Europe PMC, cifras sin procesar.
  - **NICE NG257:** PDF.
  - **Fitz 2024:** Europe PMC.
- **No comprobado:** texto completo de Fitz 2024 (solo resumen), texto completo de ASRM 2020 (solo la página web), tabla completa del PDF de la guía ESHRE UI (la certeza ⊕⊕◯◯ de la rec. 5 la obtuve de la página de OUP mediante un resumidor automático), URL `stacks.cdc.gov` (devuelve "Access Denied" a accesos automáticos).
- **Fe de erratas de mi informe anterior** (`2026-10-12_medical_phase1.md`, MED-004): había atribuido a la AMH las cifras del grupo con FSH alta (63 % y 82 %). Ya está corregido allí. Las cifras del módulo (65 % frente a 62 % y 84 % frente a 75 %; n = 84 frente a 579) son **correctas**.

**Estado de los hallazgos de la fase anterior:**
- **MED-001, MED-002 y MED-003: resueltos** en `fert-ovarian-reserve.json`. La card c4 da 981 inscritas y 750 analizadas, define el desenlace como "prueba de embarazo positiva, no nacido vivo" (también en q4) y la afirmación sobre la respuesta a la estimulación cita ESHRE 2025 y ASRM 2020.
- **MED-013: no resuelto. Es necesario antes de publicar el módulo** (ver FERT-M1).

## 2. Resumen de veredictos

| Módulo | Veredicto | Bloq. | Import. | Menor | Sugerencia |
|---|---|---|---|---|---|
| `fert-ovarian-reserve` | **Aprobar tras corrección.** Tres correcciones importantes antes de publicar el módulo: FERT-M1, FERT-c3 y FERT-case1. | 0 | 3 | 5 | 2 |
| `pcos-metabolic-pilot` | **Aprobar tras corrección.** Cuatro cards con corrección importante: c2, c5, c6 y c8. | 0 | 4 | 5 | 0 |
| `references.json` | **Aprobar.** Tres correcciones menores de metadatos. | 0 | 0 | 3 | 0 |
| **Total** | | **0** | **7** | **13** | **2** |

No encontré referencias, cifras, dosis ni grados inventados. Todas las fuerzas y certezas citadas en las cards de SOP coinciden con el texto de la guía (§4).

## 3. Tabla por ítem — `fert-ovarian-reserve.json`

| Ítem | Veredicto | Severidad | Evidencia (fuente, parafraseada) | Corrección requerida |
|---|---|---|---|---|
| FERT-M1 (módulo; antiguo MED-013) | Corrección **antes de publicar el módulo** | importante | El microtema es "AMH/AFC y límites" y el caso y q3 giran en torno a una "AMH baja según el rango del laboratorio", pero ninguna card enseña los límites de la medición. Hay fuente verificada: los puntos de práctica de la guía SOP 2023 (sección 1.5) dicen que la AMH tiene su pico hacia los 20–25 años, es más baja con IMC alto, puede estar suprimida por anticoncepción hormonal combinada actual o reciente y por cirugía ovárica, varía a lo largo del ciclo, y los laboratorios deben usar cortes específicos de población y de ensayo. | Añadir la card "Límites de la medición de la AMH" con esa fuente. Las cards individuales aprobadas pueden pasar a `ai-audited`, pero el **módulo** no debe publicarse como unidad completa sin esta card. |
| l1-what-it-measures | Aprobar tras corrección | menor | El cierre "no pronostican embarazo" es correcto según ESHRE 2025 rec. 3, pero NICE NG257 1.18.4 sí usa AMH o AFC para asesorar sobre la probabilidad de nacido vivo en reproducción asistida. | Matizar el cierre: "no son buenos predictores independientes de embarazo". |
| l2-natural-fertility | Aprobar tras corrección | menor | Steiner: el desenlace fue la concepción (test positivo). | En el cierre, cambiar "embarazos" por "concepciones (test positivo)". |
| l3-responsible-use | Aprobar | — | ASRM 2020 (no negar tratamiento, no promover la criopreservación, abandonar el test de clomifeno). | — |
| c1-quantity-not-quality | Aprobar tras corrección | menor | ASRM 2020: la cantidad de reserva no es la calidad ovocitaria, y los estudios sobre la AMH como pronóstico de calidad o de nacido vivo son **contradictorios**. La aplicación afirma que es "la confusión más frecuente en consulta", un dato empírico sin fuente. | Cambiar "asociación débil" por "evidencia contradictoria o débil" y "la más frecuente" por "una confusión frecuente". |
| c2-predicts-response | Aprobar tras corrección | menor | ESHRE OS 2025 recs. 1–2 (Strong): coinciden. La perla "una sola medida basta" no lleva cita; la justificación de ESHRE dice que el clínico elige el test más adecuado, sin comparar AMH con AFC. | Citar ESHRE en la perla o suavizarla ("AFC o AMH, a elección según el contexto"). |
| c3-not-live-birth | Aprobar tras corrección | **importante** | ESHRE OS 2025 rec. 3: no recomienda los marcadores para predecir embarazo o nacido vivo (coincide). Pero falta la discrepancia: **NICE NG257 1.18.4** recomienda AMH o AFC para asesorar sobre la probabilidad de nacido vivo tras reproducción asistida. También falta **ESHRE rec. 4**: la edad y el IMC **sí** predicen embarazo y nacido vivo. Sin ambos datos, la card sugiere que nada predice el resultado y que una reserva muy baja no cambia el pronóstico. | Añadir una línea sobre la discrepancia ESHRE/NICE, sin falsa equivalencia, y la rec. 4. Aclarar que menos ovocitos significa menos oportunidades acumuladas, sin que eso equivalga a "no va a funcionar". |
| c4-steiner-cohort | Aprobar tras corrección | menor | Steiner 2017: cifras, n, población y desenlace correctos. Falta la incertidumbre: IC95 del grupo con AMH baja de 50–75 % a 6 ciclos, con solo 84 mujeres. | Añadir el IC o "subgrupo pequeño, IC amplios". En la aplicación, añadir que tranquilizar no cambia el peso de la edad ni del tiempo de búsqueda. |
| c5-guideline-natural | Aprobar tras corrección | menor | ESHRE UI rec. 5: Strong, ⊕⊕◯◯ (coincide). ASRM dice que los marcadores "no son más útiles que la edad sola" para predecir el embarazo sin asistencia en mujeres infértiles; la card dice "no sirven", que es más absoluto. | Ajustar la redacción a "no aportan más que la edad". |
| c6-can-i-wait | Aprobar | — | ASRM: no usar como test de fertilidad; Steiner. | — |
| c7-do-not-deny | Aprobar | — | ASRM 2020, frases literales verificadas. | — |
| c8-egg-freezing | Aprobar | — | ASRM 2020. | — |
| c9-obsolete-tests | Aprobar | — | ASRM 2020 (test de clomifeno a abandonar; FSH específica pero poco sensible); ESHRE 2025. | — |
| q1-what-amh-predicts | Aprobar | — | Una sola respuesta defendible (a); las explicaciones de los distractores son correctas. | — |
| q2-eshre-marker | Aprobar | — | ESHRE 2025 recs. 1–2. | — |
| q3-36yo-low-amh | Aprobar | sugerencia | B es la única defendible. Los distractores C y D son poco plausibles para una especialista. | Opcional: cambiar C o D por "la AMH baja indica peor calidad ovocitaria". |
| q4-steiner-outcome | Aprobar | — | Steiner: concepción = prueba de embarazo positiva. | — |
| q5-strength-certainty | Aprobar | — | ESHRE UI rec. 5: Strong, ⊕⊕◯◯ (baja). | — |
| q6-very-low-amh-ivf | Aprobar | sugerencia | ASRM. El distractor C ("repetir cada mes hasta que suba") es poco plausible. | Opcional: cambiarlo por "derivar directamente a ovodonación sin asesorar". |
| q7-egg-freezing | Aprobar | — | ASRM. | — |
| q8-ccct | Aprobar | — | ASRM; ESHRE. | — |
| case1-lucia | Aprobar tras corrección | **importante** | (a) El paso 3 enlaza con q7, que trata de una mujer de 33 años sin deseo gestacional; Lucía lleva 5 meses buscando embarazo, así que no encaja. (b) El caso se apoya en una "AMH baja según el rango del laboratorio" sin preguntar por anticoncepción hormonal reciente ni por el ensayo usado (ver FERT-M1). (c) "El plazo que corresponda a su edad" no tiene fuente. | (a) Enlazar una pregunta coherente con el caso o reformular. (b) Añadir un paso: "¿tomaba anticonceptivos? ¿qué ensayo y qué punto de corte?", con la fuente de FERT-M1. (c) Citar la fuente del plazo de evaluación (ASRM 2021 o NICE NG257) y añadir esa referencia. |

## 4. Tabla por ítem — `pcos-metabolic-pilot.json`

**Cotejo de fuerza y certeza con el texto de la guía:**

| Rec. | Clasificación en la guía | ¿Coincide la card? |
|---|---|---|
| 1.5.1 | EBR ❖❖❖ ⊕⊕⊕◯ (condicional, moderada) | sí |
| 1.5.2 | EBR ❖❖❖❖ ⊕⊕⊕◯ | sí |
| 1.5.3 | EBR ❖❖❖❖ ⊕⊕⊕◯ | sí |
| 1.5.4 | EBR ❖❖❖❖ ⊕⊕⊕◯ | sí |
| 1.9.2 | EBR ❖❖❖❖ ⊕⊕◯◯ | sí |
| 1.9.9 | EBR ❖❖❖❖ ⊕◯◯◯ | sí |
| 1.9.10 | EBR ❖❖❖ ⊕◯◯◯ | sí |
| 1.9.12 y 3.1.10 | PP | sí |
| 4.7.1 | EBR ❖❖❖ ⊕◯◯◯ | sí |
| 4.3.1 | EBR ❖❖❖ ⊕◯◯◯ | sí |
| 4.3.3 | CR ❖❖❖ | sí |
| 3.3.1 | EBR ❖❖❖ ⊕◯◯◯ | sí |
| 3.3.2 | CR ❖❖❖❖ | sí |
| 5.3.1 | EBR ❖❖❖❖ ⊕⊕⊕⊕ | sí |
| 5.3.2 | PP (fuera de ficha técnica) | sí |

| Ítem | Veredicto | Severidad | Evidencia (fuente, parafraseada) | Corrección requerida |
|---|---|---|---|---|
| l1-amh-diagnosis | Aprobar | — | 1.5.1–1.5.4. | — |
| l2-glycaemia | Aprobar | — | 1.9.2, 1.9.9, 1.9.12. | — |
| l3-options | Aprobar tras corrección | menor | El cierre dice que "metformina e inositol son condicionales con certeza muy baja". Es cierto para 4.3.1 (resultados metabólicos) y 4.7.1, pero en infertilidad anovulatoria la metformina sola es 5.4.1.1, condicional con certeza **baja** (⊕⊕◯◯), y el inositol es "experimental" (5.8.1). "Letrozol… para ovulación" se queda corto: 5.3.1 trata de inducción de la ovulación, y otra recomendación de la guía lo prefiere al clomifeno por ovulación, embarazo clínico y nacido vivo. | Especificar el contexto de cada calificación (metabólico frente a fertilidad). |
| c1-amh-pcom | Aprobar tras corrección | menor | 1.5.1 coincide. El cuerpo omite que el diagnóstico exige además excluir otras causas, y el PP 1.5.5: AMH o ecografía, no ambas, para limitar el sobrediagnóstico. | Añadir "tras excluir otras etiologías" y el PP 1.5.5. |
| c2-amh-limits | Aprobar tras corrección | **importante** | 1.5.2–1.5.4 coinciden; lo dicho sobre la ecografía en adolescentes también coincide con la guía. Pero una card titulada "cuándo la AMH no aporta" omite los PP de la sección 1.5: AMH **suprimida por anticoncepción hormonal combinada actual o reciente**, influida por edad, IMC y día del ciclo, y con cortes específicos de ensayo, además del PP 1.5.5. Es el error práctico más probable (pedir AMH a usuarias de anticonceptivos). | Añadir esos PP con su número de recomendación. Puede compartir contenido con FERT-M1. |
| c3-glycaemic-status | Aprobar tras corrección | menor | 1.9.1 habla de mayor riesgo de glucemia alterada en ayunas, **intolerancia a la glucosa y DM2**; la card solo menciona la primera. Faltan 1.9.3 (reevaluar cada 1–3 años según riesgo; CR fuerte) y 1.9.11 (SOG al planificar embarazo o tratamiento de fertilidad; ❖❖❖ ⊕◯◯◯), muy relevantes para el recorrido de fertilidad. | Completar 1.9.1 y añadir 1.9.3 y 1.9.11, o enlazarlas desde una card de preconcepción. |
| c4-insulin-assays | Aprobar | — | PP 3.1.10 y 1.9.12, redacción fiel. | — |
| c5-inositol | Aprobar tras corrección | **importante** | Hay cuatro problemas. (1) 4.7.1 completa dice "noting limited harm, potential for improvement in metabolic measures, yet with **limited clinical benefits including in ovulation, hirsutism, or weight**"; la card solo cita la parte de preferencias y valores, y el resumen de Fitz ("posible beneficio del D-quiro-inositol en ovulación") puede leerse como beneficio en fertilidad. (2) Falta **5.8.1**: en mujeres con SOP e infertilidad, el inositol debe considerarse **terapia experimental** (❖❖❖ ⊕◯◯◯). (3) Seguridad: 4.7.1 habla de "daño limitado" y 5.8.3 (PP) dice que efectos adversos y seguridad no se conocen; la card mezcla ambas cosas sin contexto. (4) Falta 4.7.2: preferir metformina al inositol para hirsutismo y adiposidad central (❖❖❖ ⊕◯◯◯). | Añadir la redacción completa de 4.7.1 y la rec. 5.8.1. Reconciliar la seguridad citando 4.7.1 y 5.8.3 por separado. Añadir 4.7.2. |
| c6-metformin | Aprobar tras corrección | **importante** | 4.3.1 y 4.3.3 coinciden en fuerza y certeza, pero la card omite **para qué**: 4.3.1 es "for anthropometric and metabolic outcomes including insulin resistance, glucose, and lipid profiles". Sin ese contexto puede leerse como indicación general o reproductiva. En fertilidad rige 5.4.1.1: metformina sola "could be used", condicional, ⊕⊕◯◯, informando de que hay agentes más eficaces. | Añadir el desenlace de 4.3.1 y una línea sobre 5.4.1.1. Opcional: los PP de efectos GI y escalado de dosis (verificados: incrementos de 500 mg cada 1–2 semanas). |
| c7-diet | Aprobar tras corrección | menor | 3.3.1 y 3.3.2 coinciden. "Una dieta muy restrictiva… puede comprometer la adherencia" no tiene fuente. | Citar fuente o marcarlo como interpretación ("en la práctica, …"). |
| c8-letrozole | Aprobar tras corrección | **importante** | 5.3.1 y 5.3.2 coinciden. Pero falta **5.3.3** (PP): no dar letrozol si existe cualquier posibilidad de embarazo previo, aunque no hay evidencia de mayor teratogenicidad que con otros inductores. Además, "metformina: condicional, certeza muy baja" no es correcto en el contexto de fertilidad (5.4.1.1 tiene certeza baja). | Añadir 5.3.3 y corregir el contraste con la metformina. Recomiendo revisión humana posterior: es una card de prescripción. |
| q1-amh-single | Aprobar | — | 1.5.2; la explicación incluye la exclusión de otras causas. | — |
| q2-amh-adolescent | Aprobar | — | 1.5.1 y 1.5.4. Solo B es defendible. | — |
| q3-ogtt | Aprobar | — | 1.9.2 y 1.9.9–1.9.10. | — |
| q4-insulin-test | Aprobar | — | PP 3.1.10. | — |
| q5-inositol | Aprobar | — | 4.7.1, 4.7.3, 4.7.4 y 5.8.3; las explicaciones son correctas. | — |
| q6-diet | Aprobar | — | 3.3.1 y 3.3.2. | — |
| q7-letrozole | Aprobar tras corrección | menor | Una sola respuesta defendible (letrozol, 5.3.1). La explicación del distractor b debería citar 5.8.1 (inositol experimental en infertilidad), no 4.7.1. La del distractor d puede mencionar 5.4.1.1 (metformina usable, pero hay agentes más eficaces). | Ajustar las dos explicaciones. |
| q8-ranking | Aprobar | — | 4.3.1, 4.3.3, 4.7.1 y 5.3.1; solo A es correcta. | — |

## 5. Tabla por ítem — `references.json`

| Ref. | Veredicto | Severidad | Verificación | Corrección |
|---|---|---|---|---|
| asrm-2020-ovarian-reserve | Aprobar | — | Fertil Steril 2020;114(6):1151-1157, doi:10.1016/j.fertnstert.2020.09.134 (PMID 33280722). Hallazgos y limitaciones coinciden con las frases literales de la página de ASRM. | — |
| steiner-2017-jama | Aprobar tras corrección | menor | JAMA 2017;318(14):1367-1376 (PMID 29049585). Autores, población, cifras (65 frente a 62 %, 84 frente a 75 %, n = 84 y 579), desenlace y limitaciones correctos. La URL `stacks.cdc.gov/view/cdc/50629` no pudo verificarse (acceso denegado a herramientas automáticas). | Usar `https://doi.org/10.1001/jama.2017.14588` como URL principal o verificar la de CDC a mano. |
| eshre-2023-unexplained-infertility | Aprobar | — | Hum Reprod 2023;38(10):1881-1890, doi:10.1093/humrep/dead150. Rec. 5: Strong, ⊕⊕◯◯; IUI con estimulación: Strong, ⊕◯◯◯. Búsqueda hasta el 24-10-2022. | — |
| eshre-2025-ovarian-stimulation | Aprobar tras corrección | menor | El PDF de bolsillo existe y su contenido coincide (recs. 1–3, bajo "should not be routinely performed"). Ya existe la publicación en revista: Hum Reprod 2026;41(4):498-514, doi:10.1093/humrep/deag018. | Añadir el DOI y la guía completa como fuente de la fuerza de cada recomendación. |
| teede-2023-pcos-guideline | Aprobar | — | JCEM 2023;108(10):2447-2469, doi:10.1210/clinem/dgad463 (PMID 37580314). 77 EBR, 54 CR y 123 PP; limitaciones correctas. | — |
| fitz-2024-inositol-pcos | Aprobar tras corrección | menor | Existe: J Clin Endocrinol Metab 2024;109(6):1630-1655 (PMID 38163998). 30 ensayos, n = 2230, 19 en metaanálisis; el hallazgo coincide con el resumen. Faltan revista, volumen y páginas. | Completar la cita. Opcional: añadir del resumen que el mio-inositol probablemente causa menos efectos GI que la metformina. |

## 6. Otras comprobaciones

- **Ambigüedad de las preguntas:** las 16 preguntas tienen exactamente una respuesta defendible y todas las explicaciones de los distractores son correctas. Dos distractores son débiles (sugerencias en fert q3 y q6).
- **Etiquetas de evidencia:** son coherentes. Una nota: fert c1, c6, c7 y c8 llevan la etiqueta `guideline` pero su fuente es una opinión de comité de ASRM. La nota lo aclara, así que es aceptable.
- **Tipos de desenlace:** bien distinguidos en el módulo de fertilidad (BIO, concepción con test positivo, nacido vivo). En SOP falta el desenlace de la metformina (PCOS-c6).
- **Traducción ES↔EN:** la revisé ítem por ítem. Es fiel: "could/should be considered", "podría/debería considerarse" y fuerza y certeza se conservan. No hay discrepancias de contenido.
- **Campos de aplicación y perla:** encontré afirmaciones sin cita en fert c1 (aplicación), fert c2 (perla) y pcos c7 (cuerpo), ya señaladas. Las demás son inferencias directas de la recomendación citada.
- **Realismo del caso:** Lucía es verosímil (AMH en un chequeo laboral, angustia, pregunta por congelar). Las incoherencias están descritas en case1.

## 7. Puntos para especialista humana

1. **Letrozol (pcos c8):** cómo se maneja la prescripción fuera de ficha técnica en España y Argentina, y cómo se descarta embarazo antes de cada ciclo.
2. **Inositol en el contexto de una práctica integrativa:** cómo presentar 4.7.1 (condicional) junto a 5.8.1 (experimental en infertilidad) sin aval implícito.
3. **Discrepancia ESHRE/NICE sobre la AMH y el nacido vivo en reproducción asistida (fert c3):** qué postura adopta el programa.

## 8. Ítems aprobados tal cual (→ `ai-audited`)

- **fert-ovarian-reserve:** `l3-responsible-use`, `c6-can-i-wait`, `c7-do-not-deny`, `c8-egg-freezing`, `c9-obsolete-tests`, `q1-what-amh-predicts`, `q2-eshre-marker`, `q3-36yo-low-amh`, `q4-steiner-outcome`, `q5-strength-certainty`, `q6-very-low-amh-ivf`, `q7-egg-freezing`, `q8-ccct`.
- **pcos-metabolic-pilot:** `l1-amh-diagnosis`, `l2-glycaemia`, `c4-insulin-assays`, `q1-amh-single`, `q2-amh-adolescent`, `q3-ogtt`, `q4-insulin-test`, `q5-inositol`, `q6-diet`, `q8-ranking`.
- **references.json:** `asrm-2020-ovarian-reserve`, `eshre-2023-unexplained-infertility`, `teede-2023-pcos-guideline`.

**Qué hacer con el resto:**
- Los ítems con corrección **menor** pueden pasar a `ai-audited` cuando se aplique la corrección exacta indicada, sin nueva auditoría.
- Los ítems con corrección **importante** (fert c3, fert case1, FERT-M1; pcos c2, c5, c6, c8) se quedan en `sources-verified` hasta que una nueva verificación confirme la corrección.
- Ningún ítem debe quedar fuera (`draft` o `needs-human-review`) por contenido erróneo. Aun así, recomiendo marcar pcos c8 (letrozol) como `needs-human-review` antes de la versión estable, por ser una card de prescripción.
