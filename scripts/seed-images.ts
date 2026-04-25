/**
 * Uploads all images and PDFs to Supabase Storage, then seeds question_images
 * and updates styles with hero_image_url and style_guide_pdf_url.
 *
 * Usage: npx tsx scripts/seed-images.ts
 *
 * Buckets created automatically if they don't exist (requires service role key).
 */
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const FILES_DIR = path.join(process.cwd(), "files");
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Maps a filename (lowercased, no extension) fragment to a style ID
const STYLE_KEYWORD_MAP: Record<string, string> = {
  bohemian: "bohemian",
  boho: "bohemian",
  coastal: "coastal",
  "french country": "french-country",
  "french-country": "french-country",
  industrial: "industrial",
  japandi: "japandi",
  "mid-century": "mid-century-modern",
  "mid century": "mid-century-modern",
  "modern farmhouse": "modern-farmhouse",
  "modern farm house": "modern-farmhouse",
  "modern-farmhouse": "modern-farmhouse",
  transitional: "transitional",
  indutrial: "industrial", // typo in source filename
};

function detectStyleFromFilename(filename: string): string | null {
  const lower = filename.toLowerCase();
  // Sort by length descending so longer matches win (e.g. "french country" before "country")
  const sorted = Object.entries(STYLE_KEYWORD_MAP).sort(
    ([a], [b]) => b.length - a.length
  );
  for (const [keyword, styleId] of sorted) {
    if (lower.includes(keyword)) return styleId;
  }
  return null;
}

function slugifyFilename(filename: string): string {
  return filename.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
}

async function ensureBucket(
  name: string,
  isPublic: boolean
): Promise<void> {
  const { data: existing } = await supabase.storage.getBucket(name);
  if (!existing) {
    const { error } = await supabase.storage.createBucket(name, {
      public: isPublic,
    });
    if (error && !error.message.includes("already exists")) {
      throw new Error(`Failed to create bucket "${name}": ${error.message}`);
    }
    console.log(`✓ Created bucket: ${name}`);
  }
}

async function uploadFile(
  bucket: string,
  storagePath: string,
  localPath: string,
  retries = 3
): Promise<string> {
  const fileBuffer = fs.readFileSync(localPath);
  const ext = path.extname(localPath).toLowerCase();
  const contentType =
    ext === ".jpg" || ext === ".jpeg"
      ? "image/jpeg"
      : ext === ".png"
      ? "image/png"
      : ext === ".pdf"
      ? "application/pdf"
      : "application/octet-stream";

  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const { error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, fileBuffer, { contentType, upsert: true });
    if (!error) break;
    lastError = new Error(`Upload failed (${storagePath}): ${error.message}`);
    if (attempt < retries) await new Promise((r) => setTimeout(r, 1000 * attempt));
  }
  if (lastError) throw lastError;

  if (bucket === "style-guides") {
    // Private bucket — URL is served via signed URL at download time
    return storagePath;
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${storagePath}`;
}

// ─── Quiz Images ─────────────────────────────────────────────────────────────

const QUESTION_FOLDER_MAP: Record<string, number> = {
  "KIT Final": 1,
  "Living Room Final": 2,
  "Dining Room Final ": 3, // note trailing space in actual folder name
  "Bedroom Final": 4,
  "Bathroom Final": 5,
  "Office Final": 6,
  "Entry Way Final": 7,
  "Patio Final": 8,
  "Color Palette Final": 9,
  "Chair Final": 10,
  "Doorknob Final": 11,
};

async function uploadQuizImages() {
  console.log("\nUploading quiz images...");
  const imagesDir = path.join(FILES_DIR, "Images");
  const imageRecords: {
    question_id: number;
    style_id: string;
    image_url: string;
    alt_text: string;
  }[] = [];

  for (const [folderName, questionId] of Object.entries(QUESTION_FOLDER_MAP)) {
    const folderPath = path.join(imagesDir, folderName);
    if (!fs.existsSync(folderPath)) {
      console.warn(`  ⚠ Folder not found: ${folderName}`);
      continue;
    }

    const files = fs.readdirSync(folderPath).filter((f) =>
      [".jpg", ".jpeg", ".png"].includes(path.extname(f).toLowerCase())
    );

    // Track which styles we've already handled for this question (one image per style)
    const seenStyles = new Set<string>();

    for (const file of files) {
      const styleId = detectStyleFromFilename(file);
      if (!styleId) {
        console.warn(`  ⚠ Could not detect style for: ${file}`);
        continue;
      }
      if (seenStyles.has(styleId)) continue; // skip duplicates
      seenStyles.add(styleId);

      const slug = slugifyFilename(file);
      const storagePath = `q${questionId}/${slug}`;
      const localPath = path.join(folderPath, file);
      const url = await uploadFile("quiz-images", storagePath, localPath);

      imageRecords.push({
        question_id: questionId,
        style_id: styleId,
        image_url: url,
        alt_text: `${styleId} - question ${questionId}`,
      });
      process.stdout.write(".");
    }
  }

  console.log(`\n✓ Uploaded ${imageRecords.length} quiz images`);

  // Clear existing and re-insert
  await supabase.from("question_images").delete().neq("id", 0);
  const { error } = await supabase.from("question_images").insert(imageRecords);
  if (error) throw new Error(`question_images insert failed: ${error.message}`);
  console.log(`✓ Seeded ${imageRecords.length} question_image rows`);
}

// ─── Style Hero Images ────────────────────────────────────────────────────────

async function uploadStyleImages() {
  console.log("\nUploading style hero images...");
  const styleImagesDir = path.join(FILES_DIR, "Images", "Style Images");
  const files = fs.readdirSync(styleImagesDir).filter((f) =>
    [".jpg", ".jpeg", ".png"].includes(path.extname(f).toLowerCase())
  );

  for (const file of files) {
    const styleId = detectStyleFromFilename(file);
    if (!styleId) {
      console.warn(`  ⚠ Could not detect style for hero image: ${file}`);
      continue;
    }
    const slug = slugifyFilename(file);
    const url = await uploadFile(
      "style-images",
      `heroes/${slug}`,
      path.join(styleImagesDir, file)
    );
    const { error } = await supabase
      .from("styles")
      .update({ hero_image_url: url })
      .eq("id", styleId);
    if (error) console.warn(`  ⚠ Failed to set hero for ${styleId}: ${error.message}`);
    else process.stdout.write(".");
  }
  console.log("\n✓ Uploaded hero images");
}

// ─── PDFs ─────────────────────────────────────────────────────────────────────

const PDF_STYLE_MAP: Record<string, string> = {
  "Styled My Home - Bohemian Style Guide.pdf": "bohemian",
  "Styled My Home - Coastal Style Guide.pdf": "coastal",
  "Styled My Home - French Country style Guide.pdf": "french-country",
  "Styled My Home - Industrial Style Guide.pdf": "industrial",
  "Styled My Home - Japandi Style Guide.pdf": "japandi",
  "Styled My Home - Mid-Century Modern Style Guide.pdf": "mid-century-modern",
  "Styled My Home - Modern Farmhouse Style Guide-15.pdf": "modern-farmhouse",
  "Styled My Home - Transitional Style Guide.pdf": "transitional",
};

async function uploadPDFs() {
  console.log("\nUploading style guide PDFs...");
  const pdfDir = path.join(FILES_DIR, "Style_Guides");

  for (const [filename, styleId] of Object.entries(PDF_STYLE_MAP)) {
    const localPath = path.join(pdfDir, filename);
    if (!fs.existsSync(localPath)) {
      console.warn(`  ⚠ PDF not found: ${filename}`);
      continue;
    }
    const slug = slugifyFilename(filename);
    // Returns the storage path (private bucket, served via signed URL)
    const storagePath = await uploadFile("style-guides", `single/${slug}`, localPath);
    const { error } = await supabase
      .from("styles")
      .update({ style_guide_pdf_url: storagePath })
      .eq("id", styleId);
    if (error) console.warn(`  ⚠ Failed to set PDF path for ${styleId}: ${error.message}`);
    else process.stdout.write(".");
  }

  // Upload the master guide separately (not tied to a style)
  const masterFile = "Styled My Home Style And Design Guide.pdf";
  const masterPath = path.join(pdfDir, masterFile);
  if (fs.existsSync(masterPath)) {
    await uploadFile(
      "style-guides",
      `complete/${slugifyFilename(masterFile)}`,
      masterPath
    );
    console.log("\n✓ Uploaded master style guide");
  }

  console.log("✓ Uploaded individual style guide PDFs");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  await ensureBucket("quiz-images", true);
  await ensureBucket("style-images", true);
  await ensureBucket("style-guides", false);

  await uploadQuizImages();
  await uploadStyleImages();
  await uploadPDFs();

  console.log("\n✅ All done! Your Supabase project is fully seeded.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
