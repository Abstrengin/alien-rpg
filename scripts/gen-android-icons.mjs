// Regenerates the Android launcher-icon resources from the source art in
// assets/. Run after changing the artwork:  npm run android:icons
//
// Sources (1024x1024 PNG, committed):
//   assets/icon-foreground-src.png  - planet/ring/moon on a transparent bg
//   assets/icon-full-src.png        - the same mark on solid #030712
//
// Output (android/app/src/main/res/):
//   mipmap-anydpi-v26/ic_launcher{,_round}.xml   adaptive icon (API 26+)
//   values/ic_launcher_background.xml            adaptive background colour
//   mipmap-*/ic_launcher_foreground.png          adaptive foreground layer
//   mipmap-*/ic_launcher.png                     legacy square icon (API 24-25)
//   mipmap-*/ic_launcher_round.png               legacy round icon
// plus assets/play-store-icon-512.png for the Play Console listing.
//
// The adaptive background is a flat colour (not a raster), so it always fills
// the full 108dp drawable and never leaves a seam at the mask edge.

import { fileURLToPath } from "url";
import { Buffer } from "node:buffer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RES = path.join(root, "android/app/src/main/res");
const BG = "#030712";

// density -> [adaptive foreground / full drawable px (108dp), legacy icon px (48dp)]
const DENSITIES = {
  mdpi: [108, 48],
  hdpi: [162, 72],
  xhdpi: [216, 96],
  xxhdpi: [324, 144],
  xxxhdpi: [432, 192],
};

// Fraction of the canvas the artwork's longest side should span.
const FG_SCALE = 0.58; // adaptive: longest side ~63dp, just inside the 66dp safe zone
const LEGACY_SCALE = 0.66; // legacy square
const ROUND_SCALE = 0.62; // legacy round

const write = (p, buf) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, buf);
  console.log("  " + path.relative(root, p).replace(/\\/g, "/"));
};

// Resize the trimmed art so its longest side is `target` px.
async function fitArt(trimmed, meta, target) {
  const scale = target / Math.max(meta.width, meta.height);
  return sharp(trimmed)
    .resize(Math.round(meta.width * scale), Math.round(meta.height * scale), {
      fit: "fill",
    })
    .toBuffer();
}

// Centre `art` (its natural size) on a `size` x `size` canvas.
function centre(art, artW, artH, size, background) {
  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([
      {
        input: art,
        left: Math.round((size - artW) / 2),
        top: Math.round((size - artH) / 2),
      },
    ])
    .png()
    .toBuffer();
}

async function main() {
  const fgSrc = path.join(root, "assets/icon-foreground-src.png");
  const fullSrc = path.join(root, "assets/icon-full-src.png");
  for (const f of [fgSrc, fullSrc]) {
    if (!fs.existsSync(f)) throw new Error(`missing source: ${path.relative(root, f)}`);
  }

  const trimmed = await sharp(fgSrc).trim().toBuffer();
  const meta = await sharp(trimmed).metadata();
  console.log(`trimmed art: ${meta.width}x${meta.height}`);

  console.log("adaptive + legacy mipmaps:");
  for (const [d, [fullPx, legacyPx]] of Object.entries(DENSITIES)) {
    // adaptive foreground: art on a transparent full-bleed canvas
    {
      const t = Math.round(fullPx * FG_SCALE);
      const scale = t / Math.max(meta.width, meta.height);
      const w = Math.round(meta.width * scale);
      const h = Math.round(meta.height * scale);
      const art = await fitArt(trimmed, meta, t);
      write(
        path.join(RES, `mipmap-${d}/ic_launcher_foreground.png`),
        await centre(art, w, h, fullPx, { r: 0, g: 0, b: 0, alpha: 0 }),
      );
    }

    // legacy square icon: opaque #030712
    {
      const t = Math.round(legacyPx * LEGACY_SCALE);
      const scale = t / Math.max(meta.width, meta.height);
      const w = Math.round(meta.width * scale);
      const h = Math.round(meta.height * scale);
      const art = await fitArt(trimmed, meta, t);
      const png = await centre(art, w, h, legacyPx, BG);
      write(path.join(RES, `mipmap-${d}/ic_launcher.png`), await sharp(png).png().toBuffer());
    }

    // legacy round icon: #030712 disc on transparent
    {
      const t = Math.round(legacyPx * ROUND_SCALE);
      const scale = t / Math.max(meta.width, meta.height);
      const w = Math.round(meta.width * scale);
      const h = Math.round(meta.height * scale);
      const art = await fitArt(trimmed, meta, t);
      const disc = Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${legacyPx}" height="${legacyPx}">` +
          `<circle cx="${legacyPx / 2}" cy="${legacyPx / 2}" r="${legacyPx / 2}" fill="${BG}"/></svg>`,
      );
      const base = await sharp({
        create: {
          width: legacyPx,
          height: legacyPx,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([
          { input: disc },
          { input: art, left: Math.round((legacyPx - w) / 2), top: Math.round((legacyPx - h) / 2) },
        ])
        .png()
        .toBuffer();
      write(path.join(RES, `mipmap-${d}/ic_launcher_round.png`), base);
    }
  }

  console.log("adaptive xml + colour:");
  const adaptiveXml =
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n' +
    '    <background android:drawable="@color/ic_launcher_background" />\n' +
    '    <foreground android:drawable="@mipmap/ic_launcher_foreground" />\n' +
    "</adaptive-icon>\n";
  write(path.join(RES, "mipmap-anydpi-v26/ic_launcher.xml"), adaptiveXml);
  write(path.join(RES, "mipmap-anydpi-v26/ic_launcher_round.xml"), adaptiveXml);
  write(
    path.join(RES, "values/ic_launcher_background.xml"),
    '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n' +
      `    <color name="ic_launcher_background">${BG}</color>\n</resources>\n`,
  );

  // The stock vector layers are now unused (adaptive bg is a colour, fg is a mipmap).
  for (const f of [
    "drawable/ic_launcher_background.xml",
    "drawable-v24/ic_launcher_foreground.xml",
  ]) {
    const p = path.join(RES, f);
    if (fs.existsSync(p)) {
      fs.rmSync(p);
      console.log("  removed " + f);
      const dir = path.dirname(p);
      if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
    }
  }

  console.log("play store listing icon:");
  write(
    path.join(root, "assets/play-store-icon-512.png"),
    await sharp(fullSrc).resize(512, 512, { fit: "fill" }).png().toBuffer(),
  );

  console.log("\ndone. run `npx cap sync android` and rebuild.");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
