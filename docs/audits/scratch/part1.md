# Auditoría UX, branding y accesibilidad — Fase 1 (direcciones visuales)

## Versión

- Rama: `feat/phase1-foundations` · commit auditado: `c88bae5` (el archivo revisado entra en `186fcf2`, sin cambios posteriores).
- Archivos: `docs/branding/branding-preview.html` (33 410 bytes) y `docs/branding/REFERENCES.md` (16 304 bytes).
- Specs de referencia: `03_BRANDING_Y_APRENDIZAJE.md` y `06_AUDITORIA_Y_PUBLICACION.md`.
- Fecha: 2026-10-12. Auditor: rol independiente de branding, UX y accesibilidad (IA; no es un diseñador ni un médico humano).
- Modo: solo lectura. No se ha modificado ningún archivo revisado.

## Alcance

Cuatro direcciones (A Consulta, B Raíz, C Pulso, D Calma) × cuatro pantallas de teléfono (inicio, card hormonal, card de suplemento, pregunta en estado de fallo) × tema claro y oscuro = 32 pantallas. Se revisan además el marco de la página de preview (controles, tabla comparativa, recomendación) y la coherencia con `REFERENCES.md`.

Fuera de alcance: la exactitud clínica del contenido de muestra (corresponde al auditor médico; se señalan solo problemas de redacción que afectan a la comprensión) y la app real (todavía no existe UI implementada; ver la última sección).

## Método

**Renderizado (verificado en navegador)**: el HTML se abrió en el panel de navegador integrado (Chromium del escritorio de Claude) como instantánea estática con JS activo. Se comprobó que se cargan las 8 familias (Source Sans 3, Source Serif 4, Figtree, Fraunces, Bricolage Grotesque, Instrument Sans, Manrope, Atkinson Hyperlegible Next) y se midieron con `getBoundingClientRect`/`getComputedStyle`: anchos y altos de targets, áreas de scroll, tamaños de fuente usados por dirección, caracteres por línea aproximados (medición de ancho medio de glifo con canvas), recortes de contenido y comportamiento a 320 px de viewport (emulado). Se tomaron capturas de A, B, C y D en claro y de A y C en oscuro. Las capturas fallaron de forma intermitente (timeout del panel), por eso la evaluación estética de D oscuro y B oscuro se apoya en tokens y no en captura.

**Calculado**: ratios de contraste WCAG 2.x a partir de los HEX del CSS, extraídos automáticamente del propio HTML por `docs/audits/scratch/contrast.mjs` (desechable). Se incluyen las mezclas reales: subtítulo del CTA (`opacity:.9` → mezcla 90 % on-accent/accent) y tile ocre de B (`color-mix(in srgb, warn 14%, surface)`). Simulación de deuteranopía (matriz de Machado 2009, severidad 1) para el par acierto/fallo.

**Razonado desde el código**: semántica/ARIA, carga de ejes de fuentes, coherencia de iconos, copy en español.

**Limitaciones**: no es un iPhone/Safari real (spec 06 lo exige etiquetar): todo lo «renderizado» es Chromium de escritorio con barra de scroll clásica de 15 px, por lo que el área útil de las pantallas de card es 285 px en vez de 300 px. No se probó lector de pantalla ni texto ampliado del sistema.

## Resumen ejecutivo

- **Contraste de texto**: los 140 pares de texto medidos pasan AA en las 4 direcciones y ambos temas (mínimo: B claro, muted sobre soft, 4.76:1). Buen trabajo de tokens.
- **Contraste no textual**: el token `--line` falla 3:1 en todas las direcciones y temas (1.18–1.51:1) y es el único borde de opciones de respuesta, botones de valoración y CTA de D.
- **Bloqueantes (2)**: (1) en la pregunta, la opción correcta y la elegida se distinguen solo por color (verde vs rojo con luminancia casi idéntica, 1.02–1.05:1; con deuteranopía ambos son oliva); (2) en C las cards hormonal y de suplemento están recortadas por un bug de flexbox: Alan está comparando C con la mitad de la card oculta.
- **Lectura larga**: cuerpo a 14.5 px, explicaciones a 12.5 px gris, 13 tamaños distintos sin escala; todo en `px` (no responde a texto ampliado).
- **Ranking del auditor**: 1) A Consulta (con correcciones), 2) D Calma, 3) B Raíz, 4) C Pulso.

## Contraste por dirección y tema

Umbrales: texto normal 4.5:1; no textual (bordes de componentes, iconos de estado) 3:1. «Card» = `--surface` salvo en D, donde la card es transparente sobre `--bg`. Todos los pares de texto son los realmente usados en el CSS.
