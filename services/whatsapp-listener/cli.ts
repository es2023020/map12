import { startWhatsAppListener } from "./client";
import { processIncomingDocument, processIncomingTextMessage } from "../../scripts/inventory-engine/orchestrator";
import path from "path";

const args = process.argv.slice(2);
const command = args[0] || "help";

async function main() {
  switch (command) {
    case "listen":
      await startWhatsAppListener();
      break;

    case "process-file":
      const filePath = args[1];
      if (!filePath) {
        console.error("Usage: npx tsx services/whatsapp-listener/cli.ts process-file <path_to_file> [developer_slug]");
        process.exit(1);
      }
      const devSlug = args[2];
      const filename = path.basename(filePath);
      const res = await processIncomingDocument(path.resolve(filePath), filename, "", devSlug);
      console.log("\n--- RESULT ---");
      console.log(res.formattedMarkdown);
      break;

    case "process-text":
      const text = args.slice(1).join(" ");
      if (!text) {
        console.error("Usage: npx tsx services/whatsapp-listener/cli.ts process-text <message_text>");
        process.exit(1);
      }
      const textRes = await processIncomingTextMessage(text);
      console.log("\n--- RESULT ---");
      console.log(textRes.formattedMarkdown);
      break;

    default:
      console.log(`
Property Atlas - Inventory Automation CLI
Commands:
  listen                                    Start background WhatsApp Web listener
  process-file <path> [developer_slug]      Manually process an Excel or PDF inventory file
  process-text <message>                    Test parsing a WhatsApp text announcement
      `);
      break;
  }
}

main().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
