import { default as makeWASocket, useMultiFileAuthState } from "@whiskeysockets/baileys";
import pino from "pino";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const AUTH_DIR = path.join(ROOT, "services", "whatsapp-listener", "session");
const CONFIG_FILE = path.join(ROOT, "config", "whatsapp-groups.json");

async function main() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  const sock = makeWASocket({
    logger: pino({ level: "silent" }) as any,
    printQRInTerminal: false,
    auth: state,
    browser: ["PropertyAtlas-Inventory", "Chrome", "1.0.0"],
    syncFullHistory: true, // Request full history from WhatsApp!
  });

  sock.ev.on("creds.update", saveCreds);

  const groupsConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8")).groups || {};

  sock.ev.on("connection.update", (update) => {
    if (update.connection === "open") {
      console.log("✅ Connection opened! Listening for history and recent group messages...");
    }
  });

  sock.ev.on("messaging-history.set" as any, ({ chats, contacts, messages, isLatest }: any) => {
    console.log(`📦 Received messaging-history.set: ${chats?.length || 0} chats, ${messages?.length || 0} messages (isLatest: ${isLatest})`);
    if (messages && messages.length > 0) {
      for (const m of messages) {
        const jid = m.key?.remoteJid;
        if (!jid || !jid.endsWith("@g.us")) continue;
        const groupInfo = groupsConfig[jid];
        if (!groupInfo) continue;

        const body = m.message?.conversation || m.message?.extendedTextMessage?.text || m.message?.documentMessage?.caption || "";
        const doc = m.message?.documentMessage;
        if (doc) {
          console.log(`  📄 [HISTORY DOC] Group: ${groupInfo.name} | File: ${doc.fileName}`);
        } else if (body && body.length > 10) {
          console.log(`  💬 [HISTORY MSG] Group: ${groupInfo.name} | Text: ${body.slice(0, 60).replace(/\n/g, ' ')}`);
        }
      }
    }
  });

  sock.ev.on("messages.set", ({ messages }: any) => {
    console.log(`📦 Received messages.set: ${messages.length} messages`);
  });

  // Keep alive for 25 seconds to gather historical streams
  setTimeout(() => {
    console.log("Discovery phase complete.");
    process.exit(0);
  }, 25000);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
