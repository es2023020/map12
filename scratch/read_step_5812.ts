import * as fs from "fs";
import * as path from "path";

const logPath =
  "C:\\Users\\LORD LAPTOP\\.gemini\\antigravity\\brain\\3490eb79-8870-45a2-9ba9-c2ffb32aaeb2\\.system_generated\\logs\\transcript_full.jsonl";

if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, "utf-8");
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    try {
      const obj = JSON.parse(line);
      if (obj.step_index === 5812) {
        console.log("Found step 5812! Length of content:", obj.content.length);
        // Write it to a file
        fs.writeFileSync("scratch/step_5812_full.txt", obj.content, "utf-8");
        console.log("Wrote full content to scratch/step_5812_full.txt");

        // Print it in chunks or list the projects found
        const text = obj.content;
        const matches = text.match(/Project Name:\s*([^\n(]+)/gi);
        if (matches) {
          console.log("Projects found in prompt:");
          matches.forEach((m) => console.log("- " + m.replace(/Project Name:\s*/i, "").trim()));
        }
      }
    } catch (e) {
      // ignore
    }
  }
} else {
  console.log("Log path does not exist");
}
