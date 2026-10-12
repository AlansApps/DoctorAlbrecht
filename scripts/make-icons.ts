/**
 * Generates the PWA icons (PNG) without native dependencies:
 * two stacked rounded cards on the Calma slate accent. Run: node scripts/make-icons.ts
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

type RGB = [number, number, number];
const BG: RGB = [0x3c, 0x66, 0x9a];
const BACK: RGB = [0xb9, 0xcc, 0xe4];
const FRONT: RGB = [0xff, 0xff, 0xff];
const LINE: RGB = [0x3c, 0x66, 0x9a];

/** Signed distance to a rounded rectangle centred at (cx, cy). */
function sdRoundRect(x: number, y: number, cx: number, cy: number, hw: number, hh: number, r: number): number {
  const qx = Math.abs(x - cx) - (hw - r);
  const qy = Math.abs(y - cy) - (hh - r);
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}

function rotate(x: number, y: number, cx: number, cy: number, a: number): [number, number] {
  const c = Math.cos(a), s = Math.sin(a);
  return [c * (x - cx) - s * (y - cy) + cx, s * (x - cx) + c * (y - cy) + cy];
}

/** Colour at a point in a unit (0..1) design space. `full` = no rounded mask (maskable/apple). */
function shade(u: number, v: number, full: boolean): RGB | null {
  if (!full && sdRoundRect(u, v, 0.5, 0.5, 0.5, 0.5, 0.22) > 0) return null;
  let col: RGB = BG;
  const [bu, bv] = rotate(u, v, 0.55, 0.47, -0.21);
  if (sdRoundRect(bu, bv, 0.55, 0.47, 0.2, 0.26, 0.05) <= 0) col = BACK;
  const [fu, fv] = rotate(u, v, 0.46, 0.54, 0.1);
  if (sdRoundRect(fu, fv, 0.46, 0.54, 0.2, 0.26, 0.05) <= 0) {
    col = FRONT;
    // three text lines on the front card
    for (const [ly, lw] of [[0.44, 0.24], [0.53, 0.28], [0.62, 0.18]] as const) {
      if (sdRoundRect(fu, fv, 0.31 + lw / 2, ly, lw / 2, 0.018, 0.018) <= 0) col = LINE;
    }
  }
  return col;
}

function png(size: number, full: boolean): Buffer {
  const SS = 4; // supersampling for smooth edges
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        // maskable icons keep the art within the central 80% safe zone
        const scale = full ? 1.25 : 1;
        const u = ((x + (sx + 0.5) / SS) / size - 0.5) * scale + 0.5;
        const v = ((y + (sy + 0.5) / SS) / size - 0.5) * scale + 0.5;
        const c = full && (u < 0 || u > 1 || v < 0 || v > 1) ? BG : shade(u, v, full);
        if (c) { r += c[0]; g += c[1]; b += c[2]; a += 255; }
      }
      const n = SS * SS, o = y * (size * 4 + 1) + 1 + x * 4;
      const alpha = a / n;
      raw[o] = alpha ? Math.round((r / n) * (255 / alpha)) : 0;
      raw[o + 1] = alpha ? Math.round((g / n) * (255 / alpha)) : 0;
      raw[o + 2] = alpha ? Math.round((b / n) * (255 / alpha)) : 0;
      raw[o + 3] = Math.round(alpha);
    }
  }
  const crcTable = Array.from({ length: 256 }, (_, k) => {
    let c = k;
    for (let i = 0; i < 8; i++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc = (buf: Buffer) => {
    let c = 0xffffffff;
    for (const byte of buf) c = crcTable[(c ^ byte) & 0xff]! ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, c]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ]);
}

mkdirSync('public/icons', { recursive: true });
writeFileSync('public/icons/icon-192.png', png(192, false));
writeFileSync('public/icons/icon-512.png', png(512, false));
writeFileSync('public/icons/icon-maskable-512.png', png(512, true));
writeFileSync('public/icons/apple-touch-icon.png', png(180, true));
console.log('icons written');
