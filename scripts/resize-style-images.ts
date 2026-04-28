/**
 * Resizes hero/style images from new_style_images/ and writes them to
 * new_style_images_resized/, ready to upload to Supabase storage.
 *
 * Resize target: 1920px wide max, 85% JPEG quality (hero images need more detail).
 * All files are output as JPEG regardless of input format.
 *
 * Usage: npx tsx scripts/resize-style-images.ts
 */
import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

const INPUT_DIR = path.join(process.cwd(), "new_style_images");
const OUTPUT_DIR = path.join(process.cwd(), "new_style_images_resized");
const MAX_WIDTH = 1920;
const QUALITY = 85;

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function main() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`Input directory not found: ${INPUT_DIR}`);
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = fs.readdirSync(INPUT_DIR).filter((f) =>
    IMAGE_EXTS.has(path.extname(f).toLowerCase())
  );

  if (files.length === 0) {
    console.log("No image files found in new_style_images/");
    return;
  }

  console.log(`\nResizing ${files.length} image(s) → new_style_images_resized/\n`);

  let resized = 0;
  let failed = 0;

  for (const file of files) {
    const inputPath = path.join(INPUT_DIR, file);
    // Always output as .jpg
    const outputName = path.basename(file, path.extname(file)) + ".jpg";
    const outputPath = path.join(OUTPUT_DIR, outputName);

    const originalBytes = fs.statSync(inputPath).size;
    process.stdout.write(`  ${file} (${Math.round(originalBytes / 1024)} KB) → `);

    try {
      await sharp(inputPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(outputPath);

      const newBytes = fs.statSync(outputPath).size;
      const savings = Math.round((1 - newBytes / originalBytes) * 100);
      console.log(`${outputName} (${Math.round(newBytes / 1024)} KB, ${savings}% smaller)`);
      resized++;
    } catch (err) {
      console.error(`FAILED — ${(err as Error).message}`);
      failed++;
    }
  }

  console.log(`\n✅ Done. Resized: ${resized}  Failed: ${failed}`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
