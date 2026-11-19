import {
  default as makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  downloadMediaMessage,
  proto,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import qrcode from "qrcode-terminal";
import pino from "pino";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { processIncomingDocument, processIncomingTextMessage } from "../../scripts/inventory-engine/orchestrator";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const AUTH_DIR = path.join(__dirname, "session");
const CONFIG_FILE = path.join(ROOT, "config", "whatsapp-groups.json");
const INBOX_DIR = path.join(ROOT, "data", "availability", "inbox");

interface GroupConfig {
  name: string;
  developer_slug: string;
  developer_name: string;
  is_master_group: boolean;
  auto_apply?: boolean;
}

function loadGroupsConfig(): Record<string, GroupConfig> {
  if (!fs.existsSync(CONFIG_FILE)) return {};
  try {
    const data = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    return data.groups || {};
  } catch {
    return {};
  }
}

export async function startWhatsAppListener() {
  console.log("==================================================");
  console.log("   Property Atlas - WhatsApp Inventory Sync Bot   ");
  console.log("==================================================");

  if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });
  if (!fs.existsSync(INBOX_DIR)) fs.mkdirSync(INBOX_DIR, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  const sock = makeWASocket({
    logger: pino({ level: "silent" }) as any,
    printQRInTerminal: false,
    auth: state,
    browser: ["PropertyAtlas-Inventory", "Chrome", "1.0.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("\n[WhatsApp Auth] Please scan this QR code with WhatsApp on your phone:\n");
      qrcode.generate(qr, { small: true });
      console.log("\nInstructions: Open WhatsApp on phone -> Linked Devices -> Link a Device.\n");
    }

    if (connection === "close") {
      const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(`Connection closed due to: ${lastDisconnect?.error}, reconnecting: ${shouldReconnect}`);
      if (shouldReconnect) {
        startWhatsAppListener();
      } else {
        console.log("Session logged out. Delete 'services/whatsapp-listener/session' and restart.");
      }
    } else if (connection === "open") {
      console.log("✅ WhatsApp connection successfully established and listening for updates!");
    }
  });

  // Handle incoming messages (both live notifications and backlog append events)
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    for (const msg of messages) {
      if (!msg.message) continue;
      const jid = msg.key.remoteJid;
      if (!jid || !jid.endsWith("@g.us")) continue; // Only listen to groups

      const groupsConfig = loadGroupsConfig();
      const groupInfo = groupsConfig[jid];
      const devSlug = groupInfo?.developer_slug;
      const groupName = groupInfo?.developer_name || groupInfo?.name || jid.split("@")[0];
      const sender = msg.pushName || "Broker";

      const messageType = Object.keys(msg.message)[0];
      const caption = msg.message.documentMessage?.caption || msg.message.imageMessage?.caption || "";
      const textBody =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        caption ||
        "";

      // Real-time visibility: log every incoming group message
      if (textBody && !msg.message.documentMessage) {
        const preview = textBody.length > 90 ? textBody.slice(0, 90).replace(/\r?\n/g, " ") + "..." : textBody.replace(/\r?\n/g, " ");
        console.log(`[WA] 👥 [${groupName}] ${sender}: ${preview}`);
      }

      // 1. Handle Document Attachments (.xlsx, .xls, .pdf, .csv)
      if (msg.message.documentMessage) {
        const doc = msg.message.documentMessage;
        const filename = doc.fileName || `doc_${Date.now()}.bin`;
        const ext = path.extname(filename).toLowerCase();

        if ([".xlsx", ".xls", ".pdf", ".csv"].includes(ext)) {
          console.log(`\n📥 [DOCUMENT ARRIVED] '${filename}' from group [${groupName}]`);
          try {
            const buffer = await downloadMediaMessage(msg, "buffer", {});
            const todayStr = new Date().toISOString().slice(0, 10);
            const targetDir = path.join(INBOX_DIR, todayStr);
            fs.mkdirSync(targetDir, { recursive: true });

            const safeFilename = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
            const targetPath = path.join(targetDir, safeFilename);
            fs.writeFileSync(targetPath, buffer);

            // Execute automated processing pipeline
            const result = await processIncomingDocument(targetPath, filename, caption, devSlug);
            console.log(result.formattedMarkdown);
          } catch (err: any) {
            console.error(`Error processing attachment:`, err.message);
          }
        }
      }

      // 2. Handle Text Messages in Group (Sold Out announcements, flash releases)
      if (textBody && !msg.message.documentMessage) {
        try {
          const result = await processIncomingTextMessage(textBody, devSlug);
          if (result.success) {
            console.log(`\n🎯 [INVENTORY AUTO-UPDATE APPLIED]\n${result.formattedMarkdown}\n`);
          }
        } catch (err: any) {
          console.error(`Error processing text message:`, err.message);
        }
      }
    }
  });
}
