import pypdf
from pathlib import Path

ROOT = Path(r"d:\map12")
SOURCE_DIR = ROOT / "data" / "Company profile"
OUT_FILE = ROOT / "scripts" / "profiles_summary_extracted.txt"

def extract_summary():
    print("Extracting summary of company profiles...")
    if not SOURCE_DIR.exists():
        print("Source directory not found!")
        return

    files = list(SOURCE_DIR.glob("*.pdf"))
    output_lines = []

    for f in files:
        output_lines.append("="*80)
        output_lines.append(f"FILE: {f.name}")
        output_lines.append("="*80)
        try:
            reader = pypdf.PdfReader(f)
            num_pages = len(reader.pages)
            output_lines.append(f"Total pages: {num_pages}")
            # Extract first 5 pages or all if less
            pages_to_extract = min(5, num_pages)
            for page_num in range(pages_to_extract):
                output_lines.append(f"\n--- Page {page_num+1} ---")
                text = reader.pages[page_num].extract_text()
                output_lines.append(text or "[No text found on this page]")
        except Exception as e:
            output_lines.append(f"Error reading PDF: {e}")
        output_lines.append("\n\n")

    with open(OUT_FILE, "w", encoding="utf-8") as f_out:
        f_out.write("\n".join(output_lines))
    print(f"Extracted summary to {OUT_FILE}")

if __name__ == "__main__":
    extract_summary()
