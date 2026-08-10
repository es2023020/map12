import * as fs from "fs";
import * as path from "path";

const logPath =
  "C:\\Users\\LORD LAPTOP\\.gemini\\antigravity\\brain\\3490eb79-8870-45a2-9ba9-c2ffb32aaeb2\\.system_generated\\logs\\transcript.jsonl";

if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, "utf-8");
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.type === "USER_INPUT" || obj.source === "USER_EXPLICIT") {
        console.log(`\n--- STEP ${obj.step_index} (${obj.type}) ---`);
        console.log(obj.content);
      }
    } catch (e) {
      // ignore
    }
  }
} else {
  console.log("Log path does not exist");
}
