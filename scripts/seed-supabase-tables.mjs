import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";

// Load .env.local if present
if (existsSync(".env.local")) {
  const envContent = readFileSync(".env.local", "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [k, ...v] = trimmed.split("=");
      if (!process.env[k.trim()]) {
        process.env[k.trim()] = v.join("=").trim();
      }
    }
  }
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "https://gezknhoosfyvpdhxfqmu.supabase.co";
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!secretKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY in environment or .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, secretKey);

const developers = JSON.parse(readFileSync("./src/data/developers-list.json", "utf-8"));

async function seedTables() {
  console.log("Checking if public.developer_accounts table is ready...");
  const { error: testErr } = await supabase.from("developer_accounts").select("slug").limit(1);
  if (testErr) {
    console.error("Table not found or not created yet:", testErr.message);
    console.log("Please run the SQL migration in your Supabase SQL editor first!");
    process.exit(1);
  }

  console.log(`Seeding ${developers.length} developers into public.developer_accounts...`);
  const records = developers.map((d) => {
    const cleanSlug = d.slug.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
    return {
      slug: d.slug,
      name: d.name,
      email: `portal.${d.slug}@propertyatlas.eg`.toLowerCase(),
      access_code: `DEV_${cleanSlug}_2026`,
      status: "active",
      website: `https://${d.slug}.com`,
      phone: "+20 10 0000 0000",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });

  const { data, error } = await supabase.from("developer_accounts").upsert(records, { onConflict: "slug" });
  if (error) {
    console.error("Upsert error:", error.message);
  } else {
    console.log("SUCCESS! Seeded public.developer_accounts with all developers!");
  }
}

seedTables().catch(console.error);
