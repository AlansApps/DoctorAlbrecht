# Mapa curricular general — Medicina funcional e integrativa aplicada a ginecología

**Ámbito de este documento:** macrotemas 1–12 y 14–16 de `02_PROGRAMA_Y_EVIDENCIA.md`. El macrotema 13 (Fertilidad y reproducción) lo cubre otro mapa (`fert.*`); aquí solo aparecen como enlaces transversales (ids `fert.*` orientativos, sujetos a la nomenclatura final de ese mapa).
**Estado:** borrador de investigación curricular (fase 1). No es contenido clínico publicado ni ha pasado revisión médica humana.
**Fecha de investigación y de acceso a fuentes:** 2026-10-12.
**Nivel:** profundidad de posgrado para una ginecóloga en ejercicio, sin afirmar acreditación.

---

## 0. Convenciones

- **IDs estables:** `macro.micro-tema` en minúsculas y kebab-case (ej. `horm.hpo-axis`). Un id no se reutiliza ni se renombra; si cambia el contenido, cambia el título, no el id. Los temas retirados se marcan `deprecated`, no se borran.
- **Nivel:** `B` = base · `I` = intermedio · `A` = avanzado.
- **Etiquetas clínicas:** `H` hormonas · `D` dieta · `G` gastro · `S` suplementos · `Hb` hábitos · `R` reproducción. (En datos: `hormonas`, `dieta`, `gastro`, `suplementos`, `habitos`, `reproduccion`.)
- **Prerrequisitos:** ids que conviene haber estudiado antes. "—" = ninguno. Los `fert.*` son enlaces al mapa de fertilidad, no prerrequisitos duros.
- **`[añadido]`:** microtema no listado explícitamente en spec 02, propuesto tras revisar omisiones; incluye el motivo.
- **Alias de búsqueda:** siglas ES/EN, nombres históricos y términos nuevos. Se conservan los nombres antiguos para que la búsqueda los encuentre aunque el contenido use la nomenclatura vigente.
- **Fuentes:** "Verificada" significa que en esta sesión se confirmó, mediante búsqueda web, que el registro bibliográfico existe en la URL o DOI indicados (PubMed, PMC, página del editor o de la sociedad). **No significa que se haya leído el texto completo**; los "puntos relevantes" proceden del resumen o de la página de la entidad y deben confirmarse en el texto completo antes de redactar tarjetas. Los dominios ifm.org, ods.od.nih.gov y monash.edu devolvieron HTTP 403 al acceso directo; sus páginas se confirmaron mediante resultados de búsqueda. Todo lo que no se pudo confirmar está en §20 "Por verificar".
- No se incluyen dosis, cifras de efecto ni grados GRADE que no se hayan verificado; donde la fuente los tiene, la tarjeta deberá citarlos tras leer el texto completo.

---

## 1. `found` — Fundamentos funcionales y razonamiento clínico / Functional foundations & clinical reasoning

**Objetivo del macrotema:** dar a Sol las herramientas para usar marcos funcionales (historia longitudinal, modelos de sistemas) sin perder rigor: distinguir mecanismo, asociación y eficacia; graduar evidencia; decidir con la paciente; y evitar el sobrediagnóstico y las cascadas de pruebas.

| id | Título ES / EN | Objetivo de aprendizaje | Prerreq. | Nivel | Tags | Alias |
|---|---|---|---|---|---|---|
| `found.longitudinal-history` | Historia clínica longitudinal / Longitudinal history-taking | Estructurar la historia en antecedentes, desencadenantes y mediadores sin convertirlos en causas diagnosticadas. | — | B | Hb | timeline, ATM (antecedents-triggers-mediators), anamnesis longitudinal |
| `found.systems-models` | Modelos de sistemas / Systems & network models | Explicar interacciones multisistema y por qué un modelo plausible no predice respuesta individual. | — | B | H, G | biología de sistemas, systems medicine, network medicine |
| `found.ifm-matrix-timeline` | Matriz y timeline IFM: uso y límites / IFM Matrix & Timeline: uses and limits | Usar la matriz como organizador de la historia y reconocer que no es una herramienta diagnóstica validada. | `found.longitudinal-history`, `found.systems-models` | I | — | Functional Medicine Matrix, IFM Timeline, GOTOIT, nodos funcionales |
| `found.5r-and-frameworks` | 5R y otros marcos funcionales como hipótesis / 5R and other frameworks as hypotheses | Descomponer un protocolo funcional en intervenciones individuales y buscar evidencia de cada una. | `found.ifm-matrix-timeline`, `gut.barrier-permeability` | I | G, S | 4R, 5R, remove-replace-reinoculate-repair-rebalance, gut-healing protocol |
| `found.social-determinants` | Determinantes sociales y equidad / Social determinants of health | Integrar coste, acceso, cultura y carga de cuidados en cualquier plan. | — | B | Hb | DSS, SDOH, equidad en salud |
| `found.causality` | Causalidad, asociación y mecanismo / Causation vs association vs mechanism | Distinguir los tres niveles y reconocer confusión, causalidad inversa y extrapolación preclínica. | — | B | — | criterios de Bradford Hill, confounding, reverse causation |
| `found.biases` | Sesgos cognitivos y de investigación / Cognitive & research biases | Identificar sesgos del clínico (anclaje, confirmación) y de la literatura (publicación, spin, financiación). | `found.causality` | I | — | sesgo de confirmación, publication bias, spin, sesgo de financiación |
| `found.evidence-grading` | Graduación de la evidencia (GRADE) / Evidence grading | Diferenciar certeza de la evidencia y fuerza de la recomendación y leer ambos en una guía. | `found.causality` | B | — | GRADE, certeza, fuerza de recomendación, niveles de evidencia, NAMS Level I-III |
| `found.critical-appraisal` | Lectura crítica de ECA, RS y guías / Critical appraisal | Valorar un ECA, una RS y una guía con listas de referencia y decidir aplicabilidad. | `found.evidence-grading` | I | — | CONSORT, PRISMA, AGREE II, RoB 2, AMSTAR 2 |
| `found.diagnostic-tests` | Razonamiento con pruebas diagnósticas / Diagnostic test reasoning | Usar probabilidad pretest, sensibilidad/especificidad y cocientes de verosimilitud antes de pedir una prueba. | `found.causality` | I | — | likelihood ratio, Bayes, VPP/VPN, PPV/NPV |
| `found.shared-decision` | Decisión compartida y comunicación del riesgo / Shared decision-making & risk communication | Presentar opciones con riesgo absoluto, incertidumbre y preferencias de la paciente. | `found.evidence-grading` | B | — | SDM, NNT, riesgo absoluto vs relativo, decision aids |
| `found.overdiagnosis` | Sobrediagnóstico, sobretratamiento y cascadas / Overdiagnosis & cascades | Reconocer cuándo una prueba o tratamiento no cambia la conducta y puede dañar. | `found.diagnostic-tests` | I | — | low-value care, Choosing Wisely, cascadas diagnósticas, incidentalomas |
| `found.commercial-tests` `[añadido]` | Pruebas comerciales y directas al consumidor / Commercial & direct-to-consumer "functional" tests | Evaluar validez analítica, validez clínica y utilidad clínica de paneles comerciales (hormonas en orina seca, heces, IgG alimentaria). Motivo: aparecen en casi todos los macrotemas y requieren un marco común. | `found.diagnostic-tests`, `found.overdiagnosis` | I | H, G | DTC tests, DUTCH, GI-MAP, test de intolerancias, paneles funcionales |
| `found.coi-regulation` `[añadido]` | Conflictos de interés y venta de productos / Conflicts of interest & product sales | Reconocer conflictos de interés en formación, guías y en la venta de suplementos en consulta. Motivo: spec 02 exige señalar COI y no está como microtema. | `found.biases` | I | S | COI, conflicto de intereses, dispensación en consulta |
| `found.ethics-scope` `[añadido]` | Ética, ámbito de práctica y terapias complementarias / Ethics & scope of practice | Integrar terapias complementarias con consentimiento informado, sin retrasar tratamientos eficaces. Motivo: base ética explícita para todo el programa. | `found.shared-decision` | B | — | medicina integrativa, CAM, MCI, consentimiento informado |
| `found.n-of-1` `[añadido]` | Ensayos N-de-1 y medidas de resultado / N-of-1 trials & PROMs | Diseñar una prueba terapéutica individual con objetivo, duración y criterio de suspensión. Motivo: alternativa rigurosa al "probar y ver". | `found.critical-appraisal` | A | Hb, S | n-of-1, PROMs, PROMIS, single-patient trial |

**Enlaces transversales:** `found.*` es prerrequisito blando de todo el programa; `found.overdiagnosis` → `fert.addons`, `gut.commercial-tests`, `horm.serum-saliva-urine`; `found.shared-decision` → `meno.ht`, `fert.counselling`.

### Fuentes clave — `found` (verificadas; acceso 2026-10-12)

1. **GRADE: an emerging consensus on rating quality of evidence and strength of recommendations.** Guyatt GH, Oxman AD, Vist GE, Kunz R, Falck-Ytter Y, Alonso-Coello P, Schünemann HJ (GRADE Working Group). *BMJ* 2008;336(7650):924-926. DOI 10.1136/bmj.39489.470347.AD · https://pubmed.ncbi.nlm.nih.gov/18436948/ — Tipo: artículo metodológico. Población: no aplica (desarrolladores y usuarios de guías). Punto: separa calidad/certeza de la evidencia y fuerza de la recomendación; usa la THS en posmenopausia como ejemplo de error por ignorar la calidad de la evidencia. Limitaciones: texto completo de pago; GRADE ha evolucionado (serie posterior y manual GRADE), hay que citar también material actualizado.
2. **Shared decision making (NICE guideline NG197).** NICE, 2021. https://www.nice.org.uk/guidance/ng197 — Tipo: guía. Población: adultos que usan servicios de salud y profesionales. Punto: recomendaciones sobre formación, comunicación de riesgos/beneficios, ayudas a la decisión e integración organizativa. Limitaciones: contexto NHS; no aplica a emergencias ni a falta de capacidad.
3. **CONSORT 2025 statement: updated guideline for reporting randomised trials.** Hopewell S et al. *BMJ* 2025;389:e081123 (copublicado en PLoS Med y Nat Med). https://pubmed.ncbi.nlm.nih.gov/40228833/ · PMC: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11995449/ — Tipo: guía de publicación. Población: ECA. Punto: lista de 30 ítems y diagrama de flujo; sustituye a CONSORT 2010. Limitaciones: es guía de *reporte*, no de calidad metodológica; para riesgo de sesgo usar RoB 2 (por verificar).
4. **IFM — "Using the Timeline in Functional Medicine".** Institute for Functional Medicine, página actualizada 2026-01-29 según resultado de búsqueda. https://ifm.org/news-insights/using-timeline-functional-medicine — Tipo: material divulgativo institucional. Población: clínicos. Punto: el timeline registra la historia desde la preconcepción e identifica antecedentes, desencadenantes y mediadores; la matriz agrupa "nodos" (defensa y reparación, energía, biotransformación y eliminación, transporte, comunicación, integridad estructural, asimilación). Limitaciones: fuente promotora del propio marco; no aporta validación.
5. **IFM — "The 5R Framework for Gut Health".** Institute for Functional Medicine. https://www.ifm.org/news-insights/5r-framework-gut-health/ — Tipo: material divulgativo institucional. Punto: describe Remove, Replace, Reinoculate, Repair, Rebalance. Limitaciones: no presenta ensayos del protocolo como conjunto; solo se pudo leer un extracto (403 al acceso directo).
6. **Association of the Functional Medicine Model of Care With Patient-Reported Health-Related Quality-of-Life Outcomes.** Beidelschies M, Alejandro-Rodriguez M, Ji X, Lapin B, Hanaway P, Rothberg MB. *JAMA Netw Open* 2019;2(10):e1914017. DOI 10.1001/jamanetworkopen.2019.14017 — Tipo: cohorte retrospectiva. Población: pacientes del Center for Functional Medicine de Cleveland Clinic vs atención primaria. Punto: mayor mejora en PROMIS de salud física global a 6 meses en el grupo de medicina funcional. Limitaciones: observacional, sin aleatorización, posible selección de pacientes motivadas y sesgo de expectativa; los autores piden estudios prospectivos.
7. **Harvard Medical School — Nutrition and Women's Health (programa de educación ejecutiva).** https://learn.hms.harvard.edu/programs/nutrition-and-womens-health — Tipo: programa formativo de pago (referencia de alcance, no fuente clínica). Punto: programa online de 14 semanas centrado en nutrición, medicina del estilo de vida y salud de la mujer en la mediana edad. Limitaciones: no se ha accedido a materiales; no se sugiere afiliación; útil solo como comparador de temario.

---

## 2. `horm` — Hormonas y fisiología / Hormones & physiology

**Objetivo del macrotema:** dominio fisiológico y analítico de los ejes reproductivo, tiroideo y adrenal, del metabolismo y transporte hormonal, y de cómo se miden (y se malinterpretan) las hormonas; separar fisiología establecida de hipótesis (p. ej., estroboloma).

| id | Título ES / EN | Objetivo de aprendizaje | Prerreq. | Nivel | Tags | Alias |
|---|---|---|---|---|---|---|
| `horm.hpo-axis` | Eje hipotálamo-hipófiso-ovárico / HPO axis | Explicar pulsatilidad de GnRH, retroalimentación y su modulación por energía, estrés y kisspeptina. | — | B | H, R | eje HHO, HPG axis, GnRH pulsátil, kisspeptina, KNDy |
| `horm.folliculogenesis-ovulation` | Foliculogénesis y ovulación / Folliculogenesis & ovulation | Describir reclutamiento, selección y dominancia folicular y el pico de LH. | `horm.hpo-axis` | B | H, R | reclutamiento folicular, folículo dominante, LH surge |
| `horm.luteal-phase` | Fase lútea y progesterona / Luteal phase & progesterone | Interpretar la función lútea y la controversia sobre el "defecto de fase lútea". | `horm.folliculogenesis-ovulation` | I | H, R | insuficiencia lútea, luteal phase defect (LPD), cuerpo lúteo |
| `horm.estrogens` | Estrógenos: síntesis, receptores y acciones / Estrogens | Relacionar E1/E2/E3, aromatasa y receptores con efectos tisulares. | `horm.hpo-axis` | B | H | estradiol, estrona, estriol, ERα/ERβ, aromatasa |
| `horm.progesterone-progestogens` | Progesterona vs progestágenos / Progesterone vs progestins | Distinguir progesterona micronizada de progestágenos sintéticos y sus perfiles. | `horm.estrogens` | I | H | progestinas, gestágenos, progesterona micronizada, "bioidéntica" |
| `horm.androgens-shbg` | Andrógenos y SHBG / Androgens & SHBG | Interpretar testosterona total/libre, SHBG y DHEA-S y sus fuentes. | `horm.estrogens` | I | H | testosterona libre, IAL/FAI, DHEA-S, androstenediona, globulina transportadora |
| `horm.insulin-leptin` | Insulina, leptina y señales metabólicas / Insulin, leptin & metabolic signals | Explicar cómo insulina y adipoquinas modulan ovario, SHBG y eje HPO. | `horm.hpo-axis` | I | H, D | resistencia a la insulina, hiperinsulinemia, adipoquinas, adiponectina |
| `horm.thyroid-axis` | Eje tiroideo: fisiología / Thyroid axis physiology | Describir HHT, desyodasas y efectos reproductivos de la función tiroidea. | — | B | H, R | eje HHT, TSH, T4L, T3L, desyodasas |
| `horm.adrenal-hpa` | Eje adrenal (HHA), estrés y el constructo "fatiga adrenal" / HPA axis & "adrenal fatigue" | Explicar la fisiología del cortisol y por qué "fatiga adrenal" no es un diagnóstico reconocido. | `horm.hpo-axis` | I | H, Hb | eje HHA, HPA axis, cortisol, adrenal fatigue, "disfunción HPA" |
| `horm.prolactin-oxytocin` `[añadido]` | Prolactina y oxitocina / Prolactin & oxytocin | Fisiología de la prolactina (dopamina, lactancia) como base de hiperprolactinemia y lactancia. Motivo: spec 02 lista hiperprolactinemia pero no su fisiología. | `horm.hpo-axis` | B | H, R | PRL, dopamina, lactotropos, oxitocina |
| `horm.transport-metabolism` | Transporte, metabolismo y excreción / Hormone transport, metabolism & excretion | Describir unión a proteínas, hidroxilación hepática, conjugación y excreción. | `horm.estrogens` | I | H, G | 2-OH/4-OH/16α-OH estrona, COMT, glucuronidación, sulfatación, CYP1B1 |
| `horm.estrogen-metabolism-estrobolome` | Metabolismo estrogénico y estroboloma: fisiología vs hipótesis / Estrogen metabolism & estrobolome | Separar lo establecido (circulación enterohepática) de lo hipotético (patología atribuida al estroboloma). | `horm.transport-metabolism`, `gut.microbiota-intestinal` | A | H, G | estrobolome, β-glucuronidasa, eje estrógeno-microbiota, cociente 2:16 |
| `horm.life-stages` | Endocrinología por etapa vital / Life-stage endocrinology | Reconocer cambios hormonales de pubertad, edad reproductiva, embarazo, posparto y transición menopáusica. | `horm.hpo-axis` | B | H, R | pubertad, adolescencia, STRAW+10, climaterio |
| `horm.lab-timing` | Analíticas según ciclo, fármacos y anticoncepción / Lab timing & interferences | Elegir día del ciclo y contexto (AHC, biotina, embarazo) para pedir e interpretar hormonas. | `horm.life-stages` | I | H | fase folicular temprana, progesterona mid-luteal ("día 21"), interferencia por biotina |
| `horm.assay-methods` | Métodos de medida: inmunoensayo vs LC-MS/MS / Assay methods | Explicar por qué el método condiciona la fiabilidad a concentraciones bajas. | `horm.lab-timing` | A | H | espectrometría de masas, LC-MS/MS, inmunoensayo directo, macroprolactina |
| `horm.serum-saliva-urine` | Pruebas séricas, salivales y en orina seca / Serum vs saliva vs dried urine testing | Evaluar validez y utilidad de cada matriz y rechazar su uso para dosificar hormonas sin evidencia. | `horm.assay-methods`, `found.commercial-tests` | A | H | DUTCH, cortisol salival, hormonas en saliva, dried urine |
| `horm.optimal-ranges` | Límites de los "rangos óptimos" / Reference vs "optimal" ranges | Distinguir intervalos de referencia, umbrales de decisión y "rangos funcionales" sin respaldo. | `horm.lab-timing`, `found.overdiagnosis` | I | H | rangos funcionales, optimal ranges, valores de referencia |
| `horm.endocrine-pharmacology` `[añadido]` | Farmacología hormonal básica / Hormonal pharmacology primer | Conocer AHC, DIU-LNG, análogos/antagonistas de GnRH, letrozol, metformina y su efecto en analíticas. Motivo: necesario para interpretar casos y planes integrados. | `horm.progesterone-progestogens` | I | H, R | anticonceptivos, AHC, GnRH-a, relugolix, inhibidores de aromatasa |
| `horm.circadian-endocrine` `[añadido]` | Ritmos circadianos y endocrinología / Circadian endocrinology | Explicar ritmos de cortisol, melatonina y LH como base de sueño, turnos y momento de la analítica. Motivo: conecta `habit.*` con `horm.*`. | `horm.adrenal-hpa` | I | H, Hb | cronobiología, melatonina, ritmo circadiano, clock genes |

**Enlaces transversales:** `horm.folliculogenesis-ovulation` → `fert.ovulation`, `fert.ovarian-reserve`; `horm.luteal-phase` → `fert.luteal-support`; `horm.androgens-shbg` → `pcos.hyperandrogenism`; `horm.serum-saliva-urine` → `meno.ht-regulated-vs-compounded`.

### Fuentes clave — `horm` (verificadas; acceso 2026-10-12)

1. **Challenges to the measurement of estradiol: an Endocrine Society position statement.** Rosner W, Hankinson SE, Sluss PM, Vesper HW, Wierman ME. *J Clin Endocrinol Metab* 2013;98(4):1376-1387. DOI 10.1210/jc.2012-3780 · https://pmc.ncbi.nlm.nih.gov/articles/PMC3615207 — Tipo: declaración de posición. Población: todas (énfasis en concentraciones bajas: posmenopausia, varones, niños). Punto: muchos inmunoensayos directos no son fiables a concentraciones bajas; pide estandarización y rangos por edad/etapa. Limitaciones: 2013; los métodos han mejorado; verificar situación actual del laboratorio local.
2. **ACOG Committee Opinion No. 651: Menstruation in Girls and Adolescents: Using the Menstrual Cycle as a Vital Sign.** ACOG (avalado por AAP). *Obstet Gynecol* 2015;126(6):e143-e146. https://pubmed.ncbi.nlm.nih.gov/26595586/ — Tipo: opinión de comité. Población: niñas y adolescentes. Punto: preguntar por el ciclo en cada visita preventiva y educar sobre el rango normal; los patrones anómalos pueden señalar SOP, tiroides, TCA, coagulopatías. Limitaciones: estado de reafirmación posterior no confirmado.
3. **Estrogen–gut microbiome axis: Physiological and clinical implications.** Baker JM, Al-Nakkash L, Herbst-Kralovetz MM. *Maturitas* 2017;103:45-53. https://pubmed.ncbi.nlm.nih.gov/28778332/ — Tipo: revisión narrativa. Población: no aplica (revisión). Punto: la microbiota regula estrógenos circulantes vía β-glucuronidasa; propone vínculos con obesidad, SOP, fertilidad, cáncer. Limitaciones: narrativa e hipótesis-generadora; una revisión posterior en cáncer de mama (PMC12178105, 2025) encontró resultados heterogéneos y poco alineados con dianas del estroboloma.
4. **Compounded Bioidentical Menopausal Hormone Therapy: ACOG Clinical Consensus No. 6.** ACOG (avalado por ASRM). *Obstet Gynecol* 2023;142(5):1266-1273. DOI 10.1097/AOG.0000000000005395 · https://pubmed.ncbi.nlm.nih.gov/37856860/ — Tipo: consenso clínico. Población: mujeres en menopausia. Punto: los datos para interpretar pruebas hormonales adjuntas (p. ej., salivales) para dosificar hormonas compuestas son limitados y no se recomiendan para ese fin. Limitaciones: contexto regulatorio EE. UU. (FDA); ver equivalentes en España/Argentina.
5. **Recommendations from the 2023 International Evidence-based Guideline for the Assessment and Management of PCOS** (sección de andrógenos y laboratorio). Ver `pcos`, fuente 1. Uso aquí: preferencia por métodos de alta calidad para andrógenos.

---

## 3. `nutr` — Dietas y nutrición clínica / Diets & clinical nutrition

**Objetivo del macrotema:** prescribir y adaptar patrones alimentarios con evidencia, reconocer riesgos (baja disponibilidad energética, TCA, dietas restrictivas), atender la obesidad sin estigma y aplicar todo ello a SOP, endometriosis, fertilidad y menopausia.

| id | Título ES / EN | Objetivo de aprendizaje | Prerreq. | Nivel | Tags | Alias |
|---|---|---|---|---|---|---|
| `nutr.assessment` | Valoración nutricional clínica / Clinical nutrition assessment | Realizar una valoración dietética breve y detectar riesgo de malnutrición o deficiencia. | — | B | D | recordatorio 24 h, frecuencia de consumo, cribado nutricional |
| `nutr.mediterranean` | Patrón mediterráneo / Mediterranean diet | Describir el patrón, su evidencia (incluida la republicación de PREDIMED) y su adaptación. | `nutr.assessment` | B | D | dieta mediterránea, MedDiet, PREDIMED, AOVE/EVOO |
| `nutr.other-patterns` | Otros patrones estudiados / Other studied patterns | Comparar DASH, nórdico, basado en plantas y "antiinflamatorio" según el tipo de evidencia. | `nutr.mediterranean` | I | D | DASH, Nordic diet, plant-based, dieta antiinflamatoria |
| `nutr.macronutrients` | Macronutrientes y calidad / Macronutrients & quality | Valorar proteínas, grasas y carbohidratos por calidad y no solo por cantidad. | `nutr.assessment` | B | D | proteína, grasas saturadas/insaturadas, carbohidratos refinados |
| `nutr.fiber-glycemic` | Fibra, índice y carga glucémica / Fiber, glycemic index & load | Usar fibra, IG y CG y conocer sus limitaciones de medida. | `nutr.macronutrients` | B | D, G | IG, CG, GI/GL, fibra soluble/insoluble |
| `nutr.ultra-processed` `[añadido]` | Ultraprocesados y clasificación NOVA / Ultra-processed foods | Interpretar la evidencia (mayoritariamente observacional) sobre ultraprocesados. Motivo: tema dominante en consulta y medios. | `nutr.macronutrients`, `found.causality` | I | D | UPF, NOVA, alimentos ultraprocesados |
| `nutr.energy-availability` | Energía disponible, RED-S, bajo peso y amenorrea / Energy availability & REDs | Detectar baja disponibilidad energética y sus efectos sobre eje HPO, hueso y salud mental. | `horm.hpo-axis` | I | D, H, Hb | LEA, RED-S, REDs, tríada de la atleta, female athlete triad, REDs CAT2 |
| `nutr.eating-disorders` `[añadido]` | Trastornos de la conducta alimentaria: cribado y derivación / Eating disorders | Cribar TCA antes de cualquier dieta restrictiva y derivar. Motivo: riesgo iatrogénico de dietas de eliminación/ayuno. | `nutr.energy-availability` | I | D, Hb | TCA, ED, anorexia, bulimia, ARFID, ortorexia |
| `nutr.obesity-no-stigma` | Obesidad sin estigma / Obesity care without stigma | Abordar el peso con lenguaje no estigmatizante y objetivos de salud, no solo de IMC. | `nutr.assessment` | I | D, Hb | weight stigma, sesgo de peso, adiposidad, limitaciones del IMC |
| `nutr.antiobesity-pharm` `[añadido]` | Fármacos antiobesidad y cirugía bariátrica en ginecología / Anti-obesity drugs & bariatric surgery | Conocer implicaciones de GLP-1 RA y cirugía bariátrica en anticoncepción, fertilidad y embarazo. Motivo: uso creciente y ausente en spec 02. | `nutr.obesity-no-stigma` | A | D, H, R | agonistas GLP-1, semaglutida, tirzepatida, cirugía bariátrica |
| `nutr.vegetarian-vegan` | Dietas vegetarianas y veganas / Vegetarian & vegan diets | Planificar dietas vegetarianas adecuadas, incluida B12, en todas las etapas. | `nutr.macronutrients` | I | D, S | plant-based, vegano, ovolactovegetariano |
| `nutr.low-carb-keto` | Bajo carbohidrato y cetogénica / Low-carb & ketogenic | Conocer indicaciones estudiadas, contraindicaciones y riesgos (embarazo, TCA, fármacos). | `nutr.macronutrients`, `nutr.eating-disorders` | A | D | LCHF, keto, VLCKD, dieta cetogénica |
| `nutr.fasting` | Ayuno intermitente y alimentación restringida en el tiempo / Intermittent fasting & TRE | Evaluar la evidencia y contraindicaciones (embarazo, TCA, LEA). | `nutr.energy-availability` | A | D, Hb | IF, TRE, 16:8, ayuno en días alternos |
| `nutr.elimination-diets` | Dietas de eliminación; gluten y lácteos sin exclusiones universales / Elimination diets | Indicar eliminación solo con objetivo, duración y reintroducción; descartar celiaquía antes de retirar gluten. | `gut.celiac`, `nutr.eating-disorders` | I | D, G | dieta sin gluten, sensibilidad al gluten no celíaca, SGNC/NCGS, sin lácteos |
| `nutr.low-fodmap` | Low-FODMAP con reintroducción y apoyo dietista / Low-FODMAP | Aplicar las tres fases y derivar a dietista; evitar restricción prolongada. | `gut.ibs` | I | D, G | FODMAP, dieta baja en FODMAP |
| `nutr.deficiencies` | Deficiencias frecuentes en mujeres / Common deficiencies | Identificar riesgo de déficit de hierro, B12, yodo, vitamina D, calcio. | `nutr.assessment` | B | D, S | ferropenia, déficit de B12, yodo, vitamina D |
| `nutr.food-insecurity-culture` `[añadido]` | Inseguridad alimentaria, cultura y coste / Food insecurity, culture & cost | Adaptar recomendaciones a presupuesto, cultura y entorno. Motivo: aplicabilidad real. | `found.social-determinants` | B | D | inseguridad alimentaria, coste de la dieta |
| `nutr.adherence` | Adherencia y cambio dietético sostenible / Dietary adherence | Usar metas pequeñas, seguimiento y entrevista motivacional en nutrición. | `habit.motivational-interviewing` | B | D, Hb | adherencia, cambio de conducta |
| `nutr.applied-cases` | Aplicaciones: SOP, endometriosis, fertilidad, menopausia / Applied nutrition | Integrar patrones y restricciones en casos por condición. | `pcos.diet`, `endo.nutrition`, `meno.lifestyle-nutrition` | A | D, R | nutrición aplicada |

**Enlaces transversales:** `nutr.energy-availability` → `menst.fha`, `meno.bone`; `nutr.applied-cases` → `fert.nutrition`, `fert.male-lifestyle`; `nutr.antiobesity-pharm` → `fert.preconception`, `vulv.contraception`.

### Fuentes clave — `nutr` (verificadas; acceso 2026-10-12)

1. **Primary Prevention of Cardiovascular Disease with a Mediterranean Diet Supplemented with Extra-Virgin Olive Oil or Nuts.** Estruch R et al. *N Engl J Med* 2018 (republicación tras retractación del artículo de 2013). Confirmación de retractación/republicación: Harvard T.H. Chan Nutrition Source, https://nutritionsource.hsph.harvard.edu/2018/06/22/predimed-retraction-republication — Tipo: ECA (multicéntrico, España). Población: adultos de alto riesgo cardiovascular sin enfermedad CV. Punto: menos eventos CV mayores en los brazos mediterráneos frente a dieta reducida en grasa. Limitaciones: errores de aleatorización en parte de la muestra (motivo de la retractación); población no específicamente ginecológica; DOI de la republicación por verificar.
2. **Position of the Academy of Nutrition and Dietetics: Vegetarian Diets.** Melina V, Craig W, Levin S. *J Acad Nutr Diet* 2016;116(12):1970-1980. https://digitalcommons.andrews.edu/pubs/648 — Tipo: declaración de posición. Población: todas las etapas vitales incluidas embarazo y lactancia. Punto: dietas vegetarianas/veganas bien planificadas son adecuadas; necesidad de fuente fiable de B12. Limitaciones: 2016; una coautora dirige educación en PCRM (organización promotora de dietas vegetales): COI a señalar.
3. **2023 International Olympic Committee's (IOC) consensus statement on Relative Energy Deficiency in Sport (REDs).** Mountjoy M et al. *Br J Sports Med* 2023;57(17):1073-1097. DOI 10.1136/bjsports-2023-106994 · https://pubmed.ncbi.nlm.nih.gov/37752011/ — Tipo: consenso. Población: deportistas (incluye varones y para-deportistas). Punto: LEA como espectro adaptable-problemático; herramienta REDs CAT2. Limitaciones: población deportista; extrapolación a no deportistas con restricción alimentaria requiere juicio.
4. **Joint international consensus statement for ending stigma of obesity.** Rubino F, Puhl RM, Cummings DE et al. *Nat Med* 2020;26(4):485-497. DOI 10.1038/s41591-020-0803-x — Tipo: consenso Delphi. Población: personas con obesidad; profesionales. Punto: el estigma de peso daña la salud y la calidad de la atención; recomendaciones para eliminar el sesgo. Limitaciones: consenso de expertos.
5. **AGA Clinical Practice Update on the Role of Diet in Irritable Bowel Syndrome: Expert Review.** Chey WD, Hashash JG, Manning L, Chang L. *Gastroenterology* 2022;162(6):1737-1745.e5. DOI 10.1053/j.gastro.2021.12.248 · PMID 35337654 — Tipo: revisión de expertos (práctica clínica). Población: adultos con SII. Punto: la modificación dietética (incluida low-FODMAP) como tratamiento; derivar a dietista; biomarcadores aún no útiles para personalizar. Limitaciones: expert review, no guía GRADE.
6. **The Mediterranean diet and menopausal health: An EMAS position statement.** EMAS. *Maturitas* 2020;139:90-97. https://pubmed.ncbi.nlm.nih.gov/32682573/ — Tipo: declaración de posición (revisión + consenso). Población: mujeres peri/posmenopáusicas. Punto: posible mejora de factores de riesgo CV y asociaciones con salud ósea y cognitiva. Limitaciones: gran parte de la evidencia es observacional.
7. **The Nutrition Source.** Harvard T.H. Chan School of Public Health. https://nutritionsource.hsph.harvard.edu/ — Tipo: recurso divulgativo académico. Uso: explicaciones para la paciente; no sustituye guías.

---

## 4. `gut` — Gastro y microbiota / Gastroenterology & microbiome

**Objetivo del macrotema:** manejar los cuadros digestivos frecuentes en consulta ginecológica (SII, estreñimiento, celiaquía, síntomas digestivos de endometriosis), diferenciar microbiotas intestinal, vaginal y endometrial, y evaluar críticamente probióticos, "leaky gut", SIBO y pruebas comerciales, con alarmas y criterios de derivación.

| id | Título ES / EN | Objetivo de aprendizaje | Prerreq. | Nivel | Tags | Alias |
|---|---|---|---|---|---|---|
| `gut.digestion-absorption` | Digestión y absorción / Digestion & absorption | Repasar fisiología digestiva relevante para deficiencias y síntomas. | — | B | G, D | absorción de hierro/B12, ácido gástrico, bilis, enzimas pancreáticas |
| `gut.transit-constipation-diarrhea` | Tránsito, estreñimiento y diarrea / Transit, constipation & diarrhoea | Evaluar hábito intestinal y tratar estreñimiento funcional con escalones razonables. | `gut.digestion-absorption` | B | G, D | escala de Bristol, estreñimiento crónico, laxantes |
| `gut.red-flags` `[añadido]` | Alarmas y derivación digestiva / GI red flags & referral | Identificar signos de alarma (sangrado, pérdida de peso, anemia, edad, antecedentes) y usar calprotectina. Motivo: spec 02 pide alarmas; se separa para que sea transversal. | `gut.transit-constipation-diarrhea` | B | G | red flags, EII, IBD, calprotectina fecal, cáncer colorrectal |
| `gut.ibs` | Síndrome del intestino irritable y DGBI / IBS & disorders of gut-brain interaction | Diagnosticar SII con criterios positivos (Roma IV) y pruebas mínimas. | `gut.red-flags` | I | G | SII, IBS, DGBI, trastornos funcionales digestivos, Roma IV, colon irritable |
| `gut.celiac` | Celiaquía / Coeliac disease | Saber cuándo cribar, con qué serología y por qué no retirar gluten antes de la prueba. | `gut.digestion-absorption` | I | G, D, R | EC, enfermedad celíaca, CD, anti-transglutaminasa IgA, tTG-IgA |
| `gut.malabsorption` | Malabsorción y deficiencias / Malabsorption | Relacionar malabsorción con ferropenia, déficit de B12 y otros. | `gut.celiac` | I | G, S | malabsorción, ferropenia refractaria, gastritis atrófica |
| `gut.sibo` | SIBO/IMO y límites de las pruebas de aliento / SIBO, IMO & breath-test limits | Conocer indicaciones restringidas de las pruebas de aliento y su baja certeza. | `gut.ibs` | A | G | SIBO, SBID, sobrecrecimiento bacteriano, IMO, test de aliento lactulosa/glucosa, metano |
| `gut.gut-brain-axis` | Eje intestino-cerebro / Gut-brain axis | Explicar hipersensibilidad visceral, estrés y terapias psicológicas dirigidas al intestino. | `gut.ibs` | I | G, Hb | eje intestino-cerebro, gut-directed hypnotherapy, TCC |
| `gut.pelvic-floor-defecation` `[añadido]` | Disinergia defecatoria y suelo pélvico / Dyssynergic defecation | Reconocer defecación disinérgica y su relación con dolor pélvico y parto. Motivo: solapamiento gineco-gastro muy frecuente. | `gut.transit-constipation-diarrhea` | I | G | disinergia, obstructed defecation, biofeedback |
| `gut.endometriosis-gi` | Síntomas digestivos de la endometriosis / GI symptoms of endometriosis | Distinguir síntomas por afectación intestinal, solapamiento con SII y sensibilización visceral. | `gut.ibs`, `endo.diagnosis` | I | G, R | endometriosis intestinal, "endo belly", SII-like |
| `gut.microbiota-intestinal` | Microbiota intestinal: conceptos y límites / Gut microbiota | Definir composición vs función y por qué "disbiosis" no es un diagnóstico clínico estandarizado. | `gut.digestion-absorption` | B | G | microbioma, disbiosis, metagenómica, diversidad |
| `gut.microbiota-vaginal` | Microbiota vaginal / Vaginal microbiota | Describir tipos de comunidad (CST) y el papel de *Lactobacillus*. | `gut.microbiota-intestinal` | I | G, R | CST, community state types, *L. crispatus*, *L. iners* |
| `gut.microbiota-endometrial` | Microbioma endometrial: estado de la evidencia / Endometrial microbiome | Reconocer problemas metodológicos (baja biomasa, contaminación) y la falta de validación clínica. | `gut.microbiota-vaginal` | A | G, R | microbioma endometrial, EMMA, ALICE, endometritis crónica |
| `gut.barrier-permeability` | Barrera intestinal y "leaky gut" / Intestinal barrier & "leaky gut" | Distinguir permeabilidad como fenómeno fisiológico medible en investigación del diagnóstico comercial de "leaky gut". | `gut.microbiota-intestinal` | A | G | permeabilidad intestinal, leaky gut, zonulina, lactulosa/manitol |
| `gut.prebiotics-probiotics` | Prebióticos, probióticos y posbióticos por cepa, vía y condición / Pre-, pro- & postbiotics | Elegir (o no) por cepa e indicación con evidencia; conocer riesgos y regulación. | `gut.microbiota-intestinal` | I | G, S | probióticos, LBP (live biotherapeutic products), simbióticos, posbióticos |
| `gut.fermented-foods` | Alimentos fermentados / Fermented foods | Valorar evidencia y tolerancia de fermentados. | `gut.prebiotics-probiotics` | B | G, D | kéfir, yogur, kimchi, chucrut |
| `gut.medications-microbiota` `[añadido]` | Fármacos y microbiota (IBP, metformina, antibióticos) / Drugs & microbiota | Reconocer efectos de fármacos frecuentes sobre microbiota y absorción. Motivo: interacción relevante con suplementos y deficiencias. | `gut.microbiota-intestinal` | I | G, S | IBP, PPI, metformina, antibióticos |
| `gut.commercial-tests` | Pruebas comerciales: heces, IgG alimentaria / Commercial stool & food-IgG tests | Rechazar IgG/IgG4 alimentaria como diagnóstico y evaluar paneles fecales comerciales. | `found.commercial-tests` | I | G | GI-MAP, análisis de heces funcional, test de intolerancias IgG, IgG4 |
| `gut.antimicrobials` | Antimicrobianos farmacológicos y herbales / Pharmacological & herbal antimicrobials | Conocer evidencia y riesgos de antibióticos y "antimicrobianos herbales" en SIBO. | `gut.sibo` | A | G, S | rifaximina, antimicrobianos herbales, berberina, aceite de orégano |
| `gut.histamine-intolerance` `[añadido]` | "Intolerancia a la histamina" y MCAS / Histamine intolerance & MCAS claims | Evaluar la evidencia (débil) y el riesgo de dietas restrictivas. Motivo: muy popular en medicina funcional. | `gut.commercial-tests` | A | G, D | DAO, intolerancia a la histamina, MCAS |

**Enlaces transversales:** `gut.microbiota-vaginal` → `vulv.bv`, `fert.microbiome`; `gut.microbiota-endometrial` → `fert.addons`, `fert.rif`; `gut.celiac` → `thyr.celiac-autoimmunity`, `fert.unexplained`; `gut.barrier-permeability` → `found.5r-and-frameworks`.

### Fuentes clave — `gut` (verificadas; acceso 2026-10-12)

1. **ACG Clinical Guideline: Management of Irritable Bowel Syndrome.** Lacy BE et al. *Am J Gastroenterol* 2021;116(1):17-44. DOI 10.14309/ajg.0000000000001036 · PMID 33315591 — Tipo: guía (GRADE). Población: adultos con SII. Punto: estrategia diagnóstica positiva frente a exclusión; serología de celiaquía en SII con diarrea; prueba limitada de low-FODMAP; psicoterapia dirigida al intestino. Limitaciones: contexto EE. UU.; comprobar si hay actualización.
2. **ACG Clinical Guideline: Small Intestinal Bacterial Overgrowth.** Pimentel M, Saad RJ, Long MD, Rao SSC. *Am J Gastroenterol* 2020;115(2):165-178. DOI 10.14309/ajg.0000000000000501 — Tipo: guía (GRADE). Población: adultos con sospecha de SIBO. Punto: pruebas de aliento sugeridas solo en contextos concretos (SII, trastornos de motilidad, cirugía previa); introduce el término IMO; la mayoría de recomendaciones con evidencia de muy baja calidad. Limitaciones: certeza muy baja; no se encontró actualización ACG posterior.
3. **American College of Gastroenterology Guidelines Update: Diagnosis and Management of Celiac Disease.** Rubio-Tapia A et al. *Am J Gastroenterol* 2023;118(1):59-76. DOI 10.14309/ajg.0000000000002075 · PMID 36602836 — Tipo: guía (GRADE). Población: niños y adultos. Punto: serología específica (tTG) para cribado inicial; biopsia duodenal para confirmar en la mayoría. Limitaciones: contexto EE. UU.
4. **AGA Clinical Practice Guidelines on the Role of Probiotics in the Management of Gastrointestinal Disorders.** Su GL et al. *Gastroenterology* 2020;159(2):697-705. DOI 10.1053/j.gastro.2020.05.059 — Tipo: guía. Población: adultos y niños con trastornos GI. Punto: recomendaciones condicionales en pocas indicaciones; en SII, EII evidencia insuficiente (laguna de conocimiento). Limitaciones: 2020; evidencia por cepa escasa.
5. **Rome IV — Functional GI Disorders: Disorders of Gut-Brain Interaction.** Drossman DA, Hasler WL. *Gastroenterology* 2016;150(6):1257-1261. https://pubmed.ncbi.nlm.nih.gov/27147121/ — Tipo: introducción a criterios de consenso. Punto: renombra los trastornos funcionales como trastornos de la interacción intestino-cerebro. Limitaciones: los criterios completos están en publicaciones de la Rome Foundation (algunas de pago).
6. **Intestinal permeability – a new target for disease prevention and therapy.** Bischoff SC et al. *BMC Gastroenterol* 2014;14:189. DOI 10.1186/s12876-014-0189-7 · https://pubmed.ncbi.nlm.nih.gov/25407511/ — Tipo: revisión. Punto: los métodos de medida varían y probablemente miden componentes distintos de la barrera; variabilidad natural dificulta su interpretación. Limitaciones: revisión narrativa de expertos; no valida pruebas comerciales.
7. **Testing for IgG4 against foods is not recommended as a diagnostic tool: EAACI Task Force Report.** Stapel SO et al. *Allergy* 2008;63(7):793-796. DOI 10.1111/j.1398-9995.2008.01705.x — Tipo: posición de sociedad. Punto: IgG4 alimentaria refleja exposición, no alergia ni intolerancia; no usar como diagnóstico. Limitaciones: antigua pero sigue respaldada (AAAAI 2010, CSACI).
8. **Analysing endometrial microbiome: methodological considerations and recommendations for good practice.** Molina NM et al. *Hum Reprod* 2021;36(4):859-879. https://academic.oup.com/humrep/article/36/4/859/6126857 · PMID 33532852 — Tipo: revisión metodológica. Punto: el endometrio es un nicho de baja biomasa, con alto riesgo de contaminación; propone buenas prácticas de investigación. Limitaciones: metodológico, no establece utilidad clínica.

Fuentes adicionales verificadas: NCCIH, *Probiotics: Usefulness and Safety*, https://www.nccih.nih.gov/health/probiotics-usefulness-and-safety (ficha; seguridad a largo plazo poco estudiada; advertencia FDA 2023 en prematuros).

---

## 5. `supp` — Suplementos y nutracéuticos / Supplements & nutraceuticals

**Objetivo del macrotema:** fichas homogéneas por suplemento que distingan corrección de deficiencia frente a uso empírico, con evidencia por condición, formulación y dosis solo si verificables, riesgos, interacciones, embarazo/lactancia, calidad del producto y criterios de monitorización y suspensión. **Incluir no implica recomendar.**

**Plantilla de ficha (`supp.*`):** indicación · mecanismo (y nivel: mecanístico/clínico) · evidencia por condición (con etiqueta de evidencia) · formulación y dosis estudiadas (si verificables) · duración estudiada · resultados clínicamente relevantes · riesgos · interacciones · embarazo/lactancia · calidad/regulación · monitorización y suspensión · fuentes por afirmación.

| id | Título ES / EN | Objetivo de aprendizaje | Prerreq. | Nivel | Tags | Alias |
|---|---|---|---|---|---|---|
| `supp.principles` | Principios: deficiencia vs uso empírico / Deficiency correction vs empirical use | Aplicar la plantilla de ficha y decidir cuándo un suplemento es tratamiento de una deficiencia demostrada. | `found.evidence-grading` | B | S | nutracéuticos, complementos alimenticios, dietary supplements |
| `supp.quality-regulation` | Calidad y regulación / Quality & regulation | Comparar regulación UE/España, Argentina y EE. UU. y valorar verificación de terceros. | `supp.principles`, `found.coi-regulation` | I | S | complementos alimenticios (UE), AESAN, ANMAT, FDA DSHEA, USP, adulteración |
| `supp.interactions-safety` | Interacciones y seguridad / Interactions & safety | Detectar interacciones relevantes (anticoagulantes, levotiroxina, anticonceptivos, ISRS) y hepatotoxicidad. | `supp.principles` | I | S | interacciones planta-fármaco, hepatotoxicidad, DILI por suplementos |
| `supp.multivitamin-prenatal` `[añadido]` | Multivitamínicos y prenatales / Multivitamins & prenatal supplements | Valorar composición y utilidad de prenatales y polivitamínicos. Motivo: uso masivo y no listado. | `supp.principles` | B | S, R | prenatal, polivitamínico, MVM |
| `supp.folate` | Folato: ácido fólico vs metilfolato; MTHFR / Folate | Aplicar la evidencia de ácido fólico preconcepcional y valorar el uso de metilfolato y el genotipado MTHFR. | `supp.principles` | I | S, R | ácido fólico, 5-MTHF, L-metilfolato, folato, MTHFR, vitamina B9 |
| `supp.b12` | Vitamina B12 / Vitamin B12 | Diagnosticar y corregir déficit (veganas, metformina, malabsorción). | `supp.principles`, `gut.malabsorption` | B | S | cobalamina, cianocobalamina, metilcobalamina |
| `supp.iron` | Hierro / Iron | Tratar ferropenia con o sin anemia, elegir vía y vigilar tolerancia. | `supp.principles`, `menst.hmb-iron` | B | S | ferropenia, hierro oral/IV, ferritina |
| `supp.vitamin-d` | Vitamina D / Vitamin D | Interpretar 25(OH)D, distinguir déficit de uso empírico y conocer límites superiores. | `supp.principles` | B | S | 25(OH)D, colecalciferol, calcifediol |
| `supp.iodine` | Yodo / Iodine | Conocer necesidades en embarazo/lactancia y riesgos de exceso. | `supp.principles`, `horm.thyroid-axis` | B | S, R | yoduro potásico, sal yodada, yodo |
| `supp.selenium` | Selenio / Selenium | Valorar evidencia en autoinmunidad tiroidea y riesgos de exceso. | `supp.iodine` | I | S | selenometionina, selenio |
| `supp.calcium` | Calcio / Calcium | Priorizar ingesta dietética y valorar suplementación en hueso. | `supp.vitamin-d` | B | S, D | carbonato/citrato cálcico |
| `supp.magnesium` | Magnesio / Magnesium | Valorar evidencia en dismenorrea, migraña, sueño y estreñimiento. | `supp.principles` | B | S | citrato/glicinato/óxido de magnesio |
| `supp.omega3` | Omega-3 / Omega-3 fatty acids | Distinguir ALA, EPA y DHA y la evidencia por condición (dismenorrea, embarazo, triglicéridos). | `supp.principles` | I | S, D | EPA, DHA, ALA, aceite de pescado |
| `supp.choline` `[añadido]` | Colina / Choline | Conocer necesidades en embarazo y lactancia. Motivo: a menudo ausente en prenatales. | `supp.multivitamin-prenatal` | I | S, R | colina, fosfatidilcolina |
| `supp.minerals-other` `[añadido]` | Zinc, cromo y otros minerales / Zinc, chromium & others | Evaluar usos frecuentes en SOP/acné con su evidencia. Motivo: muy prescritos en medicina funcional. | `supp.principles` | I | S | zinc, cromo picolinato |
| `supp.inositols` | Inositoles / Inositols | Evaluar mio-inositol y D-quiro-inositol en SOP y fertilidad por resultado clínico. | `supp.principles`, `pcos.metabolic` | I | S, R | mio-inositol, MI, D-chiro-inositol, DCI |
| `supp.coq10` | Coenzima Q10 / CoQ10 | Valorar evidencia en reproducción y riesgos. | `supp.principles` | I | S, R | ubiquinona, ubiquinol |
| `supp.dhea` | DHEA | Conocer usos (baja reserva, GSM vaginal) y riesgos androgénicos. | `horm.androgens-shbg` | A | S, H, R | dehidroepiandrosterona, prasterona |
| `supp.melatonin` | Melatonina / Melatonin | Valorar uso en sueño y reproducción y su regulación variable. | `horm.circadian-endocrine` | I | S, Hb | melatonina |
| `supp.nac` | N-acetilcisteína / NAC | Evaluar evidencia en SOP y fertilidad. | `supp.principles` | I | S | N-acetilcisteína, NAC |
| `supp.berberine` | Berberina / Berberine | Evaluar evidencia metabólica, interacciones y seguridad. | `supp.interactions-safety` | A | S | berberina, "ozempic natural" (término de marketing) |
| `supp.probiotics` | Probióticos como suplemento / Probiotic supplements | Aplicar principios de `gut.prebiotics-probiotics` a productos concretos por cepa. | `gut.prebiotics-probiotics` | I | S, G | probióticos, cepas |
| `supp.vitex` | Vitex agnus-castus | Valorar evidencia en SPM/mastalgia y precauciones (embarazo, dopaminérgicos). | `supp.interactions-safety` | I | S, H | sauzgatillo, agnocasto, chasteberry, chaste tree |
| `supp.phytoestrogens` | Fitoestrógenos e isoflavonas / Phytoestrogens & isoflavones | Distinguir alimento vs suplemento, productores de equol y evidencia en síntomas vasomotores. | `horm.estrogens` | I | S, D, H | soja, isoflavonas, genisteína, equol, lignanos |
| `supp.black-cohosh` | Cimicífuga / Black cohosh | Valorar evidencia insuficiente/inconsistente y riesgo hepático. | `supp.interactions-safety` | I | S | *Actaea racemosa*, *Cimicifuga racemosa*, black cohosh |
| `supp.botanicals-other` `[añadido]` | Otros botánicos frecuentes / Other common botanicals | Fichas breves: cúrcuma, jengibre, resveratrol, palmitoiletanolamida (PEA), canela, sauce. Motivo: frecuentes en dismenorrea, endometriosis y SOP. | `supp.interactions-safety` | A | S | curcumina, jengibre, resveratrol, PEA, adaptógenos, ashwagandha |

**Enlaces transversales:** `supp.folate`, `supp.inositols`, `supp.coq10`, `supp.dhea` → `fert.supplements-female`, `fert.supplements-male`; `supp.iodine`, `supp.selenium` → `thyr.iodine-selenium`; `supp.black-cohosh`, `supp.phytoestrogens` → `meno.supplements`.

### Fuentes clave — `supp` (verificadas; acceso 2026-10-12)

1. **Folic Acid Supplementation to Prevent Neural Tube Defects: USPSTF Reaffirmation Recommendation Statement.** US Preventive Services Task Force. *JAMA* 2023;330(5). Resumen clínico: https://www.aafp.org/pubs/afp/issues/2023/0900/uspstf-folic-acid-supplementation.pdf — Tipo: recomendación (grado A). Población: personas que planean o podrían quedar embarazadas. Punto: suplemento diario de ácido fólico; beneficio neto sustancial con alta certeza; evidencia inadecuada sobre variación por dosis o momento. Limitaciones: no aplica a alto riesgo (antecedente de DTN, fármacos antifolato); contexto EE. UU.
2. **Folate — Health Professional Fact Sheet.** NIH Office of Dietary Supplements. https://ods.od.nih.gov/factsheets/Folate-HealthProfessional/ — Tipo: ficha. Punto: DFE, marcadores de estado (sérico y eritrocitario), límite superior para ácido fólico sintético, posible enmascaramiento de déficit de B12. Limitaciones: valores de referencia EE. UU.; contrastar con EFSA.
3. **Vitamin D — Health Professional Fact Sheet.** NIH ODS. https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/ — Tipo: ficha. Punto: 25(OH)D como marcador; umbrales de deficiencia/adecuación y de posible efecto adverso; nivel máximo tolerable. Limitaciones: umbrales discutidos entre sociedades.
4. **Iron — Health Professional Fact Sheet.** NIH ODS. https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/ — Tipo: ficha. Punto: necesidades por etapa (mayores en embarazo); grupos de riesgo (donantes, deportistas). Limitaciones: no es guía terapéutica.
5. **Iodine — Health Professional Fact Sheet** y **Dietary Supplements and Life Stages: Pregnancy**. NIH ODS. https://ods.od.nih.gov/factsheets/Iodine-HealthProfessional/ · https://ods.od.nih.gov/factsheets/Pregnancy-HealthProfessional/ — Tipo: fichas. Punto: necesidades aumentadas en embarazo; riesgo de insuficiencia en quien no consume lácteos o sal yodada. Limitaciones: datos de población estadounidense.
6. **Inositol for subfertile women with polycystic ovary syndrome.** Showell MG, Mackenzie-Proctor R, Jordan V, Hodgson R, Farquhar C. *Cochrane Database Syst Rev* 2018;(12):CD012378. DOI 10.1002/14651858.CD012378.pub2 — Tipo: RS Cochrane. Población: mujeres subfértiles con SOP (13 ECA). Punto: evidencia baja a muy baja; resultados como nacido vivo y eventos adversos poco reportados; no hay evidencia de alta calidad que apoye su uso pre-FIV. Limitaciones: búsqueda hasta julio 2018; comprobar si existe actualización.
7. **Black cohosh (Cimicifuga spp.) for menopausal symptoms.** Leach MJ, Moore V. *Cochrane Database Syst Rev* 2012;(9):CD007244. DOI 10.1002/14651858.CD007244.pub2 — Tipo: RS Cochrane. Población: mujeres peri/posmenopáusicas (16 estudios). Punto: evidencia insuficiente para apoyar su uso; seguridad no concluyente por mal reporte. Limitaciones: 2012; NCCIH cita una revisión de 2023 con resultados algo más favorables (por verificar).
8. **Black Cohosh** y **Chasteberry** — NCCIH. https://www.nccih.nih.gov/health/black-cohosh · https://www.nccih.nih.gov/health/chasteberry — Tipo: fichas. Punto: cimicífuga con evidencia inconsistente y casos raros de daño hepático; vitex con posible beneficio en SPM/mastalgia, precaución en embarazo/lactancia, cánceres hormonodependientes y fármacos dopaminérgicos. Limitaciones: fichas divulgativas; leer las RS citadas.

Fuentes adicionales verificadas: NIH ODS *Omega-3 Fatty Acids — Health Professional Fact Sheet*, https://ods.od.nih.gov/factsheets/Omega3FattyAcids-HealthProfessional/ ; NIH ODS *Vitamin B12 — Health Professional Fact Sheet*, https://ods.od.nih.gov/factsheets/Vitaminb12-HealthProfessional/ .

---

## 6. `habit` — Hábitos / Lifestyle & habits

**Objetivo del macrotema:** prescribir sueño, ejercicio y reducción de tóxicos con evidencia, abordar estrés y salud mental con derivación cuando corresponda, y dominar técnicas de cambio de conducta, **sin culpabilizar** (ni por infertilidad ni por "no relajarse").

| id | Título ES / EN | Objetivo de aprendizaje | Prerreq. | Nivel | Tags | Alias |
|---|---|---|---|---|---|---|
| `habit.sleep` | Sueño: higiene, insomnio y TCC-I / Sleep, insomnia & CBT-I | Evaluar el sueño y ofrecer TCC-I como primera línea del insomnio crónico. | — | B | Hb | TCC-I, CBT-I, insomnio, higiene del sueño |
| `habit.shift-circadian` | Turnos y disrupción circadiana / Shift work & circadian disruption | Explicar asociaciones de trabajo a turnos con ciclo y salud metabólica y estrategias de mitigación. | `habit.sleep`, `horm.circadian-endocrine` | I | Hb, H | trabajo nocturno, jet lag social, cronodisrupción |
| `habit.stress` | Estrés: fisiología y abordajes con evidencia / Stress management | Elegir intervenciones (mindfulness, TCC, actividad física) por evidencia, no por moda. | `horm.adrenal-hpa` | I | Hb | MBSR, mindfulness, estrés crónico |
| `habit.mental-health` | Salud mental en ginecología: cribado y derivación / Mental health screening | Cribar depresión, ansiedad y riesgo suicida y derivar. | — | I | Hb | PHQ-9, GAD-7, depresión, ansiedad |
| `habit.exercise` | Ejercicio aeróbico y de fuerza / Exercise prescription | Prescribir actividad física según guías, incluida fuerza. | — | B | Hb | actividad física, fuerza, resistance training |
| `habit.exercise-excess` | Exceso de ejercicio / Excess exercise | Reconocer ejercicio excesivo con LEA y su repercusión menstrual y ósea. | `habit.exercise`, `nutr.energy-availability` | I | Hb, H | sobreentrenamiento, ejercicio compulsivo |
| `habit.tobacco` | Tabaco y vapeo / Tobacco & vaping | Ofrecer intervención breve y tratamiento según guías, incluido embarazo. | — | B | Hb, R | tabaquismo, cigarrillo electrónico, vapeo |
| `habit.alcohol` | Alcohol / Alcohol | Cribar consumo y dar consejo breve, incluido preconcepción. | — | B | Hb, R | AUDIT-C, consumo de riesgo |
| `habit.caffeine` | Cafeína / Caffeine | Valorar evidencia en ansiedad, sueño, fertilidad y embarazo. | — | B | Hb, R | café, cafeína |
| `habit.cannabis-other` `[añadido]` | Cannabis y otras sustancias / Cannabis & other substances | Abordar uso de cannabis (incluido CBD) en dolor, sueño, fertilidad y embarazo. Motivo: uso creciente para dolor pélvico y náuseas. | `habit.alcohol` | I | Hb, R | cannabis, CBD, THC |
| `habit.motivational-interviewing` | Entrevista motivacional / Motivational interviewing | Usar preguntas abiertas, reflejos y resumen para facilitar cambio. | — | I | Hb | EM, MI, OARS |
| `habit.behavior-change` | Adherencia, barreras y seguimiento / Behaviour change & follow-up | Planificar metas, anticipar barreras y programar seguimiento. | `habit.motivational-interviewing` | I | Hb | adherencia, hábitos, SMART goals |
| `habit.non-blaming` | Comunicación sin culpabilizar / Non-blaming communication | Evitar mensajes que atribuyan infertilidad o síntomas a "estrés" o "no relajarse". | `habit.motivational-interviewing` | B | Hb, R | estigma, culpa, "relájate y te quedarás" |
| `habit.digital-tracking` `[añadido]` | Apps de ciclo y wearables / Cycle apps & wearables | Valorar precisión, utilidad y privacidad de apps y dispositivos. Motivo: muy usados por pacientes; privacidad de datos reproductivos. | `menst.normal-cycle` | I | Hb, R | apps de ciclo, wearables, temperatura basal, privacidad |

**Enlaces transversales:** `habit.non-blaming` → `fert.mental-health`; `habit.tobacco`, `habit.alcohol`, `habit.caffeine` → `fert.preconception`, `preg.medication-safety`.

### Fuentes clave — `habit` (verificadas; acceso 2026-10-12)

1. **World Health Organization 2020 guidelines on physical activity and sedentary behaviour.** Bull FC et al. *Br J Sports Med* 2020;54:1451-1462. DOI 10.1136/bjsports-2020-102955 · https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7719906/ — Tipo: guía OMS. Población: todas las edades; incluye embarazo/posparto y enfermedades crónicas. Punto: objetivos de actividad aeróbica semanal, fuerza para todos los grupos de edad, reducir sedentarismo. Limitaciones: umbral de sedentarismo no cuantificable con la evidencia disponible.
2. **Recommended Amount of Sleep for a Healthy Adult: A Joint Consensus Statement of the AASM and Sleep Research Society.** Watson NF et al. *J Clin Sleep Med* 2015;11(6):591-592. https://pubmed.ncbi.nlm.nih.gov/25979105/ — Tipo: consenso (método RAND). Población: adultos sanos. Punto: dormir de forma habitual por debajo del umbral recomendado se asocia a resultados adversos. Limitaciones: consenso basado en evidencia mayoritariamente observacional.
3. **Interventions for Tobacco Smoking Cessation in Adults, Including Pregnant Persons: USPSTF Recommendation Statement.** USPSTF, 2021. https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/tobacco-use-in-adults-and-pregnant-women-counseling-and-interventions — Tipo: recomendación. Población: adultos y embarazadas. Punto: intervención conductual (grado A) también en embarazo; evidencia insuficiente para farmacoterapia en embarazo y para cigarrillo electrónico. Limitaciones: la propia página indica que el tema está en actualización.
4. **A Meta-Analysis of Motivational Interviewing: Twenty-Five Years of Empirical Studies.** Lundahl BW, Kunz C, Brownell C, Tollefson D, Burke BL. *Res Soc Work Pract* 2010;20(2):137-160. DOI 10.1177/1049731509347850 — Tipo: metaanálisis (119 estudios). Población: conductas de salud y consumo. Punto: efecto pequeño y duradero frente a comparadores débiles; no superior a tratamientos específicos. Limitaciones: heterogeneidad; poco específico de ginecología.
5. **ACOG Committee Opinion No. 804: Physical Activity and Exercise During Pregnancy and the Postpartum Period.** ACOG. *Obstet Gynecol* 2020;135(4):e178-e188. — Confirmado vía https://opqic.org/acog-committee-opinion-no-804-physical-activity-and-exercise-during-pregnancy-and-the-postpartum-period/ — Tipo: opinión de comité. Ver `preg`.

---

## 7. `pcos` — SOP y ovulación / PCOS & ovulation

**Objetivo del macrotema:** diagnóstico correcto (incluidos adolescentes), manejo de hiperandrogenismo, metabolismo, riesgo CV, sueño y salud mental, y tratamiento integrado (estilo de vida, suplementos con su evidencia, fármacos e inducción de ovulación) alineado con la guía internacional 2023.

| id | Título ES / EN | Objetivo de aprendizaje | Prerreq. | Nivel | Tags | Alias |
|---|---|---|---|---|---|---|
| `pcos.diagnosis-criteria` | Criterios diagnósticos y diferenciales / Diagnostic criteria & differentials | Aplicar los criterios vigentes y excluir hiperplasia suprarrenal no clásica, tiroides, hiperprolactinemia, AHF. | `horm.androgens-shbg`, `horm.folliculogenesis-ovulation` | B | H, R | SOP, PCOS, síndrome de ovario poliquístico, síndrome de Stein-Leventhal, criterios de Rotterdam, NIH 1990, AE-PCOS; cambio de nombre en discusión (ver §20) |
| `pcos.amh-ultrasound` | AMH y ecografía en el diagnóstico / AMH & ultrasound | Conocer cuándo AMH puede sustituir a la ecografía y sus límites. | `pcos.diagnosis-criteria` | I | H, R | hormona antimülleriana, AMH, recuento de folículos, PCOM |
| `pcos.adolescents` | SOP en adolescentes / PCOS in adolescents | Aplicar criterios específicos y la categoría "en riesgo". | `pcos.diagnosis-criteria` | I | H | SOP adolescente, "at risk" PCOS |
| `pcos.hyperandrogenism` | Hiperandrogenismo clínico y bioquímico / Clinical & biochemical hyperandrogenism | Evaluar hirsutismo, acné y alopecia y tratar con opciones escalonadas. | `pcos.diagnosis-criteria` | I | H | hirsutismo, Ferriman-Gallwey, acné, alopecia androgénica |
| `pcos.metabolic` | Metabolismo y resistencia a la insulina / Metabolic features | Cribar disglucemia y dislipemia según guía, sin pruebas de insulina de rutina. | `horm.insulin-leptin` | I | H, D | RI, HOMA-IR, SOG, prediabetes |
| `pcos.cardiovascular` | Riesgo cardiovascular / Cardiovascular risk | Estimar y comunicar riesgo CV a lo largo de la vida. | `pcos.metabolic` | I | H | riesgo CV, hipertensión, dislipemia |
| `pcos.sleep-osa` | Sueño y apnea obstructiva / Sleep & OSA | Cribar síntomas de apnea y trastornos del sueño. | `habit.sleep` | I | Hb | AOS, SAHS, OSA |
| `pcos.mental-health` | Salud mental, imagen corporal y TCA / Mental health & body image | Cribar depresión, ansiedad, imagen corporal y TCA. | `habit.mental-health`, `nutr.eating-disorders` | I | Hb | depresión, ansiedad, TCA, imagen corporal |
| `pcos.diet` | Alimentación en SOP / Diet in PCOS | Aplicar la guía: ningún patrón específico superior; centrarse en calidad, adherencia y sin estigma. | `nutr.mediterranean`, `nutr.obesity-no-stigma` | I | D | dieta SOP, low-GI, dieta antiinflamatoria |
| `pcos.exercise` | Ejercicio en SOP / Exercise in PCOS | Prescribir actividad aeróbica y de fuerza según guía. | `habit.exercise` | I | Hb | ejercicio, HIIT |
| `pcos.supplements` | Suplementos en SOP / Supplements in PCOS | Evaluar inositol y otros con la evidencia de la guía y de RS. | `supp.inositols`, `supp.principles` | A | S | inositol, berberina, NAC, vitamina D, omega-3, espironolactona "natural" |
| `pcos.conventional` | Tratamiento farmacológico / Pharmacological treatment | Usar AHC, metformina, antiandrógenos y fármacos antiobesidad según objetivos. | `horm.endocrine-pharmacology` | I | H | anticonceptivos, metformina, espironolactona, GLP-1 RA |
| `pcos.endometrial-protection` `[añadido]` | Protección endometrial y riesgo de cáncer de endometrio / Endometrial protection | Asegurar protección endometrial en oligo-amenorrea crónica. Motivo: riesgo oncológico no listado explícitamente. | `pcos.conventional`, `menst.endometrial-hyperplasia` | I | H | hiperplasia endometrial, progestágeno cíclico, DIU-LNG |
| `pcos.ovulation-induction` | Inducción de la ovulación / Ovulation induction | Conocer letrozol como primera línea y alternativas; enlazar con fertilidad. | `pcos.conventional` | A | R, H | letrozol, clomifeno, gonadotropinas, drilling ovárico |
| `pcos.lifelong` `[añadido]` | SOP a lo largo de la vida / PCOS across the lifespan | Planificar embarazo (DMG, HTA), lactancia y transición menopáusica en SOP. Motivo: continuidad asistencial. | `pcos.metabolic` | A | H, R | SOP y embarazo, SOP y menopausia |
| `pcos.cases` | Casos integrados de SOP / PCOS cases | Resolver casos con diferenciales, analíticas, plan integrado y seguimiento. | todos `pcos.*` | A | H, D, S, Hb, R | casos SOP |

**Enlaces transversales:** `pcos.ovulation-induction` → `fert.ovulation-induction`, `fert.ohss`; `pcos.supplements` → `fert.supplements-female`; `pcos.metabolic` → `thyr.insulin-resistance`, `thyr.liver-masld`.

### Fuentes clave — `pcos` (verificadas; acceso 2026-10-12)

1. **Recommendations from the 2023 International Evidence-based Guideline for the Assessment and Management of Polycystic Ovary Syndrome.** Teede HJ, Tay CT, Laven JJE et al. (Monash CRE WHiRL con ASRM, Endocrine Society, ESE, ESHRE). *Fertil Steril* 2023;120(4):767-793; también *Hum Reprod* 2023;38(9):1655-1679 (copia OA: https://orca.cardiff.ac.uk/id/eprint/162540/). Resumen ASRM: https://www.asrm.org/practice-guidance/practice-committee-documents/recommendations-from-the-2023-international-evidence-based-guideline-for-the-assessment-and-management-of-polycystic-ovary-syndrome — Tipo: guía internacional (GRADE, AGREE II, aprobada por NHMRC). Población: adolescentes y adultas con SOP. Punto: 254 recomendaciones y puntos de práctica; evidencia en general de calidad baja o muy baja. Limitaciones: mucha recomendación basada en consenso; comprobar actualizaciones parciales.
2. **International PCOS Guideline — página oficial y informe técnico.** Monash University / MCHRI. https://www.monash.edu/medicine/mchri/pcos/guideline (URL indicada en el resumen del MJA; acceso directo 403) · Informe técnico DOI 10.26180/23625288.v1 — Tipo: guía + informe técnico con toda la evidencia. Limitaciones: no se pudo abrir la página; confirmar traducciones al español disponibles.
3. **Summary of the 2023 International Evidence-based Guideline for the Assessment and Management of PCOS.** *Med J Aust* 2024;221(7). https://www.mja.com.au/journal/2024/221/7/summary-2023-international-evidence-based-guideline-assessment-and-management — Tipo: resumen de guía. Uso: lectura breve para tarjetas. Limitaciones: autores/páginas por confirmar.
4. **Inositol for subfertile women with PCOS** (Cochrane 2018). Ver `supp`, fuente 6.

---

## 8. `menst` — Trastornos menstruales / Menstrual disorders

**Objetivo del macrotema:** evaluar con nomenclatura FIGO y PALM-COEIN amenorrea, oligomenorrea, SUA, sangrado abundante con ferropenia, dismenorrea, SPM/TDPM e hiperprolactinemia; integrar causas funcionales (energía, estrés) con estructurales y endocrinas.

| id | Título ES / EN | Objetivo de aprendizaje | Prerreq. | Nivel | Tags | Alias |
|---|---|---|---|---|---|---|
| `menst.normal-cycle` | Ciclo normal y menstruación como signo vital / Normal cycle & menstruation as vital sign | Usar parámetros FIGO de normalidad y preguntar por el ciclo sistemáticamente. | `horm.hpo-axis` | B | H | FIGO AUB System 1, ciclo menstrual normal |
| `menst.amenorrhea-workup` | Amenorrea y oligomenorrea: evaluación / Amenorrhoea & oligomenorrhoea work-up | Seguir un algoritmo (embarazo, PRL, TSH, FSH, andrógenos, imagen) según contexto. | `menst.normal-cycle`, `horm.lab-timing` | I | H, R | amenorrea primaria/secundaria, oligomenorrea, oligoamenorrea |
| `menst.fha` | Amenorrea hipotalámica funcional / Functional hypothalamic amenorrhoea | Diagnosticar por exclusión y tratar con abordaje multidisciplinar (energía, estrés, ejercicio, hueso). | `menst.amenorrhea-workup`, `nutr.energy-availability` | I | H, D, Hb, R | AHF, FHA, amenorrea de la deportista, amenorrea por estrés |
| `menst.aub-palm-coein` | Sangrado uterino anormal: PALM-COEIN / AUB: PALM-COEIN | Clasificar causas estructurales y no estructurales. | `menst.normal-cycle` | I | H | SUA, AUB, PALM-COEIN; términos abandonados: menorragia, metrorragia, menometrorragia, hemorragia uterina disfuncional |
| `menst.hmb-iron` | Sangrado menstrual abundante y ferropenia / Heavy menstrual bleeding & iron deficiency | Evaluar impacto, cribar ferropenia y tratar escalonadamente. | `menst.aub-palm-coein` | I | H, S | SMA, HMB, menorragia (antiguo), ferropenia sin anemia |
| `menst.bleeding-disorders` `[añadido]` | Coagulopatías / Bleeding disorders | Sospechar von Willebrand y otras ante SMA desde la menarquia. Motivo: la "C" de PALM-COEIN infra-diagnosticada. | `menst.hmb-iron` | I | H | enfermedad de von Willebrand, coagulopatía |
| `menst.endometrial-hyperplasia` `[añadido]` | Hiperplasia endometrial y cuándo biopsiar / Endometrial hyperplasia | Indicar evaluación endometrial por riesgo (edad, anovulación, obesidad). Motivo: seguridad en planes "funcionales". | `menst.aub-palm-coein` | I | H | hiperplasia, biopsia endometrial, EIN |
| `menst.dysmenorrhea` | Dismenorrea primaria y secundaria / Dysmenorrhoea | Tratar dismenorrea primaria y reconocer cuándo buscar causa secundaria. | `menst.normal-cycle` | B | H, S | dolor menstrual, dismenorrea primaria/secundaria |
| `menst.pms-pmdd` | SPM y TDPM / PMS & PMDD | Diagnosticar con registro prospectivo y tratar según guía. | `menst.normal-cycle`, `habit.mental-health` | I | H, Hb, S | SPM, PMS, TDPM, PMDD, DRSP, trastorno disfórico premenstrual |
| `menst.pme` `[añadido]` | Exacerbación premenstrual y trastornos catameniales / Premenstrual exacerbation & catamenial disorders | Reconocer PME de depresión, migraña menstrual, epilepsia catamenial. Motivo: diferencial de TDPM. | `menst.pms-pmdd` | A | H | PME, migraña menstrual, epilepsia catamenial |
| `menst.hyperprolactinemia` | Hiperprolactinemia / Hyperprolactinaemia | Evaluar causas (fármacos, macroprolactina, adenoma) y cuándo tratar. | `horm.prolactin-oxytocin` | I | H, R | hiperprolactinemia, prolactinoma, macroprolactinemia |
| `menst.endocrine-eval` | Evaluación endocrina de la disfunción ovulatoria / Endocrine evaluation of ovulatory dysfunction | Integrar TSH, PRL, FSH/LH, estradiol y andrógenos según presentación. | `menst.amenorrhea-workup` | I | H | disfunción ovulatoria, AUB-O |
| `menst.structural` | Causas estructurales / Structural causes | Identificar pólipos, miomas, adenomiosis y malignidad con imagen adecuada. | `menst.aub-palm-coein` | I | H | pólipo endometrial, mioma, adenomiosis, histeroscopia |
| `menst.followup` | Seguimiento y registros / Follow-up & tracking | Usar diarios de sangrado/síntomas y criterios de reevaluación. | `menst.normal-cycle` | B | Hb | diario menstrual, PBAC |

**Enlaces transversales:** `menst.fha` → `fert.ovulation`, `meno.bone`; `menst.hyperprolactinemia` → `fert.ovulation`; `menst.hmb-iron` → `supp.iron`, `endo.bleeding-iron`.

### Fuentes clave — `menst` (verificadas; acceso 2026-10-12)

1. **The two FIGO systems for normal and abnormal uterine bleeding symptoms and classification of causes of abnormal uterine bleeding in the reproductive years: 2018 revisions.** Munro MG, Critchley HOD, Fraser IS (FIGO Menstrual Disorders Committee). *Int J Gynaecol Obstet* 2018;143(3):393-408. DOI 10.1002/ijgo.12666 · https://pubmed.ncbi.nlm.nih.gov/30198563/ — Tipo: sistema de clasificación por consenso (Delphi modificado). Punto: nomenclatura de síntomas (Sistema 1) y PALM-COEIN (Sistema 2). Limitaciones: consenso; revisiones periódicas previstas.
2. **Heavy menstrual bleeding: assessment and management (NICE NG88).** NICE, 2018 (revisiones posteriores; la página indica revisión 2026). https://www.nice.org.uk/guidance/ng88 — Tipo: guía. Población: mujeres con SMA. Punto: definición centrada en calidad de vida; tratamiento farmacológico posible sin exploración si no hay síntomas asociados. Limitaciones: según la búsqueda, en 2026 se retiró una recomendación sobre ferritina: leer la versión vigente antes de redactar.
3. **ACOG Practice Bulletin No. 128: Diagnosis of Abnormal Uterine Bleeding in Reproductive-Aged Women.** ACOG. *Obstet Gynecol* 2012;120(1):197-206. — Confirmado vía registro https://rrmacademy.org/library/practice-bulletin-no-128-diagnosis-of-abnormal-uterine-bleeding-in-reproductive--recln1h2p1wjzmqua/ — Tipo: boletín de práctica. Punto: adopta PALM-COEIN. Limitaciones: 2012; manejo de AUB-O en boletín 136 (2013); comprobar vigencia en acog.org.
4. **Management of Premenstrual Disorders: ACOG Clinical Practice Guideline No. 7.** ACOG. *Obstet Gynecol* 2023;142(6):1516-1533. DOI 10.1097/AOG.0000000000005426 — Tipo: guía. Población: adultas y adolescentes. Punto: diagnóstico con registro prospectivo de al menos dos ciclos; ISRS y TCC con evidencia al menos moderada. Limitaciones: detalles de recomendaciones complementarias por confirmar en texto completo.
5. **Functional Hypothalamic Amenorrhea: An Endocrine Society Clinical Practice Guideline.** Gordon CM et al. *J Clin Endocrinol Metab* 2017;102(5):1413-1439. PMID 28368518 · https://www.endocrine.org/clinical-practice-guidelines/hypothalamic-amenorrhea — Tipo: guía (GRADE). Población: adolescentes y adultas. Punto: diagnóstico de exclusión; abordaje multidisciplinar (médico, dietético, salud mental); tratamiento de fertilidad específico. Limitaciones: 2017; no se encontró actualización.
6. **Diagnosis and treatment of hyperprolactinemia: an Endocrine Society clinical practice guideline.** Melmed S et al. *J Clin Endocrinol Metab* 2011;96(2):273-288. DOI 10.1210/jc.2010-1692 · https://www.endocrine.org/clinical-practice-guidelines/hyperprolactinemia — Tipo: guía (GRADE). Punto: una sola determinación de PRL bien extraída; no usar pruebas dinámicas; manejo de causa farmacológica y prolactinoma, incluido embarazo. Limitaciones: 2011; existen consensos posteriores (Pituitary Society) por verificar.
7. **ACOG Committee Opinion No. 760: Dysmenorrhea and Endometriosis in the Adolescent.** ACOG. *Obstet Gynecol* 2018;132(6):e249-e258. https://pubmed.ncbi.nlm.nih.gov/30461694/ — Tipo: opinión de comité. Población: adolescentes. Punto: tratamiento empírico de dismenorrea primaria; si no mejora en 3-6 meses, buscar causa secundaria (endometriosis principal). Limitaciones: reafirmación posterior mencionada por BMJ Best Practice, no confirmada en acog.org.

---

## 9. `endo` — Endometriosis, adenomiosis, miomas y dolor / Endometriosis, adenomyosis, fibroids & pain

**Objetivo del macrotema:** diagnóstico sin depender exclusivamente de laparoscopia, manejo del dolor (incluido nociplástico) y de sus esferas intestinal, vesical y de suelo pélvico, sangrado y ferropenia, nutrición y suplementos con su evidencia real, opciones médicas/quirúrgicas y reproducción.

| id | Título ES / EN | Objetivo de aprendizaje | Prerreq. | Nivel | Tags | Alias |
|---|---|---|---|---|---|---|
| `endo.pathophysiology` | Fisiopatología e hipótesis / Pathophysiology | Distinguir teorías (menstruación retrógrada, metaplasia, inflamación, progesterona-resistencia) por nivel de evidencia. | `horm.estrogens` | I | H | teoría de Sampson, resistencia a progesterona |
| `endo.diagnosis` | Diagnóstico clínico y por imagen / Clinical & imaging diagnosis | Diagnosticar con historia, exploración y ecografía/RM sin esperar a la cirugía. | `endo.pathophysiology` | I | H, R | endometrioma, endometriosis profunda (DIE), rASRM, #Enzian, AAGL |
| `endo.adolescents` | Endometriosis en adolescentes / Adolescent endometriosis | Reconocer presentación y lesiones atípicas en adolescentes. | `menst.dysmenorrhea` | I | H | endometriosis adolescente |
| `endo.pain-mechanisms` | Mecanismos del dolor y sensibilización central / Pain mechanisms | Diferenciar dolor nociceptivo, neuropático y nociplástico y su implicación terapéutica. | `endo.diagnosis` | A | Hb | nociplástico, sensibilización central, hiperalgesia visceral |
| `endo.chronic-pelvic-pain` `[añadido]` | Dolor pélvico crónico multimodal / Chronic pelvic pain | Abordar dolor pélvico crónico más allá de la endometriosis (vejiga, músculo, nervio). Motivo: spec 02 cita "dolor" sin desarrollarlo. | `endo.pain-mechanisms` | A | Hb | DPC, CPP, cistitis intersticial/síndrome de vejiga dolorosa, neuralgia del pudendo |
| `endo.bowel-bladder-pelvic-floor` | Intestino, vejiga y suelo pélvico / Bowel, bladder & pelvic floor | Integrar síntomas digestivos, urinarios y miofasciales con derivación a fisioterapia. | `gut.endometriosis-gi`, `gut.pelvic-floor-defecation` | I | G, Hb | suelo pélvico, fisioterapia pélvica, disquecia, disuria |
| `endo.bleeding-iron` | Sangrado y ferropenia / Bleeding & iron | Tratar SMA y ferropenia asociadas. | `menst.hmb-iron` | I | H, S | ferropenia, SMA |
| `endo.nutrition` | Nutrición en endometriosis / Nutrition in endometriosis | Evaluar evidencia (limitada) de patrones dietéticos y low-FODMAP para síntomas digestivos. | `nutr.mediterranean`, `nutr.low-fodmap` | I | D, G | dieta antiinflamatoria, sin gluten, low-FODMAP |
| `endo.supplements` | Suplementos en endometriosis / Supplements in endometriosis | Valorar antioxidantes, omega-3, PEA, cúrcuma con su certeza real. | `supp.botanicals-other`, `supp.omega3` | A | S | antioxidantes, vitamina C/E, PEA, NAC |
| `endo.medical` | Tratamiento médico hormonal / Hormonal medical therapy | Elegir AHC, progestágenos, DIU-LNG, GnRH con add-back según objetivos. | `horm.endocrine-pharmacology` | I | H | dienogest, GnRH-a, antagonistas GnRH, add-back |
| `endo.surgical` | Cirugía y derivación / Surgery & referral | Conocer indicaciones, riesgos y centros de referencia. | `endo.diagnosis` | A | R | laparoscopia, escisión, endometrioma |
| `endo.reproduction` | Endometriosis y reproducción / Endometriosis & reproduction | Enlazar con estrategias de fertilidad (cirugía vs TRA). | `endo.surgical` | A | R | endometriosis e infertilidad |
| `endo.adenomyosis` | Adenomiosis / Adenomyosis | Diagnosticar por imagen y tratar SMA/dolor y su impacto reproductivo. | `endo.diagnosis` | I | H, R | adenomiosis, MUSA |
| `endo.fibroids` | Miomas / Fibroids | Clasificar (FIGO 0-8) y elegir manejo médico, procedimental o quirúrgico. | `menst.structural` | I | H, R | leiomiomas, fibromas, miomas uterinos, FIGO leiomyoma classification |
| `endo.complementary-limits` | Límites de intervenciones complementarias / Limits of complementary interventions | Evaluar acupuntura, TENS, fisioterapia, psicología y dieta por evidencia. | `found.evidence-grading` | I | Hb, S | acupuntura, TENS, mindfulness, terapias complementarias |
| `endo.cancer-risk` `[añadido]` | Riesgo oncológico asociado / Associated cancer risk | Comunicar el riesgo (bajo en absoluto) de cáncer de ovario y su seguimiento. Motivo: preocupación frecuente de pacientes; ESHRE lo aborda. | `endo.diagnosis`, `found.shared-decision` | A | H | cáncer de ovario de células claras/endometrioide |
| `endo.mental-health` `[añadido]` | Salud mental y calidad de vida / Mental health & quality of life | Cribar y abordar impacto psicológico y sexual. Motivo: carga elevada y omitida en spec 02. | `habit.mental-health` | I | Hb | calidad de vida, dispareunia, depresión |

**Enlaces transversales:** `endo.reproduction` → `fert.endometriosis`; `endo.adenomyosis`, `endo.fibroids` → `fert.uterine-factor`; `endo.bowel-bladder-pelvic-floor` → `vulv.dyspareunia-pelvic-floor`.

### Fuentes clave — `endo` (verificadas; acceso 2026-10-12)

1. **ESHRE guideline: endometriosis.** Becker CM et al. *Hum Reprod Open* 2022;2022(2):hoac009. DOI 10.1093/hropen/hoac009 · https://pubmed.ncbi.nlm.nih.gov/35350465/ · PMC8951218 — Tipo: guía. Población: adolescentes, adultas, posmenopáusicas. Punto: 109 recomendaciones; cuestiona la laparoscopia/histología como "patrón oro" único; evidencia escasa para endometriosis asintomática y extrapélvica; trata la asociación con cáncer. Limitaciones: búsqueda hasta diciembre 2020.
2. **Endometriosis: diagnosis and management (NICE NG73).** NICE, 2017; actualizado abril 2024 (cirugía con prioridad de fertilidad) y noviembre 2024 (diagnóstico). https://www.nice.org.uk/guidance/ng73 — Tipo: guía. Punto: ecografía transvaginal ofrecida desde atención primaria ante sospecha. Limitaciones: contexto NHS.
3. **Management of Symptomatic Uterine Leiomyomas: ACOG Practice Bulletin No. 228.** ACOG. *Obstet Gynecol* 2021;137(6):e100-e115. DOI 10.1097/AOG.0000000000004401 — Tipo: boletín de práctica. Punto: recomendaciones por síntoma ante falta de evidencia comparativa; opciones que preservan el útero. Limitaciones: confirmar vigencia; un resumen secundario procede de un fabricante (COI).
4. **ACOG Committee Opinion No. 760** (dismenorrea y endometriosis en adolescentes). Ver `menst`, fuente 7.

Por verificar en este macrotema (ver §20): revisiones sistemáticas de dieta/suplementos en endometriosis (2024-2026).

---

## 10. `thyr` — Tiroides, autoinmunidad y metabolismo / Thyroid, autoimmunity & metabolism

**Objetivo del macrotema:** interpretar disfunción tiroidea manifiesta y subclínica, autoinmunidad y sus límites, cribado justificado de celiaquía, diabetes, resistencia a insulina y MASLD, y coordinar con endocrinología, con especial atención a preconcepción y embarazo.

| id | Título ES / EN | Objetivo de aprendizaje | Prerreq. | Nivel | Tags | Alias |
|---|---|---|---|---|---|---|
| `thyr.overt` | Hipo e hipertiroidismo manifiestos / Overt thyroid disease | Diagnosticar y tratar disfunción manifiesta y conocer interacciones de levotiroxina. | `horm.thyroid-axis` | B | H | hipotiroidismo, hipertiroidismo, Graves, levotiroxina |
| `thyr.subclinical` | Hipotiroidismo subclínico / Subclinical hypothyroidism | Decidir cuándo tratar según edad, TSH, síntomas y deseo gestacional. | `thyr.overt` | I | H, R | HSC, SCH, TSH elevada con T4L normal |
| `thyr.antibodies` | Anticuerpos tiroideos y sus límites / Thyroid antibodies | Interpretar anti-TPO en eutiroidea y no tratar el anticuerpo aislado sin indicación. | `thyr.subclinical` | I | H, R | Hashimoto, tiroiditis autoinmune, anti-TPO, TPOAb |
| `thyr.t3-combination` | T3, rT3 y terapia combinada / T3, reverse T3 & combination therapy | Evaluar evidencia de T4+T3 y por qué la rT3 no guía tratamiento. | `thyr.overt` | A | H | T3 reversa, rT3, liotironina, tiroides desecada |
| `thyr.pregnancy-preconception` | Tiroides en preconcepción, embarazo y posparto / Thyroid in preconception, pregnancy & postpartum | Aplicar la guía ATA vigente y rangos específicos de trimestre. | `thyr.subclinical`, `thyr.antibodies` | A | H, R | tiroides y embarazo, tiroiditis posparto, hipotiroxinemia |
| `thyr.iodine-selenium` | Yodo, selenio y tiroides / Iodine, selenium & thyroid | Valorar suplementación de yodo en embarazo y selenio en autoinmunidad. | `supp.iodine`, `supp.selenium` | I | S | yodo, selenio |
| `thyr.celiac-autoimmunity` | Celiaquía y autoinmunidad: cuándo cribar / Coeliac screening in autoimmunity | Indicar serología de celiaquía en contextos justificados. | `gut.celiac` | I | G | poliautoinmunidad, cribado de celiaquía |
| `thyr.autoimmune-diets` `[añadido]` | Dietas y protocolos "autoinmunes" / Autoimmune protocol diets | Evaluar evidencia (escasa) de dieta AIP, sin gluten en Hashimoto. Motivo: muy promovidas en medicina funcional. | `thyr.antibodies`, `nutr.elimination-diets` | A | D | AIP, autoimmune protocol, sin gluten en Hashimoto |
| `thyr.diabetes` | Diabetes y prediabetes / Diabetes & prediabetes | Diagnosticar con criterios estándar y coordinar tratamiento. | — | B | H, D | DM2, prediabetes, HbA1c |
| `thyr.insulin-resistance` | Resistencia a la insulina: medición y límites / Insulin resistance: measurement & limits | Explicar por qué HOMA-IR e insulina basal tienen utilidad clínica limitada. | `horm.insulin-leptin` | I | H, D | RI, HOMA-IR, insulinemia, clamp |
| `thyr.metabolic-syndrome` `[añadido]` | Síndrome metabólico y riesgo CV en la mujer / Metabolic syndrome & CV risk | Integrar factores de riesgo específicos femeninos (SOP, DMG, preeclampsia, menopausia precoz). Motivo: visión de riesgo a lo largo de la vida. | `thyr.diabetes` | I | H | síndrome metabólico, riesgo CV femenino |
| `thyr.liver-masld` | Hígado graso: MASLD / Steatotic liver disease | Usar nomenclatura vigente y criterios cardiometabólicos. | `thyr.metabolic-syndrome` | I | G, D | MASLD, MASH, MetALD; antiguos: NAFLD, NASH, EHGNA, MAFLD, hígado graso |
| `thyr.tests-justified` | Pruebas justificadas vs paneles amplios / Justified testing | Elegir pruebas que cambian conducta y evitar paneles extensos. | `found.overdiagnosis` | I | H | panel tiroideo completo, cribado |
| `thyr.endocrine-coordination` | Coordinación con endocrinología / Endocrine co-management | Definir criterios de derivación y comunicación interprofesional. | `thyr.overt` | B | H | derivación, interconsulta |

**Enlaces transversales:** `thyr.pregnancy-preconception` → `fert.preconception`, `preg.medication-safety`; `thyr.antibodies` → `fert.rpl` (pérdida gestacional recurrente).

### Fuentes clave — `thyr` (verificadas; acceso 2026-10-12)

1. **American Thyroid Association 2026 Guidelines for Thyroid Disease in Preconception, Pregnancy, and Postpartum.** ATA. *Thyroid* 2026;36(5):481-544. DOI 10.1177/10507256261445624 · copia OA: https://escholarship.org/uc/item/0pw091c0 — Tipo: guía (GRADE + declaraciones de buena práctica). Población: mujeres con infertilidad, embarazadas, posparto/lactancia. Punto: cubre pruebas de función tiroidea, yodo, autoinmunidad, hipotiroidismo, hipotiroxinemia, Graves, nódulos y posparto. Limitaciones: publicada en 2026, sustituye a la guía ATA 2017; recomendaciones concretas no leídas aún.
2. **Thyroid disease: assessment and management (NICE NG145).** NICE, 2019 (actualizado 2023; vigilancia excepcional octubre 2025 sin cambios). https://www.nice.org.uk/guidance/ng145 — Tipo: guía. Población: adultos y niños (excluye embarazo y cáncer). Punto: TSH como prueba inicial; anti-TPO una sola vez en subclínico; levotiroxina en monoterapia; no se halló evidencia suficiente para cambiar recomendaciones sobre liotironina. Limitaciones: contexto NHS.
3. **2013 ETA Guideline: Management of Subclinical Hypothyroidism.** Pearce SHS et al. *Eur Thyroid J* 2013. https://pmc.ncbi.nlm.nih.gov/articles/PMC3923601 — Tipo: guía. Población: adultos no embarazados. Punto: estratifica TSH moderadamente elevada vs más elevada y edad para decidir tratamiento. Limitaciones: 2013.
4. **Subclinical hypothyroidism in the infertile female population: a guideline.** ASRM Practice Committee. *Fertil Steril* 2024;121:765-782. https://www.asrm.org/practice-guidance/practice-committee-documents/subclinical-hypothyroidism-in-the-infertile-female-population-a-guideline/ — Tipo: guía. Población: mujeres infértiles o que buscan embarazo. Punto: persiste debate sobre definición y umbrales de cribado/tratamiento. Limitaciones: texto completo no leído; sustituye a la versión 2015.
5. **A multisociety Delphi consensus statement on new fatty liver disease nomenclature.** Rinella ME et al. *J Hepatol* 2023;79:1542-1556 (copublicado en *Hepatology*). — Confirmado vía repositorios (p. ej., https://archive-ouverte.unige.ch/unige:175356) — Tipo: consenso Delphi. Punto: MASLD sustituye a NAFLD; requiere al menos un factor cardiometabólico; nueva categoría MetALD. Limitaciones: nomenclatura, no guía terapéutica; DOI por confirmar.
6. **ACG celiac guideline 2023** — ver `gut`, fuente 3.

---

## 11. `vulv` — Salud vulvovaginal, sexual y anticoncepción / Vulvovaginal & sexual health, contraception

**Objetivo del macrotema:** tratar vaginitis y su recurrencia, dolor vulvar y sexual, disfunciones sexuales, suelo pélvico, anticoncepción con criterios de elegibilidad, mitos sobre hormonas e ITS, incorporando microbiota cuando aporte.

| id | Título ES / EN | Objetivo de aprendizaje | Prerreq. | Nivel | Tags | Alias |
|---|---|---|---|---|---|---|
| `vulv.bv` | Vaginosis bacteriana / Bacterial vaginosis | Diagnosticar, tratar según guía y manejar recurrencia. | `gut.microbiota-vaginal` | B | G | VB, BV, *Gardnerella*, criterios de Amsel, Nugent |
| `vulv.candidiasis` | Candidiasis vulvovaginal y recurrente / VVC & recurrent VVC | Tratar episodio y recurrencia; identificar especies no *albicans*. | `gut.microbiota-vaginal` | B | G | CVV, VVC, RVVC, candidiasis recurrente |
| `vulv.trichomonas-aerobic` `[añadido]` | Tricomoniasis y vaginitis aeróbica/descamativa / Trichomoniasis & aerobic vaginitis | Completar el diferencial de flujo vaginal. Motivo: spec 02 cita solo VB/candidiasis. | `vulv.bv` | I | G | tricomoniasis, VA, aerobic vaginitis, vaginitis inflamatoria descamativa |
| `vulv.vaginal-microbiome-therapies` | Probióticos vaginales, LBP y trasplante de microbiota vaginal / Vaginal microbiome therapies | Evaluar ensayos de bioterapéuticos (p. ej., *L. crispatus*) y la falta de productos equivalentes comercializados. | `vulv.bv`, `gut.prebiotics-probiotics` | A | G, S | Lactin-V, *L. crispatus* CTV-05, VMT, probióticos vaginales |
| `vulv.recurrent-uti` `[añadido]` | ITU recurrente: prevención / Recurrent UTI prevention | Evaluar arándano, D-manosa, estrógeno vaginal y profilaxis. Motivo: consulta integrativa frecuente. | `meno.gsm` | I | S | cistitis recurrente, arándano rojo, D-manosa |
| `vulv.vulvodynia` | Vulvodinia y dolor vulvar / Vulvodynia & vulvar pain | Clasificar dolor vulvar (consenso 2015) y abordar multimodalmente. | `endo.pain-mechanisms` | I | Hb | vulvodinia, vestibulodinia provocada, vestibulitis (antiguo) |
| `vulv.dermatoses` `[añadido]` | Dermatosis vulvares / Vulvar dermatoses | Reconocer liquen escleroso y plano y su seguimiento. Motivo: diferencial del dolor/prurito vulvar. | `vulv.vulvodynia` | I | — | liquen escleroso (antiguo: liquen escleroatrófico, kraurosis), liquen plano |
| `vulv.sexual-function` | Función sexual y disfunciones / Sexual function & dysfunction | Evaluar deseo, excitación, orgasmo y dolor con modelos biopsicosociales. | `habit.mental-health` | I | H, Hb | TDSH, HSDD, FSIAD, disfunción sexual femenina |
| `vulv.dyspareunia-pelvic-floor` | Dispareunia y suelo pélvico / Dyspareunia & pelvic floor | Integrar fisioterapia de suelo pélvico y causas hormonales/inflamatorias. | `vulv.vulvodynia` | I | Hb | dispareunia, vaginismo (término en revisión), hipertonía del suelo pélvico |
| `vulv.testosterone-women` | Testosterona en mujeres / Testosterone in women | Aplicar la única indicación con evidencia (TDSH en posmenopausia) y su monitorización. | `horm.androgens-shbg`, `vulv.sexual-function` | A | H | testosterona transdérmica, andrógenos en mujeres |
| `vulv.contraception` | Anticoncepción y criterios de elegibilidad / Contraception & eligibility | Aplicar criterios de elegibilidad médica (MEC) y consejo centrado en la persona. | `horm.endocrine-pharmacology` | B | H, R | MEC, CME OMS, US MEC, AHC, LARC, DIU |
| `vulv.contraception-myths` | Mitos sobre anticoncepción hormonal / Hormonal contraception myths | Contrastar "síndrome post-píldora", "depleción de nutrientes" y fertilidad tras AHC con evidencia. | `vulv.contraception`, `found.causality` | I | H, S | síndrome post-píldora, post-pill syndrome, depleción de nutrientes |
| `vulv.contraception-mood-libido` `[añadido]` | Anticoncepción, ánimo y libido / Contraception, mood & libido | Interpretar evidencia observacional y ensayos sobre depresión y deseo. Motivo: preocupación frecuente y debate en redes. | `vulv.contraception` | I | H, Hb | depresión y anticonceptivos, libido |
| `vulv.fabm` `[añadido]` | Métodos basados en conocimiento de la fertilidad / Fertility awareness-based methods | Conocer eficacia por método y apps. Motivo: demanda en medicina "natural" y enlace con fertilidad. | `menst.normal-cycle`, `habit.digital-tracking` | I | R, Hb | FABM, PFN, NFP, método sintotérmico, Billings |
| `vulv.sti-prevention` | ITS: cribado, prevención y vacunación / STI screening & prevention | Aplicar cribado, tratamiento y prevención (VPH, PrEP) según guía. | — | B | R | ITS, ETS, STI, VPH/HPV, PrEP, clamidia, gonococo |

**Enlaces transversales:** `vulv.bv` → `fert.microbiome`; `vulv.fabm` → `fert.timing`; `vulv.contraception` → `preg.postpartum-contraception`, `nutr.antiobesity-pharm`.

### Fuentes clave — `vulv` (verificadas; acceso 2026-10-12)

1. **Sexually Transmitted Infections Treatment Guidelines, 2021.** Workowski KA et al. (CDC). *MMWR Recomm Rep* 2021;70(4):1-187. DOI 10.15585/mmwr.rr7004a1 · https://www.cdc.gov/mmwr/volumes/70/rr/rr7004a1.htm — Tipo: guía. Punto: tratamiento de VB, candidiasis, tricomoniasis, ITS; incluye erratas posteriores. Limitaciones: contexto EE. UU.; comprobar si hay actualización.
2. **2015 ISSVD, ISSWSH, and IPPS Consensus Terminology and Classification of Persistent Vulvar Pain and Vulvodynia.** Bornstein J, Goldstein AT, Stockdale CK et al. *Obstet Gynecol* 2016;127(4):745-751 (copublicado en *J Low Genit Tract Dis* y *J Sex Med*). DOI 10.1097/AOG.0000000000001359 · PMID 27008217 — Tipo: consenso terminológico. Punto: dolor vulvar por trastorno específico vs vulvodinia (≥3 meses sin causa identificable, con posibles factores asociados). Limitaciones: clasificación, no guía terapéutica.
3. **U.S. Medical Eligibility Criteria for Contraceptive Use, 2024.** CDC. *MMWR Recomm Rep* 2024;73(4):1-126. DOI 10.15585/mmwr.rr7304a1 · https://www.cdc.gov/mmwr/volumes/73/rr/rr7304a1.htm — Tipo: guía. Punto: sustituye a US MEC 2016; añade enfermedad renal crónica y revisa obesidad, lactancia, posparto, TEV, LES, entre otros. Limitaciones: EE. UU.; en España/Argentina usar también criterios OMS (por verificar edición vigente).
4. **Global Consensus Position Statement on the Use of Testosterone Therapy for Women.** Davis SR et al. *J Clin Endocrinol Metab* 2019;104:4660-4666 (copublicado en *Climacteric*, *Maturitas*, *J Sex Med*). PMC6821450 — Tipo: declaración de consenso (IMS, EMAS, ISSM, Endocrine Society). Punto: única indicación con evidencia: deseo sexual hipoactivo con malestar en posmenopausia, manteniendo niveles fisiológicos premenopáusicos y monitorizando. Limitaciones: formulaciones femeninas aprobadas escasas según país.
5. **Randomized Trial of Lactin-V to Prevent Recurrence of Bacterial Vaginosis.** Cohen CR et al. *N Engl J Med* 2020;382(20):1906-1915. DOI 10.1056/NEJMoa1915254 · PMID 32402161 — Tipo: ECA fase 2b. Población: mujeres de 18-45 años tras tratamiento de VB con metronidazol vaginal. Punto: menor recurrencia a 12 semanas con *L. crispatus* CTV-05 vaginal frente a placebo. Limitaciones: fase 2b, muestra moderada, producto no equivalente a probióticos comerciales.
6. **The 2020 genitourinary syndrome of menopause position statement of NAMS.** Ver `meno`, fuente 3.

---

## 12. `meno` — Menopausia e insuficiencia ovárica prematura / Menopause & POI

**Objetivo del macrotema:** manejar la transición menopáusica y la posmenopausia (hueso, cardiometabólico, sueño, cognición, ánimo, SGM), indicar y ajustar la THM con decisión compartida, distinguir preparados regulados de magistrales, ofrecer opciones no hormonales y suplementos según evidencia, y manejar la IOP.

| id | Título ES / EN | Objetivo de aprendizaje | Prerreq. | Nivel | Tags | Alias |
|---|---|---|---|---|---|---|
| `meno.transition-staging` | Transición menopáusica y estadificación / Menopause transition & staging | Estadificar con STRAW+10 y no depender de FSH aislada en la transición. | `horm.life-stages` | B | H | perimenopausia, climaterio, STRAW+10, transición menopáusica |
| `meno.vms` | Síntomas vasomotores: fisiología / Vasomotor symptoms | Explicar el papel de las neuronas KNDy y la termorregulación. | `meno.transition-staging` | I | H | sofocos, SVM, VMS, hot flushes, sudoración nocturna |
| `meno.bone` | Salud ósea / Bone health | Evaluar riesgo de fractura y prevención/tratamiento de osteoporosis. | `meno.transition-staging` | I | H, D, S | osteoporosis, osteopenia, DXA, FRAX |
| `meno.cardiometabolic` | Salud cardiovascular y metabólica / Cardiometabolic health | Explicar cambios de lípidos, grasa visceral y riesgo CV. | `thyr.metabolic-syndrome` | I | H, D | riesgo CV posmenopáusico |
| `meno.sleep-cognition-mood` | Sueño, cognición y ánimo / Sleep, cognition & mood | Abordar insomnio, quejas cognitivas y depresión perimenopáusica. | `habit.sleep`, `habit.mental-health` | I | H, Hb | niebla mental, brain fog, depresión perimenopáusica |
| `meno.gsm` | Síndrome genitourinario de la menopausia / Genitourinary syndrome of menopause | Tratar SGM con lubricantes, hidratantes, estrógeno vaginal, DHEA vaginal u ospemifeno. | `meno.transition-staging` | I | H | SGM, GSM; antiguos: atrofia vulvovaginal (AVV/VVA), vaginitis atrófica |
| `meno.lifestyle-nutrition` | Hábitos y nutrición / Lifestyle & nutrition | Aplicar ejercicio (incluida fuerza), patrón mediterráneo, proteína y calcio. | `nutr.mediterranean`, `habit.exercise` | B | D, Hb | estilo de vida en menopausia |
| `meno.ht` | Terapia hormonal de la menopausia / Menopausal hormone therapy | Indicar THM según edad, tiempo desde menopausia, vía, dosis y progestágeno, con decisión compartida. | `horm.progesterone-progestogens`, `found.shared-decision` | A | H | THM, THS, TRH, MHT, HRT, terapia de reemplazo hormonal |
| `meno.ht-bleeding-endometrium` `[añadido]` | Sangrado en THM y protección endometrial / Bleeding on HT & endometrial protection | Manejar sangrado no programado y elegir progestágeno protector. Motivo: NICE prevé actualizar este punto. | `meno.ht` | I | H | sangrado no programado, protección endometrial |
| `meno.ht-regulated-vs-compounded` | Regulados vs magistrales ("bioidénticos") / Regulated vs compounded HT | Explicar por qué se prefieren productos aprobados y el papel limitado de pruebas salivales. | `meno.ht`, `horm.serum-saliva-urine` | A | H | cBHT, BHRT, bioidénticas, hormonas compuestas, pellets |
| `meno.nonhormonal` | Opciones no hormonales / Nonhormone options | Elegir TCC, hipnosis, ISRS/IRSN, gabapentina, antagonistas NK3 según evidencia. | `meno.vms` | A | H, Hb | fezolinetant, antagonistas NK3, ISRS, IRSN, gabapentina, TCC |
| `meno.supplements` | Suplementos en menopausia / Supplements in menopause | Reconocer que la mayoría de suplementos no están recomendados para SVM. | `supp.black-cohosh`, `supp.phytoestrogens` | I | S | cimicífuga, isoflavonas, trébol rojo |
| `meno.poi` | Insuficiencia ovárica prematura / Premature ovarian insufficiency | Diagnosticar según la guía 2024 y tratar con reemplazo hormonal hasta la edad media de menopausia. | `menst.amenorrhea-workup` | A | H, R | IOP, POI; antiguos: fallo ovárico precoz, menopausia precoz, POF |
| `meno.surgical-iatrogenic` `[añadido]` | Menopausia quirúrgica, iatrogénica y supervivientes de cáncer / Surgical & iatrogenic menopause | Manejar síntomas tras ooforectomía, quimioterapia o tratamiento endocrino del cáncer de mama. Motivo: población con contraindicaciones frecuentes. | `meno.ht`, `meno.nonhormonal` | A | H | menopausia quirúrgica, cáncer de mama, BRCA, RRSO |

**Enlaces transversales:** `meno.poi` → `fert.fertility-preservation`, `fert.donor-oocytes`; `meno.bone` → `menst.fha`; `meno.ht` → `vulv.testosterone-women`.

### Fuentes clave — `meno` (verificadas; acceso 2026-10-12)

1. **The 2022 hormone therapy position statement of The North American Menopause Society.** NAMS (hoy The Menopause Society). *Menopause* 2022;29(7):767-794. DOI 10.1097/GME.0000000000002028 · https://pubmed.ncbi.nlm.nih.gov/35797481/ — Tipo: declaración de posición (niveles I-III). Población: mujeres peri/posmenopáusicas. Punto: THM es el tratamiento más eficaz de SVM y SGM; balance favorable <60 años o <10 años desde la menopausia; vía transdérmica y dosis bajas pueden reducir TEV/ictus; duración más larga con indicación documentada. Limitaciones: no se encontró versión posterior (búsqueda 2026-10-12); escasez de ECA en uso prolongado >60-65 años.
2. **The 2023 nonhormone therapy position statement of The North American Menopause Society.** Shufelt CL et al. *Menopause* 2023;30(6):573-590. DOI 10.1097/GME.0000000000002200 — Tipo: declaración de posición. Punto: recomienda TCC, hipnosis clínica, ISRS/IRSN, gabapentina, fezolinetant y otros; no recomienda suplementos/herbales, soja, acupuntura, entre otros, para SVM. Limitaciones: detalles por opción a confirmar en texto completo.
3. **The 2020 genitourinary syndrome of menopause position statement of NAMS.** *Menopause* 2020;27(9):976-992. DOI 10.1097/GME.0000000000001609 · https://pubmed.ncbi.nlm.nih.gov/32852449/ — Tipo: declaración de posición. Punto: SGM infradiagnosticado; opciones desde lubricantes/hidratantes hasta estrógeno vaginal, DHEA vaginal y ospemifeno; evidencia insuficiente para láser/energía. Limitaciones: faltan datos de seguridad endometrial a largo plazo de algunas opciones.
4. **Management of osteoporosis in postmenopausal women: the 2021 position statement of NAMS.** *Menopause* 2021;28(9):973-997. DOI 10.1097/GME.0000000000001831 — Tipo: declaración de posición. Punto: nutrición (proteína, calcio, vitamina D), actividad física, evitar tabaco/alcohol excesivo; tratamiento según riesgo. Limitaciones: texto completo no leído.
5. **Menopause: identification and management (NICE NG23).** NICE, 2015; actualización parcial noviembre 2024; la página muestra actualización 2026-04-15. https://www.nice.org.uk/guidance/ng23 — Tipo: guía. Punto: actualización 2024 sobre síntomas, salud mental y THM; NICE anunció revisión sobre inicio/suspensión de THM y sangrado no programado. Limitaciones: confirmar el contenido de la revisión 2026.
6. **Menopause and MHT in 2024: addressing the key controversies — an International Menopause Society White Paper.** Panay N, Ang SB, Cheshire R, Goldstein SR, Maki P, Nappi RE. *Climacteric* 2024;27(5):441-457. DOI 10.1080/13697137.2024.2394950 — Tipo: white paper. Punto: revisión de controversias de la THM y contexto regulatorio; base para recomendaciones IMS posteriores (2025, por verificar). Limitaciones: documento de posición/educativo.
7. **Compounded Bioidentical Menopausal Hormone Therapy: ACOG Clinical Consensus No. 6** (ver `horm`, fuente 4) y **The Clinical Utility of Compounded Bioidentical Hormone Therapy** (NASEM, 2020; https://www.nationalacademies.org/news/2020/07/prescribers-should-restrict-the-use-of-non-fda-approved-compounded-bioidentical-hormones-except-for-specific-medical-circumstances) — Tipo: consenso/informe. Punto: evidencia insuficiente de utilidad clínica de hormonas compuestas; uso limitado a quien no puede usar productos aprobados. Limitaciones: contexto EE. UU.; la industria de compounding objetó el informe (COI en ambos sentidos).
8. **Evidence-based guideline: premature ovarian insufficiency.** Panay N et al. (ESHRE, ASRM, CRE-WHiRL, IMS). *Hum Reprod Open* 2024. DOI 10.1093/hropen/hoae065 · https://pubmed.ncbi.nlm.nih.gov/39660328/ — Tipo: guía. Punto: 145 recomendaciones; diagnóstico con una FSH elevada más alteración menstrual ≥4 meses (repetir solo si dudas); incorpora genética, músculo, AMH, terapias no hormonales y complementarias. Limitaciones: sustituye a la guía 2015; texto completo no leído.

Fuentes adicionales verificadas: EMAS, *The Mediterranean diet and menopausal health* (ver `nutr`, fuente 6).

---

## 14. `preg` — Embarazo, posparto y lactancia / Pregnancy, postpartum & lactation

**Objetivo del macrotema:** aplicar seguridad de fármacos y suplementos, nutrición y deficiencias, diabetes gestacional, salud mental perinatal, ejercicio, recuperación posparto (sueño, suelo pélvico), lactancia y continuidad de cuidados con derivación. Sol no es obstetra de alto riesgo: el foco es la interfaz gineco-integrativa y la derivación.

| id | Título ES / EN | Objetivo de aprendizaje | Prerreq. | Nivel | Tags | Alias |
|---|---|---|---|---|---|---|
| `preg.medication-safety` | Seguridad de fármacos y suplementos / Medication & supplement safety | Consultar fuentes de seguridad y evitar suplementos sin datos en embarazo. | `supp.interactions-safety` | I | S, R | teratogenia, categorías FDA (antiguas), PLLR |
| `preg.nutrition` | Alimentación en el embarazo / Pregnancy nutrition | Aplicar recomendaciones de patrón, seguridad alimentaria (listeria, mercurio) y requerimientos. | `nutr.assessment` | B | D, R | nutrición prenatal, pescado y mercurio, listeria, toxoplasma |
| `preg.deficiencies` | Deficiencias en el embarazo / Deficiencies in pregnancy | Cribar y tratar hierro, yodo, B12, vitamina D según guía. | `nutr.deficiencies`, `supp.multivitamin-prenatal` | I | S | anemia del embarazo, yodo prenatal |
| `preg.weight-gain` `[añadido]` | Ganancia de peso gestacional / Gestational weight gain | Aconsejar sin estigma sobre ganancia de peso. Motivo: tema clave de nutrición no listado. | `nutr.obesity-no-stigma` | B | D | GWG, ganancia ponderal gestacional |
| `preg.nausea` `[añadido]` | Náuseas, vómitos e hiperémesis / Nausea, vomiting & hyperemesis | Usar opciones escalonadas (jengibre, B6, antieméticos) y reconocer hiperémesis. Motivo: uso frecuente de remedios integrativos. | `preg.medication-safety` | I | S, G | NVE, NVP, hiperémesis gravídica, HG |
| `preg.gdm` | Diabetes gestacional / Gestational diabetes | Conocer cribado, tratamiento nutricional y farmacológico, y seguimiento posparto. | `thyr.diabetes` | I | D, H | DMG, GDM, SOG |
| `preg.hypertensive` `[añadido]` | Trastornos hipertensivos y prevención / Hypertensive disorders | Reconocer preeclampsia y la prevención con aspirina/calcio según guía; derivar. Motivo: frecuente y con componente nutricional. | `preg.nutrition` | I | H, D | preeclampsia, HTA gestacional, aspirina, calcio |
| `preg.mental-health` | Salud mental perinatal / Perinatal mental health | Cribar depresión, ansiedad, bipolaridad, ideación suicida y psicosis posparto. | `habit.mental-health` | I | Hb | depresión posparto, DPP, PPD, EPDS, psicosis puerperal |
| `preg.exercise` | Ejercicio en embarazo y posparto / Exercise in pregnancy & postpartum | Prescribir actividad física y reconocer contraindicaciones. | `habit.exercise` | B | Hb | actividad física prenatal |
| `preg.postpartum-recovery` | Recuperación posparto y sueño / Postpartum recovery & sleep | Planificar recuperación, sueño y apoyo social. | `preg.mental-health` | B | Hb | cuarto trimestre, puerperio |
| `preg.pelvic-floor` | Suelo pélvico posparto / Postpartum pelvic floor | Detectar incontinencia, prolapso y disfunción y derivar a fisioterapia. | `gut.pelvic-floor-defecation` | I | Hb | incontinencia, prolapso, diástasis de rectos, OASIS |
| `preg.lactation` | Lactancia: fisiología, fármacos y suplementos / Lactation | Usar LactMed y valorar galactogogos con su evidencia. | `horm.prolactin-oxytocin` | I | S, H | lactancia materna, LactMed, galactogogos, domperidona |
| `preg.postpartum-contraception` `[añadido]` | Anticoncepción posparto / Postpartum contraception | Aplicar elegibilidad posparto y en lactancia. Motivo: US MEC 2024 lo revisó. | `vulv.contraception` | I | H, R | MELA, LAM, anticoncepción en lactancia |
| `preg.long-term-risk` `[añadido]` | Embarazo como marcador de riesgo a largo plazo / Pregnancy as a cardiometabolic stress test | Planificar seguimiento tras DMG, preeclampsia o parto pretérmino. Motivo: prevención a lo largo de la vida. | `preg.gdm`, `preg.hypertensive` | A | H, D | riesgo CV tras preeclampsia, DM2 tras DMG |
| `preg.continuity-referral` | Continuidad y derivación / Continuity & referral | Definir alarmas y circuitos de derivación obstétrica. | — | B | R | derivación obstétrica, signos de alarma |

**Enlaces transversales:** `preg.*` ← `fert.preconception`, `fert.pregnancy-after-art`; `preg.mental-health` → `fert.mental-health`.

### Fuentes clave — `preg` (verificadas; acceso 2026-10-12)

1. **Screening and Diagnosis of Mental Health Conditions During Pregnancy and Postpartum: ACOG Clinical Practice Guideline No. 4.** ACOG. *Obstet Gynecol* 2023;141(6):1232-1261. — Confirmado vía https://publications.smfm.org/publications/469-acog-clinical-practice-guideline-4-screening-and-diagnosis/ — Tipo: guía (GRADE modificado). Población: embarazo y primer año posparto. Punto: cribado de depresión, ansiedad, bipolaridad, suicidio y psicosis posparto. Limitaciones: recomendaciones concretas no leídas. Complemento: **ACOG CPG No. 5** (tratamiento), https://pubmed.ncbi.nlm.nih.gov/37486661/.
2. **ACOG Practice Bulletin No. 190: Gestational Diabetes Mellitus.** ACOG. *Obstet Gynecol* 2018;131(2):e49-e64; actualizado en cribado por **ACOG Clinical Practice Update (junio 2024)**. — Confirmado vía https://opqic.org/acog-practice-bulletin-190-gestational-diabetes-mellitus/ — Tipo: boletín + actualización. Punto: insulina como opción "preferida" (actualización 2018); criterios de cribado revisados en 2024. Limitaciones: leer la actualización 2024 antes de redactar cribado.
3. **Management of Diabetes in Pregnancy: Standards of Care in Diabetes—2026 (Sección 15).** American Diabetes Association. *Diabetes Care* 2026;49(Suppl 1):S321-S338. DOI 10.2337/dc26-S015 · https://pmc.ncbi.nlm.nih.gov/articles/PMC12690181 — Tipo: estándares de práctica (actualización anual). Punto: riesgo materno-fetal ligado al grado de hiperglucemia; manejo preconcepcional y gestacional. Limitaciones: objetivos glucémicos concretos no verificados en texto primario.
4. **WHO recommendations on antenatal care for a positive pregnancy experience.** OMS, 2016 (WHO/RHR/16.12). https://www.who.int/publications-detail-redirect/WHO-RHR-16.12 · NCBI Bookshelf NBK409108 — Tipo: guía OMS. Punto: atención centrada en la persona; intervenciones nutricionales y de promoción de la salud. Limitaciones: diseñada para contextos globales, incluidos de bajos recursos.
5. **ACOG Committee Opinion No. 804: Physical Activity and Exercise During Pregnancy and the Postpartum Period.** ACOG. *Obstet Gynecol* 2020;135(4):e178-e188. — Confirmado vía https://opqic.org/acog-committee-opinion-no-804-physical-activity-and-exercise-during-pregnancy-and-the-postpartum-period/ — Tipo: opinión de comité. Punto: en ausencia de contraindicaciones, la actividad física en embarazo es segura y deseable; evitar restricción rutinaria. Limitaciones: vigencia a confirmar en acog.org.
6. **Drugs and Lactation Database (LactMed).** National Library of Medicine. https://www.ncbi.nlm.nih.gov/books/NBK501922/ — Tipo: base de datos referenciada. Punto: niveles en leche/suero del lactante, efectos y alternativas. Limitaciones: muchas fichas con datos escasos.
7. **ATA 2026** (tiroides en embarazo) — ver `thyr`, fuente 1. **USPSTF ácido fólico 2023** — ver `supp`, fuente 1. **NIH ODS Pregnancy fact sheet** — ver `supp`, fuente 5.

---

## 15. `env` — Ambiente / Environmental health

**Objetivo del macrotema:** comprender disruptores endocrinos y otros tóxicos, distinguir datos humanos de animales, hacer una historia de exposición, proponer reducción proporcionada, y conocer los límites de tests de tóxicos, "detox" y quelación, sin alarmismo.

| id | Título ES / EN | Objetivo de aprendizaje | Prerreq. | Nivel | Tags | Alias |
|---|---|---|---|---|---|---|
| `env.edc-basics` | Disruptores endocrinos: conceptos / Endocrine-disrupting chemicals | Definir EDC y mecanismos (receptores, síntesis, metabolismo). | `horm.estrogens` | B | H | disruptores endocrinos, DE, EDC, xenoestrógenos |
| `env.human-vs-animal` | Datos humanos vs animales; dosis bajas y no monotonía / Human vs animal evidence | Ponderar evidencia experimental, epidemiológica y de mezclas; ventanas de vulnerabilidad. | `env.edc-basics`, `found.causality` | A | H | dosis-respuesta no monotónica, DOHaD, efectos a dosis bajas |
| `env.specific-agents` | Agentes principales / Main agents | Conocer bisfenoles, ftalatos, PFAS, pesticidas, metales (mercurio, plomo) y fuentes. | `env.edc-basics` | I | H, D, R | BPA, ftalatos, PFAS, "químicos eternos", organofosforados, metilmercurio |
| `env.exposure-history` | Historia de exposición / Exposure history | Preguntar por exposición laboral, doméstica y recreativa. | `found.longitudinal-history` | B | Hb | historia ocupacional, exposición laboral |
| `env.proportionate-reduction` | Reducción proporcionada de exposición / Proportionate exposure reduction | Dar consejos factibles y de bajo coste (alimentos, envases, pescado). | `env.specific-agents` | B | D, Hb | reducción de exposición, plásticos, envases |
| `env.cosmetics-menstrual-products` `[añadido]` | Cosméticos y productos menstruales / Personal-care & menstrual products | Evaluar evidencia sobre exposición por cosmética y productos menstruales. Motivo: preguntas frecuentes de pacientes. | `env.specific-agents` | I | Hb | cosmética, tampones, compresas, copa menstrual |
| `env.climate-heat-air` `[añadido]` | Calor, contaminación del aire y salud reproductiva / Heat, air pollution & reproductive health | Conocer asociaciones con resultados obstétricos y equidad. Motivo: ACOG 832 lo incorpora. | `env.human-vs-animal` | I | R | cambio climático, contaminación atmosférica, PM2.5, calor extremo |
| `env.tests-detox-chelation` | Límites de tests, detox y quelación / Limits of testing, detox & chelation | Rechazar quelación provocada y "detox" sin indicación; saber cuándo hay intoxicación real. | `found.commercial-tests` | I | S | test de metales pesados, provocación con quelante, detox, quelación |
| `env.risk-communication` | Comunicación del riesgo sin alarmismo / Risk communication without alarmism | Comunicar incertidumbre y priorizar acciones con mayor beneficio. | `found.shared-decision` | I | Hb | quimiofobia, comunicación de riesgo |

**Enlaces transversales:** `env.specific-agents` → `fert.environment`, `fert.male-lifestyle`; `env.proportionate-reduction` → `preg.nutrition`.

### Fuentes clave — `env` (verificadas; acceso 2026-10-12)

1. **EDC-2: The Endocrine Society's Second Scientific Statement on Endocrine-Disrupting Chemicals.** Gore AC et al. *Endocr Rev* 2015;36(6). https://www.endocrine.org/advancing-research/scientific-statements/endocrine-disrupting-chemicals/edc2 — Tipo: declaración científica. Punto: revisión de 7 áreas, incluida reproducción femenina; refuerza evidencia de efectos endocrinos, dosis-respuesta no monotónica y vulnerabilidad del desarrollo. Limitaciones: sociedad con postura de advocacy; mucha evidencia animal; DOI (10.1210/er.2015-1010) por confirmar.
2. **International Federation of Gynecology and Obstetrics opinion on reproductive health impacts of exposure to toxic environmental chemicals.** Di Renzo GC et al. *Int J Gynaecol Obstet* 2015;131:219-225. DOI 10.1016/j.ijgo.2015.09.002 · OA: https://research.unipg.it/handle/11391/1434101 — Tipo: opinión de sociedad. Punto: vínculos documentados entre exposición prenatal y fertilidad, embarazo, neurodesarrollo y cáncer; desigualdad de exposición; recomendaciones de advocacy. Limitaciones: opinión; mezcla evidencias de distinta calidad.
3. **ACOG Committee Opinion No. 832: Reducing Prenatal Exposure to Toxic Environmental Agents** (julio 2021). Confirmado vía UCSF PRHE: https://prhe.ucsf.edu/clinical-practice — Tipo: opinión de comité. Punto: preguntar por exposiciones laborales, domésticas y recreativas; limitar pescado grande con metilmercurio; reducir ftalatos de envases; no hace falta ser experto para aconsejar y derivar. Limitaciones: página ACOG no abierta; confirmar vigencia y URL oficial.

---

## 16. `cases` — Casos y lectura crítica / Cases & critical reading

**Objetivo del macrotema:** consolidar el programa con casos longitudinales ficticios (sin datos reales), diferenciales, pruebas e interpretación de analíticas sin rangos universales inventados, plan integrado con priorización, seguimiento, comunicación y lectura crítica de artículos y discrepancias entre marcos funcionales, estudios y guías.

| id | Título ES / EN | Objetivo de aprendizaje | Prerreq. | Nivel | Tags | Alias |
|---|---|---|---|---|---|---|
| `cases.method` | Método del caso longitudinal / Longitudinal case method | Seguir el esquema de spec 02 (presentación → evidencia/incertidumbre) en casos por etapas. | `found.longitudinal-history` | B | — | casos clínicos, aprendizaje basado en casos |
| `cases.differentials` | Diagnóstico diferencial / Differential diagnosis | Generar y priorizar diferenciales antes de pruebas. | `found.diagnostic-tests` | I | — | diferencial, DDx |
| `cases.labs-interpretation` | Interpretación de analíticas en contexto / Lab interpretation in context | Interpretar con unidades, rango del laboratorio, día de ciclo y fármacos. | `horm.lab-timing`, `horm.optimal-ranges` | I | H | interpretación de laboratorio |
| `cases.integrated-plan` | Plan integrado y priorización / Integrated plan & prioritisation | Combinar tratamiento convencional e intervenciones de estilo de vida/suplementos priorizando por beneficio y carga. | `found.shared-decision` | A | H, D, G, S, Hb, R | plan terapéutico integrado |
| `cases.followup-outcomes` | Seguimiento y medidas de resultado / Follow-up & outcomes | Definir resultados clínicamente relevantes y cuándo suspender. | `found.n-of-1` | I | — | PROMs, criterios de suspensión |
| `cases.communication` | Comunicación de malas noticias e incertidumbre / Communicating uncertainty | Comunicar incertidumbre, desacuerdo con información de internet y límites. | `found.shared-decision` | I | Hb | comunicación clínica, SPIKES |
| `cases.journal-club` | Club de lectura / Journal club | Leer un artículo de principio a fin con lista de comprobación. | `found.critical-appraisal` | A | — | journal club, lectura crítica |
| `cases.discrepancies` | Discrepancias IFM vs estudios vs guías / Framework–evidence discrepancies | Presentar discrepancias sin falsa equivalencia. | `found.5r-and-frameworks`, `found.evidence-grading` | A | — | discrepancias, falsa equivalencia |
| `cases.media-claims` `[añadido]` | Evaluación de afirmaciones en redes / Evaluating social-media health claims | Desmontar afirmaciones virales con método reproducible. Motivo: las pacientes llegan con ellas. | `found.biases` | I | — | influencers, desinformación, misinformation |

**Banco inicial de casos propuesto (ficticios, ids estables, sujetos a revisión médica):**
- `cases.c01-pcos-weight-concern` — SOP con preocupación por el peso y acné; cruza `pcos`, `nutr`, `habit`, `supp`.
- `cases.c02-fha-runner` — Amenorrea en corredora con baja disponibilidad energética; cruza `menst.fha`, `nutr.energy-availability`, `meno.bone`.
- `cases.c03-endo-ibs-overlap` — Endometriosis con síntomas tipo SII; cruza `endo`, `gut.ibs`, `nutr.low-fodmap`.
- `cases.c04-perimenopause-insomnia` — Perimenopausia con insomnio y SVM; cruza `meno`, `habit.sleep`.
- `cases.c05-hashimoto-preconception` — Anti-TPO positivo con deseo gestacional; cruza `thyr`, `fert.preconception`.
- `cases.c06-recurrent-bv` — VB recurrente y solicitud de probióticos; cruza `vulv`, `gut.prebiotics-probiotics`.
- `cases.c07-hmb-iron` — SMA con ferropenia y fatiga; cruza `menst.hmb-iron`, `supp.iron`, `menst.bleeding-disorders`.
- `cases.c08-pmdd` — TDPM con petición de suplementos; cruza `menst.pms-pmdd`, `supp.vitex`.
- `cases.c09-compounded-ht-request` — Petición de "bioidénticas" con test salival; cruza `meno.ht-regulated-vs-compounded`.
- `cases.c10-commercial-gut-test` — Paciente con informe comercial de heces e IgG; cruza `gut.commercial-tests`.
- `cases.c11-postpartum-mood` — Posparto con ánimo bajo y lactancia; cruza `preg.mental-health`, `preg.lactation`.
- `cases.c12-edc-anxiety` — Preocupación intensa por tóxicos; cruza `env.risk-communication`.

### Fuentes clave — `cases`
Se reutilizan: GRADE (Guyatt 2008), CONSORT 2025, NICE NG197, Beidelschies 2019 (como ejemplo de lectura crítica de un estudio observacional sobre medicina funcional). Ver `found`.

---

## 17. IFM y marcos funcionales — cómo los trata el programa

**Qué presenta públicamente el IFM (páginas abiertas o confirmadas por búsqueda, 2026-10-12):**
- **Timeline:** herramienta para registrar la historia de salud desde la preconcepción hasta el presente, identificando *antecedentes*, *desencadenantes* y *mediadores/perpetuadores* y sus relaciones temporales (ifm.org, "Using the Timeline in Functional Medicine").
- **Matriz de medicina funcional:** organizador de la historia en "nodos" biológicos (defensa y reparación, energía, biotransformación y eliminación, transporte, comunicación, integridad estructural, asimilación), con factores de estilo de vida en la base y la historia (antecedentes-desencadenantes-mediadores) a la izquierda. El IFM agrupa Matriz, Timeline y el marco GOTOIT como herramientas clínicas.
- **5R:** marco para salud intestinal — *Remove* (retirar alimentos/agentes desencadenantes), *Replace* (enzimas, ácido, bilis), *Reinoculate* (probióticos/fermentados), *Repair* (nutrientes para la mucosa) y *Rebalance* (estilo de vida, estrés). Antes era "4R".
- **Formación:** el IFM ofrece cursos de pago (p. ej., AFMCP y "Advanced Practice Modules" como el GI APM). **El programa no ha tenido acceso a esos cursos, no los cita como fuente y no sugiere afiliación.**
- **Evidencia del modelo de atención:** el estudio más citado es una cohorte retrospectiva (Beidelschies 2019) con mejora en calidad de vida autorreferida; no es un ensayo aleatorizado del modelo ni de protocolos concretos.

**Cómo los usa el programa:**
1. **Como marcos de organización y generación de hipótesis**, útiles para la historia longitudinal y para no olvidar dimensiones (sueño, estrés, nutrición, entorno). No se presentan como herramientas diagnósticas ni como protocolos validados.
2. **Descomposición en componentes evaluables:** cada "R" o cada nodo se traduce en intervenciones concretas (p. ej., "Reinoculate" → probiótico X para indicación Y) y cada una se evalúa con la evidencia específica (cepa, población, resultado). Un protocolo multicomponente no hereda la evidencia de sus partes, ni al revés.
3. **Etiquetado obligatorio** con la escala de spec 02 (recomendado por guías · evidencia limitada/emergente · hipótesis mecanística/preclínica · respaldo insuficiente · no recomendado/potencialmente perjudicial).
4. **Discrepancias explícitas:** cuando el marco funcional sugiere una prueba o intervención que una guía no recomienda (p. ej., IgG alimentaria, pruebas salivales para dosificar hormonas, "leaky gut" como diagnóstico, rT3), la tarjeta lo dice con la fuente, sin falsa equivalencia (`cases.discrepancies`).
5. **Coste y riesgo:** se señala el riesgo de cascadas de pruebas, de dietas restrictivas y de retrasar tratamientos eficaces (especialmente en reproducción, donde el tiempo importa).

---

## 18. Secuenciación sugerida y grafo de dependencias (resumen)

**Nivel 0 — Fundamentos (primero, breve):** `found.causality` → `found.evidence-grading` → `found.diagnostic-tests` → `found.shared-decision`; en paralelo `found.longitudinal-history`. El resto de `found.*` (matriz IFM, 5R, pruebas comerciales, N-de-1) se intercalan cuando aparezcan en los módulos clínicos.

**Nivel 1 — Fisiología transversal:** `horm.hpo-axis` → `horm.folliculogenesis-ovulation` → `horm.luteal-phase`; `horm.estrogens` → `horm.androgens-shbg` / `horm.progesterone-progestogens`; `horm.insulin-leptin`; `horm.thyroid-axis`; `horm.lab-timing` → `horm.assay-methods` → `horm.serum-saliva-urine`. En paralelo: `nutr.assessment`, `nutr.mediterranean`, `gut.digestion-absorption`, `gut.microbiota-intestinal`, `supp.principles`, `habit.sleep`, `habit.exercise`, `habit.motivational-interviewing`.

**Nivel 2 — Herramientas transversales aplicadas:** `nutr.energy-availability`, `nutr.eating-disorders`, `nutr.obesity-no-stigma`, `gut.red-flags` → `gut.ibs` → `nutr.low-fodmap`; `gut.celiac` → `nutr.elimination-diets`; fichas `supp.*` de deficiencias (hierro, B12, D, yodo, folato).

**Nivel 3 — Módulos clínicos (orden recomendado):**
1. `pcos` (piloto previsto en spec 05: unidad hormonal/metabólica aplicada a SOP) — depende de `horm.androgens-shbg`, `horm.insulin-leptin`, `nutr.*`, `supp.inositols`.
2. `menst` — depende de `horm.*`, `nutr.energy-availability`; alimenta `endo` y `meno.poi`.
3. `thyr` — depende de `horm.thyroid-axis`, `gut.celiac`; alimenta `preg` y `fert`.
4. `endo` — depende de `menst.dysmenorrhea`, `gut.ibs`, `gut.pelvic-floor-defecation`.
5. `vulv` — depende de `gut.microbiota-vaginal`, `horm.endocrine-pharmacology`.
6. `meno` — depende de `horm.progesterone-progestogens`, `found.shared-decision`, `supp.black-cohosh`/`supp.phytoestrogens`.
7. `preg` — depende de `supp.*`, `thyr.pregnancy-preconception`, `habit.*`.
8. `env` — puede ir en cualquier momento tras `found.causality` y `horm.estrogens`; idealmente antes de `fert.environment`.

**Nivel 4 — Integración:** `cases.*` intercalados al final de cada módulo clínico (no solo al final del programa) y `cases.journal-club` / `cases.discrepancies` como cierre.

**Relación con Fertilidad (`fert.*`, ~35-40 % del corpus):** `fert` debe arrancar en paralelo tras el Nivel 1; sus dependencias principales en este mapa son `horm.folliculogenesis-ovulation`, `horm.luteal-phase`, `pcos.ovulation-induction`, `endo.reproduction`, `thyr.pregnancy-preconception`, `supp.folate`/`supp.inositols`/`supp.coq10`/`supp.dhea`, `nutr.applied-cases`, `habit.non-blaming`, `env.specific-agents`, `gut.microbiota-endometrial` y `vulv.bv`.

**Puntos de dependencia críticos (cuellos de botella):** `found.evidence-grading`, `horm.lab-timing`, `supp.principles`, `gut.microbiota-intestinal`, `nutr.energy-availability` y `found.commercial-tests` son prerrequisito de muchos temas: deben producirse primero y con especial cuidado editorial.

---

## 19. Omisiones detectadas frente a spec 02 (resumen de `[añadido]`)

Fundamentos: pruebas comerciales/DTC, conflictos de interés y regulación, ética y ámbito de práctica, ensayos N-de-1. · Hormonas: prolactina/oxitocina, farmacología hormonal, cronoendocrinología. · Nutrición: ultraprocesados, TCA, fármacos antiobesidad/bariátrica, inseguridad alimentaria. · Gastro: alarmas digestivas como tema propio, disinergia defecatoria, fármacos y microbiota, histamina/MCAS. · Suplementos: prenatales/multivitamínicos, colina, otros minerales, otros botánicos. · Hábitos: cannabis, apps/wearables. · SOP: protección endometrial, SOP a lo largo de la vida. · Menstrual: coagulopatías, hiperplasia endometrial, PME/trastornos catameniales. · Endometriosis: dolor pélvico crónico, riesgo oncológico, salud mental. · Tiroides/metabolismo: dietas "autoinmunes", síndrome metabólico/riesgo CV femenino. · Vulvovaginal: tricomoniasis/vaginitis aeróbica, ITU recurrente, dermatosis vulvares, ánimo/libido y anticoncepción, métodos de conocimiento de la fertilidad. · Menopausia: sangrado en THM, menopausia quirúrgica/supervivientes de cáncer. · Embarazo: ganancia de peso, náuseas/hiperémesis, trastornos hipertensivos, anticoncepción posparto, riesgo a largo plazo. · Ambiente: cosmética/productos menstruales, calor y contaminación. · Casos: afirmaciones en redes.

---

## 20. Fuentes "por verificar" (no confirmadas en esta sesión; no usar hasta verificar)

| Fuente | Motivo |
|---|---|
| ACOG Committee Opinion No. 462, *Moderate Caffeine Consumption During Pregnancy* | No buscada/confirmada; verificar vigencia. |
| Meneghetti et al., 2024, *Reprod Sci*, metaanálisis de intervenciones dietéticas en endometriosis | Aparece en resultado secundario (IASP); sin URL/DOI confirmados. |
| Nirgianakis et al., RS sobre dieta en endometriosis, *Reprod Sci* | Año y DOI no confirmados. |
| De Araugo et al., 2025, scoping review de nutrición en endometriosis, *J Hum Nutr Diet* | Solo registro en repositorio (Adelaide); DOI no confirmado. |
| Watrowski et al., 2026, low-FODMAP en endometriosis, *Nutrients* | Solo mención secundaria. |
| IMS 2025, *International Menopause Society recommendations and key messages on women's midlife health and menopause*, *Climacteric* 28(6):634-656 | Registro en repositorio (Otago); DOI y contenido no confirmados. |
| Revisión 2023 sobre cimicífuga citada por NCCIH | No identificada. |
| NIH ODS *Magnesium — Health Professional Fact Sheet* | URL no confirmada en resultados. |
| AEEM, *Criterios de elegibilidad de la terapia hormonal de la menopausia* (https://aeem.es/wp-content/uploads/2024/02/criterios-de-elegibilidad-electronico.pdf) | URL aparece en búsqueda; contenido/año no leídos. Fuente española prioritaria. |
| SEGO — protocolos (SUA, endometriosis, SOP, menopausia) | No buscados; contexto español. |
| FASGO / SAEGRE (Argentina) — consensos (p. ej., https://www.fasgo.org.ar/images/sangrado_adolescentes.pdf) | URL vista en búsqueda, no abierta. |
| Consenso argentino sobre pruebas de aliento y SIBO en DGBI (*Rev Gastroenterol Méx*, 2026) | Mencionado en búsqueda; no abierto. |
| OMS, *Medical eligibility criteria for contraceptive use* (edición vigente) | No buscada. |
| Cochrane Handbook (versión vigente), RoB 2, PRISMA 2020, AMSTAR 2, AGREE II | Herramientas estándar; URLs y versiones no confirmadas. |
| Consenso de Rotterdam 2003/2004 (ESHRE/ASRM) | Referencia histórica; no buscada. |
| Proceso internacional de renombre del SOP | Existe debate público; nombre propuesto y estado no verificados. **No usar ningún nombre nuevo hasta confirmar.** |
| ACOG Practice Bulletin No. 136 (AUB-O, 2013) | Solo mención secundaria. |
| Pituitary Society, consensos sobre prolactinoma posteriores a 2011 | No buscados. |
| ESHRE good practice recommendations on add-ons (2023), *Hum Reprod*, DOI 10.1093/humrep/dead184 | Registro UCL confirmado, pero pertenece a `fert`; el agente de fertilidad debe verificarlo y citarlo. |
| STRAW+10 (Harlow et al., 2012) | Estándar de estadificación; no buscado. |
| Endocrine Society, guía de hirsutismo (2018) | No buscada; relevante para `pcos.hyperandrogenism`. |

---

## 21. Dudas que requieren especialista humano

1. **Peso de las fuentes españolas/argentinas** (SEGO, AEEM, FASGO, SAEGRE) frente a guías internacionales cuando difieran (p. ej., umbrales de TSH en preconcepción, cribado de DMG): decidir política editorial.
2. **Tiroides en preconcepción/embarazo:** la guía ATA 2026 es muy reciente; una endocrinóloga debería validar qué cambia respecto a 2017 antes de redactar tarjetas.
3. **Profundidad de `preg`:** confirmar con Sol hasta dónde llegar en obstetricia (riesgo de excederse de su ámbito o de duplicar formación obstétrica).
4. **Testosterona y DHEA en mujeres:** disponibilidad de formulaciones aprobadas en España/Argentina y práctica local con magistrales.
5. **Microbioma endometrial y vaginal:** el límite entre "add-on no recomendado" y "investigación prometedora" debe acordarse con el agente/revisor de fertilidad para no publicar mensajes contradictorios.
6. **Fármacos antiobesidad (GLP-1 RA):** recomendaciones de anticoncepción y lavado preconcepcional cambian rápido; requiere fuente actualizada y revisión.
7. **NICE NG23 (2026) y NG88 (2026):** ambas muestran revisiones recientes; confirmar texto vigente antes de redactar.
8. **Nombre del SOP:** si se adopta un nuevo nombre internacional, decidir cómo mostrar alias sin confundir.
