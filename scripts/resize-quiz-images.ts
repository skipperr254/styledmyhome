/**
 * Downloads every image from the quiz-images bucket, resizes it, and re-uploads
 * it to the exact same storage path (upsert), preserving folder structure.
 *
 * Resize target: 1200px wide max, 80% JPEG/WebP quality.
 * PNG files are converted to JPEG to maximise compression savings.
 *
 * Usage: npx tsx scripts/resize-quiz-images.ts
 */
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MAX_WIDTH = 1200;
const QUALITY = 80;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function listAllFiles(bucket: string): Promise<string[]> {
  const paths: string[] = [];

  // List root-level folders first, then recurse one level deep (q1…q11 structure)
  const { data: rootItems, error: rootErr } = await supabase.storage
    .from(bucket)
    .list("", { limit: 1000 });
  if (rootErr) throw new Error(`Failed to list bucket root: ${rootErr.message}`);

  for (const item of rootItems ?? []) {
    if (item.metadata == null) {
      // It's a folder — list its contents
      const { data: children, error: childErr } = await supabase.storage
        .from(bucket)
        .list(item.name, { limit: 1000 });
      if (childErr) {
        console.warn(`  ⚠ Could not list folder "${item.name}": ${childErr.message}`);
        continue;
      }
      for (const child of children ?? []) {
        if (child.metadata != null) {
          paths.push(`${item.name}/${child.name}`);
        }
      }
    } else {
      // File at root level
      paths.push(item.name);
    }
  }

  return paths;
}

async function downloadFile(bucket: string, storagePath: string): Promise<Buffer> {
  const { data, error } = await supabase.storage.from(bucket).download(storagePath);
  if (error || !data) throw new Error(`Download failed (${storagePath}): ${error?.message}`);
  return Buffer.from(await data.arrayBuffer());
}

async function resizeImage(input: Buffer, storagePath: string): Promise<{ buffer: Buffer; contentType: string; newPath: string }> {
  const ext = storagePath.split(".").pop()?.toLowerCase() ?? "jpg";
  const isPng = ext === "png";

  // Always output JPEG — smaller files, no quality loss vs PNG for photos
  const buffer = await sharp(input)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toBuffer();

  // If it was a PNG, rename the storage path to .jpg
  const newPath = isPng ? storagePath.replace(/\.png$/i, ".jpg") : storagePath;

  return { buffer, contentType: "image/jpeg", newPath };
}

async function uploadResized(
  bucket: string,
  storagePath: string,
  buffer: Buffer,
  contentType: string,
  originalPath: string
): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, buffer, { contentType, upsert: true });
  if (error) throw new Error(`Upload failed (${storagePath}): ${error.message}`);

  // If the path changed (PNG → JPG), delete the old file and update DB URLs
  if (storagePath !== originalPath) {
    const { error: delErr } = await supabase.storage.from(bucket).remove([originalPath]);
    if (delErr) console.warn(`  ⚠ Could not delete old PNG (${originalPath}): ${delErr.message}`);

    // Update any question_images rows whose URL ends with the old path
    const { error: dbErr } = await supabase
      .from("question_images")
      .update({ image_url: supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl })
      .like("image_url", `%${originalPath}`);
    if (dbErr) console.warn(`  ⚠ Could not update DB URL for (${originalPath}): ${dbErr.message}`);
  }
}

async function main() {
  const bucket = "quiz-images";
  console.log(`\nListing files in "${bucket}"...`);
  const files = await listAllFiles(bucket);
  console.log(`Found ${files.length} file(s)\n`);

  let resized = 0;
  let skipped = 0;
  let failed = 0;

  for (const filePath of files) {
    const ext = filePath.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "png"].includes(ext ?? "")) {
      console.log(`  skip  ${filePath} (not an image)`);
      skipped++;
      continue;
    }

    process.stdout.write(`  resize  ${filePath} ... `);
    try {
      const original = await downloadFile(bucket, filePath);
      const originalKB = Math.round(original.byteLength / 1024);

      const { buffer, contentType, newPath } = await resizeImage(original, filePath);
      const newKB = Math.round(buffer.byteLength / 1024);

      await uploadResized(bucket, newPath, buffer, contentType, filePath);
      console.log(`${originalKB} KB → ${newKB} KB (${Math.round((1 - newKB / originalKB) * 100)}% smaller)`);
      resized++;
    } catch (err) {
      console.error(`FAILED — ${(err as Error).message}`);
      failed++;
    }
  }

  console.log(`\n✅ Done. Resized: ${resized}  Skipped: ${skipped}  Failed: ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
