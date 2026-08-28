// Regenerates the Windows desktop-app icon from the source art in assets/.
// Run after changing the artwork:  npm run win:icon
//
// Input:
//   assets/icon-full-src.png  - the planet/ring/moon mark on solid #030712
//
// Output:
//   public/alien-rpg-tools.ico  - multi-resolution icon used by electron-builder
//                                 (win.icon) for the .exe, taskbar and shortcut.

import { Buffer } from "node:buffer";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "assets/icon-full-src.png");
const out = path.join(root, "public/alien-rpg-tools.ico");

// Sizes Windows picks from for the desktop, taskbar, alt-tab and file lists.
const SIZES = [16, 24, 32, 48, 64, 128, 256];

async function main() {
  const pngs = await Promise.all(
    SIZES.map((size) =>
      sharp(src)
        .resize(size, size, { fit: "cover" })
        .png({ compressionLevel: 9 })
        .toBuffer()
        .then((data) => ({ size, data })),
    ),
  );

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4); // image count

  const entries = Buffer.alloc(16 * pngs.length);
  let offset = header.length + entries.length;
  pngs.forEach((img, i) => {
    const e = i * 16;
    entries.writeUInt8(img.size >= 256 ? 0 : img.size, e + 0); // width (0 => 256)
    entries.writeUInt8(img.size >= 256 ? 0 : img.size, e + 1); // height
    entries.writeUInt8(0, e + 2); // palette count
    entries.writeUInt8(0, e + 3); // reserved
    entries.writeUInt16LE(1, e + 4); // color planes
    entries.writeUInt16LE(32, e + 6); // bits per pixel
    entries.writeUInt32LE(img.data.length, e + 8); // image data size
    entries.writeUInt32LE(offset, e + 12); // image data offset
    offset += img.data.length;
  });

  const ico = Buffer.concat([header, entries, ...pngs.map((p) => p.data)]);
  await fs.writeFile(out, ico);

  console.log(
    `wrote ${path.relative(root, out)} (${ico.length} bytes, sizes: ${SIZES.join(", ")})`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
