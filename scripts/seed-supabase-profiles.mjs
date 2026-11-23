import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";

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

const supabaseUrl = process.env.SUPABASE_URL || "https://gezknhoosfyvpdhxfqmu.supabase.co";
const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, secretKey);

async function syncProfiles() {
  console.log("Fetching all users from Supabase Auth...");
  const { data: userList, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) {
    console.error("Failed to list users:", listErr.message);
    process.exit(1);
  }

  console.log(`Found ${userList.users.length} users in Supabase Auth. Syncing to public.profiles...`);

  const profiles = userList.users.map((u) => ({
    id: u.id,
    email: u.email,
    role: u.user_metadata?.role || "developer",
    full_name: u.user_metadata?.developer_name || u.email?.split("@")[0],
    developer_slug: u.user_metadata?.developer_slug || null,
    agency_name: u.user_metadata?.role === "developer" ? u.user_metadata?.developer_name : "Property Atlas Agency",
    created_at: u.created_at,
    updated_at: new Date().toISOString()
  }));

  const { data, error } = await supabase.from("profiles").upsert(profiles, { onConflict: "id" });
  if (error) {
    console.error("Profile sync error:", error.message);
  } else {
    console.log(`SUCCESS! Synced ${profiles.length} profiles to public.profiles!`);
  }
}

syncProfiles().catch(console.error);
