import { default as makeWASocket, useMultiFileAuthState } from "@whiskeysockets/baileys";
import pino from "pino";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const AUTH_DIR = path.join(ROOT, "services", "whatsapp-listener", "session");
const CONFIG_FILE = path.join(ROOT, "config", "whatsapp-groups.json");
const MATRIX_FILE = path.join(ROOT, "config", "developers-matrix.json");

async function main() {
  console.log("==================================================");
  console.log("   WhatsApp Participating Groups Discovery Tool   ");
  console.log("==================================================");

  if (!fs.existsSync(AUTH_DIR)) {
    console.error("Session directory not found. Please run 'npm run inventory:listen' first.");
    process.exit(1);
  }

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  const sock = makeWASocket({
    logger: pino({ level: "silent" }) as any,
    printQRInTerminal: false,
    auth: state,
    browser: ["PropertyAtlas-Inventory", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection } = update;

    if (connection === "open") {
      console.log("✅ Authenticated with WhatsApp. Querying participating groups...\n");

      try {
        const groups = await sock.groupFetchAllParticipating();
        const groupList = Object.values(groups) as any[];

        console.log(`📱 Found ${groupList.length} total groups joined on this WhatsApp account.\n`);

        const matrix = fs.existsSync(MATRIX_FILE) ? JSON.parse(fs.readFileSync(MATRIX_FILE, "utf8")) : [];

        let currentConfig: any = { groups: {} };
        if (fs.existsSync(CONFIG_FILE)) {
          try {
            currentConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
            currentConfig.groups = currentConfig.groups || {};
          } catch {}
        }

        let matched = 0;
        const groupsReport: any[] = [];

        for (const g of groupList) {
          const subject = g.subject || "Unnamed Group";
          const jid = g.id;
          const participantCount = g.participants ? g.participants.length : 0;
          const subLower = subject.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF\s-]/g, " ");

          // Match against matrix
          let matchedDev: any = null;
          for (const m of matrix) {
            const devNameLower = m.developer_name.toLowerCase();
            const groupDisplayLower = m.group_display_name.toLowerCase();
            const slugLower = m.canonical_slug.replace(/-/g, " ");

            if (
              subLower.includes(devNameLower) ||
              subLower.includes(groupDisplayLower) ||
              subLower.includes(slugLower) ||
              m.projects.some((p: string) => subLower.includes(p.replace(/-/g, " ")))
            ) {
              matchedDev = m;
              break;
            }
          }

          if (matchedDev) {
            matched++;
            console.log(`  🎯 [MATCHED] "${subject}" (${participantCount} members) -> Developer: ${matchedDev.developer_name} (${matchedDev.canonical_slug})`);
            currentConfig.groups[jid] = {
              name: subject,
              developer_slug: matchedDev.canonical_slug,
              developer_name: matchedDev.developer_name,
              is_master_group: true,
              auto_apply: false,
              participant_count: participantCount,
            };
          } else {
            console.log(`  💬 [GROUP] "${subject}" (${participantCount} members) [JID: ${jid}]`);
            if (!currentConfig.groups[jid]) {
              currentConfig.groups[jid] = {
                name: subject,
                developer_slug: "general-developer",
                developer_name: subject,
                is_master_group: false,
                auto_apply: false,
                participant_count: participantCount,
              };
            }
          }

          groupsReport.push({
            jid,
            subject,
            participantCount,
            developerSlug: matchedDev ? matchedDev.canonical_slug : null,
            developerName: matchedDev ? matchedDev.developer_name : null,
          });
        }

        currentConfig.last_synced_at = new Date().toISOString();
        currentConfig.total_groups = groupList.length;
        currentConfig.matched_count = matched;

        fs.writeFileSync(CONFIG_FILE, JSON.stringify(currentConfig, null, 2), "utf8");
        console.log(`\n🎉 Synchronized ${groupList.length} groups into config/whatsapp-groups.json (${matched} mapped to developers).`);

        // Close cleanly
        setTimeout(() => {
          process.exit(0);
        }, 1500);
      } catch (err: any) {
        console.error("Failed to fetch groups:", err.message);
        process.exit(1);
      }
    }
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
