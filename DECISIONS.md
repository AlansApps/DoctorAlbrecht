# DECISIONS

| ID | Fecha | Decisión | Motivo |
|---|---|---|---|
| D-001 | 2026-10-12 | Nombre de trabajo `sol-gineco` hasta comprobar disponibilidad de marca. | Spec: usar marca solo tras comprobación razonable. |
| D-002 | 2026-10-12 | Repo y worktrees dentro de la carpeta OneDrive `TARJETALAN CLAUDE`. | Elección de Alan, aceptando riesgo de sync. Mitigación: escrituras pausadas, revisar duplicados `*-AlanPC.*` / locks tras operaciones masivas, `.gitignore` los excluye. |
| D-003 | 2026-10-12 | Stack: React + TypeScript + Vite, build estático, GitHub Pages. | Spec 04. |
| D-004 | 2026-10-12 | Repo público `AlansApps/sol-gineco`. | Pages gratis solo en repos públicos; la URL de Pages es pública igual (sin auth). Sin datos de pacientes ni secretos. Elección de Alan. |
| D-005 | 2026-10-12 | Despliegue Pages desde rama `gh-pages` (no Actions) por ahora. | Token sin scope `workflow`. Reevaluar si Alan amplía permisos. |
