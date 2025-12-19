import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(path.join(__dirname, "..", "package.json"), "utf-8")
);
const version = packageJson.version;

const releaseDir = path.join(__dirname, "..", `Release/v${version}`);
const distDir = path.join(__dirname, "..", "dist");

try {
  // Create release directory
  if (!fs.existsSync(releaseDir)) {
    fs.mkdirSync(releaseDir, { recursive: true });
  }

  // Copy exe
  const exeFile = `${packageJson.build.productName} Portable ${version}.exe`;
  const exePath = path.join(distDir, exeFile);

  if (!fs.existsSync(exePath)) {
    throw new Error(`exe not found at ${exePath}`);
  }

  fs.copyFileSync(exePath, path.join(releaseDir, exeFile));

  // Copy docs
  fs.copyFileSync(
    path.join(__dirname, "..", "README.md"),
    path.join(releaseDir, "README.md")
  );
  fs.copyFileSync(
    path.join(__dirname, "..", "CHANGELOG.md"),
    path.join(releaseDir, "CHANGELOG.md")
  );
  fs.copyFileSync(
    path.join(__dirname, "..", "LICENSE"),
    path.join(releaseDir, "LICENSE")
  );

  console.log(`✅ Release packaged to: ${releaseDir}`);
  console.log(`   - ${exeFile}`);
  console.log(`   - README.md`);
  console.log(`   - CHANGELOG.md`);
  console.log(`   - LICENSE`);
} catch (error) {
  console.error(`❌ Release creation failed: ${error.message}`);
  process.exit(1);
}
