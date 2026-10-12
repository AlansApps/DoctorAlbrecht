# Mapa curricular — Macrotema 13: Fertilidad y reproducción (`fert`)

> Estado editorial: **borrador · fuentes parcialmente verificadas (IA) · pendiente de revisión médica humana**.
> Fecha de investigación y acceso a fuentes: **2026-10-12**.
> Alcance: mapa curricular y registro inicial de fuentes. **No** es contenido de tarjetas publicable todavía. Ninguna afirmación de este documento sustituye la revisión de una especialista en medicina reproductiva.
> Programa educativo de profundidad de posgrado **sin acreditación**. Sin afiliación a ESHRE, ASRM, NICE, WHO, Cochrane, Harvard ni IFM.

---

## 0. Convenciones

**Niveles**
- `N1` fundamentos (repaso de conocimiento de especialista; marco común)
- `N2` aplicado (decisión clínica, interpretación, asesoramiento)
- `N3` avanzado (controversias, add-ons, lectura crítica, discrepancias entre guías)

**Tipo de resultado (obligatorio en tarjetas de fertilidad, spec 02)**
- `BIO` biomarcador / respuesta ovárica / ovocitos recuperados
- `SEM` parámetros seminales / fragmentación ADN
- `OVU` ovulación
- `CPR` embarazo clínico · `OPR` embarazo evolutivo (ongoing)
- `LBR` nacido vivo · `CLBR` nacido vivo acumulado
- `MIS` aborto · `SAFE` seguridad (OHSS, gemelaridad, efectos adversos, perinatales)

**Etiquetas de evidencia (spec 02)**: `guía-recomienda` · `evidencia-limitada` · `hipótesis-mecanística` · `respaldo-insuficiente` · `no-recomendado`.

**Fuerza vs certeza**: ESHRE usa *Strong / Conditional / GPP* (guías) o *Recommended / Can be considered / Currently not recommended for routine clinical use / Not recommended* (GPR de add-ons). AUA/ASRM usa *Strong/Moderate/Conditional Recommendation* + *Evidence Level Grade A/B/C*, *Clinical Principle*, *Expert Opinion*. Cochrane usa certeza GRADE. **No se mezclan escalas** en las tarjetas: se cita la escala de la fuente original.

**IDs**: `fert.<slug>` estables; cambios de nomenclatura se registran como alias, nunca renombrando el ID.
**IDs externos citados como prerrequisito** (definidos en otros mapas; pendientes de confirmar con los mapas hermanos): `horm.hpo-axis`, `horm.folliculogenesis`, `horm.luteal-phase`, `horm.thyroid`, `horm.prolactin`, `pcos.diagnosis`, `pcos.ovulation-induction`, `nutr.mediterranean`, `nutr.energy-availability`, `nutr.obesity`, `gut.microbiota-basics`, `gut.celiac`, `supp.folate`, `supp.inositol`, `supp.vitamin-d`, `supp.coq10`, `supp.dhea`, `supp.omega3`, `supp.antioxidants`, `habits.sleep`, `habits.tobacco-alcohol`, `habits.exercise`, `habits.motivational-interviewing`, `endo.diagnosis`, `endo.surgery`, `meno.poi`, `env.endocrine-disruptors`, `found.critical-appraisal`, `found.shared-decision`, `preg.early-pregnancy`.

Las fuentes se citan como `[Sxx]` → ver §3 (registro de fuentes verificadas) y `[PV-xx]` → §3.2 (por verificar).

---

## 1. Macrotema

| Campo | Valor |
|---|---|
| id | `fert` |
| Título ES | Fertilidad y reproducción |
| Título EN | Fertility and reproduction |
| Alias ES | infertilidad, subfertilidad, esterilidad (uso hispano), reproducción asistida, medicina reproductiva, TRA |
| Alias EN | infertility, subfertility, assisted reproduction, ART, MAR (medically assisted reproduction), reproductive medicine |
| Peso en corpus | ~35–40 % del corpus inicial; transversal (nutrición, gastro, hormonas, hábitos, suplementos) |
| Enfoque | Integrador: fisiología + factores modificables + medicina reproductiva convencional; las intervenciones "funcionales" se evalúan con el mismo estándar de evidencia que cualquier add-on |

**Objetivos del macrotema**
1. Evaluar a la **pareja/persona** (no solo a la mujer) de forma eficiente, simultánea y proporcionada, sin retrasar derivación por edad.
2. Interpretar biomarcadores (AMH/AFC, FSH, progesterona, seminograma OMS 2021) **sabiendo qué predicen y qué no**.
3. Diferenciar en cada intervención el desenlace medido: biomarcador → semen → embarazo clínico → **nacido vivo**.
4. Integrar nutrición, metabolismo, hábitos y suplementos **sin** prometer resultados no demostrados y sin culpabilizar.
5. Conocer indicaciones, riesgos y resultados de IUI, FIV/ICSI, estimulación, transferencia y preservación de fertilidad.
6. Manejar fallo recurrente de implantación (RIF) y pérdida gestacional recurrente (RPL) con las recomendaciones ESHRE vigentes.
7. Posicionarse ante **add-ons** (inmunología, ERA, microbioma, PRP, scratching, etc.) con criterio crítico y lenguaje de las guías.
8. Comunicar pronóstico e incertidumbre, y atender salud mental y decisiones compartidas.

**Secuencia sugerida (recorrido)**: Bloque A Fundamentos y evaluación → Bloque B Factores específicos → Bloque C Optimización preconcepcional e integradora → Bloque D Tratamiento → Bloque E Implantación, pérdida y add-ons → Bloque F Resultados, comunicación y lectura crítica.

---

## 2. Microtemas

Formato por microtema: id · título ES/EN · objetivo (1 línea) · prerrequisitos · nivel · etiquetas clínicas · alias ES/EN · anclas de evidencia (§3) · desenlaces relevantes. `[añadido]` = no listado explícitamente en spec 02 §13; incluye motivo.

### Bloque A — Fundamentos y evaluación

#### A1 `fert.couple-evaluation`
- **Título**: Evaluación inicial de la pareja infértil / *Initial fertility evaluation of the couple*
- **Objetivo**: Ordenar un estudio inicial simultáneo, escalonado y de mínima invasividad de ambos miembros de la pareja (o persona sola/pareja del mismo sexo).
- **Prerrequisitos**: `horm.hpo-axis`, `found.shared-decision`
- **Nivel**: N1–N2
- **Etiquetas**: infertilidad primaria/secundaria, anamnesis reproductiva, estudio básico, varón
- **Alias**: ES estudio de esterilidad, estudio básico de fertilidad · EN infertility work-up, basic fertility assessment
- **Anclas**: [S13] ASRM evaluación de la mujer infértil 2021; [S18] AUA/ASRM varón (Statement 1: evaluar ambos miembros simultáneamente — *Expert Opinion*); [S21] NICE NG257 (definición 12 meses / 6 ciclos de inseminación; inclusión de parejas del mismo sexo y personas sin pareja); [S03] ESHRE UI (estudio básico mínimo antes de etiquetar "inexplicada").
- **Desenlaces**: proceso diagnóstico (no resultados reproductivos).

#### A2 `fert.age-timing`
- **Título**: Edad, tiempos y no retrasar el tratamiento / *Age, timing and avoiding treatment delay*
- **Objetivo**: Aplicar los umbrales de edad para acelerar estudio y tratamiento, y explicar que la edad es el principal predictor de éxito reproductivo.
- **Prerrequisitos**: `fert.couple-evaluation`, `horm.folliculogenesis`
- **Nivel**: N1
- **Etiquetas**: edad materna, edad paterna, derivación, ventana reproductiva
- **Alias**: ES declive de la fertilidad asociado a la edad, edad reproductiva avanzada · EN age-related fertility decline, advanced maternal age, advanced paternal age
- **Anclas**: [S16] ACOG/ASRM CO 589 (evaluación acelerada >35 años tras 6 meses; más inmediata >40); [S21] NICE NG257 (rec. 1.16.9: derivar/estudiar antes si la persona que busca el embarazo tiene ≥36 años); [S12] ASRM: "la edad predice mejor el éxito reproductivo que la reserva ovárica"; [S18] AUA/ASRM Statement 7 (edad paterna ≥40, *Expert Opinion*).
- **Desenlaces**: proceso; pronóstico de LBR por edad (citar solo cifras de la fuente).

#### A3 `fert.amh-afc`
- **Título**: Reserva ovárica: AMH y recuento de folículos antrales — qué predicen y qué no / *Ovarian reserve testing: AMH and AFC — what they predict and what they don't*
- **Objetivo**: Usar AMH/AFC para predecir respuesta a estimulación, **no** para predecir fecundabilidad natural ni para negar tratamiento o promover congelación de ovocitos.
- **Prerrequisitos**: `horm.folliculogenesis`, `fert.age-timing`
- **Nivel**: N2
- **Etiquetas**: AMH, AFC, FSH basal, inhibina B, baja respuesta, alta respuesta, SOP
- **Alias**: ES hormona antimülleriana, HAM, recuento de folículos antrales (RFA), baja reserva ovárica (BRO) · EN anti-Müllerian hormone, antral follicle count, diminished ovarian reserve (DOR), ovarian reserve testing (ORT)
- **Anclas**: [S12] ASRM 2020; [S23] Steiner JAMA 2017; [S03] ESHRE UI 2023 (Strong); [S05] ESHRE OS 2025 (recs 1–3); [S21] NICE NG257 (sección *Ovarian reserve testing*, rationale); [S17] ASRM ética OC planificada.
- **Desenlaces**: `BIO` (ovocitos), fecundabilidad natural, `CPR/LBR` en TRA (predicción débil). → **Unidad piloto propuesta (§5).**

#### A4 `fert.ovulation`
- **Título**: Ovulación: confirmación, trastornos e inducción / *Ovulation: confirmation, disorders and induction*
- **Objetivo**: Confirmar ovulación solo cuando cambia la conducta, clasificar la anovulación y elegir inducción (letrozol de primera línea en SOP).
- **Prerrequisitos**: `horm.hpo-axis`, `horm.luteal-phase`, `pcos.diagnosis`, `nutr.energy-availability`
- **Nivel**: N1–N2
- **Etiquetas**: SOP, amenorrea hipotalámica, hiperprolactinemia, progesterona medio-lútea, letrozol, clomifeno, gonadotropinas
- **Alias**: ES anovulación, oligoovulación, inducción de la ovulación · EN anovulation, ovulation induction (OI), mid-luteal progesterone
- **Anclas**: [S03] ESHRE UI: en ciclos regulares las pruebas de confirmación de ovulación no se recomiendan de rutina (GPP); si se necesitan: LH urinaria, ecografía o progesterona medio-lútea (Conditional); [S34] Legro NEJM 2014 (letrozol vs clomifeno en SOP, `LBR` acumulado); [S37] Guía internacional SOP 2023.
- **Desenlaces**: `OVU`, `LBR`, `SAFE` (gemelaridad).

#### A5 `fert.tubal-factor`
- **Título**: Factor tubárico: HSG, HyCoSy, laparoscopia e hidrosálpinx / *Tubal factor*
- **Objetivo**: Elegir prueba de permeabilidad tubárica y conocer el posible efecto terapéutico del contraste oleoso.
- **Prerrequisitos**: `fert.couple-evaluation`
- **Nivel**: N2
- **Etiquetas**: HSG, HyCoSy, contraste oleoso, hidrosálpinx, EPI, Chlamydia
- **Alias**: ES histerosalpingografía, histerosonosalpingografía, permeabilidad tubárica · EN hysterosalpingography, HyCoSy/HyFoSy, tubal flushing, oil-based contrast
- **Anclas**: [S03] ESHRE UI (HSG y HyCoSy válidas y comparables — GPP; laparoscopia diagnóstica rutinaria no recomendada — Strong; discutir HSG con contraste oleoso); [S35] Dreyer NEJM 2017 H2Oil (`OPR` a 6 meses).
- **Desenlaces**: diagnóstico; `OPR` (H2Oil). Riesgos del contraste oleoso: **por verificar** [PV-12].

#### A6 `fert.uterine-factor`
- **Título**: Factor uterino: malformaciones, pólipos, miomas, sinequias, adenomiosis / *Uterine factor*
- **Objetivo**: Indicar ecografía (2D/3D) como primera línea y reservar histeroscopia para hallazgos o situaciones específicas.
- **Prerrequisitos**: `fert.couple-evaluation`, `endo.diagnosis`
- **Nivel**: N2
- **Etiquetas**: útero septo, Asherman, pólipo, mioma submucoso, adenomiosis, endometritis crónica
- **Alias**: ES factor uterino, cavidad endometrial · EN uterine factor, uterine cavity assessment, screening hysteroscopy
- **Anclas**: [S03] ESHRE UI (si la ecografía de la cavidad es normal, no más evaluación — Strong; histeroscopia para anomalías no vistas en imagen no recomendada — Strong); [S01] add-ons (histeroscopia de cribado *currently not recommended for routine clinical use*; *can be considered* en RIF); [S04] RIF (3D eco, histeroscopia si sospecha); [S02] RPL (nueva recomendación sobre adenomiosis 2022).
- **Desenlaces**: `CPR/LBR`, `MIS`.

#### A7 `fert.male-semen`
- **Título**: Varón I: seminograma según manual OMS 2021 / *Male factor I: semen analysis (WHO 2021 manual)*
- **Objetivo**: Interpretar un seminograma sabiendo que los percentiles de referencia no separan fértil de infértil y que el manual OMS 2021 abandona los "valores normales".
- **Prerrequisitos**: `fert.couple-evaluation`
- **Nivel**: N1–N2
- **Etiquetas**: seminograma, oligozoospermia, astenozoospermia, teratozoospermia, azoospermia, control de calidad de laboratorio
- **Alias**: ES espermiograma, análisis seminal · EN semen analysis, WHO 6th edition, sperm count/motility/morphology
- **Anclas**: [S19] OMS 2021, 6.ª ed.; [S20] Boitrelle 2021 (revisión crítica: población de referencia de varones fértiles con TTP ≤12 meses; percentil 5 no discrimina; decisión-límites no definidos numéricamente); [S18] AUA/ASRM Statement 2 (uno o más seminogramas — *Strong; Grade B*).
- **Desenlaces**: `SEM`. **Advertencia didáctica**: no inventar ni redondear valores de referencia; tomar cifras del manual (tabla original) en la tarjeta final [PV-01].

#### A8 `fert.male-clinical` `[añadido]`
- **Título**: Varón II: evaluación clínica, hormonal, genética, varicocele y testosterona exógena / *Male factor II: clinical, endocrine and genetic evaluation*
- **Motivo de añadido**: spec 02 dice "varón/semen"; un programa serio separa el seminograma de la evaluación andrológica (genética, varicocele, salud general del varón, iatrogenia por testosterona).
- **Objetivo**: Saber cuándo pedir FSH/testosterona, cariotipo, microdeleciones Y, CFTR, y cuándo derivar a andrología/urología.
- **Prerrequisitos**: `fert.male-semen`
- **Nivel**: N2
- **Etiquetas**: azoospermia, varicocele, cariotipo, microdeleción Y, CFTR, testosterona exógena, anabolizantes
- **Alias**: ES andrología, factor masculino · EN male infertility evaluation, varicocelectomy, Y-chromosome microdeletion
- **Anclas**: [S18] AUA/ASRM 2020, enmienda 2024: Statements 10–15 (hormonas y genética), 16 (no ADN espermático en evaluación inicial — *Moderate; Grade C*), 26–27 (varicocele palpable vs. solo por imagen), 42 (no prescribir testosterona exógena si deseo fértil — *Clinical Principle*), 5 (riesgos de salud asociados).
- **Desenlaces**: `SEM`, `CPR/LBR` (varicocele), salud general del varón.

#### A9 `fert.natural-fertility` `[añadido]`
- **Título**: Optimización de la fertilidad natural: ventana fértil y frecuencia coital / *Optimizing natural fertility*
- **Motivo de añadido**: contenido basal de asesoramiento preconcepcional que evita pruebas e intervenciones innecesarias.
- **Objetivo**: Asesorar sobre ventana fértil, frecuencia de relaciones y mitos (posición, lubricantes, etc.) con base en ASRM.
- **Prerrequisitos**: `horm.hpo-axis`
- **Nivel**: N1
- **Etiquetas**: ventana fértil, test LH, apps de ciclo, lubricantes
- **Alias**: ES coito dirigido, días fértiles · EN fertile window, timed intercourse, fecundability
- **Anclas**: [S14] ASRM *Optimizing natural fertility* 2022 (solo metadatos verificados; contenido por leer); [S21] NICE NG257.
- **Desenlaces**: fecundabilidad/TTP.

### Bloque B — Diagnósticos específicos

#### B1 `fert.unexplained`
- **Título**: Infertilidad inexplicada / *Unexplained infertility*
- **Objetivo**: Definir "inexplicada" tras estudio básico, evitar pruebas sin utilidad y elegir entre manejo expectante, IUI con estimulación o FIV.
- **Prerrequisitos**: `fert.couple-evaluation`, `fert.amh-afc`, `fert.tubal-factor`, `fert.male-semen`
- **Nivel**: N2
- **Etiquetas**: diagnóstico de exclusión, manejo expectante, IUI-OS, FIV
- **Alias**: ES esterilidad sin causa aparente (ESCA), esterilidad de origen desconocido (EOD) · EN unexplained infertility (UI)
- **Anclas**: [S03] ESHRE UI 2023 — 52 recomendaciones; IUI con estimulación ovárica = primera línea (Strong); FIV *probably not recommended* sobre IUI-OS (Conditional); ICSI no recomendada sobre FIV convencional (Strong); ADN espermático no recomendado (Strong); scratching *should not be offered* (Strong); antioxidantes adjuntos mujer/varón *probably not recommended* (Conditional). [S21] NICE NG257 (segundo año expectante; hasta 4 ciclos de IUI con gonadotropinas o FIV según criterios).
- **Desenlaces**: `LBR`, `CPR`, `SAFE` (gemelaridad con estimulación).
- **Discrepancia a enseñar**: ESHRE (IUI-OS primera línea) vs NICE NG257 (estructura temporal propia y criterios de acceso del NHS) — verificar redacción exacta NICE antes de tarjeta [PV-13].

#### B2 `fert.endometriosis`
- **Título**: Endometriosis y fertilidad / *Endometriosis-associated infertility*
- **Objetivo**: Decidir cirugía vs TRA según dolor, edad, reserva, otros factores y EFI; evitar supresión hormonal con fin reproductivo.
- **Prerrequisitos**: `endo.diagnosis`, `endo.surgery`, `fert.amh-afc`
- **Nivel**: N2–N3
- **Etiquetas**: endometrioma, rASRM I/II, endometriosis profunda, EFI, reserva ovárica, cistectomía
- **Alias**: ES endometrioma, índice de fertilidad de endometriosis · EN endometrioma, Endometriosis Fertility Index (EFI)
- **Anclas** [S07] ESHRE 2022: no prescribir supresión ovárica para mejorar fertilidad (Strong); no cirugía rutinaria pre-TRA en estadio I/II (Strong) ni para endometrioma (Strong; impacto negativo en reserva); laparoscopia operatoria puede considerarse para infertilidad asociada a endometrioma (Weak); decisión quirúrgica guiada por dolor, edad, cirugía previa, otros factores, reserva y EFI (GPP); IUI con estimulación en estadio I/II (Weak); GnRH agonista prolongado pre-TRA no recomendado (Strong); TRA en endometriosis profunda no parece aumentar recurrencia.
- **Desenlaces**: `LBR`, `CPR`, `BIO` (reserva tras cirugía).

#### B3 `fert.adenomyosis-fibroids` `[añadido]`
- **Título**: Adenomiosis y miomas en reproducción / *Adenomyosis and fibroids in reproduction*
- **Motivo de añadido**: frecuentes en consulta; ESHRE tiene GPR de adenomiosis en desarrollo y la guía RPL 2022 añadió recomendación sobre adenomiosis.
- **Objetivo**: Valorar cuándo un mioma o adenomiosis justifica intervención antes de buscar embarazo/TRA.
- **Prerrequisitos**: `fert.uterine-factor`
- **Nivel**: N3
- **Etiquetas**: mioma submucoso/intramural, FIGO, adenomiosis, miomectomía
- **Alias**: ES leiomioma · EN leiomyoma, adenomyosis
- **Anclas**: [S02] RPL 2022 (recomendación nueva sobre adenomiosis — leer redacción exacta) ; GPR ESHRE adenomiosis **en desarrollo** [PV-05]. Contenido mínimo **pendiente** hasta tener fuente.
- **Desenlaces**: `LBR`, `MIS`.

#### B4 `fert.dor-poi` `[añadido]`
- **Título**: Baja reserva, baja respuesta e insuficiencia ovárica prematura en el contexto reproductivo / *Diminished ovarian reserve, poor response and POI*
- **Motivo de añadido**: núcleo de consulta con alta oferta de add-ons (PRP ovárico, DHEA, GH, células madre) y opciones reales (donación de ovocitos).
- **Objetivo**: Diferenciar baja reserva, baja respuesta e IOP; asesorar con realismo y conocer la donación de ovocitos.
- **Prerrequisitos**: `fert.amh-afc`, `meno.poi`
- **Nivel**: N3
- **Etiquetas**: baja respuesta, IOP, donación de ovocitos, PRP ovárico, DHEA, testosterona transdérmica, GH
- **Alias**: ES fallo ovárico prematuro (histórico), baja respondedora · EN poor/low responder, premature ovarian insufficiency (POI), (historic) premature ovarian failure
- **Anclas**: [S05] ESHRE OS 2025 (DHEA no recomendada en bajas respondedoras — Strong; GH *probably not recommended* en bajas respondedoras — Conditional; testosterona *probably not recommended* en bajas respondedoras; mio-inositol no recomendado en bajas respondedoras); [S27] Cochrane andrógenos 2024; [S01] add-ons (PRP intraovárico, células madre, activación in vitro de folículos: no recomendados); guía internacional IOP 2024 [PV-04].
- **Desenlaces**: `BIO`, `LBR`.
- **Discrepancia a enseñar**: testosterona en bajas respondedoras — Cochrane 2024 "probablemente mejora" `LBR/CPR` vs ESHRE OS 2025 "probably not recommended". Requiere revisión humana [D-01].

#### B5 `fert.endocrine-comorbidities` `[añadido]`
- **Título**: Tiroides, prolactina y otras endocrinopatías en fertilidad / *Thyroid, prolactin and other endocrine disorders in fertility*
- **Motivo de añadido**: pruebas tiroideas y anticuerpos están entre las más sobreindicadas/sobretratadas; prolactina es causa tratable de anovulación.
- **Objetivo**: Pedir TSH/TPO cuando la guía lo indica y no tratar autoinmunidad eutiroidea con levotiroxina para mejorar `LBR`.
- **Prerrequisitos**: `horm.thyroid`, `horm.prolactin`
- **Nivel**: N2
- **Etiquetas**: TSH, anti-TPO, hipotiroidismo subclínico, hiperprolactinemia, levotiroxina
- **Alias**: ES autoinmunidad tiroidea · EN thyroid autoimmunity, subclinical hypothyroidism
- **Anclas**: [S02] RPL 2022 (cribado TSH y anti-TPO recomendado en RPL — Strong; levotiroxina no aumenta `LBR` en autoinmunidad tiroidea con TSH normal); [S04] RIF (función tiroidea *can be considered*); [S21] NICE NG257 (secciones de hipotiroidismo subclínico e hiperprolactinemia — leer) ; ATA/ETA embarazo [PV-08].
- **Desenlaces**: `LBR`, `MIS`.

### Bloque C — Preconcepción y enfoque integrador

#### C1 `fert.preconception`
- **Título**: Preconcepción: medicación, vacunas, comorbilidades y ácido fólico / *Preconception care: medications, vaccines, comorbidities, folic acid*
- **Objetivo**: Revisar fármacos teratógenos, vacunas, enfermedades crónicas y suplementación con ácido fólico antes de concebir o de TRA.
- **Prerrequisitos**: `supp.folate`, `fert.couple-evaluation`
- **Nivel**: N1–N2
- **Etiquetas**: ácido fólico, rubéola/varicela, valproato/isotretinoína, diabetes, HTA, epilepsia, cribado de portadores
- **Alias**: ES consulta preconcepcional · EN preconception counselling, pre-pregnancy care
- **Anclas**: [S36] USPSTF 2023 (0,4–0,8 mg/día de ácido fólico a quien planifica/puede quedar embarazada — Grado A; no aplica a alto riesgo de DTN); [S21] NICE NG257 (remite a guía NICE de nutrición materna para ácido fólico); [S02] RPL (ácido fólico no previene la pérdida gestacional en RPL inexplicada — Strong). Vacunas y fármacos: [PV-07]. ESHRE GPR de preconcepción en infertilidad **en desarrollo** [PV-06].
- **Desenlaces**: `SAFE` fetal (DTN), no `LBR`.

#### C2 `fert.lifestyle-nutrition-metabolism`
- **Título**: Nutrición, gastro, metabolismo y hábitos en fertilidad / *Nutrition, gut, metabolism and lifestyle in fertility*
- **Objetivo**: Aplicar intervenciones de estilo de vida con evidencia realista (peso, tabaco, alcohol, energía disponible, patrón dietético) sin culpabilizar ni retrasar tratamiento.
- **Prerrequisitos**: `nutr.mediterranean`, `nutr.obesity`, `nutr.energy-availability`, `habits.tobacco-alcohol`, `habits.exercise`, `gut.celiac`
- **Nivel**: N2
- **Etiquetas**: IMC, pérdida de peso, bajo peso/RED-S, tabaco, alcohol, cafeína, resistencia a insulina, celiaquía
- **Alias**: ES estilo de vida, dieta para la fertilidad · EN lifestyle intervention, fertility diet, weight loss before IVF
- **Anclas**: [S21] NICE NG257 (sección BMI 1.10.x y hábitos; secciones de celiaquía — leer redacción); [S07] ESHRE endometriosis (estilo de vida saludable — Weak); [S04] RIF (revisar y optimizar hábitos cuando aparece RIF); [S37] guía SOP 2023 (estilo de vida); [S18] AUA/ASRM Statement 8 (hábitos, datos limitados — Conditional; Grade C). Revisiones sobre dieta mediterránea/obesidad y TRA [PV-09].
- **Desenlaces**: con frecuencia `OVU`/`CPR`; `LBR` escaso — explicitar.
- **Regla editorial**: spec 02/06 — no culpabilizar; no "relájate y quedarás embarazada".

#### C3 `fert.supplements-female`
- **Título**: Suplementos en la mujer con deseo reproductivo / *Supplements for female fertility*
- **Objetivo**: Distinguir corrección de déficit (ácido fólico, yodo, vitamina D si déficit) del uso empírico (antioxidantes, CoQ10, mio-inositol, DHEA, melatonina) y su posición en guías.
- **Prerrequisitos**: `supp.folate`, `supp.inositol`, `supp.vitamin-d`, `supp.coq10`, `supp.dhea`, `supp.antioxidants`
- **Nivel**: N2–N3
- **Etiquetas**: antioxidantes, mio-inositol, CoQ10, DHEA, vitamina D, melatonina, omega-3
- **Alias**: ES nutracéuticos, multivitamínico preconcepcional · EN fertility supplements, adjuvants
- **Anclas**: [S24] Cochrane antioxidantes mujer 2020 (63 ECA, 7760 mujeres; `LBR` incierto, certeza muy baja); [S26] Cochrane inositol en SOP 2018 (sin evidencia de alta calidad pre-FIV/IO); [S27] Cochrane andrógenos 2024 (DHEA probablemente sin diferencia en `LBR`); [S03] ESHRE UI (antioxidantes *probably not recommended*, Conditional); [S01] add-ons (antioxidantes no recomendados en TRA; complementarias no recomendadas); [S05] OS 2025 (mio-inositol no recomendado en bajas respondedoras ni en no-SOP; DHEA no recomendada en bajas respondedoras); [S02] RPL (vitamina D profiláctica puede considerarse en asesoramiento preconcepcional — GPP; multivitamínicos seguros en embarazo — GPP).
- **Desenlaces**: separar `BIO`/`CPR`/`LBR` por suplemento; dosis **solo** si la fuente la verifica.

#### C4 `fert.supplements-male`
- **Título**: Suplementos y antioxidantes en el varón / *Supplements and antioxidants for male fertility*
- **Objetivo**: Explicar por qué mejoras en `SEM` no equivalen a `LBR` y cómo difieren Cochrane, ESHRE y AUA/ASRM.
- **Prerrequisitos**: `fert.male-semen`, `supp.antioxidants`
- **Nivel**: N2–N3
- **Etiquetas**: antioxidantes, zinc, selenio, CoQ10, L-carnitina, estrés oxidativo, fragmentación ADN
- **Alias**: ES suplementación masculina · EN male antioxidant therapy
- **Anclas**: [S25] Cochrane antioxidantes varón 2022 (90 ECA, 10 303 varones; "puede asociarse" a mayor `LBR/CPR`, evidencia incierta); [S18] AUA/ASRM Statement 45 (beneficio de suplementos "de utilidad clínica cuestionable" — *Moderate; Grade B*); [S03] ESHRE UI (antioxidantes en varones *probably not recommended*, Conditional); [S01] add-ons (*not recommended in ART*).
- **Desenlaces**: `SEM` vs `LBR`. **Discrepancia** [D-02].

#### C5 `fert.environment-exposures` `[añadido]`
- **Título**: Exposiciones ambientales y ocupacionales en fertilidad / *Environmental and occupational exposures*
- **Motivo de añadido**: spec 02 §15 (Ambiente) es transversal; fertilidad es donde más alarmismo y pruebas comerciales aparecen.
- **Objetivo**: Diferenciar datos humanos vs animales, reducir exposición de forma proporcionada y evitar detox/quelación.
- **Prerrequisitos**: `env.endocrine-disruptors`
- **Nivel**: N2
- **Etiquetas**: disruptores endocrinos, calor testicular, ocupacional, tabaco
- **Alias**: ES tóxicos ambientales · EN EDCs, reproductive toxicants
- **Anclas**: [S18] AUA/ASRM Statement 8; posiciones FIGO/ACOG sobre tóxicos ambientales [PV-10].
- **Desenlaces**: mayoritariamente asociación (observacional); marcarlo.

### Bloque D — Tratamiento

#### D1 `fert.iui`
- **Título**: Inseminación intrauterina (IUI) / *Intrauterine insemination*
- **Objetivo**: Indicar IUI (natural vs con estimulación), limitar riesgo de gestación múltiple y saber cuándo pasar a FIV.
- **Prerrequisitos**: `fert.ovulation`, `fert.unexplained`, `fert.tubal-factor`
- **Nivel**: N2
- **Etiquetas**: IUI-OS, gonadotropinas, letrozol, cancelación por respuesta multifolicular, donante de semen
- **Alias**: ES inseminación artificial (IA), IAC/IAD · EN IUI, IUI with ovarian stimulation (IUI-OS), donor insemination
- **Anclas**: [S03] ESHRE UI; [S07] ESHRE endometriosis (IUI-OS en I/II, Weak); [S21] NICE NG257.
- **Desenlaces**: `LBR`, `SAFE` (gemelaridad).

#### D2 `fert.ivf-icsi`
- **Título**: FIV e ICSI: indicaciones, laboratorio y límites / *IVF and ICSI*
- **Objetivo**: Explicar el proceso de FIV, indicaciones de ICSI y por qué ICSI no se recomienda en factor no masculino.
- **Prerrequisitos**: `fert.iui`, `fert.male-semen`
- **Nivel**: N2
- **Etiquetas**: FIV convencional, ICSI, cultivo a blastocisto, vitrificación, criterios de acceso
- **Alias**: ES fecundación in vitro, microinyección espermática · EN in vitro fertilisation, intracytoplasmic sperm injection
- **Anclas**: [S01] add-ons (*ICSI is not recommended for non-male factor infertility*); [S03] ESHRE UI (ICSI no recomendada sobre FIV en UI — Strong); [S21] NICE NG257 (criterios de FIV hasta los 42 años y supuestos — leer texto completo).
- **Desenlaces**: `LBR`, `CLBR`, `SAFE`.

#### D3 `fert.stimulation-ohss`
- **Título**: Estimulación ovárica para FIV/ICSI y prevención del SHO / *Ovarian stimulation and OHSS prevention*
- **Objetivo**: Individualizar protocolo según AMH/AFC, prevenir SHO (antagonista, desencadenante con agonista + congelación total) y conocer adyuvantes no recomendados.
- **Prerrequisitos**: `fert.amh-afc`, `fert.ivf-icsi`, `pcos.diagnosis`
- **Nivel**: N3
- **Etiquetas**: antagonista, agonista, PPOS, trigger con agonista, freeze-all, SOP, metformina, letrozol adyuvante, apoyo lúteo
- **Alias**: ES síndrome de hiperestimulación ovárica (SHO/SHEO), estimulación ovárica controlada (EOC) · EN OHSS, controlled ovarian stimulation (COS), GnRH agonist trigger, freeze-all
- **Anclas**: [S05] ESHRE OS 2025 (121 recomendaciones; desenlaces críticos `CLBR`/`LBR` por ciclo iniciado y SHO moderado/grave; AFC o AMH para predecir alta/baja respuesta — Strong; trigger con agonista + freeze-all en riesgo de SHO — Strong; metformina *probably not recommended* en SOP con antagonista; letrozol añadido *probably not recommended*; aspirina no recomendada); [S06] ESHRE OS 2019; [S15] ASRM prevención SHO 2023/2024.
- **Desenlaces**: `CLBR`, `SAFE` (SHO).

#### D4 `fert.embryo-transfer` `[añadido]`
- **Título**: Transferencia embrionaria: número de embriones, transferencia diferida y gestación múltiple / *Embryo transfer and number of embryos*
- **Motivo de añadido**: la gestación múltiple es el principal riesgo evitable de la TRA; ESHRE tiene guía específica.
- **Objetivo**: Defender transferencia de embrión único electiva y entender cuándo freeze-all es indicación (SHO) vs add-on.
- **Prerrequisitos**: `fert.ivf-icsi`, `fert.stimulation-ohss`
- **Nivel**: N2
- **Etiquetas**: eSET, gemelaridad, TEC/FET, ciclo natural vs sustituido, ácido hialurónico en medio de transferencia
- **Alias**: ES transferencia de embrión único (SET), transferencia de embriones congelados (TEC) · EN eSET, frozen embryo transfer (FET)
- **Anclas**: [S11] ESHRE guía número de embriones a transferir (35 recomendaciones y puntos de buena práctica); [S01] add-ons (freeze-all electivo *currently not recommended for routine clinical use*; ácido hialurónico en medio de transferencia *recommended*, con monitorización de tasa de gestación múltiple). ESHRE guía de TEC **en desarrollo** [PV-06].
- **Desenlaces**: `LBR`, `CLBR`, `SAFE` (múltiples; trastornos hipertensivos asociados a freeze-all según tabla del GPR).

#### D5 `fert.pgt` `[añadido]`
- **Título**: Diagnóstico genético preimplantacional (PGT-A/M/SR) y cribado de portadores / *Preimplantation genetic testing and carrier screening*
- **Motivo de añadido**: PGT-A es el add-on más vendido; PGT-M/SR tienen indicaciones claras. Sin este microtema no se entiende RIF ni RPL.
- **Objetivo**: Distinguir PGT-M/SR (indicación genética) de PGT-A (cribado de aneuploidías, no rutinario).
- **Prerrequisitos**: `fert.ivf-icsi`
- **Nivel**: N3
- **Etiquetas**: PGT-A, PGT-M, PGT-SR, mosaicismo, niPGT, cribado de portadores
- **Alias**: ES DGP, cribado genético preimplantacional · EN PGT-A, PGS (histórico), PGD (histórico), expanded carrier screening
- **Anclas**: [S01] add-ons (PGT-A *currently not recommended for routine clinical use*; niPGT ídem; mtDNA ídem); [S04] RIF (PGT-A *can be considered*; si anomalía cromosómica parental → consejo genético y PGT recomendado). GPR ESHRE PGT (actualización en desarrollo) y mosaicismo [PV-11].
- **Desenlaces**: `LBR` por transferencia vs por ciclo iniciado (`CLBR`), `MIS`.

#### D6 `fert.preservation`
- **Título**: Preservación de la fertilidad (oncológica, benigna y planificada) / *Fertility preservation*
- **Objetivo**: Ofrecer asesoramiento temprano en tratamientos gonadotóxicos y orientar la vitrificación de ovocitos planificada sin usar AMH como argumento de venta.
- **Prerrequisitos**: `fert.amh-afc`, `fert.stimulation-ohss`
- **Nivel**: N2–N3
- **Etiquetas**: vitrificación de ovocitos, criopreservación de tejido ovárico, estimulación de inicio aleatorio, letrozol en cáncer de mama, endometriosis, personas trans
- **Alias**: ES congelación de óvulos, preservación social (término desaconsejado) · EN oocyte cryopreservation, planned/elective OC, ovarian tissue cryopreservation (OTC)
- **Anclas**: [S08] ESHRE FFP 2020 (78 recomendaciones; mujeres y hombres trans); [S05] OS 2025 (pregunta de preservación dividida en tres: gonadotóxicos, OC electiva, donación; inicio aleatorio si no hay transferencia en fresco — GPP); [S17] ASRM ética OC planificada 2024; [S12] ASRM (marcadores no deben usarse para promover OC planificada); [S07] endometriosis (posible beneficio de preservación).
- **Desenlaces**: `BIO` (ovocitos vitrificados), `LBR` por ovocito/por paciente (dato escaso; citar fuente).

#### D7 `fert.third-party` `[añadido]`
- **Título**: Reproducción con donantes y otras vías de formación familiar / *Third-party reproduction and diverse family building*
- **Motivo de añadido**: NICE NG257 es explícitamente inclusiva (orientación sexual, estado de pareja, identidad de género); donación de ovocitos es la opción con mejor `LBR` en IOP/baja reserva; marco legal España/Argentina relevante.
- **Objetivo**: Conocer donación de gametos/embriones, información al donante/receptor y vías para parejas del mismo sexo, personas solas y personas trans.
- **Prerrequisitos**: `fert.ivf-icsi`, `fert.preservation`
- **Nivel**: N2
- **Etiquetas**: donación de ovocitos, semen de donante, ROPA, anonimato, gestación subrogada (legalidad variable)
- **Alias**: ES ovodonación, método ROPA · EN oocyte donation, donor sperm, reciprocal IVF
- **Anclas**: [S21] NICE NG257 (ámbito inclusivo); ESHRE GPR *Information provision in donation* (página listada en ESHRE; contenido no leído) [PV-14]; legislación España (Ley 14/2006) y Argentina (Ley 26.862) [PV-15].
- **Desenlaces**: `LBR`; aspectos éticos/legales.

### Bloque E — Implantación, pérdida gestacional y add-ons

#### E1 `fert.rif`
- **Título**: Implantación y fallo recurrente de implantación (RIF) / *Implantation and recurrent implantation failure*
- **Objetivo**: Aplicar la definición ESHRE de RIF basada en el pronóstico individual y priorizar investigaciones recomendadas sobre pruebas comerciales.
- **Prerrequisitos**: `fert.embryo-transfer`, `fert.uterine-factor`, `fert.pgt`
- **Nivel**: N3
- **Etiquetas**: definición RIF, endometritis crónica, endometrio fino, APS, trombofilia, progesterona lútea
- **Alias**: ES fallo de implantación repetido (FIR) · EN RIF, repeated implantation failure
- **Anclas**: [S04] ESHRE RIF 2023: RIF definida como el escenario en que la transferencia de embriones considerados viables no ha logrado prueba de embarazo positiva con suficiente frecuencia en una paciente concreta como para justificar investigar/intervenir; umbral de riesgo acumulado propuesto (60 %) para asesorar; códigos verde/naranja/rojo. *Can be considered*: endometritis crónica (y antibióticos si se diagnostica), progesterona lútea, tiroides, APA/APS (recomendado si factores de riesgo), cariotipo, histeroscopia, PGT-A, blastocisto. *Not recommended*: NK periférico y uterino, citoquinas, HLA-C, perfil de microbioma uterino/vaginal, ADN espermático y FISH, G-CSF, PRP intrauterino, PBMC, hCG intrauterina, IVIG, intralípidos, HBPM, scratching, assisted hatching.
- **Desenlaces**: `LBR`, `CLBR`.

#### E2 `fert.rpl`
- **Título**: Pérdida gestacional recurrente (RPL) / *Recurrent pregnancy loss*
- **Objetivo**: Estudiar y tratar RPL (≥2 pérdidas) según ESHRE 2022, incluyendo cuándo hay tratamiento con evidencia (APS) y cuándo no.
- **Prerrequisitos**: `preg.early-pregnancy`, `fert.endocrine-comorbidities`, `fert.uterine-factor`
- **Nivel**: N2–N3
- **Etiquetas**: APS, aspirina + heparina, progesterona vaginal, TSH/TPO, cariotipo, malformación uterina, factor masculino
- **Alias**: ES aborto de repetición, aborto recurrente · EN recurrent miscarriage, RPL
- **Anclas**: [S02] ESHRE RPL 2022 (Goddijn et al.; HRO hoad002; 39 recomendaciones de investigación + 38 de tratamiento). Ejemplos verificados: APS + ≥3 pérdidas → aspirina 75–100 mg/día preconcepcional + heparina profiláctica desde test positivo (Conditional); progesterona vaginal *may improve* `LBR` con ≥3 pérdidas y sangrado en embarazo siguiente (Conditional); heparina o aspirina no recomendadas en RPL inexplicada (Strong); glucocorticoides no recomendados (Strong); NK: *insufficient evidence to recommend* (Strong); intralípidos: evidencia insuficiente (Strong); G-CSF y scratching sin evidencia; levotiroxina no mejora `LBR` en autoinmunidad eutiroidea; vitamina D profiláctica puede considerarse (GPP). [S18] AUA/ASRM Statement 20 (varón en RPL: cariotipo y ADN espermático). [S30] Cochrane inmunoterapia 2014.
- **Desenlaces**: `LBR`, `MIS`.

#### E3 `fert.addons-overview`
- **Título**: Add-ons en reproducción asistida: marco de evaluación / *IVF add-ons: evaluation framework*
- **Objetivo**: Definir add-on, conocer escalas ESHRE y HFEA y hacer preguntas críticas (desenlace, población, coste, daño, conflicto de interés).
- **Prerrequisitos**: `fert.outcomes-live-birth`, `found.critical-appraisal`
- **Nivel**: N3
- **Etiquetas**: add-ons, coste, consentimiento informado, conflicto de interés
- **Alias**: ES complementos/técnicas adicionales en FIV · EN IVF add-ons, adjuvants
- **Anclas**: [S01] ESHRE GPR add-ons 2023 (42 recomendaciones; definición de add-on como extra opcional, generalmente pagado por la paciente, no necesario clínicamente); [S31] HFEA (sistema verde/amarillo/gris/negro/rojo desde 2023).
- **Desenlaces**: metaevaluación de `LBR` y `SAFE`.

#### E4 `fert.immunology-nk`
- **Título**: Inmunología reproductiva: células NK, citoquinas, HLA e inmunomoduladores / *Reproductive immunology: NK cells and immunotherapies*
- **Objetivo**: Explicar la hipótesis inmunológica y por qué pruebas NK y tratamientos (IVIG, intralípidos, corticoides, anti-TNF) no se recomiendan en TRA/RIF.
- **Prerrequisitos**: `fert.addons-overview`, `fert.rif`, `fert.rpl`
- **Nivel**: N3
- **Etiquetas**: NK periféricas, uNK, KIR/HLA, IVIG, intralípidos, prednisolona, tacrolimus
- **Alias**: ES "útero hostil" (término no científico, solo como alias de búsqueda) · EN NK cell testing, immunotherapy, intralipid, IVIG
- **Anclas**: [S01], [S04], [S02], [S30].
- **Desenlaces**: `LBR`, `SAFE`.
- **Matiz que exige revisión humana [D-03]**: RPL 2022 incluye recomendación *Conditional*: "repeated and high doses of IvIg very early in pregnancy may improve live birth rate in women with 4 or more unexplained RPL", mientras add-ons y RIF dicen IVIG *not recommended* en TRA/RIF. Distinta población (RPL ≥4 vs TRA/RIF) — enseñar la diferencia, no fusionar.

#### E5 `fert.endometrial-receptivity`
- **Título**: Receptividad endometrial y pruebas tipo ERA / *Endometrial receptivity testing (ERA and similar)*
- **Objetivo**: Conocer la ventana de implantación, el diseño de los estudios de transferencia personalizada y la posición ESHRE.
- **Prerrequisitos**: `horm.luteal-phase`, `fert.rif`
- **Nivel**: N3
- **Etiquetas**: ventana de implantación, transcriptómica, pET, progesterona
- **Alias**: ES test de receptividad endometrial, transferencia personalizada · EN ERA, endometrial receptivity analysis, personalized embryo transfer (pET), window of implantation (WOI)
- **Anclas**: [S01] (*The presently available endometrial receptivity tests are not recommended*); [S04] RIF (no hay datos suficientes para recomendar el uso rutinario de ninguna prueba comercial; la evaluación de aspectos específicos de la función endometrial *can be considered*).
- **Desenlaces**: `LBR`, `CLBR` (resultados divergentes ITT vs por protocolo — explicar).
- **Matiz [D-04]**: formulación de add-ons (no recomendado) vs RIF (pruebas comerciales no rutinarias, pero evaluación específica "can be considered").

#### E6 `fert.endometrial-microbiome`
- **Título**: Microbioma endometrial y vaginal; endometritis crónica / *Endometrial and vaginal microbiome; chronic endometritis*
- **Objetivo**: Diferenciar endometritis crónica (puede considerarse estudiar/tratar en RIF) del perfil de microbioma (no recomendado).
- **Prerrequisitos**: `gut.microbiota-basics`, `fert.rif`
- **Nivel**: N3
- **Etiquetas**: Lactobacillus, CD138, antibióticos, probióticos vaginales, pruebas comerciales
- **Alias**: ES microbiota endometrial · EN endometrial microbiome (EMMA/ALICE como marcas — solo alias de búsqueda, sin respaldo), chronic endometritis (CE)
- **Anclas**: [S04] RIF (*Uterine and vaginal microbiome profiling is not recommended*; evaluación de endometritis crónica *can be considered*; antibióticos *can be considered* si se diagnostica). El GPR de add-ons 2023 **no** contiene recomendación sobre microbioma en la extracción de texto realizada (verificado por búsqueda textual; confirmar visualmente).
- **Desenlaces**: `LBR` (sin datos sólidos), `CPR`.

#### E7 `fert.prp-regenerative`
- **Título**: PRP, G-CSF, células madre y otras terapias "regenerativas" / *PRP, G-CSF, stem cells and other regenerative add-ons*
- **Objetivo**: Conocer la racionalidad y la posición negativa actual de PRP intrauterino/intraovárico, G-CSF, células madre y activación in vitro.
- **Prerrequisitos**: `fert.addons-overview`, `fert.dor-poi`
- **Nivel**: N3
- **Etiquetas**: PRP intraovárico, PRP intrauterino, G-CSF, endometrio fino, rejuvenecimiento ovárico
- **Alias**: ES plasma rico en plaquetas, "rejuvenecimiento ovárico" · EN platelet-rich plasma, ovarian rejuvenation, IVA
- **Anclas**: [S01] (PRP intrauterino e intraovárico: *not recommended*; G-CSF intrauterino: *not recommended*; células madre para IOP/baja reserva/endometrio fino: *not recommended*; activación in vitro de folículos: *not recommended*); [S04] (G-CSF y PRP: *not recommended* en RIF); [S02] (G-CSF en RPL: sin evidencia).
- **Desenlaces**: `CPR` (algunos estudios), `LBR` sin evidencia; `SAFE` desconocida.

#### E8 `fert.scratching-other-addons`
- **Título**: Scratching endometrial, hCG intrauterina, assisted hatching, time-lapse y otros / *Endometrial scratching and other common add-ons*
- **Objetivo**: Contrastar cada add-on con su desenlace real y posición de ESHRE/Cochrane/HFEA.
- **Prerrequisitos**: `fert.addons-overview`
- **Nivel**: N3
- **Etiquetas**: scratching, hCG intrauterina, assisted hatching, time-lapse, embryo glue, IMSI, PICSI, MACS, microfluídica, plasma seminal, acupuntura
- **Alias**: ES lesión endometrial, eclosión asistida · EN endometrial injury/scratch, assisted hatching, time-lapse imaging, EmbryoGlue (marca)
- **Anclas**: [S01] (ver tabla §4); [S28] Cochrane lesión endometrial en FIV 2021 (`LBR` OR 1,12; IC95 % 0,98–1,28; certeza moderada; análisis restringido a bajo riesgo de sesgo); [S29] Cochrane lesión endometrial en IUI/coito 2022 (solo metadatos); [S03] UI (*should not be offered*, Strong); [S21] NICE NG257 (revisión de evidencia P: scratching como add-on — leer recomendación).
- **Desenlaces**: `LBR`, `CPR`, `SAFE` (dolor, sangrado).

### Bloque F — Resultados, comunicación y lectura crítica

#### F1 `fert.outcomes-live-birth`
- **Título**: Resultados clínicos: del biomarcador al nacido vivo / *Clinical outcomes: from biomarker to live birth*
- **Objetivo**: Leer cualquier estudio de fertilidad identificando denominador (por ciclo iniciado, punción, transferencia, mujer) y desenlace (BIO→`LBR`/`CLBR`).
- **Prerrequisitos**: `found.critical-appraisal`
- **Nivel**: N2 (transversal: se recomienda cursar temprano)
- **Etiquetas**: nacido vivo, acumulado, denominadores, desenlaces sustitutos, glosario
- **Alias**: ES tasa de recién nacido vivo (RNV), tasa acumulada · EN live birth rate (LBR), cumulative LBR, surrogate outcomes
- **Anclas**: [S32] IMPRINT/Harbin 2014 (nacido vivo como desenlace primario preferido; daños a todos los participantes; datos de ambos miembros); [S33] Glosario internacional 2017; [S05] OS 2025 (desenlaces críticos `CLBR`/`LBR` por ciclo iniciado + SHO).
- **Desenlaces**: conceptual.

#### F2 `fert.mental-health-communication`
- **Título**: Salud mental, comunicación de pronóstico y abandono del tratamiento / *Mental health, prognosis communication and treatment discontinuation*
- **Objetivo**: Integrar atención psicosocial rutinaria, comunicar malas noticias y probabilidades, y evitar culpabilizar (estrés, "relájate").
- **Prerrequisitos**: `habits.motivational-interviewing`, `found.shared-decision`
- **Nivel**: N2
- **Etiquetas**: ansiedad, depresión, duelo perinatal, abandono, comunicación de riesgos, fin del tratamiento
- **Alias**: ES apoyo psicológico en reproducción · EN psychosocial care, fertility counselling, dropout
- **Anclas**: [S09] ESHRE atención psicosocial rutinaria 2015 (120 recomendaciones; actualización **en desarrollo** según la página ESHRE); [S21] NICE NG257 (información y apoyo); [S12] ASRM (no generar ansiedad con AMH).
- **Desenlaces**: bienestar, abandono; no `LBR`.

#### F3 `fert.art-pregnancy-risks` `[añadido]`
- **Título**: Embarazo tras TRA: riesgos perinatales, gestación múltiple y seguimiento / *Pregnancy after ART: perinatal risks*
- **Motivo de añadido**: continuidad con macrotema 14; riesgos (múltiples, trastornos hipertensivos tras freeze-all/ciclo sustituido, ectópico/heterotópico) son contenido de seguridad.
- **Objetivo**: Informar riesgos obstétricos y neonatales asociados a la TRA y a cada estrategia, y el seguimiento inicial.
- **Prerrequisitos**: `fert.embryo-transfer`, `preg.early-pregnancy`
- **Nivel**: N2
- **Etiquetas**: gemelaridad, preeclampsia, ectópico, heterotópico, PEG/GEG
- **Alias**: EN ART perinatal outcomes
- **Anclas**: [S01] (tabla: freeze-all asociado a mayor riesgo de trastorno hipertensivo, GEG y mayor peso al nacer); [S11] ESHRE número de embriones; revisiones de resultados perinatales [PV-16].
- **Desenlaces**: `SAFE`.

#### F4 `fert.critical-appraisal-repro` `[añadido]`
- **Título**: Lectura crítica en medicina reproductiva y discrepancias entre guías / *Critical appraisal in reproductive medicine*
- **Motivo de añadido**: spec 02 exige presentar discrepancias sin falsa equivalencia; fertilidad tiene muchas (testosterona, antioxidantes en varón, ERA, IVIG, DHEA entre versiones Cochrane).
- **Objetivo**: Resolver casos de discrepancia explicando población, desenlace, fecha de búsqueda y escala de recomendación de cada fuente.
- **Prerrequisitos**: `fert.outcomes-live-birth`, `fert.addons-overview`
- **Nivel**: N3
- **Etiquetas**: GRADE, versiones Cochrane, ITT vs por protocolo, conflicto de interés, desenlaces sustitutos
- **Alias**: EN evidence appraisal, guideline discrepancies
- **Anclas**: §3.3 discrepancias D-01 a D-05; [S27] (cambio de conclusión DHEA 2015→2024).
- **Desenlaces**: conceptual.

#### F5 `fert.ethics-access` `[añadido]`
- **Título**: Ética, acceso, coste y marco legal / *Ethics, access, cost and legal framework*
- **Motivo de añadido**: decisiones reproductivas dependen de acceso público/privado, límites de edad y legislación (España/Argentina).
- **Objetivo**: Conocer criterios de acceso y límites legales relevantes para la práctica en España y Argentina.
- **Prerrequisitos**: `fert.ivf-icsi`, `fert.third-party`
- **Nivel**: N2
- **Etiquetas**: financiación pública, límites de edad, consentimiento, coste de add-ons
- **Anclas**: [PV-15]. **Microtema pendiente**: no redactar contenido hasta verificar normativa vigente.

**Recuento**: 39 microtemas en 6 bloques. 27 cubren los ítems de spec 02 §13 (varios ítems se desdoblaron: uterino/tubárico, IUI/FIV, add-ons en 6 microtemas). 12 están marcados `[añadido]`: male-clinical, natural-fertility, adenomyosis-fibroids, dor-poi, endocrine-comorbidities, environment-exposures, embryo-transfer, pgt, third-party, art-pregnancy-risks, critical-appraisal-repro, ethics-access. Mapeo spec→ids:

| Ítem spec 02 §13 | id(s) |
|---|---|
| Evaluación de pareja | `fert.couple-evaluation` |
| Edad/tiempos, no retrasar | `fert.age-timing` |
| AMH/AFC y límites | `fert.amh-afc` |
| Ovulación | `fert.ovulation` |
| Factor uterino/tubárico | `fert.uterine-factor`, `fert.tubal-factor` |
| Varón/semen | `fert.male-semen` (+ `fert.male-clinical` añadido) |
| Infertilidad inexplicada | `fert.unexplained` |
| Endometriosis | `fert.endometriosis` |
| Preconcepción/medicación/vacunas/comorbilidades | `fert.preconception` (+ `fert.endocrine-comorbidities`) |
| Nutrición/gastro/metabolismo/hábitos | `fert.lifestyle-nutrition-metabolism` |
| Suplementos mujer/varón | `fert.supplements-female`, `fert.supplements-male` |
| Preservación | `fert.preservation` |
| IUI/FIV/ICSI | `fert.iui`, `fert.ivf-icsi` |
| Estimulación/OHSS | `fert.stimulation-ohss` |
| Implantación/fallos recurrentes | `fert.rif` |
| Pérdida gestacional recurrente | `fert.rpl` |
| Inmunología/NK/receptividad/microbioma/PRP/add-ons | `fert.addons-overview`, `fert.immunology-nk`, `fert.endometrial-receptivity`, `fert.endometrial-microbiome`, `fert.prp-regenerative`, `fert.scratching-other-addons` |
| Resultados clínicos/nacido vivo | `fert.outcomes-live-birth` |
| Salud mental/comunicación | `fert.mental-health-communication` |

---

## 3. Registro de fuentes

### 3.1 Verificadas en esta sesión (2026-10-12)

"Nivel de verificación": **TC** = texto completo leído/extraído (PDF oficial o PMC/Europe PMC) y redacción citada comprobada en el texto; **RES** = resumen/abstract o página oficial leída; **META** = metadatos bibliográficos confirmados (DOI/año/revista) vía búsqueda, contenido no leído en profundidad. Todas con fecha de acceso **2026-10-12**.

| ID | Título | Autor/entidad | Año | URL / DOI | Tipo | Población | Desenlace relevante | Verif. | Limitaciones |
|---|---|---|---|---|---|---|---|---|---|
| S01 | Good practice recommendations on add-ons in reproductive medicine | ESHRE Add-ons Working Group; Lundin K, et al. | 2023 | https://doi.org/10.1093/humrep/dead184 · Hum Reprod 2023;38(11):2062–2104 · copia OA: https://discovery.ucl.ac.uk/10178220/1/dead184.pdf · página: https://www.eshre.eu/Guidelines-and-Legal/Guidelines/Addons | GPR (buenas prácticas, no guía GRADE completa) | Pacientes en TRA | `LBR`/`CPR`, `MIS`, seguridad | TC | GPR basadas en revisión + consenso; escala propia de 4 niveles; búsqueda hasta ~2023; evidencia cambia rápido |
| S02 | ESHRE guideline: recurrent pregnancy loss: an update in 2022 | ESHRE RPL GDG; Goddijn M (coord.) et al. | 2023 (update 2022) | https://doi.org/10.1093/hropen/hoad002 · PDF: https://www.eshre.eu/-/media/sitecore-files/Guidelines/Recurrent-pregnancy-loss/2022/ESHRE-RPL-Guideline-_-Update-2022_-Final-Version-January-2023_v2.pdf | Guía basada en evidencia | Mujeres/parejas con ≥2 pérdidas (excluye ectópico y molar) | `LBR`, `MIS` | TC | Evidencia hasta 28-02-2022; extracción de texto de tablas a dos columnas: confirmar visualmente fuerza de cada recomendación antes de tarjeta |
| S03 | Evidence-based guideline: unexplained infertility | ESHRE GG on UI; Romualdi D, et al. | 2023 | https://doi.org/10.1093/humrep/dead150 · Hum Reprod 2023;38(10):1881–1890 · PDF: https://www.eshre.eu/-/media/sitecore-files/Guidelines/UI/UI-guideline_-Final.pdf | Guía | Parejas con UI | `LBR`, `CPR`, fecundabilidad | TC | Búsqueda hasta 24-10-2022; solo inglés |
| S04 | ESHRE good practice recommendations on recurrent implantation failure | ESHRE Working Group on RIF; Cimadomo D, et al. | 2023 | https://doi.org/10.1093/hropen/hoad023 · PMC10270320 | GPR | Pacientes con RIF tras TRA | `LBR` | TC (Europe PMC XML) | Basada en literatura + encuesta + experiencia; "not recommended" = no rutinario, no prohibido (aclaración explícita del documento) |
| S05 | Ovarian stimulation for IVF/ICSI — update 2025 | ESHRE Guideline Group on Ovarian Stimulation; Ata B, Bosch E, …, Broekmans F | 2025 (publ. revista 2026) | PDF ESHRE (v23, sept. 2026): https://www.eshre.eu/-/media/sitecore-files/Guidelines/COS/2025/ESHRE-OS-guideline-updateSept-2026v23.pdf · página: https://www.eshre.eu/en/Guidelines-and-Legal/Guidelines/Ovarian-Stimulation-in-IVF-ICSI · Hum Reprod 2026 (abril) según repositorios | Guía | Mujeres en FIV/ICSI, donantes, preservación | `CLBR`/`LBR` por ciclo iniciado; SHO moderado/grave | TC | DOI de revista **no confirmado** (un resultado indica 10.1093/humrep/deag018; otro no lo halló) → [PV-02]; existen versiones v22 (nov-2025) y v23 (sept-2026): citar la vigente |
| S06 | ESHRE guideline: ovarian stimulation for IVF/ICSI (2019) | ESHRE GG on OS | 2020 | https://doi.org/10.1093/hropen/hoaa009 | Guía | FIV/ICSI | `LBR`, SHO | META | Superada por S05; solo uso histórico |
| S07 | ESHRE guideline: endometriosis | Becker CM, Bokor A, Heikinheimo O, Horne A, et al. | 2022 | https://doi.org/10.1093/hropen/hoac009 · PDF: https://www.eshre.eu/-/media/sitecore-files/Guidelines/Endometriosis/ESHRE-GUIDELINE-ENDOMETRIOSIS-2022_1.pdf | Guía | Mujeres con endometriosis | `LBR`, `CPR`, dolor | TC | Literatura hasta 01-12-2020 |
| S08 | ESHRE guideline: female fertility preservation | ESHRE GG on FFP; Anderson RA, et al. | 2020 | https://doi.org/10.1093/hropen/hoaa052 · PMC7666361 | Guía | Mujeres y hombres trans (cáncer, benignas, edad) | `BIO`, `LBR` | META/RES | Contenido de recomendaciones no leído en esta sesión |
| S09 | ESHRE guideline: routine psychosocial care in infertility and medically assisted reproduction — a guide for fertility staff | Gameiro S, Boivin J, et al. | 2015 | https://doi.org/10.1093/humrep/dev177 · Hum Reprod 2015;30(11):2476–85 | Guía | Pacientes en infertilidad/TRA | Bienestar, abandono | META/RES | Evidencia hasta 04-2014; actualización en desarrollo |
| S10 | (reservado — guía IOP 2024, ver PV-04) | — | — | — | — | — | — | — | — |
| S11 | ESHRE guideline on the number of embryos to transfer during IVF/ICSI | ESHRE (SIG Safety and Quality in ART) | 2024 | https://doi.org/10.1093/humrep/deae010 · https://www.eshre.eu/en/Guidelines-and-Legal/Guidelines/Embryo-transfer | Guía | FIV/ICSI | `LBR`, múltiples | RES (página ESHRE) | Año inferido del DOI/página; recomendaciones no leídas |
| S12 | Testing and interpreting measures of ovarian reserve: a committee opinion | ASRM Practice Committee | 2020 | https://doi.org/10.1016/j.fertnstert.2020.09.134 · Fertil Steril 2020;114(6):1151–1157 · https://asrm.org/practice-guidance/practice-committee-documents/testing-and-interpreting-measures-of-ovarian-reserve-a-committee-opinion-2020 | Opinión de comité | Mujeres con/sin infertilidad | `BIO` (ovocitos), fecundabilidad, `LBR` | RES (página ASRM) | Contexto EE. UU.; opinión de comité |
| S13 | Fertility evaluation of infertile women: a committee opinion | ASRM Practice Committee | 2021 | https://doi.org/10.1016/j.fertnstert.2021.08.038 · Fertil Steril 2021;116(5):1255–1265 | Opinión de comité | Mujeres infértiles | Proceso diagnóstico | META/RES | Contenido detallado no leído |
| S14 | Optimizing natural fertility: a committee opinion | ASRM Practice Committee | 2022 | https://doi.org/10.1016/j.fertnstert.2021.10.007 · Fertil Steril 2022;117:53–63 | Opinión de comité | Parejas sin infertilidad conocida | Fecundabilidad | META | Confirmado por listados secundarios; leer texto en ASRM |
| S15 | Prevention of moderate and severe ovarian hyperstimulation syndrome: a guideline | ASRM Practice Committee | 2023 (publ. 2024) | https://doi.org/10.1016/j.fertnstert.2023.11.013 · Fertil Steril 2024;121(2):230–245 | Guía (revisión sistemática) | FIV | `SAFE` (SHO) | RES | Grados ASRM; usa "PMOS" en web |
| S16 | Female age-related fertility decline. Committee Opinion No. 589 | ACOG Committee on Gynecologic Practice & ASRM Practice Committee | 2014 | PubMed 24559617 · Fertil Steril 2014;101:633–4 · Obstet Gynecol 2014;123:719–21 | Opinión de comité | Mujeres que buscan embarazo | Fecundidad por edad | RES | Antigua; reafirmación por verificar [PV-03] |
| S17 | Planned oocyte cryopreservation to preserve future reproductive potential: an Ethics Committee opinion | ASRM Ethics Committee | 2024 (©2023) | https://www.asrm.org/practice-guidance/ethics-opinions/planned-oocyte-cryopreservation/ · Fertil Steril 2024;121:604–12 | Opinión ética | Personas que consideran OC planificada | Ético; información de eficacia | RES | DOI no confirmado |
| S18 | Diagnosis and treatment of infertility in men: AUA/ASRM guideline (2020; amended 2024) | AUA/ASRM; Schlegel PN et al. (2021, partes I/II); enmienda: Brannigan RE et al. | 2020/2021; enm. 2024 | https://www.auanet.org/guidelines-and-quality/guidelines/male-infertility · Parte I: https://doi.org/10.1097/JU.0000000000001521 · Parte II: https://doi.org/10.1097/JU.0000000000001520 · Enmienda: https://doi.org/10.1097/JU.0000000000004180 | Guía | Varones infértiles | `SEM`, `CPR/LBR`, salud | RES (página AUA leída parcialmente) | Números de *Statement* y redacción tomados de resumen automático de la página: **confirmar redacción literal** antes de citar entre comillas |
| S19 | WHO laboratory manual for the examination and processing of human semen, 6th ed. | World Health Organization | 2021 | https://www.who.int/publications/i/item/9789240030787 · ISBN 978-92-4-003078-7 (electrónico) | Manual de laboratorio | Laboratorios/varones | `SEM` | RES | Manual técnico, no guía clínica; licencia CC BY-NC-SA 3.0 IGO |
| S20 | The sixth edition of the WHO manual for human semen analysis: a critical review and SWOT analysis | Boitrelle F, et al. | 2021 | https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8706130/ · Life 2021;11(12):1368 | Revisión crítica | — | `SEM` (interpretación) | RES | Opinión de autores; existe réplica (PMC9325183) |
| S21 | Fertility problems: assessment and treatment (NG257) | NICE | 31-03-2026 | https://www.nice.org.uk/guidance/ng257 · PDF: https://www.nice.org.uk/guidance/ng257/resources/fertility-problems-assessment-and-treatment-pdf-66144022104517 | Guía nacional (UK) | Personas con problemas de fertilidad (inclusiva) | `LBR`, proceso | TC parcial (PDF extraído; numeración de recs afectada por extracción) | **Reemplaza a CG156**; contexto NHS; numeración citada debe revisarse en la web |
| S22 | Fertility problems: assessment and treatment (CG156) | NICE | 2013; act. 2017 | https://www.nice.org.uk/guidance/cg156 | Guía (histórica) | — | — | META | **Sustituida por NG257**; no usar como fuente vigente |
| S23 | Association between biomarkers of ovarian reserve and infertility among older women of reproductive age | Steiner AZ, et al. | 2017 | https://doi.org/10.1001/jama.2017.14588 · JAMA 2017;318(14):1367–1376 | Cohorte prospectiva | Mujeres 30–44 a., sin infertilidad conocida, ≤3 meses intentando | Fecundabilidad, probabilidad acumulada a 6/12 ciclos | RES | No aplica a infertilidad conocida (SOP, tubárica, endometriosis excluidas) ni a TRA; discrepancia de N (981 inscritas vs ~750 analizadas) a confirmar en texto completo |
| S24 | Antioxidants for female subfertility | Showell MG, Mackenzie-Proctor R, Jordan V, Hart RJ | 2020 | https://doi.org/10.1002/14651858.CD007807.pub4 | RS Cochrane | 63 ECA, 7760 mujeres | `LBR`, `CPR`, `MIS` | RES | Certeza muy baja/baja; financiación declarada en 27/63 ECA |
| S25 | Antioxidants for male subfertility | de Ligny W, Smits RM, Mackenzie-Proctor R, et al. | 2022 | https://doi.org/10.1002/14651858.CD007411.pub5 | RS Cochrane | 90 ECA, 10 303 varones subfértiles | `LBR`, `CPR`, `SEM` | RES | GRADE detallado no leído; antioxidantes heterogéneos |
| S26 | Inositol for subfertile women with polycystic ovary syndrome | Showell MG, et al. | 2018 | https://doi.org/10.1002/14651858.CD012378.pub2 | RS Cochrane | Mujeres subfértiles con SOP | `LBR`, `OVU`, `CPR` | RES | No se comprobó si hay versión más reciente [PV-17] |
| S27 | Androgens (dehydroepiandrosterone or testosterone) for women undergoing assisted reproduction | Naik S, Lepine S, Nagels HE, Siristatidis CS, Kroon B, McDowell S | 2024 | https://doi.org/10.1002/14651858.CD009749.pub3 | RS Cochrane | 29 ECA; mayoría bajas respondedoras | `LBR/OPR`, `CPR`, `MIS` | RES | Versión 2015 (pub2) tenía conclusión más favorable para DHEA |
| S28 | Endometrial injury in women undergoing in vitro fertilisation (IVF) | Lensen SF, et al. | 2021 | https://doi.org/10.1002/14651858.CD009517.pub4 | RS Cochrane | Mujeres en FIV | `LBR` (OR 1,12; IC95 % 0,98–1,28; certeza moderada), `CPR`, `MIS` | RES | Discrepancia en nº de estudios entre PLS y abstract (24 vs 37) |
| S29 | Endometrial injury for pregnancy following sexual intercourse or intrauterine insemination | Bui BN, Lensen SF, et al. | 2022 | https://doi.org/10.1002/14651858.CD011424.pub4 | RS Cochrane | Coito/IUI | `LBR` | META | Resultados de la versión 2022 no leídos |
| S30 | Immunotherapy for recurrent miscarriage | Wong LF, Porter TF, Scott JR | 2014 | https://doi.org/10.1002/14651858.CD000112.pub3 | RS Cochrane | 20 ECA, 1137 mujeres con ≥3 abortos | `LBR`, `MIS` | RES | Ensayos 1985–2004; IVIG sin estimación separada en el resumen |
| S31 | Treatment add-ons (ratings) | HFEA (UK) | 2023 (sistema actual) | https://www.hfea.gov.uk/about-us/news-and-press-releases/2023/uk-fertility-regulator-launches-improved-ratings-for-fertility-treatment-add-ons/ | Regulador / información a pacientes | Pacientes UK | Varios (por add-on) | RES | Calificaciones individuales cambian; consultar página de cada add-on |
| S32 | Improving the Reporting of Clinical Trials of Infertility Treatments (IMPRINT): modifying the CONSORT statement | Harbin Consensus Conference Workshop Group (Legro RS, Wu X, et al.) | 2014 | https://doi.org/10.1093/humrep/deu218 · Hum Reprod 2014;29(10):2075–2082 | Consenso metodológico | Ensayos de infertilidad | `LBR` como desenlace primario preferido | RES | Co-publicado en Fertil Steril |
| S33 | The International Glossary on Infertility and Fertility Care, 2017 | Zegers-Hochschild F, Adamson GD, et al. | 2017 | https://doi.org/10.1093/humrep/dex234 | Glosario de consenso | — | Terminología | META | Existiría 4.ª edición 2026 (10.1093/humrep/deag029) → [PV-18] |
| S34 | Letrozole versus clomiphene for infertility in the polycystic ovary syndrome | Legro RS, et al. | 2014 | https://doi.org/10.1056/NEJMoa1313517 · N Engl J Med 2014;371:119–129 | ECA (n=750) | Mujeres con SOP | `LBR` acumulado 27,5 % vs 19,1 % | RES | Criterios de Rotterdam modificados; hasta 5 ciclos |
| S35 | Oil-based or water-based contrast for hysterosalpingography in infertile women | Dreyer K, et al. | 2017 | https://doi.org/10.1056/NEJMoa1612337 · N Engl J Med 2017;376:2043–2052 | ECA (n=1119) | Mujeres infértiles en HSG (Países Bajos) | `OPR` a 6 meses 39,7 % vs 29,1 % | RES | Desenlace `OPR` (no `LBR` primario); efecto se atenúa en el tiempo según seguimiento |
| S36 | Folic acid supplementation to prevent neural tube defects: USPSTF reaffirmation recommendation statement | USPSTF; Barry MJ, et al. | 2023 | https://doi.org/10.1001/jama.2023.12876 · JAMA 2023;330(5):454–459 | Recomendación preventiva | Personas que planifican o pueden quedar embarazadas | DTN (`SAFE` fetal) | RES | Contexto EE. UU.; no aplica a alto riesgo |
| S37 | Recommendations from the 2023 international evidence-based guideline for the assessment and management of PCOS | Teede HJ, Tay CT, et al. (International PCOS Network) | 2023 | https://doi.org/10.1093/humrep/dead156 · también Fertil Steril https://doi.org/10.1016/j.fertnstert.2023.07.025 | Guía internacional | SOP | `OVU`, `LBR`, metabólico | META | Recomendaciones de infertilidad no leídas en esta sesión (corresponde al mapa SOP) |

### 3.2 Por verificar (no usar en tarjetas hasta confirmar)

| ID | Pendiente | Motivo |
|---|---|---|
| PV-01 | Tabla de distribución/valores del manual OMS 2021 (concentración, total, motilidad, morfología) | No extraída del PDF de la OMS en esta sesión; no reproducir cifras de memoria |
| PV-02 | DOI de revista de la guía ESHRE OS 2025 (posible 10.1093/humrep/deag018; Hum Reprod 2026;41(4):498–514) | Fuentes discordantes en la búsqueda |
| PV-03 | Estado actual (reafirmación) de ACOG/ASRM CO 589 | Solo fuente secundaria (blog) menciona reafirmación 2022 |
| PV-04 | Guía internacional ESHRE/ASRM/IMS de IOP 2024 (página ESHRE muestra DOI 10.1016/j.fertnstert.2024.11.007 y PDF) | No se confirmó qué artículo corresponde a ese DOI ni se leyó |
| PV-05 | ESHRE GPR adenomiosis (partes 1 y 2) | "En desarrollo" según ESHRE |
| PV-06 | ESHRE GPR preconcepción en infertilidad; guía de transferencia de embriones congelados | "En desarrollo" según ESHRE |
| PV-07 | Fuentes de vacunación preconcepcional y teratógenos (CDC/ACOG/ministerios ES/AR) | No buscadas |
| PV-08 | Guías ATA 2017 / ETA sobre tiroides y embarazo/TRA | No buscadas |
| PV-09 | Revisiones sobre dieta (mediterránea), pérdida de peso pre-FIV, cafeína/alcohol y `LBR` | No buscadas; alta probabilidad de solo evidencia observacional |
| PV-10 | Posicionamientos FIGO/ACOG sobre tóxicos ambientales y reproducción | No buscados |
| PV-11 | ESHRE GPR PGT (y actualización), mosaicismo; Cochrane PGT-A | No leídos |
| PV-12 | Riesgos del contraste oleoso (embolia, hipotiroidismo por yodo en neonato) | No verificados |
| PV-13 | Redacción literal de NICE NG257 sobre UI, IUI y criterios de FIV | PDF extraído con numeración rota; leer en web |
| PV-14 | ESHRE GPR *Information provision in donation* | Solo vista en listado |
| PV-15 | Ley 14/2006 (España) y Ley 26.862 (Argentina) y normativa vigente | No verificadas en esta sesión |
| PV-16 | Revisiones de resultados perinatales tras TRA/FET | No buscadas |
| PV-17 | Versión vigente de Cochrane inositol (CD012378) y RS de CoQ10, vitamina D, melatonina, GH en bajas respondedoras | No comprobadas |
| PV-18 | Glosario internacional, 4.ª ed. 2026 (10.1093/humrep/deag029) | Mencionada por un resultado de búsqueda; no confirmada |
| PV-19 | Cochrane sobre IVIG/heparina/aspirina/corticoides en TRA y RIF; PRP | No buscadas |
| PV-20 | Guías EAU (Sexual and Reproductive Health) — varón | No buscadas; contraste europeo con AUA/ASRM |
| PV-21 | Guías de la SEF (España) y SAMeR (Argentina) | spec 02 pide contexto local; no buscadas |
| PV-22 | Endometriosis Fertility Index (Adamson & Pasta 2010) — artículo original | Citado por S07; no verificado |

### 3.3 Discrepancias detectadas (enseñar sin falsa equivalencia)

| ID | Tema | Fuente A | Fuente B | Clave para la tarjeta |
|---|---|---|---|---|
| D-01 | Testosterona en bajas respondedoras | Cochrane 2024 [S27]: "probablemente mejora" `LBR` y `CPR` | ESHRE OS 2025 [S05]: *probably not recommended* (Conditional) | Diferente fecha de corte, criterios y valoración de certeza/beneficio-riesgo; requiere juicio de especialista |
| D-02 | Antioxidantes en el varón | Cochrane 2022 [S25]: pueden asociarse a mayor `LBR` (evidencia incierta) | ESHRE UI [S03] *probably not recommended*; add-ons [S01] *not recommended in ART*; AUA/ASRM [S18] "utilidad clínica cuestionable" | Mejoras en `SEM` ≠ `LBR`; heterogeneidad de productos |
| D-03 | IVIG | RPL 2022 [S02]: *may improve* `LBR` con ≥4 pérdidas inexplicadas, dosis altas repetidas muy temprano (Conditional) | Add-ons [S01] y RIF [S04]: IVIG *not recommended*; Cochrane 2014 [S30] sin beneficio en RPL | Poblaciones distintas; coste/seguridad (hemoderivado) |
| D-04 | Receptividad endometrial | Add-ons [S01]: pruebas actuales *not recommended* | RIF [S04]: uso rutinario no recomendado, pero "evaluación de aspectos específicos… can be considered" | Matiz de redacción, no contradicción frontal |
| D-05 | DHEA | Cochrane 2015 (pub2): asociada a mayor `LBR/OPR` | Cochrane 2024 (pub3): probablemente sin diferencia; ESHRE OS 2025: no recomendada en bajas respondedoras (Strong) | Ejemplo docente de cómo cambian conclusiones con más ECA |
| D-06 | PGT-A | Add-ons [S01]: no rutinario | RIF [S04]: *can be considered* | Población RIF vs general |
| D-07 | Histeroscopia | Add-ons [S01]: cribado no rutinario; UI [S03] no recomendada (Strong) | Add-ons y RIF: *can be considered* en RIF | Población |

---

## 4. Posiciones ESHRE sobre add-ons (verificadas)

Fuente principal: **[S01] ESHRE Add-ons GPR 2023** — https://www.eshre.eu/Guidelines-and-Legal/Guidelines/Addons · https://doi.org/10.1093/humrep/dead184. Redacción extraída del texto completo (copia OA de UCL Discovery) mediante extracción automática de PDF y búsqueda literal de cada frase; se reproduce la frase de recomendación tal como aparece. Escala ESHRE del GPR: *Recommended* · *Can be considered* · *Currently not recommended for routine clinical use* · *Not recommended*. **Antes de publicar, una persona debe cotejar visualmente cada fila con el PDF** (la extracción puede alterar tablas a dos columnas).

| Add-on | Posición ESHRE (redacción del GPR 2023) | Otras posiciones ESHRE verificadas |
|---|---|---|
| Cribado con histeroscopia | "Screening hysteroscopy is currently not recommended for routine clinical use." / "…can be considered in patients with recurrent implantation failure." | UI 2023: histeroscopia para anomalías no vistas en imagen no recomendada (Strong) |
| Pruebas de receptividad endometrial (ERA y similares) | "The presently available endometrial receptivity tests are not recommended." | RIF 2023: matiz "can be considered" para evaluación de aspectos específicos (D-04) |
| Pruebas inmunológicas en sangre periférica y NK uterinas | "Peripheral blood tests for immune parameters and uNK-cell testing are not recommended." | RIF: NK periférico y uterino *not recommended*; RPL: *insufficient evidence to recommend* NK (Strong) |
| Genotipado KIR/HLA | "KIR and HLA genotyping is currently not recommended for routine clinical use." | RIF: HLA-C *not recommended* |
| Inmunomoduladores (Intralipid, IVIG, rh-LIF, PBMC, anti-TNF) | "Immunomodulating treatments, such as Intralipid, IVIG, rh-LIF, PBMCs, and anti-TNF, are not recommended." | RPL: ver D-03 |
| Glucocorticoides | "Glucocorticoids are not recommended in ART." | RPL: no recomendados (Strong) |
| PRP intrauterino | "Intrauterine administration of platelet-rich plasma is not recommended." | RIF: *not recommended* |
| PRP intraovárico | "Intraovarian administration of platelet-rich plasma is not recommended." | — |
| Células madre (IOP, baja reserva, endometrio fino) | "Stem cell therapy for premature ovarian insufficiency, diminished/poor ovarian reserve or thin endometrium is not recommended." | — |
| Activación in vitro de folículos | "In vitro activation of dormant follicles is not recommended." | — |
| Terapia de reemplazo mitocondrial | "Mitochondrial replacement therapy to affect oocyte quality is not recommended." | — |
| G-CSF intrauterino | "Intrauterine administration of granulocyte colony-stimulating factor is not recommended." | RIF: G-CSF intrauterino o SC *not recommended* |
| hCG intrauterina | "Intrauterine administration of hCG is not recommended." | RIF: *not recommended* |
| Sobrenadante de cultivo embrionario endometrial | "Endometrial administration of embryo culture supernatant is not recommended." | — |
| Exposición endometrial a plasma seminal | "Endometrial exposure to seminal plasma is not recommended." | — |
| Scratching endometrial | "Endometrial scratching is currently not recommended for routine clinical use." | UI: *should not be offered* (Strong); RIF: *not recommended* |
| Adyuvantes en estimulación (metformina, GH, testosterona, DHEA, aspirina, indometacina, sildenafilo) | "Adjuncts (metformin, growth hormone, testosterone, DHEA, aspirin, indomethacin, and sildenafil) before or during ovarian stimulation are not recommended." | OS 2025 matiza por subgrupo (p. ej., GH y testosterona *probably not recommended* en bajas respondedoras; DHEA *not recommended*) |
| Antioxidantes | "Antioxidant therapy is not recommended in ART." | UI: *probably not recommended* (Conditional) mujer y varón |
| Acupuntura, medicina china/herbal y otras complementarias | "Acupuncture, Chinese and herbal medicine and other complementary therapies are not recommended." | NICE NG257 1.14.1: eficacia no evaluada adecuadamente |
| Duostim | "Duostim is currently not recommended for routine clinical use." | — |
| IVM clínica, IVM de rescate, FIV/M en ciclo natural | "Clinical IVM and rescue IVM or natural cycle IVF/M are currently not recommended for routine clinical use." | — |
| Dispositivos de cultivo intravaginal/intrauterino | "Intravaginal or intrauterine culture devices are currently not recommended for routine clinical use." | — |
| Freeze-all electivo | "Elective freeze-all is currently not recommended for routine clinical use." | Freeze-all **por riesgo de SHO** sigue siendo estrategia válida (OS 2025, Strong) |
| ICSI en factor no masculino | "ICSI is not recommended for non-male factor infertility." | UI: no recomendada sobre FIV (Strong) |
| Activación ovocitaria artificial | "…currently not recommended for routine clinical use." / "…is recommended for complete activation failure (0% 2PN), very low fertilization (<30% fertilization), or globozoospermia." | — |
| Activación espermática artificial | "…currently not recommended for routine clinical use." / "…recommended for patients with primary or secondary total asthenozoospermia which are not the result of axonemal structure defects." | — |
| Fragmentación del ADN espermático | "Sperm DNA damage testing is currently not recommended for routine clinical use." | UI: no recomendada (Strong); RIF: *not recommended* |
| IMSI | "Intracytoplasmic morphologic sperm injection is currently not recommended for routine clinical use." | — |
| PICSI / unión a hialuronano | "Physiological ICSI is currently not recommended for routine clinical use." / "Sperm hyaluronic binding assay is currently not recommended for routine clinical use." | — |
| MACS | "Magnetic-activated cell sorting is currently not recommended for routine clinical use." | — |
| Microfluídica para selección espermática | "Microfluidics can be considered." | Única técnica de selección espermática con "can be considered" (un solo ECA con beneficio en `LBR` según tabla) |
| Assisted hatching | "Assisted hatching is not recommended." | RIF: *not recommended* |
| Medio de cultivo con factores de crecimiento | "Growth factor-supplemented embryo culture medium is not recommended." | — |
| Ácido hialurónico en medio de transferencia ("embryo glue") | "Hyaluronic acid addition to transfer media is recommended." + "Monitoring of the multiple pregnancy rate is still advisable." | Único add-on de laboratorio clasificado *recommended* en este GPR |
| Time-lapse | "Time-lapse imaging is not recommended as a tool to improve live birth rates." | — |
| PGT-A | "Pre-implantation genetic testing for aneuploidy is currently not recommended for routine clinical use." | RIF: *can be considered* (D-06) |
| PGT no invasivo (niPGT) | "Non-invasive PGT is currently not recommended for routine clinical use." | — |
| Carga de ADN mitocondrial | "Mitochondrial DNA load measurement is currently not recommended for routine clinical use." | RIF: *not recommended* |
| Microbioma endometrial/vaginal | **No hallado** en el GPR de add-ons 2023 (búsqueda textual sin resultados; confirmar visualmente) | RIF 2023: "Uterine and vaginal microbiome profiling is not recommended." |
| HBPM / heparina en TRA | No hallada como recomendación en el GPR de add-ons (búsqueda textual) | RIF: HBPM *not recommended* para aumentar embarazo/`LBR` en RIF; RPL: heparina/aspirina no recomendadas en RPL inexplicada (Strong) |

Notas de interpretación: (1) RIF 2023 aclara que *not recommended* significa "no ofrecer de rutina", no que esté contraindicado en toda circunstancia; (2) el GPR de add-ons sitúa varias de estas técnicas fuera de la práctica rutinaria por falta de beneficio demostrado en `LBR`, no necesariamente por daño demostrado; (3) contrastar con calificaciones HFEA [S31] en la tarjeta, sin mezclar escalas.

---

## 5. Unidad piloto propuesta (módulo de reproducción)

**Unidad**: `fert.amh-afc` — **"Reserva ovárica: AMH y AFC — qué predicen y qué no"** / *Ovarian reserve: what AMH and AFC predict and what they don't*

**Por qué esta unidad**: evidencia convergente y verificable (ASRM 2020, ESHRE UI 2023, ESHRE OS 2025, NICE NG257 2026, cohorte JAMA 2017); alto impacto clínico (sobreuso, ansiedad, venta de congelación de ovocitos, exclusión injusta de tratamientos); permite enseñar la distinción `BIO` vs fecundabilidad vs `LBR`; conecta con SOP, endometriosis, preservación y estimulación; sin dosis ni intervenciones controvertidas.

**Conceptos para 8 tarjetas** (cada tarjeta → fuente específica; redactar en ES/EN; estado: borrador hasta auditoría):

| # | Concepto (afirmación nuclear) | Tipo de tarjeta | Fuente(s) | Desenlace |
|---|---|---|---|---|
| 1 | Reserva ovárica = cantidad de ovocitos remanentes; AMH y AFC son medidas **indirectas** de cantidad, no de calidad ovocitaria. AFC = suma de folículos antrales (la mayoría de estudios: 2–10 mm) en ambos ovarios en fase folicular temprana. | Concepto/definición | [S12] | `BIO` |
| 2 | AMH/AFC predicen bien el **número de ovocitos** tras estimulación; ESHRE recomienda AFC o AMH para predecir alta/baja respuesta (Strong) y desaconseja edad, IMC, FSH basal, inhibina B, estradiol, progesterona y LH basales para predecir respuesta. | Recuperación + aplicación | [S05] recs 1–2; [S12] | `BIO` |
| 3 | AMH, AFC y demás marcadores son malos predictores de embarazo y nacido vivo en TRA: ESHRE no los recomienda para predecir embarazo/`LBR` (Strong); ASRM: AMH como variable independiente es, como mucho, débilmente predictiva. NICE NG257 sí admite AMH como indicador pronóstico de TRA dentro de la valoración clínica (matiz a explicar). | Evidencia/matiz | [S05] rec 3; [S12]; [S21] | `CPR`, `LBR` |
| 4 | En mujeres sin infertilidad conocida, AMH baja o FSH alta **no** se asociaron con menor fecundabilidad ni menor probabilidad acumulada a 6–12 ciclos (cohorte prospectiva, 30–44 años). | Evidencia (estudio clave) | [S23]; resumido en [S03] | Fecundabilidad |
| 5 | Con ciclos regulares, la prueba de reserva ovárica **no es necesaria** para identificar la etiología de la infertilidad ni para predecir concepción espontánea a 6–12 meses (ESHRE, Strong); NICE: AMH no debe usarse para predecir concepción espontánea. | Recomendación de guía | [S03]; [S21] | Fecundabilidad |
| 6 | Un valor muy bajo de AMH **no debe ser el único criterio** para negar acceso a TRA; sí sirve para asesorar sobre respuesta esperada. | Ética/aplicación | [S12] | Proceso |
| 7 | Los marcadores de reserva **no deben usarse para promover** la vitrificación de ovocitos planificada; la edad predice el éxito reproductivo mucho mejor que la reserva. | Aplicación/comunicación | [S12]; [S17] | Proceso, `LBR` |
| 8 | Pruebas dinámicas (test de clomifeno) no mejoran la precisión y "deberían abandonarse"; FSH basal elevada es específica pero poco sensible para baja reserva. | Pruebas innecesarias | [S12] | `BIO` |
| (opc.) 9 | AMH alta y SOP: AMH elevada se usa para anticipar alta respuesta y riesgo de SHO (asesorar). | Puente con `fert.stimulation-ohss` | [S15]; [S05] | `SAFE` |
| (opc.) 10 | Cirugía de endometrioma puede reducir la reserva; no se recomienda cirugía rutinaria pre-TRA para mejorar `LBR`. | Puente con `fert.endometriosis` | [S07] | `BIO`, `LBR` |

**Ideas de preguntas (para el banco; redactar y auditar después)**: (a) mujer de 33 años, ciclos regulares, sin buscar embarazo, pide AMH "para saber si puede esperar" → mejor respuesta = explicar que AMH no predice fecundabilidad natural y priorizar la edad y el plan reproductivo; (b) qué desenlace predice mejor AMH (ovocitos recuperados vs `LBR`); (c) qué marcador NO recomienda ESHRE para predecir respuesta (inhibina B); (d) pareja con AMH muy baja: ¿es correcto negar FIV solo por AMH? Explicar distractores.

**Caso (esquema) — `case.fert.amh-01`**
- **Contexto**: Lucía (ficticia), 34 años, nulípara, ciclos regulares; pareja varón de 36 años. Buscan embarazo desde hace 5 meses. Un control laboral incluyó una AMH "baja" (informe con unidades y rango del laboratorio; no se fija valor universal). Llega angustiada y pregunta por congelar óvulos o "pasar directamente a FIV".
- **Paso 1 — Qué significa el resultado**: recuperación: ¿qué mide la AMH y qué no? [S12]
- **Paso 2 — ¿Predice su probabilidad de embarazo espontáneo?** Evidencia de cohorte y guías [S23][S03][S21]. Respuesta: no; la edad y el tiempo de búsqueda son lo relevante.
- **Paso 3 — ¿Cuándo estudiar?** Edad <35 y 5 meses de búsqueda: aún no cumple 12 meses; a los 35 se acortaría a 6 meses [S16]; NICE: a partir de 36 años derivar antes [S21]. Considerar adelantar el estudio si hay factores (p. ej., antecedentes, síntomas de endometriosis) — evaluar a ambos [S18].
- **Paso 4 — Giro**: a los 12 meses sin embarazo, estudio básico normal (incluido seminograma interpretado según OMS 2021) → etiqueta de inexplicada y opciones (IUI-OS primera línea según ESHRE) [S03]; ahora sí AMH/AFC informan la **dosificación** si llega a estimulación [S05].
- **Paso 5 — Congelación de ovocitos**: discutir con base en edad y planes, no en AMH [S12][S17].
- **Comunicación**: validar ansiedad, explicar incertidumbre, evitar culpabilización; ofrecer apoyo psicosocial [S09].
- **Decisiones reproductivas y seguimiento**: plan temporal explícito; criterios de reevaluación.
- **Desenlaces a marcar en el caso**: `BIO` (AMH), fecundabilidad, `LBR` (pronóstico en TRA).

**Dependencias de la unidad**: `horm.folliculogenesis` (prerrequisito; si aún no existe, añadir tarjeta puente mínima), `fert.age-timing`.

---

## 6. Dudas que requieren especialista humano

1. **D-01 testosterona** en bajas respondedoras: ¿cómo presentarla en la app (ESHRE 2025 vs Cochrane 2024)?
2. **D-03 IVIG** en RPL ≥4 pérdidas (recomendación Conditional de ESHRE 2022): práctica real en España/Argentina, coste y seguridad.
3. Endometritis crónica: criterios diagnósticos (CD138) y esquemas antibióticos — la RIF GPR dice *can be considered*; no se registraron regímenes.
4. Progesterona lútea en RIF/TEC y "progesterona sérica de corte" (RIF: validar cortes localmente) — ¿cómo enseñarlo sin fijar cifras universales?
5. Dosis de aspirina/heparina en APS (RPL 2022 indica aspirina 75–100 mg/día; tipo/dosis de heparina "profiláctica" requiere revisión antes de tarjeta).
6. Marco legal y acceso en España y Argentina (edad límite, donación, número de embriones, financiación).
7. Interpretación local de seminograma (laboratorios que aún informan "valores de referencia" de la 5.ª edición).
8. Uso de suplementos "funcionales" (CoQ10, melatonina, mio-inositol fuera de SOP) en la práctica integradora de Sol: qué incluir como "evidencia limitada" sin aparentar recomendación.

## 7. Notas para integración

- Este archivo solo define el mapa del macrotema `fert`; los IDs externos (`horm.*`, `nutr.*`, etc.) deben confirmarse con los mapas hermanos antes de validar enlaces.
- Las "Anclas" son punteros a fuentes, no afirmaciones listas para tarjeta: cada tarjeta debe citar la ubicación concreta (número de recomendación/página) tras cotejo visual.
- Fuentes verificadas: 36 (S01–S37, con S10 reservado). Por verificar: 22 (PV-01–PV-22). Discrepancias catalogadas: 7 (D-01–D-07).
