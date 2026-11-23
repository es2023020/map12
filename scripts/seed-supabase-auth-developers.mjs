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

const supabase = createClient(supabaseUrl, secretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const developers = JSON.parse(readFileSync("./src/data/developers-list.json", "utf-8"));
console.log(`Loaded ${developers.length} developers from src/data/developers-list.json`);

async function seed() {
  console.log("Checking existing Supabase auth users...");
  const { data: userList, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) {
    console.error("Failed to list users:", listErr.message);
    process.exit(1);
  }

  const existingEmails = new Set(userList.users.map(u => u.email?.toLowerCase()));
  console.log(`Currently registered users in Supabase Auth: ${existingEmails.size}`);

  let createdCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  // Process in batches of 5 to avoid rate-limiting
  const batchSize = 5;
  for (let i = 0; i < developers.length; i += batchSize) {
    const chunk = developers.slice(i, i + batchSize);
    await Promise.all(
      chunk.map(async (d) => {
        const name = d.name;
        const slug = d.slug;
        const email = `portal.${slug}@propertyatlas.eg`.toLowerCase();
        const cleanSlug = slug.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase();
        const accessCode = `DEV_${cleanSlug}_2026`;

        if (existingEmails.has(email)) {
          skippedCount++;
          return;
        }

        const { data, error } = await supabase.auth.admin.createUser({
          email,
          password: accessCode,
          email_confirm: true,
          user_metadata: {
            role: "developer",
            developer_slug: slug,
            developer_name: name,
            access_code: accessCode,
            compounds_count: d.count,
            portal_url: `/dashboard/developer?slug=${slug}`
          }
        });

        if (error) {
          console.error(`Error creating ${email}:`, error.message);
          errorCount++;
        } else {
          createdCount++;
        }
      })
    );
    process.stdout.write(`Progress: ${Math.min(i + batchSize, developers.length)}/${developers.length} processed...\r`);
  }

  console.log(`\n=== Supabase Auth Seed Summary ===`);
  console.log(`- Created: ${createdCount} accounts in Supabase Auth`);
  console.log(`- Already existed: ${skippedCount}`);
  console.log(`- Errors: ${errorCount}`);

  const { data: finalUsers } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  console.log(`Total active accounts now in Supabase Auth: ${finalUsers?.users?.length || 0}`);
}

seed().catch(err => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
