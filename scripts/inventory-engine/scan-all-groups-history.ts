import {
  default as makeWASocket,
  useMultiFileAuthState,
  downloadMediaMessage,
} from "@whiskeysockets/baileys";
import pino from "pino";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  processIncomingDocument,
  processIncomingTextMessage,
  triggerAppAvailabilitySync,
} from "./orchestrator";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const AUTH_DIR = path.join(ROOT, "services", "whatsapp-listener", "session");
const CONFIG_FILE = path.join(ROOT, "config", "whatsapp-groups.json");
const INBOX_DIR = path.join(ROOT, "data", "availability", "inbox");

async function main() {
  console.log("==================================================");
  console.log("   Property Atlas - Historical Groups Sync Scanner   ");
  console.log("==================================================");

  if (!fs.existsSync(AUTH_DIR)) {
    console.error("Session directory not found.");
    process.exit(1);
  }

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  const sock = makeWASocket({
    logger: pino({ level: "silent" }) as any,
    printQRInTerminal: false,
    auth: state,
    browser: ["PropertyAtlas-HistorySync", "Chrome", "1.0.0"],
    syncFullHistory: true,
  });

  sock.ev.on("creds.update", saveCreds);

  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  const groupsConfig = config.groups || {};
  const devGroups = Object.entries(groupsConfig).filter(
    ([jid, g]: [string, any]) => g.developer_slug && g.developer_slug !== "general-developer"
  );

  console.log(`📡 Connected. Tracking ${devGroups.length} official developer groups...\n`);

  // Map to hold messages collected per group: jid -> message[]
  const collectedMessages = new Map<string, any[]>();
  let historyReceived = false;

  const handleMessage = (msg: any) => {
    if (!msg || !msg.message) return;
    const jid = msg.key?.remoteJid;
    if (!jid || !jid.endsWith("@g.us")) return;

    if (!collectedMessages.has(jid)) {
      collectedMessages.set(jid, []);
    }
    collectedMessages.get(jid)!.push(msg);
  };

  sock.ev.on("messaging-history.set" as any, ({ messages }: any) => {
    historyReceived = true;
    console.log(`📥 Received history payload: ${messages?.length || 0} messages.`);
    if (messages) {
      for (const m of messages) handleMessage(m);
    }
  });

  sock.ev.on("messages.set", ({ messages }: any) => {
    console.log(`📥 Received messages.set: ${messages.length} messages.`);
    for (const m of messages) handleMessage(m);
  });

  sock.ev.on("messages.upsert", ({ messages }: any) => {
    for (const m of messages) handleMessage(m);
  });

  // Wait 15 seconds to collect history stream from WhatsApp
  console.log("⏳ Syncing recent chat history across developer groups (waiting 15s)...");
  await new Promise((r) => setTimeout(r, 15000));

  console.log(`\n🔍 Scanned all channels. Found active message history in ${collectedMessages.size} groups.\n`);

  let processedCount = 0;
  let textActionsCount = 0;
  let docCount = 0;

  // Process latest messages for each developer group
  for (const [jid, groupInfo] of devGroups as [string, any][]) {
    const messages = collectedMessages.get(jid) || [];
    if (messages.length === 0) continue;

    // Sort by timestamp descending
    messages.sort((a, b) => {
      const tA = Number(a.messageTimestamp || 0);
      const tB = Number(b.messageTimestamp || 0);
      return tB - tA;
    });

    const devSlug = groupInfo.developer_slug;
    const devName = groupInfo.developer_name;

    // Find the most recent document or actionable text
    let latestDocMsg: any = null;
    let latestTextMsg: any = null;

    for (const m of messages) {
      if (m.message?.documentMessage && !latestDocMsg) {
        const doc = m.message.documentMessage;
        const fn = (doc.fileName || "").toLowerCase();
        if (fn.endsWith(".xlsx") || fn.endsWith(".xls") || fn.endsWith(".pdf") || fn.endsWith(".csv")) {
          latestDocMsg = m;
        }
      }

      const caption = m.message?.documentMessage?.caption || m.message?.imageMessage?.caption || "";
      const text = m.message?.conversation || m.message?.extendedTextMessage?.text || caption || "";
      if (text && text.trim().length > 10 && !latestTextMsg) {
        latestTextMsg = { msg: m, text: text.trim() };
      }

      if (latestDocMsg && latestTextMsg) break;
    }

    // 1. If recent document found, process it
    if (latestDocMsg) {
      const doc = latestDocMsg.message.documentMessage;
      const filename = doc.fileName || `doc_${Date.now()}.bin`;
      console.log(`📄 [LATEST DOC] Group "${groupInfo.name}" (${devName}): ${filename}`);

      try {
        const buffer = await downloadMediaMessage(latestDocMsg, "buffer", {});
        const todayStr = new Date().toISOString().slice(0, 10);
        const targetDir = path.join(INBOX_DIR, todayStr);
        fs.mkdirSync(targetDir, { recursive: true });

        const safeFilename = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const targetPath = path.join(targetDir, safeFilename);
        fs.writeFileSync(targetPath, buffer);

        const res = await processIncomingDocument(targetPath, filename, doc.caption || "", devSlug);
        console.log(`   -> Result: ${res.message}`);
        docCount++;
      } catch (err: any) {
        console.log(`   -> Doc download/parse note: ${err.message}`);
      }
    }

    // 2. If actionable text found, process it
    if (latestTextMsg) {
      try {
        const res = await processIncomingTextMessage(latestTextMsg.text, devSlug);
        if (res.success) {
          console.log(`💬 [ACTIONABLE TEXT] Group "${groupInfo.name}" (${devName}):`);
          console.log(`   Snippet: "${latestTextMsg.text.slice(0, 70).replace(/\n/g, " ")}..."`);
          console.log(`   -> ${res.message}`);
          textActionsCount++;
        }
      } catch (err: any) {
        // quiet ignore
      }
    }

    processedCount++;
  }

  console.log("\n==================================================");
  console.log(`Sync Complete:`);
  console.log(`  Groups Checked:   ${devGroups.length}`);
  console.log(`  Groups with Msgs: ${collectedMessages.size}`);
  console.log(`  Documents Found:  ${docCount}`);
  console.log(`  Text Updates:     ${textActionsCount}`);
  console.log("==================================================");

  // Trigger app compilation
  triggerAppAvailabilitySync();

  setTimeout(() => {
    process.exit(0);
  }, 1000);
}

main().catch((err) => {
  console.error("Execution error:", err);
  process.exit(1);
});
