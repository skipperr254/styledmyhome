/**
 * Seeds the Supabase database with styles and quiz questions.
 * Run after seed-images.ts so that image URLs are already in the DB.
 * Usage: npx tsx scripts/seed-data.ts
 */
import { createClient } from "@supabase/supabase-js";
import { STYLES } from "../lib/data/styles";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const QUESTIONS = [
  { id: 1, question_text: "Which kitchen style can you envision yourself in?" },
  { id: 2, question_text: "Which living room style speaks to you?" },
  {
    id: 3,
    question_text:
      "Which dining room style can you see yourself enjoying meals in?",
  },
  {
    id: 4,
    question_text:
      "Which primary bedroom style would make you feel most at home?",
  },
  { id: 5, question_text: "Which primary bathroom style appeals to you most?" },
  {
    id: 6,
    question_text: "Which home office do you see yourself most productive in?",
  },
  { id: 7, question_text: "Which entryway style would welcome you home?" },
  {
    id: 8,
    question_text: "Which outdoor patio style would be your perfect retreat?",
  },
  { id: 9, question_text: "Which color palette do you prefer?" },
  { id: 10, question_text: "Which chair would you like to relax in?" },
  { id: 11, question_text: "Which door knob would you open to your home?" },
];

async function seedStyles() {
  console.log("Seeding styles...");
  const { error } = await supabase.from("styles").upsert(
    STYLES.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      history: s.history,
      key_characteristics: s.key_characteristics,
      design_tips: s.design_tips,
      color_palette: s.color_palette,
      metal_finishes: s.metal_finishes,
      wood_finishes: s.wood_finishes,
      display_order: s.display_order,
    })),
    { onConflict: "id" },
  );
  if (error) throw new Error(`Styles seed failed: ${error.message}`);
  console.log(`✓ Seeded ${STYLES.length} styles`);
}

async function seedQuestions() {
  console.log("Seeding questions...");
  const { error } = await supabase
    .from("questions")
    .upsert(QUESTIONS, { onConflict: "id" });
  if (error) throw new Error(`Questions seed failed: ${error.message}`);
  console.log(`✓ Seeded ${QUESTIONS.length} questions`);
}

async function main() {
  await seedStyles();
  await seedQuestions();
  console.log(
    "\nDone! Run seed-images.ts next to upload images and link them.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
