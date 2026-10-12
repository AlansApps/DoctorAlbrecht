# Plan de expansión de contenido (Fase 3)

Objetivo inicial (spec 00/05): 40–60 microlecciones, 250–400 tarjetas, 150–200 preguntas y 15 casos. Alrededor del 35–40 % será reproducción, con nutrición, gastro, hormonas, hábitos y suplementos como ejes transversales. Las cifras son un objetivo, no un permiso para rellenar: cada afirmación lleva su fuente verificada, y lo que no cabe en un lote queda **pendiente**.

## Unidad de trabajo

Un **módulo** (`content/modules/<id>.json`) cubre 1–3 microtemas con 2–4 lecciones. Por lección: 3–6 tarjetas, 2–4 preguntas y, cuando corresponda, un caso. Pasos:

1. Verificar las fuentes en el original (texto completo, guía de bolsillo o resumen; el alcance se anota en `limitations`) y añadirlas a `references.json`.
2. Redactar en ES (tú) y EN con citas `[[ref:id]]` por afirmación, estado `sources-verified`.
3. `npm run content:check` sin errores.
4. Auditoría médica del módulo, aplicación de correcciones y reverificación de las importantes. Al final: `ai-audited`, o `needs-human-review` para prescripción o alto riesgo.
5. Merge del lote a `main` y despliegue.

## Lotes propuestos (orden)

| Lote | Módulos | Microtemas principales | Peso reproducción |
|---|---|---|---|
| 1 | Edad y fertilidad · Evaluación de la pareja · Ovulación | `fert.age-timing`, `fert.couple-evaluation`, `fert.ovulation`, `horm.folliculogenesis-ovulation`, `horm.luteal-phase` | alto |
| 2 | Preconcepción · Suplementos en la mujer y el varón | `fert.preconception`, `supp.folate`, `supp.vitamin-d`, `supp.iodine`, `fert.supplements-female`, `fert.supplements-male` | alto |
| 3 | Factor masculino · Infertilidad inexplicada | `fert.male-semen`, `fert.male-clinical`, `fert.unexplained` | alto |
| 4 | Nutrición base · SOP estilo de vida | `nutr.mediterranean`, `nutr.fiber-glycemic`, `nutr.energy-availability`, `pcos.diet`, `pcos.exercise` | medio |
| 5 | Endometriosis y fertilidad · Dolor | `endo.*` núcleo, `fert.endometriosis` | medio |
| 6 | Add-ons y FIV · RIF · RPL | `fert.addons-overview`, `fert.ivf-icsi`, `fert.rif`, `fert.rpl`, `fert.immunology-nk`, `fert.endometrial-receptivity` | alto |
| 7 | Tiroides y fertilidad · Hiperprolactinemia | `thyr.*` núcleo, `fert.endocrine-comorbidities`, `menst.hyperprolactinaemia` | medio |
| 8 | Gastro y microbiota · Estroboloma | `gut.*` núcleo, `horm.estrogen-metabolism-estrobolome` | bajo |
| 9 | Menopausia e IOP | `meno.*` núcleo, `fert.dor-poi` | medio |
| 10 | Fundamentos y lectura crítica · Casos integrados | `found.*`, `cases.*`, `fert.critical-appraisal-repro` | medio |

Cada lote se integra a `main` por separado. Si un tema requiere juicio de especialista sin resolver (por ejemplo la testosterona en bajas respondedoras, la IVIG en pérdida gestacional recurrente o la seguridad de suplementos en el embarazo), queda en `needs-human-review` o fuera del recorrido publicado.

## Seguimiento

`CONTENT_COVERAGE.md` se actualiza en cada lote con microlecciones, tarjetas, preguntas, casos, estado y peso de reproducción.
