// Throwaway: WCAG 2.x contrast for token pairs used in docs/branding/branding-preview.html
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../../branding/branding-preview.html', import.meta.url), 'utf8');

function tokens(sel) {
  const re = new RegExp(sel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\{([^}]*)\\}');
  const m = html.match(re); if (!m) throw new Error('no ' + sel);
  const t = {}; for (const [, k, v] of m[1].matchAll(/--([\w-]+):\s*(#[0-9A-Fa-f]{6})/g)) t[k] = v.toUpperCase();
  return t;
}
const hex2 = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const toHex = c => '#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const lin = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const L = h => { const [r, g, b] = hex2(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const cr = (a, b) => { const [x, y] = [L(a), L(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const mix = (a, b, p) => toHex(hex2(a).map((v, i) => v * p + hex2(b)[i] * (1 - p))); // p of a

const base = { A: tokens('.dA'), B: tokens('.dB'), C: tokens('.dC'), D: tokens('.dD') };
const dark = { A: tokens('.mode-dark .dA,.dA.dark'), B: tokens('.mode-dark .dB,.dB.dark'), C: tokens('.mode-dark .dC,.dC.dark'), D: tokens('.mode-dark .dD,.dD.dark') };

const rows = [];
for (const d of ['A', 'B', 'C', 'D']) for (const theme of ['claro', 'oscuro']) {
  const t = { ...base[d], ...(theme === 'oscuro' ? dark[d] : {}) };
  const cardBg = d === 'D' ? t.bg : t.surface; // D cards are transparent on bg
  const P = [];
  const add = (use, fg, bg, kind = 'texto') => P.push({ use, fg, bg, kind });
  add('Tinta / fondo', t.ink, t.bg);
  add('Tinta / superficie (card)', t.ink, cardBg);
  add('Muted / fondo (topbar, eyebrow, "Cifras de ejemplo")', t.muted, t.bg);
  add('Muted / superficie (src, .why, nav, actions)', t.muted, t.surface);
  add('Tinta / soft (chip, nodo diagrama)', t.ink, t.soft);
  add('Accent-text / card (etiqueta "Aplicación en consulta", botón secundario)', t['accent-text'], cardBg);
  add('Accent / superficie (nav activo, icono tile)', t.accent, t.surface);
  add('Accent / fondo (marca "Alan")', t.accent, t.bg);
  if (d !== 'D') {
    add('On-accent / accent (CTA, botón primario)', t['on-accent'], t.accent);
    add('CTA subtítulo (on-accent @90% sobre accent)', mix(t['on-accent'], t.accent, 0.9), t.accent);
  } else {
    add('CTA D: tinta / superficie', t.ink, t.surface);
    add('Botón primario: on-accent / accent', t['on-accent'], t.accent);
  }
  add('Good / card (etiqueta evidencia guía, icono ✓)', t.good, cardBg);
  add('Warn / card (etiqueta evidencia observacional)', t.warn, cardBg);
  add('Bad / fondo (feedback "Incorrecta")', t.bad, t.bg);
  add('Bad / superficie (borde opción errónea)', t.bad, t.surface, 'no-texto');
  add('Good / superficie (borde opción correcta)', t.good, t.surface, 'no-texto');
  add('Superficie / good (letra en marca opción correcta)', t.surface, t.good);
  add('Superficie / bad (letra en marca opción errónea)', t.surface, t.bad);
  add('Línea / superficie (borde opción no elegida, botón valoración)', t.line, t.surface, 'no-texto');
  add('Línea / fondo (separadores, borde marca vacía)', t.line, t.bg, 'no-texto');
  add('Accent / línea (barra de progreso)', t.accent, t.line, 'no-texto');
  if (d === 'B') {
    const tile2 = mix(t.warn, t.surface, 0.14);
    add('Muted / soft (subtítulo tile 1 y 3; degradado)', t.muted, t.soft);
    add(`Muted / tile ocre (color-mix 14% = ${tile2})`, t.muted, tile2);
    add('Accent / soft (icono tile 1 y 3)', t.accent, t.soft, 'no-texto');
  }
  if (d === 'C') {
    add('#13133A / sol (tile 1)', '#13133A', t.sun);
    add('#13133A / coral (tile 3, banda suplemento)', '#13133A', t.coral);
    add('Muted / soft (subtítulo tile 2)', t.muted, t.soft);
    add('Muted / superficie (subtítulo tile 4)', t.muted, t.surface);
    add('On-accent / accent (título banda hormonal)', t['on-accent'], t.accent);
    add('Accent / on-accent (chip en banda)', t.accent, t['on-accent']);
    add('#FFFFFF / #13133A (chip banda suplemento)', '#FFFFFF', '#13133A');
    add('Sol / fondo (borde tile, no-texto)', t.sun, t.bg, 'no-texto');
  }
  if (d === 'D') add('Muted / fondo (chip D sin caja)', t.muted, t.bg);
  for (const p of P) {
    const r = cr(p.fg, p.bg);
    const need = p.kind === 'texto' ? 4.5 : 3;
    rows.push({ d, theme, ...p, r: r.toFixed(2), ok: r >= need ? 'pasa' : (p.kind === 'texto' && r >= 3 ? 'FALLA (≥3 solo texto grande)' : 'FALLA') });
  }
}
if (process.argv[2] === 'md') {
  let cur = '';
  for (const x of rows) {
    const key = x.d + x.theme;
    if (key !== cur) { cur = key; console.log(`\n#### ${x.d} · ${x.theme}\n\n| Par (uso) | Primer plano | Fondo | Ratio | Umbral | Resultado |\n|---|---|---|---|---|---|`); }
    console.log(`| ${x.use} | ${x.fg} | ${x.bg} | ${x.r}:1 | ${x.kind === 'texto' ? '4.5' : '3.0'} | ${x.ok} |`);
  }
} else {
  for (const x of rows) if (!x.ok.startsWith('pasa') || process.argv[2] === 'all') console.log(x.d, x.theme, x.use, x.fg, x.bg, x.r, x.ok);
}
