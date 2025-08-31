import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const projectRoot = path.resolve(process.cwd());
const publicDir = path.join(projectRoot, "public");
const srcLogo = path.join(publicDir, "images", "logo", "trangvang-ai-logo.png");

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true }).catch(() => {});
}

async function generatePngSizes() {
  const outputs = [
    { file: path.join(publicDir, "favicon-16x16.png"), size: 16 },
    { file: path.join(publicDir, "favicon-32x32.png"), size: 32 },
    { file: path.join(publicDir, "favicon-48x48.png"), size: 48 },
    { file: path.join(publicDir, "apple-touch-icon.png"), size: 180 },
    { file: path.join(publicDir, "android-chrome-192x192.png"), size: 192 },
    { file: path.join(publicDir, "android-chrome-512x512.png"), size: 512 },
  ];
  await Promise.all(
    outputs.map(async ({ file, size }) => {
      await sharp(srcLogo)
        .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(file);
    })
  );
  return outputs.filter(o => /favicon-(16|32|48)x\1\.png$/.test(path.basename(o.file))).map(o => o.file);
}

async function generateIco(pngFiles) {
  const buffers = await Promise.all(pngFiles.map(async f => fs.readFile(f)));
  const icoBuffer = await pngToIco(buffers);
  const outFile = path.join(publicDir, "favicon.ico");
  await fs.writeFile(outFile, icoBuffer);
}

async function main() {
  try {
    await ensureDir(publicDir);
    // Validate source logo exists
    await fs.access(srcLogo);
  } catch {
    console.error(`Logo not found at: ${srcLogo}`);
    process.exit(1);
  }

  const faviconPngs = await generatePngSizes();
  await generateIco(faviconPngs);
  console.log("Favicon assets generated in /public");
}

main();


